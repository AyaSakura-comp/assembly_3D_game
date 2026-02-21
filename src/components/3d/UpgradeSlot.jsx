import { Text } from '@react-three/drei'
import { useGameStore } from '../../store/gameStore'

const UPGRADES = [
  { id: 'efficiency', label: 'EFF', color: '#00aa66', description: 'Reduce cycle costs by 1' },
  { id: 'power', label: 'PWR', color: '#aa6600', description: '+5 damage on skills' },
  { id: 'shield', label: 'SHD', color: '#0066aa', description: '-3 damage taken' },
]

export function UpgradeSlot({ position = [2, 0.1, 1.5] }) {
  const activeUpgrade = useGameStore(s => s.activeUpgrade ?? null)

  return (
    <group position={position}>
      <Text position={[1.2, 1.2, -0.8]} fontSize={0.15} color="#ffaa00" rotation={[-Math.PI / 2, 0, 0]}>
        UPGRADE SLOTS
      </Text>

      {UPGRADES.map((upgrade, i) => {
        const isActive = activeUpgrade === upgrade.id
        return (
          <group key={upgrade.id} position={[i * 1.4, 0, 0]}>
            {/* Socket */}
            <mesh>
              <boxGeometry args={[1, 0.2, 0.8]} />
              <meshStandardMaterial color="#444444" />
            </mesh>

            {/* Chip (if active) */}
            {isActive && (
              <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[0.9, 0.2, 0.7]} />
                <meshStandardMaterial
                  color={upgrade.color}
                  emissive={upgrade.color}
                  emissiveIntensity={0.5}
                />
              </mesh>
            )}

            <Text
              position={[0, 0.3, 0]}
              fontSize={0.15}
              color={isActive ? upgrade.color : '#555555'}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              {upgrade.label}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

export { UPGRADES }
