'use client'

import { useEffect } from 'react'

/**
 * Binds the `R` key to a regenerate callback. Only fires when no
 * form field or button has focus (activeElement === body) and no
 * meta/ctrl modifier is held, so browser shortcuts keep working.
 */
export function useRegenerateHotkey(callback: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'r' && event.key !== 'R') return
      if (event.metaKey || event.ctrlKey) return
      if (document.activeElement !== document.body) return
      callback()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [callback])
}
