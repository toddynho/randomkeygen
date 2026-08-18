'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { analyzePasswordEntropy } from '../lib/crypto'
import {
  GeneratorLayout,
  EntropyReadout,
  PasswordManagerNextStep,
  SecurityNotice,
} from '../components'

interface PasswordStrengthPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, unknown>[]
}

// Common passwords list (abbreviated)
const COMMON_PASSWORDS = new Set([
  'password', '123456', '123456789', 'qwerty', 'abc123', 'monkey', '1234567',
  'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'shadow', '123123', '654321', 'superman', 'qazwsx',
  'michael', 'football', 'password1', 'password123', 'welcome', 'jesus', 'ninja',
  'mustang', 'password12', 'admin', 'login', 'welcome1', 'admin123', 'root',
])

// Page-unique feedback (patterns, common passwords) layered on top of the
// shared entropy analysis from app/lib/crypto.ts.
function buildFeedback(password: string, recommendations: string[]): string[] {
  const feedback: string[] = []

  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    feedback.push('This is a commonly used password — avoid it!')
  }
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeating characters (aaa, 111)')
  }
  if (/^(123|abc|qwe|asd|zxc)/i.test(password)) {
    feedback.push('Avoid keyboard patterns')
  }

  feedback.push(...recommendations)

  if (feedback.length === 0) {
    feedback.push('Great password! No obvious weaknesses found.')
  }
  return feedback
}

export default function PasswordStrengthPageClient({
  breadcrumbItems,
  schema,
}: PasswordStrengthPageClientProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const analysis = useMemo(
    () => (password ? analyzePasswordEntropy(password) : null),
    [password]
  )

  const feedback = useMemo(
    () => (analysis ? buildFeedback(password, analysis.recommendations) : []),
    [password, analysis]
  )

  const looksGood = analysis !== null && analysis.entropy >= 70 && !COMMON_PASSWORDS.has(password.toLowerCase())

  return (
    <GeneratorLayout
      title="Password Strength Checker"
      description="Test how secure your password is. Get instant feedback on entropy, estimated crack time, and suggestions for improvement — analyzed entirely in your browser."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      storageCallout={
        <PasswordManagerNextStep
          title="Strength is only half the job."
          description="Even a very strong password becomes risky when it is reused. A password manager makes a unique credential practical for every account."
        />
      }
    >
      {/* Analyzer panel: input + live entropy readout */}
      <section className="control-panel mb-6 p-5 md:p-6">
        <label htmlFor="strength-input" className="form-label">
          Enter password to check
        </label>
        <div className="relative">
          <input
            id="strength-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input w-full py-3 pr-20 font-mono text-16"
            placeholder="Type or paste a password..."
            autoComplete="off"
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
          Checked locally — your password never leaves your browser and is never sent to any server.
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
        <Link href="/password-entropy-calculator" className="text-[var(--accent)] hover:underline">
          Prefer a detailed calculator? →
        </Link>
      </p>

      {/* Feedback */}
      {analysis && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">
            {looksGood ? 'Looking good!' : 'Suggestions to improve'}
          </h2>
          <ul className="space-y-2">
            {feedback.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span style={{ color: looksGood ? 'var(--success)' : 'var(--warning)' }}>
                  {looksGood ? '✓' : '•'}
                </span>
                <span className="text-[var(--muted)]">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Privacy */}
      <section className="mb-8">
        <SecurityNotice type="info" title="Your privacy">
          <p>
            This tool runs entirely in your browser. Your password is never sent to any server,
            stored, or logged. You can verify this by disconnecting from the internet and
            testing — it will still work.
          </p>
        </SecurityNotice>
      </section>

      {/* Need a Strong Password? */}
      <section className="control-panel mb-8 p-5 md:p-6">
        <h2 className="mb-2 text-xl font-semibold">Need a strong password?</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Generate a cryptographically secure password with our generator:
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/password" className="btn btn-primary">
            Password Generator
          </Link>
          <Link href="/passphrase" className="btn btn-secondary">
            Passphrase Generator
          </Link>
        </div>
      </section>

      {/* Tips */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Password best practices</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-4">
            <h3 className="mb-2 font-medium" style={{ color: 'var(--success)' }}>Do</h3>
            <ul className="space-y-1 text-sm text-[var(--muted)]">
              <li>• Use 12+ characters minimum</li>
              <li>• Mix uppercase, lowercase, numbers, symbols</li>
              <li>• Use a unique password for each account</li>
              <li>• Consider using a passphrase</li>
              <li>• Use a password manager</li>
            </ul>
          </div>
          <div className="card p-4">
            <h3 className="mb-2 font-medium" style={{ color: 'var(--danger-text)' }}>Don&apos;t</h3>
            <ul className="space-y-1 text-sm text-[var(--muted)]">
              <li>• Use personal info (names, birthdays)</li>
              <li>• Use common words or phrases</li>
              <li>• Use keyboard patterns (qwerty, 123456)</li>
              <li>• Reuse passwords across sites</li>
              <li>• Share passwords via email or text</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">How password strength is calculated</h2>
        <div className="max-w-none text-[var(--muted)]">
          <p className="mb-4">Password strength is calculated based on several factors:</p>
          <ul className="list-inside list-disc space-y-2 text-sm">
            <li>
              <strong className="text-[var(--foreground)]">Entropy</strong> — a measure of randomness based on password length
              and character set diversity. Higher entropy = more combinations to guess.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Character variety</strong> — using lowercase, uppercase, numbers,
              and symbols increases the possible combinations exponentially.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Length</strong> — each additional character multiplies the total
              combinations by the charset size.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Pattern detection</strong> — common patterns, repeated characters,
              and dictionary words make passwords easier to crack.
            </li>
          </ul>
        </div>
      </section>
    </GeneratorLayout>
  )
}
