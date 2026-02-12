import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { TouchImprint, type TouchImprintHandle } from './TouchImprint'
import { SlimeMesh } from './SlimeMesh'
import { usePointerTracker } from './usePointerTracker'

export function SlimeWorld() {
  const gl = useThree((s) => s.gl)
  const imprintRef = useRef<TouchImprintHandle>(null)
  const canvas = gl.domElement

  const { onPointerDown, onPointerMove, onPointerUp } =
    usePointerTracker(canvas)

  // Attach pointer events to the canvas element
  useEffect(() => {
    canvas.style.touchAction = 'none'

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
    }
  }, [canvas, onPointerDown, onPointerMove, onPointerUp])

  return (
    <>
      <TouchImprint ref={imprintRef} />
      <SlimeMesh imprintRef={imprintRef} />
    </>
  )
}
