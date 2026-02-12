# TDD: Slime Time Web App (V1)
Date: 2026-02-12

## 1. Summary
This document describes the technical architecture and implementation plan for a React + Three.js iPad-first slime simulator V1.

## 2. Tech stack
- Vite
- React + TypeScript
- Three.js via @react-three/fiber
- @react-three/drei for helpers
- Zustand for state
- IndexedDB via idb-keyval for persistence
- Web Audio API for sound
- PWA support using a Vite PWA plugin

## 3. High-level architecture
### Layers
1) UI layer (React components)
2) Engine layer (Three scene and shaders)
3) Content layer (data definitions)
4) Persistence layer (IndexedDB)
5) Audio layer (Web Audio)
6) PWA layer (service worker, manifest)

### Data flow
- UI updates a central state store
- Engine reads current slime config from store
- Engine renders slime and add-ins
- Storage saves and loads slime configs plus thumbnail blobs
- Audio reacts to input events and slime parameters

## 4. Project structure
Recommended folders:
- src/app
  - routes, screen layout, navigation
- src/ui
  - components, panels, buttons, modals
- src/engine
  - SlimeWorld.tsx
  - SlimeMesh.tsx
  - TouchImprint.ts
  - AddIns.tsx
  - shaders/
- src/content
  - slimeTypes.ts
  - addIns.ts
  - palettes.ts
- src/state
  - store.ts
- src/storage
  - db.ts
- src/audio
  - audioEngine.ts
- src/pwa
  - manifest and service worker config

## 5. Rendering approach
### 5.1 Slime representation
- A single mesh, likely a plane or low-poly sphere projected to screen
- Deformation is shader-driven, not geometry-heavy

### 5.2 Touch imprint system
Goal: create dents and trails using a texture that represents recent touch pressure and motion.

Implementation:
- Use two WebGLRenderTargets, ping-pong each frame
- Each frame:
  1) Render previous imprint texture to the next target with a decay factor
  2) Draw current touch strokes on top
  3) Optional blur pass for smoothing
- Provide the imprint texture to the slime material as a uniform

Suggested sizes:
- 512 for baseline iPad
- 1024 optional for higher-end devices, controlled by a quality setting

Touch data:
- pointer x and y mapped to UV space
- pressure uses pointer events where supported, fallback to constant
- brush radius scaled by device pixel ratio and a tuned setting

### 5.3 Slime shader
Shader inputs:
- uImprintTex: touch imprint texture
- uColorA, uColorB, uMix
- uSlimeParams: gloss, translucency, noise scale, depth
- uTime

Shader responsibilities:
- Use imprint tex to perturb normals and depth for dents
- Use procedural noise for subtle variation
- Compute specular highlights and subsurface feel
- Add per-slime type variations

### 5.4 Add-ins rendering
- Use InstancedMesh for repeated items
- Placement determined by a seed so it is deterministic
- Behaviour is mostly visual:
  - floaty: gentle bobbing
  - sinky: slow drift downward in screen space
  - static: fixed

Keep count modest:
- Cap total instances based on density and performance budget

## 6. Input handling on iPad
- Capture pointer events on a full-screen overlay or on the canvas
- Set CSS touch-action: none on the interactive area
- Use pointerId tracking for single touch V1
- Multitouch can be V2

Events:
- onPointerDown: start touch, unlock audio
- onPointerMove: update touch stroke positions
- onPointerUp: end touch

Smoothing:
- Use simple interpolation of points to avoid jitter
- Optionally generate intermediate points for fast swipes

## 7. State model
### 7.1 Core runtime state
- currentScreen: home, play, create, gallery
- currentSlime: SlimeConfig
- settings: soundEnabled, lowStimMode, qualityLevel

### 7.2 SlimeConfig schema
TypeScript shape:
- id: string
- name: string
- slimeTypeId: string
- colorA: string (hex)
- colorB: string (hex)
- mix: number (0..1)
- addIns: array of items, each item has addInId and density
- seed: number
- createdAt: ISO string

### 7.3 Gallery schema
- items: list of saved slime summaries with id, name, slimeTypeId, thumbnailKey, createdAt

Thumbnails:
- Store a small jpeg or webp blob in IndexedDB
- Store metadata in a separate record

## 8. Persistence layer
- Use idb-keyval for simplicity
- Keys:
  - slime:{id} => SlimeConfig
  - thumb:{id} => Blob
  - gallery:index => list of ids in order

Limits:
- Cap number of saves, for example 50
- Provide delete and clear operations

## 9. Audio system
### 9.1 Audio engine
- Create AudioContext on first user interaction
- Preload and decode short samples
- Use gain nodes per category
  - master
  - squish
  - pops
- Low stimulation mode reduces master gain and limits pop frequency

### 9.2 Trigger rules
- On press: squish sample, volume tied to dent depth
- On drag: looped texture sound with volume tied to velocity
- On release: soft pop or release sample

Avoid overlaps:
- Rate limit pops
- Reuse nodes or implement a simple pool

## 10. Performance and budgets
Targets for iPad:
- Active play: 60 fps where possible
- Idle: throttle to 30 fps after 2 seconds with no touch

Budgets:
- Draw calls: keep low, ideally under 50
- Imprint RT: 512 or 1024
- Add-ins instances: cap based on device

Techniques:
- Instancing for add-ins
- Avoid heavy post processing
- Dispose of textures and geometries on unmount
- Use requestAnimationFrame loop control, avoid extra React renders

## 11. PWA and offline
- Use a service worker to cache:
  - app shell
  - core assets
  - initial content data
- Cache strategy:
  - cache-first for assets
  - network-first for html if desired
- Offline fallback:
  - if offline and no cache, show a friendly screen

## 12. Testing strategy
### 12.1 Unit tests
- State helpers
- Storage read and write wrappers

### 12.2 Integration tests
- Save and load flows
- Thumbnail generation
- Share export fallback logic

### 12.3 Manual test checklist on iPad
- First tap unlocks audio
- Press, drag, release all respond
- Save, load, delete slimes
- Offline mode after initial load
- Export image works

## 13. Known risks
- iOS Safari audio quirks
- PWA limitations on iOS
- GPU memory pressure with large RT textures

Mitigations:
- Provide quality setting to reduce RT size
- Rate limit audio triggers
- Keep content lightweight
