import * as THREE from 'three'
import { useCallback, useRef } from 'react'
import { useSlimeStore } from '../state/store'
import { audioEngine } from '../audio/audioEngine'

/**
 * Returns pointer event handlers that map clientX/Y to UV space
 * and write touch state to the Zustand store (non-reactive).
 * Single-touch only — tracks one pointerId at a time.
 *
 * M2: Also triggers audio on press, drag, release.
 */
export function usePointerTracker(canvas: HTMLCanvasElement | null) {
  const activePointerId = useRef<number | null>(null)
  const prevUV = useRef<THREE.Vector2 | null>(null)
  const isDragging = useRef(false)

  const toUV = useCallback(
    (e: PointerEvent): THREE.Vector2 | null => {
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      // Flip Y — UV origin is bottom-left, screen origin is top-left
      const y = 1.0 - (e.clientY - rect.top) / rect.height
      return new THREE.Vector2(x, y)
    },
    [canvas],
  )

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if (activePointerId.current !== null) return // already tracking
      activePointerId.current = e.pointerId
      ;(e.target as Element)?.setPointerCapture(e.pointerId)

      const uv = toUV(e)
      if (!uv) return

      // Unlock audio on first interaction
      audioEngine.unlock()

      // Play squish sound with pressure
      const pressure = e.pressure > 0 ? e.pressure : 0.5
      audioEngine.playSquish(pressure)

      prevUV.current = uv.clone()
      isDragging.current = false

      const store = useSlimeStore.getState()
      store.setPointerDown(true)
      store.setCurrentTouch({
        uv,
        pressure,
        radius: 0.04,
      })
    },
    [toUV],
  )

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (e.pointerId !== activePointerId.current) return

      const uv = toUV(e)
      if (!uv) return

      // Calculate velocity for audio
      let velocity = 0.5
      if (prevUV.current) {
        const distance = uv.distanceTo(prevUV.current)
        // Normalize distance to approximate velocity (0-1 range)
        velocity = Math.min(1.0, distance * 20)
      }

      // Start or update drag sound
      if (!isDragging.current && velocity > 0.05) {
        audioEngine.startDrag(velocity)
        isDragging.current = true
      } else if (isDragging.current) {
        audioEngine.updateDrag(velocity)
      }

      prevUV.current = uv.clone()

      useSlimeStore.getState().setCurrentTouch({
        uv,
        pressure: e.pressure > 0 ? e.pressure : 0.5,
        radius: 0.04,
      })
    },
    [toUV],
  )

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      if (e.pointerId !== activePointerId.current) return
      activePointerId.current = null

      // Stop drag sound and play pop
      if (isDragging.current) {
        audioEngine.stopDrag()
      }
      audioEngine.playPop()

      isDragging.current = false
      prevUV.current = null

      const store = useSlimeStore.getState()
      store.setPointerDown(false)
      store.setCurrentTouch(null)
    },
    [],
  )

  return { onPointerDown, onPointerMove, onPointerUp }
}
