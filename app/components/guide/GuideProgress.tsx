'use client'

import { useEffect, useState } from 'react'

export function GuideProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight
      setProgress(available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return <div className="guide-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
}
