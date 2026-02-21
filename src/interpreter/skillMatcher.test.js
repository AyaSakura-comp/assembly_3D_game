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
