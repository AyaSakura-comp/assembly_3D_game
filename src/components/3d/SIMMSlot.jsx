import { Text } from '@react-three/drei'

export function SIMMSlot({ memory }) {
  return (
    <group position={[-3, 0, 1]}>
      {/* Label */}
      <Text position={[2.8, 0.1, -0.6]} fontSize={0.15} color="#ffaa00" rotation={[-Math.PI / 2, 0, 0]}>
        MEMORY
      </Text>

      {memory.map((val, i) => {
        const col = i % 8
        const row = Math.floor(i / 8)
        return (
          <group key={i} position={[col * 0.8, 0, row * 1.2]}>
            {/* SIMM socket on PCB */}
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.65, 0.1, 0.3]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
            {/* Vertical SIMM stick */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.6, 0.8, 0.08]} />
              <meshStandardMaterial color={val !== 0 ? '#003388' : '#1a1a33'} />
            </mesh>
            {/* Value label */}
            <Text
              position={[0, 0.5, 0.05]}
              fontSize={0.18}
              color={val !== 0 ? '#88aaff' : '#334466'}
            >
              {val}
            </Text>
          </group>
        )
      })}
    </group>
  )
}
