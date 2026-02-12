import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useSlimeStore, getCurrentSlimeParams } from '../state/store'
import type { TouchImprintHandle } from './TouchImprint'

import slimeSurfaceVert from './shaders/slimeSurface.vert.glsl?raw'
import slimeSurfaceFrag from './shaders/slimeSurface.frag.glsl?raw'

interface SlimeMeshProps {
  imprintRef: React.RefObject<TouchImprintHandle | null>
}

export function SlimeMesh({ imprintRef }: SlimeMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: slimeSurfaceVert,
      fragmentShader: slimeSurfaceFrag,
      uniforms: {
        uImprintTex: { value: null },
        uDepth: { value: 0.15 },
        uColorA: { value: new THREE.Color('#7cdb5e') },
        uColorB: { value: new THREE.Color('#e84393') },
        uMix: { value: 0.3 },
        uGloss: { value: 0.8 },
        uTranslucency: { value: 0.4 },
        uNoiseScale: { value: 3.0 },
        uTime: { value: 0.0 },
      },
    })
  }, [])

  // Update uniforms every frame (non-reactive store reads)
  useFrame((_state, _delta) => {
    const { colorA, colorB, mix } = useSlimeStore.getState()
    const slimeParams = getCurrentSlimeParams()
    const u = material.uniforms

    // Imprint texture from the TouchImprint pass
    if (imprintRef.current) {
      u.uImprintTex.value = imprintRef.current.texture
    }

    u.uColorA.value.copy(colorA)
    u.uColorB.value.copy(colorB)
    u.uMix.value = mix
    u.uGloss.value = slimeParams.gloss
    u.uTranslucency.value = slimeParams.translucency
    u.uNoiseScale.value = slimeParams.noiseScale
    u.uDepth.value = slimeParams.depth
    u.uTime.value += 0.016 // ~60fps tick for noise animation
  }, -1)

  // Cleanup
  useEffect(() => {
    return () => {
      material.dispose()
    }
  }, [material])

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[2, 2, 128, 128]} />
    </mesh>
  )
}
