'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { GeneratorLayout, SecurityNotice, CheckboxField } from '../components'

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

// Base32 encoding (RFC 4648)
function base32Encode(data: string, usePadding = true): string {
  let result = ''
  let bits = 0
  let value = 0

  for (let i = 0; i < data.length; i++) {
    value = (value << 8) | data.charCodeAt(i)
    bits += 8

    while (bits >= 5) {
      result += BASE32_ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    result += BASE32_ALPHABET[(value << (5 - bits)) & 31]
  }

  if (usePadding) {
    while (result.length % 8 !== 0) {
      result += '='
    }
  }

  return result
}

// Base32 decoding (RFC 4648)
function base32Decode(data: string): string {
  let result = ''
  let bits = 0
  let value = 0

  data = data.replace(/=/g, '').toUpperCase()

  for (let i = 0; i < data.length; i++) {
    const char = data[i]
    const index = BASE32_ALPHABET.indexOf(char)

    if (index === -1) {
      throw new Error(`Invalid Base32 character: ${char}`)
    }

    value = (value << 5) | index
    bits += 5

    if (bits >= 8) {
      result += String.fromCharCode((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }

  return result
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'Base32 Encoder', url: '/base32-encode' },
]

const EXAMPLE_TEXTS = [
  'Hello World',
  'Base32 Encoding',
  'https://example.com',
  'SecurePassword123',
  'randomkeygen.com',
]

export default function Base32EncodePageClient() {
  const [input, setInput] = useState('')
  const [padding, setPadding] = useState(true)
  const [isDecoding, setIsDecoding] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  // Live conversion, derived from state — no stale-output bugs
  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null as string | null }
    try {
      return isDecoding
        ? { output: base32Decode(input.trim()), error: null }
        : { output: base32Encode(input, padding), error: null }
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Invalid input' }
    }
  }, [input, padding, isDecoding])

  const copyToClipboard = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    clearTimeout(copyTimer.current)
    setCopied(true)
    copyTimer.current = setTimeout(() => setCopied(false), 1400)
  }

  const setMode = (decode: boolean) => {
    if (decode === isDecoding) return
    setIsDecoding(decode)
    // Carry the current result across so encode → decode round-trips
    setInput(output || '')
  }

  return (
    <GeneratorLayout
      title="Base32 Encoder / Decoder"
      description="Convert text to Base32 encoding and decode Base32 strings back to text — instantly, entirely in your browser. RFC 4648 compliant with optional padding support."
      breadcrumbItems={breadcrumbItems}
    >
      {/* Converter panel */}
      <section className="control-panel mb-6 p-5 md:p-6">
        <div className="flex flex-col gap-5">
          <div>
            <label className="form-label">Mode</label>
            <div className="grid max-w-md grid-cols-2 gap-2">
              {[
                { decode: false, label: 'Encode to Base32' },
                { decode: true, label: 'Decode to text' },
              ].map(({ decode, label }) => (
                <button
                  key={label}
                  onClick={() => setMode(decode)}
                  aria-pressed={isDecoding === decode}
                  className={`min-h-11 rounded-[10px] border px-3 text-14 font-semibold transition-colors ${
                    isDecoding === decode
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]'
                      : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="form-label" htmlFor="base32-input">
                {isDecoding ? 'Base32 Input' : 'Text Input'}
              </label>
              {input && (
                <button
                  onClick={() => setInput('')}
                  className="text-14 font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent-strong)]"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              id="base32-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isDecoding ? 'Enter Base32 string to decode...' : 'Enter text to encode...'}
              className="form-input h-36 w-full resize-none font-mono text-sm"
              spellCheck={false}
            />
          </div>

          {!isDecoding && (
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <CheckboxField label="Include padding (=)" checked={padding} onChange={setPadding} />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-14 font-semibold text-[var(--muted)]">Examples:</span>
                {EXAMPLE_TEXTS.map((example) => (
                  <button
                    key={example}
                    onClick={() => setInput(example)}
                    className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-[10px] border border-[var(--danger-border)] bg-[var(--danger-bg)] px-[13px] py-2.5 text-14 text-[var(--danger-text)]"
            >
              {error}
            </div>
          )}

          <p className="border-t border-[var(--hairline)] pt-3.5 text-14 leading-[1.6] text-[var(--muted)]">
            Base32 is an encoding, not encryption — anyone can decode it. It maps every 5 bits to one of 32
            characters (A–Z, 2–7), so output is ~60% longer than the input.
          </p>
        </div>
      </section>

      {/* Output */}
      <section className="mb-6 overflow-hidden card shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between gap-2.5 border-b border-[var(--hairline)] px-[18px] py-[13px]">
          <h2 className="text-15 font-semibold">{isDecoding ? 'Decoded text' : 'Base32 output'}</h2>
          <div className="flex items-center gap-2">
            {output && (
              <span className="text-13 text-[var(--muted-foreground)]">
                {output.length} characters
              </span>
            )}
            {output && (
              <button
                onClick={copyToClipboard}
                aria-label="Copy output"
                className={`grid min-h-10 min-w-16 place-items-center rounded-lg text-13 font-semibold tracking-[0.04em] transition-colors hover:text-[var(--accent)] ${
                  copied ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                }`}
              >
                {copied ? '✓ Copied' : 'COPY'}
              </button>
            )}
          </div>
        </div>
        <div className="px-[18px] py-3">
          <code className="block min-h-6 break-all font-mono text-sm text-[var(--foreground)]">
            {output || (
              <span className="text-[var(--muted-foreground)]">
                {isDecoding ? 'Decoded text will appear here...' : 'Base32 encoded text will appear here...'}
              </span>
            )}
          </code>
        </div>
      </section>

      {/* About Base32 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">About Base32 Encoding</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <p className="mb-4 text-sm leading-relaxed text-[var(--muted)]">
              Base32 is a binary-to-text encoding scheme that represents binary data using
              32 ASCII characters (A-Z and 2-7). It&apos;s more human-readable than Base64
              and case-insensitive, making it ideal for scenarios where users need to
              manually enter encoded data.
            </p>
            <h3 className="mb-2 font-medium">Key Features:</h3>
            <ul className="space-y-1.5 text-sm text-[var(--muted)]">
              <li>• Uses only uppercase letters and numbers 2-7</li>
              <li>• Case-insensitive (easier to read/type)</li>
              <li>• No confusing characters (0, 1, 8, 9)</li>
              <li>• RFC 4648 standard compliance</li>
              <li>• Optional padding with &apos;=&apos; characters</li>
            </ul>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 font-medium">Base32 Alphabet</h3>
            <div className="grid grid-cols-8 gap-1.5 text-center font-mono text-sm">
              {BASE32_ALPHABET.split('').map((char) => (
                <div key={char} className="rounded border border-[var(--accent-border)] bg-[var(--accent-soft)] p-1.5 text-[var(--accent-strong)]">
                  {char}
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-[var(--muted-foreground)]">
              32 characters: A-Z (26 letters) + 2,3,4,5,6,7 (6 numbers)
            </div>
          </div>
        </div>
      </section>

      {/* Base32 vs Base64 Comparison */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Base32 vs Base64 Comparison</h2>
        <div className="overflow-hidden card">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--hairline)] bg-[var(--band)] text-left">
                  <th className="p-3 font-semibold">Feature</th>
                  <th className="p-3 font-semibold">Base32</th>
                  <th className="p-3 font-semibold">Base64</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                {[
                  ['Alphabet Size', '32 characters', '64 characters'],
                  ['Case Sensitive', 'No (case-insensitive)', 'Yes (case-sensitive)'],
                  ['Efficiency', '62.5% (5 bits per char)', '75% (6 bits per char)'],
                  ['Human Readable', 'Excellent (no confusing chars)', 'Good (includes +, /, =)'],
                  ['URL Safe', 'Yes (always)', 'Needs URL-safe variant'],
                  ['Best Use Cases', 'User input, URLs, QR codes', 'Email, web protocols, files'],
                ].map(([feature, b32, b64]) => (
                  <tr key={feature} className="border-b border-[var(--hairline)] last:border-0">
                    <td className="p-3 font-semibold text-[var(--foreground)]">{feature}</td>
                    <td className="p-3">{b32}</td>
                    <td className="p-3">{b64}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Common Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="mb-3 font-medium text-[var(--accent-strong)]">✓ When to Use Base32</h3>
            <ul className="space-y-2.5 text-sm text-[var(--muted)]">
              <li><strong className="text-[var(--foreground)]">Two-Factor Authentication (2FA):</strong> TOTP secrets for Google Authenticator</li>
              <li><strong className="text-[var(--foreground)]">User-Entered Codes:</strong> License keys, activation codes</li>
              <li><strong className="text-[var(--foreground)]">QR Codes:</strong> Better error correction with fewer characters</li>
              <li><strong className="text-[var(--foreground)]">URL Parameters:</strong> Always URL-safe without escaping</li>
              <li><strong className="text-[var(--foreground)]">Case-Insensitive Systems:</strong> When case doesn&apos;t matter</li>
            </ul>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 font-medium text-[var(--destructive)]">✗ When NOT to Use Base32</h3>
            <ul className="space-y-2.5 text-sm text-[var(--muted)]">
              <li><strong className="text-[var(--foreground)]">Storage Efficiency Critical:</strong> Base64 is 20% more efficient</li>
              <li><strong className="text-[var(--foreground)]">Email Protocols:</strong> Base64 is the standard</li>
              <li><strong className="text-[var(--foreground)]">Binary File Encoding:</strong> Base64 handles binary data better</li>
              <li><strong className="text-[var(--foreground)]">JSON/XML Data:</strong> Base64 is more widely supported</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Security and Best Practices */}
      <section className="mb-8">
        <SecurityNotice type="info" title="Security and best practices">
          <div className="grid gap-4 text-sm md:grid-cols-2">
            <ul className="space-y-1.5">
              <li><strong>Encoding ≠ Encryption:</strong> Base32 is not secure, just encoding</li>
              <li><strong>Data Visibility:</strong> Encoded data is easily readable if decoded</li>
              <li><strong>Client-Side Processing:</strong> All encoding happens in your browser — nothing is stored or transmitted</li>
            </ul>
            <ul className="space-y-1.5">
              <li><strong>Padding:</strong> Include padding for strict RFC 4648 compliance</li>
              <li><strong>Validation:</strong> Always validate Base32 input before decoding</li>
              <li><strong>Error Handling:</strong> Handle invalid characters gracefully</li>
            </ul>
          </div>
        </SecurityNotice>
      </section>

      {/* Real-world examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Base32 in Practice - Real World Examples</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: 'DNS and Networking',
              items: [
                { label: 'DNS TXT Records', code: 'google-site-verification=MFXQY2LNORSW...', note: 'Base32 ensures case-insensitive DNS compatibility' },
                { label: 'Tor Hidden Services', code: 'facebookcorewwwi.onion', note: 'Onion addresses use Base32 for public key encoding' },
                { label: 'Domain Fronting', code: 'cdn-GEZDGNBVGY3TQ.example.com', note: 'Subdomain generation for load balancing' },
              ],
            },
            {
              title: 'Authentication Systems',
              items: [
                { label: 'Google Authenticator Seeds', code: 'JBSWY3DPEHPK3PXP', note: 'TOTP secret keys use Base32 for manual entry' },
                { label: 'Recovery Codes', code: 'ABC23-DEF45-GHI67', note: 'Backup codes avoid confusing characters' },
                { label: 'OAuth State Parameters', code: '?state=MFRGG2LTMVQWG', note: 'URL-safe random state for CSRF protection' },
              ],
            },
            {
              title: 'File Systems',
              items: [
                { label: 'Git Alternative Refs', code: 'refs/heads/MFRGG2LTMVQWG', note: 'Case-insensitive filesystem compatibility' },
                { label: 'Backup Filenames', code: 'backup-2024-GEZDGNBVGY3TQ.tar.gz', note: 'Unique filenames that work across platforms' },
                { label: 'Temporary Files', code: '/tmp/cache-NFXGO2LJNN2WG.tmp', note: 'Collision-resistant temporary file naming' },
              ],
            },
            {
              title: 'QR Codes and Mobile',
              items: [
                { label: 'Wi-Fi QR Codes', code: 'WIFI:S:Network;T:WPA;P:ABC234DEF;', note: 'Alphanumeric mode improves QR efficiency' },
                { label: 'App Activation Codes', code: 'ABCD-EFGH-2345-6789', note: 'User-friendly codes for mobile app activation' },
                { label: 'Contact Sharing', code: 'vCard with Base32 IDs', note: 'QR-friendly contact information encoding' },
              ],
            },
          ].map((group) => (
            <div key={group.title} className="card p-5">
              <h3 className="mb-3 font-medium">{group.title}</h3>
              <div className="space-y-4 text-sm">
                {group.items.map((item) => (
                  <div key={item.label}>
                    <strong className="text-[var(--foreground)]">{item.label}:</strong>
                    <div className="mt-1 overflow-x-auto whitespace-nowrap rounded bg-[var(--band)] p-2 font-mono text-14 text-[var(--accent-strong)]">
                      {item.code}
                    </div>
                    <div className="mt-1 text-xs text-[var(--muted-foreground)]">{item.note}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Implementation tips */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Implementation Tips</h2>
        <div className="card p-5">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="mb-2 text-sm font-semibold">For Developers</h3>
              <ul className="space-y-1.5 text-sm text-[var(--muted)]">
                <li>• Use RFC 4648 compliant libraries</li>
                <li>• Test case-insensitive decoding</li>
                <li>• Handle padding edge cases</li>
                <li>• Validate input character set</li>
                <li>• Consider chunking for long data</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">For Users</h3>
              <ul className="space-y-1.5 text-sm text-[var(--muted)]">
                <li>• Avoid similar-looking characters (0,O)</li>
                <li>• Case doesn&apos;t matter: &quot;abc&quot; = &quot;ABC&quot;</li>
                <li>• Padding = signs may be optional</li>
                <li>• Great for typing by hand</li>
                <li>• Works well in QR codes</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">Common Pitfalls</h3>
              <ul className="space-y-1.5 text-sm text-[var(--muted)]">
                <li>• Mixing Base32 with Base64</li>
                <li>• Forgetting to handle padding</li>
                <li>• Assuming case sensitivity</li>
                <li>• Not validating alphabet</li>
                <li>• Length calculation errors</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related tools */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Related Encoding Tools</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { href: '/random-string', title: 'Random String Generator', body: 'Create secure strings in multiple formats' },
            { href: '/hash-generator', title: 'Hash Generator', body: 'Create checksums and secure hashes' },
            { href: '/api-key', title: 'API Key Generator', body: 'Generate secure application credentials' },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="card card-hover p-5"
            >
              <h3 className="mb-1.5 font-medium">{tool.title}</h3>
              <p className="text-sm text-[var(--muted)]">{tool.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </GeneratorLayout>
  )
}
