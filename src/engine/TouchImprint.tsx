import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useEffect,
} from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useSlimeStore } from '../state/store'

import imprintDecayVert from './shaders/imprintDecay.vert.glsl?raw'
import imprintDecayFrag from './shaders/imprintDecay.frag.glsl?raw'

export interface TouchImprintHandle {
  get texture(): THREE.Texture
}

const RT_SIZE = 512

export const TouchImprint = forwardRef<TouchImprintHandle>(
  function TouchImprint(_props, ref) {
    const gl = useThree((s) => s.gl)

    // Ping-pong render targets
    const rts = useMemo(() => {
      const opts: THREE.RenderTargetOptions = {
        type: THREE.HalfFloatType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: false,
        stencilBuffer: false,
      }
      return [
        new THREE.WebGLRenderTarget(RT_SIZE, RT_SIZE, opts),
        new THREE.WebGLRenderTarget(RT_SIZE, RT_SIZE, opts),
      ]
    }, [])

    const pingPong = useRef(0)

    // Offscreen scene: ortho camera + fullscreen quad with decay shader
    const { scene, camera, material } = useMemo(() => {
      const s = new THREE.Scene()
      const c = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      const m = new THREE.ShaderMaterial({
        vertexShader: imprintDecayVert,
        fragmentShader: imprintDecayFrag,
        uniforms: {
          uPrevImprint: { value: null },
          uDecay: { value: 0.97 },
          uTouchPos: { value: new THREE.Vector2(0, 0) },
          uBrushRadius: { value: 0.04 },
          uPressure: { value: 0.0 },
          uIsDown: { value: 0.0 },
        },
        depthTest: false,
        depthWrite: false,
      })

      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), m)
      s.add(quad)

      return { scene: s, camera: c, material: m }
    }, [])

    // Expose current readable texture
    useImperativeHandle(
      ref,
      () => ({
        get texture() {
          // The readable RT is the one we just wrote to
          return rts[pingPong.current].texture
        },
      }),
      [rts],
    )

    // Render imprint each frame at priority -2 (before SlimeMesh at -1)
    useFrame(() => {
      const readIdx = pingPong.current
      const writeIdx = 1 - readIdx

      // Read touch state from store (non-reactive)
      const { isPointerDown, currentTouch, shouldResetImprint, clearResetImprint } =
        useSlimeStore.getState()

      // Handle reset request
      if (shouldResetImprint) {
        gl.setRenderTarget(rts[0])
        gl.clear(true, false, false)
        gl.setRenderTarget(rts[1])
        gl.clear(true, false, false)
        gl.setRenderTarget(null)
        clearResetImprint()
        return
      }

      const u = material.uniforms
      u.uPrevImprint.value = rts[readIdx].texture
      u.uIsDown.value = isPointerDown ? 1.0 : 0.0

      if (currentTouch) {
        u.uTouchPos.value.set(currentTouch.uv.x, currentTouch.uv.y)
        u.uPressure.value = currentTouch.pressure
        u.uBrushRadius.value = currentTouch.radius
      }

      // Render decay + stamp into write target
      gl.setRenderTarget(rts[writeIdx])
      gl.render(scene, camera)
      gl.setRenderTarget(null)

      // Swap
      pingPong.current = writeIdx
    }, -2)

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        rts[0].dispose()
        rts[1].dispose()
        material.dispose()
      }
    }, [rts, material])

    // This component renders nothing visible — it's an offscreen pass
    return null
  },
)
