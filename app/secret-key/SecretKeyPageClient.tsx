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
} from '../components'
import { RelatedContent, encryptionRelated } from '../components/RelatedContent'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'Secret Key Generator', url: '/secret-key' },
]

export default function SecretKeyPage() {
  const [length, setLength] = useState(32)
  const [format, setFormat] = useState<'base64' | 'hex' | 'urlsafe'>('base64')
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 5 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generateSecret = useCallback(() => {
    switch (format) {
      case 'hex':
        return generators.hex(length)
      case 'urlsafe':
        return generators.urlSafeBase64(length)
      default:
        return generators.base64(length)
    }
  }, [length, format])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 5 }, () => generateSecret()))
  }, [generateSecret])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new secrets')
  }, [generateAll, flash])

  useRegenerateHotkey(handleGenerate)

  // Entropy is the raw byte length — encoding (hex/base64) doesn't change it
  const entropy = length * 8

  return (
    <GeneratorLayout
      title="Secret Key Generator"
      description="Generate cryptographically secure secrets for session management, API authentication, and other security-sensitive applications."
      breadcrumbItems={breadcrumbItems}
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate secrets"
        readout={{ bits: entropy, poolSize: format === 'hex' ? 16 : 64, poolLabel: `${length} random bytes` }}
      >
        <ControlField
          label="Length (bytes)"
          type="select"
          value={length}
          onChange={(value) => setLength(Number(value))}
          options={[
            { value: 16, label: '16 bytes (128 bits)' },
            { value: 24, label: '24 bytes (192 bits)' },
            { value: 32, label: '32 bytes (256 bits)' },
            { value: 48, label: '48 bytes (384 bits)' },
            { value: 64, label: '64 bytes (512 bits)' },
          ]}
        />
        <ControlField
          label="Format"
          type="select"
          value={format}
          onChange={(value) => setFormat(value as 'base64' | 'hex' | 'urlsafe')}
          options={[
            { value: 'base64', label: 'Base64' },
            { value: 'urlsafe', label: 'URL-safe Base64' },
            { value: 'hex', label: 'Hexadecimal' },
          ]}
        />
      </GeneratorControls>

      <OutputDisplay
        values={values}
        noun="secrets"
        getBits={() => entropy}
        onRegenerate={(index) => {
          setValues((current) => {
            const next = [...current]
            next[index] = generateSecret()
            return next
          })
        }}
        onRegenerateAll={handleGenerate}
      />

      {/* Usage */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Common Uses</h2>
        <div className="space-y-4">
          <CodeBlock
            filename=".env"
            code={`# Session secret
SESSION_SECRET=${values[0] || '...'}

# Cookie signing secret
COOKIE_SECRET=${values[1] || '...'}

# CSRF token secret
CSRF_SECRET=${values[2] || '...'}`}
          />
          <CodeBlock
            filename="Express.js session"
            language="javascript"
            code={`const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));`}
          />
        </div>
      </section>

      {/* Info */}
      <section className="mb-8">
        <SecurityNotice type="info" title="Choosing secret length">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>128 bits (16 bytes):</strong> Minimum for most applications</li>
            <li><strong>256 bits (32 bytes):</strong> Recommended for session secrets</li>
            <li><strong>512 bits (64 bytes):</strong> Maximum security for sensitive operations</li>
          </ul>
        </SecurityNotice>
      </section>

      {/* Bulk Generation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generateSecret}
          getBits={() => entropy}
          label="secrets"
        />
      </section>

      {/* Terminal Commands */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
        <div className="space-y-3">
          <TerminalCommand
            command={`openssl rand -base64 ${length}`}
            description="Base64"
          />
          <TerminalCommand
            command={`openssl rand -hex ${length}`}
            description="Hexadecimal"
          />
          <TerminalCommand
            command={`python3 -c "import secrets; print(secrets.token_urlsafe(${length}))"`}
            description="URL-safe (Python)"
          />
          <TerminalCommand
            command={`node -e "console.log(require('crypto').randomBytes(${length}).toString('base64'))"`}
            description="Node.js"
          />
        </div>
      </section>

      <RelatedContent {...encryptionRelated} />

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
