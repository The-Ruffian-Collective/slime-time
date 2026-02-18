import { useShallow } from 'zustand/react/shallow'
import { useSlimeStore } from '../state/store'
import { audioEngine } from '../audio/audioEngine'
import './Toolbar.css'

type PanelId = 'type' | 'colors' | 'addins'

export function Toolbar() {
  const { activePanel, soundEnabled, setActivePanel, setSoundEnabled, resetImprint } =
    useSlimeStore(
      useShallow((s) => ({
        activePanel: s.activePanel,
        soundEnabled: s.soundEnabled,
        setActivePanel: s.setActivePanel,
        setSoundEnabled: s.setSoundEnabled,
        resetImprint: s.resetImprint,
      })),
    )

  const togglePanel = (panel: PanelId) => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  const handleSoundToggle = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    audioEngine.setSoundEnabled(next)
  }

  return (
    <div className="toolbar" role="toolbar" aria-label="Slime tools">
      <ToolbarButton
        icon={<TypeIcon />}
        label="Type"
        active={activePanel === 'type'}
        onPress={() => togglePanel('type')}
      />
      <ToolbarButton
        icon={<ColorsIcon />}
        label="Colors"
        active={activePanel === 'colors'}
        onPress={() => togglePanel('colors')}
      />
      <ToolbarButton
        icon={<AddInsIcon />}
        label="Add-ins"
        active={activePanel === 'addins'}
        onPress={() => togglePanel('addins')}
      />

      <div className="toolbar__divider" role="separator" />

      <ToolbarButton
        icon={soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
        label={soundEnabled ? 'Sound' : 'Muted'}
        onPress={handleSoundToggle}
      />
      <ToolbarButton
        icon={<ResetIcon />}
        label="Reset"
        onPress={resetImprint}
      />
      <ToolbarButton
        icon={<SaveIcon />}
        label="Save"
        onPress={() => {}}
      />
      <ToolbarButton
        icon={<GalleryIcon />}
        label="Gallery"
        disabled
        onPress={() => {}}
      />
    </div>
  )
}

interface ToolbarButtonProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  disabled?: boolean
  onPress: () => void
}

function ToolbarButton({ icon, label, active, disabled, onPress }: ToolbarButtonProps) {
  return (
    <button
      className={`toolbar__btn${active ? ' active' : ''}${disabled ? ' disabled' : ''}`}
      onClick={disabled ? undefined : onPress}
      aria-label={label}
      aria-pressed={active || undefined}
      aria-disabled={disabled || undefined}
    >
      <span className="toolbar__icon">{icon}</span>
      <span className="toolbar__label">{label}</span>
    </button>
  )
}

/* ── SVG Icons (24×24) ───────────────────────────────────── */

const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function TypeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...s}>
      <path d="M4 8c0-2 2-4 4-4s4 2 6 2 4-2 6-2" />
      <path d="M4 14c0-2 2-4 4-4s4 2 6 2 4-2 6-2" />
      <path d="M4 20c0-2 2-4 4-4s4 2 6 2 4-2 6-2" />
    </svg>
  )
}

function ColorsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...s}>
      <circle cx="9" cy="9" r="5" />
      <circle cx="15" cy="9" r="5" />
      <circle cx="12" cy="15" r="5" />
    </svg>
  )
}

function AddInsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...s}>
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
      <path d="M5 16l1 2.5L8.5 20l-2.5 1L5 23.5 4 21l-2.5-1L4 18.5 5 16z" />
      <path d="M19 14l.75 2L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" />
    </svg>
  )
}

function SoundOnIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...s}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...s}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

function ResetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...s}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  )
}

function SaveIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...s}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

function GalleryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...s}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
