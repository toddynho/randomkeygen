'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Fixed bottom-center dark pill for short status flashes
 * ("Generated new passwords", "Exported 25 passwords — handle with care").
 */
export function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div
      role="status"
      className="fixed bottom-7 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1c1917] px-[22px] py-3 text-14 font-medium text-white shadow-[inset_0_0_0_1px_var(--elevated-outline),0_6px_20px_rgba(28,25,23,0.25)]"
    >
      {message}
    </div>
  )
}

/** Returns [message, flash]. flash(msg) shows the toast for ~1.5s. */
export function useToast(duration = 1500): [string | null, (msg: string) => void] {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const flash = useCallback(
    (msg: string) => {
      clearTimeout(timer.current)
      setMessage(msg)
      timer.current = setTimeout(() => setMessage(null), duration)
    },
    [duration],
  )

  return [message, flash]
}
