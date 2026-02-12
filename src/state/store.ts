import { create } from 'zustand'
import * as THREE from 'three'
import { getSlimeType } from '../content/slimeTypes'

export interface TouchPoint {
  uv: THREE.Vector2
  pressure: number
  radius: number
}

export interface ActiveAddIn {
  addInId: string
  density: number
}

interface SlimeState {
  // Touch input (written by usePointerTracker, read by TouchImprint in useFrame)
  isPointerDown: boolean
  currentTouch: TouchPoint | null

  // Slime type and visuals (M2: now driven by slime type presets)
  currentSlimeTypeId: string
  colorA: THREE.Color
  colorB: THREE.Color
  mix: number

  // Add-ins
  addIns: ActiveAddIn[]
  seed: number

  // Actions
  setPointerDown: (down: boolean) => void
  setCurrentTouch: (touch: TouchPoint | null) => void
  setSlimeType: (typeId: string) => void
  setColors: (colorA: string, colorB: string, mix: number) => void
  setColorA: (hex: string) => void
  setColorB: (hex: string) => void
  setMix: (mix: number) => void
  addAddIn: (addInId: string) => void
  removeAddIn: (addInId: string) => void
  setGlobalDensity: (density: number) => void
}

export const useSlimeStore = create<SlimeState>((set) => {
  // Initialize with milky slime type
  const initialType = getSlimeType('milky')

  return {
    isPointerDown: false,
    currentTouch: null,

    currentSlimeTypeId: 'milky',
    colorA: new THREE.Color(initialType.defaultColorA),
    colorB: new THREE.Color(initialType.defaultColorB),
    mix: initialType.defaultMix,

    addIns: [],
    seed: Math.floor(Math.random() * 100000),

    setPointerDown: (down) => set({ isPointerDown: down }),
    setCurrentTouch: (touch) => set({ currentTouch: touch }),

    setSlimeType: (typeId) => {
      const slimeType = getSlimeType(typeId)
      set({
        currentSlimeTypeId: typeId,
        colorA: new THREE.Color(slimeType.defaultColorA),
        colorB: new THREE.Color(slimeType.defaultColorB),
        mix: slimeType.defaultMix,
      })
    },

    setColors: (colorA, colorB, mix) => {
      set({
        colorA: new THREE.Color(colorA),
        colorB: new THREE.Color(colorB),
        mix,
      })
    },

    setColorA: (hex) => set({ colorA: new THREE.Color(hex) }),
    setColorB: (hex) => set({ colorB: new THREE.Color(hex) }),
    setMix: (mix) => set({ mix }),

    addAddIn: (addInId) =>
      set((state) => ({
        addIns: [...state.addIns, { addInId, density: 0.5 }],
      })),
    removeAddIn: (addInId) =>
      set((state) => ({
        addIns: state.addIns.filter((a) => a.addInId !== addInId),
      })),
    setGlobalDensity: (density) =>
      set((state) => ({
        addIns: state.addIns.map((a) => ({ ...a, density })),
      })),
  }
})

/**
 * Helper to get current slime shader parameters from the store.
 * Use this in useFrame to avoid reactive re-renders.
 */
export function getCurrentSlimeParams() {
  const typeId = useSlimeStore.getState().currentSlimeTypeId
  const slimeType = getSlimeType(typeId)
  return {
    gloss: slimeType.gloss,
    translucency: slimeType.translucency,
    noiseScale: slimeType.noiseScale,
    depth: slimeType.depth,
  }
}
