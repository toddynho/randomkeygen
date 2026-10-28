'use client'

import { useState } from 'react'
import Link from 'next/link'
import { analyzePasswordEntropy, calculateEntropy, crackTime, plainEnglishCrackTime } from '../lib/crypto'
import {
  GeneratorLayout,
  EntropyReadout,
  SecurityNotice,
  RelatedContent,
  CheckboxField,
  RangeField,
} from '../components'
import { FaqList } from '../components/FaqList'
import { passwordRelated } from '../components/related-content-data'
import { entropyFaqs } from './content'

interface EntropyCalculatorClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, unknown>[]
}

const SYMBOL_POOL = 32

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

const relatedTools = [
  { href: '/password', label: 'Password generator', description: 'Strong random passwords' },
  { href: '/memorable-password', label: 'Memorable password', description: 'Easy-to-remember patterns' },
  { href: '/pronounceable-password', label: 'Pronounceable password', description: 'Easy-to-say passwords' },
  { href: '/pin-generator', label: 'PIN generator', description: '4–6 digit PINs' },
  { href: '/wifi-password', label: 'WiFi password', description: 'WPA2/WPA3 network passwords' },
  { href: '/bulk-password-generator', label: 'Bulk password generator', description: 'Many passwords at once' },
  { href: '/password-strength', label: 'Password strength checker', description: 'A quicker strength check' },
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

function clampLength(value: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.min(128, Math.max(1, Math.round(value)))
}

export default function EntropyCalculatorClient({
  breadcrumbItems,
  schema,
}: EntropyCalculatorClientProps) {
  const [length, setLength] = useState(16)
  const [lower, setLower] = useState(true)
  const [upper, setUpper] = useState(true)
  const [digits, setDigits] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fromPassword, setFromPassword] = useState(false)

  const spaceExtra = fromPassword && /\s/.test(password) ? 1 : 0
  const pool =
    (lower ? 26 : 0) +
    (upper ? 26 : 0) +
    (digits ? 10 : 0) +
    (symbols ? SYMBOL_POOL : 0) +
    spaceExtra
  const bits = pool > 0 ? calculateEntropy(length, pool) : 0
  const analysis = password ? analyzePasswordEntropy(password) : null

  const applyPassword = (value: string) => {
    setPassword(value)
    if (!value) {
      setFromPassword(false)
      return
    }
    setFromPassword(true)
    setLength(clampLength(value.length))
    setLower(/[a-z]/.test(value))
    setUpper(/[A-Z]/.test(value))
    setDigits(/[0-9]/.test(value))
    setSymbols(/[^a-zA-Z0-9\s]/.test(value))
  }

  const editLength = (value: number) => {
    setLength(clampLength(value))
    setFromPassword(false)
  }

  return (
    <GeneratorLayout
      title="Password Entropy Calculator"
      description="See entropy in bits and an estimated crack time as you change the length and character set, or type a password and the pool updates to match. Calculated in your browser."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
    >
      <section className="control-panel mb-6 p-5 md:p-6">
        <div className="mb-5 border-b border-[var(--hairline)] pb-5">
          {pool > 0 ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                {fromPassword ? 'This password, if it were random' : 'Random string from this pool'}
              </p>
              <p className="mt-1 font-mono text-4xl font-bold tracking-tight text-[var(--accent-strong)]">
                {bits} <span className="text-2xl font-semibold">bits</span>
              </p>
              <p className="mt-2 text-base font-medium text-[var(--foreground)]">{crackTime(bits)}</p>
              <p className="mt-2 text-14 leading-[1.6] text-[var(--muted)]">{plainEnglishCrackTime(bits)}</p>
            </>
          ) : (
            <p className="text-14 text-[var(--muted)]">Choose at least one character set.</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_220px]">
          <RangeField label="Length" value={length} min={1} max={128} onChange={editLength} />
          <div className="grid grid-cols-2 gap-x-4">
            <CheckboxField label="a–z" checked={lower} onChange={(checked) => { setLower(checked); setFromPassword(false) }} description="26" />
            <CheckboxField label="A–Z" checked={upper} onChange={(checked) => { setUpper(checked); setFromPassword(false) }} description="26" />
            <CheckboxField label="0–9" checked={digits} onChange={(checked) => { setDigits(checked); setFromPassword(false) }} description="10" />
            <CheckboxField label="Symbols" checked={symbols} onChange={(checked) => { setSymbols(checked); setFromPassword(false) }} description="32" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Pool size {pool || 0}
          {spaceExtra ? ' (includes 1 for the space in the password)' : ''}.
          {' '}E = {length} × log₂({pool || 0}), rounded down.
        </p>

        <div className="mt-5 border-t border-[var(--hairline)] pt-5">
          <label htmlFor="password-input" className="form-label">
            Or type a password
          </label>
          <div className="relative">
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => applyPassword(event.target.value)}
              placeholder="Type or paste a password — length and character set follow it"
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
            The password stays in this browser. Moving the length or a checkbox switches the readout back to a random string of that size.
          </p>
        </div>

        {pool > 0 && (
          <div className="mt-4 border-t border-[var(--hairline)] pt-4">
            <EntropyReadout bits={bits} poolSize={pool} poolLabel={`${pool}-character pool`} />
          </div>
        )}
      </section>

      <p className="mb-8 text-14 font-semibold">
        <Link href="/password-strength" className="text-[var(--accent)] hover:underline">
          Just want a quick check? →
        </Link>
      </p>

      {analysis && (
        <section className="mb-8 space-y-6">
          <div className="card p-6">
            <h2 className="mb-1 text-lg font-semibold">Character set in this password</h2>
            <p className="mb-4 text-sm text-[var(--muted)]">
              {fromPassword
                ? 'The readout above uses this password’s length and the pools it touches.'
                : `The readout above is a random ${length}-character string (${bits} bits). This password on its own is ${Math.round(analysis.entropy)} bits.`}
            </p>
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

          {analysis.recommendations.length > 0 && (
            <SecurityNotice type="warning" title="Recommendations for improvement">
              <ul className="space-y-1 text-sm">
                {analysis.recommendations.map((rec) => (
                  <li key={rec} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[var(--warning)]">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </SecurityNotice>
          )}
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Test common passwords</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          These are guesses, not random strings. The bit count is what the pool formula says — an attacker with a dictionary does not need that many tries.
        </p>
        <div className="flex flex-wrap gap-2">
          {COMMON_PASSWORDS.map((pwd) => (
            <button
              key={pwd}
              type="button"
              onClick={() => applyPassword(pwd)}
              className="rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 font-mono text-sm transition-colors hover:border-[var(--accent)]"
            >
              {pwd}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">How entropy is calculated</h2>
        <div className="card space-y-3 p-5 text-sm leading-6 text-[var(--muted)]">
          <p>
            For a password whose characters are chosen independently and uniformly from a pool of size N,
            the Shannon entropy is <strong className="text-[var(--foreground)]">E = L × log₂(N)</strong> bits,
            where L is the length. This page rounds that down with <code className="font-mono">Math.floor</code>,
            the same helper the other generators use.
          </p>
          <p>
            The pools are lowercase 26, uppercase 26, digits 10, and 32 for any other non-space symbol.
            A space adds 1 only when you are measuring a password that contains one.
            Full mixed case, digits, and symbols is 94, so a random 16-character string is{' '}
            {calculateEntropy(16, 94)} bits.
          </p>
          <p>
            Crack time takes half the keyspace, 2<sup>E−1</sup> guesses, at 10<sup>12</sup> guesses per second,
            and assumes the attacker knows N. It is not an estimate of how fast someone can guess “password”
            or a keyboard pattern. Those live in a much smaller list.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-6 text-xl font-semibold">Frequently asked questions</h2>
        <FaqList items={entropyFaqs} />
      </section>

      <section className="mb-8">
        <SecurityNotice type="info" title="Privacy">
          Length, character set, and any password you type are handled in this browser.
          Nothing is sent to a server. Use a password manager when you need to store what you generate.
        </SecurityNotice>
      </section>

      <RelatedContent {...passwordRelated} tools={relatedTools} />
    </GeneratorLayout>
  )
}
