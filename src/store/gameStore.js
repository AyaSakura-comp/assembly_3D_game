import { create } from 'zustand'
import { createMachine, stepInstruction } from '../interpreter/interpreter'

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

  stepMachine: () => set((s) => {
    if (s.machine.halted || s.machine.error) return s
    const next = stepInstruction(s.machine, s.instructions)
    return { machine: next }
  }),
}))
