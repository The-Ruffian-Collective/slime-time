import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { SlimeWorld } from '../engine/SlimeWorld'
import { useSlimeStore } from '../state/store'
import { getAllSlimeTypes } from '../content/slimeTypes'
import './App.css'

export function App() {
  const currentSlimeTypeId = useSlimeStore((s) => s.currentSlimeTypeId)
  const setSlimeType = useSlimeStore((s) => s.setSlimeType)

  // Keyboard shortcuts for testing slime types (keys 1-5)
  useEffect(() => {
    const slimeTypes = getAllSlimeTypes()
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key)
      if (key >= 1 && key <= 5) {
        const slimeType = slimeTypes[key - 1]
        if (slimeType) {
          setSlimeType(slimeType.id)
          console.log(`Switched to ${slimeType.name}`)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setSlimeType])

  return (
    <div style={{ width: '100vw', height: '100dvh', position: 'relative' }}>
      {/* Debug overlay for testing */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          color: 'white',
          background: 'rgba(0,0,0,0.5)',
          padding: '8px 12px',
          borderRadius: 4,
          fontSize: 14,
          zIndex: 1000,
          pointerEvents: 'none',
          fontFamily: 'monospace',
        }}
      >
        Slime Type: {currentSlimeTypeId} (Press 1-5 to switch)
      </div>

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
    </div>
  )
}
