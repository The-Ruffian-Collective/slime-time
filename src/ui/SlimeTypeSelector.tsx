import { getAllSlimeTypes } from '../content/slimeTypes'

interface Props {
  activeId: string
  onSelect: (typeId: string) => void
}

export function SlimeTypeSelector({ activeId, onSelect }: Props) {
  const types = getAllSlimeTypes()

  return (
    <div className="slime-type-grid">
      {types.map((t) => (
        <button
          key={t.id}
          className={`slime-type-card${t.id === activeId ? ' active' : ''}`}
          onClick={() => onSelect(t.id)}
        >
          <div
            className="slime-type-card__swatch"
            style={{
              background: `linear-gradient(135deg, ${t.defaultColorA}, ${t.defaultColorB})`,
            }}
          />
          <span className="slime-type-card__name">{t.name}</span>
        </button>
      ))}
    </div>
  )
}
