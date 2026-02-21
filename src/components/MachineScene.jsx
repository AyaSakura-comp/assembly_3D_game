import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { RegisterCube } from './RegisterCube'
import { MemoryGrid } from './MemoryGrid'
import { StackTower } from './StackTower'
import { useGameStore } from '../store/gameStore'

const REGISTER_NAMES = ['AX', 'BX', 'CX', 'DX']
const REGISTER_POSITIONS = [[-3, 1, 0], [-1, 1, 0], [1, 1, 0], [3, 1, 0]]

function Scene() {
  const { machine } = useGameStore()
  const prevRegs = useRef(machine.registers)
  const activeReg = REGISTER_NAMES.find(n => machine.registers[n] !== prevRegs.current[n]) ?? null
  prevRegs.current = machine.registers

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={1} color="#00ff88" />
      <Grid args={[20, 20]} cellColor="#003322" sectionColor="#005533" position={[0, -3, 0]} />

      {REGISTER_NAMES.map((name, i) => (
        <RegisterCube
          key={name}
          name={name}
          value={machine.registers[name]}
          position={REGISTER_POSITIONS[i]}
          active={activeReg === name}
        />
      ))}

      <MemoryGrid memory={machine.memory} />
      <StackTower stack={machine.stack} />

      <OrbitControls makeDefault />
    </>
  )
}

export function MachineScene() {
  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
      <Scene />
    </Canvas>
  )
}
