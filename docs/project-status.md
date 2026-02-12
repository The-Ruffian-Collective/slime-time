# Project Status: Slime Time

Last updated: 2026-02-12

## Current state

**Milestone 2 is complete!** All 5 slime type presets are implemented with distinct visual characteristics, and the audio system triggers sounds on press, drag, and release.

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
    App.tsx           # Fullscreen r3f Canvas, keyboard shortcuts (keys 1-5), debug overlay
    App.css           # Reset styles, touch-action none, black bg
  state/
    store.ts          # Zustand store — touch state, slime type, colors, actions
  content/
    slimeTypes.ts     # 5 slime type presets (Milky, Clear, Metallic, Jiggly, Crunchy)
  audio/
    audioEngine.ts    # Web Audio API — unlock on gesture, squish/drag/pop sounds
  engine/
    SlimeWorld.tsx    # Scene composition — pointer events, TouchImprint + SlimeMesh
    TouchImprint.tsx  # Ping-pong RT imprint system (512x512, HalfFloat, priority -2)
    SlimeMesh.tsx     # 128x128 subdivided plane with slime surface shader (priority -1)
    usePointerTracker.ts  # Pointer -> UV mapper, audio triggers, single-touch
    shaders/
      imprintDecay.vert.glsl   # Fullscreen quad vertex shader
      imprintDecay.frag.glsl   # Decay + soft circular brush stamp (R channel)
      slimeSurface.vert.glsl   # Imprint-driven vertex displacement + normal perturbation
      slimeSurface.frag.glsl   # Two-color simplex noise, Half-Lambert + Blinn-Phong + Fresnel
```

### What works

- `npm run dev` starts clean
- `npm run build` produces a production bundle
- `npx tsc --noEmit` passes with no errors
- **5 distinct slime types** switchable via keyboard (keys 1-5)
  - Milky: soft, opaque (gloss 0.5, translucency 0.2)
  - Clear: translucent, glass-like (gloss 0.9, translucency 0.8)
  - Metallic: shiny, mirror-like (gloss 1.0, translucency 0.1)
  - Jiggly: wobbly, extra displacement (depth 0.25)
  - Crunchy: textured, grainy (noise scale 8.0)
- **Audio system** unlocks on first touch
  - Squish sound on press (volume tied to pressure)
  - Drag sound on move (volume tied to velocity)
  - Pop sound on release (rate-limited to 150ms cooldown)
- Press/drag creates visible dents via GPU imprint texture
- Dents fade out over time via decay factor (0.97)
- No WebGL feedback loop warnings

### What could be tuned / improved

The core rendering works but may benefit from visual polish:
- Decay speed, brush radius, displacement depth (see tuning table below)
- Lighting intensity and specular response
- Noise animation speed and scale

## What to build next

Milestone 2 is complete. Next is **Milestone 3** per `docs/plan.md`. M3 covers:
- Create panel UI for slime type, colors, and mix amount
- Add-ins menu and density controls
- Add-ins rendering in scene (InstancedMesh with seeded placement)

### Tuning parameters

| Parameter | Current | Range | Effect |
|-----------|---------|-------|--------|
| `uDecay` | 0.97 | 0.90–0.995 | Recovery speed |
| `uBrushRadius` | 0.04 | 0.02–0.10 | Touch stamp size (UV space) |
| `uDepth` | 0.15 | 0.05–0.30 | Vertex displacement depth |
| Normal perturbation scale | 8.0 | 2.0–20.0 | How strongly dents affect lighting |
| Plane subdivisions | 128x128 | 64–256 | Smoothness vs vertex count |

### Key architecture notes

- **Ping-pong pattern**: Read from RT_A, write to RT_B, swap. Never read and write the same RT.
- **useFrame priorities**: TouchImprint at -2, SlimeMesh at -1, r3f default render at 0.
- **Non-reactive store reads**: `useSlimeStore.getState()` inside `useFrame`, never hook selectors.
- **Imprint texture is the entire physics model**: No simulation — dents are texture values that decay.

## Milestone 1 exit criteria

1. [x] `npm run dev` starts clean, no console errors
2. [x] Fullscreen colored slime surface renders (green/pink swirl from noise)
3. [x] Press creates visible dent (displacement + darkening + specular shift)
4. [x] Drag creates continuous trail of dents
5. [x] Release causes dents to fade over ~1–2 seconds
6. [x] No WebGL feedback loop warnings
7. [x] `npm run build` succeeds

## Milestone 2 exit criteria

1. [x] Each slime type looks distinct (shader params configured per type)
2. [x] Audio works reliably after first user interaction
3. [x] Squish sound on press (volume tied to pressure)
4. [x] Drag sound on move (volume tied to velocity)
5. [x] Pop sound on release (rate-limited)
6. [x] Audio context unlocks on first pointer down
7. [x] `npm run build` succeeds

## Reference docs

- `CLAUDE.md` — project overview, architecture, performance targets
- `docs/prd.md` — requirements, user journeys, acceptance criteria
- `docs/tdd.md` — full technical design (schemas, rendering approach, audio)
- `docs/plan.md` — all 6 milestones with tasks and exit checks
- `reference/context.md` — project origin and rationale
