import { Text } from '@react-three/drei'

export function StackSocket({ stack }) {
  // Vertical tower relative to motherboard (Y=0)
  return (
    <group position={[4, 0, 1]}>
      <Text position={[0, 3, 0]} fontSize={0.2} color="#ffaa00">STACK</Text>
      {stack.map((val, i) => (
        <group key={i} position={[0, i * 0.4 + 0.2, 0]}>
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
