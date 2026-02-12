import * as THREE from 'three'

/**
 * Mulberry32 — fast, deterministic 32-bit PRNG. Zero deps.
 */
export function mulberry32(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Simple string -> 32-bit hash for combining seed with addInId.
 */
export function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h
}

export interface InstanceData {
  x: number
  y: number
  z: number
  rotX: number
  rotY: number
  rotZ: number
  phase: number // animation phase offset
}

/**
 * Generate deterministic instance positions for one add-in type.
 */
export function generateInstances(
  globalSeed: number,
  addInId: string,
  count: number,
): InstanceData[] {
  const combinedSeed = (globalSeed + hashString(addInId)) | 0
  const rand = mulberry32(combinedSeed)
  const TAU = Math.PI * 2

  const instances: InstanceData[] = []
  for (let i = 0; i < count; i++) {
    instances.push({
      x: rand() * 1.8 - 0.9,
      y: rand() * 1.8 - 0.9,
      z: 0.05 + rand() * 0.1,
      rotX: rand() * TAU,
      rotY: rand() * TAU,
      rotZ: rand() * TAU,
      phase: rand(),
    })
  }
  return instances
}

// --- Geometry cache ---
const geoCache = new Map<string, THREE.BufferGeometry>()

export function getCachedGeometry(
  type: 'sphere' | 'box' | 'cone' | 'tetrahedron' | 'octahedron',
): THREE.BufferGeometry {
  let geo = geoCache.get(type)
  if (geo) return geo

  switch (type) {
    case 'sphere':
      geo = new THREE.SphereGeometry(1, 12, 8)
      break
    case 'box':
      geo = new THREE.BoxGeometry(0.4, 1, 0.4) // elongated for sprinkles
      break
    case 'cone':
      geo = new THREE.ConeGeometry(1, 1.5, 8)
      break
    case 'tetrahedron':
      geo = new THREE.TetrahedronGeometry(1)
      break
    case 'octahedron':
      geo = new THREE.OctahedronGeometry(1)
      break
  }

  geoCache.set(type, geo)
  return geo
}

export function disposeGeometryCache() {
  geoCache.forEach((geo) => geo.dispose())
  geoCache.clear()
}
