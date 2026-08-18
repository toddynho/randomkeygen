'use client'

import { crackTime, plainEnglishCrackTime } from '../../lib/crypto'

interface EntropyReadoutProps {
  bits: number
  poolSize: number
  /** Overrides the default "{poolSize}-character pool" label (e.g. "768-word pool"). */
  poolLabel?: string
}

const SEGMENTS = [
  { width: '35.7%', color: 'var(--entropy-weak)', label: 'Weak · <50 bits' },
  { width: '14.3%', color: 'var(--entropy-fair)', label: 'Fair' },
  { width: '21.4%', color: 'var(--entropy-good)', label: 'Good · 70+' },
  { width: '28.6%', color: 'var(--success)', label: 'Strong · 100+' },
]

export function EntropyReadout({ bits, poolSize, poolLabel }: EntropyReadoutProps) {
  const markerLeft = `${Math.min(99, (bits / 140) * 100).toFixed(1)}%`

  return (
    <div>
      <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-14 font-semibold text-[var(--foreground)]">
          Estimated entropy: <span className="font-mono text-[var(--accent-strong)]">{bits} bits</span>
          <span className="font-medium text-[var(--muted-foreground)]"> · {poolLabel ?? `${poolSize}-character pool`}</span>
        </span>
        <span className="text-xs text-[var(--muted)]">{crackTime(bits)}</span>
      </div>
      <div className="relative">
        <div className="flex h-2 overflow-hidden rounded-full">
          {SEGMENTS.map((segment) => (
            <span key={segment.label} style={{ width: segment.width, background: segment.color }} />
          ))}
        </div>
        <span
          aria-hidden="true"
          className="absolute top-[-3px] h-[14px] w-[3px] -translate-x-1/2 rounded-sm bg-[var(--foreground)]"
          style={{ left: markerLeft }}
        />
      </div>
      <div className="mt-1.5 flex text-12 text-[var(--muted-foreground)]">
        {SEGMENTS.map((segment) => (
          <span key={segment.label} style={{ width: segment.width }}>{segment.label}</span>
        ))}
      </div>
      <p className="mt-2.5 text-14 leading-[1.6] text-[var(--muted)]">{plainEnglishCrackTime(bits)}</p>
    </div>
  )
}
