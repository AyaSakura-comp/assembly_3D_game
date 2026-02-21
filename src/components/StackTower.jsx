import { Text } from '@react-three/drei'

export function StackTower({ stack }) {
  return (
    <group position={[4, -1, 0]}>
      <Text position={[0, stack.length * 0.7 + 0.5, 0]} fontSize={0.2} color="#ffaa00">STACK</Text>
      {stack.map((val, i) => (
        <group key={i} position={[0, i * 0.7, 0]}>
          <mesh>
            <boxGeometry args={[1, 0.6, 0.6]} />
            <meshStandardMaterial color="#553300" />
          </mesh>
          <Text position={[0, 0, 0.35]} fontSize={0.2} color="#ffaa00">{val}</Text>
        </group>
      ))}
    </group>
  )
}
