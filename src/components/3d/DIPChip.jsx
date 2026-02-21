import { useRef, useState, useEffect } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export function DIPChip({ name, value, position, active }) {
  const meshRef = useRef()
  const [displayValue, setDisplayValue] = useState(value)
  const [flickering, setFlickering] = useState(false)

  useEffect(() => {
    setFlickering(true)
    const timeout = setTimeout(() => {
      setDisplayValue(value)
      setFlickering(false)
    }, 300)
    return () => clearTimeout(timeout)
  }, [value])

  useFrame(() => {
    if (flickering) {
      setDisplayValue(Math.floor(Math.random() * 9999))
    }
    if (active && meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.8 + 0.4 * Math.sin(Date.now() / 150)
    } else if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.1
    }
  })

  return (
    <group position={position}>
      {/* Lighter black for ceramic case */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1.6, 0.4, 0.8]} />
        <meshStandardMaterial
          color="#222222" 
          emissive={active ? '#00ff88' : '#111111'}
          emissiveIntensity={0.1}
        />
      </mesh>

      <Text
        position={[-0.4, 0.21, -0.2]}
        fontSize={0.18}
        color="#aaaaaa"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {name}
      </Text>

      <mesh position={[0.2, 0.1, 0.1]}>
        <boxGeometry args={[0.9, 0.25, 0.4]} />
        <meshStandardMaterial color="#331100" />
      </mesh>
      <Text
        position={[0.2, 0.23, 0.1]}
        fontSize={0.25}
        color="#ffaa00"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {displayValue.toString().padStart(4, '0')}
      </Text>

      {[...Array(6)].map((_, i) => (
        <group key={i}>
          <mesh position={[-0.65 + i * 0.25, -0.2, 0.42]}>
            <boxGeometry args={[0.05, 0.4, 0.05]} />
            <meshStandardMaterial color="#999999" />
          </mesh>
          <mesh position={[-0.65 + i * 0.25, -0.2, -0.42]}>
            <boxGeometry args={[0.05, 0.4, 0.05]} />
            <meshStandardMaterial color="#999999" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
