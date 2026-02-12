import { useEffect } from 'react'
import { useSlimeStore } from '../state/store'
import { getAddIn } from '../content/addIns'
import { AddInInstances } from './AddInInstances'
import { disposeGeometryCache } from './addInsHelpers'

export function AddInsRenderer() {
  const addIns = useSlimeStore((s) => s.addIns)
  const seed = useSlimeStore((s) => s.seed)

  // Dispose geometry cache on unmount
  useEffect(() => {
    return () => {
      disposeGeometryCache()
    }
  }, [])

  return (
    <>
      {addIns.map((active) => {
        const def = getAddIn(active.addInId)
        if (!def) return null
        return (
          <AddInInstances
            key={active.addInId}
            addIn={def}
            density={active.density}
            seed={seed}
          />
        )
      })}
    </>
  )
}
