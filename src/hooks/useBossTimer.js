import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function useBossTimer() {
  const { applyDamageToPlayer, addLog, phase } = useGameStore()

  useEffect(() => {
    if (phase !== 'editing') return
    const id = setInterval(() => {
      const currentTimer = useGameStore.getState().timer
      if (currentTimer <= 1) {
        applyDamageToPlayer(15)
        addLog('💥 Boss attacks! -15 HP')
        useGameStore.setState({ timer: 30 })
      } else {
        useGameStore.setState((s) => ({ timer: s.timer - 1 }))
      }
    }, 1000)
    return () => clearInterval(id)
  }, [phase])
}
