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
