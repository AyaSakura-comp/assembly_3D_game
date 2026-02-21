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
    if (!next) return { phase: 'victory' }
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
