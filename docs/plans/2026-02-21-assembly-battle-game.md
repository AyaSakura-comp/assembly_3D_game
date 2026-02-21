# Assembly Battle Game Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a web-based 3D puzzle battle game where players write assembly programs to attack bosses, with a live CPU visualization in React Three Fiber.

**Architecture:** The app is a single-page React app with a split layout — a 3D scene (React Three Fiber) showing CPU internals on the left, and a Monaco code editor on the right. A custom JS assembly interpreter executes instructions one frame at a time, updating Zustand state which drives both the 3D visualization and the HUD. Each level defines a set of valid skill patterns (expected outputs) and a boss with HP and attack timer.

**Tech Stack:** Vite, React, React Three Fiber, @react-three/drei, Monaco Editor (@monaco-editor/react), Zustand, Tailwind CSS, Vitest

---

### Task 1: Scaffold the project

**Files:**
- Create: `package.json` (via Vite)
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `tailwind.config.js`
- Create: `vite.config.js`

**Step 1: Create the Vite + React project**

Run:
```bash
npm create vite@latest . -- --template react
npm install
```

**Step 2: Install dependencies**

```bash
npm install three @react-three/fiber @react-three/drei zustand @monaco-editor/react
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react jsdom
npx tailwindcss init -p
```

**Step 3: Configure Tailwind**

Edit `tailwind.config.js`:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 4: Configure Vitest**

Edit `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

**Step 5: Verify dev server starts**

Run: `npm run dev`
Expected: App running at http://localhost:5173

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React project with dependencies"
```

---

### Task 2: Assembly interpreter — core execution engine

**Files:**
- Create: `src/interpreter/interpreter.js`
- Create: `src/interpreter/interpreter.test.js`

This is the heart of the game. It takes assembly source code (string), parses it into instructions, and executes them against a machine state (registers, memory, stack).

**Machine state shape:**
```js
{
  registers: { AX: 0, BX: 0, CX: 0, DX: 0, SP: 16 },
  memory: new Array(16).fill(0),
  stack: [],
  pc: 0,           // program counter (index into instructions)
  halted: false,
  error: null,
  output: [],      // values HLT'd with (for skill matching)
  cyclesUsed: 0,
}
```

**Instruction set and cycle costs:**
| Instruction | Syntax | Cost |
|-------------|--------|------|
| MOV | `MOV AX, 5` or `MOV AX, BX` | 1 |
| ADD | `ADD AX, BX` | 1 |
| SUB | `SUB AX, BX` | 1 |
| MUL | `MUL AX, BX` | 3 |
| CMP | `CMP AX, BX` | 1 |
| JMP | `JMP label` | 1 |
| JE  | `JE label` | 1 |
| JNE | `JNE label` | 1 |
| PUSH | `PUSH AX` | 1 |
| POP | `POP AX` | 2 |
| HLT | `HLT AX` | 0 |

**Step 1: Write failing tests**

Create `src/interpreter/interpreter.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { createMachine, parseProgram, stepInstruction, runProgram } from './interpreter'

describe('createMachine', () => {
  it('initializes with zeroed registers', () => {
    const m = createMachine()
    expect(m.registers.AX).toBe(0)
    expect(m.registers.BX).toBe(0)
    expect(m.stack).toEqual([])
    expect(m.halted).toBe(false)
  })
})

describe('parseProgram', () => {
  it('parses MOV instruction', () => {
    const instructions = parseProgram('MOV AX, 5')
    expect(instructions).toEqual([{ op: 'MOV', args: ['AX', '5'], label: null }])
  })

  it('parses labels', () => {
    const instructions = parseProgram('loop:\nJMP loop')
    expect(instructions[0].label).toBe('loop')
    expect(instructions[1]).toEqual({ op: 'JMP', args: ['loop'], label: null })
  })

  it('ignores comments and blank lines', () => {
    const instructions = parseProgram('; comment\n\nMOV AX, 1')
    expect(instructions.length).toBe(1)
  })
})

describe('stepInstruction', () => {
  it('MOV register with immediate', () => {
    const m = createMachine()
    const instructions = parseProgram('MOV AX, 42')
    const next = stepInstruction(m, instructions)
    expect(next.registers.AX).toBe(42)
    expect(next.pc).toBe(1)
    expect(next.cyclesUsed).toBe(1)
  })

  it('MOV register to register', () => {
    const m = { ...createMachine(), registers: { ...createMachine().registers, BX: 7 } }
    const instructions = parseProgram('MOV AX, BX')
    const next = stepInstruction(m, instructions)
    expect(next.registers.AX).toBe(7)
  })

  it('ADD two registers', () => {
    let m = createMachine()
    m = { ...m, registers: { ...m.registers, AX: 3, BX: 4 } }
    const instructions = parseProgram('ADD AX, BX')
    const next = stepInstruction(m, instructions)
    expect(next.registers.AX).toBe(7)
  })

  it('PUSH and POP', () => {
    let m = createMachine()
    m = { ...m, registers: { ...m.registers, AX: 99 } }
    const push = parseProgram('PUSH AX')
    const pop = parseProgram('POP BX')
    let m2 = stepInstruction(m, push)
    expect(m2.stack).toEqual([99])
    let m3 = stepInstruction({ ...m2, pc: 0 }, pop)
    expect(m3.registers.BX).toBe(99)
    expect(m3.stack).toEqual([])
  })

  it('HLT sets halted and records output', () => {
    let m = { ...createMachine(), registers: { ...createMachine().registers, AX: 5 } }
    const instructions = parseProgram('HLT AX')
    const next = stepInstruction(m, instructions)
    expect(next.halted).toBe(true)
    expect(next.output).toEqual([5])
  })

  it('sets error on unknown instruction', () => {
    const m = createMachine()
    const instructions = parseProgram('FOO AX')
    const next = stepInstruction(m, instructions)
    expect(next.error).toMatch(/unknown instruction/i)
  })
})

describe('runProgram', () => {
  it('computes a + b', () => {
    const program = `
      MOV AX, 3
      MOV BX, 4
      ADD AX, BX
      HLT AX
    `
    const result = runProgram(program, createMachine())
    expect(result.output).toEqual([7])
    expect(result.halted).toBe(true)
  })

  it('respects cycle budget', () => {
    const program = `MOV AX, 1\nMOV BX, 2\nMOV CX, 3\nHLT AX`
    const result = runProgram(program, createMachine(), { cycleBudget: 2 })
    expect(result.error).toMatch(/budget/i)
  })
})
```

**Step 2: Run tests to confirm they fail**

Run: `npx vitest run src/interpreter/interpreter.test.js`
Expected: All tests FAIL (interpreter.js does not exist)

**Step 3: Implement the interpreter**

Create `src/interpreter/interpreter.js`:
```js
const REGISTERS = ['AX', 'BX', 'CX', 'DX', 'SP']
const CYCLE_COSTS = {
  MOV: 1, ADD: 1, SUB: 1, MUL: 3, CMP: 1,
  JMP: 1, JE: 1, JNE: 1, PUSH: 1, POP: 2, HLT: 0,
}

export function createMachine() {
  return {
    registers: { AX: 0, BX: 0, CX: 0, DX: 0, SP: 16 },
    memory: new Array(16).fill(0),
    stack: [],
    pc: 0,
    halted: false,
    error: null,
    output: [],
    cyclesUsed: 0,
    flags: { zero: false },
  }
}

export function parseProgram(source) {
  const lines = source.split('\n')
  const instructions = []
  for (let raw of lines) {
    const line = raw.replace(/;.*$/, '').trim()
    if (!line) continue
    let label = null
    let rest = line
    if (line.includes(':')) {
      const parts = line.split(':')
      label = parts[0].trim()
      rest = parts[1].trim()
    }
    if (!rest) {
      instructions.push({ op: null, args: [], label })
      continue
    }
    const tokens = rest.split(/[\s,]+/).filter(Boolean)
    const op = tokens[0].toUpperCase()
    const args = tokens.slice(1)
    instructions.push({ op, args, label })
  }
  return instructions.filter(i => i.op !== null || i.label !== null)
}

function resolveValue(val, registers) {
  if (REGISTERS.includes(val)) return registers[val]
  const n = parseInt(val, 10)
  if (!isNaN(n)) return n
  return null
}

function labelIndex(instructions, name) {
  return instructions.findIndex(i => i.label === name)
}

export function stepInstruction(machine, instructions) {
  if (machine.halted || machine.error) return machine
  if (machine.pc >= instructions.length) {
    return { ...machine, error: 'Program ended without HLT' }
  }

  const instr = instructions[machine.pc]
  if (!instr.op) return { ...machine, pc: machine.pc + 1 }

  const { op, args } = instr
  const cost = CYCLE_COSTS[op]
  if (cost === undefined) {
    return { ...machine, error: `Unknown instruction: ${op}` }
  }

  let regs = { ...machine.registers }
  let stack = [...machine.stack]
  let flags = { ...machine.flags }
  let output = [...machine.output]
  let halted = false
  let pc = machine.pc + 1

  switch (op) {
    case 'MOV': {
      const val = resolveValue(args[1], regs)
      regs[args[0]] = val
      break
    }
    case 'ADD': {
      regs[args[0]] = regs[args[0]] + resolveValue(args[1], regs)
      break
    }
    case 'SUB': {
      regs[args[0]] = regs[args[0]] - resolveValue(args[1], regs)
      break
    }
    case 'MUL': {
      regs[args[0]] = regs[args[0]] * resolveValue(args[1], regs)
      break
    }
    case 'CMP': {
      flags.zero = regs[args[0]] === resolveValue(args[1], regs)
      break
    }
    case 'JMP': {
      const idx = labelIndex(instructions, args[0])
      if (idx === -1) return { ...machine, error: `Label not found: ${args[0]}` }
      pc = idx
      break
    }
    case 'JE': {
      if (flags.zero) {
        const idx = labelIndex(instructions, args[0])
        if (idx === -1) return { ...machine, error: `Label not found: ${args[0]}` }
        pc = idx
      }
      break
    }
    case 'JNE': {
      if (!flags.zero) {
        const idx = labelIndex(instructions, args[0])
        if (idx === -1) return { ...machine, error: `Label not found: ${args[0]}` }
        pc = idx
      }
      break
    }
    case 'PUSH': {
      stack.push(resolveValue(args[0], regs))
      break
    }
    case 'POP': {
      if (stack.length === 0) return { ...machine, error: 'Stack underflow' }
      regs[args[0]] = stack.pop()
      break
    }
    case 'HLT': {
      output.push(resolveValue(args[0], regs))
      halted = true
      break
    }
  }

  return {
    ...machine,
    registers: regs,
    stack,
    flags,
    output,
    halted,
    pc,
    cyclesUsed: machine.cyclesUsed + cost,
  }
}

export function runProgram(source, machine, { cycleBudget = Infinity } = {}) {
  const instructions = parseProgram(source)
  let state = { ...machine }
  let steps = 0
  while (!state.halted && !state.error && steps < 10000) {
    state = stepInstruction(state, instructions)
    if (state.cyclesUsed > cycleBudget) {
      return { ...state, error: 'Cycle budget exceeded' }
    }
    steps++
  }
  return state
}
```

**Step 4: Run tests to confirm they pass**

Run: `npx vitest run src/interpreter/interpreter.test.js`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/interpreter/
git commit -m "feat: add assembly interpreter with full instruction set and tests"
```

---

### Task 3: Skill pattern matcher

**Files:**
- Create: `src/interpreter/skillMatcher.js`
- Create: `src/interpreter/skillMatcher.test.js`

Skills are defined as `{ name, description, damage, match: (output) => boolean }`. The matcher checks if program output triggers any skill.

**Step 1: Write failing tests**

Create `src/interpreter/skillMatcher.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { matchSkill, SKILLS } from './skillMatcher'

describe('matchSkill', () => {
  it('matches add beam when output is sum', () => {
    // Level 1: inputs a=3, b=4 → output [7]
    const skill = matchSkill([7], { a: 3, b: 4 })
    expect(skill).not.toBeNull()
    expect(skill.name).toBe('Add Beam')
  })

  it('returns null when output does not match any skill', () => {
    const skill = matchSkill([99], { a: 3, b: 4 })
    expect(skill).toBeNull()
  })

  it('matches fibonacci strike', () => {
    const skill = matchSkill([1, 1, 2, 3, 5, 8], {})
    expect(skill.name).toBe('Fibonacci Strike')
  })
})
```

**Step 2: Run tests to confirm they fail**

Run: `npx vitest run src/interpreter/skillMatcher.test.js`
Expected: FAIL

**Step 3: Implement skill matcher**

Create `src/interpreter/skillMatcher.js`:
```js
export const SKILLS = [
  {
    name: 'Add Beam',
    description: 'Compute a + b',
    damage: 20,
    match: (output, inputs) => output.length === 1 && output[0] === inputs.a + inputs.b,
  },
  {
    name: 'Fibonacci Strike',
    description: 'Output the first 6 Fibonacci numbers',
    damage: 60,
    match: (output) => {
      const fib = [1, 1, 2, 3, 5, 8]
      return output.length === 6 && fib.every((v, i) => v === output[i])
    },
  },
  {
    name: 'Sort Slash',
    description: 'Output an array sorted ascending',
    damage: 40,
    match: (output) => {
      if (output.length < 2) return false
      for (let i = 0; i < output.length - 1; i++) {
        if (output[i] > output[i + 1]) return false
      }
      return true
    },
  },
]

export function matchSkill(output, inputs) {
  for (const skill of SKILLS) {
    if (skill.match(output, inputs)) return skill
  }
  return null
}
```

**Step 4: Run tests to confirm they pass**

Run: `npx vitest run src/interpreter/skillMatcher.test.js`
Expected: All PASS

**Step 5: Commit**

```bash
git add src/interpreter/skillMatcher.js src/interpreter/skillMatcher.test.js
git commit -m "feat: add skill pattern matcher"
```

---

### Task 4: Zustand game store

**Files:**
- Create: `src/store/gameStore.js`
- Create: `src/store/gameStore.test.js`

Central state for the whole game. Drives both the 3D scene and the HUD.

**Step 1: Write failing tests**

Create `src/store/gameStore.test.js`:
```js
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './gameStore'

// Reset store between tests
beforeEach(() => {
  useGameStore.getState().reset()
})

describe('gameStore', () => {
  it('initializes with correct defaults', () => {
    const s = useGameStore.getState()
    expect(s.playerHp).toBe(100)
    expect(s.bossHp).toBe(100)
    expect(s.phase).toBe('editing') // 'editing' | 'executing' | 'win' | 'lose'
    expect(s.machine).toBeDefined()
    expect(s.timer).toBe(30)
  })

  it('applyDamageToPlayer reduces playerHp', () => {
    useGameStore.getState().applyDamageToPlayer(20)
    expect(useGameStore.getState().playerHp).toBe(80)
  })

  it('applyDamageToBoss reduces bossHp', () => {
    useGameStore.getState().applyDamageToBoss(30)
    expect(useGameStore.getState().bossHp).toBe(70)
  })

  it('phase transitions to lose when playerHp <= 0', () => {
    useGameStore.getState().applyDamageToPlayer(100)
    expect(useGameStore.getState().phase).toBe('lose')
  })

  it('phase transitions to win when bossHp <= 0', () => {
    useGameStore.getState().applyDamageToBoss(100)
    expect(useGameStore.getState().phase).toBe('win')
  })
})
```

**Step 2: Run tests to confirm they fail**

Run: `npx vitest run src/store/gameStore.test.js`
Expected: FAIL

**Step 3: Implement the store**

Create `src/store/gameStore.js`:
```js
import { create } from 'zustand'
import { createMachine } from '../interpreter/interpreter'

const INITIAL = {
  playerHp: 100,
  bossHp: 100,
  phase: 'editing',
  machine: createMachine(),
  instructions: [],
  timer: 30,
  budget: 20,
  battleLog: [],
  currentLevel: 1,
  inputs: { a: 3, b: 4 },
}

export const useGameStore = create((set, get) => ({
  ...INITIAL,

  reset: () => set({ ...INITIAL, machine: createMachine() }),

  setMachine: (machine) => set({ machine }),
  setInstructions: (instructions) => set({ instructions }),
  setPhase: (phase) => set({ phase }),
  tickTimer: () => set((s) => ({ timer: Math.max(0, s.timer - 1) })),

  applyDamageToPlayer: (amount) => set((s) => {
    const playerHp = Math.max(0, s.playerHp - amount)
    return { playerHp, phase: playerHp <= 0 ? 'lose' : s.phase }
  }),

  applyDamageToBoss: (amount) => set((s) => {
    const bossHp = Math.max(0, s.bossHp - amount)
    return { bossHp, phase: bossHp <= 0 ? 'win' : s.phase }
  }),

  addLog: (message) => set((s) => ({
    battleLog: [...s.battleLog.slice(-9), message],
  })),
}))
```

**Step 4: Run tests to confirm they pass**

Run: `npx vitest run src/store/gameStore.test.js`
Expected: All PASS

**Step 5: Commit**

```bash
git add src/store/
git commit -m "feat: add Zustand game store with HP and phase management"
```

---

### Task 5: Main layout — HUD + split panel shell

**Files:**
- Create: `src/App.jsx`
- Create: `src/components/HUD.jsx`
- Create: `src/components/BattleLog.jsx`

Wire up the basic layout with Tailwind. No 3D or editor yet — just the skeleton.

**Step 1: Create HUD component**

Create `src/components/HUD.jsx`:
```jsx
import { useGameStore } from '../store/gameStore'

export function HUD() {
  const { playerHp, bossHp, timer, budget } = useGameStore()

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-900 text-green-400 font-mono text-sm border-b border-green-800">
      <div className="flex items-center gap-2">
        <span>Player HP:</span>
        <div className="w-32 h-3 bg-gray-700 rounded">
          <div className="h-3 bg-green-500 rounded" style={{ width: `${playerHp}%` }} />
        </div>
        <span>{playerHp}</span>
      </div>
      <div className="flex gap-6">
        <span>Timer: <span className={timer <= 5 ? 'text-red-400 animate-pulse' : ''}>{timer}s</span></span>
        <span>Budget: {budget} cycles</span>
      </div>
      <div className="flex items-center gap-2">
        <span>Boss HP:</span>
        <div className="w-32 h-3 bg-gray-700 rounded">
          <div className="h-3 bg-red-500 rounded" style={{ width: `${bossHp}%` }} />
        </div>
        <span>{bossHp}</span>
      </div>
    </div>
  )
}
```

**Step 2: Create BattleLog component**

Create `src/components/BattleLog.jsx`:
```jsx
import { useGameStore } from '../store/gameStore'

export function BattleLog() {
  const { battleLog } = useGameStore()
  return (
    <div className="bg-gray-950 border-t border-green-800 px-4 py-2 font-mono text-xs text-green-300 h-16 overflow-y-auto">
      {battleLog.map((msg, i) => <div key={i}>{msg}</div>)}
    </div>
  )
}
```

**Step 3: Wire up App.jsx**

Edit `src/App.jsx`:
```jsx
import { HUD } from './components/HUD'
import { BattleLog } from './components/BattleLog'

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-green-400">
      <HUD />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-green-800">
          {/* 3D scene goes here - Task 6 */}
          <div className="h-full flex items-center justify-center text-green-700 font-mono">
            [ 3D Machine Visualization ]
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          {/* Editor goes here - Task 7 */}
          <div className="flex-1 flex items-center justify-center text-green-700 font-mono">
            [ Code Editor ]
          </div>
          <button className="m-4 px-6 py-2 bg-green-700 hover:bg-green-600 text-black font-mono font-bold rounded">
            Execute
          </button>
        </div>
      </div>
      <BattleLog />
    </div>
  )
}
```

**Step 4: Verify visually**

Run: `npm run dev`
Expected: Dark terminal-style layout with HUD at top, split panels, battle log at bottom

**Step 5: Commit**

```bash
git add src/
git commit -m "feat: add main layout with HUD, battle log, and split panel shell"
```

---

### Task 6: 3D machine visualization (React Three Fiber)

**Files:**
- Create: `src/components/MachineScene.jsx`
- Create: `src/components/RegisterCube.jsx`
- Create: `src/components/MemoryGrid.jsx`
- Create: `src/components/StackTower.jsx`

**Step 1: Create RegisterCube**

Create `src/components/RegisterCube.jsx`:
```jsx
import { useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export function RegisterCube({ name, value, position, active }) {
  const meshRef = useRef()
  useFrame(() => {
    if (active && meshRef.current) {
      meshRef.current.material.emissiveIntensity =
        0.5 + 0.5 * Math.sin(Date.now() / 150)
    } else if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.1
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={active ? '#00ff88' : '#004422'}
          emissive={active ? '#00ff88' : '#002211'}
          emissiveIntensity={0.1}
        />
      </mesh>
      <Text position={[0, 0, 0.6]} fontSize={0.25} color="#00ff88">{name}</Text>
      <Text position={[0, -0.35, 0.6]} fontSize={0.2} color="#ffffff">{value}</Text>
    </group>
  )
}
```

**Step 2: Create MemoryGrid**

Create `src/components/MemoryGrid.jsx`:
```jsx
import { Text } from '@react-three/drei'

export function MemoryGrid({ memory }) {
  return (
    <group position={[-3, -2, 0]}>
      {memory.map((val, i) => (
        <group key={i} position={[(i % 8) * 0.8, -Math.floor(i / 8) * 0.8, 0]}>
          <mesh>
            <boxGeometry args={[0.7, 0.7, 0.2]} />
            <meshStandardMaterial color={val !== 0 ? '#003388' : '#111133'} />
          </mesh>
          <Text position={[0, 0, 0.15]} fontSize={0.15} color="#88aaff">{val}</Text>
        </group>
      ))}
    </group>
  )
}
```

**Step 3: Create StackTower**

Create `src/components/StackTower.jsx`:
```jsx
import { Text } from '@react-three/drei'

export function StackTower({ stack }) {
  return (
    <group position={[4, -1, 0]}>
      <Text position={[0, stack.length * 0.7 + 0.5, 0]} fontSize={0.2} color="#ffaa00">STACK</Text>
      {stack.map((val, i) => (
        <group key={i} position={[0, i * 0.7, 0]}>
          <mesh>
            <boxGeometry args={[1, 0.6, 0.6]} />
            <meshStandardMaterial color="#553300" />
          </mesh>
          <Text position={[0, 0, 0.35]} fontSize={0.2} color="#ffaa00">{val}</Text>
        </group>
      ))}
    </group>
  )
}
```

**Step 4: Create MachineScene**

Create `src/components/MachineScene.jsx`:
```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { RegisterCube } from './RegisterCube'
import { MemoryGrid } from './MemoryGrid'
import { StackTower } from './StackTower'
import { useGameStore } from '../store/gameStore'

const REGISTER_NAMES = ['AX', 'BX', 'CX', 'DX']
const REGISTER_POSITIONS = [[-3, 1, 0], [-1, 1, 0], [1, 1, 0], [3, 1, 0]]

export function MachineScene() {
  const { machine } = useGameStore()

  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={1} color="#00ff88" />
      <Grid args={[20, 20]} cellColor="#003322" sectionColor="#005533" position={[0, -3, 0]} />

      {REGISTER_NAMES.map((name, i) => (
        <RegisterCube
          key={name}
          name={name}
          value={machine.registers[name]}
          position={REGISTER_POSITIONS[i]}
          active={false}
        />
      ))}

      <MemoryGrid memory={machine.memory} />
      <StackTower stack={machine.stack} />

      <OrbitControls makeDefault />
    </Canvas>
  )
}
```

**Step 5: Add MachineScene to App.jsx**

Edit `src/App.jsx` — replace the placeholder div in the left panel:
```jsx
import { MachineScene } from './components/MachineScene'
// ...
<div className="flex-1 border-r border-green-800">
  <MachineScene />
</div>
```

**Step 6: Verify visually**

Run: `npm run dev`
Expected: Left panel shows 3D register cubes, memory grid, and stack tower. Camera is orbitable.

**Step 7: Commit**

```bash
git add src/components/
git commit -m "feat: add 3D machine visualization with registers, memory, and stack"
```

---

### Task 7: Monaco code editor panel

**Files:**
- Create: `src/components/EditorPanel.jsx`

**Step 1: Create the editor panel**

Create `src/components/EditorPanel.jsx`:
```jsx
import Editor from '@monaco-editor/react'
import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { parseProgram, runProgram } from '../interpreter/interpreter'
import { matchSkill } from '../interpreter/skillMatcher'

const STARTER_CODE = `; Level 1: Compute a + b
; a is in AX, b is in BX
; HLT with the result

MOV AX, 3
MOV BX, 4
ADD AX, BX
HLT AX
`

export function EditorPanel() {
  const [code, setCode] = useState(STARTER_CODE)
  const { machine, inputs, budget, applyDamageToBoss, applyDamageToPlayer, addLog, phase } = useGameStore()

  function handleExecute() {
    if (phase !== 'editing') return
    const result = runProgram(code, { ...machine, registers: { ...machine.registers, AX: inputs.a, BX: inputs.b } }, { cycleBudget: budget })

    if (result.error) {
      applyDamageToPlayer(10)
      addLog(`❌ Error: ${result.error} (-10 HP)`)
      return
    }

    const skill = matchSkill(result.output, inputs)
    if (skill) {
      applyDamageToBoss(skill.damage)
      addLog(`✨ ${skill.name}! Boss takes ${skill.damage} damage!`)
    } else {
      applyDamageToPlayer(5)
      addLog(`❌ No skill matched. Output: [${result.output.join(', ')}] (-5 HP)`)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val ?? '')}
          options={{ fontSize: 14, fontFamily: 'monospace', minimap: { enabled: false } }}
        />
      </div>
      <div className="p-3 border-t border-green-800 bg-gray-900">
        <button
          onClick={handleExecute}
          disabled={phase !== 'editing'}
          className="w-full py-2 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 text-black font-mono font-bold rounded"
        >
          ▶ Execute
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Wire EditorPanel into App.jsx**

Edit `src/App.jsx` — replace code editor placeholder:
```jsx
import { EditorPanel } from './components/EditorPanel'
// ...
<div className="w-1/2 flex flex-col">
  <EditorPanel />
</div>
```
Remove the standalone `<button>` that was there before.

**Step 3: Verify the full flow**

Run: `npm run dev`
Expected:
- Type assembly code in editor
- Click Execute
- If output matches `a + b` → "Add Beam! Boss takes 20 damage!" in battle log
- Boss HP bar drops in HUD

**Step 4: Commit**

```bash
git add src/components/EditorPanel.jsx src/App.jsx
git commit -m "feat: add Monaco editor panel with execute and skill matching"
```

---

### Task 8: Boss attack timer

**Files:**
- Modify: `src/App.jsx`
- Create: `src/hooks/useBossTimer.js`

The boss attacks every N seconds. If the timer hits 0, the boss deals damage and resets.

**Step 1: Create the timer hook**

Create `src/hooks/useBossTimer.js`:
```js
import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function useBossTimer() {
  const { tickTimer, timer, applyDamageToPlayer, addLog, phase, setPhase } = useGameStore()

  useEffect(() => {
    if (phase !== 'editing') return
    const id = setInterval(() => {
      const currentTimer = useGameStore.getState().timer
      if (currentTimer <= 1) {
        applyDamageToPlayer(15)
        addLog('💥 Boss attacks! -15 HP')
        useGameStore.setState({ timer: 30 })
      } else {
        useGameStore.setState((s) => ({ timer: s.timer - 1 }))
      }
    }, 1000)
    return () => clearInterval(id)
  }, [phase])
}
```

**Step 2: Add hook to App.jsx**

Edit `src/App.jsx`:
```jsx
import { useBossTimer } from './hooks/useBossTimer'

export default function App() {
  useBossTimer()
  // ... rest of component
}
```

**Step 3: Add win/lose overlay to App.jsx**

Add inside App's return, wrapping everything:
```jsx
const { phase, reset } = useGameStore()
// ...
{phase === 'win' && (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-green-400 font-mono z-50">
    <div className="text-4xl mb-4">✅ PROGRAM COMPLETE</div>
    <div className="text-xl mb-8">Boss defeated!</div>
    <button onClick={reset} className="px-8 py-3 bg-green-700 text-black font-bold rounded">Play Again</button>
  </div>
)}
{phase === 'lose' && (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-red-400 font-mono z-50">
    <div className="text-4xl mb-4">💀 SYSTEM CRASH</div>
    <div className="text-xl mb-8">Player HP reached 0</div>
    <button onClick={reset} className="px-8 py-3 bg-red-700 text-black font-bold rounded">Retry</button>
  </div>
)}
```

**Step 4: Verify**

Run: `npm run dev`
Expected: Boss attacks every 30 seconds, win/lose overlays appear correctly

**Step 5: Commit**

```bash
git add src/hooks/ src/App.jsx
git commit -m "feat: add boss attack timer and win/lose overlays"
```

---

### Task 9: Live step-by-step execution visualization

**Files:**
- Modify: `src/components/EditorPanel.jsx`
- Modify: `src/components/MachineScene.jsx`
- Modify: `src/store/gameStore.js`

When Execute is clicked, run one instruction per animation frame and update machine state in the store so the 3D scene animates.

**Step 1: Add stepExecution action to store**

Edit `src/store/gameStore.js` — add to the store:
```js
setInstructions: (instructions) => set({ instructions }),
stepMachine: () => set((s) => {
  if (s.machine.halted || s.machine.error) return s
  const next = stepInstruction(s.machine, s.instructions)
  return { machine: next }
}),
```
Also import `stepInstruction` at the top of the file.

**Step 2: Modify EditorPanel to drive step-by-step execution**

Edit `src/components/EditorPanel.jsx` — update `handleExecute`:
```jsx
import { parseProgram } from '../interpreter/interpreter'
import { useRef } from 'react'

// Inside component:
const rafRef = useRef(null)
const { setInstructions, stepMachine, setPhase, machine, ... } = useGameStore()

function handleExecute() {
  if (phase !== 'editing') return
  const instructions = parseProgram(code)
  // Seed inputs
  useGameStore.setState((s) => ({
    machine: { ...s.machine, registers: { ...s.machine.registers, AX: inputs.a, BX: inputs.b } },
    instructions,
    phase: 'executing',
  }))

  function step() {
    const current = useGameStore.getState().machine
    if (current.halted || current.error || current.cyclesUsed > budget) {
      // Done — evaluate result
      const result = current
      if (result.error || result.cyclesUsed > budget) {
        applyDamageToPlayer(10)
        addLog(`❌ Error: ${result.error ?? 'budget exceeded'} (-10 HP)`)
      } else {
        const skill = matchSkill(result.output, inputs)
        if (skill) {
          applyDamageToBoss(skill.damage)
          addLog(`✨ ${skill.name}! Boss takes ${skill.damage} damage!`)
        } else {
          applyDamageToPlayer(5)
          addLog(`❌ No skill matched. Output: [${result.output.join(', ')}] (-5 HP)`)
        }
      }
      useGameStore.setState({ phase: 'editing', machine: createMachine() })
      return
    }
    useGameStore.getState().stepMachine()
    rafRef.current = requestAnimationFrame(step)
  }
  rafRef.current = requestAnimationFrame(step)
}
```

**Step 3: Highlight active register in MachineScene**

The active register is whichever one the current instruction writes to. For simplicity, highlight based on last changed register — compare machine state across renders.

Edit `src/components/MachineScene.jsx`:
```jsx
import { useRef } from 'react'

// Inside component:
const prevRegs = useRef(machine.registers)
const activeReg = REGISTER_NAMES.find(n => machine.registers[n] !== prevRegs.current[n]) ?? null
prevRegs.current = machine.registers

// Pass active={activeReg === name} to each RegisterCube
```

**Step 4: Verify animation**

Run: `npm run dev`
Expected: When Execute is clicked, register cubes pulse one at a time as each instruction runs, then skill fires

**Step 5: Commit**

```bash
git add src/
git commit -m "feat: step-by-step animated execution with live 3D register highlighting"
```

---

### Task 10: Instruction reference panel + hints

**Files:**
- Create: `src/components/InstructionRef.jsx`
- Modify: `src/components/EditorPanel.jsx`

A collapsible panel showing all instructions with their cycle costs and a hint button.

**Step 1: Create InstructionRef**

Create `src/components/InstructionRef.jsx`:
```jsx
import { useState } from 'react'

const INSTRUCTIONS = [
  { op: 'MOV', syntax: 'MOV AX, 5', cost: 1, desc: 'Copy value into register' },
  { op: 'ADD', syntax: 'ADD AX, BX', cost: 1, desc: 'AX = AX + BX' },
  { op: 'SUB', syntax: 'SUB AX, BX', cost: 1, desc: 'AX = AX - BX' },
  { op: 'MUL', syntax: 'MUL AX, BX', cost: 3, desc: 'AX = AX * BX' },
  { op: 'CMP', syntax: 'CMP AX, BX', cost: 1, desc: 'Compare, sets zero flag' },
  { op: 'JMP', syntax: 'JMP label', cost: 1, desc: 'Jump to label' },
  { op: 'JE',  syntax: 'JE label',  cost: 1, desc: 'Jump if equal (zero flag)' },
  { op: 'JNE', syntax: 'JNE label', cost: 1, desc: 'Jump if not equal' },
  { op: 'PUSH', syntax: 'PUSH AX', cost: 1, desc: 'Push register to stack' },
  { op: 'POP',  syntax: 'POP AX',  cost: 2, desc: 'Pop stack into register' },
  { op: 'HLT',  syntax: 'HLT AX',  cost: 0, desc: 'Halt and output register' },
]

export function InstructionRef() {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-green-800 font-mono text-xs">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-3 py-1 text-green-600 hover:text-green-400"
      >
        {open ? '▼' : '▶'} Instruction Reference
      </button>
      {open && (
        <div className="px-3 pb-2 max-h-40 overflow-y-auto">
          {INSTRUCTIONS.map(i => (
            <div key={i.op} className="flex gap-4 py-0.5 text-green-300">
              <span className="w-24 text-yellow-400">{i.syntax}</span>
              <span className="w-8 text-gray-500">{i.cost}c</span>
              <span>{i.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Add InstructionRef to EditorPanel**

Edit `src/components/EditorPanel.jsx` — add below the editor, above the Execute button:
```jsx
import { InstructionRef } from './InstructionRef'
// ...
<InstructionRef />
```

**Step 3: Verify**

Run: `npm run dev`
Expected: Collapsible instruction reference at the bottom of the editor panel

**Step 4: Commit**

```bash
git add src/components/InstructionRef.jsx src/components/EditorPanel.jsx
git commit -m "feat: add collapsible instruction reference panel"
```

---

### Task 11: Final polish and smoke test

**Step 1: Run all tests**

```bash
npx vitest run
```
Expected: All tests PASS

**Step 2: Manual smoke test checklist**
- [ ] App loads without console errors
- [ ] HUD shows player HP, boss HP, timer, budget
- [ ] Editor has starter code for level 1
- [ ] Executing correct `a + b` → "Add Beam" fires, boss HP drops
- [ ] Executing wrong code → player takes damage, error logged
- [ ] Boss attacks every 30 seconds, HP drops
- [ ] Boss HP → 0: "PROGRAM COMPLETE" overlay appears
- [ ] Player HP → 0: "SYSTEM CRASH" overlay appears
- [ ] Reset button works
- [ ] 3D scene renders registers, memory, stack
- [ ] Registers pulse during execution
- [ ] Instruction reference panel opens/closes

**Step 3: Build for production**

```bash
npm run build
```
Expected: `dist/` folder created with no errors

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: assembly battle game v1 complete"
```
