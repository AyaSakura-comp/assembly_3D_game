import { Grid } from '@react-three/drei'

export function Motherboard({ children }) {
  return (
    <group>
      <Grid args={[20, 20]} cellColor="#003322" sectionColor="#005533" position={[0, -3.01, 0]} />
      {/* Placeholder for Task 3: PCB Traces and Base */}
      {children}
    </group>
  )
}
