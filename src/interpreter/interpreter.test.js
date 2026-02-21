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
