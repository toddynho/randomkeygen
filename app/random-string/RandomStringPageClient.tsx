'use client'

import { useState, useEffect, useCallback } from 'react'
import { generators, calculateEntropy, LOWERCASE, UPPERCASE, DIGITS, HEX, ALPHANUMERIC, URL_SAFE } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  ControlField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  TerminalCommand,
  BulkGenerator,
} from '../components'
import { RelatedContent, developerRelated } from '../components/RelatedContent'

type CharsetOption = 'alphanumeric' | 'lowercase' | 'uppercase' | 'numeric' | 'hex' | 'urlsafe' | 'custom'

const charsetMap: Record<string, string> = {
  alphanumeric: ALPHANUMERIC,
  lowercase: LOWERCASE,
  uppercase: UPPERCASE,
  numeric: DIGITS,
  hex: HEX,
  urlsafe: URL_SAFE,
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'Random String Generator', url: '/random-string' },
]

export default function RandomStringPage() {
  const [length, setLength] = useState(32)
  const [charsetType, setCharsetType] = useState<CharsetOption>('alphanumeric')
  const [customCharset, setCustomCharset] = useState(ALPHANUMERIC)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 5 }, () => ''))
  const [toastMessage, flash] = useToast()

  const getCharset = useCallback(() => {
    if (charsetType === 'custom') return customCharset
    return charsetMap[charsetType] || ALPHANUMERIC
  }, [charsetType, customCharset])

  const generateString = useCallback(() => {
    return generators.randomString(length, getCharset())
  }, [length, getCharset])

  const generateAll = useCallback(() => {
    if (!getCharset()) return
    setValues(Array.from({ length: 5 }, () => generateString()))
  }, [generateString, getCharset])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    if (!getCharset()) return
    generateAll()
    flash('Generated new strings')
  }, [generateAll, getCharset, flash])

  useRegenerateHotkey(handleGenerate)

  const charset = getCharset()
  // Unique characters in the pool (custom charsets can contain duplicates)
  const poolSize = new Set(charset).size
  const estimateBits = useCallback((value?: string): number => {
    const pool = new Set(getCharset()).size
    return pool > 1 ? calculateEntropy(value?.length || length, pool) : 0
  }, [getCharset, length])
  const entropy = estimateBits()

  return (
    <GeneratorLayout
      title="Random String Generator"
      description="Generate cryptographically secure random strings with customizable length and character sets. Perfect for tokens, identifiers, temporary passwords, and testing."
      breadcrumbItems={breadcrumbItems}
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate strings"
        readout={{ bits: entropy, poolSize }}
        error={charsetType === 'custom' && poolSize === 0 ? 'Enter at least one character in the custom charset.' : null}
      >
        <ControlField
          label="Length"
          type="select"
          value={length}
          onChange={(value) => setLength(Number(value))}
          options={[8, 12, 16, 24, 32, 48, 64, 128, 256].map((n) => ({ value: n, label: `${n} characters` }))}
        />
        <ControlField
          label="Character Set"
          type="select"
          value={charsetType}
          onChange={(value) => setCharsetType(value as CharsetOption)}
          options={[
            { value: 'alphanumeric', label: 'Alphanumeric (a-z, A-Z, 0-9)' },
            { value: 'lowercase', label: 'Lowercase only (a-z)' },
            { value: 'uppercase', label: 'Uppercase only (A-Z)' },
            { value: 'numeric', label: 'Numbers only (0-9)' },
            { value: 'hex', label: 'Hexadecimal (0-9, a-f)' },
            { value: 'urlsafe', label: 'URL-safe (a-z, A-Z, 0-9, -, _)' },
            { value: 'custom', label: 'Custom charset' },
          ]}
        />
        {charsetType === 'custom' && (
          <div className="w-full">
            <label className="form-label" htmlFor="custom-charset">Custom Characters</label>
            <input
              id="custom-charset"
              type="text"
              value={customCharset}
              onChange={(e) => setCustomCharset(e.target.value)}
              className="form-input w-full font-mono"
              placeholder="Enter allowed characters..."
            />
          </div>
        )}
      </GeneratorControls>

      <OutputDisplay
        values={values}
        noun="strings"
        getBits={(value) => estimateBits(value)}
        onRegenerate={(index) => {
          setValues((current) => {
            const next = [...current]
            next[index] = generateString()
            return next
          })
        }}
        onRegenerateAll={handleGenerate}
      />

      {/* Usage Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Common Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="font-medium mb-2">Session IDs</h3>
            <p className="text-sm text-[var(--muted)]">
              32+ character alphanumeric strings for secure session identification.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-medium mb-2">Database IDs</h3>
            <p className="text-sm text-[var(--muted)]">
              URL-safe random strings as alternatives to auto-increment IDs.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-medium mb-2">Temporary Tokens</h3>
            <p className="text-sm text-[var(--muted)]">
              One-time verification codes, password reset tokens, email confirmations.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-medium mb-2">Test Data</h3>
            <p className="text-sm text-[var(--muted)]">
              Random strings for testing, mock data generation, and development.
            </p>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="mb-8">
        <SecurityNotice type="info" title="Cryptographically Secure">
          <p>
            These strings are generated using the Web Crypto API&apos;s <code>crypto.getRandomValues()</code>,
            which provides cryptographically secure random values suitable for security-sensitive applications.
          </p>
        </SecurityNotice>
      </section>

      {/* Bulk Generation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generateString}
          getBits={(value) => estimateBits(value)}
          label="strings"
        />
      </section>

      {/* Terminal Commands */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
        <p className="text-[var(--muted)] text-sm mb-4">
          Generate random strings locally using these commands:
        </p>
        <div className="space-y-3">
          <TerminalCommand
            command={`openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c ${length}`}
            description="OpenSSL alphanumeric"
          />
          <TerminalCommand
            command={`openssl rand -hex ${Math.ceil(length / 2)} | head -c ${length}`}
            description="OpenSSL hex"
          />
          <TerminalCommand
            command={`python3 -c "import secrets; print(secrets.token_urlsafe(${Math.ceil(length * 0.75)}))"`}
            description="Python URL-safe"
          />
          <TerminalCommand
            command={`node -e "console.log(require('crypto').randomBytes(${Math.ceil(length / 2)}).toString('hex').slice(0, ${length}))"`}
            description="Node.js"
          />
        </div>
      </section>

      <RelatedContent {...developerRelated} />

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
