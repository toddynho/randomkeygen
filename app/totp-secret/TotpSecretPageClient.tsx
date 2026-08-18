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

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'TOTP Secret Generator', url: '/totp-secret' },
]

export default function TotpSecretPage() {
  const [length, setLength] = useState(20)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 5 }, () => ''))
  const [issuer, setIssuer] = useState('MyApp')
  const [account, setAccount] = useState('user@example.com')
  const [toastMessage, flash] = useToast()

  const generateSecret = useCallback(() => {
    return generators.totpSecret(length)
  }, [length])

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

  // Entropy of the underlying random bytes; each Base32 character carries 5 bits
  const entropy = length * 8

  // Generate otpauth URI for QR codes
  const getOtpauthUri = (secret: string) => {
    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`
  }

  return (
    <GeneratorLayout
      title="TOTP Secret Key Generator"
      description="Generate Base32-encoded secrets for Time-based One-Time Password (TOTP) authentication. Compatible with Google Authenticator, Authy, Microsoft Authenticator, and other 2FA apps."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <aside className="card p-5">
          <h2 className="mb-2 text-16 font-semibold">Handle TOTP secrets carefully.</h2>
          <ul className="list-inside list-disc space-y-1 text-14 leading-5 text-[var(--muted)]">
            <li>Store secrets encrypted in your database</li>
            <li>Show the secret/QR code only once during setup</li>
            <li>Provide backup codes for account recovery</li>
            <li>Use 160+ bits (20+ bytes) for production systems</li>
          </ul>
        </aside>
      }
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate secrets"
        readout={{ bits: entropy, poolSize: 32, poolLabel: `Base32 (RFC 4648) · ${length} random bytes` }}
      >
        <ControlField
          label="Secret Size"
          type="select"
          value={length}
          onChange={(value) => setLength(Number(value))}
          options={[
            { value: 10, label: '80 bits (10 bytes)' },
            { value: 16, label: '128 bits (16 bytes)' },
            { value: 20, label: '160 bits (20 bytes) - Recommended' },
            { value: 32, label: '256 bits (32 bytes)' },
          ]}
        />
      </GeneratorControls>

      <OutputDisplay
        values={values}
        noun="secrets"
        getBits={(value) => (value ? value.length * 5 : entropy)}
        onRegenerate={(index) => {
          setValues((current) => {
            const next = [...current]
            next[index] = generateSecret()
            return next
          })
        }}
        onRegenerateAll={handleGenerate}
      />

      {/* OTPAuth URI Generator */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">OTPAuth URI (for QR Codes)</h2>
        <div className="space-y-4 card p-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="form-label" htmlFor="totp-issuer">Issuer (App Name)</label>
              <input
                id="totp-issuer"
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="form-input"
                placeholder="MyApp"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="totp-account">Account</label>
              <input
                id="totp-account"
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="form-input"
                placeholder="user@example.com"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Generated URI</label>
            <code className="block break-all rounded border border-[var(--border)] bg-[var(--band)] p-3 text-sm">
              {values[0] ? getOtpauthUri(values[0]) : 'Generate a secret first'}
            </code>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Use this URI to generate a QR code that users can scan with their authenticator app.
            </p>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Implementation Examples</h2>

        <div className="space-y-4">
          <CodeBlock
            filename="Python (pyotp)"
            code={`import pyotp

# Store this secret securely for each user
secret = "${values[0] || 'JBSWY3DPEHPK3PXP'}"

# Generate current TOTP code
totp = pyotp.TOTP(secret)
print(totp.now())  # e.g., "492039"

# Verify a code from user
is_valid = totp.verify("492039")`}
          />

          <CodeBlock
            filename="Node.js (otplib)"
            code={`const { authenticator } = require('otplib');

const secret = "${values[0] || 'JBSWY3DPEHPK3PXP'}";

// Generate current code
const token = authenticator.generate(secret);

// Verify user's code
const isValid = authenticator.verify({ token: userCode, secret });`}
          />

          <CodeBlock
            filename="PHP (sonata-project/GoogleAuthenticator)"
            code={`use Sonata\\GoogleAuthenticator\\GoogleAuthenticator;

$ga = new GoogleAuthenticator();
$secret = "${values[0] || 'JBSWY3DPEHPK3PXP'}";

// Verify user's code
$isValid = $ga->checkCode($secret, $userCode);`}
          />
        </div>
      </section>

      {/* Info */}
      <section className="mb-8">
        <SecurityNotice type="info" title="How TOTP Works">
          <p className="mb-2">
            TOTP generates a 6-digit code that changes every 30 seconds. Both the server and
            the user&apos;s authenticator app share the same secret key, allowing them to generate
            matching codes without network communication.
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Based on HMAC-SHA1 algorithm (RFC 6238)</li>
            <li>Uses Unix timestamp divided by 30-second intervals</li>
            <li>Base32 encoding makes secrets easy to type manually</li>
          </ul>
        </SecurityNotice>
      </section>

      {/* Bulk Generation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generateSecret}
          getBits={(value) => value.length * 5}
          label="secrets"
        />
      </section>

      {/* Terminal Commands */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
        <div className="space-y-3">
          <TerminalCommand
            command={`python3 -c "import base64, secrets; print(base64.b32encode(secrets.token_bytes(20)).decode())"`}
            description="Python"
          />
          <TerminalCommand
            command={`openssl rand -hex 20 | xxd -r -p | base32`}
            description="OpenSSL + base32"
          />
          <TerminalCommand
            command={`node -e "console.log(require('crypto').randomBytes(20).toString('base64').replace(/[+/=]/g, c => ({'+':'-','/':'_','=':''}[c])))"`}
            description="Node.js (URL-safe variant)"
          />
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
