import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CHIP_POSITIONS = {
  AX: [-3, 0.5, -2],
  BX: [-1, 0.5, -2],
  CX: [1, 0.5, -2],
  DX: [3, 0.5, -2],
  MEMORY: [-3, 0.5, 1],
  STACK: [4, 0.5, 1],
}

export function DataTrace({ source, destination, active }) {
  const meshRef = useRef()
  const progressRef = useRef(0)

  const start = CHIP_POSITIONS[source]
  const end = CHIP_POSITIONS[destination]

  useFrame((_, delta) => {
    if (!active || !start || !end || !meshRef.current) return

    progressRef.current += delta * 3
    if (progressRef.current > 1) progressRef.current = 0

    const t = progressRef.current
    meshRef.current.position.set(
      start[0] + (end[0] - start[0]) * t,
      0.3,
      start[2] + (end[2] - start[2]) * t
    )
    meshRef.current.material.opacity = 1 - t * 0.5
  })

  if (!active || !start || !end) return null

  return (
    <group>
      {/* Trace line on the PCB */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([start[0], 0.15, start[2], end[0], 0.15, end[2]])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#aa8800" linewidth={1} />
      </line>

      {/* Animated pulse sphere */}
      <mesh ref={meshRef} position={[start[0], 0.3, start[2]]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ffaa00"
          emissiveIntensity={2}
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  )
}
