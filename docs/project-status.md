# Project Status: Slime Time

Last updated: 2026-02-12

## Current state

Milestone 1 is partially complete. The project scaffold, app shell, and state store are done. The engine (shaders, touch imprint, slime mesh) still needs to be built.

### What exists

```
package.json          # All deps installed (React 19, Three.js, r3f 9, drei 10, Zustand 5)
tsconfig.json         # Strict TypeScript
vite.config.ts        # Vite + React SWC
index.html            # iPad viewport meta, touch-action: none
eslint.config.js      # ESLint flat config
.prettierrc           # Prettier config
src/
  vite-env.d.ts       # Vite types + *.glsl?raw module declaration
  main.tsx            # React entry point
  app/
    App.tsx           # Fullscreen r3f Canvas (antialias off, alpha off, dpr [1,2])
    App.css           # Reset styles, touch-action none, black bg
  state/
    store.ts          # Zustand store — touch state + slime visual params
  engine/
    shaders/          # Empty — shaders go here
```

### What works

- `npm run dev` starts clean
- `npm run build` produces a production bundle
- `npx tsc --noEmit` passes with no errors
- Canvas renders a dark placeholder plane fullscreen

### What does NOT exist yet

The engine layer — the core of Milestone 1. No shaders, no touch imprint system, no slime mesh, no input handling.

## What to build next

Continue Milestone 1 from **Step 4** in the plan file (`.claude/plans/optimized-gathering-gizmo.md`). That plan has full specifications for every remaining file.

### Remaining steps (Steps 4–8)

**Step 4: GLSL shaders** — Create 4 shader files in `src/engine/shaders/`:
- `imprintDecay.vert.glsl` — fullscreen quad vertex shader
- `imprintDecay.frag.glsl` — decay previous imprint (multiply by 0.97), stamp soft circular brush at touch position. R channel = imprint intensity. Additive, clamped to 1.5.
- `slimeSurface.vert.glsl` — read imprint R channel, displace vertices along Z by `-imprint * uDepth`. Compute perturbed normals via finite differences (4 neighbor samples).
- `slimeSurface.frag.glsl` — two-color blend with simplex noise swirl. Half-Lambert diffuse, Blinn-Phong specular, Fresnel rim for subsurface. Darken dented areas. Gamma correction.

Import shaders with `?raw` suffix (type declaration already exists in `vite-env.d.ts`).

**Step 5: Pointer input hook** — `src/engine/usePointerTracker.ts`
- Returns `{ onPointerDown, onPointerMove, onPointerUp }` handlers
- Single-touch via `pointerId` tracking
- Maps `clientX/Y` to 0..1 UV space (Y flipped — UV origin bottom-left)
- `setPointerCapture` for reliable drag tracking
- Pressure fallback to 0.5 (iPad finger touch reports 0)
- Writes to store via `useSlimeStore.getState()` (non-reactive)

**Step 6: Touch imprint system** — `src/engine/TouchImprint.tsx`
- Two `WebGLRenderTarget`s (512x512, `HalfFloatType`, `LinearFilter`, no depth/stencil)
- Own offscreen `THREE.Scene` + `OrthographicCamera` with 2x2 quad + decay shader
- `useFrame` at priority `-2`: read touch from store, set uniforms, render to writeRT, swap ping-pong index
- Expose current texture via `forwardRef` + `useImperativeHandle` (getter)
- Dispose RTs and material on unmount

**Step 7: Slime mesh** — `src/engine/SlimeMesh.tsx`
- `PlaneGeometry(2, 2, 128, 128)` with custom `ShaderMaterial`
- Takes `imprintRef` prop, reads `.texture` inside `useFrame` at priority `-1`
- Updates all uniforms from store every frame (non-reactive `getState()`)

**Step 8: Scene composition** — `src/engine/SlimeWorld.tsx`
- Replace the `Placeholder` in `App.tsx` with `<SlimeWorld />`
- Orthographic camera `(-1, 1, 1, -1, 0.1, 10)` at `[0, 0, 1]`
- Compose: `<TouchImprint ref={imprintRef} />` + `<SlimeMesh imprintRef={imprintRef} />`
- `useEffect` attaching pointer handlers to `gl.domElement` (include `pointercancel`)
- Set `canvas.style.touchAction = 'none'`

### Key architecture notes for the engine

- **Ping-pong pattern**: Read from RT_A, write to RT_B, swap. Never read and write the same RT (WebGL feedback loop).
- **useFrame priorities**: TouchImprint at -2 (runs first), SlimeMesh at -1 (reads fresh texture), r3f default render at 0.
- **Non-reactive store reads**: Always use `useSlimeStore.getState()` inside `useFrame`, never hook selectors — React re-renders kill 60fps.
- **Imprint texture is the entire physics model**: There is no simulation. Dents are just values in a texture that decay each frame.

### Zustand store (already built)

`src/state/store.ts` exports `useSlimeStore` with:
- `isPointerDown: boolean` / `currentTouch: TouchPoint | null` — written by input, read by TouchImprint
- `colorA` / `colorB` / `mix` — default green (#7cdb5e) / pink (#e84393) / 0.3
- `slimeParams` — `{ gloss: 0.8, translucency: 0.4, noiseScale: 3.0, depth: 0.15 }`
- `TouchPoint` = `{ uv: Vector2, pressure: number, radius: number }`

### Tuning parameters

| Parameter | Start | Range | Effect |
|-----------|-------|-------|--------|
| `uDecay` | 0.97 | 0.90–0.995 | Recovery speed |
| `uBrushRadius` | 0.04 | 0.02–0.10 | Touch stamp size (UV space) |
| `uDepth` | 0.15 | 0.05–0.30 | Vertex displacement depth |
| Normal perturbation scale | 8.0 | 2.0–20.0 | How strongly dents affect lighting |
| Plane subdivisions | 128x128 | 64–256 | Smoothness vs vertex count |

## Milestone 1 exit criteria

All of these must be true:
1. `npm run dev` starts clean, no console errors
2. Fullscreen colored slime surface renders (green/pink swirl from noise)
3. Press creates visible dent (displacement + darkening + specular shift)
4. Drag creates continuous trail of dents
5. Release causes dents to fade over ~1–2 seconds
6. No WebGL feedback loop warnings
7. `npm run build` succeeds

## Reference docs

- `CLAUDE.md` — project overview, architecture, performance targets
- `docs/prd.md` — requirements, user journeys, acceptance criteria
- `docs/tdd.md` — full technical design (schemas, rendering approach, audio)
- `docs/plan.md` — all 6 milestones with tasks and exit checks
- `reference/context.md` — project origin and rationale
- `.claude/plans/optimized-gathering-gizmo.md` — detailed M1 implementation plan with shader code specs
