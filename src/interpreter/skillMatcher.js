export const SKILLS = [
  {
    name: 'Add Beam',
    description: 'Compute a + b',
    damage: 20,
    match: (output, inputs) => output.length === 1 && output[0] === inputs.a + inputs.b,
  },
  {
    name: 'Fibonacci Strike',
    description: 'Output the first 6 Fibonacci numbers',
    damage: 60,
    match: (output) => {
      const fib = [1, 1, 2, 3, 5, 8]
      return output.length === 6 && fib.every((v, i) => v === output[i])
    },
  },
  {
    name: 'Sort Slash',
    description: 'Output an array sorted ascending',
    damage: 40,
    match: (output) => {
      if (output.length < 2) return false
      for (let i = 0; i < output.length - 1; i++) {
        if (output[i] > output[i + 1]) return false
      }
      return true
    },
  },
]

export function matchSkill(output, inputs) {
  for (const skill of SKILLS) {
    if (skill.match(output, inputs)) return skill
  }
  return null
}
