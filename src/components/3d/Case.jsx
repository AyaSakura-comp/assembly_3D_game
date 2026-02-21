export function ApexCase({ children }) {
  return (
    <group>
      {/* Main Wedge Body */}
      <mesh position={[0, -2.8, 0]}>
        <boxGeometry args={[12, 0.8, 10]} />
        <meshStandardMaterial color="#e8e1d5" />
      </mesh>
      
      {/* Integrated Keyboard Slope */}
      <mesh position={[0, -2.5, 4]} rotation={[-Math.PI / 10, 0, 0]}>
        <boxGeometry args={[11, 0.4, 4]} />
        <meshStandardMaterial color="#dcd3c1" />
      </mesh>

      {/* Side Vents / Details */}
      <mesh position={[-6.1, -2.8, 0]}>
        <boxGeometry args={[0.2, 0.4, 6]} />
        <meshStandardMaterial color="#999" />
      </mesh>
      <mesh position={[6.1, -2.8, 0]}>
        <boxGeometry args={[0.2, 0.4, 6]} />
        <meshStandardMaterial color="#999" />
      </mesh>

      {children}
    </group>
  )
}
