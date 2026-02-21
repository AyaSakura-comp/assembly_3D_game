# Assembly Battle Game — Design Document

**Date:** 2026-02-21
**Stack:** Vite + React + React Three Fiber + Monaco Editor + Zustand + Tailwind CSS

---

## Concept

A web-based 3D puzzle battle game where players write assembly programs to attack bosses. The 3D scene visualizes the internals of a virtual CPU (registers, memory, stack) executing the player's code in real-time. The assembly language theme teaches players how machines work through constrained, high-stakes gameplay.

---

## Core Game Loop

```
Player enters battle
  ↓
Boss attacks on a timer (countdown visible)
  ↓
Player writes assembly program in Monaco Editor
  ↓
Player hits "Execute" → machine runs program step-by-step (visualized in 3D)
  ↓
  ├── Output matches a skill pattern → fires attack on boss
  ├── Execution error (bad instruction / wrong result) → player takes damage
  └── Timer hits zero before execution → boss attacks, player takes damage
  ↓
Repeat until boss HP = 0 (win) or player HP = 0 (lose)
```

### Instruction Cost System
Each instruction has a cycle cost. The player has a budget per turn — they cannot write unlimited instructions. This forces efficiency and teaches real CPU concepts (instruction cost, optimization).

### Skill Patterns (Examples)
| Output | Skill | Damage |
|--------|-------|--------|
| `a + b` correctly | Add Beam | Medium |
| `[1,1,2,3,5,8]` (Fibonacci) | Fibonacci Strike | High |
| Sorted array | Sort Slash | AoE |

---

## Level Progression

| Level | Task | New Concepts Introduced |
|-------|------|------------------------|
| 1 | Compute `a + b` | MOV, ADD, registers |
| 2 | Compute `a * b` (no MUL) | Loops, counters |
| 3 | Find max of array | Branching, JMP, CMP |
| 4 | Fibonacci series | Nested logic, optimization |
| 5+ | Boss-specific challenges | Full instruction set |

---

## Architecture & Components

### Tech Stack
- **Vite + React** — project scaffold
- **React Three Fiber + Drei** — 3D machine visualization
- **Monaco Editor** — assembly code input (VSCode editor)
- **Zustand** — global game state (player HP, boss HP, timer, level)
- **Tailwind CSS** — HUD, health bars, skill panel UI

### Screen Layout
```
┌─────────────────────────────────────────────┐
│  Player HP ████████░░   Boss HP ████░░░░░░  │  ← HUD
│  Timer: 12s              Budget: 20 cycles  │
├──────────────────┬──────────────────────────┤
│                  │                          │
│   3D Machine     │   Monaco Code Editor     │
│   Visualization  │   (assembly input)       │
│   (registers,    │                          │
│   memory, stack) │  [ Execute ]             │
│                  │                          │
├──────────────────┴──────────────────────────┤
│  Skill log: "Fibonacci Strike! -80 HP"      │  ← Battle log
└─────────────────────────────────────────────┘
```

### Custom Assembly Interpreter (pure JS)
- **Instruction set:** `MOV`, `ADD`, `SUB`, `MUL`, `CMP`, `JMP`, `JE`, `JNE`, `PUSH`, `POP`, `HLT`
- **Registers:** `AX`, `BX`, `CX`, `DX`, `SP` (stack pointer)
- **Memory:** Small array (16 slots)
- **Execution:** One instruction per animation frame so 3D visualization updates live

---

## 3D Machine Visualization

The 3D scene visualizes a virtual CPU. Players watch their program execute live.

### Scene Components
- **Registers** — floating labeled cubes (AX, BX, CX, DX). Pulse/glow on value change
- **Memory** — grid of cells on a "floor"; active cells light up on read/write
- **Stack** — vertical tower of blocks that grows/shrinks with PUSH/POP
- **Program Counter** — glowing cursor moving through the instruction list
- **Execution trail** — particle effect or beam showing data flow between components

### Boss Placement
- Boss floats on the opposite side of the 3D space from the machine
- Player attack: projectile shoots from the machine toward the boss
- Boss attack: incoming red beams/projectiles aimed at the machine

### Camera
- Orbiting camera (player can rotate to inspect the machine)
- Auto-focuses on active components during execution

---

## Error Handling & Feedback

### Execution Errors (player takes damage)
- Invalid instruction → red flash on editor line + machine sparks/smoke effect
- Wrong output (no skill match) → "No match" message + small HP loss
- Budget exceeded → program halts mid-execution, no attack fires

### Boss Attack Feedback
- Timer countdown pulses red in final 3 seconds
- Boss attack animation → screen shake + player HP drops
- Player HP = 0 → "SYSTEM CRASH" screen with retry option

### Success Feedback
- Correct output → skill name in big text ("FIBONACCI STRIKE!")
- Projectile animation fires toward boss
- Boss hit animation + HP bar drops

### Learning Aids (especially early levels)
- Hint button reveals expected output format
- After losing, show a correct solution
- Collapsible instruction reference panel (all instructions + cycle costs)
