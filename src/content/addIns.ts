export interface AddInDef {
  id: string
  name: string
  category: 'glitter' | 'beads' | 'jelly' | 'sprinkles' | 'charms'
  behaviour: 'floaty' | 'sinky' | 'static'
  geometryType: 'sphere' | 'box' | 'cone' | 'tetrahedron' | 'octahedron'
  color: string
  scale: number
  metalness: number
  roughness: number
}

export const CATEGORIES = [
  'glitter',
  'beads',
  'jelly',
  'sprinkles',
  'charms',
] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  glitter: 'Glitter',
  beads: 'Beads',
  jelly: 'Jelly',
  sprinkles: 'Sprinkles',
  charms: 'Charms',
}

export const ADD_INS: AddInDef[] = [
  // --- Glitter (6) - floaty, octahedron ---
  { id: 'glitter-gold', name: 'Gold', category: 'glitter', behaviour: 'floaty', geometryType: 'octahedron', color: '#FFD700', scale: 0.015, metalness: 1.0, roughness: 0.1 },
  { id: 'glitter-silver', name: 'Silver', category: 'glitter', behaviour: 'floaty', geometryType: 'octahedron', color: '#C0C0C0', scale: 0.015, metalness: 1.0, roughness: 0.1 },
  { id: 'glitter-pink', name: 'Pink', category: 'glitter', behaviour: 'floaty', geometryType: 'octahedron', color: '#FF69B4', scale: 0.015, metalness: 0.8, roughness: 0.2 },
  { id: 'glitter-blue', name: 'Blue', category: 'glitter', behaviour: 'floaty', geometryType: 'octahedron', color: '#4FC3F7', scale: 0.015, metalness: 0.8, roughness: 0.2 },
  { id: 'glitter-green', name: 'Green', category: 'glitter', behaviour: 'floaty', geometryType: 'octahedron', color: '#66BB6A', scale: 0.015, metalness: 0.8, roughness: 0.2 },
  { id: 'glitter-rainbow', name: 'Rainbow', category: 'glitter', behaviour: 'floaty', geometryType: 'octahedron', color: '#E040FB', scale: 0.018, metalness: 0.9, roughness: 0.15 },

  // --- Beads (6) - sinky, sphere ---
  { id: 'beads-red', name: 'Red', category: 'beads', behaviour: 'sinky', geometryType: 'sphere', color: '#EF5350', scale: 0.03, metalness: 0.0, roughness: 0.4 },
  { id: 'beads-blue', name: 'Blue', category: 'beads', behaviour: 'sinky', geometryType: 'sphere', color: '#42A5F5', scale: 0.03, metalness: 0.0, roughness: 0.4 },
  { id: 'beads-yellow', name: 'Yellow', category: 'beads', behaviour: 'sinky', geometryType: 'sphere', color: '#FFEE58', scale: 0.03, metalness: 0.0, roughness: 0.4 },
  { id: 'beads-green', name: 'Green', category: 'beads', behaviour: 'sinky', geometryType: 'sphere', color: '#66BB6A', scale: 0.03, metalness: 0.0, roughness: 0.4 },
  { id: 'beads-white', name: 'White', category: 'beads', behaviour: 'sinky', geometryType: 'sphere', color: '#FAFAFA', scale: 0.03, metalness: 0.0, roughness: 0.3 },
  { id: 'beads-black', name: 'Black', category: 'beads', behaviour: 'sinky', geometryType: 'sphere', color: '#424242', scale: 0.03, metalness: 0.0, roughness: 0.5 },

  // --- Jelly (4) - floaty, sphere (larger) ---
  { id: 'jelly-strawberry', name: 'Strawberry', category: 'jelly', behaviour: 'floaty', geometryType: 'sphere', color: '#E53935', scale: 0.05, metalness: 0.0, roughness: 0.1 },
  { id: 'jelly-blueberry', name: 'Blueberry', category: 'jelly', behaviour: 'floaty', geometryType: 'sphere', color: '#5C6BC0', scale: 0.05, metalness: 0.0, roughness: 0.1 },
  { id: 'jelly-lime', name: 'Lime', category: 'jelly', behaviour: 'floaty', geometryType: 'sphere', color: '#8BC34A', scale: 0.05, metalness: 0.0, roughness: 0.1 },
  { id: 'jelly-grape', name: 'Grape', category: 'jelly', behaviour: 'floaty', geometryType: 'sphere', color: '#9C27B0', scale: 0.05, metalness: 0.0, roughness: 0.1 },

  // --- Sprinkles (4) - static, box (elongated) ---
  { id: 'sprinkles-rainbow', name: 'Rainbow', category: 'sprinkles', behaviour: 'static', geometryType: 'box', color: '#FF7043', scale: 0.02, metalness: 0.0, roughness: 0.6 },
  { id: 'sprinkles-chocolate', name: 'Chocolate', category: 'sprinkles', behaviour: 'static', geometryType: 'box', color: '#6D4C41', scale: 0.02, metalness: 0.0, roughness: 0.6 },
  { id: 'sprinkles-vanilla', name: 'Vanilla', category: 'sprinkles', behaviour: 'static', geometryType: 'box', color: '#FFF9C4', scale: 0.02, metalness: 0.0, roughness: 0.6 },
  { id: 'sprinkles-bubblegum', name: 'Bubblegum', category: 'sprinkles', behaviour: 'static', geometryType: 'box', color: '#F48FB1', scale: 0.02, metalness: 0.0, roughness: 0.6 },

  // --- Charms (6) - static, mixed geometry ---
  { id: 'charms-star', name: 'Star', category: 'charms', behaviour: 'static', geometryType: 'octahedron', color: '#FFD54F', scale: 0.04, metalness: 0.3, roughness: 0.3 },
  { id: 'charms-heart', name: 'Heart', category: 'charms', behaviour: 'static', geometryType: 'sphere', color: '#EF5350', scale: 0.04, metalness: 0.3, roughness: 0.3 },
  { id: 'charms-moon', name: 'Moon', category: 'charms', behaviour: 'static', geometryType: 'cone', color: '#FFF176', scale: 0.04, metalness: 0.4, roughness: 0.2 },
  { id: 'charms-cloud', name: 'Cloud', category: 'charms', behaviour: 'static', geometryType: 'sphere', color: '#E0E0E0', scale: 0.05, metalness: 0.0, roughness: 0.2 },
  { id: 'charms-diamond', name: 'Diamond', category: 'charms', behaviour: 'static', geometryType: 'octahedron', color: '#80DEEA', scale: 0.035, metalness: 0.9, roughness: 0.05 },
  { id: 'charms-flower', name: 'Flower', category: 'charms', behaviour: 'static', geometryType: 'tetrahedron', color: '#F06292', scale: 0.04, metalness: 0.2, roughness: 0.4 },
]

export function getAddIn(id: string): AddInDef | undefined {
  return ADD_INS.find((a) => a.id === id)
}

export function getAddInsByCategory(category: Category): AddInDef[] {
  return ADD_INS.filter((a) => a.category === category)
}
