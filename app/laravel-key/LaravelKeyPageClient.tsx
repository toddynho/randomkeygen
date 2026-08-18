'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
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
} from '../components'

interface LaravelKeyPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
}

// APP_KEY encodes 32 random bytes: real entropy is 32 * 8 = 256 bits.
const KEY_BYTES = 32
const KEY_BITS = KEY_BYTES * 8

// Visible "How to use" cards converted from the legacy "Installation" prose.
const HOW_TO_STEPS = [
  {
    title: 'Copy the key',
    body: 'Click on any generated key above to copy it to your clipboard.',
  },
  {
    title: 'Update your .env file',
    body: "Paste the key as the value of APP_KEY in your Laravel project's .env file.",
  },
  {
    title: 'Clear config cache (if needed)',
    body: 'Run "php artisan config:clear" so Laravel picks up the new key.',
  },
]

export default function LaravelKeyPageClient({ breadcrumbItems }: LaravelKeyPageClientProps) {
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 5 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generateKey = useCallback(() => {
    return generators.laravelKey()
  }, [])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 5 }, () => generateKey()))
  }, [generateKey])

  const regenerateValue = useCallback((index: number) => {
    setValues((current) => {
      const next = [...current]
      next[index] = generateKey()
      return next
    })
  }, [generateKey])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new keys')
  }, [generateAll, flash])

  const handleRegenerateAll = useCallback(() => {
    generateAll()
    flash('Regenerated all')
  }, [generateAll, flash])

  // `R` regenerates everything when no field has focus
  useRegenerateHotkey(handleRegenerateAll)

  const getBits = useCallback(() => KEY_BITS, [])

  return (
    <GeneratorLayout
      title="Laravel APP_KEY Generator"
      description="Generate secure application encryption keys for Laravel projects. These keys are used for encrypting cookies, sessions, and other sensitive data."
      breadcrumbItems={breadcrumbItems}
      howToSteps={HOW_TO_STEPS}
      howToHeading="How to install your APP_KEY"
      storageCallout={
        <SecurityNotice type="warning" title="Production Warning">
          <p>
            Changing APP_KEY in production will invalidate all encrypted data, including user sessions,
            cookies, and any data encrypted with the old key. Only change it during initial setup or
            if you suspect the key has been compromised.
          </p>
          <p className="mt-2">
            <Link href="/guides/api-key-best-practices" className="font-semibold text-[var(--accent)] hover:underline">
              API key &amp; secret handling best practices →
            </Link>
          </p>
        </SecurityNotice>
      }
    >
      {/* Format info + generate */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate keys"
        readout={{ bits: KEY_BITS, poolSize: 256, poolLabel: `${KEY_BYTES} random bytes` }}
      >
        <ControlField label="Format">
          <code className="text-sm">base64:&lt;32 bytes&gt;</code>
        </ControlField>
        <ControlField label="Cipher">
          <span className="text-sm">AES-256-CBC</span>
        </ControlField>
      </GeneratorControls>

      {/* Generated keys */}
      <OutputDisplay
        values={values}
        noun="keys"
        getBits={getBits}
        onRegenerate={regenerateValue}
        onRegenerateAll={handleRegenerateAll}
      />

      {/* Usage Example */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add to .env File</h2>
        <CodeBlock
          filename=".env"
          code={`APP_KEY=${values[0] || 'base64:...'}`}
        />
      </section>

      {/* Why you need this */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Why Laravel Needs APP_KEY</h2>
        <div className="prose max-w-none">
          <ul className="list-disc list-inside space-y-2 text-[var(--muted)]">
            <li>Encrypts session data to prevent tampering</li>
            <li>Secures cookies containing sensitive information</li>
            <li>Used by Laravel&apos;s encryption facade for <code>encrypt()</code> and <code>decrypt()</code></li>
            <li>Protects CSRF tokens and other security features</li>
            <li>Required for signed URLs and password reset tokens</li>
          </ul>
        </div>
      </section>

      {/* Bulk Generation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generateKey}
          getBits={getBits}
          label="keys"
        />
      </section>

      {/* Terminal Commands */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Generate Locally</h2>
        <p className="text-[var(--muted)] text-sm mb-4">
          The recommended way is to use Laravel&apos;s built-in command:
        </p>
        <div className="space-y-3">
          <TerminalCommand
            command="php artisan key:generate"
            description="Laravel Artisan (preferred)"
          />
          <TerminalCommand
            command={`echo "base64:$(openssl rand -base64 32)"`}
            description="OpenSSL"
          />
          <TerminalCommand
            command={`php -r "echo 'base64:' . base64_encode(random_bytes(32)) . PHP_EOL;"`}
            description="PHP CLI"
          />
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
