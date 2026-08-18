'use client'

import { useState } from 'react'

/**
 * Build a CSV with a header row and quoted cells. When any row carries an
 * entropy estimate the header is `value,estimated_entropy_bits`; otherwise
 * a single `value` column is emitted.
 */
export function buildValuesCsv(rows: Array<{ value: string; bits?: number }>): string {
  const quote = (cell: string | number) => '"' + String(cell).replace(/"/g, '""') + '"'
  const hasBits = rows.some((row) => typeof row.bits === 'number')
  const lines = hasBits
    ? [['value', 'estimated_entropy_bits'].map(quote).join(','), ...rows.map((row) => [quote(row.value), quote(row.bits ?? '')].join(','))]
    : [quote('value'), ...rows.map((row) => quote(row.value))]
  return lines.join('\n')
}

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

interface BulkGeneratorProps {
  generateFn: () => string
  /** Optional entropy estimator — adds an estimated_entropy_bits column to CSV exports. */
  getBits?: (value: string) => number
  defaultCount?: number
  maxCount?: number
  label?: string
}

export function BulkGenerator({
  generateFn,
  getBits,
  defaultCount = 10,
  label = 'values'
}: BulkGeneratorProps) {
  const [count, setCount] = useState(defaultCount)
  const [values, setValues] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const newValues = Array.from({ length: count }, () => generateFn())
    setValues(newValues)
  }

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(values.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadCSV = () => {
    const csv = buildValuesCsv(values.map((value) => ({ value, bits: getBits?.(value) })))
    downloadCsv(csv, `generated-${label}.csv`)
  }

  const downloadJSON = () => {
    const json = JSON.stringify(values, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-${label}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--muted)]">Generate</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="form-select"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-[var(--muted)]">{label}</span>
        </div>

        <button onClick={generate} className="btn btn-primary">
          Generate
        </button>
      </div>

      {values.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button onClick={copyAll} className="btn btn-secondary text-sm">
              {copied ? 'Copied!' : 'Copy All'}
            </button>
            <button onClick={downloadCSV} className="btn btn-secondary text-sm">
              Download CSV
            </button>
            <button onClick={downloadJSON} className="btn btn-secondary text-sm">
              Download JSON
            </button>
          </div>
          <p className="text-13 text-[var(--muted-foreground)]">
            Exported files contain sensitive values — delete after use.
          </p>

          <div className="code-block max-h-96 overflow-y-auto">
            <div className="code-block-content">
              <pre className="text-sm">
                {values.map((value, i) => (
                  <div key={i} className="flex hover:bg-[var(--code-bg)]">
                    <span className="select-none text-[var(--muted-foreground)] w-8 text-right pr-4 flex-shrink-0">
                      {i + 1}
                    </span>
                    <code className="break-all">{value}</code>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
