/**
 * SlimeType defines the visual characteristics and shader parameters
 * for each of the 5 core slime presets.
 */
export interface SlimeType {
  id: string
  name: string
  description: string
  // Shader parameters
  gloss: number // Specular intensity (0-1)
  translucency: number // How see-through (0-1)
  noiseScale: number // Noise texture scale (1-10)
  depth: number // Displacement depth (0.05-0.3)
  // Visual defaults
  defaultColorA: string // Hex color
  defaultColorB: string // Hex color
  defaultMix: number // Blend amount (0-1)
}

/**
 * The 5 core slime types for V1.
 * Each preset configures shader uniforms to create distinct visual feels.
 */
export const SLIME_TYPES: Record<string, SlimeType> = {
  milky: {
    id: 'milky',
    name: 'Milky',
    description: 'Soft, opaque, gentle highlights',
    gloss: 0.5,
    translucency: 0.2,
    noiseScale: 2.5,
    depth: 0.12,
    defaultColorA: '#f0e6ff', // Pale lavender
    defaultColorB: '#ffd6e8', // Soft pink
    defaultMix: 0.4,
  },
  clear: {
    id: 'clear',
    name: 'Clear',
    description: 'Translucent, glass-like, high refraction',
    gloss: 0.9,
    translucency: 0.8,
    noiseScale: 1.5,
    depth: 0.08,
    defaultColorA: '#a8e6ff', // Sky blue
    defaultColorB: '#c4f0ff', // Pale cyan
    defaultMix: 0.3,
  },
  metallic: {
    id: 'metallic',
    name: 'Metallic',
    description: 'Shiny, high specular, mirror-like',
    gloss: 1.0,
    translucency: 0.1,
    noiseScale: 4.0,
    depth: 0.15,
    defaultColorA: '#c0c0c0', // Silver
    defaultColorB: '#ffd700', // Gold
    defaultMix: 0.5,
  },
  jiggly: {
    id: 'jiggly',
    name: 'Jiggly',
    description: 'Soft, wobbly, extra displacement',
    gloss: 0.6,
    translucency: 0.4,
    noiseScale: 3.5,
    depth: 0.25, // Extra displacement for wobble effect
    defaultColorA: '#7cdb5e', // Bright green
    defaultColorB: '#ffeb3b', // Yellow
    defaultMix: 0.4,
  },
  crunchy: {
    id: 'crunchy',
    name: 'Crunchy',
    description: 'Textured, grainy, visual crunch',
    gloss: 0.4,
    translucency: 0.3,
    noiseScale: 8.0, // High noise for crunchy texture
    depth: 0.18,
    defaultColorA: '#ff6b9d', // Hot pink
    defaultColorB: '#c44569', // Deep rose
    defaultMix: 0.5,
  },
}

/**
 * Helper to get a slime type by ID with fallback to milky.
 */
export function getSlimeType(id: string): SlimeType {
  return SLIME_TYPES[id] || SLIME_TYPES.milky
}

/**
 * Get all slime types as an array for UI iteration.
 */
export function getAllSlimeTypes(): SlimeType[] {
  return Object.values(SLIME_TYPES)
}
