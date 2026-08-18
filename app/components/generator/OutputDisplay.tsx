'use client'

import { ReactNode, useState } from 'react'
import { GeneratedValue } from '../GeneratedValue'
import { ResultRow } from './ResultRow'
import { buildValuesCsv, downloadCsv } from '../BulkGenerator'

interface BulkCsvConfig {
  /** Generates one fresh value for the export. */
  generate: () => string
  /** Optional entropy estimator for the estimated_entropy_bits column. */
  getBits?: (value: string) => number
  filename?: string
  /** Called after a successful export, e.g. to flash a toast. */
  onExport?: (count: number) => void
}

interface OutputDisplayProps {
  values?: string[]
  onRegenerate?: (index: number) => void
  title?: string
  children?: ReactNode
  /** Plural noun for the card header ("Generated {noun}") and row aria-labels. */
  noun?: string
  /** Per-value entropy estimator — switches rendering to the results-card rows. */
  getBits?: (value: string) => number
  /** "↻ Regenerate all" header button. */
  onRegenerateAll?: () => void
  /** Footer band: bulk qty select + CSV export + sensitive-values caption. */
  bulkCsv?: BulkCsvConfig
}

export function OutputDisplay({
  values,
  onRegenerate,
  title = "Generated Values",
  children,
  noun,
  getBits,
  onRegenerateAll,
  bulkCsv,
}: OutputDisplayProps) {
  const [bulkQty, setBulkQty] = useState('25')

  // If children are provided, use them instead of values
  if (children) {
    return (
      <section className="mb-8">
        {children}
      </section>
    )
  }

  // Otherwise, use the values prop
  if (!values || values.length === 0) return null

  // Results-card mode: strength rows, regenerate-all header, bulk CSV footer.
  if (getBits) {
    const singularNoun = (noun ?? 'values').replace(/s$/, '')
    const exportCsv = () => {
      const count = parseInt(bulkQty, 10)
      if (!bulkCsv) return
      const rows = Array.from({ length: count }, () => {
        const value = bulkCsv.generate()
        return { value, bits: bulkCsv.getBits?.(value) ?? getBits(value) }
      })
      downloadCsv(buildValuesCsv(rows), bulkCsv.filename ?? `generated-${noun ?? 'values'}.csv`)
      bulkCsv.onExport?.(count)
    }

    return (
      <section className="mb-6 overflow-hidden card shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between gap-2.5 border-b border-[var(--hairline)] px-[18px] py-[13px]">
          <h2 className="text-15 font-semibold">Generated {noun ?? 'values'}</h2>
          {onRegenerateAll && (
            <button
              onClick={onRegenerateAll}
              className="min-h-10 rounded-[9px] border border-[var(--border-strong)] bg-[var(--background)] px-[15px] text-14 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
            >
              ↻ Regenerate all
            </button>
          )}
        </div>
        <div>
          {values.map((value, i) => (
            <ResultRow
              key={i}
              value={value}
              bits={getBits(value)}
              noun={singularNoun}
              onRegenerate={onRegenerate ? () => onRegenerate(i) : undefined}
            />
          ))}
        </div>
        {bulkCsv && (
          <div className="flex flex-wrap items-center gap-2.5 bg-[var(--band)] px-[18px] py-[13px]">
            <span className="text-14 font-semibold text-[var(--muted)]">Bulk:</span>
            <select
              value={bulkQty}
              onChange={(e) => setBulkQty(e.target.value)}
              aria-label="Bulk quantity"
              className="min-h-10 rounded-[9px] border border-[var(--border-strong)] bg-[var(--surface)] px-2.5 text-14 text-[var(--foreground)]"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <button
              onClick={exportCsv}
              className="min-h-10 rounded-[9px] border border-[var(--accent-border)] bg-[var(--accent-soft)] px-[15px] text-14 font-semibold text-[var(--accent-strong)] transition-colors hover:border-[var(--accent)]"
            >
              ⇩ Export CSV
            </button>
            <span className="text-13 text-[var(--muted-foreground)]">
              Exported files contain sensitive values — delete after use.
            </span>
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="mb-8">
      {title && values.length > 1 && (
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
      )}
      <div className="space-y-3">
        {values.map((value, i) => (
          <GeneratedValue
            key={i}
            value={value}
            onRegenerate={onRegenerate ? () => onRegenerate(i) : undefined}
          />
        ))}
      </div>
    </section>
  )
}
