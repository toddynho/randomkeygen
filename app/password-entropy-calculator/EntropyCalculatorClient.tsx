'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { analyzePasswordEntropy } from '../lib/crypto'
import {
  GeneratorLayout,
  EntropyReadout,
  SecurityNotice,
  RelatedContent,
} from '../components'
import { passwordRelated } from '../components/RelatedContent'

interface EntropyCalculatorClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, unknown>[]
}

const COMMON_PASSWORDS = [
  'password',
  '123456',
  'password123',
  'admin',
  'qwerty',
  'letmein',
  'welcome',
  'monkey',
  '1234567890',
  'Password1!',
]

function CharsetBadge({ present }: { present: boolean }) {
  return (
    <span
      className="badge"
      style={
        present
          ? { background: 'var(--accent-soft)', color: 'var(--accent-strong)' }
          : { background: 'var(--danger-bg)', color: 'var(--danger-text)' }
      }
    >
      {present ? '✓' : '✗'}
    </span>
  )
}

export default function EntropyCalculatorClient({
  breadcrumbItems,
  schema,
}: EntropyCalculatorClientProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const analysis = useMemo(() => {
    if (!password) return null
    return analyzePasswordEntropy(password)
  }, [password])

  return (
    <GeneratorLayout
      title="Password Entropy Calculator"
      description="Analyze password strength through entropy calculation, character set analysis, and time-to-crack estimates — computed entirely in your browser. Get recommendations for stronger passwords."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
    >
      {/* Analyzer panel: input + live entropy readout */}
      <section className="control-panel mb-6 p-5 md:p-6">
        <label htmlFor="password-input" className="form-label">
          Enter password to analyze
        </label>
        <div className="relative">
          <input
            id="password-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or paste a password here..."
            className="form-input w-full py-3 pr-20 font-mono text-16"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Your password is analyzed locally in your browser and never sent to any server.
        </p>

        <div className="mt-4 border-t border-[var(--hairline)] pt-4">
          {analysis ? (
            <EntropyReadout bits={Math.round(analysis.entropy)} poolSize={analysis.charsetSize} />
          ) : (
            <p className="text-14 text-[var(--muted)]">
              Type a password above to see its estimated entropy, strength rating, and crack time.
            </p>
          )}
        </div>
      </section>

      <p className="mb-8 text-14 font-semibold">
        <Link href="/password-strength" className="text-[var(--accent)] hover:underline">
          Just want a quick check? →
        </Link>
      </p>

      {/* Detailed analysis */}
      {analysis && (
        <section className="mb-8 space-y-6">
          {/* Character Set Analysis */}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold">Character set analysis</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Password length</span>
                  <span className="badge badge-entropy">{password.length} characters</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unique characters</span>
                  <span className="badge badge-entropy">{new Set(password).size} unique</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Character set size</span>
                  <span className="badge badge-entropy">{analysis.charsetSize} possible</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Strength rating</span>
                  <span className="badge badge-entropy">{analysis.strengthRating}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lowercase (a-z)</span>
                  <CharsetBadge present={/[a-z]/.test(password)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uppercase (A-Z)</span>
                  <CharsetBadge present={/[A-Z]/.test(password)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Numbers (0-9)</span>
                  <CharsetBadge present={/[0-9]/.test(password)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Symbols (!@#...)</span>
                  <CharsetBadge present={/[^a-zA-Z0-9\s]/.test(password)} />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <SecurityNotice type="warning" title="Recommendations for improvement">
              <ul className="space-y-1 text-sm">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[var(--warning)]">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </SecurityNotice>
          )}
        </section>
      )}

      {/* Password Examples */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Test common passwords</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Click on these common passwords to see how weak they really are:
        </p>
        <div className="flex flex-wrap gap-2">
          {COMMON_PASSWORDS.map((pwd, index) => (
            <button
              key={index}
              onClick={() => setPassword(pwd)}
              className="rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 font-mono text-sm transition-colors hover:border-[var(--accent)]"
            >
              {pwd}
            </button>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-8 space-y-6">
        <h2 className="text-xl font-semibold">Understanding password entropy</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card p-4">
            <h3 className="mb-2 font-semibold">What is entropy?</h3>
            <p className="text-sm text-[var(--muted)]">
              Password entropy measures the unpredictability of a password. It&apos;s calculated as
              log₂(charset size)^length and expressed in bits. Higher entropy means stronger security.
            </p>
          </div>

          <div className="card p-4">
            <h3 className="mb-2 font-semibold">Time to crack</h3>
            <p className="text-sm text-[var(--muted)]">
              Estimates assume an attacker renting serious hardware can try a trillion passwords per second.
              Real-world factors like rate limiting, salting, and key stretching significantly increase security.
            </p>
          </div>

          <div className="card p-4">
            <h3 className="mb-2 font-semibold">Character sets</h3>
            <div className="space-y-1 text-sm text-[var(--muted)]">
              <div>• Lowercase only: 26 characters</div>
              <div>• + Uppercase: 52 characters</div>
              <div>• + Numbers: 62 characters</div>
              <div>• + Symbols: 94+ characters</div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="mb-2 font-semibold">Strength guidelines</h3>
            <div className="space-y-1 text-sm text-[var(--muted)]">
              <div>• &lt;30 bits: Very weak</div>
              <div>• 30-50 bits: Weak</div>
              <div>• 50-70 bits: Fair</div>
              <div>• 70-90 bits: Good</div>
              <div>• 90+ bits: Strong/Very strong</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="mb-6 text-xl font-semibold">Frequently asked questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="mb-2 flex cursor-pointer items-center gap-2 font-medium text-[var(--foreground)]">
              <span className="text-[var(--muted)] transition-transform group-open:rotate-90">▶</span>
              How accurate are the time-to-crack estimates?
            </summary>
            <div className="ml-6 text-sm text-[var(--muted)]">
              The estimates assume optimal conditions for an attacker and perfect knowledge of your
              password&apos;s character set. Real-world attacks face many obstacles like rate limiting,
              account lockouts, and proper password hashing that dramatically increase the time required.
            </div>
          </details>

          <details className="group">
            <summary className="mb-2 flex cursor-pointer items-center gap-2 font-medium text-[var(--foreground)]">
              <span className="text-[var(--muted)] transition-transform group-open:rotate-90">▶</span>
              Is a longer password always better than a complex one?
            </summary>
            <div className="ml-6 text-sm text-[var(--muted)]">
              Generally yes! Length has exponential impact on entropy, while character complexity has linear impact.
              A 20-character lowercase password often has more entropy than a 12-character mixed-case password with symbols.
              However, the best approach combines both length and complexity.
            </div>
          </details>

          <details className="group">
            <summary className="mb-2 flex cursor-pointer items-center gap-2 font-medium text-[var(--foreground)]">
              <span className="text-[var(--muted)] transition-transform group-open:rotate-90">▶</span>
              What about dictionary words and patterns?
            </summary>
            <div className="ml-6 text-sm text-[var(--muted)]">
              This calculator assumes purely random character selection. Dictionary words, patterns,
              and predictable substitutions (like @ for a) significantly reduce actual security.
              Use random generation or high-entropy passphrases for critical accounts.
            </div>
          </details>

          <details className="group">
            <summary className="mb-2 flex cursor-pointer items-center gap-2 font-medium text-[var(--foreground)]">
              <span className="text-[var(--muted)] transition-transform group-open:rotate-90">▶</span>
              How much entropy do I need?
            </summary>
            <div className="ml-6 text-sm text-[var(--muted)]">
              For most online accounts: 64+ bits. For high-security accounts: 80+ bits.
              For master passwords and encryption keys: 128+ bits. Remember that two-factor
              authentication provides additional security layers beyond just password strength.
            </div>
          </details>
        </div>
      </section>

      {/* Security Notice */}
      <section className="mb-8">
        <SecurityNotice type="info" title="Privacy & security">
          All password analysis happens locally in your browser using JavaScript.
          Your passwords are never transmitted to any server or stored anywhere.
          This calculator provides theoretical entropy measurements — consider using
          a password manager for generating and storing truly secure passwords.
        </SecurityNotice>
      </section>

      {/* Related Content */}
      <RelatedContent {...passwordRelated} />
    </GeneratorLayout>
  )
}
