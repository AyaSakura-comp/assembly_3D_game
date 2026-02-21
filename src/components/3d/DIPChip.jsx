import { useRef, useState, useEffect } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export function DIPChip({ name, value, position, active }) {
  const meshRef = useRef()
  const [displayValue, setDisplayValue] = useState(value)
  const [flickering, setFlickering] = useState(false)

  // Flicker through random values when the underlying value changes
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
    
    // Dynamic emissive glow for the "logic core"
    if (active && meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.6 + 0.4 * Math.sin(Date.now() / 150)
    } else if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.1
    }
  })

  return (
    <group position={position}>
      {/* Black Ceramic Chip Case */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1.6, 0.4, 0.8]} />
        <meshStandardMaterial
          color="#111111"
          emissive={active ? '#00ff88' : '#000000'}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Register Name Label (White on Black) */}
      <Text
        position={[-0.4, 0.21, -0.2]}
        fontSize={0.18}
        color="#888"
        rotation={[-Math.PI / 2, 0, 0]}
        font="monospace"
      >
        {name}
      </Text>

      {/* Amber 7-Segment Digital Display */}
      <mesh position={[0.2, 0.1, 0.1]}>
        <boxGeometry args={[0.9, 0.25, 0.4]} />
        <meshStandardMaterial color="#221100" />
      </mesh>
      <Text
        position={[0.2, 0.23, 0.1]}
        fontSize={0.25}
        color="#ffaa00"
        rotation={[-Math.PI / 2, 0, 0]}
        font="monospace"
      >
        {displayValue.toString().padStart(4, '0')}
      </Text>

      {/* Detail: Chip Legs (Small metal pins) */}
      {[...Array(6)].map((_, i) => (
        <group key={i}>
          <mesh position={[-0.65 + i * 0.25, -0.2, 0.42]}>
            <boxGeometry args={[0.05, 0.4, 0.05]} />
            <meshStandardMaterial color="#888" />
          </mesh>
          <mesh position={[-0.65 + i * 0.25, -0.2, -0.42]}>
            <boxGeometry args={[0.05, 0.4, 0.05]} />
            <meshStandardMaterial color="#888" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
