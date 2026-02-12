interface Props {
  value: number
  colorA: string
  colorB: string
  onChange: (value: number) => void
}

export function BlendSlider({ value, colorA, colorB, onChange }: Props) {
  return (
    <div className="blend-slider">
      <div className="blend-slider__track-wrapper">
        <div
          className="blend-slider__track"
          style={{
            background: `linear-gradient(to right, ${colorA}, ${colorB})`,
          }}
        />
        <input
          type="range"
          className="blend-slider__input"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  )
}
