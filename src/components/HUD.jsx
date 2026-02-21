import { useGameStore } from '../store/gameStore'

export function HUD() {
  const { playerHp, bossHp, timer, budget } = useGameStore()

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-900 text-green-400 font-mono text-sm border-b border-green-800">
      <div className="flex items-center gap-2">
        <span>Player HP:</span>
        <div className="w-32 h-3 bg-gray-700 rounded">
          <div className="h-3 bg-green-500 rounded" style={{ width: `${playerHp}%` }} />
        </div>
        <span>{playerHp}</span>
      </div>
      <div className="flex gap-6">
        <span>Timer: <span className={timer <= 5 ? 'text-red-400 animate-pulse' : ''}>{timer}s</span></span>
        <span>Budget: {budget} cycles</span>
      </div>
      <div className="flex items-center gap-2">
        <span>Boss HP:</span>
        <div className="w-32 h-3 bg-gray-700 rounded">
          <div className="h-3 bg-red-500 rounded" style={{ width: `${bossHp}%` }} />
        </div>
        <span>{bossHp}</span>
      </div>
    </div>
  )
}
