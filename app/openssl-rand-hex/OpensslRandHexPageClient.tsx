'use client'

import { useState, useEffect, useCallback } from 'react'
import { generators } from '../lib/crypto'
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
  CodeBlock,
  RelatedContent,
} from '../components'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'OpenSSL rand -hex Generator', url: '/openssl-rand-hex' },
]

// Same presets people type after `openssl rand -hex`: the number is bytes, not characters.
const BYTE_PRESETS = [16, 32, 64]

// Base64 encodes every 3 bytes as 4 characters (padded), so 32 bytes -> 44 characters.
const base64Length = (bytes: number) => Math.ceil(bytes / 3) * 4

export default function OpensslRandHexPage() {
  const [length, setLength] = useState(32)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 5 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generateHex = useCallback(() => {
    return generators.hex(length)
  }, [length])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 5 }, () => generateHex()))
  }, [generateHex])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new hex strings')
  }, [generateAll, flash])

  useRegenerateHotkey(handleGenerate)

  // Entropy is the raw byte length — hex encoding doesn't change it
  const entropy = length * 8
  const hexChars = length * 2

  return (
    <GeneratorLayout
      title="OpenSSL rand -hex 32 Generator"
      description="Generate the same kind of random hexadecimal string that openssl rand -hex 32 prints in a terminal: 16, 32 or 64 cryptographically random bytes encoded as hex, created in your browser."
      breadcrumbItems={breadcrumbItems}
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate hex strings"
        readout={{ bits: entropy, poolSize: 16, poolLabel: `${length} random bytes` }}
      >
        <ControlField
          label="Bytes (openssl rand -hex N)"
          type="select"
          value={length}
          onChange={(value) => setLength(Number(value))}
          options={BYTE_PRESETS.map((bytes) => ({
            value: bytes,
            label: `${bytes} bytes (${bytes * 2} hex characters, ${bytes * 8} bits)`,
          }))}
        />
        <ControlField label="Output">
          <code className="text-sm">{hexChars} chars, 0-9 a-f</code>
        </ControlField>
      </GeneratorControls>

      <OutputDisplay
        values={values}
        noun="hex strings"
        getBits={() => entropy}
        onRegenerate={(index) => {
          setValues((current) => {
            const next = [...current]
            next[index] = generateHex()
            return next
          })
        }}
        onRegenerateAll={handleGenerate}
      />

      {/* Terminal Commands */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">The matching OpenSSL commands</h2>
        <p className="text-[var(--muted)] text-sm mb-4">
          Both commands read {length} random bytes from OpenSSL&apos;s CSPRNG. The only difference is how
          those bytes are printed: hex gives {hexChars} characters, Base64 gives {base64Length(length)}.
        </p>
        <div className="space-y-3">
          <TerminalCommand
            command={`openssl rand -hex ${length}`}
            description={`${length} bytes as ${hexChars} hex characters`}
          />
          <TerminalCommand
            command={`openssl rand -base64 ${length}`}
            description={`${length} bytes as ${base64Length(length)} Base64 characters`}
          />
          <TerminalCommand
            command={`python3 -c "import secrets; print(secrets.token_hex(${length}))"`}
            description="Python equivalent"
          />
          <TerminalCommand
            command={`node -e "console.log(require('crypto').randomBytes(${length}).toString('hex'))"`}
            description="Node.js equivalent"
          />
        </div>
      </section>

      {/* What the command does */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">What openssl rand -hex 32 does</h2>
        <div className="prose max-w-none">
          <ul className="list-disc list-inside space-y-2 text-[var(--muted)]">
            <li><code>rand</code> asks OpenSSL for cryptographically secure random bytes</li>
            <li><code>32</code> is the number of bytes, not characters — 32 bytes is 256 bits of entropy</li>
            <li><code>-hex</code> prints each byte as two hexadecimal digits, so you get a 64-character string</li>
            <li><code>-base64</code> prints the same bytes as Base64 instead, a shorter string that can contain <code>+</code>, <code>/</code> and <code>=</code></li>
            <li>Need a different length? <code>openssl rand -hex 16</code> gives 32 characters (128 bits) and <code>openssl rand -hex 64</code> gives 128 characters (512 bits)</li>
          </ul>
        </div>
      </section>

      {/* Usage */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Common Uses</h2>
        <div className="space-y-4">
          <CodeBlock
            filename=".env"
            code={`# Any secret that wants a random hex value
SECRET_KEY=${values[0] || '...'}

# Encryption key (32 bytes = AES-256)
ENCRYPTION_KEY=${values[1] || '...'}

# Webhook or signing secret
WEBHOOK_SECRET=${values[2] || '...'}`}
          />
        </div>
      </section>

      {/* Info */}
      <section className="mb-8">
        <SecurityNotice type="info" title="Hex or Base64?">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Hex</strong> is safe to paste anywhere: only 0-9 and a-f, no symbols to escape in shells, URLs or config files</li>
            <li><strong>Base64</strong> is about a third shorter but can include <code>+</code>, <code>/</code> and <code>=</code></li>
            <li>Pick by what the receiving software expects — the entropy is identical for the same byte count</li>
          </ul>
        </SecurityNotice>
      </section>

      {/* Bulk Generation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generateHex}
          getBits={() => entropy}
          label="hex strings"
        />
      </section>

      <RelatedContent
        tools={[
          { href: '/secret-key', label: 'Secret key generator', description: 'Base64, hex and URL-safe secrets' },
          { href: '/salt', label: 'Salt generator', description: 'Random salts for password hashing' },
          { href: '/aes-256-key', label: 'AES-256 key generator', description: 'Hex or Base64 256-bit keys' },
          { href: '/laravel-key', label: 'Laravel APP_KEY generator', description: 'base64: keys for .env' },
          { href: '/random-string', label: 'Random string generator', description: 'Custom length and charset' },
        ]}
        guides={[
          { href: '/guides/api-key-best-practices', title: 'API Key Storage and Rotation' },
          { href: '/guides/encryption-explained', title: 'Encryption Explained: AES vs RSA' },
        ]}
      />

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
