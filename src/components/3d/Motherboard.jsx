export function Motherboard({ children }) {
  return (
    <group>
      {/* Slightly lighter dark green PCB */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#004433" />
      </mesh>
      
      <mesh position={[0, -0.49, -4.5]}>
        <boxGeometry args={[11.8, 0.1, 0.5]} />
        <meshStandardMaterial color="#005544" />
      </mesh>

      {children}
    </group>
  )
}
