import { useRef, useState } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../store/gameStore'

export function BossMachine() {
  const meshRef = useRef()
  const prevHp = useRef(100)
  const [flickerTime, setFlickerTime] = useState(0)
  const bossHp = useGameStore(s => s.bossHp)

  useFrame((_, delta) => {
    // Detect hit (HP decreased)
    if (bossHp < prevHp.current) {
      setFlickerTime(0.5)
    }
    prevHp.current = bossHp

    // Flicker effect when hit
    if (flickerTime > 0) {
      setFlickerTime(t => Math.max(0, t - delta))
      if (meshRef.current) {
        meshRef.current.material.emissive.setHex(0xff2200)
        meshRef.current.material.emissiveIntensity = Math.abs(2 * Math.sin(Date.now() / 30))
      }
    } else if (meshRef.current) {
      meshRef.current.material.emissive.setHex(0x000000)
      meshRef.current.material.emissiveIntensity = 0
    }
  })

  return (
    <group position={[0, 0, -18]}>
      {/* IBM PC style horizontal box */}
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[8, 1.2, 5]} />
        <meshStandardMaterial
          color="#3a3a3a"
          emissive="#000000"
          emissiveIntensity={0}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Drive bay details */}
      <mesh position={[-2, 0.6, 2.51]}>
        <boxGeometry args={[2, 0.3, 0.02]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[-2, 0.2, 2.51]}>
        <boxGeometry args={[2, 0.3, 0.02]} />
        <meshStandardMaterial color="#444444" />
      </mesh>

      {/* Power LED */}
      <mesh position={[3, 0.8, 2.51]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>

      {/* CRT Monitor on top */}
      <group position={[0, 2.2, 0]}>
        {/* Monitor body */}
        <mesh>
          <boxGeometry args={[5, 4, 4]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.4} />
        </mesh>

        {/* Curved glass screen (approximate with a slightly scaled box) */}
        <mesh position={[0, 0.2, 2.01]}>
          <boxGeometry args={[3.8, 3, 0.1]} />
          <meshStandardMaterial
            color="#001100"
            emissive="#003300"
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* Screen text */}
        <Text
          position={[0, 0.8, 2.12]}
          fontSize={0.4}
          color="#00ff44"
          anchorX="center"
        >
          OBELISK-X
        </Text>
        <Text
          position={[0, 0, 2.12]}
          fontSize={0.3}
          color="#00ff44"
          anchorX="center"
        >
          {`HP: ${bossHp}`}
        </Text>
        <Text
          position={[0, -0.6, 2.12]}
          fontSize={0.2}
          color="#00aa33"
          anchorX="center"
        >
          {'> READY_'}
        </Text>

        {/* Monitor bezel edges */}
        <mesh position={[0, -1.8, 0.5]}>
          <boxGeometry args={[5.2, 0.4, 1]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>
    </group>
  )
}
