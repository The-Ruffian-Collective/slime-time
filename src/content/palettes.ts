/**
 * 18-color kid-friendly palette for slime color selection.
 * Colors are curated for high contrast and appeal on screen.
 */
export const SWATCH_COLORS = [
  // Row 1: Warm
  '#FF6B6B', // Coral Red
  '#FF8E53', // Tangerine
  '#FFD93D', // Sunny Yellow
  '#FF6FA7', // Bubblegum Pink
  '#E84393', // Hot Pink
  '#A855F7', // Purple

  // Row 2: Cool
  '#6C5CE7', // Indigo
  '#74B9FF', // Sky Blue
  '#00CEC9', // Teal
  '#55EFC4', // Mint
  '#00B894', // Emerald
  '#BADC58', // Lime

  // Row 3: Neutral + Special
  '#FFEAA7', // Cream
  '#FAB1A0', // Peach
  '#DFE6E9', // Cloud Gray
  '#F0E6FF', // Lavender
  '#FFFFFF', // White
  '#2D3436', // Charcoal
] as const

export type SwatchColor = (typeof SWATCH_COLORS)[number]
