'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { CodeBlock } from './CodeBlock'

export default function SHA256Generator() {
  const [input, setInput] = useState('')
  const [hash, setHash] = useState('')
  const [copied, setCopied] = useState<'text' | 'file' | number | null>(null)
  const [fileHash, setFileHash] = useState('')
  const [fileName, setFileName] = useState('')
  const [isHashing, setIsHashing] = useState(false)
  const [compareA, setCompareA] = useState('')
  const [compareB, setCompareB] = useState('')
  const [hashHistory, setHashHistory] = useState<Array<{input: string, hash: string, timestamp: number}>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  // Generate hash from text input
  const generateTextHash = useCallback(async (text: string): Promise<string> => {
    if (!text) return ''

    const encoder = new TextEncoder()
    const data = encoder.encode(text)

    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } catch {
      return 'Error generating hash'
    }
  }, [])

  // Generate hash from file
  const generateFileHash = useCallback(async (file: File): Promise<string> => {
    setIsHashing(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } catch {
      return 'Error generating file hash'
    } finally {
      setIsHashing(false)
    }
  }, [])

  // Update text hash when input changes
  useEffect(() => {
    const updateHash = async () => {
      const newHash = await generateTextHash(input)
      setHash(newHash)
    }
    updateHash()
  }, [input, generateTextHash])

  // Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const hash = await generateFileHash(file)
    setFileHash(hash)
  }

  // Copy hash to clipboard
  const copyToClipboard = async (hashToCopy: string, which: 'text' | 'file' | number) => {
    if (!hashToCopy || hashToCopy.startsWith('Error')) return
    await navigator.clipboard.writeText(hashToCopy)
    clearTimeout(copyTimer.current)
    setCopied(which)
    copyTimer.current = setTimeout(() => setCopied(null), 1400)
  }

  // Add to history
  const addToHistory = () => {
    if (!input || !hash || hash.startsWith('Error')) return

    const historyEntry = {
      input: input.length > 50 ? input.substring(0, 50) + '...' : input,
      hash,
      timestamp: Date.now()
    }

    setHashHistory(prev => [historyEntry, ...prev.slice(0, 9)]) // Keep last 10
  }

  // Clear all data
  const clearAll = () => {
    setInput('')
    setHash('')
    setFileHash('')
    setFileName('')
    setHashHistory([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const normalizedA = compareA.trim().toLowerCase()
  const normalizedB = compareB.trim().toLowerCase()
  const compareState: 'empty' | 'match' | 'mismatch' =
    !normalizedA || !normalizedB ? 'empty' : normalizedA === normalizedB ? 'match' : 'mismatch'

  return (
    <div className="space-y-6">
      {/* Text input panel */}
      <section className="control-panel p-5 md:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="form-label" htmlFor="sha256-input">Text to Hash</label>
              <button
                onClick={clearAll}
                className="text-14 font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent-strong)]"
              >
                Clear all
              </button>
            </div>
            <textarea
              id="sha256-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-input h-32 w-full font-mono text-sm"
              placeholder="Type or paste text here — the SHA-256 hash updates as you type..."
              spellCheck={false}
            />
          </div>
          <p className="border-t border-[var(--hairline)] pt-3.5 text-14 leading-[1.6] text-[var(--muted)]">
            SHA-256 is a one-way 256-bit digest (64 hex characters) — it cannot be reversed. For storing
            passwords, use bcrypt or Argon2 instead of a bare SHA-256 hash.
          </p>
        </div>
      </section>

      {/* Hash result */}
      <section className="overflow-hidden card shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between gap-2.5 border-b border-[var(--hairline)] px-[18px] py-[13px]">
          <h2 className="text-15 font-semibold">SHA-256 Hash</h2>
          <div className="flex items-center gap-1.5">
            <span className="text-13 text-[var(--muted-foreground)]">
              {hash ? '64 characters · 256 bits' : 'No input'}
            </span>
            {hash && (
              <>
                <button
                  onClick={addToHistory}
                  className="min-h-10 rounded-[9px] border border-[var(--border-strong)] bg-[var(--background)] px-[13px] text-14 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
                >
                  Save
                </button>
                <button
                  onClick={() => copyToClipboard(hash, 'text')}
                  aria-label="Copy SHA-256 hash"
                  className={`grid min-h-10 min-w-16 place-items-center rounded-lg text-13 font-semibold tracking-[0.04em] transition-colors hover:text-[var(--accent)] ${
                    copied === 'text' ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                  }`}
                >
                  {copied === 'text' ? '✓ Copied' : 'COPY'}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="px-[18px] py-3">
          <code className="block min-h-6 break-all font-mono text-sm text-[var(--foreground)]">
            {hash || <span className="text-[var(--muted-foreground)]">Enter text above to generate SHA-256 hash</span>}
          </code>
        </div>
      </section>

      {/* File hash */}
      <section className="card p-5">
        <h2 className="mb-3 text-16 font-semibold">Hash Files</h2>
        <div className="space-y-4">
          <div>
            <label className="form-label">Select file to hash (processed locally, never uploaded)</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="block w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--accent-foreground)] hover:file:bg-[var(--accent-strong)]"
            />
          </div>

          {(fileName || isHashing) && (
            <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {isHashing ? 'Computing...' : `File SHA-256 · ${fileName}`}
                </span>
                {fileHash && !isHashing && (
                  <button
                    onClick={() => copyToClipboard(fileHash, 'file')}
                    aria-label="Copy file hash"
                    className={`text-13 font-semibold tracking-[0.04em] transition-colors hover:text-[var(--accent)] ${
                      copied === 'file' ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                    }`}
                  >
                    {copied === 'file' ? '✓ Copied' : 'COPY'}
                  </button>
                )}
              </div>
              <code className="block break-all font-mono text-sm text-[var(--foreground)]">
                {isHashing ? 'Computing hash...' : fileHash || 'Processing file...'}
              </code>
            </div>
          )}
        </div>
      </section>

      {/* Hash comparison */}
      <section className="card p-5">
        <h2 className="mb-3 text-16 font-semibold">Compare Hashes</h2>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="compare-hash-1">Hash 1</label>
              <input
                id="compare-hash-1"
                type="text"
                value={compareA}
                onChange={(e) => setCompareA(e.target.value)}
                className="form-input w-full font-mono text-sm"
                placeholder="Enter first hash..."
                spellCheck={false}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="compare-hash-2">Hash 2</label>
              <input
                id="compare-hash-2"
                type="text"
                value={compareB}
                onChange={(e) => setCompareB(e.target.value)}
                className="form-input w-full font-mono text-sm"
                placeholder="Enter second hash..."
                spellCheck={false}
              />
            </div>
          </div>

          <div className="text-center">
            <div
              role="status"
              className={`inline-flex items-center gap-2 rounded-[10px] border px-3 py-2 text-sm ${
                compareState === 'match'
                  ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] font-semibold text-[var(--accent-strong)]'
                  : compareState === 'mismatch'
                    ? 'border-[var(--danger-border)] bg-[var(--danger-bg)] font-semibold text-[var(--danger-text)]'
                    : 'border-[var(--hairline)] bg-[var(--band)] text-[var(--muted)]'
              }`}
            >
              {compareState === 'match' && '✓ Hashes match'}
              {compareState === 'mismatch' && '✗ Hashes do not match'}
              {compareState === 'empty' && 'Enter hashes above to compare (case-insensitive)'}
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      {hashHistory.length > 0 && (
        <section className="overflow-hidden card">
          <div className="border-b border-[var(--hairline)] px-[18px] py-[13px]">
            <h2 className="text-15 font-semibold">Recent Hashes</h2>
          </div>
          {hashHistory.map((entry, index) => (
            <div key={entry.timestamp} className="border-b border-[var(--hairline)] px-[18px] py-3 last:border-0">
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="truncate text-sm text-[var(--muted)]">{entry.input}</span>
                <button
                  onClick={() => copyToClipboard(entry.hash, index)}
                  aria-label="Copy saved hash"
                  className={`shrink-0 text-13 font-semibold tracking-[0.04em] transition-colors hover:text-[var(--accent)] ${
                    copied === index ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                  }`}
                >
                  {copied === index ? '✓ Copied' : 'COPY'}
                </button>
              </div>
              <code className="break-all font-mono text-xs text-[var(--muted-foreground)]">{entry.hash}</code>
            </div>
          ))}
        </section>
      )}

      {/* Quick Examples */}
      <section>
        <h2 className="mb-3 text-16 font-semibold">Try These Examples</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[
            'Hello World',
            'password123',
            'The quick brown fox jumps over the lazy dog',
            '{"id":1,"name":"user"}',
            'Lorem ipsum dolor sit amet',
            ''
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setInput(example)}
              className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-3 text-left transition-colors hover:border-[var(--accent)]"
            >
              <div className="break-all font-mono text-sm">
                {example || '(empty string)'}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Expected Output Examples */}
      <section>
        <h2 className="mb-3 text-16 font-semibold">Expected Hash Examples</h2>
        <CodeBlock
          filename="SHA-256 Test Vectors"
          code={`Input: ""
SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

Input: "Hello World"
SHA-256: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e

Input: "The quick brown fox jumps over the lazy dog"
SHA-256: d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592

Input: "password123"
SHA-256: ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f`}
        />
      </section>
    </div>
  )
}
