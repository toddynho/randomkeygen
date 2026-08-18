'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  GeneratorLayout,
  GeneratorControls,
  ControlField,
  CheckboxField,
  GeneratedValue,
  Toast,
  useToast,
  useRegenerateHotkey,
  TerminalCommand,
  CodeBlock,
} from '../components'

interface AesKeyData {
  key: string
  iv: string
  keyHex: string
  ivHex: string
  keyBase64: string
  ivBase64: string
}

type OutputFormat = 'hex' | 'base64' | 'raw'
type CipherMode = 'CBC' | 'GCM' | 'CTR' | 'ECB'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'AES-256 Key Generator', url: '/aes-256-key' },
]

export default function Aes256KeyPageClient() {
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('hex')
  const [cipherMode, setCipherMode] = useState<CipherMode>('GCM')
  const [includeIV, setIncludeIV] = useState(true)
  const [keyData, setKeyData] = useState<AesKeyData | null>(null)
  const [toastMessage, flash] = useToast()

  // Helper to convert ArrayBuffer to hex string
  const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Helper to convert ArrayBuffer to base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  // Helper to convert ArrayBuffer to raw string
  const arrayBufferToRaw = (buffer: ArrayBuffer): string => {
    return String.fromCharCode(...new Uint8Array(buffer))
  }

  const generateAesKey = useCallback(async () => {
    try {
      // Generate 256-bit AES key
      const key = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true, // extractable
        ['encrypt', 'decrypt']
      )

      // Export the key as raw bytes
      const keyBuffer = await window.crypto.subtle.exportKey('raw', key)

      // Generate IV based on cipher mode requirements
      let ivBuffer: ArrayBuffer
      if (cipherMode === 'GCM') {
        // GCM typically uses 96-bit (12 byte) IV
        ivBuffer = window.crypto.getRandomValues(new Uint8Array(12)).buffer
      } else if (cipherMode === 'CTR') {
        // CTR mode uses 128-bit (16 byte) IV/counter
        ivBuffer = window.crypto.getRandomValues(new Uint8Array(16)).buffer
      } else {
        // CBC and ECB use 128-bit (16 byte) IV (though ECB doesn't need IV)
        ivBuffer = window.crypto.getRandomValues(new Uint8Array(16)).buffer
      }

      // Convert to different formats
      const keyHex = arrayBufferToHex(keyBuffer).toUpperCase()
      const ivHex = arrayBufferToHex(ivBuffer).toUpperCase()
      const keyBase64 = arrayBufferToBase64(keyBuffer)
      const ivBase64 = arrayBufferToBase64(ivBuffer)
      const keyRaw = arrayBufferToRaw(keyBuffer)
      const ivRaw = arrayBufferToRaw(ivBuffer)

      setKeyData({
        key: outputFormat === 'hex' ? keyHex : outputFormat === 'base64' ? keyBase64 : keyRaw,
        iv: outputFormat === 'hex' ? ivHex : outputFormat === 'base64' ? ivBase64 : ivRaw,
        keyHex,
        ivHex,
        keyBase64,
        ivBase64
      })
    } catch (error) {
      console.error('Failed to generate AES key:', error)
    }
  }, [cipherMode, outputFormat])

  useEffect(() => {
    generateAesKey()
  }, [generateAesKey])

  const handleGenerate = useCallback(() => {
    generateAesKey()
    flash('Generated new AES-256 key')
  }, [generateAesKey, flash])

  useRegenerateHotkey(handleGenerate)

  // Get the IV size description based on cipher mode
  const getIVDescription = () => {
    switch (cipherMode) {
      case 'GCM':
        return '96-bit (12 bytes) - Recommended for GCM mode'
      case 'CTR':
        return '128-bit (16 bytes) - Counter value for CTR mode'
      case 'CBC':
        return '128-bit (16 bytes) - Required for CBC mode'
      case 'ECB':
        return 'Not used - ECB mode does not require an IV'
      default:
        return '128-bit (16 bytes)'
    }
  }

  const showIv = includeIV && cipherMode !== 'ECB'
  const formatLabel = outputFormat === 'hex' ? 'Hexadecimal' : outputFormat === 'base64' ? 'Base64' : 'Raw bytes'

  return (
    <GeneratorLayout
      title="AES-256 Key Generator"
      description="Generate cryptographically secure 256-bit AES encryption keys with initialization vectors for symmetric encryption. Supports multiple output formats and cipher modes."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <aside className="card p-5">
          <h2 className="mb-1 text-16 font-semibold">Store AES keys securely.</h2>
          <p className="mb-2 text-14 leading-5 text-[var(--muted)]">
            The keys and IVs are generated using your browser&apos;s cryptographically secure random
            number generator and never leave your device. For production use, ensure proper key
            management, secure storage, and follow cryptographic best practices. Never use the same
            IV twice with the same key, and always use authenticated encryption modes like GCM when possible.
          </p>
          <Link href="/guides/encryption-explained" className="text-14 font-semibold text-[var(--accent)] hover:underline">
            Encryption explained →
          </Link>
        </aside>
      }
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate AES-256 key"
        readout={{ bits: 256, poolSize: 256, poolLabel: '32 random bytes (256-bit key)' }}
      >
        <ControlField
          label="Output Format"
          type="select"
          value={outputFormat}
          onChange={(value) => setOutputFormat(value as OutputFormat)}
          options={[
            { value: 'hex', label: 'Hexadecimal' },
            { value: 'base64', label: 'Base64' },
            { value: 'raw', label: 'Raw Bytes' },
          ]}
        />
        <ControlField
          label="Cipher Mode"
          type="select"
          value={cipherMode}
          onChange={(value) => setCipherMode(value as CipherMode)}
          options={[
            { value: 'GCM', label: 'GCM (Recommended)' },
            { value: 'CBC', label: 'CBC' },
            { value: 'CTR', label: 'CTR' },
            { value: 'ECB', label: 'ECB' },
          ]}
        />
        <div className="flex items-end">
          <CheckboxField
            label="Include IV"
            checked={includeIV && cipherMode !== 'ECB'}
            onChange={setIncludeIV}
          />
        </div>
        <div className="w-full rounded-[10px] border border-[var(--band-border)] bg-[var(--band)] px-3 py-2.5 text-sm">
          <strong>IV Size:</strong> {getIVDescription()}
        </div>
      </GeneratorControls>

      {/* Generated Key + IV */}
      {keyData && (
        <section className="mb-8 space-y-5">
          <GeneratedValue
            label="AES-256 Key"
            format={`${formatLabel} · ${keyData.key.length} characters`}
            value={keyData.key}
            onRegenerate={handleGenerate}
          />
          {showIv && (
            <GeneratedValue
              label={`Initialization Vector (${cipherMode})`}
              format={`${formatLabel} · ${keyData.iv.length} characters`}
              value={keyData.iv}
              onRegenerate={handleGenerate}
            />
          )}

          {/* All Formats */}
          <div className="card p-4">
            <h3 className="text-lg font-medium mb-3">All Formats</h3>
            <div className="space-y-4">
              <GeneratedValue label="Key (Hexadecimal)" value={keyData.keyHex} />
              <GeneratedValue label="Key (Base64)" value={keyData.keyBase64} />
              {showIv && (
                <>
                  <GeneratedValue label="IV (Hexadecimal)" value={keyData.ivHex} />
                  <GeneratedValue label="IV (Base64)" value={keyData.ivBase64} />
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Usage Examples */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-4">Usage Examples</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Node.js (crypto module)</h3>
            <CodeBlock
              language="javascript"
              code={`const crypto = require('crypto');

// Your generated key and IV (in hex format)
const key = Buffer.from('${keyData?.keyHex || 'YOUR_256_BIT_KEY_IN_HEX'}', 'hex');
const iv = Buffer.from('${keyData?.ivHex || 'YOUR_IV_IN_HEX'}', 'hex');

// Encrypt
const cipher = crypto.createCipher${cipherMode === 'GCM' ? 'GCM' : ''}('aes-256-${cipherMode.toLowerCase()}', key${showIv ? ', iv' : ''});
let encrypted = cipher.update('Hello World', 'utf8', 'hex');
encrypted += cipher.final('hex');

// Decrypt
const decipher = crypto.createDecipher${cipherMode === 'GCM' ? 'GCM' : ''}('aes-256-${cipherMode.toLowerCase()}', key${showIv ? ', iv' : ''});
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');`}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Python (cryptography library)</h3>
            <CodeBlock
              language="python"
              code={`from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import binascii

# Your generated key and IV
key = binascii.unhexlify('${keyData?.keyHex || 'YOUR_256_BIT_KEY_IN_HEX'}')
${showIv ? `iv = binascii.unhexlify('${keyData?.ivHex || 'YOUR_IV_IN_HEX'}')` : ''}

# Create cipher
cipher = Cipher(
    algorithms.AES(key),
    modes.${cipherMode}(${showIv ? 'iv' : ''}),
    backend=default_backend()
)

# Encrypt
encryptor = cipher.encryptor()
ciphertext = encryptor.update(b"Hello World") + encryptor.finalize()

# Decrypt
decryptor = cipher.decryptor()
plaintext = decryptor.update(ciphertext) + decryptor.finalize()`}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">OpenSSL Command Line</h3>
            <TerminalCommand command={`echo "Hello World" | openssl enc -aes-256-${cipherMode.toLowerCase()} -e -K ${keyData?.keyHex || 'YOUR_KEY_HEX'}${showIv ? ` -iv ${keyData?.ivHex || 'YOUR_IV_HEX'}` : ''} -base64`} />
          </div>
        </div>
      </section>

      {/* AES Modes Comparison */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-4">AES Cipher Modes</h2>

        <div className="overflow-x-auto rounded-[14px] border border-[var(--border)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--band)]">
                <th className="border-b border-[var(--border)] px-4 py-2 text-left">Mode</th>
                <th className="border-b border-[var(--border)] px-4 py-2 text-left">IV Required</th>
                <th className="border-b border-[var(--border)] px-4 py-2 text-left">Parallelizable</th>
                <th className="border-b border-[var(--border)] px-4 py-2 text-left">Security</th>
                <th className="border-b border-[var(--border)] px-4 py-2 text-left">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--hairline)]">
                <td className="px-4 py-2"><strong>GCM</strong></td>
                <td className="px-4 py-2">Yes (96-bit)</td>
                <td className="px-4 py-2">Yes</td>
                <td className="px-4 py-2 font-semibold text-[var(--success)]">Excellent</td>
                <td className="px-4 py-2">Authenticated encryption (recommended)</td>
              </tr>
              <tr className="border-b border-[var(--hairline)]">
                <td className="px-4 py-2">CBC</td>
                <td className="px-4 py-2">Yes (128-bit)</td>
                <td className="px-4 py-2">Decrypt only</td>
                <td className="px-4 py-2 font-semibold text-[var(--accent-strong)]">Good</td>
                <td className="px-4 py-2">Legacy systems, file encryption</td>
              </tr>
              <tr className="border-b border-[var(--hairline)]">
                <td className="px-4 py-2">CTR</td>
                <td className="px-4 py-2">Yes (128-bit)</td>
                <td className="px-4 py-2">Yes</td>
                <td className="px-4 py-2 font-semibold text-[var(--accent-strong)]">Good</td>
                <td className="px-4 py-2">Streaming, high performance</td>
              </tr>
              <tr>
                <td className="px-4 py-2">ECB</td>
                <td className="px-4 py-2">No</td>
                <td className="px-4 py-2">Yes</td>
                <td className="px-4 py-2 font-semibold text-[var(--danger-text)]">Poor</td>
                <td className="px-4 py-2">Not recommended for sensitive data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* About AES-256 */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-4">About AES-256 Encryption</h2>

        <div className="max-w-none text-[var(--muted)]">
          <p className="mb-4">
            AES-256 (Advanced Encryption Standard with 256-bit keys) is a symmetric encryption
            algorithm that is widely considered to be secure and efficient. It is used by
            governments, financial institutions, and security-conscious organizations worldwide.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-medium text-[var(--foreground)] mb-3">Key Features</h3>
              <ul className="space-y-2 text-sm">
                <li>• 256-bit key length (32 bytes)</li>
                <li>• 128-bit block size (16 bytes)</li>
                <li>• 14 encryption rounds</li>
                <li>• Symmetric key encryption</li>
                <li>• NIST approved and FIPS 140-2 validated</li>
                <li>• Resistant to quantum computing attacks</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[var(--foreground)] mb-3">Use Cases</h3>
              <ul className="space-y-2 text-sm">
                <li>• File and disk encryption</li>
                <li>• Database encryption</li>
                <li>• VPN and network security</li>
                <li>• Mobile app security</li>
                <li>• Cloud storage protection</li>
                <li>• Government and military communications</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-[14px] border border-[var(--band-border)] bg-[var(--band)] p-4">
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">Security Considerations</h3>
            <ul className="space-y-2 text-sm">
              <li>• Always use a unique, random key for each encryption operation</li>
              <li>• Never reuse initialization vectors (IVs) with the same key</li>
              <li>• Use GCM mode when possible for authenticated encryption</li>
              <li>• Store keys securely and separately from encrypted data</li>
              <li>• Consider key derivation functions (PBKDF2, scrypt, Argon2) for password-based encryption</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-4">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-medium mb-2">What is the difference between AES-128, AES-192, and AES-256?</h3>
            <p className="text-sm text-[var(--muted)]">
              The numbers refer to the key length in bits. AES-256 uses 256-bit keys, providing the highest
              security level. It requires more processing power but offers stronger protection against
              brute force attacks. AES-256 is recommended for sensitive data and compliance requirements.
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-2">What is an Initialization Vector (IV) and why do I need it?</h3>
            <p className="text-sm text-[var(--muted)]">
              An IV is a random value used to ensure that identical plaintext blocks encrypt to different
              ciphertext blocks. This prevents patterns in your data from being visible in the encrypted output.
              Each encryption operation should use a unique IV, but the IV doesn't need to be secret.
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-2">Which cipher mode should I use?</h3>
            <p className="text-sm text-[var(--muted)]">
              <strong>GCM mode</strong> is recommended for most applications as it provides both encryption and
              authentication. <strong>CBC mode</strong> is widely supported but requires separate authentication.{' '}
              <strong>CTR mode</strong> is good for parallel processing. Avoid ECB mode as it's not secure for most use cases.
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-2">Can I reuse the same key and IV?</h3>
            <p className="text-sm text-[var(--muted)]">
              You can reuse the same key for multiple encryptions, but you must <strong>never reuse the same IV
              with the same key</strong>. Each encryption operation requires a unique IV. The IV can be stored
              alongside the encrypted data as it doesn't need to be kept secret.
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-2">How do I use these keys in my application?</h3>
            <p className="text-sm text-[var(--muted)]">
              Copy the hex or base64 encoded key into your application's cryptographic library. Most programming
              languages have AES implementations that accept these formats. Always use established crypto libraries
              rather than implementing AES yourself.
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-2">How should I store AES keys securely?</h3>
            <p className="text-sm text-[var(--muted)]">
              Never hardcode keys in your source code. Use environment variables, key management systems
              (AWS KMS, Azure Key Vault), or secure configuration files with restricted access. For database
              encryption, consider using transparent data encryption (TDE) or application-level encryption.
            </p>
          </div>
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
