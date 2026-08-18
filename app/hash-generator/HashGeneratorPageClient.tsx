'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GeneratorLayout, SecurityNotice, CodeBlock } from '../components'

type HashType = 'SHA-1' | 'SHA-256' | 'SHA-512'

const HASH_TYPES: Array<{ type: HashType; note: string }> = [
  { type: 'SHA-1', note: '160-bit (40 hex chars) - Deprecated for security' },
  { type: 'SHA-256', note: '256-bit (64 hex chars) - Recommended' },
  { type: 'SHA-512', note: '512-bit (128 hex chars) - High security' },
]

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'Hash Generator', url: '/hash-generator' },
]

async function generateHash(text: string, algorithm: HashType): Promise<string> {
  if (!text) return ''

  const encoder = new TextEncoder()
  const data = encoder.encode(text)

  try {
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return 'Error generating hash'
  }
}

export default function HashGeneratorPageClient() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<HashType, string>>({
    'SHA-1': '',
    'SHA-256': '',
    'SHA-512': '',
  })
  const [copied, setCopied] = useState<HashType | null>(null)

  useEffect(() => {
    let cancelled = false
    const generateAllHashes = async () => {
      if (!input) {
        setHashes({ 'SHA-1': '', 'SHA-256': '', 'SHA-512': '' })
        return
      }

      const [sha1, sha256, sha512] = await Promise.all([
        generateHash(input, 'SHA-1'),
        generateHash(input, 'SHA-256'),
        generateHash(input, 'SHA-512'),
      ])

      if (!cancelled) {
        setHashes({ 'SHA-1': sha1, 'SHA-256': sha256, 'SHA-512': sha512 })
      }
    }

    generateAllHashes()
    return () => { cancelled = true }
  }, [input])

  const copyToClipboard = async (hash: string, type: HashType) => {
    if (!hash) return
    await navigator.clipboard.writeText(hash)
    setCopied(type)
    setTimeout(() => setCopied(null), 1400)
  }

  return (
    <GeneratorLayout
      title="Hash Generator"
      description="Generate cryptographic hashes using SHA-1, SHA-256, and SHA-512 algorithms — computed live in your browser. Useful for checksums, data integrity, and understanding password hashing."
      breadcrumbItems={breadcrumbItems}
    >
      {/* Input panel */}
      <section className="control-panel mb-6 p-5 md:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="form-label" htmlFor="hash-input">Text to Hash</label>
            <textarea
              id="hash-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-input h-32 w-full font-mono"
              placeholder="Type or paste text here — hashes update as you type..."
              spellCheck={false}
            />
          </div>
          <p className="border-t border-[var(--hairline)] pt-3.5 text-14 leading-[1.6] text-[var(--muted)]">
            SHA-256/512 are one-way digests — the input cannot be recovered from the output. For storing
            passwords, use bcrypt or Argon2 instead of a bare SHA hash.
          </p>
        </div>
      </section>

      {/* Hash results */}
      <section className="mb-6 overflow-hidden card shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--hairline)] px-[18px] py-[13px]">
          <h2 className="text-15 font-semibold">Generated hashes</h2>
        </div>
        <div>
          {HASH_TYPES.map(({ type, note }) => (
            <div key={type} className="flex items-start gap-1.5 border-b border-[var(--hairline)] py-3 pl-[18px] pr-3 last:border-0">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-14 font-semibold">{type}</span>
                  <span className="text-13 text-[var(--muted-foreground)]">{note}</span>
                </div>
                <div className="overflow-x-auto whitespace-nowrap pb-0.5 font-mono text-sm text-[var(--foreground)]">
                  {hashes[type] || <span className="text-[var(--muted-foreground)]">Enter text above to generate hash</span>}
                </div>
              </div>
              {hashes[type] && (
                <button
                  onClick={() => copyToClipboard(hashes[type], type)}
                  aria-label={`Copy ${type} hash`}
                  className={`grid min-h-10 min-w-16 place-items-center rounded-lg text-13 font-semibold tracking-[0.04em] transition-colors hover:text-[var(--accent)] ${
                    copied === type ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                  }`}
                >
                  {copied === type ? '✓ Copied' : 'COPY'}
                </button>
              )}
            </div>
          ))}
          {/* MD5 pointer row — MD5 is not supported by Web Crypto; the dedicated tool implements it */}
          <div className="flex items-center justify-between gap-3 bg-[var(--band)] px-[18px] py-3">
            <div>
              <span className="text-14 font-semibold">MD5</span>
              <span className="ml-2 text-13 text-[var(--muted-foreground)]">128-bit - collision-broken since 2004, legacy checksums only</span>
            </div>
            <Link
              href="/md5-hash"
              className="whitespace-nowrap rounded-[9px] border border-[var(--border-strong)] bg-[var(--surface)] px-[13px] py-2 text-14 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
            >
              Use the MD5 tool →
            </Link>
          </div>
        </div>
      </section>

      {/* bcrypt section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Password Hashing with bcrypt</h2>
        <div className="card p-4">
          <p className="text-[var(--muted)] mb-4">
            For password storage, use bcrypt, Argon2, or scrypt - NOT MD5/SHA.
            These algorithms are intentionally slow and include salting. Try our{' '}
            <Link href="/bcrypt-generator" className="font-semibold text-[var(--accent-strong)] hover:underline">
              bcrypt generator
            </Link>.
          </p>
          <CodeBlock
            filename="Node.js"
            code={`const bcrypt = require('bcrypt');

// Hash a password
const hash = await bcrypt.hash('${input || 'password'}', 10);
// $2b$10$N9qo8uLOickgx2ZMRZoMye...

// Verify a password
const isValid = await bcrypt.compare('${input || 'password'}', hash);`}
          />
        </div>
      </section>

      {/* Warning */}
      <section className="mb-8">
        <SecurityNotice type="warning" title="Important: Hash vs Encryption">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Hashing is one-way</strong> - you cannot recover the original text from a hash</li>
            <li><strong>MD5 and SHA-1 are broken</strong> - don&apos;t use for security purposes</li>
            <li><strong>Never store plain SHA hashes of passwords</strong> - use bcrypt/Argon2 instead</li>
            <li>Hashes are deterministic - same input always produces same output</li>
          </ul>
        </SecurityNotice>
      </section>

      {/* Use Cases */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Common Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-4">
            <h3 className="font-medium mb-2">File Checksums</h3>
            <p className="text-sm text-[var(--muted)]">
              Verify file integrity after downloads. SHA-256 is the standard for software verification.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-medium mb-2">Data Deduplication</h3>
            <p className="text-sm text-[var(--muted)]">
              Identify duplicate content by comparing hashes instead of full content.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-medium mb-2">Digital Signatures</h3>
            <p className="text-sm text-[var(--muted)]">
              Sign a hash of a document instead of the entire document for efficiency.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-medium mb-2">Caching Keys</h3>
            <p className="text-sm text-[var(--muted)]">
              Generate unique cache keys from request parameters or content.
            </p>
          </div>
        </div>
      </section>

      {/* Terminal Commands */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate Hashes in Terminal</h2>
        <div className="space-y-4">
          <CodeBlock
            filename="macOS / Linux"
            code={`# MD5
echo -n "${input || 'text'}" | md5sum
# or on macOS:
echo -n "${input || 'text'}" | md5

# SHA-256
echo -n "${input || 'text'}" | sha256sum

# SHA-512
echo -n "${input || 'text'}" | sha512sum

# File hash
sha256sum filename.txt`}
          />
          <CodeBlock
            filename="Python"
            code={`import hashlib

text = "${input || 'text'}"
print(hashlib.sha256(text.encode()).hexdigest())`}
          />
        </div>
      </section>
    </GeneratorLayout>
  )
}
