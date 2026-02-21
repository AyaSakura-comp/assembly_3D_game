import { useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export function RegisterCube({ name, value, position, active }) {
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
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={active ? '#00ff88' : '#004422'}
          emissive={active ? '#00ff88' : '#002211'}
          emissiveIntensity={0.1}
        />
      </mesh>
      <Text position={[0, 0, 0.6]} fontSize={0.25} color="#00ff88">{name}</Text>
      <Text position={[0, -0.35, 0.6]} fontSize={0.2} color="#ffffff">{value}</Text>
    </group>
  )
}
