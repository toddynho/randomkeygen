'use client'

import { useState, useEffect, useCallback } from 'react'
import { generators } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  ControlField,
  OutputDisplay,
  SecurityNotice,
  BulkGenerator,
  Toast,
  useToast,
  useRegenerateHotkey,
} from '../components'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'PIN Generator', url: '/pin-generator' },
]

export default function PinGeneratorPageClient() {
  const [length, setLength] = useState(4)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 8 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generatePin = useCallback(() => {
    return generators.pin(length)
  }, [length])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 8 }, () => generatePin()))
  }, [generatePin])

  const regeneratePin = useCallback((index: number) => {
    setValues((current) => {
      const next = [...current]
      next[index] = generatePin()
      return next
    })
  }, [generatePin])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new PINs')
  }, [generateAll, flash])

  useRegenerateHotkey(handleGenerate)

  // Entropy in bits: log2(10^length)
  const entropyBits = (len: number) => Math.round(len * Math.log2(10))

  return (
    <GeneratorLayout
      title="PIN Generator"
      description="Generate cryptographically secure random PIN codes. Perfect for ATM cards, phone locks, app passcodes, and security systems."
      breadcrumbItems={breadcrumbItems}
    >
      {/* Controls */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate PINs"
        readout={{ bits: entropyBits(length), poolSize: 10, poolLabel: '10-digit pool' }}
      >
        <ControlField
          label="PIN Length"
          htmlFor="pin-length"
          type="select"
          value={length}
          onChange={(value) => setLength(Number(value))}
          options={[
            { value: 4, label: '4 digits (standard)' },
            { value: 5, label: '5 digits' },
            { value: 6, label: '6 digits (recommended)' },
            { value: 8, label: '8 digits (high security)' },
          ]}
        />
        <p className="w-full text-14 leading-[1.6] text-[var(--muted)]">
          {Math.pow(10, length).toLocaleString('en-US')} possible combinations ≈ {entropyBits(length)} bits of
          entropy. Every PIN reads &quot;Weak&quot; on the scale above — that&apos;s honest: 4-6 digit PINs are only safe
          because the systems that use them lock out or rate-limit after a few wrong guesses.
        </p>
      </GeneratorControls>

      {/* Generated PINs: rows with per-row copy/regenerate */}
      <OutputDisplay
        values={values}
        noun="PINs"
        getBits={() => entropyBits(length)}
        onRegenerate={regeneratePin}
        onRegenerateAll={handleGenerate}
      />

      {/* Common Uses */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">PIN Generator Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'ATM & Banking PINs', body: 'Debit cards, credit cards, and ATM access. Most banks require 4-digit PINs, though some allow 5-6 digits for enhanced security.' },
            { title: 'Device PINs', body: 'Smartphone screen locks, tablet security, laptop TPM chips, and smart device access codes. 4-6 digits are most common.' },
            { title: 'SIM Card PUKs', body: 'Personal Unblocking Keys for SIM cards are typically 8-digit codes. Essential backup codes for mobile phone security.' },
            { title: 'Parental Control PINs', body: 'TV parental controls, gaming console restrictions, router settings, and streaming service child locks.' },
            { title: 'App & Service PINs', body: 'Banking apps, password managers, secure messaging apps, and financial service passcodes.' },
            { title: 'Security Systems', body: 'Home alarms, building access, safes, keypad locks, and access control systems.' },
          ].map((useCase) => (
            <div key={useCase.title} className="card p-4">
              <h3 className="font-medium mb-2">{useCase.title}</h3>
              <p className="text-sm text-[var(--muted)]">{useCase.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Tips */}
      <section className="mb-8">
        <SecurityNotice type="warning" title="PIN Security Tips">
          <ul className="list-disc list-inside space-y-1">
            <li>Avoid obvious PINs: 1234, 0000, 1111, birth years</li>
            <li>Don&apos;t use the same PIN for multiple accounts</li>
            <li>Use 6+ digits when possible (100x more combinations than 4 digits)</li>
            <li>Never write your PIN on your card or store it nearby</li>
            <li>Shield the keypad when entering your PIN in public</li>
          </ul>
        </SecurityNotice>
      </section>

      {/* PINs to Avoid */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Most Common PINs to Avoid</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          These PINs account for over 25% of all 4-digit PINs used. Never use them:
        </p>
        <div className="flex flex-wrap gap-2">
          {['1234', '1111', '0000', '1212', '7777', '1004', '2000', '4444', '2222', '6969', '9999', '3333', '5555', '6666', '1122', '1313'].map((pin) => (
            <span key={pin} className="rounded border border-[var(--danger-border)] bg-[var(--danger-bg)] px-3 py-1 font-mono text-sm text-[var(--danger-text)]">
              {pin}
            </span>
          ))}
        </div>
      </section>

      {/* PIN Security FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">PIN Security FAQ</h2>
        <div className="space-y-4">
          {[
            {
              q: 'What makes a PIN secure?',
              a: 'A secure PIN is completely random, not based on personal information (birthdays, addresses), and at least 6 digits when possible. Avoid sequential numbers (1234) or repeated digits (1111).',
            },
            {
              q: 'How many digits should my PIN be?',
              a: 'Use the longest PIN your system allows. 4 digits = 10,000 combinations, 6 digits = 1,000,000 combinations. For critical accounts, always choose 6+ digits when available.',
            },
            {
              q: 'Should I use the same PIN for multiple accounts?',
              a: 'No. Use unique PINs for different accounts and devices. If one PIN is compromised, your other accounts remain secure. Consider using a password manager to track different PINs.',
            },
            {
              q: 'How do I remember multiple random PINs?',
              a: 'Write them down and store securely in a password manager or encrypted note app. For ATM cards, many banks allow you to change your PIN to something more memorable while still secure.',
            },
            {
              q: 'Can someone guess my PIN by watching me type?',
              a: 'Yes, this is called "shoulder surfing." Always shield the keypad when entering your PIN, especially at ATMs and in public places. Be aware of cameras and people nearby.',
            },
          ].map((faq) => (
            <div key={faq.q} className="card p-4">
              <h3 className="font-medium mb-2">{faq.q}</h3>
              <p className="text-sm text-[var(--muted)]">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bulk Generation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generatePin}
          label="PINs"
        />
      </section>

      {/* Security Comparison */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">PIN Length Comparison</h2>
        <div className="overflow-hidden card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--hairline)] bg-[var(--band)] text-left">
                  <th className="p-3 font-semibold">Length</th>
                  <th className="p-3 font-semibold">Combinations</th>
                  <th className="p-3 font-semibold">Entropy</th>
                  <th className="p-3 font-semibold">Time to Guess (3 tries/day)</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                {[
                  { len: 4, combos: '10,000', years: '~9 years' },
                  { len: 5, combos: '100,000', years: '~91 years' },
                  { len: 6, combos: '1,000,000', years: '~913 years' },
                  { len: 8, combos: '100,000,000', years: '~91,324 years' },
                ].map((row) => (
                  <tr key={row.len} className="border-b border-[var(--hairline)] last:border-0">
                    <td className="p-3 font-mono">{row.len} digits</td>
                    <td className="p-3">{row.combos}</td>
                    <td className="p-3 font-mono">{entropyBits(row.len)} bits</td>
                    <td className="p-3">{row.years}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-[var(--hairline)] bg-[var(--band)] px-3 py-2 text-xs text-[var(--muted-foreground)]">
            Guess times assume the lockout/rate-limiting that banks and devices enforce. Without lockout,
            any PIN this short is brute-forced instantly.
          </p>
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
