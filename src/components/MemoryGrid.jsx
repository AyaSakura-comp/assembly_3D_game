import { Text } from '@react-three/drei'

export function MemoryGrid({ memory }) {
  return (
    <group position={[-3, -2, 0]}>
      {memory.map((val, i) => (
        <group key={i} position={[(i % 8) * 0.8, -Math.floor(i / 8) * 0.8, 0]}>
          <mesh>
            <boxGeometry args={[0.7, 0.7, 0.2]} />
            <meshStandardMaterial color={val !== 0 ? '#003388' : '#111133'} />
          </mesh>
          <Text position={[0, 0, 0.15]} fontSize={0.15} color="#88aaff">{val}</Text>
        </group>
      ))}
    </group>
  )
}
