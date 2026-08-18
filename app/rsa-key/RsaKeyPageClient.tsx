'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  GeneratorLayout,
  GeneratorControls,
  ControlField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  TerminalCommand,
  CodeBlock,
} from '../components'

interface RsaKeyPair {
  publicKey: string
  privateKey: string
}

interface RsaKeyPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, any>[]
}

// Helper to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// Format as PEM
function formatPem(base64: string, type: 'PUBLIC' | 'PRIVATE'): string {
  const lines = base64.match(/.{1,64}/g) || []
  return `-----BEGIN ${type} KEY-----\n${lines.join('\n')}\n-----END ${type} KEY-----`
}

const HOW_TO_STEPS = [
  {
    title: 'Choose a key size',
    body: '2048 bits is the current standard for general use; pick 4096 bits for long-term or high-security keys.',
  },
  {
    title: 'Generate and copy each key',
    body: 'The public key is safe to share — use it to encrypt data or verify signatures. Copy each PEM block with its own button.',
  },
  {
    title: 'Protect the private key',
    body: 'Store the private key in a secrets manager or encrypted file, never in source control. For production, generate locally with OpenSSL.',
  },
]

/** Labeled PEM panel with per-panel copy feedback. */
function KeyPanel({
  label,
  hint,
  value,
  secret,
  onCopied,
}: {
  label: string
  hint: string
  value: string
  secret?: boolean
  onCopied: (label: string) => void
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      onCopied(label)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[var(--hairline)] bg-[var(--band)] px-4 py-2.5">
        <span className="flex items-center gap-2 text-14 font-semibold text-[var(--foreground)]">
          {label}
          {secret && (
            <span className="rounded-full border border-[color-mix(in_srgb,var(--border)_60%,var(--destructive))] px-2 py-px text-12 font-semibold text-[var(--destructive)]">
              Keep secret
            </span>
          )}
        </span>
        <button
          onClick={copy}
          className="min-h-8 rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-13 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="max-h-72 overflow-auto whitespace-pre px-4 py-3 font-mono text-14 leading-[1.55] text-[var(--body)]">
        {value}
      </pre>
      <p className="border-t border-[var(--hairline)] px-4 py-2 text-13 text-[var(--muted)]">{hint}</p>
    </div>
  )
}

export default function RsaKeyPageClient({ breadcrumbItems, schema }: RsaKeyPageClientProps) {
  const [keySize, setKeySize] = useState<2048 | 4096>(2048)
  const [keyPair, setKeyPair] = useState<RsaKeyPair | null>(null)
  const [generating, setGenerating] = useState(false)
  const [toastMessage, flash] = useToast()
  const requestId = useRef(0)

  const generateKeyPair = useCallback(async (size: 2048 | 4096): Promise<boolean> => {
    const id = ++requestId.current
    setGenerating(true)
    try {
      const pair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: size,
          publicExponent: new Uint8Array([1, 0, 1]), // 65537
          hash: 'SHA-256',
        },
        true, // extractable
        ['encrypt', 'decrypt']
      )

      const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', pair.publicKey)
      const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', pair.privateKey)

      if (id !== requestId.current) return false // stale result — a newer request superseded it

      setKeyPair({
        publicKey: formatPem(arrayBufferToBase64(publicKeyBuffer), 'PUBLIC'),
        privateKey: formatPem(arrayBufferToBase64(privateKeyBuffer), 'PRIVATE'),
      })
      return true
    } catch (error) {
      console.error('Failed to generate RSA key pair:', error)
      return false
    } finally {
      if (id === requestId.current) setGenerating(false)
    }
  }, [])

  // Generate on first load and whenever the key size changes
  useEffect(() => {
    generateKeyPair(keySize)
  }, [generateKeyPair, keySize])

  const handleRegenerate = useCallback(async () => {
    if (await generateKeyPair(keySize)) flash('Generated new key pair')
  }, [generateKeyPair, keySize, flash])

  // `R` regenerates when no field has focus
  useRegenerateHotkey(handleRegenerate)

  const securityLine =
    keySize === 2048
      ? 'RSA-2048 ≈ 112-bit symmetric security — the current standard, adequate until ~2030.'
      : 'RSA-4096 ≈ 140-bit symmetric security — for long-term, high-security protection.'

  return (
    <GeneratorLayout
      title="RSA Key Pair Generator"
      description="Generate RSA public and private key pairs for asymmetric encryption, digital signatures, and secure key exchange. Create industry-standard RSA keys compatible with OpenSSL, SSH, TLS/SSL, and cryptographic applications."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      howToSteps={HOW_TO_STEPS}
      howToHeading="How to use this RSA key generator"
      storageCallout={
        <SecurityNotice type="warning" title="Security notice">
          <p className="mb-2">
            While these keys are generated securely in your browser and never transmitted, for production use you
            should generate keys locally using OpenSSL or your operating system&apos;s tools. Never share your
            private key or transmit it over the network.
          </p>
          <Link href="/guides/encryption-explained" className="font-semibold text-[var(--accent-strong)] hover:underline">
            How public-key encryption works →
          </Link>
        </SecurityNotice>
      }
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={handleRegenerate}
        generateLabel={generating ? 'Generating…' : 'Generate key pair'}
      >
        <ControlField
          label="Key Size"
          type="select"
          value={keySize}
          onChange={(value) => setKeySize(Number(value) as 2048 | 4096)}
          options={[
            { value: 2048, label: '2048 bits (standard)' },
            { value: 4096, label: '4096 bits (high security)' },
          ]}
        />
        <div>
          <span className="form-label">Algorithm</span>
          <p className="pt-2 text-14 text-[var(--muted)]">RSA-OAEP with SHA-256 · PEM output</p>
        </div>
      </GeneratorControls>

      {/* Generated key pair */}
      <section className="mb-6 overflow-hidden card shadow-[var(--shadow-sm)]">
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[var(--hairline)] px-[18px] py-[13px]">
          <h2 className="flex items-center gap-2.5 text-15 font-semibold">
            Generated key pair
            <span className="badge badge-entropy">RSA-{keySize}</span>
          </h2>
          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="min-h-10 rounded-[9px] border border-[var(--border-strong)] bg-[var(--background)] px-[15px] text-14 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)] disabled:opacity-60"
          >
            {generating ? 'Generating…' : '↻ Regenerate'}
          </button>
        </div>
        <div className="space-y-4 p-4">
          {keyPair ? (
            <>
              <KeyPanel
                label="Public key"
                hint="Share this key publicly. Used to encrypt data or verify signatures."
                value={keyPair.publicKey}
                onCopied={(label) => flash(`${label} copied`)}
              />
              <KeyPanel
                label="Private key"
                hint="Keep this key secret. Used to decrypt data or create signatures."
                value={keyPair.privateKey}
                secret
                onCopied={(label) => flash(`${label} copied`)}
              />
            </>
          ) : (
            <p className="py-8 text-center text-14 text-[var(--muted)]">Generating your RSA key pair…</p>
          )}
        </div>
        <div className="border-t border-[var(--hairline)] bg-[var(--band)] px-[18px] py-[11px] text-14 text-[var(--muted)]">
          {securityLine}
        </div>
      </section>

      {/* What is RSA? */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">What is RSA Encryption?</h2>
        <p className="mb-4 max-w-[75ch] text-15 leading-[1.65] text-[var(--body)]">
          RSA (Rivest-Shamir-Adleman) is one of the most widely used public-key cryptosystems for secure data
          transmission. Named after its inventors Ron Rivest, Adi Shamir, and Leonard Adleman, RSA enables secure
          communication without requiring a shared secret key.
        </p>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Asymmetric Encryption',
              body: 'Uses a pair of mathematically related keys: one public (shareable) and one private (secret). Data encrypted with one key can only be decrypted with the other.',
            },
            {
              title: 'Digital Signatures',
              body: 'Sign documents and messages with your private key to prove authenticity and integrity. Others can verify signatures using your public key.',
            },
            {
              title: 'Key Exchange',
              body: 'Securely share symmetric encryption keys over insecure channels. Commonly used in TLS/SSL handshakes and secure communication protocols.',
            },
          ].map((card) => (
            <div key={card.title} className="rounded-[12px] border border-[var(--border)] bg-[var(--band)] p-4">
              <h3 className="mb-2 text-15 font-semibold text-[var(--accent-strong)]">{card.title}</h3>
              <p className="text-14 leading-[1.6] text-[var(--body)]">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Common Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: 'Encryption',
              body: 'Encrypt sensitive data with the public key. Only the private key holder can decrypt it.',
            },
            {
              title: 'Digital Signatures',
              body: 'Sign documents or code with your private key. Anyone can verify with your public key.',
            },
            {
              title: 'JWT Signing (RS256)',
              body: 'Sign JWTs with RSA for scenarios where multiple parties need to verify tokens.',
            },
            {
              title: 'Key Exchange',
              body: 'Securely exchange symmetric keys by encrypting them with the recipient’s public key.',
            },
          ].map((card) => (
            <div key={card.title} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
              <h3 className="mb-2 text-15 font-semibold">{card.title}</h3>
              <p className="text-14 leading-[1.6] text-[var(--muted)]">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Size Comparison */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">RSA Key Size Comparison</h2>
        <div className="overflow-x-auto rounded-[12px] border border-[var(--border)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--band)] text-left">
                <th className="border-b border-[var(--border)] px-4 py-2.5 font-semibold">Key Size</th>
                <th className="border-b border-[var(--border)] px-4 py-2.5 font-semibold">Security Level</th>
                <th className="border-b border-[var(--border)] px-4 py-2.5 font-semibold">Performance</th>
                <th className="border-b border-[var(--border)] px-4 py-2.5 font-semibold">Use Cases</th>
              </tr>
            </thead>
            <tbody className="text-[var(--body)]">
              <tr>
                <td className="border-b border-[var(--hairline)] px-4 py-2 font-mono">1024 bits</td>
                <td className="border-b border-[var(--hairline)] px-4 py-2 font-semibold text-[var(--destructive)]">Deprecated</td>
                <td className="border-b border-[var(--hairline)] px-4 py-2">Very Fast</td>
                <td className="border-b border-[var(--hairline)] px-4 py-2">Legacy systems only</td>
              </tr>
              <tr className="bg-[var(--band)]">
                <td className="border-b border-[var(--hairline)] px-4 py-2 font-mono">2048 bits</td>
                <td className="border-b border-[var(--hairline)] px-4 py-2 font-semibold">Current Standard (~112 bits)</td>
                <td className="border-b border-[var(--hairline)] px-4 py-2">Fast</td>
                <td className="border-b border-[var(--hairline)] px-4 py-2">Web browsers, most applications; adequate until ~2030</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono">4096 bits</td>
                <td className="px-4 py-2 font-semibold text-[var(--accent-strong)]">High Security (~140 bits)</td>
                <td className="px-4 py-2">Moderate</td>
                <td className="px-4 py-2">Root CAs, long-term protection</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Implementation Examples */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Implementation Examples</h2>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Node.js Encryption</h3>
            <CodeBlock
              filename="rsa-encrypt.js"
              code={`const crypto = require('crypto');
const fs = require('fs');

// Load RSA keys
const publicKey = fs.readFileSync('public.pem', 'utf8');
const privateKey = fs.readFileSync('private.pem', 'utf8');

// Encrypt data
function encryptRSA(data, publicKey) {
  return crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
  }, Buffer.from(data));
}

// Decrypt data
function decryptRSA(encryptedData, privateKey) {
  return crypto.privateDecrypt({
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
  }, encryptedData);
}

const message = "Hello, RSA!";
const encrypted = encryptRSA(message, publicKey);
const decrypted = decryptRSA(encrypted, privateKey);
console.log('Decrypted:', decrypted.toString());`}
            />
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Python Digital Signatures</h3>
            <CodeBlock
              filename="rsa-sign.py"
              code={`from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding

# Generate key pair
private_key = rsa.generate_private_key(
    public_exponent=65537, key_size=2048
)
public_key = private_key.public_key()

# Sign data
def sign_data(data, private_key):
    return private_key.sign(
        data.encode('utf-8'),
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )

# Verify signature
def verify_signature(data, signature, public_key):
    try:
        public_key.verify(
            signature, data.encode('utf-8'),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ), hashes.SHA256()
        )
        return True
    except:
        return False

message = "Important document"
signature = sign_data(message, private_key)
is_valid = verify_signature(message, signature, public_key)
print(f"Valid signature: {is_valid}")`}
            />
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">RSA Applications</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-16 font-semibold">Web Security</h3>
            <ul className="list-inside list-disc space-y-1 text-14 leading-[1.6] text-[var(--body)]">
              <li><strong>TLS/SSL Certificates:</strong> HTTPS connections</li>
              <li><strong>JWT Signing:</strong> RS256 algorithm</li>
              <li><strong>OAuth:</strong> API authentication</li>
              <li><strong>Code Signing:</strong> Software verification</li>
            </ul>
          </div>
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-16 font-semibold">Communication</h3>
            <ul className="list-inside list-disc space-y-1 text-14 leading-[1.6] text-[var(--body)]">
              <li><strong>Email Encryption:</strong> S/MIME</li>
              <li><strong>PGP/GPG:</strong> File encryption</li>
              <li><strong>VPN:</strong> IPsec configurations</li>
              <li><strong>Messaging:</strong> End-to-end encryption</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Terminal Commands */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Generate Locally (Recommended)</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">For production use, generate RSA keys locally:</p>
        <div className="space-y-3">
          <TerminalCommand
            command="openssl genrsa -out private.pem 2048"
            description="Generate private key (OpenSSL)"
          />
          <TerminalCommand
            command="openssl rsa -in private.pem -pubout -out public.pem"
            description="Extract public key"
          />
          <TerminalCommand
            command="openssl genrsa -aes256 -out private.pem 4096"
            description="Generate with passphrase (more secure)"
          />
          <TerminalCommand
            command="ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa"
            description="Generate SSH key pair"
          />
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
