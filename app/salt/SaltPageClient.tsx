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

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'Salt Generator', url: '/salt' },
]

export default function SaltPage() {
  const [length, setLength] = useState(16)
  const [format, setFormat] = useState<'hex' | 'base64'>('hex')
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 6 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generateSalt = useCallback(() => {
    if (format === 'hex') {
      return generators.salt(length)
    }
    return generators.base64(length)
  }, [length, format])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 6 }, () => generateSalt()))
  }, [generateSalt])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new salts')
  }, [generateAll, flash])

  useRegenerateHotkey(handleGenerate)

  // Entropy is the raw byte length — encoding (hex/base64) doesn't change it
  const entropy = length * 8

  return (
    <GeneratorLayout
      title="Salt Generator"
      description="Generate cryptographically random salt values for password hashing and other cryptographic operations. Salts ensure identical inputs produce different outputs."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <aside className="card p-5">
          <h2 className="mb-1 text-16 font-semibold">Use proper password hashing.</h2>
          <p className="mb-2 text-14 leading-5 text-[var(--muted)]">
            For password storage, use algorithms like <strong>bcrypt</strong>, <strong>argon2</strong>,
            or <strong>scrypt</strong> which handle salt generation internally. Only use manual salting
            for other cryptographic operations.
          </p>
          <Link href="/guides/encryption-explained" className="text-14 font-semibold text-[var(--accent)] hover:underline">
            Encryption explained →
          </Link>
        </aside>
      }
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate salts"
        readout={{ bits: entropy, poolSize: format === 'hex' ? 16 : 64, poolLabel: `${length} random bytes` }}
      >
        <ControlField
          label="Length (bytes)"
          type="select"
          value={length}
          onChange={(value) => setLength(Number(value))}
          options={[
            { value: 8, label: '8 bytes (64 bits)' },
            { value: 16, label: '16 bytes (128 bits)' },
            { value: 24, label: '24 bytes (192 bits)' },
            { value: 32, label: '32 bytes (256 bits)' },
          ]}
        />
        <ControlField
          label="Format"
          type="select"
          value={format}
          onChange={(value) => setFormat(value as 'hex' | 'base64')}
          options={[
            { value: 'hex', label: 'Hexadecimal' },
            { value: 'base64', label: 'Base64' },
          ]}
        />
      </GeneratorControls>

      <OutputDisplay
        values={values}
        noun="salts"
        getBits={() => entropy}
        onRegenerate={(index) => {
          setValues((current) => {
            const next = [...current]
            next[index] = generateSalt()
            return next
          })
        }}
        onRegenerateAll={handleGenerate}
      />

      {/* Usage */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
        <div className="space-y-4">
          <CodeBlock
            filename="Python (bcrypt)"
            language="python"
            code={`import bcrypt

password = b"user_password"

# bcrypt generates its own salt internally
hashed = bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))

# Verify
if bcrypt.checkpw(password, hashed):
    print("Password matches!")`}
          />
          <CodeBlock
            filename="Node.js (argon2)"
            language="javascript"
            code={`const argon2 = require('argon2');

// argon2 generates salt internally
const hash = await argon2.hash('user_password');

// Verify
if (await argon2.verify(hash, 'user_password')) {
    console.log('Password matches!');
}`}
          />
          <CodeBlock
            filename="Manual salt usage"
            language="javascript"
            code={`const crypto = require('crypto');

const salt = '${values[0] || '...'}';
const password = 'user_password';

// PBKDF2 with custom salt
const hash = crypto.pbkdf2Sync(
  password,
  Buffer.from(salt, 'hex'),
  100000,  // iterations
  64,      // key length
  'sha512'
).toString('hex');`}
          />
        </div>
      </section>

      {/* Info */}
      <section className="mb-8">
        <SecurityNotice type="info" title="Why use salts?">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Prevents rainbow table attacks</li>
            <li>Ensures identical passwords hash to different values</li>
            <li>Makes precomputation attacks infeasible</li>
            <li>Salts should be unique per password, not secret</li>
          </ul>
        </SecurityNotice>
      </section>

      {/* Bulk Generation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generateSalt}
          getBits={() => entropy}
          label="salts"
        />
      </section>

      {/* Terminal Commands */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
        <div className="space-y-3">
          <TerminalCommand
            command={`openssl rand -hex ${length}`}
            description={`${length}-byte salt (hex)`}
          />
          <TerminalCommand
            command={`python3 -c "import secrets; print(secrets.token_hex(${length}))"`}
            description="Python"
          />
          <TerminalCommand
            command={`head -c ${length} /dev/urandom | xxd -p -c 64`}
            description="Linux /dev/urandom"
          />
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
