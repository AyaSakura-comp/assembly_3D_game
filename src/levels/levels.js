export const LEVELS = [
  {
    level: 1,
    title: 'Addition',
    skillName: 'Add Beam',
    inputs: { a: 3, b: 4 },
    budget: 5,
    hint: `; Level 1: Compute AX + BX
; AX = 3, BX = 4
; HLT with the result
`,
  },
  {
    level: 2,
    title: 'Subtraction',
    skillName: 'Sub Strike',
    inputs: { a: 9, b: 4 },
    budget: 5,
    hint: `; Level 2: Compute AX - BX
; AX = 9, BX = 4
; HLT with the result
`,
  },
  {
    level: 3,
    title: 'Multiplication',
    skillName: 'Mul Cannon',
    inputs: { a: 6, b: 7 },
    budget: 8,
    hint: `; Level 3: Compute AX * BX
; AX = 6, BX = 7
; HLT with the result
`,
  },
  {
    level: 4,
    title: 'Maximum',
    skillName: 'Max Pulse',
    inputs: { a: 5, b: 8 },
    budget: 8,
    hint: `; Level 4: Output the larger of AX and BX
; AX = 5, BX = 8
; Hint: use CMP and JE/JNE
`,
  },
  {
    level: 5,
    title: 'Countdown',
    skillName: 'Countdown Burst',
    inputs: { a: 5, b: 0 },
    budget: 25,
    hint: `; Level 5: HLT AX, then AX-1, down to 1
; AX = 5  (count from 5 down to 1)
; Hint: use a loop with CMP and JNE
`,
  },
  {
    level: 6,
    title: 'Fibonacci',
    skillName: 'Fibonacci Strike',
    inputs: { a: 0, b: 0 },
    budget: 30,
    hint: `; Level 6: Output the first 6 Fibonacci numbers
; 1, 1, 2, 3, 5, 8
; Hint: use two registers to track prev and curr
`,
  },
  {
    level: 7,
    title: 'Stack Flip',
    skillName: 'Stack Flip',
    inputs: { a: 3, b: 7 },
    budget: 10,
    hint: `; Level 7: Push AX then BX onto the stack
; Then POP both (reverse order) and HLT each
; AX = 3, BX = 7
; Expected output: [7, 3]
`,
  },
  {
    level: 8,
    title: 'Triple',
    skillName: 'Triple Double',
    inputs: { a: 4, b: 0 },
    budget: 15,
    hint: `; Level 8: Output AX * 3
; AX = 4
; Hint: ADD AX to itself, then ADD original value again
`,
  },
  {
    level: 9,
    title: 'Branch',
    skillName: 'Branch Blast',
    inputs: { a: 7, b: 3 },
    budget: 10,
    hint: `; Level 9: Output the larger of AX and BX
; AX = 7, BX = 3
; You MUST use a jump instruction (JE or JNE)
`,
  },
  {
    level: 10,
    title: 'Square',
    skillName: 'Square Nuke',
    inputs: { a: 6, b: 0 },
    budget: 10,
    hint: `; Level 10: Output AX * AX (AX squared)
; AX = 6
; Hint: MOV BX, AX  then MUL AX, BX
`,
  },
]
