export function Motherboard({ children }) {
  return (
    <group position={[0, 0.01, 0]}>
      {/* PCB that fits neatly on the Case top */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11, 9]} />
        <meshStandardMaterial color="#004433" />
      </mesh>
      
      {/* Decorative Edge Detail */}
      <mesh position={[0, 0.05, -4.4]}>
        <boxGeometry args={[10.5, 0.1, 0.2]} />
        <meshStandardMaterial color="#005544" />
      </mesh>

      {children}
    </group>
  )
}
