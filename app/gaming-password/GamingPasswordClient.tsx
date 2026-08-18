'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { calculateEntropy, generateString, ALPHANUMERIC, SYMBOLS_SAFE } from '@/app/lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  CheckboxField,
  RangeField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  BulkGenerator,
} from '@/app/components'

const PLATFORMS = [
  { name: 'Xbox Live', minLength: 8, maxLength: 16, symbolsAllowed: true },
  { name: 'PlayStation Network', minLength: 8, maxLength: 30, symbolsAllowed: true },
  { name: 'Steam', minLength: 8, maxLength: 64, symbolsAllowed: true },
  { name: 'Epic Games', minLength: 7, maxLength: 64, symbolsAllowed: true },
  { name: 'Nintendo', minLength: 8, maxLength: 20, symbolsAllowed: true },
  { name: 'Battle.net', minLength: 8, maxLength: 16, symbolsAllowed: true },
]

interface GamingPasswordClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
}

export default function GamingPasswordClient({ breadcrumbItems }: GamingPasswordClientProps) {
  const [length, setLength] = useState(16)
  const [includeSymbols, setIncludeSymbols] = useState(false) // Some gaming platforms have issues with symbols
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 6 }, () => ''))
  const [toastMessage, flash] = useToast()

  const getCharset = useCallback(() => {
    return includeSymbols ? ALPHANUMERIC + SYMBOLS_SAFE : ALPHANUMERIC
  }, [includeSymbols])

  const generatePassword = useCallback(() => {
    return generateString(length, getCharset())
  }, [length, getCharset])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 6 }, () => generatePassword()))
  }, [generatePassword])

  const regenerateValue = useCallback((index: number) => {
    setValues((current) => {
      const next = [...current]
      next[index] = generatePassword()
      return next
    })
  }, [generatePassword])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new passwords')
  }, [generateAll, flash])

  const handleRegenerateAll = useCallback(() => {
    generateAll()
    flash('Regenerated all')
  }, [generateAll, flash])

  // `R` regenerates everything when no field has focus
  useRegenerateHotkey(handleRegenerateAll)

  const charset = getCharset()
  const entropy = calculateEntropy(length, charset.length)
  const getBits = useCallback(
    (value: string) => calculateEntropy(value.length || length, getCharset().length),
    [length, getCharset],
  )

  return (
    <GeneratorLayout
      title="Gaming Password Generator"
      description="Generate secure passwords for your gaming accounts. Optimized for compatibility with Xbox Live, PlayStation Network, Steam, and other platforms."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <SecurityNotice type="info" title="Gaming account security tips">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Enable 2FA on all gaming accounts</li>
            <li>Use unique passwords for each platform</li>
            <li>Never share your password, even with friends</li>
            <li>Be wary of phishing links in game chats</li>
            <li>Check for official domain names before logging in</li>
          </ul>
          <p className="mt-2">
            <Link href="/guides/password-security-best-practices" className="font-semibold text-[var(--accent)] hover:underline">
              Password security best practices →
            </Link>
          </p>
        </SecurityNotice>
      }
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate passwords"
        readout={{ bits: entropy, poolSize: charset.length }}
      >
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <RangeField label="Length" value={length} onChange={setLength} min={8} max={32} />
          <div className="space-y-2">
            <label className="form-label">Options</label>
            <CheckboxField
              label="Include symbols (may cause issues on some platforms)"
              checked={includeSymbols}
              onChange={setIncludeSymbols}
            />
          </div>
        </div>
      </GeneratorControls>

      {/* Generated passwords */}
      <OutputDisplay
        values={values}
        noun="passwords"
        getBits={getBits}
        onRegenerate={regenerateValue}
        onRegenerateAll={handleRegenerateAll}
      />

      {/* Platform Requirements */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Platform Requirements</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PLATFORMS.map((platform) => (
            <div key={platform.name} className="card p-3 text-sm">
              <div className="font-medium mb-1">{platform.name}</div>
              <div className="text-[var(--muted)]">
                {platform.minLength}-{platform.maxLength} chars
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bulk Generation */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generatePassword}
          getBits={getBits}
          label="passwords"
        />
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
