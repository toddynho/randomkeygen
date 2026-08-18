'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { GeneratorLayout, SecurityNotice, CodeBlock } from '../components'

// TOTP implementation following RFC 6238
function base32Decode(encoded: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''

  for (const char of encoded.toUpperCase()) {
    const val = alphabet.indexOf(char)
    if (val === -1) continue
    bits += val.toString(2).padStart(5, '0')
  }

  const bytes = []
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.substr(i, 8)
    if (byte.length === 8) {
      bytes.push(parseInt(byte, 2))
    }
  }

  return new Uint8Array(bytes)
}

function base32Encode(buffer: Uint8Array): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''

  for (const byte of buffer) {
    bits += byte.toString(2).padStart(8, '0')
  }

  let result = ''
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substr(i, 5).padEnd(5, '0')
    result += alphabet[parseInt(chunk, 2)]
  }

  return result
}

async function generateHOTP(secret: string, counter: number): Promise<string> {
  try {
    const key = base32Decode(secret.replace(/\s/g, ''))

    // Convert counter to 8-byte array
    const counterBuffer = new ArrayBuffer(8)
    const counterView = new DataView(counterBuffer)
    counterView.setUint32(4, counter, false) // Big endian

    // HMAC-SHA1 - create proper ArrayBuffer from Uint8Array
    const keyBuffer = new ArrayBuffer(key.length)
    const keyView = new Uint8Array(keyBuffer)
    keyView.set(key)

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, counterBuffer)
    const hmac = new Uint8Array(signature)

    // Dynamic truncation
    const offset = hmac[19] & 0xf
    const code = (
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)
    ) % 1000000

    return code.toString().padStart(6, '0')
  } catch (error) {
    return 'Invalid secret'
  }
}

async function generateTOTP(secret: string, window = 30): Promise<{ code: string; remaining: number }> {
  const now = Math.floor(Date.now() / 1000)
  const counter = Math.floor(now / window)
  const code = await generateHOTP(secret, counter)
  const remaining = window - (now % window)

  return { code, remaining }
}

function generateRandomSecret(): string {
  const array = new Uint8Array(20) // 160 bits
  crypto.getRandomValues(array)
  return base32Encode(array)
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'TOTP Generator', url: '/totp-generator' },
]

interface TOTPGeneratorClientProps {
  schema?: Record<string, unknown>[]
}

export default function TOTPGeneratorClient({ schema }: TOTPGeneratorClientProps) {
  const [secret, setSecret] = useState('')
  const [totp, setTotp] = useState<{ code: string; remaining: number }>({ code: '', remaining: 30 })
  const [accountName, setAccountName] = useState('user@example.com')
  const [issuer, setIssuer] = useState('MyApp')
  const [copied, setCopied] = useState<'secret' | 'code' | 'url' | null>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    // Generate initial secret
    setSecret(generateRandomSecret())
    return () => clearTimeout(copyTimer.current)
  }, [])

  const generateNewSecret = () => {
    setSecret(generateRandomSecret())
  }

  const updateTOTP = useCallback(async () => {
    if (!secret) return

    try {
      const result = await generateTOTP(secret)
      setTotp(result)
    } catch (error) {
      setTotp({ code: 'Invalid', remaining: 0 })
    }
  }, [secret])

  useEffect(() => {
    updateTOTP()

    const interval = setInterval(() => {
      updateTOTP()
    }, 1000)

    return () => clearInterval(interval)
  }, [updateTOTP])

  const copyToClipboard = async (text: string, type: 'secret' | 'code' | 'url') => {
    await navigator.clipboard.writeText(text)
    clearTimeout(copyTimer.current)
    setCopied(type)
    copyTimer.current = setTimeout(() => setCopied(null), 1400)
  }

  const formatSecret = (secret: string) => {
    return secret.replace(/(.{4})/g, '$1 ').trim()
  }

  const cleanSecret = secret.replace(/\s/g, '')
  const otpauthUrl = cleanSecret && accountName && issuer
    ? `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${cleanSecret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`
    : ''

  return (
    <GeneratorLayout
      title="TOTP Code Generator"
      description="Enter or create a Base32 secret to calculate the current 6-digit TOTP code, live in your browser. Compatible with Google Authenticator, Authy, and other 2FA apps."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
    >
      {/* Secret input panel */}
      <section className="control-panel mb-6 p-5 md:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="form-label" htmlFor="totp-secret">Base32 Secret (160-bit)</label>
            <div className="flex flex-wrap gap-2">
              <input
                id="totp-secret"
                type="text"
                value={formatSecret(secret)}
                onChange={(e) => setSecret(e.target.value.replace(/\s/g, ''))}
                className="form-input min-w-0 flex-1 font-mono"
                placeholder="Enter or generate a Base32 secret..."
                spellCheck={false}
              />
              <button
                onClick={() => copyToClipboard(cleanSecret, 'secret')}
                className={`btn btn-secondary ${copied === 'secret' ? 'text-[var(--accent-strong)]' : ''}`}
              >
                {copied === 'secret' ? '✓ Copied' : 'Copy'}
              </button>
              <button onClick={generateNewSecret} className="btn btn-primary">
                Generate new secret
              </button>
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">
              20 bytes (160 bits) encoded as Base32. Store securely - this is your master secret.
            </p>
          </div>
          <p className="border-t border-[var(--hairline)] pt-3.5 text-14 leading-[1.6] text-[var(--muted)]">
            TOTP (RFC 6238) derives a 6-digit code from the secret and the current 30-second time window —
            codes expire and regenerate every 30 seconds, and both sides compute them locally from the shared secret.
          </p>
        </div>
      </section>

      {/* Current TOTP Code */}
      <section className="mb-6">
        <div className="rounded-[14px] border border-[var(--accent-border)] bg-[var(--accent-soft)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--accent-strong)]">
              Current TOTP Code
            </h2>
            <div className="text-sm text-[var(--accent-strong)]">
              Refreshes in {totp.remaining}s
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="font-mono text-3xl font-bold tracking-[0.12em] text-[var(--accent-strong)]">
              {totp.code || '••••••'}
            </div>
            <button
              onClick={() => copyToClipboard(totp.code, 'code')}
              disabled={!totp.code || totp.code === 'Invalid'}
              className={`btn btn-secondary ${!totp.code || totp.code === 'Invalid' ? 'invisible' : ''}`}
            >
              {copied === 'code' ? '✓ Copied' : 'Copy code'}
            </button>
          </div>

          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--accent-border)]">
              <div
                className="h-2 rounded-full bg-[var(--accent)] transition-all duration-1000 ease-linear"
                style={{ width: `${(totp.remaining / 30) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links to the other TOTP tools */}
      <section className="mb-6 grid gap-4 md:grid-cols-2">
        <Link
          href="/totp-secret"
          className="card card-hover p-4"
        >
          <h3 className="mb-1 font-medium">Need a new secret?</h3>
          <p className="text-sm text-[var(--muted)]">
            Generate a fresh Base32 TOTP setup key with the TOTP Secret Generator →
          </p>
        </Link>
        <Link
          href="/totp-authenticator"
          className="card card-hover p-4"
        >
          <h3 className="mb-1 font-medium">Want a QR code?</h3>
          <p className="text-sm text-[var(--muted)]">
            Build a scannable otpauth QR setup for your authenticator app →
          </p>
        </Link>
      </section>

      {/* otpauth URL setup */}
      <section className="mb-8">
        <div className="card p-5">
          <h2 className="mb-4 text-xl font-semibold">Setup in Authenticator App</h2>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="form-label" htmlFor="totp-account">Account Name</label>
                <input
                  id="totp-account"
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="form-input w-full"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="totp-issuer">Issuer</label>
                <input
                  id="totp-issuer"
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="form-input w-full"
                  placeholder="MyApp"
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="totp-url">OTPAuth URL</label>
              <div className="flex gap-2">
                <input
                  id="totp-url"
                  type="text"
                  value={otpauthUrl}
                  readOnly
                  className="form-input flex-1 font-mono text-xs"
                />
                <button
                  onClick={() => copyToClipboard(otpauthUrl, 'url')}
                  disabled={!otpauthUrl}
                  className={`btn btn-secondary ${otpauthUrl ? '' : 'invisible'}`}
                >
                  {copied === 'url' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Paste into an authenticator that accepts otpauth URLs, or use the{' '}
                <Link href="/totp-authenticator" className="font-semibold text-[var(--accent-strong)] hover:underline">
                  QR setup tool
                </Link>{' '}
                to scan it. The URL contains your secret — share it only over secure channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Instructions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-4">
            <h3 className="font-medium mb-2">Google Authenticator</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-[var(--muted)]">
              <li>Open Google Authenticator app</li>
              <li>Tap the + icon</li>
              <li>Select &quot;Enter a setup key&quot;</li>
              <li>Paste the Base32 secret above</li>
              <li>Verify the 6-digit code matches</li>
            </ol>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-2">Authy</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-[var(--muted)]">
              <li>Open Authy app</li>
              <li>Tap the + icon</li>
              <li>Choose manual entry</li>
              <li>Paste the Base32 secret above</li>
              <li>Enter account details if prompted</li>
            </ol>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-2">Manual Setup</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-[var(--muted)]">
              <li>Choose &quot;Enter a setup key&quot; option</li>
              <li>Copy the Base32 secret above</li>
              <li>Paste into your authenticator</li>
              <li>Set time-based (TOTP)</li>
              <li>Use 6 digits, 30-second interval</li>
            </ol>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-2">Alternative Apps</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted)]">
              <li>Microsoft Authenticator</li>
              <li>1Password</li>
              <li>Bitwarden</li>
              <li>LastPass Authenticator</li>
              <li>FreeOTP</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="mb-8">
        <SecurityNotice type="warning" title="Security Best Practices">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Backup your secret</strong> - Store the Base32 secret in a secure location</li>
            <li><strong>Use strong secrets</strong> - Generate random 160-bit (20-byte) secrets</li>
            <li><strong>Secure transmission</strong> - Share QR codes/secrets over secure channels only</li>
            <li><strong>Multiple devices</strong> - Consider setting up multiple authenticator devices</li>
            <li><strong>Recovery codes</strong> - Always generate backup/recovery codes for your accounts</li>
          </ul>
        </SecurityNotice>
      </section>

      {/* Implementation Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Implementation Examples</h2>
        <div className="space-y-4">
          <CodeBlock
            filename="JavaScript/Node.js"
            code={`const crypto = require('crypto');

function generateTOTP(secret, window = 30) {
  const counter = Math.floor(Date.now() / 1000 / window);
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(counter, 4);

  const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base32'));
  hmac.update(buffer);
  const hash = hmac.digest();

  const offset = hash[19] & 0xf;
  const code = (
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)
  ) % 1000000;

  return code.toString().padStart(6, '0');
}

// Usage
const secret = 'YOUR_BASE32_SECRET';
const code = generateTOTP(secret);
console.log('TOTP Code:', code);`}
          />

          <CodeBlock
            filename="Python"
            code={`import hmac
import hashlib
import struct
import time
import base64

def generate_totp(secret, window=30):
    # Decode base32 secret
    key = base64.b32decode(secret.upper() + '=' * (-len(secret) % 8))

    # Current time window
    counter = int(time.time() // window)

    # Generate HOTP
    counter_bytes = struct.pack('>Q', counter)
    hmac_digest = hmac.new(key, counter_bytes, hashlib.sha1).digest()

    # Dynamic truncation
    offset = hmac_digest[-1] & 0xf
    code = struct.unpack('>I', hmac_digest[offset:offset+4])[0]
    code = (code & 0x7fffffff) % 1000000

    return f'{code:06d}'

# Usage
secret = 'YOUR_BASE32_SECRET'
code = generate_totp(secret)
print(f'TOTP Code: {code}')`}
          />
        </div>
      </section>

      {/* Testing & Validation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Testing &amp; Validation</h2>
        <div className="card p-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--accent-strong)]">✓</span>
              <span>Verify codes match between this tool and your authenticator app</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--accent-strong)]">✓</span>
              <span>Test with a known reference implementation (RFC 6238)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--accent-strong)]">✓</span>
              <span>Check time synchronization between devices</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--muted)]">i</span>
              <span>TOTP codes refresh every 30 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--muted)]">i</span>
              <span>Allow ±1 time window for network delays and clock skew</span>
            </div>
          </div>
        </div>
      </section>
    </GeneratorLayout>
  )
}
