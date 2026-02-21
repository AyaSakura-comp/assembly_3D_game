import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useGameStore } from '../store/gameStore'
import { DIPChip } from './3d/DIPChip'
import { SIMMSlot } from './3d/SIMMSlot'
import { StackSocket } from './3d/StackSocket'
import { Motherboard } from './3d/Motherboard'
import { ApexCase } from './3d/Case'

const REGISTER_NAMES = ['AX', 'BX', 'CX', 'DX']
const REGISTER_POSITIONS = [[-3, 0, 0], [-1, 0, 0], [1, 0, 0], [3, 0, 0]]

function Scene() {
  const { machine } = useGameStore()
  const prevRegs = useRef(machine.registers)
  const activeReg = REGISTER_NAMES.find(n => machine.registers[n] !== prevRegs.current[n]) ?? null
  prevRegs.current = machine.registers

  return (
    <>
      <ambientLight intensity={1.0} />
      <pointLight position={[5, 10, 5]} intensity={2.0} color="#ffffff" />
      
      <ApexCase>
        <Motherboard>
          {REGISTER_NAMES.map((name, i) => (
            <DIPChip
              key={name}
              name={name}
              value={machine.registers[name]}
              position={REGISTER_POSITIONS[i]}
              active={activeReg === name}
            />
          ))}

          <SIMMSlot memory={machine.memory} />
          <StackSocket stack={machine.stack} />
        </Motherboard>
      </ApexCase>

      <OrbitControls makeDefault />
    </>
  )
}

export function MachineScene() {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      <Scene />
    </Canvas>
  )
}
