'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators } from '@/app/lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  Toast,
  useToast,
  useRegenerateHotkey,
} from '@/app/components'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Recovery Key Generator', url: '/recovery-key' },
]

const FORMATS = [
  { groups: 6, groupLength: 4, label: '6 x 4 (Apple style)' },
  { groups: 8, groupLength: 4, label: '8 x 4 (Microsoft style)' },
  { groups: 5, groupLength: 5, label: '5 x 5 (Custom)' },
]

export default function RecoveryKeyClient() {
  const [groups, setGroups] = useState(6)
  const [groupLength, setGroupLength] = useState(4)
  const [keys, setKeys] = useState<string[]>(() => Array.from({ length: 4 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generateKey = useCallback(() => {
    return generators.recoveryKey(groups, groupLength)
  }, [groups, groupLength])

  const generateAll = useCallback(() => {
    setKeys(Array.from({ length: 4 }, () => generateKey()))
  }, [generateKey])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new recovery keys')
  }, [generateAll, flash])

  useRegenerateHotkey(handleGenerate)

  // Entropy from the actual pool: uppercase letters + digits = 36 characters
  const totalChars = groups * groupLength
  const entropy = Math.floor(totalChars * Math.log2(36))

  return (
    <GeneratorLayout
      title="Recovery Key Generator"
      description="Generate secure recovery keys in the style of Apple, Google, and Microsoft. Used as a last resort to regain access to your account."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <aside className="card p-5">
          <h2 className="mb-2 text-16 font-semibold">Store your recovery key safely.</h2>
          <ul className="mb-3 list-inside list-disc space-y-1 text-14 leading-5 text-[var(--muted)]">
            <li><strong>Write it down</strong> - Store a physical copy in a secure location</li>
            <li><strong>Don't screenshot</strong> - Photos can be synced to cloud services</li>
            <li><strong>Tell someone trusted</strong> - In case of emergency, someone should know where it is</li>
            <li><strong>Test it works</strong> - Verify the key before relying on it</li>
          </ul>
          <Link href="/guides/password-security-best-practices" className="text-14 font-semibold text-[var(--accent)] hover:underline">
            Password security best practices →
          </Link>
        </aside>
      }
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate recovery keys"
        readout={{ bits: entropy, poolSize: 36, poolLabel: '36-character pool (A-Z, 0-9)' }}
      >
        <div className="w-full">
          <label className="form-label">Format</label>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((format) => {
              const active = groups === format.groups && groupLength === format.groupLength
              return (
                <button
                  key={format.label}
                  onClick={() => { setGroups(format.groups); setGroupLength(format.groupLength) }}
                  aria-pressed={active}
                  className={`min-h-11 rounded-[10px] border px-4 text-14 font-semibold transition-colors ${
                    active
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]'
                      : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]'
                  }`}
                >
                  {format.label}
                </button>
              )
            })}
          </div>
        </div>
      </GeneratorControls>

      <OutputDisplay
        values={keys}
        noun="recovery keys"
        getBits={() => entropy}
        onRegenerate={(index) => {
          setKeys((current) => {
            const next = [...current]
            next[index] = generateKey()
            return next
          })
        }}
        onRegenerateAll={handleGenerate}
      />

      <section className="mt-8 border-t border-[var(--border)] pt-8">
        <h2 className="text-lg font-semibold mb-4">Recovery key vs backup codes</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="card p-4">
            <h3 className="font-semibold mb-2">Recovery Key</h3>
            <ul className="list-disc list-inside text-[var(--muted)] space-y-1">
              <li>Single long key</li>
              <li>Can be used multiple times</li>
              <li>Full account recovery</li>
              <li>Higher security</li>
            </ul>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold mb-2">Backup Codes</h3>
            <ul className="list-disc list-inside text-[var(--muted)] space-y-1">
              <li>Multiple short codes</li>
              <li>One-time use each</li>
              <li>2FA bypass only</li>
              <li>Easier to manage</li>
            </ul>
          </div>
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
