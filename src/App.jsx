import { Component } from 'react'
import { HUD } from './components/HUD'
import { BattleLog } from './components/BattleLog'
import { MachineScene } from './components/MachineScene'
import { EditorPanel } from './components/EditorPanel'
import { useBossTimer } from './hooks/useBossTimer'
import { useGameStore } from './store/gameStore'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error: error.message || String(error) }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#1a0000', color: '#ff4444', padding: 24, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          <div style={{ fontSize: 18, marginBottom: 12 }}>💥 Render Error in: {this.props.name}</div>
          <div>{this.state.error}</div>
        </div>
      )
    }
    return this.props.children
  }
}

function AppInner() {
  useBossTimer()
  const { phase, reset } = useGameStore()

  return (
    <div className="relative h-screen flex flex-col bg-gray-950 text-green-400">
      <HUD />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-green-800">
          <ErrorBoundary name="MachineScene">
            <MachineScene />
          </ErrorBoundary>
        </div>
        <div className="w-1/2 flex flex-col">
          <ErrorBoundary name="EditorPanel">
            <EditorPanel />
          </ErrorBoundary>
        </div>
      </div>
      <BattleLog />

      {phase === 'win' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-green-400 font-mono z-50">
          <div className="text-4xl mb-4">✅ PROGRAM COMPLETE</div>
          <div className="text-xl mb-8">Boss defeated!</div>
          <button onClick={reset} className="px-8 py-3 bg-green-700 text-black font-bold rounded">Play Again</button>
        </div>
      )}
      {phase === 'lose' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-red-400 font-mono z-50">
          <div className="text-4xl mb-4">💀 SYSTEM CRASH</div>
          <div className="text-xl mb-8">Player HP reached 0</div>
          <button onClick={reset} className="px-8 py-3 bg-red-700 text-black font-bold rounded">Retry</button>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary name="App">
      <AppInner />
    </ErrorBoundary>
  )
}
