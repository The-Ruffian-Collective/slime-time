import { useState } from 'react'
import { useSlimeStore } from '../state/store'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  getAddInsByCategory,
  type Category,
} from '../content/addIns'

export function AddInsPanel() {
  const [activeTab, setActiveTab] = useState<Category>('glitter')
  const addIns = useSlimeStore((s) => s.addIns)
  const addAddIn = useSlimeStore((s) => s.addAddIn)
  const removeAddIn = useSlimeStore((s) => s.removeAddIn)
  const setGlobalDensity = useSlimeStore((s) => s.setGlobalDensity)

  const activeIds = new Set(addIns.map((a) => a.addInId))
  const items = getAddInsByCategory(activeTab)
  const currentDensity = addIns.length > 0 ? addIns[0].density : 0.5

  const toggleItem = (id: string) => {
    if (activeIds.has(id)) {
      removeAddIn(id)
    } else {
      addAddIn(id)
    }
  }

  return (
    <>
      {/* Category tabs */}
      <div className="addins-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`addins-tab${cat === activeTab ? ' active' : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Item grid */}
      <div className="addins-item-grid">
        {items.map((item) => {
          const isActive = activeIds.has(item.id)
          return (
            <button
              key={item.id}
              className={`addins-item-card${isActive ? ' active' : ''}`}
              onClick={() => toggleItem(item.id)}
            >
              <div
                className="addins-item-card__circle"
                style={{ background: item.color }}
              >
                {isActive && (
                  <div className="addins-item-card__check">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5L4 7L8 3"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <span className="addins-item-card__name">{item.name}</span>
            </button>
          )
        })}
      </div>

      {/* Density slider — only when add-ins are active */}
      {addIns.length > 0 && (
        <div className="addins-density">
          <div className="addins-density__header">
            <span className="create-panel__label" style={{ marginBottom: 0 }}>
              Density
            </span>
          </div>
          <input
            type="range"
            className="density-slider"
            min={0}
            max={1}
            step={0.01}
            value={currentDensity}
            onChange={(e) => setGlobalDensity(parseFloat(e.target.value))}
          />
          <div className="addins-density__labels">
            <span className="addins-density__label-text">Sparse</span>
            <span className="addins-density__label-text">Packed</span>
          </div>
        </div>
      )}
    </>
  )
}
