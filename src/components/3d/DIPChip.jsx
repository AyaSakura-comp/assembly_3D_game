import { useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export function DIPChip({ name, value, position, active }) {
  const meshRef = useRef()
  useFrame(() => {
    if (active && meshRef.current) {
      meshRef.current.material.emissiveIntensity =
        0.5 + 0.5 * Math.sin(Date.now() / 150)
    } else if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.1
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 0.4, 0.6]} />
        <meshStandardMaterial
          color={active ? '#00ff88' : '#111111'}
          emissive={active ? '#00ff88' : '#000000'}
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Label on top */}
      <Text position={[0, 0.21, 0]} fontSize={0.2} color="#00ff88" rotation={[-Math.PI / 2, 0, 0]}>
        {name}
      </Text>
      {/* Amber value display */}
      <Text position={[0, 0.21, 0.15]} fontSize={0.2} color="#ffaa00" rotation={[-Math.PI / 2, 0, 0]}>
        {value}
      </Text>
    </group>
  )
}
