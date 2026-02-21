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
    useGameStore.getState().applyDamageToBoss(100)
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
