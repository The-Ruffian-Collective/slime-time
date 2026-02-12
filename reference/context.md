# Context: Slime Time Web App (V1)
Date: 2026-02-12

## 1. Why this exists
Paulie's kid wants a replica or similar experience to the iOS app "Super Slime Simulator". The goal is to build a V1 prototype that captures the core feel: touch-driven slime play, simple customisation, and saving favourites.

## 2. What we observed about the reference app (publicly visible)
The reference app is a digital slime toy with:
- Slime play with satisfying audio and touch reactions
- Multiple slime types and visual styles
- Decorations and add-ins
- A gallery of saved slimes
- Extra modes like quests, games, photo-to-slime, and painting
- A monetisation layer in the commercial product (ads and purchases)

We cannot see their source code. The internal implementation details below are inferred from typical patterns for this genre.

## 3. Core loop to copy for V1
1) Create slime (type, colours, add-ins)  
2) Play with slime (press, drag, recover)  
3) Save and reload from a gallery  
4) Export a screenshot (optional)

Everything else is optional for later.

## 4. V1 platform and constraints
- Must run well on iPad
- iPad Safari is the primary target
- Offline support is required after first load
- Data stays on-device (no accounts, no cloud)
- Child-friendly UI: big controls, minimal reading, no failure states
- Avoid ads and tracking for the kid version

## 5. Technical direction for V1
Preferred stack for V1:
- React + Three.js (via react-three-fiber)
- Shader-driven slime feel using a touch imprint texture
- Instanced rendering for add-ins to keep performance strong on iPad
- IndexedDB for saves and thumbnails
- Web Audio for satisfying squish and pop sounds
- PWA for install-like behaviour and offline caching

Why this direction:
- Paulie is already comfortable with React and Three.js
- Shader-driven goo can look and feel great without heavy physics
- Fast iteration for a prototype

## 6. Key technical idea: fake physics with the GPU
We do not try to simulate real slime physics in V1.

Instead:
- Maintain a touch imprint texture in a render target
- The slime shader reads the imprint texture to create dents and trails
- The imprint decays over time to create recovery
This produces a convincing slime interaction on mobile without complex simulation.

## 7. What is deferred to V2+
These are intentionally not part of V1:
- Real mixing physics, clumping, collisions for add-ins
- Multi-touch pinch and advanced gestures
- Quests, mini games, photo-to-slime, painting
- Monetisation, ads, analytics, tracking
- Cloud sync and accounts
If V1 lands well and performance is solid, these can be layered on later.

## 8. When a switch to Unity becomes attractive
Consider Unity later if we need:
- More realistic material behaviour
- More complex add-in physics
- Consistent haptics and audio timing across devices
- Content-heavy mini games and event systems
For now, web tech is the fastest way to a high quality prototype.
