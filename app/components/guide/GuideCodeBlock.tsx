'use client'

import { useState } from 'react'

export type GuideCodeTone = 'comment' | 'vulnerable' | 'secure'

export interface GuideCodeSegment {
  text: string
  tone?: GuideCodeTone
}

interface GuideCodeBlockProps {
  label: string
  /** Plain source — auto-colorized by line (comments, VULNERABLE/SECURE markers). */
  code?: string
  /** Explicit segments for exact control; takes precedence over auto-coloring. */
  segments?: GuideCodeSegment[]
}

const TONE_COLORS: Record<GuideCodeTone, string> = {
  comment: '#8d8883',
  vulnerable: '#fca5a5',
  secure: '#6ee7b7',
}

/**
 * Auto-colorize a plain code string, matching the reference guide styling:
 * full-line `#`/`//` comments render muted; comment lines carrying a
 * VULNERABLE or SECURE marker render red/green; trailing ` // ...` comments
 * render muted. Code lines keep the default color.
 */
function colorize(code: string): GuideCodeSegment[] {
  const segments: GuideCodeSegment[] = []
  const push = (text: string, tone?: GuideCodeTone) => {
    const last = segments[segments.length - 1]
    if (last && last.tone === tone) last.text += text
    else segments.push(tone ? { text, tone } : { text })
  }

  code.split('\n').forEach((line, index, lines) => {
    const newline = index < lines.length - 1 ? '\n' : ''
    const trimmed = line.trimStart()

    if (trimmed.startsWith('#') || trimmed.startsWith('//')) {
      let tone: GuideCodeTone = 'comment'
      if (/VULNERABLE/.test(trimmed)) tone = 'vulnerable'
      else if (/SECURE/.test(trimmed)) tone = 'secure'
      push(line + newline, tone)
      return
    }

    // Trailing inline comment: ` // ...` preceded by whitespace (so URLs survive).
    const match = line.match(/^(.*?\S)(\s+)(\/\/.*)$/)
    if (match) {
      push(match[1] + match[2])
      push(match[3], 'comment')
      push(newline)
      return
    }

    push(line + newline)
  })

  return segments
}

export function GuideCodeBlock({ label, code, segments }: GuideCodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const rendered = segments ?? colorize(code ?? '')
  const plainText = segments ? segments.map((segment) => segment.text).join('') : code ?? ''

  async function copy() {
    await navigator.clipboard.writeText(plainText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="guide-code">
      <div className="guide-code-header">
        <span>{label}</span>
        <button type="button" onClick={copy} aria-label={`Copy ${label.toLowerCase()} code`}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>
          {rendered.map((segment, index) => segment.tone
            ? <span key={index} style={{ color: TONE_COLORS[segment.tone] }}>{segment.text}</span>
            : <span key={index}>{segment.text}</span>)}
        </code>
      </pre>
    </div>
  )
}
