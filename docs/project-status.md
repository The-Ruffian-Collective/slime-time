# Project Status: Slime Time

Last updated: 2026-02-18

## Current state

**Milestones 1–3 are complete, plus a UX refactor.** The app has a working slime engine, 5 slime type presets, audio, a create panel with add-ins, and a new toolbar + side-drawer UI that makes all features visible and accessible.

### What exists

```
package.json          # All deps installed (React 19, Three.js, r3f 9, drei 10, Zustand 5)
tsconfig.json         # Strict TypeScript
vite.config.ts        # Vite + React SWC
index.html            # iPad viewport meta, touch-action: none, viewport-fit: cover
eslint.config.js      # ESLint flat config
.prettierrc           # Prettier config
src/
  vite-env.d.ts       # Vite types + *.glsl?raw module declaration
  main.tsx            # React entry point
  app/
    App.tsx           # Fullscreen r3f Canvas + CreatePanel + Toolbar
    App.css           # Reset styles, --toolbar-height custom property
  state/
    store.ts          # Zustand store — touch, slime config, UI state (activePanel, soundEnabled, resetImprint)
  content/
    slimeTypes.ts     # 5 slime type presets (Milky, Clear, Metallic, Jiggly, Crunchy)
    addIns.ts         # 26 add-ins across 5 categories
  audio/
    audioEngine.ts    # Web Audio API — unlock on gesture, squish/drag/pop, mute/unmute
  ui/
    Toolbar.tsx       # Persistent bottom toolbar (Type, Colors, Add-ins, Sound, Reset, Save, Gallery)
    Toolbar.css       # Toolbar styles with safe-area padding
    CreatePanel.tsx   # Right-side sliding drawer, section-based content
    CreatePanel.css   # Drawer styles + all sub-component styles
    SlimeTypeSelector.tsx  # 5-card preset picker grid
    ColorSwatchPicker.tsx  # 18-color palette grid
    BlendSlider.tsx        # Gradient range input for color mix
    AddInsPanel.tsx        # Category tabs + item grid + density slider
  engine/
    SlimeWorld.tsx    # Scene composition — pointer events, TouchImprint + SlimeMesh
    TouchImprint.tsx  # Ping-pong RT imprint system (512x512, HalfFloat, priority -2, reset support)
    SlimeMesh.tsx     # 128x128 subdivided plane with slime surface shader (priority -1)
    usePointerTracker.ts  # Pointer -> UV mapper, audio triggers, single-touch
    AddInsRenderer.tsx    # InstancedMesh renderer for add-ins
    AddInInstances.tsx    # Per-item instance management
    shaders/
      imprintDecay.vert.glsl   # Fullscreen quad vertex shader
      imprintDecay.frag.glsl   # Decay + soft circular brush stamp (R channel)
      slimeSurface.vert.glsl   # Imprint-driven vertex displacement + normal perturbation
      slimeSurface.frag.glsl   # Two-color simplex noise, Half-Lambert + Blinn-Phong + Fresnel
```

### What works

- `npm run dev` starts clean, `npm run build` produces production bundle
- **Bottom toolbar** with 7 buttons always visible — Type, Colors, Add-ins, Sound, Reset, Save (placeholder), Gallery (placeholder)
- **Right-side drawer** slides in from the right when a toolbar panel button is tapped; shows section-specific content
- **Sound toggle** mutes/unmutes all audio via toolbar button
- **Reset** clears the imprint texture, returning slime to smooth state
- **5 distinct slime types** with unique shader parameters
- **Audio system** — squish on press, drag sound on move, pop on release
- **Add-ins** — 26 items across 5 categories rendered via InstancedMesh with seeded placement
- **Color customization** — two color pickers + blend slider
- Press/drag creates visible dents via GPU imprint texture, dents fade over time

### What is not yet built

- Save/load flow (no persistence layer)
- Gallery screen
- Export/screenshot
- PWA / offline support
- Low stimulation mode (audio engine supports it, but no UI toggle)
- Idle FPS throttling

## What to build next

**Milestone 4: Gallery and persistence** per `docs/plan.md`:

1. **Persistence layer** — create `src/storage/db.ts` using idb-keyval; implement save/load/delete for SlimeConfig + thumbnail blobs
2. **SlimeConfig schema** — add `id`, `name`, `createdAt` fields to the store; define the canonical save format
3. **Thumbnail generation** — render a small image from the canvas for gallery previews
4. **Save flow** — wire the Save toolbar button to serialize current config + generate thumbnail + write to IndexedDB
5. **Gallery screen** — grid of saved slimes with thumbnails; tap to load, long-press or edit mode to delete
6. **Navigation** — add `currentScreen` to store; Gallery toolbar button navigates to gallery view

After M4, remaining milestones are:
- **M5**: Export and share (screenshot, Web Share API)
- **M6**: PWA and performance hardening (service worker, offline, idle throttle)

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
- **UI state in store**: `activePanel` controls which drawer section is shown; toolbar and drawer are siblings that communicate via Zustand.

## Milestone exit criteria

### M1 (complete)
1. [x] `npm run dev` starts clean, no console errors
2. [x] Fullscreen colored slime surface renders
3. [x] Press creates visible dent
4. [x] Drag creates continuous trail of dents
5. [x] Release causes dents to fade over ~1–2 seconds
6. [x] No WebGL feedback loop warnings
7. [x] `npm run build` succeeds

### M2 (complete)
1. [x] Each slime type looks distinct
2. [x] Audio works reliably after first user interaction
3. [x] Squish sound on press, drag sound on move, pop on release
4. [x] Audio context unlocks on first pointer down
5. [x] `npm run build` succeeds

### M3 (complete)
1. [x] Create panel with slime type, colors, blend, add-ins
2. [x] Add-ins render in scene via InstancedMesh
3. [x] Add-ins feel stable and do not tank FPS
4. [x] `npm run build` succeeds

### UX refactor (complete)
1. [x] Bottom toolbar replaces FAB — all features have visible entry points
2. [x] Right-side drawer replaces bottom sheet
3. [x] Sound toggle works
4. [x] Reset clears imprint texture
5. [x] `npm run build` succeeds

## Reference docs

- `CLAUDE.md` — project overview, architecture, performance targets
- `docs/prd.md` — requirements, user journeys, acceptance criteria
- `docs/tdd.md` — full technical design (schemas, rendering approach, audio)
- `docs/plan.md` — all 6 milestones with tasks and exit checks
- `reference/context.md` — project origin and rationale
