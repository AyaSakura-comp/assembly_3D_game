import { useRef, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useGameStore } from '../store/gameStore'
import { DIPChip } from './3d/DIPChip'
import { SIMMSlot } from './3d/SIMMSlot'
import { StackSocket } from './3d/StackSocket'
import { Motherboard } from './3d/Motherboard'
import { ApexCase } from './3d/Case'
import { DataTrace } from './3d/DataTrace'
import { BossMachine } from './3d/BossMachine'
import { UpgradeSlot } from './3d/UpgradeSlot'

const REGISTER_NAMES = ['AX', 'BX', 'CX', 'DX']
// Chips are 0.4 tall, so Y=0.2 puts their bottom exactly at Y=0
const REGISTER_POSITIONS = [[-3, 0.2, -2], [-1, 0.2, -2], [1, 0.2, -2], [3, 0.2, -2]]

function Scene() {
  const { machine, instructions } = useGameStore()
  const prevRegs = useRef({ ...machine.registers })

  // Detect which register changed and what the source was
  const traceInfo = useMemo(() => {
    const changed = REGISTER_NAMES.find(n => machine.registers[n] !== prevRegs.current[n])
    prevRegs.current = { ...machine.registers }

    if (!changed || machine.pc === 0) return null

    // Look at previous instruction to determine source
    const prevPc = Math.max(0, machine.pc - 1)
    const instr = instructions[prevPc]
    if (!instr) return null

    const { op, args } = instr
    if (op === 'MOV' || op === 'ADD' || op === 'SUB' || op === 'MUL') {
      const src = REGISTER_NAMES.includes(args[1]) ? args[1] : null
      const dest = args[0]
      if (src && dest) return { source: src, destination: dest }
    }
    if (op === 'POP') {
      return { source: 'STACK', destination: args[0] }
    }

    return null
  }, [machine.registers, machine.pc, instructions])

  const activeReg = REGISTER_NAMES.find(n => machine.registers[n] !== prevRegs.current[n]) ?? null

  return (
    <>
      <color attach="background" args={['#1a2a3a']} />
      <fog attach="fog" args={['#1a2a3a', 20, 40]} />
      <ambientLight intensity={0.9} />
      <pointLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, 8, -10]} intensity={0.8} color="#aaccff" />

      <ApexCase>
        <Motherboard>
          {REGISTER_NAMES.map((name, i) => (
            <DIPChip
              key={name}
              name={name}
              value={machine.registers[name]}
              position={REGISTER_POSITIONS[i]}
              active={traceInfo?.destination === name}
            />
          ))}

          <SIMMSlot memory={machine.memory} />
          <StackSocket stack={machine.stack} />
          <UpgradeSlot />

          {traceInfo && (
            <DataTrace
              source={traceInfo.source}
              destination={traceInfo.destination}
              active={true}
            />
          )}
        </Motherboard>
      </ApexCase>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, -4]}>
        <planeGeometry args={[30, 40]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.9} />
      </mesh>

      <BossMachine />
      <OrbitControls makeDefault />
    </>
  )
}

export function MachineScene() {
  return (
    <Canvas camera={{ position: [0, 8, 12], fov: 50 }}>
      <Scene />
    </Canvas>
  )
}
