import Editor from '@monaco-editor/react'
import { useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { createMachine, parseProgram } from '../interpreter/interpreter'
import { matchSkill } from '../interpreter/skillMatcher'

const STARTER_CODE = `; Level 1: Compute a + b
; a is in AX, b is in BX
; HLT with the result

MOV AX, 3
MOV BX, 4
ADD AX, BX
HLT AX
`

export function EditorPanel() {
  const [code, setCode] = useState(STARTER_CODE)
  const rafRef = useRef(null)
  const { inputs, budget, applyDamageToBoss, applyDamageToPlayer, addLog, phase } = useGameStore()

  function handleExecute() {
    if (phase !== 'editing') return
    const instructions = parseProgram(code)

    useGameStore.setState((s) => ({
      machine: { ...s.machine, registers: { ...s.machine.registers, AX: inputs.a, BX: inputs.b } },
      instructions,
      phase: 'executing',
    }))

    function step() {
      const current = useGameStore.getState().machine
      const currentBudget = useGameStore.getState().budget

      if (current.halted || current.error || current.cyclesUsed > currentBudget) {
        if (current.error || current.cyclesUsed > currentBudget) {
          applyDamageToPlayer(10)
          addLog(`❌ Error: ${current.error ?? 'budget exceeded'} (-10 HP)`)
        } else {
          const skill = matchSkill(current.output, inputs)
          if (skill) {
            applyDamageToBoss(skill.damage)
            addLog(`✨ ${skill.name}! Boss takes ${skill.damage} damage!`)
          } else {
            applyDamageToPlayer(5)
            addLog(`❌ No skill matched. Output: [${current.output.join(', ')}] (-5 HP)`)
          }
        }
        useGameStore.setState({ phase: 'editing', machine: createMachine() })
        return
      }

      useGameStore.getState().stepMachine()
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val ?? '')}
          options={{ fontSize: 14, fontFamily: 'monospace', minimap: { enabled: false } }}
        />
      </div>
      <div className="p-3 border-t border-green-800 bg-gray-900">
        <button
          onClick={handleExecute}
          disabled={phase !== 'editing'}
          className="w-full py-2 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 text-black font-mono font-bold rounded"
        >
          ▶ Execute
        </button>
      </div>
    </div>
  )
}
