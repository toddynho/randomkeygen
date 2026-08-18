'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators } from '@/app/lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  RangeField,
  CheckboxField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  BulkGenerator,
  PasswordManagerNextStep,
} from '@/app/components'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Pronounceable Password Generator', url: '/pronounceable-password' },
]

export default function PronounceableClient() {
  const [length, setLength] = useState(12)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [capitalize, setCapitalize] = useState(true)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 8 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generatePassword = useCallback(() => {
    return generators.pronounceable(length, includeNumbers, capitalize)
  }, [length, includeNumbers, capitalize])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 8 }, () => generatePassword()))
  }, [generatePassword])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new passwords')
  }, [generateAll, flash])

  useRegenerateHotkey(handleGenerate)

  // Approximate entropy for the consonant-vowel pattern (less than fully random):
  // ~3.7 bits per character, plus ~6 bits when digits are substituted in.
  const estimateBits = useCallback((value?: string): number => {
    const baseEntropy = Math.floor((value?.length || length) * 3.7)
    return includeNumbers ? baseEntropy + 6 : baseEntropy
  }, [length, includeNumbers])

  const entropy = estimateBits()

  return (
    <GeneratorLayout
      title="Pronounceable Password Generator"
      description="Generate secure passwords that are easy to pronounce and say out loud. Perfect for sharing over phone or when you need to read a password to someone."
      breadcrumbItems={breadcrumbItems}
      storageCallout={<PasswordManagerNextStep />}
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate passwords"
        readout={{ bits: entropy, poolSize: 24, poolLabel: 'consonant-vowel pattern' }}
      >
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <RangeField label="Length" value={length} onChange={setLength} min={8} max={24} />
          <div className="space-y-2">
            <label className="form-label">Options</label>
            <CheckboxField label="Capitalize some letters" checked={capitalize} onChange={setCapitalize} />
            <CheckboxField label="Include numbers" checked={includeNumbers} onChange={setIncludeNumbers} />
          </div>
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

      <SecurityNotice type="info" title="How pronounceable passwords work">
        <p>
          These passwords use alternating consonant-vowel patterns (like "ba-ke-lo-mi")
          which makes them easier to say and remember while still being secure.
          The tradeoff is slightly lower entropy compared to fully random passwords.
        </p>
        <p className="mt-2">
          For maximum security with memorability, consider using a{' '}
          <Link href="/passphrase" className="text-[var(--accent)] hover:underline">passphrase</Link>{' '}
          instead.
        </p>
      </SecurityNotice>

      {/* Related */}
      <section className="mt-8 border-t border-[var(--border)] pt-8">
        <h2 className="text-lg font-semibold mb-4">Related Generators</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/passphrase" className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:border-[var(--accent)]">
            Passphrase
          </Link>
          <Link href="/memorable-password" className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:border-[var(--accent)]">
            Memorable Password
          </Link>
          <Link href="/password" className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:border-[var(--accent)]">
            Random Password
          </Link>
        </div>
      </section>

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
