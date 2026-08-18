'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showCopy?: boolean
  showLineNumbers?: boolean
}

export function CodeBlock({ 
  code, 
  language = 'plaintext', 
  filename,
  showCopy = true,
  showLineNumbers = false 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const lines = code.split('\n')

  return (
    <div className="code-block">
      {(filename || showCopy) && (
        <div className="code-block-header">
          <span className="font-mono">{filename || language}</span>
          {showCopy && (
            <button
              onClick={handleCopy}
              className="btn-ghost text-xs px-2 py-1"
            >
              {copied ? (
                <span className="flex items-center gap-1 text-[var(--accent)]">
                  <CheckIcon />
                  Copied
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <CopyIcon />
                  Copy
                </span>
              )}
            </button>
          )}
        </div>
      )}
      <div className="code-block-content">
        <pre>
          <code>
            {showLineNumbers ? (
              lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="select-none text-[var(--muted-foreground)] w-8 text-right pr-4">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}

function CopyIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
