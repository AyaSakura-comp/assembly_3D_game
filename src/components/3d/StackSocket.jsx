import { Text } from '@react-three/drei'

export function StackSocket({ stack }) {
  // Vertical tower relative to motherboard (Y=0)
  return (
    <group position={[4, 0, 0]}>
      {/* Base socket soldered to PCB */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.4, 0.2, 1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Vertical guide rails */}
      <mesh position={[-0.6, 1.2, 0]}>
        <boxGeometry args={[0.08, 2.4, 0.08]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[0.6, 1.2, 0]}>
        <boxGeometry args={[0.08, 2.4, 0.08]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      <Text position={[0, 2.6, 0]} fontSize={0.18} color="#ffaa00" rotation={[-Math.PI / 2, 0, 0]}>
        STACK
      </Text>
      {stack.map((val, i) => (
        <group key={i} position={[0, i * 0.4 + 0.3, 0]}>
          <mesh>
            <boxGeometry args={[1, 0.35, 0.6]} />
            <meshStandardMaterial color="#553300" />
          </mesh>
          <Text position={[0, 0, 0.31]} fontSize={0.2} color="#ffaa00">{val}</Text>
        </group>
      ))}
    </group>
  )
}
