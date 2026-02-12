import { SWATCH_COLORS } from '../content/palettes'

interface Props {
  selected: string
  onSelect: (hex: string) => void
}

/** Normalize a THREE.Color hex string (#rrggbb) to uppercase for comparison. */
function normalizeHex(hex: string): string {
  return hex.toUpperCase()
}

export function ColorSwatchPicker({ selected, onSelect }: Props) {
  const selectedNorm = normalizeHex(selected)

  return (
    <div className="swatch-grid">
      {SWATCH_COLORS.map((color) => (
        <button
          key={color}
          className={`swatch${normalizeHex(color) === selectedNorm ? ' active' : ''}`}
          style={{ background: color }}
          onClick={() => onSelect(color)}
          aria-label={`Color ${color}`}
        />
      ))}
    </div>
  )
}
