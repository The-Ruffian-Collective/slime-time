import * as THREE from 'three'
import { useCallback, useRef } from 'react'
import { useSlimeStore } from '../state/store'

/**
 * Returns pointer event handlers that map clientX/Y to UV space
 * and write touch state to the Zustand store (non-reactive).
 * Single-touch only — tracks one pointerId at a time.
 */
export function usePointerTracker(canvas: HTMLCanvasElement | null) {
  const activePointerId = useRef<number | null>(null)

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

      const store = useSlimeStore.getState()
      store.setPointerDown(true)
      store.setCurrentTouch({
        uv,
        pressure: e.pressure > 0 ? e.pressure : 0.5,
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

      const store = useSlimeStore.getState()
      store.setPointerDown(false)
      store.setCurrentTouch(null)
    },
    [],
  )

  return { onPointerDown, onPointerMove, onPointerUp }
}
