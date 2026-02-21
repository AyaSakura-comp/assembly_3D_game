export function ApexCase({ children }) {
  return (
    <group>
      {/* Main Wedge Body - Top surface at Y=0 */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[12, 1, 10]} />
        <meshStandardMaterial color="#e8e1d5" />
      </mesh>
      
      {/* Integrated Keyboard Slope - Slightly forward and down */}
      <mesh position={[0, -0.3, 4]} rotation={[-Math.PI / 10, 0, 0]}>
        <boxGeometry args={[11, 0.6, 4]} />
        <meshStandardMaterial color="#dcd3c1" />
      </mesh>

      {/* Side Detail Vents */}
      <mesh position={[-6.05, -0.5, 0]}>
        <boxGeometry args={[0.1, 0.6, 6]} />
        <meshStandardMaterial color="#999" />
      </mesh>
      <mesh position={[6.05, -0.5, 0]}>
        <boxGeometry args={[0.1, 0.6, 6]} />
        <meshStandardMaterial color="#999" />
      </mesh>

      {children}
    </group>
  )
}
