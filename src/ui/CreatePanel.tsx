import { useState } from 'react'
import { useSlimeStore } from '../state/store'
import { SlimeTypeSelector } from './SlimeTypeSelector'
import { ColorSwatchPicker } from './ColorSwatchPicker'
import { BlendSlider } from './BlendSlider'
import { AddInsPanel } from './AddInsPanel'
import './CreatePanel.css'

/** Convert a THREE.Color to hex string for UI display. */
function colorToHex(c: { r: number; g: number; b: number }): string {
  const r = Math.round(c.r * 255)
    .toString(16)
    .padStart(2, '0')
  const g = Math.round(c.g * 255)
    .toString(16)
    .padStart(2, '0')
  const b = Math.round(c.b * 255)
    .toString(16)
    .padStart(2, '0')
  return `#${r}${g}${b}`
}

export function CreatePanel() {
  const [open, setOpen] = useState(false)

  const currentSlimeTypeId = useSlimeStore((s) => s.currentSlimeTypeId)
  const colorA = useSlimeStore((s) => s.colorA)
  const colorB = useSlimeStore((s) => s.colorB)
  const mix = useSlimeStore((s) => s.mix)
  const setSlimeType = useSlimeStore((s) => s.setSlimeType)
  const setColorA = useSlimeStore((s) => s.setColorA)
  const setColorB = useSlimeStore((s) => s.setColorB)
  const setMix = useSlimeStore((s) => s.setMix)

  const hexA = colorToHex(colorA)
  const hexB = colorToHex(colorB)

  return (
    <>
      {/* Toggle FAB */}
      <button
        className={`panel-toggle${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close panel' : 'Open panel'}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="2.5" />
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="12" r="2.5" />
          <circle cx="8.5" cy="18.5" r="2.5" />
          <circle cx="15.5" cy="18.5" r="2.5" />
        </svg>
      </button>

      {/* Drawer */}
      <div className={`create-panel${open ? ' open' : ''}`}>
        <div className="create-panel__backdrop" onClick={() => setOpen(false)} />
        <div className="create-panel__sheet">
          <div className="create-panel__handle" />

          {/* Slime Type */}
          <div className="create-panel__section">
            <div className="create-panel__label">Slime Type</div>
            <SlimeTypeSelector activeId={currentSlimeTypeId} onSelect={setSlimeType} />
          </div>

          {/* Color A */}
          <div className="create-panel__section">
            <div className="create-panel__label">Color A</div>
            <ColorSwatchPicker selected={hexA} onSelect={setColorA} />
          </div>

          {/* Color B */}
          <div className="create-panel__section">
            <div className="create-panel__label">Color B</div>
            <ColorSwatchPicker selected={hexB} onSelect={setColorB} />
          </div>

          {/* Blend */}
          <div className="create-panel__section">
            <div className="create-panel__label">Blend</div>
            <BlendSlider value={mix} colorA={hexA} colorB={hexB} onChange={setMix} />
          </div>

          {/* Add-ins */}
          <div className="create-panel__section">
            <div className="create-panel__label">Add-ins</div>
            <AddInsPanel />
          </div>
        </div>
      </div>
    </>
  )
}
