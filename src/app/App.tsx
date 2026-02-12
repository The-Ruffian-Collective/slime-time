import { Canvas } from '@react-three/fiber'
import './App.css'

function Placeholder() {
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial color="#1a1a2e" />
    </mesh>
  )
}

export function App() {
  return (
    <div style={{ width: '100vw', height: '100dvh' }}>
      <Canvas
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 2]}
        frameloop="always"
        camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
      >
        <Placeholder />
      </Canvas>
    </div>
  )
}
