'use client'

import { ReactNode } from 'react'
import { EntropyReadout } from './EntropyReadout'

interface GeneratorControlsProps {
  children: ReactNode
  onGenerate: () => void
  generateLabel?: string
  /** Legacy simple badge readout. Prefer `readout` for the full entropy scale. */
  entropy?: {
    value: number
    description?: string
  }
  /** Full entropy readout: bits + pool + scale bar + crack-time strings. */
  readout?: {
    bits: number
    poolSize: number
    poolLabel?: string
  }
  /** Inline validation alert, e.g. "Select at least one character type to generate passwords." */
  error?: string | null
}

export function GeneratorControls({
  children,
  onGenerate,
  generateLabel = 'Generate',
  entropy,
  readout,
  error,
}: GeneratorControlsProps) {
  return (
    <section className="control-panel mb-6 p-5 md:p-6">
      <div className="flex flex-col gap-5 md:gap-6">
        <div className="flex flex-wrap gap-5 md:gap-7">{children}</div>

        {error && (
          <div
            role="alert"
            className="rounded-[10px] border border-[var(--danger-border)] bg-[var(--danger-bg)] px-[13px] py-2.5 text-14 text-[var(--danger-text)]"
          >
            {error}
          </div>
        )}

        <div className="flex justify-end border-t border-[var(--hairline)] pt-4">
          <button onClick={onGenerate} className="btn btn-primary min-h-[46px] px-6">
            {generateLabel}
          </button>
        </div>
      </div>

      {readout && (
        <div className="mt-3 border-t border-[var(--hairline)] pt-3.5">
          <EntropyReadout bits={readout.bits} poolSize={readout.poolSize} poolLabel={readout.poolLabel} />
        </div>
      )}

      {!readout && entropy && (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-semibold text-[var(--foreground)]">Estimated entropy:</span>
            <span className="badge badge-entropy">{entropy.value} bits</span>
            {entropy.description && (
              <span className="text-[var(--muted)]">{entropy.description}</span>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
