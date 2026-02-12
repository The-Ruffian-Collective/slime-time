# V1 Build Plan: Slime Time Web App (iPad-first)
Date: 2026-02-12

Owner: The AI Chef Guy  
Assistant: Dev Ruffian

## 0. Goal
Build a kid-friendly, offline-capable V1 prototype of a slime simulator that runs great on iPad using React + Three.js. V1 focuses on the "toy feel" and core create and play loop, not monetisation.

## 1. Target platform and constraints
- Primary: iPad Safari (latest iPadOS supported by current devices)
- Secondary: iPhone Safari, desktop Chrome for dev
- Packaging: Web app plus PWA install (Add to Home Screen)
- Offline: Works fully offline after first load
- Data: Local-only saves using IndexedDB

## 2. V1 scope
### Must have
- Fullscreen slime play scene
- Touch interactions
  - Press creates dent
  - Drag creates smear or trail
  - Release eases back over time
- 5 slime types (shader and motion presets)
  - Milky
  - Clear
  - Metallic
  - Jiggly
  - Crunchy (visual crunch only)
- Colour mixing
  - Two colours plus blend amount
- Add-ins
  - 20 to 40 add-ins, visual only at first
  - Density slider
- Save to gallery
  - Create and save slime
  - Load slime
  - Delete slime
- Screenshot export
  - Save image to Photos or download
  - Share sheet where supported
- Settings
  - Sound on or off
  - Reset slime
  - Low stimulation mode (reduced audio intensity)

### Nice to have if time allows
- Basic "daily chest" reward purely local
- Simple "Lulu quest" recipe request mode without economy

### Explicitly out of scope for V1
- Ads, tracking, analytics
- Accounts, cloud sync
- Real physics mixing, clumping, collisions
- Live events, server content pushes
- Complex mini games beyond one light bonus mode

## 3. Success criteria
- On iPad, interaction feels responsive and satisfying
- Stable 60 fps during active play on modern iPads
- No noticeable lag on first touch and audio starts on first tap
- Gallery saves persist after refresh and after offline use
- A child can create, save, load, and play with no guidance

## 4. Milestones
### Milestone 1: Core toy feel (engine skeleton)
Output:
- React app boots and shows a fullscreen canvas
- Slime mesh renders with placeholder shader
- Touch imprint system writes to a render target
- Simple dent and trail visible

Tasks:
- Setup Vite + React + @react-three/fiber
- Implement SlimeWorld scene
- Implement TouchImprint ping-pong RT
- Add pointer event capture with touch-action disabled

Exit check:
- Press and drag affects slime surface
- Slime recovers over time

### Milestone 2: Visual and audio polish
Output:
- Final-ish slime shader with highlights and depth
- 5 presets as config data
- Audio on press, drag, release with volume tied to movement

Tasks:
- Shader parameters per slime type
- Web Audio setup, unlock on first gesture
- SFX bank and mapping rules

Exit check:
- Each slime type looks distinct
- Audio works reliably after first user interaction

### Milestone 3: Create UI and add-ins
Output:
- Create panel for slime type, colours, mix amount
- Add-ins menu and density
- Add-ins render in scene

Tasks:
- Content registry for add-ins
- InstancedMesh or sprite batching for add-ins
- Seeded randomness so a saved slime looks the same when loaded

Exit check:
- Add-ins feel stable and do not tank FPS

### Milestone 4: Gallery and persistence
Output:
- Save and load slimes
- Thumbnails
- Delete

Tasks:
- IndexedDB storage layer
- Thumbnail renderer from the canvas or a dedicated render pass

Exit check:
- Saved slimes survive refresh and offline mode

### Milestone 5: Export and share
Output:
- Screenshot export
- Share integration

Tasks:
- Canvas toBlob export
- Web Share API with fallback

Exit check:
- Export works on iPad, fallback works on desktop

### Milestone 6: PWA and performance hardening
Output:
- Installable PWA
- Offline caching
- Performance budgets enforced

Tasks:
- Service worker caching
- Memory cleanup for textures and audio buffers
- Render loop throttling to 30 fps when idle

Exit check:
- Works offline
- Battery usage reasonable

## 5. Work breakdown
### Repo and tooling
- Vite + React + TypeScript
- eslint and prettier
- basic CI checks on push

### Key modules
- ui
  - screens, panels, gallery, settings
- engine
  - scene, shader, touch imprint, add-ins renderer
- content
  - slime types, add-ins definitions, palettes
- storage
  - indexeddb wrapper
- audio
  - web audio setup and sfx routing
- pwa
  - service worker, manifest, icons

## 6. Risk list and mitigations
- iPad Safari performance
  - Use InstancedMesh, keep textures small, reduce post effects
- Audio latency or not playing
  - Unlock audio on first tap, keep buffers short, reuse nodes
- Touch feels wrong
  - Tune imprint decay, dent depth, recovery speed, smoothing
- Large gallery storage
  - Limit number of saved slimes or compress thumbnails

## 7. Definition of done for V1
- All Must have items complete
- Runs on iPad with stable interaction and no major bugs
- Readme includes local dev steps and basic troubleshooting
