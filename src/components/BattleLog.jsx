import { useGameStore } from '../store/gameStore'

export function BattleLog() {
  const { battleLog } = useGameStore()
  return (
    <div className="bg-gray-950 border-t border-green-800 px-4 py-2 font-mono text-xs text-green-300 h-16 overflow-y-auto">
      {battleLog.map((msg, i) => <div key={i}>{msg}</div>)}
    </div>
  )
}
