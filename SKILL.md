---
name: assembly-battle-developer
description: "Expert guidance for developing the Assembly Battle game. Use when writing new assembly interpreter instructions, designing 3D machine components in React Three Fiber, or adding new puzzle levels."
---

# Assembly Battle Developer Skill

## Overview

This skill provides the procedural knowledge required to extend the Assembly Battle engine. It covers the custom assembly dialect, the 3D visualization patterns, and the game's state management.

## Custom Assembly Dialect

The virtual machine uses a simplified 16-bit-style instruction set.

### Instruction Set Reference
- **MOV dest, src:** Copy value. `src` can be an immediate or a register.
- **ADD/SUB/MUL dest, src:** Arithmetic operations. Result is stored in `dest`.
- **CMP a, b:** Compares values and sets the `zero` flag.
- **JMP/JE/JNE label:** Control flow based on the `zero` flag.
- **PUSH/POP reg:** Stack operations using the `SP` register.
- **HLT reg:** Halts execution and pushes `reg` value to the `output` array.

### Cycle Costs
- `MUL`: 3 cycles.
- `POP`: 2 cycles.
- Most others: 1 cycle.
- `HLT`: 0 cycles.

## 3D Visualization Patterns (React Three Fiber)

The machine internals are visualized on a virtual "Motherboard."

### Key Components
- **DIPChip:** Represents registers (AX, BX, CX, DX). Features an amber 7-segment LED display.
- **SIMMSlot:** Represents memory modules. Uses blue/red LEDs for read/write feedback.
- **StackSocket:** A vertical glass tower for visualizing PUSH/POP operations.
- **DataTrace:** Animated golden pulses representing data flow along PCB traces.

## Game State Management (Zustand)

The `useGameStore` is the single source of truth.
- **Phase:** `editing` -> `executing` -> `win`/`lose`/`victory`.
- **Machine:** Contains the live `registers`, `memory`, `stack`, and `pc`.
- **Battle Log:** A history of recent combat events.

## Level Design Protocol

When creating a new level in `src/levels/levels.js`:
1. **Define Inputs:** Set the starting values for `AX` and `BX`.
2. **Set Budget:** Calculate the minimum cycles required for an efficient solution and add a small buffer.
3. **Define Skill Match:** Update `src/interpreter/skillMatcher.js` with a matching logic that validates the player's `output`.
4. **Provide Hint:** The `hint` field should contain the puzzle description as a comment block in the editor.

## Verification Workflow

1. **Unit Tests:** `npm run test` (Vitest).
2. **Visual Check:** `npx playwright screenshot ...` to verify 3D rendering.
3. **Build:** `npm run build` to ensure no production errors.
