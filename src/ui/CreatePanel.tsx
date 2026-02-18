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

const panelTitles = {
  type: 'Slime Type',
  colors: 'Colors',
  addins: 'Add-ins',
} as const

export function CreatePanel() {
  const activePanel = useSlimeStore((s) => s.activePanel)
  const setActivePanel = useSlimeStore((s) => s.setActivePanel)
  const currentSlimeTypeId = useSlimeStore((s) => s.currentSlimeTypeId)
  const colorA = useSlimeStore((s) => s.colorA)
  const colorB = useSlimeStore((s) => s.colorB)
  const mix = useSlimeStore((s) => s.mix)
  const setSlimeType = useSlimeStore((s) => s.setSlimeType)
  const setColorA = useSlimeStore((s) => s.setColorA)
  const setColorB = useSlimeStore((s) => s.setColorB)
  const setMix = useSlimeStore((s) => s.setMix)

  const isOpen = activePanel !== null
  const hexA = colorToHex(colorA)
  const hexB = colorToHex(colorB)

  const close = () => setActivePanel(null)

  return (
    <div className={`create-panel${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
      <div className="create-panel__backdrop" onClick={close} />

      <div className="create-panel__sheet" role="dialog" aria-label="Customize slime">
        {/* Header */}
        <div className="create-panel__header">
          <span className="create-panel__title">
            {activePanel && panelTitles[activePanel]}
          </span>
          <button className="create-panel__close" onClick={close} aria-label="Close">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Type section */}
        {activePanel === 'type' && (
          <div className="create-panel__section">
            <SlimeTypeSelector activeId={currentSlimeTypeId} onSelect={setSlimeType} />
          </div>
        )}

        {/* Colors section */}
        {activePanel === 'colors' && (
          <>
            <div className="create-panel__section">
              <div className="create-panel__label">Color A</div>
              <ColorSwatchPicker selected={hexA} onSelect={setColorA} />
            </div>
            <div className="create-panel__section">
              <div className="create-panel__label">Color B</div>
              <ColorSwatchPicker selected={hexB} onSelect={setColorB} />
            </div>
            <div className="create-panel__section">
              <div className="create-panel__label">Blend</div>
              <BlendSlider value={mix} colorA={hexA} colorB={hexB} onChange={setMix} />
            </div>
          </>
        )}

        {/* Add-ins section */}
        {activePanel === 'addins' && (
          <div className="create-panel__section">
            <AddInsPanel />
          </div>
        )}
      </div>
    </div>
  )
}
