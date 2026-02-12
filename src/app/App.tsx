import { Canvas } from '@react-three/fiber'
import { SlimeWorld } from '../engine/SlimeWorld'
import { CreatePanel } from '../ui/CreatePanel'
import './App.css'

export function App() {
  return (
    <div style={{ width: '100vw', height: '100dvh', position: 'relative' }}>
      <Canvas
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 2]}
        frameloop="always"
        orthographic
        camera={{
          left: -1,
          right: 1,
          top: 1,
          bottom: -1,
          near: 0.1,
          far: 10,
          position: [0, 0, 1],
        }}
      >
        <SlimeWorld />
      </Canvas>

      <CreatePanel />
    </div>
  )
}
