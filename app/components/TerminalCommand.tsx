'use client'

import { useState } from 'react'

interface TerminalCommandProps {
  command: string
  description?: string
}

export function TerminalCommand({ command, description }: TerminalCommandProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-1">
      {description && (
        <p className="text-xs text-[var(--muted)]">{description}</p>
      )}
      <div 
        className="terminal-command cursor-pointer group"
        onClick={handleCopy}
      >
        <span className="prompt">$</span>
        <code className="flex-1 overflow-x-auto">{command}</code>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--muted-foreground)] hover:text-white">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  )
}

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
