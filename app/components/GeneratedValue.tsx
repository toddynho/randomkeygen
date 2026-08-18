'use client'

import { useState } from 'react'

interface GeneratedValueProps {
  value: string
  label?: string
  entropy?: number
  format?: string
  onRegenerate?: () => void
}

export function GeneratedValue({ 
  value, 
  label, 
  entropy, 
  format,
  onRegenerate 
}: GeneratedValueProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-2">
      {(label || entropy || format || onRegenerate) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {label && <span className="text-sm font-medium">{label}</span>}
            {entropy && <span className="badge badge-entropy">{entropy} bits</span>}
            {format && <span className="text-xs text-[var(--muted)]">{format}</span>}
          </div>
          {onRegenerate && (
            <button onClick={onRegenerate} className="btn-ghost p-1" title="Regenerate">
              <RefreshIcon />
            </button>
          )}
        </div>
      )}
      <div 
        className={`generated-key ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
      >
        <code className="flex-1 overflow-x-auto break-all">{value}</code>
        <button className="flex-shrink-0">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  )
}

function CopyIcon() {
  return (
    <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}
