import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AddInDef } from '../content/addIns'
import { generateInstances, getCachedGeometry } from './addInsHelpers'

const MAX_INSTANCES = 150
const TAU = Math.PI * 2
const _obj = new THREE.Object3D()

interface Props {
  addIn: AddInDef
  density: number
  seed: number
}

export function AddInInstances({ addIn, density, seed }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const count = Math.max(1, Math.round(MAX_INSTANCES * density))

  const instances = useMemo(
    () => generateInstances(seed, addIn.id, MAX_INSTANCES),
    [seed, addIn.id],
  )

  const geometry = useMemo(
    () => getCachedGeometry(addIn.geometryType),
    [addIn.geometryType],
  )

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: addIn.color,
      metalness: addIn.metalness,
      roughness: addIn.roughness,
    })
  }, [addIn.color, addIn.metalness, addIn.roughness])

  // Clean up material on unmount
  useEffect(() => {
    return () => {
      material.dispose()
    }
  }, [material])

  // Set initial matrices and animate
  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return

    const time = clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
      const inst = instances[i]
      let x = inst.x
      let y = inst.y
      const z = inst.z

      if (addIn.behaviour === 'floaty') {
        y += Math.sin(time * 1.5 + inst.phase * TAU) * 0.04
      } else if (addIn.behaviour === 'sinky') {
        // Drift down, wrap around
        const drift = ((time * 0.03 + inst.phase * 10) % 2.4) - 1.2
        y = inst.y - drift
        if (y < -1.2) y += 2.4
        if (y > 1.2) y -= 2.4
      }
      // static: no animation

      _obj.position.set(x, y, z)
      _obj.rotation.set(inst.rotX, inst.rotY, inst.rotZ)
      _obj.scale.setScalar(addIn.scale)
      _obj.updateMatrix()
      mesh.setMatrixAt(i, _obj.matrix)
    }

    mesh.count = count
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, MAX_INSTANCES]}
      frustumCulled={false}
    />
  )
}
