'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators } from '@/app/lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
} from '@/app/components'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Backup Codes Generator', url: '/backup-codes' },
]

// 8 characters drawn from a 36-character pool (a-z, 0-9), formatted xxxx-xxxx
const BITS_PER_CODE = Math.floor(8 * Math.log2(36))

export default function BackupCodesClient() {
  const [count, setCount] = useState(10)
  const [codes, setCodes] = useState<string[]>(() => Array.from({ length: 10 }, () => ''))
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [toastMessage, flash] = useToast()

  const generateCodes = useCallback(() => {
    setCodes(generators.backupCodes(count, 8))
    setCopiedIndex(null)
  }, [count])

  useEffect(() => {
    generateCodes()
  }, [generateCodes])

  const handleGenerate = useCallback(() => {
    generateCodes()
    flash('Generated new backup codes')
  }, [generateCodes, flash])

  useRegenerateHotkey(handleGenerate)

  const copyOne = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1400)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(codes.join('\n'))
      flash(`Copied ${codes.length} backup codes`)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadCodes = () => {
    const content = `BACKUP CODES
Generated: ${new Date().toISOString()}

Keep these codes in a safe place. Each code can only be used once.

${codes.map((code, i) => `${(i + 1).toString().padStart(2, '0')}. ${code}`).join('\n')}

IMPORTANT: Store these codes securely. They provide access to your account if you lose your 2FA device.
`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'backup-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
    flash('Downloaded backup codes — store the file securely')
  }

  return (
    <GeneratorLayout
      title="Backup Codes Generator"
      description="Generate secure backup codes for two-factor authentication recovery. Store these safely - they're your last resort if you lose access to your 2FA device."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <aside className="card p-5">
          <h2 className="mb-2 text-16 font-semibold">How to store backup codes safely.</h2>
          <ul className="mb-3 list-inside list-disc space-y-1 text-14 leading-5 text-[var(--muted)]">
            <li><strong>Print them</strong> - Store a physical copy in a safe or safety deposit box</li>
            <li><strong>Password manager</strong> - Store in a separate password manager from the account</li>
            <li><strong>Encrypted file</strong> - Keep in an encrypted disk image or container</li>
            <li><strong>Never store</strong> - In email, cloud storage, or anywhere easily accessible</li>
          </ul>
          <Link href="/guides/password-security-best-practices" className="text-14 font-semibold text-[var(--accent)] hover:underline">
            Password security best practices →
          </Link>
        </aside>
      }
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate new codes"
        readout={{ bits: BITS_PER_CODE, poolSize: 36, poolLabel: '36-character pool · per 8-character code' }}
      >
        <div>
          <label className="form-label">Number of codes</label>
          <div className="flex flex-wrap gap-2">
            {[8, 10, 12, 16].map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                aria-pressed={count === n}
                className={`min-h-11 rounded-[10px] border px-4 text-14 font-semibold transition-colors ${
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
      </GeneratorControls>

      {/* Generated codes: grid presentation with per-code copy */}
      <section className="mb-6 overflow-hidden card shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between gap-2.5 border-b border-[var(--hairline)] px-[18px] py-[13px]">
          <h2 className="text-15 font-semibold">Generated backup codes</h2>
          <button
            onClick={handleGenerate}
            className="min-h-10 rounded-[9px] border border-[var(--border-strong)] bg-[var(--background)] px-[15px] text-14 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
          >
            ↻ Regenerate all
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2.5 p-4 sm:grid-cols-2 md:grid-cols-4">
          {codes.map((code, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-1 rounded-[9px] border border-[var(--border)] bg-[var(--background)] py-1.5 pl-3 pr-1 font-mono text-sm"
            >
              <span>
                <span className="mr-2 text-xs text-[var(--muted-foreground)]">{i + 1}.</span>
                {code}
              </span>
              <button
                onClick={() => copyOne(code, i)}
                aria-label={`Copy backup code ${i + 1}`}
                className={`grid min-h-8 min-w-12 place-items-center rounded-md font-sans text-12 font-semibold tracking-[0.04em] transition-colors hover:text-[var(--accent)] ${
                  copiedIndex === i ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                }`}
              >
                {copiedIndex === i ? '✓' : 'COPY'}
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2.5 bg-[var(--band)] px-[18px] py-[13px]">
          <button
            onClick={copyAll}
            className="min-h-10 rounded-[9px] border border-[var(--border-strong)] bg-[var(--surface)] px-[15px] text-14 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
          >
            Copy All
          </button>
          <button
            onClick={downloadCodes}
            className="min-h-10 rounded-[9px] border border-[var(--accent-border)] bg-[var(--accent-soft)] px-[15px] text-14 font-semibold text-[var(--accent-strong)] transition-colors hover:border-[var(--accent)]"
          >
            ⇩ Download as Text
          </button>
          <span className="text-13 text-[var(--muted-foreground)]">
            Each code can only be used once — store the file securely.
          </span>
        </div>
      </section>

      <SecurityNotice type="info" title="Using backup codes">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Each code can typically only be used once</li>
          <li>Cross off or delete codes after using them</li>
          <li>Generate new codes before you run out</li>
          <li>If you think codes are compromised, regenerate immediately</li>
        </ul>
      </SecurityNotice>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
