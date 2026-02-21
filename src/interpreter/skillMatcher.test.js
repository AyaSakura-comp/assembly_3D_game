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
