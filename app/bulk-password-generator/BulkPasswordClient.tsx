'use client'

import { useState, useEffect, useCallback } from 'react'
import { calculateEntropy, generateString, ALPHANUMERIC, LOWERCASE, UPPERCASE, DIGITS, SYMBOLS_SAFE } from '@/app/lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  RangeField,
  CheckboxField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
} from '@/app/components'
import Link from 'next/link'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Bulk Password Generator', url: '/bulk-password-generator' },
]

export default function BulkPasswordClient() {
  const [count, setCount] = useState(50)
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [passwords, setPasswords] = useState<string[]>(() => Array.from({ length: 50 }, () => ''))
  const [toastMessage, flash] = useToast()

  const getCharset = useCallback(() => {
    let charset = ''
    if (includeLowercase) charset += LOWERCASE
    if (includeUppercase) charset += UPPERCASE
    if (includeNumbers) charset += DIGITS
    if (includeSymbols) charset += SYMBOLS_SAFE
    return charset
  }, [includeLowercase, includeUppercase, includeNumbers, includeSymbols])

  const noCharset = getCharset().length === 0

  const generatePassword = useCallback(() => {
    return generateString(length, getCharset() || ALPHANUMERIC)
  }, [length, getCharset])

  const generateAll = useCallback(() => {
    setPasswords(Array.from({ length: count }, () => generatePassword()))
  }, [count, generatePassword])

  useEffect(() => {
    generateAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const handleGenerate = useCallback(() => {
    generateAll()
    flash(`Generated ${count} passwords`)
  }, [generateAll, flash, count])

  useRegenerateHotkey(handleGenerate)

  const regenerateOne = (index: number) => {
    setPasswords((current) => {
      const next = [...current]
      next[index] = generatePassword()
      return next
    })
  }

  const copyOne = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password)
      flash('Copied password')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const charset = getCharset() || ALPHANUMERIC
  const entropy = calculateEntropy(length, charset.length)

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(passwords.join('\n'))
      flash(`Copied ${passwords.length} passwords — handle with care`)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadCSV = () => {
    const csv = 'Password\n' + passwords.map(p => `"${p.replace(/"/g, '""')}"`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `passwords-${count}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    flash(`Exported ${passwords.length} passwords — handle with care`)
  }

  const downloadTXT = () => {
    const blob = new Blob([passwords.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `passwords-${count}-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
    flash(`Exported ${passwords.length} passwords — handle with care`)
  }

  return (
    <GeneratorLayout
      title="Bulk Password Generator"
      description="Generate hundreds of secure passwords at once. Perfect for user onboarding, IT administration, and creating test accounts."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <aside className="card p-5">
          <h2 className="mb-1 text-16 font-semibold">Distribute bulk passwords carefully.</h2>
          <p className="mb-2 text-14 leading-5 text-[var(--muted)]">
            When distributing bulk passwords, always use secure channels (not plain email) and require
            users to change their password on first login. Delete exported files after use.
          </p>
          <Link href="/guides/password-security-best-practices" className="text-14 font-semibold text-[var(--accent)] hover:underline">
            Password security best practices →
          </Link>
        </aside>
      }
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel={`Generate ${count} passwords`}
        readout={{ bits: entropy, poolSize: charset.length }}
        error={noCharset ? 'No character types selected — falling back to the alphanumeric pool.' : null}
      >
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="form-label">Count</label>
            <div className="flex flex-wrap gap-2">
              {[10, 25, 50, 100, 250, 500].map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  aria-pressed={count === n}
                  className={`min-h-10 rounded-[10px] border px-3 text-14 font-semibold transition-colors ${
                    count === n
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]'
                      : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <RangeField label="Length" value={length} onChange={setLength} min={8} max={32} />

          <div className="space-y-2">
            <label className="form-label">Character Types</label>
            <div className="grid grid-cols-2 gap-x-4">
              <CheckboxField label="Lowercase (a-z)" checked={includeLowercase} onChange={setIncludeLowercase} />
              <CheckboxField label="Uppercase (A-Z)" checked={includeUppercase} onChange={setIncludeUppercase} />
              <CheckboxField label="Numbers (0-9)" checked={includeNumbers} onChange={setIncludeNumbers} />
              <CheckboxField label="Symbols (!@#$)" checked={includeSymbols} onChange={setIncludeSymbols} />
            </div>
          </div>
        </div>
      </GeneratorControls>

      {/* Generated passwords: grid presentation with per-row copy + regenerate */}
      <section className="mb-6 overflow-hidden card shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between gap-2.5 border-b border-[var(--hairline)] px-[18px] py-[13px]">
          <h2 className="text-15 font-semibold">Generated passwords</h2>
          <button
            onClick={handleGenerate}
            className="min-h-10 rounded-[9px] border border-[var(--border-strong)] bg-[var(--background)] px-[15px] text-14 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
          >
            ↻ Regenerate all
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-2 font-mono text-sm md:grid-cols-2 lg:grid-cols-3">
            {passwords.map((password, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded-[9px] border border-[var(--border)] bg-[var(--background)] py-1.5 pl-2.5 pr-1 transition-colors hover:border-[var(--accent)]"
              >
                <span className="w-8 shrink-0 text-xs text-[var(--muted-foreground)]">{i + 1}.</span>
                <span className="min-w-0 flex-1 truncate">{password}</span>
                <button
                  onClick={() => regenerateOne(i)}
                  aria-label="Regenerate this password"
                  className="grid min-h-8 min-w-8 place-items-center rounded-md text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                >
                  ↻
                </button>
                <button
                  onClick={() => copyOne(password)}
                  aria-label="Copy this password"
                  className="grid min-h-8 min-w-8 place-items-center rounded-md text-12 font-semibold tracking-[0.04em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
                >
                  COPY
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 bg-[var(--band)] px-[18px] py-[13px]">
          <span className="text-14 font-semibold text-[var(--muted)]">Export:</span>
          <button
            onClick={copyAll}
            className="min-h-10 rounded-[9px] border border-[var(--border-strong)] bg-[var(--surface)] px-[15px] text-14 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
          >
            Copy All
          </button>
          <button
            onClick={downloadCSV}
            className="min-h-10 rounded-[9px] border border-[var(--accent-border)] bg-[var(--accent-soft)] px-[15px] text-14 font-semibold text-[var(--accent-strong)] transition-colors hover:border-[var(--accent)]"
          >
            ⇩ Download CSV
          </button>
          <button
            onClick={downloadTXT}
            className="min-h-10 rounded-[9px] border border-[var(--accent-border)] bg-[var(--accent-soft)] px-[15px] text-14 font-semibold text-[var(--accent-strong)] transition-colors hover:border-[var(--accent)]"
          >
            ⇩ Download TXT
          </button>
          <span className="text-13 text-[var(--muted-foreground)]">
            Exported files contain sensitive values — delete after use.
          </span>
        </div>
      </section>

      <SecurityNotice type="info" title="Use cases for bulk passwords">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>User onboarding</strong> - Generate initial passwords for new employees</li>
          <li><strong>Testing</strong> - Create test accounts for QA and development</li>
          <li><strong>WiFi guest networks</strong> - Rotating access credentials</li>
          <li><strong>Event registration</strong> - Temporary access codes for attendees</li>
          <li><strong>Database seeding</strong> - Populate test data with realistic passwords</li>
        </ul>
      </SecurityNotice>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
