import { create } from 'zustand'
import * as THREE from 'three'

export interface TouchPoint {
  uv: THREE.Vector2
  pressure: number
  radius: number
}

interface SlimeState {
  // Touch input (written by usePointerTracker, read by TouchImprint in useFrame)
  isPointerDown: boolean
  currentTouch: TouchPoint | null

  // Slime visuals (hardcoded defaults for M1, configurable in M3)
  colorA: THREE.Color
  colorB: THREE.Color
  mix: number
  slimeParams: {
    gloss: number
    translucency: number
    noiseScale: number
    depth: number
  }

  // Actions
  setPointerDown: (down: boolean) => void
  setCurrentTouch: (touch: TouchPoint | null) => void
}

export const useSlimeStore = create<SlimeState>((set) => ({
  isPointerDown: false,
  currentTouch: null,

  colorA: new THREE.Color('#7cdb5e'),
  colorB: new THREE.Color('#e84393'),
  mix: 0.3,
  slimeParams: {
    gloss: 0.8,
    translucency: 0.4,
    noiseScale: 3.0,
    depth: 0.15,
  },

  setPointerDown: (down) => set({ isPointerDown: down }),
  setCurrentTouch: (touch) => set({ currentTouch: touch }),
}))
