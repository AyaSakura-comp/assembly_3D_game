import { HUD } from './components/HUD'
import { BattleLog } from './components/BattleLog'
import { MachineScene } from './components/MachineScene'
import { EditorPanel } from './components/EditorPanel'

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-green-400">
      <HUD />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-green-800">
          <MachineScene />
        </div>
        <div className="w-1/2 flex flex-col">
          <EditorPanel />
        </div>
      </div>
      <BattleLog />
    </div>
  )
}
