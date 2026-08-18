'use client'

import { useEffect, useState } from 'react'

interface GuideChecklistProps {
  items: string[]
  /** localStorage key persisting the checked state, e.g. 'rk-jwt-checklist'. */
  storageKey: string
}

export function GuideChecklist({ items, storageKey }: GuideChecklistProps) {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false))

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
      if (Array.isArray(saved) && saved.length === items.length) {
        setChecked(saved.map(Boolean))
      }
    } catch {
      // A disabled storage API should not prevent the checklist from working.
    }
  }, [storageKey, items.length])

  const done = checked.filter(Boolean).length

  function toggle(index: number) {
    setChecked((current) => {
      const next = current.map((value, itemIndex) => itemIndex === index ? !value : value)
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        // Keep the in-memory interaction available when storage is blocked.
      }
      return next
    })
  }

  return (
    <div className="guide-checklist">
      <div className="guide-checklist-summary">
        <span>Track your progress</span>
        <span className="guide-checklist-count">
          <span className="guide-checklist-meter" aria-hidden="true">
            <span style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} />
          </span>
          {done} of {items.length}
        </span>
      </div>
      <div className="guide-checklist-items">
        {items.map((item, index) => (
          <button
            key={item}
            type="button"
            role="checkbox"
            aria-checked={checked[index]}
            onClick={() => toggle(index)}
            className={checked[index] ? 'is-checked' : ''}
          >
            <span className="guide-checkmark" aria-hidden="true">{checked[index] ? '✓' : ''}</span>
            <span>{item}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
