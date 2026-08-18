'use client'

import { useEffect, useRef, useState } from 'react'

interface ResultRowProps {
  value: string
  bits: number
  onRegenerate?: () => void
  /** Singular noun used in accessible labels, e.g. "password". */
  noun?: string
}

// Strength tiers per the reference spec — thresholds 100 / 70 / 50 bits.
function strength(bits: number) {
  if (bits >= 100) return { label: 'Strong', fg: 'var(--accent-strong)', bar: 'var(--success)', pct: '85%' }
  if (bits >= 70) return { label: 'Good', fg: 'var(--accent-strong)', bar: '#34d399', pct: '62%' }
  if (bits >= 50) return { label: 'Fair', fg: 'var(--warn-text)', bar: '#f59e0b', pct: '40%' }
  return { label: 'Weak', fg: 'var(--danger-text)', bar: '#f04438', pct: '22%' }
}

export function ResultRow({ value, bits, onRegenerate, noun = 'value' }: ResultRowProps) {
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      clearTimeout(copyTimer.current)
      setCopied(true)
      copyTimer.current = setTimeout(() => setCopied(false), 1400)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const tier = strength(bits)

  return (
    <div className="flex items-center gap-1.5 border-b border-[var(--hairline)] py-2 pl-[18px] pr-3 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="overflow-x-auto whitespace-nowrap pb-0.5 font-mono text-sm text-[var(--foreground)]">{value}</div>
        <div className="mt-[5px] flex items-center gap-2">
          <span className="w-[66px] shrink-0 text-12 font-bold" style={{ color: tier.fg }}>{tier.label}</span>
          <span aria-hidden="true" className="relative inline-block h-1 max-w-[150px] flex-1 overflow-hidden rounded-full bg-[var(--hairline)]">
            <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: tier.pct, background: tier.bar }} />
          </span>
          <span className="font-mono text-12 text-[var(--muted-foreground)]">{bits} bits</span>
        </div>
      </div>
      {onRegenerate && (
        <button
          onClick={onRegenerate}
          aria-label={`Regenerate this ${noun}`}
          className="grid min-h-10 min-w-10 place-items-center rounded-lg text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          ↻
        </button>
      )}
      <button
        onClick={handleCopy}
        aria-label={`Copy this ${noun}`}
        className={`grid min-h-10 min-w-16 place-items-center rounded-lg text-13 font-semibold tracking-[0.04em] transition-colors hover:text-[var(--accent)] ${
          copied ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
        }`}
      >
        {copied ? '✓ Copied' : 'COPY'}
      </button>
    </div>
  )
}
