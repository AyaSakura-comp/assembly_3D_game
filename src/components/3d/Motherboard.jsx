export function Motherboard({ children }) {
  return (
    <group>
      {/* Dark Green PCB Base */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#003322" />
      </mesh>
      
      {/* Decorative Motherboard Details (Edge) */}
      <mesh position={[0, -2.99, -4.5]}>
        <boxGeometry args={[11.8, 0.1, 0.5]} />
        <meshStandardMaterial color="#004433" />
      </mesh>

      {children}
    </group>
  )
}
