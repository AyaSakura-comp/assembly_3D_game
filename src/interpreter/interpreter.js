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
