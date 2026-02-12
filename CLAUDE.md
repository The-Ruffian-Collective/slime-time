# Slime Time

Kid-friendly digital slime simulator targeting iPad Safari. React + Three.js web app with offline-first PWA support.

## Tech Stack

- **Framework:** React + TypeScript, Vite
- **3D:** Three.js via @react-three/fiber, @react-three/drei
- **State:** Zustand (single central store)
- **Storage:** IndexedDB via idb-keyval (local-only, no cloud)
- **Audio:** Web Audio API
- **PWA:** Vite PWA plugin, service worker caching

## Development Commands

```bash
npm run dev       # Vite dev server
npm run build     # Production build
npm run preview   # Preview production build locally
```

Linting: ESLint + Prettier.

## Project Structure

```
src/
  app/        # Routes, screen layout, navigation
  ui/         # Components, panels, buttons, modals
  engine/     # SlimeWorld, SlimeMesh, TouchImprint, AddIns, shaders/
  content/    # slimeTypes.ts, addIns.ts, palettes.ts
  state/      # store.ts (Zustand)
  storage/    # db.ts (idb-keyval wrapper)
  audio/      # audioEngine.ts
  pwa/        # Manifest and service worker config
```

## Architecture

Six layers: UI, Engine, Content, Persistence, Audio, PWA.

**Data flow:** UI updates Zustand store -> Engine reads slime config from store and renders -> Storage saves/loads SlimeConfig + thumbnail blobs -> Audio reacts to input events.

### Touch Imprint System (core mechanic)

This is the "fake physics" approach — no real simulation. A GPU-side imprint texture creates the illusion of deformation:

1. Two WebGLRenderTargets in a ping-pong arrangement
2. Each frame: render previous imprint with a decay factor, draw current touch strokes on top, optional blur pass
3. The resulting imprint texture is passed as a uniform (`uImprintTex`) to the slime shader
4. Shader perturbs normals and depth to produce visible dents and trails
5. Decay creates natural recovery over time

Touch input: pointer events with `touch-action: none`, single-touch only for V1. Pointer x/y mapped to UV space, pressure from PointerEvent where supported.

### Slime Shader

Uniforms: `uImprintTex`, `uColorA`, `uColorB`, `uMix`, `uSlimeParams` (gloss, translucency, noise scale, depth), `uTime`. Five slime type presets (Milky, Clear, Metallic, Jiggly, Crunchy) each configure these differently.

### Add-ins Rendering

- InstancedMesh for all repeated items
- Seeded randomness for deterministic placement (saves reproduce exactly)
- Behaviours: floaty (bobbing), sinky (drift down), static (fixed)
- Instance count capped per density slider and performance budget

### Audio

- AudioContext created on first user gesture (pointer down)
- Gain node pools per category: master, squish, pops
- Triggers: press -> squish sample, drag -> looped texture sound, release -> pop
- Low stimulation mode reduces master gain and limits pop frequency

## Key Design Decisions

- **Fake physics via GPU imprint texture** — not a real material simulation. Shader reads a decaying imprint RT to produce dents and recovery. This is the entire physics model for V1.
- **Single-touch pointer events** — multitouch deferred to V2.
- **Offline-first, local-only data** — no accounts, no cloud sync, no tracking. IndexedDB stores SlimeConfig objects and thumbnail blobs.
- **Deterministic add-in placement** — a numeric seed stored in each SlimeConfig means saved slimes always look the same when loaded.

## Performance Targets

| Metric | Target |
|---|---|
| Active FPS | 60 fps on modern iPad |
| Idle FPS | Throttle to 30 fps after 2s no touch |
| Draw calls | < 50 |
| Imprint RT size | 512px baseline, 1024px optional |
| GPU cleanup | Dispose textures and geometries on unmount |

Avoid heavy post-processing. Use instancing for add-ins. Control render loop via rAF, minimize React re-renders in the engine layer.

## Documentation

- **PRD:** `docs/prd.md` — requirements, user journeys, acceptance criteria
- **TDD:** `docs/tdd.md` — architecture, schemas, rendering approach, audio system
- **Build Plan:** `docs/plan.md` — milestones, task breakdown, risk mitigations
- **Context:** `reference/context.md` — project origin, technical direction rationale
