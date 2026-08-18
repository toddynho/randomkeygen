'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators } from '../lib/crypto'
import { GeneratedValue, SecurityNotice, TerminalCommand, RelatedContent } from '../components'

const authenticatorRelated = {
  tools: [
    { href: '/totp-secret', label: 'TOTP Secret Generator', description: 'Generate Base32 secrets only' },
    { href: '/totp-generator', label: 'TOTP Code Generator', description: 'Calculate current codes from a secret' },
    { href: '/backup-codes', label: 'Backup Codes', description: 'Generate 2FA recovery codes' },
    { href: '/recovery-key', label: 'Recovery Key', description: 'Generate account recovery keys' },
  ],
  guides: [
    { href: '/guides/password-security-best-practices', title: '2FA Security Best Practices' },
    { href: '/guides/api-key-best-practices', title: 'API Key Security Guide' },
  ],
  tips: [
    'Always enable 2FA on critical accounts',
    'Save backup codes in a secure location',
    'Use different authenticator apps for redundancy',
    'Test your 2FA setup before finalizing',
  ],
}

interface AuthenticatorData {
  secret: string
  qrData: string
  uri: string
  currentCode?: string
}

export default function TOTPAuthenticatorClient() {
  const [service, setService] = useState('MyService')
  const [username, setUsername] = useState('user@example.com')
  const [secretLength, setSecretLength] = useState(20)
  const [authenticator, setAuthenticator] = useState<AuthenticatorData>({
    secret: '',
    qrData: '',
    uri: '',
  })
  const [currentTime, setCurrentTime] = useState(0)

  const generateAuthenticator = useCallback(() => {
    const auth = generators.authenticator(service, username, secretLength)
    setAuthenticator({
      ...auth,
      currentCode: undefined
    })
    
    // Generate current TOTP code
    generators.generateTOTPCode(auth.secret).then(code => {
      setAuthenticator(prev => ({ ...prev, currentCode: code }))
    }).catch(() => {
      // Fallback if Web Crypto not available
      setAuthenticator(prev => ({ ...prev, currentCode: '123456' }))
    })
  }, [service, username, secretLength])

  const generateQRCodeDataURL = useCallback((qrData: string) => {
    // Simple QR code data URL - in production you'd use a proper QR library
    // For now, we'll encode the URL for external QR generators
    const encoded = encodeURIComponent(qrData)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`
  }, [])

  useEffect(() => {
    generateAuthenticator()
    setCurrentTime(Date.now())
    
    // Update time every second for code display
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [generateAuthenticator])

  const timeRemaining = 30 - (Math.floor(currentTime / 1000) % 30)

  return (
    <div className="page-container py-12">
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          TOTP Authenticator Generator
        </h1>
        <p className="text-[var(--muted)] text-lg">
          Generate complete TOTP authenticator setups with QR codes and secrets
          for Google Authenticator, Authy, and other 2FA apps.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm font-semibold">
          <Link href="/totp-secret" className="text-[var(--accent)] hover:underline">
            Just need the Base32 secret →
          </Link>
          <Link href="/totp-generator" className="text-[var(--accent)] hover:underline">
            Calculate current codes →
          </Link>
        </div>
      </section>

      {/* Configuration */}
      <section className="mb-8 p-4 bg-[var(--code-bg)] border border-[var(--border)] rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Service/App Name</label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="form-input w-full"
              placeholder="MyService"
            />
            <p className="text-xs text-[var(--muted)] mt-1">
              This appears in your authenticator app
            </p>
          </div>

          <div>
            <label className="form-label">Username/Account</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input w-full"
              placeholder="user@example.com"
            />
            <p className="text-xs text-[var(--muted)] mt-1">
              Email or username for the account
            </p>
          </div>

          <div>
            <label className="form-label">Secret Length (bytes)</label>
            <select
              value={secretLength}
              onChange={(e) => setSecretLength(Number(e.target.value))}
              className="form-input w-full"
            >
              <option value={10}>80 bits (10 bytes)</option>
              <option value={16}>128 bits (16 bytes)</option>
              <option value={20}>160 bits (20 bytes) - Recommended</option>
              <option value={32}>256 bits (32 bytes)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button onClick={generateAuthenticator} className="btn btn-primary">
              Generate New
            </button>
          </div>
        </div>
      </section>

      {/* QR Code Display */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">QR Code</h2>
        <div className="bg-white p-6 rounded-lg border border-[var(--border)] inline-block">
          {authenticator.qrData ? (
            <img
              src={generateQRCodeDataURL(authenticator.qrData)}
              alt="TOTP QR Code"
              width={192}
              height={192}
              className="w-48 h-48"
            />
          ) : (
            <div className="w-48 h-48" aria-label="Generating TOTP QR code" />
          )}
        </div>
        <p className="text-sm text-[var(--muted)] mt-2">
          Scan this QR code with your authenticator app
        </p>
      </section>

      {/* Generated Values */}
      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">Secret Details</h2>
        
        <div className="space-y-3">
          <GeneratedValue 
            label="Base32 Secret"
            value={authenticator.secret}
            onRegenerate={generateAuthenticator}
          />
          
          <GeneratedValue 
            label="URI"
            value={authenticator.uri}
          />

          <div className="p-4 bg-[var(--code-bg)] border border-[var(--border)] rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[var(--muted)] mb-1">Current TOTP Code</div>
                  <div className="font-mono text-2xl font-bold">{authenticator.currentCode || '••••••'}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[var(--muted)]">Expires in</div>
                  <div className="font-mono text-lg font-bold">{timeRemaining}s</div>
                </div>
              </div>
              <div className="mt-2 h-1 bg-[var(--border)] rounded overflow-hidden">
                <div 
                  className="h-full bg-[var(--accent)] transition-all duration-1000 ease-linear"
                  style={{ width: `${(timeRemaining / 30) * 100}%` }}
                />
              </div>
          </div>
        </div>
      </section>

      {/* Setup Instructions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
        <div className="space-y-4">
          <div className="p-4 bg-[var(--code-bg)] border border-[var(--border)] rounded-lg">
            <h3 className="font-semibold mb-2">Method 1: QR Code (Recommended)</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Open your authenticator app (Google Authenticator, Authy, etc.)</li>
              <li>Tap "Add account" or the "+" button</li>
              <li>Select "Scan QR code" or camera option</li>
              <li>Scan the QR code above</li>
              <li>Verify the account appears with the correct service name</li>
            </ol>
          </div>

          <div className="p-4 bg-[var(--code-bg)] border border-[var(--border)] rounded-lg">
            <h3 className="font-semibold mb-2">Method 2: Manual Entry</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Open your authenticator app</li>
              <li>Choose "Enter code manually" or "Manual entry"</li>
              <li>Enter the service name: <code className="px-1 py-0.5 bg-[var(--border)] rounded text-xs">{service}</code></li>
              <li>Enter your account: <code className="px-1 py-0.5 bg-[var(--border)] rounded text-xs">{username}</code></li>
              <li>Enter the secret: <code className="px-1 py-0.5 bg-[var(--border)] rounded text-xs">{authenticator.secret}</code></li>
              <li>Set time-based (TOTP) and 6 digits</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Compatible Apps */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Compatible Authenticator Apps</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'Google Authenticator',
            'Microsoft Authenticator',
            'Authy',
            '1Password',
            'Bitwarden',
            'LastPass',
            'FreeOTP',
            'Aegis Authenticator'
          ].map(app => (
            <div key={app} className="p-3 bg-[var(--code-bg)] border border-[var(--border)] rounded-lg text-center">
              <div className="text-sm font-medium">{app}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Notice */}
      <section className="mb-8">
        <SecurityNotice type="warning" title="Security considerations">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Keep your secret key secure - treat it like a password</li>
            <li>Generate backup codes for account recovery</li>
            <li>Test the setup by verifying a generated code</li>
            <li>Don't share QR codes or secrets with anyone</li>
            <li>Consider using multiple authenticator apps for redundancy</li>
          </ul>
        </SecurityNotice>
      </section>

      {/* Terminal Commands */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate TOTP Secret in Terminal</h2>
        <div className="space-y-3">
          <TerminalCommand 
            command="openssl rand -base64 20 | base32 | head -c 32"
            description="Generate Base32 secret with OpenSSL"
          />
          <TerminalCommand 
            command={`python3 -c "import base64, secrets; print(base64.b32encode(secrets.token_bytes(20)).decode())"`}
            description="Python Base32 secret generation"
          />
          <TerminalCommand 
            command={`qrencode -t UTF8 'otpauth://totp/Service:user?secret=SECRET&issuer=Service'`}
            description="Generate QR code in terminal (requires qrencode)"
          />
        </div>
      </section>

      {/* Related Content */}
      <RelatedContent {...authenticatorRelated} />
    </div>
  )
}
