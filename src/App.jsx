import { HUD } from './components/HUD'
import { BattleLog } from './components/BattleLog'
import { MachineScene } from './components/MachineScene'

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-green-400">
      <HUD />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-green-800">
          <MachineScene />
        </div>
        <div className="w-1/2 flex flex-col">
          {/* Editor goes here - Task 7 */}
          <div className="flex-1 flex items-center justify-center text-green-700 font-mono">
            [ Code Editor ]
          </div>
          <button className="m-4 px-6 py-2 bg-green-700 hover:bg-green-600 text-black font-mono font-bold rounded">
            Execute
          </button>
        </div>
      </div>
      <BattleLog />
    </div>
  )
}
