import Editor from '@monaco-editor/react'
import { useRef, useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { createMachine, parseProgram } from '../interpreter/interpreter'
import { matchSkill } from '../interpreter/skillMatcher'
import { InstructionRef } from './InstructionRef'
import { LEVELS } from '../levels/levels'

export function EditorPanel() {
  const { inputs, budget, applyDamageToBoss, applyDamageToPlayer, addLog, phase, currentLevel } = useGameStore()
  const levelDef = LEVELS.find(l => l.level === currentLevel) ?? LEVELS[0]
  const [code, setCode] = useState(levelDef.hint)
  const rafRef = useRef(null)

  useEffect(() => {
    setCode(levelDef.hint)
  }, [currentLevel])

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
          const skill = matchSkill(current.output, inputs, levelDef.skillName)
          if (skill) {
            applyDamageToBoss(skill.damage)
            addLog(`✨ ${skill.name}! Boss takes ${skill.damage} damage!`)
          } else {
            applyDamageToPlayer(5)
            addLog(`❌ Wrong answer. Output: [${current.output.join(', ')}] (-5 HP)`)
          }
        }
        const currentPhase = useGameStore.getState().phase
        if (currentPhase !== 'win' && currentPhase !== 'lose') {
          useGameStore.setState({ phase: 'editing', machine: createMachine() })
        } else {
          useGameStore.setState({ machine: createMachine() })
        }
        return
      }

      useGameStore.getState().stepMachine()
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-1 bg-gray-900 border-b border-green-800 font-mono text-xs text-yellow-400">
        Level {currentLevel}/10 — {levelDef.title}
      </div>
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
      <InstructionRef />
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
