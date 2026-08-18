import type { ReactNode } from 'react'

interface GuideCalloutProps {
  kind: 'warning' | 'success' | 'danger'
  /** Bold colored lead-in, e.g. "Important:". */
  label: string
  children: ReactNode
}

/**
 * Tinted full-border callout (amber / green / red) — styling lives in the
 * .guide-callout-* rules in globals.css.
 */
export function GuideCallout({ kind, label, children }: GuideCalloutProps) {
  return (
    <div className={`guide-callout guide-callout-${kind}`}>
      <strong>{label}</strong> {children}
    </div>
  )
}
