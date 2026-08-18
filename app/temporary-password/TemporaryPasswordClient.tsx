'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { calculateEntropy, generateString, ALPHANUMERIC } from '@/app/lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  CheckboxField,
  Toast,
  useToast,
  useRegenerateHotkey,
  BulkGenerator,
} from '@/app/components'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Temporary Password Generator', url: '/temporary-password' },
]

export default function TemporaryPasswordClient() {
  const [length, setLength] = useState(12)
  const [easyToType, setEasyToType] = useState(true)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 10 }, () => ''))
  const [toastMessage, flash] = useToast()

  const getCharset = useCallback(() => {
    // Easy to type: remove ambiguous chars like 0/O, 1/l/I
    if (easyToType) {
      return 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'
    }
    return ALPHANUMERIC
  }, [easyToType])

  const generatePassword = useCallback(() => {
    return generateString(length, getCharset())
  }, [length, getCharset])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 10 }, () => generatePassword()))
  }, [generatePassword])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new passwords')
  }, [generateAll, flash])

  useRegenerateHotkey(handleGenerate)

  const charset = getCharset()
  const estimateBits = useCallback((value?: string): number => {
    return calculateEntropy(value?.length || length, getCharset().length)
  }, [length, getCharset])
  const entropy = estimateBits()

  return (
    <GeneratorLayout
      title="Temporary Password Generator"
      description="Generate temporary passwords for one-time use. Easy to read and type, perfect for new user onboarding and password resets."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <aside className="card p-5">
          <h2 className="mb-2 text-16 font-semibold">Temporary passwords should be temporary.</h2>
          <ul className="mb-3 list-inside list-disc space-y-1 text-14 leading-5 text-[var(--muted)]">
            <li>Force users to change these passwords on first login</li>
            <li>Set a short expiration time (24-72 hours)</li>
            <li>Send via secure channel (not plain email if possible)</li>
            <li>Never reuse temporary passwords</li>
            <li>Log all temporary password usage</li>
          </ul>
          <Link href="/guides/password-security-best-practices" className="text-14 font-semibold text-[var(--accent)] hover:underline">
            Password security best practices →
          </Link>
        </aside>
      }
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate passwords"
        readout={{ bits: entropy, poolSize: charset.length }}
      >
        <div>
          <label className="form-label">Length</label>
          <div className="flex flex-wrap gap-2">
            {[8, 10, 12, 16].map(l => (
              <button
                key={l}
                onClick={() => setLength(l)}
                aria-pressed={length === l}
                className={`min-h-11 rounded-[10px] border px-4 text-14 font-semibold transition-colors ${
                  length === l
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]'
                    : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end">
          <CheckboxField label="Easy to type (no 0/O, 1/l/I)" checked={easyToType} onChange={setEasyToType} />
        </div>
      </GeneratorControls>

      <OutputDisplay
        values={values}
        noun="passwords"
        getBits={(value) => estimateBits(value)}
        onRegenerate={(index) => {
          setValues((current) => {
            const next = [...current]
            next[index] = generatePassword()
            return next
          })
        }}
        onRegenerateAll={handleGenerate}
      />

      {/* Bulk Generation */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generatePassword}
          getBits={(value) => estimateBits(value)}
          label="passwords"
        />
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
