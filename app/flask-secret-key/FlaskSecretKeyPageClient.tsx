'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators, bytesToBase64, getSecureRandom } from '../lib/crypto'
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

type FormatOption = 'hex' | 'bytes' | 'base64'

interface FlaskSecretKeyPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
}

export default function FlaskSecretKeyPageClient({ breadcrumbItems }: FlaskSecretKeyPageClientProps) {
  const [format, setFormat] = useState<FormatOption>('hex')
  const [length, setLength] = useState(24)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 5 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generateKey = useCallback(() => {
    switch (format) {
      case 'bytes': {
        // Python bytes representation
        const bytes = getSecureRandom(length)
        return `b'${Array.from(bytes).map(b => '\\x' + b.toString(16).padStart(2, '0')).join('')}'`
      }
      case 'base64':
        return bytesToBase64(getSecureRandom(length))
      case 'hex':
      default:
        return generators.flaskSecret(length)
    }
  }, [format, length])

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

  // All formats encode `length` random bytes: real entropy is length * 8 bits.
  const entropyBits = length * 8
  const getBits = useCallback(() => length * 8, [length])

  return (
    <GeneratorLayout
      title="Flask Secret Key Generator"
      description="Generate secure SECRET_KEY values for Flask applications. Essential for session security, CSRF protection, and cookie signing."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <SecurityNotice type="warning" title="Security Best Practices">
          <ul className="list-disc list-inside space-y-1">
            <li>Never commit SECRET_KEY to version control</li>
            <li>Use environment variables in production</li>
            <li>Use at least 24 bytes (192 bits) for security</li>
            <li>Changing the key invalidates all existing sessions</li>
          </ul>
          <p className="mt-2">
            <Link href="/guides/api-key-best-practices" className="font-semibold text-[var(--accent)] hover:underline">
              API key &amp; secret handling best practices →
            </Link>
          </p>
        </SecurityNotice>
      }
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate keys"
        readout={{ bits: entropyBits, poolSize: 256, poolLabel: `${length} random bytes` }}
      >
        <ControlField
          label="Format"
          htmlFor="flask-format"
          type="select"
          value={format}
          onChange={(value) => setFormat(value as FormatOption)}
          options={[
            { value: 'hex', label: 'Hexadecimal string' },
            { value: 'bytes', label: 'Python bytes literal' },
            { value: 'base64', label: 'Base64 string' },
          ]}
        />
        <ControlField
          label="Key Size (bytes)"
          htmlFor="flask-length"
          type="select"
          value={length}
          onChange={(value) => setLength(Number(value))}
          options={[
            { value: 16, label: '16 bytes (128 bits)' },
            { value: 24, label: '24 bytes (192 bits)' },
            { value: 32, label: '32 bytes (256 bits)' },
            { value: 64, label: '64 bytes (512 bits)' },
          ]}
        />
      </GeneratorControls>

      {/* Generated keys */}
      <OutputDisplay
        values={values}
        noun="keys"
        getBits={getBits}
        onRegenerate={regenerateValue}
        onRegenerateAll={handleRegenerateAll}
      />

      {/* Usage Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Usage in Flask</h2>

        <div className="space-y-4">
          <CodeBlock
            filename="config.py"
            code={`import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or '${values[0] || 'your-secret-key'}'`}
          />

          <CodeBlock
            filename=".env"
            code={`SECRET_KEY=${values[0] || 'your-secret-key'}`}
          />

          <CodeBlock
            filename="app.py"
            code={`from flask import Flask
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
app.config.from_object('config.Config')`}
          />
        </div>
      </section>

      {/* What it protects */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">What SECRET_KEY Protects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="font-medium mb-2">Session Data</h3>
            <p className="text-sm text-[var(--muted)]">
              Flask sessions are cryptographically signed using SECRET_KEY to prevent tampering.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-medium mb-2">CSRF Tokens</h3>
            <p className="text-sm text-[var(--muted)]">
              Flask-WTF uses SECRET_KEY to generate and validate CSRF protection tokens.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-medium mb-2">Cookies</h3>
            <p className="text-sm text-[var(--muted)]">
              Secure cookies are signed to ensure they haven&apos;t been modified by clients.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-medium mb-2">Flask-Login</h3>
            <p className="text-sm text-[var(--muted)]">
              Remember-me tokens and session authentication rely on SECRET_KEY.
            </p>
          </div>
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
        <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
        <p className="text-[var(--muted)] text-sm mb-4">
          Generate Flask secret keys locally using Python:
        </p>
        <div className="space-y-3">
          <TerminalCommand
            command={`python3 -c "import secrets; print(secrets.token_hex(24))"`}
            description="Python secrets (recommended)"
          />
          <TerminalCommand
            command={`python3 -c "import os; print(os.urandom(24).hex())"`}
            description="Python os.urandom"
          />
          <TerminalCommand
            command="openssl rand -hex 24"
            description="OpenSSL"
          />
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
