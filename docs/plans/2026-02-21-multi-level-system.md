# Multi-Level System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the single-level game with 10 progressively harder levels, each requiring the player to write assembly code that produces a specific output to defeat the boss in one hit, then auto-advance to the next level.

**Architecture:** Extract level definitions into a `src/levels/levels.js` data file. Each level defines its puzzle description, inputs, required skill, and cycle budget. The game store gains a `nextLevel` action that advances `currentLevel`, resets boss HP, and loads new inputs/budget. The EditorPanel shows a puzzle-description comment (no solution) as its starter code. The win overlay becomes a "LEVEL CLEAR" screen that advances rather than just resetting. The skill matcher gains new skills to match the new levels.

**Tech Stack:** Vite, React 19, Zustand, custom assembly interpreter, Vitest

---

### Task 1: Define all 10 levels and new skills

**Files:**
- Create: `src/levels/levels.js`
- Modify: `src/interpreter/skillMatcher.js`
- Modify: `src/interpreter/skillMatcher.test.js`

**Step 1: Add new skills to skillMatcher.js**

Replace the entire contents of `src/interpreter/skillMatcher.js`:

```js
export const SKILLS = [
  {
    name: 'Add Beam',
    description: 'Compute AX + BX',
    damage: 100,
    match: (output, inputs) => output.length === 1 && output[0] === inputs.a + inputs.b,
  },
  {
    name: 'Sub Strike',
    description: 'Compute AX - BX',
    damage: 100,
    match: (output, inputs) => output.length === 1 && output[0] === inputs.a - inputs.b,
  },
  {
    name: 'Mul Cannon',
    description: 'Compute AX * BX',
    damage: 100,
    match: (output, inputs) => output.length === 1 && output[0] === inputs.a * inputs.b,
  },
  {
    name: 'Max Pulse',
    description: 'Output max(AX, BX)',
    damage: 100,
    match: (output, inputs) => output.length === 1 && output[0] === Math.max(inputs.a, inputs.b),
  },
  {
    name: 'Countdown Burst',
    description: 'Output AX, AX-1, ... down to 1',
    damage: 100,
    match: (output, inputs) => {
      const n = inputs.a
      if (output.length !== n) return false
      for (let i = 0; i < n; i++) {
        if (output[i] !== n - i) return false
      }
      return true
    },
  },
  {
    name: 'Fibonacci Strike',
    description: 'Output the first 6 Fibonacci numbers',
    damage: 100,
    match: (output) => {
      const fib = [1, 1, 2, 3, 5, 8]
      return output.length === 6 && fib.every((v, i) => v === output[i])
    },
  },
  {
    name: 'Stack Flip',
    description: 'Push AX then BX, pop both (outputs BX then AX)',
    damage: 100,
    match: (output, inputs) =>
      output.length === 2 && output[0] === inputs.b && output[1] === inputs.a,
  },
  {
    name: 'Triple Double',
    description: 'Output AX added to itself 3 times (AX * 3)',
    damage: 100,
    match: (output, inputs) => output.length === 1 && output[0] === inputs.a * 3,
  },
  {
    name: 'Branch Blast',
    description: 'Output the larger of AX and BX using a jump',
    damage: 100,
    match: (output, inputs) => output.length === 1 && output[0] === Math.max(inputs.a, inputs.b),
  },
  {
    name: 'Square Nuke',
    description: 'Output AX * AX',
    damage: 100,
    match: (output, inputs) => output.length === 1 && output[0] === inputs.a * inputs.a,
  },
]

export function matchSkill(output, inputs, levelSkillName) {
  const skill = SKILLS.find(s => s.name === levelSkillName)
  if (!skill) return null
  return skill.match(output, inputs) ? skill : null
}
```

Note: Each skill now does 100 damage (one-hit kill). `matchSkill` now takes the expected skill name for the current level, so only the correct answer wins.

**Step 2: Create `src/levels/levels.js`**

```js
export const LEVELS = [
  {
    level: 1,
    title: 'Addition',
    skillName: 'Add Beam',
    inputs: { a: 3, b: 4 },
    budget: 5,
    hint: `; Level 1: Compute AX + BX
; AX = 3, BX = 4
; HLT with the result
`,
  },
  {
    level: 2,
    title: 'Subtraction',
    skillName: 'Sub Strike',
    inputs: { a: 9, b: 4 },
    budget: 5,
    hint: `; Level 2: Compute AX - BX
; AX = 9, BX = 4
; HLT with the result
`,
  },
  {
    level: 3,
    title: 'Multiplication',
    skillName: 'Mul Cannon',
    inputs: { a: 6, b: 7 },
    budget: 8,
    hint: `; Level 3: Compute AX * BX
; AX = 6, BX = 7
; HLT with the result
`,
  },
  {
    level: 4,
    title: 'Maximum',
    skillName: 'Max Pulse',
    inputs: { a: 5, b: 8 },
    budget: 8,
    hint: `; Level 4: Output the larger of AX and BX
; AX = 5, BX = 8
; Hint: use CMP and JE/JNE
`,
  },
  {
    level: 5,
    title: 'Countdown',
    skillName: 'Countdown Burst',
    inputs: { a: 5, b: 0 },
    budget: 25,
    hint: `; Level 5: HLT AX, then AX-1, down to 1
; AX = 5  (count from 5 down to 1)
; Hint: use a loop with CMP and JNE
`,
  },
  {
    level: 6,
    title: 'Fibonacci',
    skillName: 'Fibonacci Strike',
    inputs: { a: 0, b: 0 },
    budget: 30,
    hint: `; Level 6: Output the first 6 Fibonacci numbers
; 1, 1, 2, 3, 5, 8
; Hint: use two registers to track prev and curr
`,
  },
  {
    level: 7,
    title: 'Stack Flip',
    skillName: 'Stack Flip',
    inputs: { a: 3, b: 7 },
    budget: 10,
    hint: `; Level 7: Push AX then BX onto the stack
; Then POP both (reverse order) and HLT each
; AX = 3, BX = 7
; Expected output: [7, 3]
`,
  },
  {
    level: 8,
    title: 'Triple',
    skillName: 'Triple Double',
    inputs: { a: 4, b: 0 },
    budget: 15,
    hint: `; Level 8: Output AX * 3
; AX = 4
; Hint: ADD AX to itself, then ADD original value again
`,
  },
  {
    level: 9,
    title: 'Branch',
    skillName: 'Branch Blast',
    inputs: { a: 7, b: 3 },
    budget: 10,
    hint: `; Level 9: Output the larger of AX and BX
; AX = 7, BX = 3
; You MUST use a jump instruction (JE or JNE)
`,
  },
  {
    level: 10,
    title: 'Square',
    skillName: 'Square Nuke',
    inputs: { a: 6, b: 0 },
    budget: 10,
    hint: `; Level 10: Output AX * AX (AX squared)
; AX = 6
; Hint: MOV BX, AX  then MUL AX, BX
`,
  },
]
```

**Step 3: Update skillMatcher tests**

Replace `src/interpreter/skillMatcher.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { matchSkill } from './skillMatcher'

describe('matchSkill', () => {
  it('matches Add Beam when output equals a+b', () => {
    const skill = matchSkill([7], { a: 3, b: 4 }, 'Add Beam')
    expect(skill).not.toBeNull()
    expect(skill.name).toBe('Add Beam')
  })

  it('returns null when output does not match expected skill', () => {
    const skill = matchSkill([99], { a: 3, b: 4 }, 'Add Beam')
    expect(skill).toBeNull()
  })

  it('returns null when wrong skill name given even if output matches another', () => {
    const skill = matchSkill([7], { a: 3, b: 4 }, 'Sub Strike')
    expect(skill).toBeNull()
  })

  it('matches Sub Strike when output equals a-b', () => {
    const skill = matchSkill([5], { a: 9, b: 4 }, 'Sub Strike')
    expect(skill).not.toBeNull()
  })

  it('matches Mul Cannon when output equals a*b', () => {
    const skill = matchSkill([42], { a: 6, b: 7 }, 'Mul Cannon')
    expect(skill).not.toBeNull()
  })

  it('matches Fibonacci Strike', () => {
    const skill = matchSkill([1, 1, 2, 3, 5, 8], {}, 'Fibonacci Strike')
    expect(skill).not.toBeNull()
  })

  it('matches Countdown Burst', () => {
    const skill = matchSkill([5, 4, 3, 2, 1], { a: 5 }, 'Countdown Burst')
    expect(skill).not.toBeNull()
  })

  it('matches Stack Flip', () => {
    const skill = matchSkill([7, 3], { a: 3, b: 7 }, 'Stack Flip')
    expect(skill).not.toBeNull()
  })

  it('matches Square Nuke', () => {
    const skill = matchSkill([36], { a: 6 }, 'Square Nuke')
    expect(skill).not.toBeNull()
  })
})
```

**Step 4: Run tests — confirm they fail**

```bash
node node_modules/vitest/vitest.mjs run src/interpreter/skillMatcher.test.js
```
Expected: FAIL (matchSkill signature changed)

**Step 5: Run tests — confirm they pass after implementation**

```bash
node node_modules/vitest/vitest.mjs run src/interpreter/skillMatcher.test.js
```
Expected: All PASS

**Step 6: Commit**

```bash
git add src/interpreter/skillMatcher.js src/interpreter/skillMatcher.test.js src/levels/
git commit -m "feat: add 10 levels and updated skill matcher"
```

---

### Task 2: Update game store for level progression

**Files:**
- Modify: `src/store/gameStore.js`
- Modify: `src/store/gameStore.test.js`

**Step 1: Update store**

Replace `src/store/gameStore.js`:

```js
import { create } from 'zustand'
import { createMachine, stepInstruction } from '../interpreter/interpreter'
import { LEVELS } from '../levels/levels'

const firstLevel = LEVELS[0]

const INITIAL = {
  playerHp: 100,
  bossHp: 100,
  phase: 'editing',
  machine: createMachine(),
  instructions: [],
  timer: 30,
  budget: firstLevel.budget,
  battleLog: [],
  currentLevel: 1,
  inputs: firstLevel.inputs,
}

export const useGameStore = create((set, get) => ({
  ...INITIAL,

  reset: () => set({ ...INITIAL, machine: createMachine() }),

  setMachine: (machine) => set({ machine }),
  setInstructions: (instructions) => set({ instructions }),
  setPhase: (phase) => set({ phase }),

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

  stepMachine: () => set((s) => {
    if (s.machine.halted || s.machine.error) return s
    const next = stepInstruction(s.machine, s.instructions)
    return { machine: next }
  }),

  nextLevel: () => set((s) => {
    const next = LEVELS.find(l => l.level === s.currentLevel + 1)
    if (!next) return { phase: 'victory' } // all levels complete
    return {
      currentLevel: next.level,
      bossHp: 100,
      phase: 'editing',
      machine: createMachine(),
      instructions: [],
      timer: 30,
      budget: next.budget,
      inputs: next.inputs,
      battleLog: [...s.battleLog.slice(-9), `⚡ Level ${next.level}: ${next.title}!`],
    }
  }),
}))
```

**Step 2: Update store tests**

Replace `src/store/gameStore.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './gameStore'

beforeEach(() => {
  useGameStore.getState().reset()
})

describe('gameStore', () => {
  it('initializes with correct defaults', () => {
    const s = useGameStore.getState()
    expect(s.playerHp).toBe(100)
    expect(s.bossHp).toBe(100)
    expect(s.phase).toBe('editing')
    expect(s.machine).toBeDefined()
    expect(s.timer).toBe(30)
    expect(s.currentLevel).toBe(1)
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

  it('nextLevel advances to level 2 with new inputs and budget', () => {
    useGameStore.getState().applyDamageToBoss(100) // win level 1
    useGameStore.getState().nextLevel()
    const s = useGameStore.getState()
    expect(s.currentLevel).toBe(2)
    expect(s.bossHp).toBe(100)
    expect(s.phase).toBe('editing')
  })

  it('nextLevel after level 10 sets phase to victory', () => {
    useGameStore.setState({ currentLevel: 10 })
    useGameStore.getState().nextLevel()
    expect(useGameStore.getState().phase).toBe('victory')
  })
})
```

**Step 3: Run tests**

```bash
node node_modules/vitest/vitest.mjs run src/store/gameStore.test.js
```
Expected: All PASS

**Step 4: Commit**

```bash
git add src/store/
git commit -m "feat: add level progression to game store"
```

---

### Task 3: Update EditorPanel — puzzle hints, level-aware skill matching

**Files:**
- Modify: `src/components/EditorPanel.jsx`

Replace `src/components/EditorPanel.jsx`:

```jsx
import Editor from '@monaco-editor/react'
import { useRef, useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { createMachine, parseProgram } from '../interpreter/interpreter'
import { matchSkill } from '../interpreter/skillMatcher'
import { InstructionRef } from './InstructionRef'
import { LEVELS } from '../levels/levels'

export function EditorPanel() {
  const { inputs, budget, applyDamageToBoss, applyDamageToPlayer, addLog, phase, currentLevel } = useGameStore()
  const levelDef = LEVELS.find(l => l.level === currentLevel) ?? LEVELS[0]
  const [code, setCode] = useState(levelDef.hint)
  const rafRef = useRef(null)

  // Reset editor code when level changes
  useEffect(() => {
    setCode(levelDef.hint)
  }, [currentLevel])

  function handleExecute() {
    if (phase !== 'editing') return
    const instructions = parseProgram(code)

    useGameStore.setState((s) => ({
      machine: { ...s.machine, registers: { ...s.machine.registers, AX: inputs.a, BX: inputs.b } },
      instructions,
      phase: 'executing',
    }))

    function step() {
      const current = useGameStore.getState().machine
      const currentBudget = useGameStore.getState().budget

      if (current.halted || current.error || current.cyclesUsed > currentBudget) {
        if (current.error || current.cyclesUsed > currentBudget) {
          applyDamageToPlayer(10)
          addLog(`❌ Error: ${current.error ?? 'budget exceeded'} (-10 HP)`)
        } else {
          const skill = matchSkill(current.output, inputs, levelDef.skillName)
          if (skill) {
            applyDamageToBoss(skill.damage)
            addLog(`✨ ${skill.name}! Boss takes ${skill.damage} damage!`)
          } else {
            applyDamageToPlayer(5)
            addLog(`❌ Wrong answer. Output: [${current.output.join(', ')}] (-5 HP)`)
          }
        }
        const currentPhase = useGameStore.getState().phase
        if (currentPhase !== 'win' && currentPhase !== 'lose') {
          useGameStore.setState({ phase: 'editing', machine: createMachine() })
        } else {
          useGameStore.setState({ machine: createMachine() })
        }
        return
      }

      useGameStore.getState().stepMachine()
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-1 bg-gray-900 border-b border-green-800 font-mono text-xs text-yellow-400">
        Level {currentLevel}/10 — {levelDef.title}
      </div>
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
      <InstructionRef />
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

**Step 2: Commit**

```bash
git add src/components/EditorPanel.jsx
git commit -m "feat: editor shows level hint, uses level-specific skill matching"
```

---

### Task 4: Update App.jsx — level-clear overlay, victory screen

**Files:**
- Modify: `src/App.jsx`

Replace the win overlay section and add nextLevel wiring. Full new `src/App.jsx`:

```jsx
import { Component } from 'react'
import { HUD } from './components/HUD'
import { BattleLog } from './components/BattleLog'
import { MachineScene } from './components/MachineScene'
import { EditorPanel } from './components/EditorPanel'
import { useBossTimer } from './hooks/useBossTimer'
import { useGameStore } from './store/gameStore'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error: error.message || String(error) }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#1a0000', color: '#ff4444', padding: 24, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          <div style={{ fontSize: 18, marginBottom: 12 }}>💥 Render Error in: {this.props.name}</div>
          <div>{this.state.error}</div>
        </div>
      )
    }
    return this.props.children
  }
}

function AppInner() {
  useBossTimer()
  const { phase, reset, nextLevel, currentLevel } = useGameStore()

  return (
    <div className="relative h-screen flex flex-col bg-gray-950 text-green-400">
      <HUD />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-green-800">
          <ErrorBoundary name="MachineScene">
            <MachineScene />
          </ErrorBoundary>
        </div>
        <div className="w-1/2 flex flex-col">
          <ErrorBoundary name="EditorPanel">
            <EditorPanel />
          </ErrorBoundary>
        </div>
      </div>
      <BattleLog />

      {phase === 'win' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-green-400 font-mono z-50">
          <div className="text-4xl mb-4">⚡ LEVEL {currentLevel} CLEAR!</div>
          <div className="text-xl mb-8">Boss defeated!</div>
          <button onClick={nextLevel} className="px-8 py-3 bg-green-700 text-black font-bold rounded text-lg">
            Next Level →
          </button>
        </div>
      )}

      {phase === 'victory' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 text-yellow-400 font-mono z-50">
          <div className="text-5xl mb-4">🏆 YOU WIN!</div>
          <div className="text-2xl mb-2">All 10 levels defeated!</div>
          <div className="text-lg mb-8 text-green-400">You are a master of assembly!</div>
          <button onClick={reset} className="px-8 py-3 bg-yellow-600 text-black font-bold rounded text-lg">
            Play Again
          </button>
        </div>
      )}

      {phase === 'lose' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-red-400 font-mono z-50">
          <div className="text-4xl mb-4">💀 SYSTEM CRASH</div>
          <div className="text-xl mb-8">Player HP reached 0</div>
          <button onClick={reset} className="px-8 py-3 bg-red-700 text-black font-bold rounded">Retry</button>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary name="App">
      <AppInner />
    </ErrorBoundary>
  )
}
```

**Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add level-clear overlay, victory screen, Next Level button"
```

---

### Task 5: Update HUD to show current level

**Files:**
- Modify: `src/components/HUD.jsx`

Add `currentLevel` to the HUD center section:

```jsx
import { useGameStore } from '../store/gameStore'

export function HUD() {
  const { playerHp, bossHp, timer, budget, currentLevel } = useGameStore()

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
        <span className="text-yellow-400">LVL {currentLevel}/10</span>
        <span>Timer: <span className={timer <= 5 ? 'text-red-400 animate-pulse' : ''}>{timer}s</span></span>
        <span>Budget: {budget}c</span>
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

**Step 2: Commit**

```bash
git add src/components/HUD.jsx
git commit -m "feat: show current level in HUD"
```

---

### Task 6: Run all tests and push to GitHub

**Step 1: Run full test suite**

```bash
node node_modules/vitest/vitest.mjs run
```
Expected: All tests PASS

**Step 2: Production build**

```bash
npm run build
```
Expected: Clean build, no errors

**Step 3: Push to GitHub**

```bash
git remote add origin https://github.com/AyaSakura-comp/assembly_3D_game
git push -u origin master
```
