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
