# Slime Time

A kid-friendly digital slime simulator targeting iPad Safari. Touch, squish, and customize virtual slime with different types, colors, and add-ins.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview the production build locally |

## Tech stack

React 19, TypeScript, Three.js (via @react-three/fiber), Zustand, Vite

## How it works

The slime is a shader-driven surface — no physics simulation. A GPU imprint texture (ping-pong render targets) tracks touch input: press creates dents, drag leaves trails, and decay restores the surface over time. The shader reads this texture to perturb normals and displace vertices, producing the illusion of deformation.

## Features

- **5 slime types** — Milky, Clear, Metallic, Jiggly, Crunchy (each with distinct shader parameters)
- **Color mixing** — two-color picker with blend slider
- **26 add-ins** across 5 categories (Glitter, Beads, Jelly, Sprinkles, Charms) rendered via InstancedMesh
- **Audio** — squish, drag, and pop sounds via Web Audio API
- **Bottom toolbar** — persistent access to all features (Type, Colors, Add-ins, Sound, Reset)
- **Right-side drawer** — slides in from the right for customization panels

## Project structure

```
src/
  app/        # App shell, layout
  ui/         # Toolbar, CreatePanel, pickers, sliders
  engine/     # SlimeWorld, SlimeMesh, TouchImprint, AddIns, shaders/
  content/    # Slime type presets, add-in definitions
  state/      # Zustand store
  audio/      # Web Audio engine
```

## Status

Milestones 1–3 complete plus UX refactor. See [docs/project-status.md](docs/project-status.md) for details and next steps.

## Docs

- [PRD](docs/prd.md) — requirements and user journeys
- [TDD](docs/tdd.md) — technical architecture
- [Build plan](docs/plan.md) — milestones and tasks
- [Project status](docs/project-status.md) — current state and what's next
