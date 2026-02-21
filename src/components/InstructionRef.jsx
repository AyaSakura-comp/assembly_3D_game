import { useState } from 'react'

const INSTRUCTIONS = [
  { op: 'MOV', syntax: 'MOV AX, 5', cost: 1, desc: 'Copy value into register' },
  { op: 'ADD', syntax: 'ADD AX, BX', cost: 1, desc: 'AX = AX + BX' },
  { op: 'SUB', syntax: 'SUB AX, BX', cost: 1, desc: 'AX = AX - BX' },
  { op: 'MUL', syntax: 'MUL AX, BX', cost: 3, desc: 'AX = AX * BX' },
  { op: 'CMP', syntax: 'CMP AX, BX', cost: 1, desc: 'Compare, sets zero flag' },
  { op: 'JMP', syntax: 'JMP label', cost: 1, desc: 'Jump to label' },
  { op: 'JE',  syntax: 'JE label',  cost: 1, desc: 'Jump if equal (zero flag)' },
  { op: 'JNE', syntax: 'JNE label', cost: 1, desc: 'Jump if not equal' },
  { op: 'PUSH', syntax: 'PUSH AX', cost: 1, desc: 'Push register to stack' },
  { op: 'POP',  syntax: 'POP AX',  cost: 2, desc: 'Pop stack into register' },
  { op: 'HLT',  syntax: 'HLT AX',  cost: 0, desc: 'Halt and output register' },
]

export function InstructionRef() {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-green-800 font-mono text-xs">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-3 py-1 text-green-600 hover:text-green-400"
      >
        {open ? '▼' : '▶'} Instruction Reference
      </button>
      {open && (
        <div className="px-3 pb-2 max-h-40 overflow-y-auto">
          {INSTRUCTIONS.map(i => (
            <div key={i.op} className="flex gap-4 py-0.5 text-green-300">
              <span className="w-24 text-yellow-400">{i.syntax}</span>
              <span className="w-8 text.gray-500">{i.cost}c</span>
              <span>{i.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
