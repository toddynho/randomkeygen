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

type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512'

const algorithmInfo: Record<HashAlgorithm, { bits: number; bytes: number }> = {
  'SHA-256': { bits: 256, bytes: 32 },
  'SHA-384': { bits: 384, bytes: 48 },
  'SHA-512': { bits: 512, bytes: 64 },
}

interface HmacKeyPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, unknown>[]
}

export default function HmacKeyPageClient({ breadcrumbItems, schema }: HmacKeyPageClientProps) {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256')
  const [format, setFormat] = useState<'base64' | 'hex'>('base64')
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 4 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generateSecret = useCallback(() => {
    const bytes = algorithmInfo[algorithm].bytes
    if (format === 'hex') {
      return generators.hex(bytes)
    }
    return generators.hmacSecret(bytes)
  }, [algorithm, format])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 4 }, () => generateSecret()))
  }, [generateSecret])

  const regenerateValue = useCallback((index: number) => {
    setValues((current) => {
      const next = [...current]
      next[index] = generateSecret()
      return next
    })
  }, [generateSecret])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new secrets')
  }, [generateAll, flash])

  const handleRegenerateAll = useCallback(() => {
    generateAll()
    flash('Regenerated all')
  }, [generateAll, flash])

  // `R` regenerates everything when no field has focus
  useRegenerateHotkey(handleRegenerateAll)

  const info = algorithmInfo[algorithm]
  // Both encodings carry the same underlying random bytes: bits = bytes * 8.
  const getBits = useCallback(() => algorithmInfo[algorithm].bytes * 8, [algorithm])

  return (
    <GeneratorLayout
      title="HMAC Secret Generator"
      description="Generate secure secrets for HMAC (Hash-based Message Authentication Code). Used to verify data integrity and authenticity."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      storageCallout={
        <SecurityNotice type="info" title="When to use HMAC">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Verifying API request signatures (e.g., webhooks)</li>
            <li>Creating secure session tokens</li>
            <li>Authenticating messages between services</li>
            <li>Implementing signed URLs</li>
          </ul>
        </SecurityNotice>
      }
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate secrets"
        readout={{ bits: info.bits, poolSize: 256, poolLabel: `${info.bytes} random bytes` }}
      >
        <ControlField
          label="Hash Algorithm"
          htmlFor="hmac-algorithm"
          type="select"
          value={algorithm}
          onChange={(value) => setAlgorithm(value as HashAlgorithm)}
          options={[
            { value: 'SHA-256', label: 'HMAC-SHA256' },
            { value: 'SHA-384', label: 'HMAC-SHA384' },
            { value: 'SHA-512', label: 'HMAC-SHA512' },
          ]}
        />
        <ControlField
          label="Format"
          htmlFor="hmac-format"
          type="select"
          value={format}
          onChange={(value) => setFormat(value as 'base64' | 'hex')}
          options={[
            { value: 'base64', label: 'Base64' },
            { value: 'hex', label: 'Hexadecimal' },
          ]}
        />
      </GeneratorControls>

      {/* Generated secrets */}
      <OutputDisplay
        values={values}
        noun="secrets"
        getBits={getBits}
        onRegenerate={regenerateValue}
        onRegenerateAll={handleRegenerateAll}
      />

      {/* Usage */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
        <div className="space-y-4">
          <CodeBlock
            filename="Node.js"
            language="javascript"
            code={`const crypto = require('crypto');

const secret = '${values[0] || '...'}';
const message = 'Data to authenticate';

const hmac = crypto.createHmac('sha256', Buffer.from(secret, '${format}'));
hmac.update(message);
const signature = hmac.digest('hex');

console.log(signature);`}
          />
          <CodeBlock
            filename="Python"
            language="python"
            code={`import hmac
import hashlib
import base64

secret = base64.b64decode('${values[0] || '...'}')
message = b'Data to authenticate'

signature = hmac.new(secret, message, hashlib.sha256).hexdigest()
print(signature)`}
          />
        </div>
      </section>

      {/* Bulk Generation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generateSecret}
          getBits={getBits}
          label="secrets"
        />
      </section>

      {/* What is HMAC? */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What is HMAC?</h2>
        <div className="prose max-w-none">
          <p className="mb-4">
            HMAC (Hash-based Message Authentication Code) combines a secret key with a hash function
            to provide both data integrity and authenticity verification. It&apos;s faster than digital
            signatures while ensuring only someone with the secret key could have created the hash.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="card p-4">
              <h3 className="font-semibold mb-2">🔐 Authentication</h3>
              <p className="text-sm text-[var(--muted)]">
                Verifies message authenticity. Only someone with the secret key
                can generate valid HMACs, preventing impersonation attacks.
              </p>
            </div>
            <div className="card p-4">
              <h3 className="font-semibold mb-2">✅ Integrity</h3>
              <p className="text-sm text-[var(--muted)]">
                Detects any data tampering. Even single-bit changes will
                result in completely different HMAC values.
              </p>
            </div>
            <div className="card p-4">
              <h3 className="font-semibold mb-2">🚀 Performance</h3>
              <p className="text-sm text-[var(--muted)]">
                Much faster than RSA signatures while providing similar
                security when both parties share the secret key.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Use Cases */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">HMAC Applications</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">🔐</span> API Security
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted)]">
              <li><strong>JWT Signing:</strong> HS256 algorithm for JSON Web Tokens</li>
              <li><strong>Webhook Verification:</strong> GitHub, Stripe signatures</li>
              <li><strong>Request Signing:</strong> API request authenticity</li>
              <li><strong>OAuth 1.0:</strong> Request parameter signing</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">🌐</span> Web Security
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted)]">
              <li><strong>Session Tokens:</strong> Tamper-proof identifiers</li>
              <li><strong>CSRF Protection:</strong> Anti-forgery tokens</li>
              <li><strong>Cookie Signing:</strong> Prevent tampering</li>
              <li><strong>Password Reset:</strong> Secure reset tokens</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Implementation Examples */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Implementation Examples</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Node.js HMAC</h3>
            <CodeBlock
              filename="hmac-node.js"
              code={`const crypto = require('crypto');

// Generate secret (store securely!)
const secret = crypto.randomBytes(32);

// Create HMAC
function createHMAC(message, secret) {
  return crypto.createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}

// Verify HMAC (timing-safe)
function verifyHMAC(message, signature, secret) {
  const expected = createHMAC(message, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expected, 'hex')
  );
}

// Usage
const message = '{"user":"john","amount":100}';
const hmac = createHMAC(message, secret);
const valid = verifyHMAC(message, hmac, secret);

console.log('HMAC:', hmac);
console.log('Valid:', valid);`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Python HMAC</h3>
            <CodeBlock
              filename="hmac-python.py"
              code={`import hmac
import hashlib
import secrets

# Generate secret
secret = secrets.token_bytes(32)

# Create HMAC
def create_hmac(message, secret):
    return hmac.new(
        secret,
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

# Verify HMAC
def verify_hmac(message, signature, secret):
    expected = create_hmac(message, secret)
    return hmac.compare_digest(signature, expected)

# Usage
message = "Hello HMAC!"
signature = create_hmac(message, secret)
is_valid = verify_hmac(message, signature, secret)

print(f"HMAC: {signature}")
print(f"Valid: {is_valid}")`}
            />
          </div>
        </div>
      </section>

      {/* Terminal Commands */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
        <div className="space-y-3">
          <TerminalCommand
            command={`openssl rand -base64 ${info.bytes}`}
            description="OpenSSL (base64)"
          />
          <TerminalCommand
            command={`openssl rand -hex ${info.bytes}`}
            description="OpenSSL (hex)"
          />
          <TerminalCommand
            command={`python3 -c "import secrets; print(secrets.token_urlsafe(${info.bytes}))"`}
            description="Python"
          />
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
