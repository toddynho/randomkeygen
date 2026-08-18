'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  ControlField,
  CheckboxField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  TerminalCommand,
  BulkGenerator,
  CodeBlock,
  RelatedContent,
} from '../components'
import { encryptionRelated } from '../components/RelatedContent'

type KeySize = 128 | 192 | 256

const keySizeInfo: Record<KeySize, { bytes: number; description: string }> = {
  128: { bytes: 16, description: 'AES-128 (fast, good for most uses)' },
  192: { bytes: 24, description: 'AES-192 (intermediate)' },
  256: { bytes: 32, description: 'AES-256 (strongest, recommended)' },
}

interface EncryptionKeyPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, unknown>[]
}

export default function EncryptionKeyPageClient({ breadcrumbItems, schema }: EncryptionKeyPageClientProps) {
  const [keySize, setKeySize] = useState<KeySize>(256)
  const [format, setFormat] = useState<'hex' | 'base64'>('hex')
  const [includeIV, setIncludeIV] = useState(true)
  const [keys, setKeys] = useState<string[]>(() => Array.from({ length: 4 }, () => ''))
  const [ivs, setIvs] = useState<string[]>(() => Array.from({ length: 4 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generateKey = useCallback(() => {
    if (format === 'hex') {
      return generators.hex(keySizeInfo[keySize].bytes)
    }
    return generators.base64(keySizeInfo[keySize].bytes)
  }, [keySize, format])

  const generateIV = useCallback(() => {
    return format === 'hex' ? generators.hex(16) : generators.base64(16)
  }, [format])

  const generateAll = useCallback(() => {
    setKeys(Array.from({ length: 4 }, () => generateKey()))
    setIvs(Array.from({ length: 4 }, () => generateIV()))
  }, [generateKey, generateIV])

  const regenerateKey = useCallback((index: number) => {
    setKeys((current) => {
      const next = [...current]
      next[index] = generateKey()
      return next
    })
    setIvs((current) => {
      const next = [...current]
      next[index] = generateIV()
      return next
    })
  }, [generateKey, generateIV])

  const regenerateIv = useCallback((index: number) => {
    setIvs((current) => {
      const next = [...current]
      next[index] = generateIV()
      return next
    })
  }, [generateIV])

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

  const info = keySizeInfo[keySize]
  // Hex and base64 both encode keySize bits of raw random data.
  const getKeyBits = useCallback(() => keySize, [keySize])
  const getIvBits = useCallback(() => 128, [])

  return (
    <GeneratorLayout
      title="Encryption Key Generator"
      description="Generate cryptographically secure keys for AES encryption. Includes initialization vectors (IVs) for CBC and GCM modes."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      storageCallout={
        <div className="space-y-4">
          <SecurityNotice type="warning" title="For demonstration only">
            <p>
              For production encryption, generate keys on your local machine or server using
              the terminal commands below. Never transmit encryption keys over the network.
            </p>
          </SecurityNotice>

          <SecurityNotice type="info" title="IV and key management best practices">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Key storage:</strong> Use hardware security modules (HSMs) or key management services</li>
              <li><strong>Key rotation:</strong> Rotate encryption keys regularly (every 90 days minimum)</li>
              <li><strong>IV uniqueness:</strong> Never reuse an IV with the same key - this breaks semantic security</li>
              <li><strong>IV generation:</strong> Use cryptographically secure random number generators</li>
              <li><strong>Key derivation:</strong> Use PBKDF2, scrypt, or Argon2 when deriving keys from passwords</li>
            </ul>
            <p className="mt-2">
              <Link href="/guides/encryption-explained" className="font-semibold text-[var(--accent)] hover:underline">
                Encryption explained →
              </Link>
            </p>
          </SecurityNotice>
        </div>
      }
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate keys"
        readout={{ bits: keySize, poolSize: 256, poolLabel: `${info.bytes} random bytes — ${info.description}` }}
      >
        <ControlField
          label="Key Size"
          htmlFor="encryption-key-size"
          type="select"
          value={keySize}
          onChange={(value) => setKeySize(Number(value) as KeySize)}
          options={[
            { value: 128, label: '128-bit (16 bytes)' },
            { value: 192, label: '192-bit (24 bytes)' },
            { value: 256, label: '256-bit (32 bytes)' },
          ]}
        />
        <ControlField
          label="Format"
          htmlFor="encryption-key-format"
          type="select"
          value={format}
          onChange={(value) => setFormat(value as 'hex' | 'base64')}
          options={[
            { value: 'hex', label: 'Hexadecimal' },
            { value: 'base64', label: 'Base64' },
          ]}
        />
        <div className="flex items-end">
          <CheckboxField
            label="Include IV"
            checked={includeIV}
            onChange={setIncludeIV}
          />
        </div>
      </GeneratorControls>

      {/* Generated keys */}
      <OutputDisplay
        values={keys}
        noun="keys"
        getBits={getKeyBits}
        onRegenerate={regenerateKey}
        onRegenerateAll={handleRegenerateAll}
      />

      {/* Matching IVs (row N pairs with key N) */}
      {includeIV && (
        <OutputDisplay
          values={ivs}
          noun="initialization vectors"
          getBits={getIvBits}
          onRegenerate={regenerateIv}
        />
      )}

      {/* Usage Example */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          filename="Node.js (crypto)"
          language="javascript"
          code={`const crypto = require('crypto');

const key = Buffer.from('${keys[0] || '...'}', '${format}');
const iv = Buffer.from('${ivs[0] || '...'}', '${format}');

// Encrypt
const cipher = crypto.createCipheriv('aes-${keySize}-gcm', key, iv);
let encrypted = cipher.update('Hello, World!', 'utf8', 'hex');
encrypted += cipher.final('hex');
const authTag = cipher.getAuthTag();

// Decrypt
const decipher = crypto.createDecipheriv('aes-${keySize}-gcm', key, iv);
decipher.setAuthTag(authTag);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');`}
        />
      </section>

      {/* Technical Explanations */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Understanding AES Encryption</h2>

        <div className="space-y-6">
          {/* AES Key Sizes */}
          <div>
            <h3 className="text-lg font-medium mb-3">AES Key Sizes Explained</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="card p-4">
                <h4 className="font-semibold mb-2 text-[var(--accent-strong)]">AES-128</h4>
                <ul className="text-sm space-y-1 text-[var(--muted)]">
                  <li><strong>Key:</strong> 128 bits (16 bytes)</li>
                  <li><strong>Rounds:</strong> 10</li>
                  <li><strong>Security:</strong> ~2^126 operations to break</li>
                  <li><strong>Use case:</strong> Fast, sufficient for most applications</li>
                </ul>
              </div>
              <div className="card p-4">
                <h4 className="font-semibold mb-2 text-[var(--accent-strong)]">AES-192</h4>
                <ul className="text-sm space-y-1 text-[var(--muted)]">
                  <li><strong>Key:</strong> 192 bits (24 bytes)</li>
                  <li><strong>Rounds:</strong> 12</li>
                  <li><strong>Security:</strong> ~2^190 operations to break</li>
                  <li><strong>Use case:</strong> Intermediate security/performance</li>
                </ul>
              </div>
              <div className="card p-4">
                <h4 className="font-semibold mb-2 text-[var(--accent-strong)]">AES-256</h4>
                <ul className="text-sm space-y-1 text-[var(--muted)]">
                  <li><strong>Key:</strong> 256 bits (32 bytes)</li>
                  <li><strong>Rounds:</strong> 14</li>
                  <li><strong>Security:</strong> ~2^254 operations to break</li>
                  <li><strong>Use case:</strong> Maximum security, government/financial</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 rounded-[10px] border border-[var(--accent-border)] bg-[var(--accent-soft)] p-4">
              <p className="text-sm text-[var(--muted)]">
                <strong>256-bit hex keys</strong> provide maximum security with 2^256 possible combinations.
                Even with quantum computers, AES-256 remains secure when properly implemented.
              </p>
            </div>
          </div>

          {/* Encryption Modes */}
          <div>
            <h3 className="text-lg font-medium mb-3">AES Encryption Modes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card p-4">
                <h4 className="font-semibold mb-2 text-[var(--accent-strong)]">GCM (Galois/Counter Mode)</h4>
                <ul className="text-sm space-y-1 mb-3">
                  <li>✓ Authenticated encryption (integrity + confidentiality)</li>
                  <li>✓ Parallel processing possible</li>
                  <li>✓ No padding required</li>
                  <li>✓ Industry standard for modern applications</li>
                </ul>
                <p className="text-xs text-[var(--muted)]">
                  <strong>IV size:</strong> 96 bits (12 bytes) recommended
                </p>
              </div>
              <div className="card p-4">
                <h4 className="font-semibold mb-2 text-[var(--warning)]">CBC (Cipher Block Chaining)</h4>
                <ul className="text-sm space-y-1 mb-3">
                  <li>✓ Widely supported and understood</li>
                  <li>⚠ Requires separate MAC for authentication</li>
                  <li>⚠ Sequential processing only</li>
                  <li>⚠ Padding oracle vulnerabilities possible</li>
                </ul>
                <p className="text-xs text-[var(--muted)]">
                  <strong>IV size:</strong> 128 bits (16 bytes) required
                </p>
              </div>
            </div>
          </div>

          {/* Hex vs Base64 */}
          <div>
            <h3 className="text-lg font-medium mb-3">Format Comparison: Hex vs Base64</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 pr-4">Format</th>
                    <th className="text-left py-2 pr-4">Character Set</th>
                    <th className="text-left py-2 pr-4">Size Efficiency</th>
                    <th className="text-left py-2">Best For</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--muted)]">
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4 font-mono">Hexadecimal</td>
                    <td className="py-2 pr-4">0-9, A-F (16 chars)</td>
                    <td className="py-2 pr-4">2:1 expansion</td>
                    <td className="py-2">URLs, databases, human-readable</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono">Base64</td>
                    <td className="py-2 pr-4">A-Z, a-z, 0-9, +, / (64 chars)</td>
                    <td className="py-2 pr-4">4:3 expansion</td>
                    <td className="py-2">JSON, XML, compact transmission</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Strength */}
          <div>
            <h3 className="text-lg font-medium mb-3">Cryptographic Strength Analysis</h3>
            <div className="card p-4">
              <p className="text-sm mb-3">
                <strong>Time to break AES with current technology:</strong>
              </p>
              <ul className="text-sm space-y-2 text-[var(--muted)]">
                <li>
                  <strong>AES-128:</strong> ~2.9 × 10^32 years (longer than universe age)
                </li>
                <li>
                  <strong>AES-256:</strong> ~3.3 × 10^56 years (incomprehensibly long)
                </li>
                <li className="mt-4 pt-2 border-t border-[var(--border)]">
                  <strong>Quantum resistance:</strong> AES-256 provides ~128-bit post-quantum security
                </li>
              </ul>
            </div>
          </div>

          {/* Real-world Applications */}
          <div>
            <h3 className="text-lg font-medium mb-3">Real-world Applications</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">File Encryption</h4>
                <ul className="text-sm space-y-1 text-[var(--muted)]">
                  <li>• Disk encryption (BitLocker, FileVault)</li>
                  <li>• Encrypted backups</li>
                  <li>• Document protection</li>
                  <li>• Archive encryption</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Network Security</h4>
                <ul className="text-sm space-y-1 text-[var(--muted)]">
                  <li>• TLS/SSL connections</li>
                  <li>• VPN tunnels</li>
                  <li>• Database encryption</li>
                  <li>• Message encryption</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Generation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generateKey}
          getBits={getKeyBits}
          label="keys"
        />
      </section>

      {/* Terminal Commands */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
        <p className="text-[var(--muted)] text-sm mb-4">
          For production systems, always generate encryption keys locally:
        </p>
        <div className="space-y-3">
          <TerminalCommand
            command={`openssl rand -hex ${info.bytes}`}
            description={`AES-${keySize} key (hex)`}
          />
          <TerminalCommand
            command={`openssl rand -base64 ${info.bytes}`}
            description={`AES-${keySize} key (base64)`}
          />
          <TerminalCommand
            command="openssl rand -hex 16"
            description="Initialization vector (IV)"
          />
          <TerminalCommand
            command={`python3 -c "import secrets; print(secrets.token_hex(${info.bytes}))"`}
            description="Python secrets module"
          />
          <TerminalCommand
            command="head -c 32 /dev/urandom | xxd -p -c 64"
            description="Linux /dev/urandom"
          />
        </div>
      </section>

      {/* Related Content */}
      <RelatedContent {...encryptionRelated} />

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
