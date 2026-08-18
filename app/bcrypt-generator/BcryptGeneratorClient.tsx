'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import bcrypt from 'bcryptjs'
import {
  GeneratorLayout,
  GeneratorControls,
  RangeField,
  GeneratedValue,
  SecurityNotice,
  TerminalCommand,
  RelatedContent,
  Toast,
  useToast,
} from '../components'

const bcryptRelated = {
  tools: [
    { href: '/hash-generator', label: 'Hash Generator', description: 'Generate various hash types' },
    { href: '/salt', label: 'Salt Generator', description: 'Generate secure salts' },
    { href: '/password', label: 'Password Generator', description: 'Generate strong passwords' },
  ],
  guides: [
    { href: '/guides/password-security-best-practices', title: 'Password Security Best Practices' },
    { href: '/guides/api-key-best-practices', title: 'API Security Guidelines' },
  ],
  tips: [
    'Use cost factors between 10-15 for production',
    'Higher cost factors increase security but slow down hashing',
    'Always use unique salts for each password',
    'Store bcrypt hashes, never plain text passwords',
  ],
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'Bcrypt Hash Generator', url: '/bcrypt-generator' },
]

function getCostDescription(cost: number): string {
  const iterations = Math.pow(2, cost)
  const timeEstimate = cost <= 10 ? '<100ms' :
                      cost <= 12 ? '<1s' :
                      cost <= 14 ? '<5s' : '>10s'
  return `2^${cost} = ${iterations.toLocaleString('en-US')} iterations (~${timeEstimate} in-browser)`
}

export default function BcryptGeneratorClient() {
  const [password, setPassword] = useState('mypassword123')
  const [rounds, setRounds] = useState(10)
  const [hash, setHash] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [verificationPassword, setVerificationPassword] = useState('')
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [toastMessage, flash] = useToast()
  const generationId = useRef(0)

  const generateHash = useCallback(async () => {
    if (!password.trim()) return

    const id = ++generationId.current
    setIsGenerating(true)
    setVerificationResult(null)
    try {
      // Real bcrypt, computed in-browser (bcryptjs). Higher costs take exponentially longer.
      const bcryptHash = await bcrypt.hash(password, rounds)
      if (generationId.current === id) setHash(bcryptHash)
    } catch (error) {
      console.error('Hash generation failed:', error)
    } finally {
      if (generationId.current === id) setIsGenerating(false)
    }
  }, [password, rounds])

  const verifyPassword = useCallback(() => {
    if (!verificationPassword || !hash) {
      setVerificationResult(null)
      return
    }
    setIsVerifying(true)
    // Defer so the "Verifying…" state paints before the synchronous compare blocks.
    setTimeout(() => {
      try {
        setVerificationResult(bcrypt.compareSync(verificationPassword, hash))
      } catch {
        setVerificationResult(false)
      } finally {
        setIsVerifying(false)
      }
    }, 30)
  }, [verificationPassword, hash])

  useEffect(() => {
    generateHash()
    // Only hash automatically on first mount; afterwards the button drives it
    // (real bcrypt at high cost is too slow to run per keystroke).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGenerate = useCallback(() => {
    generateHash().then(() => flash('Generated bcrypt hash'))
  }, [generateHash, flash])

  return (
    <GeneratorLayout
      title="Bcrypt Hash Generator"
      description="Generate real bcrypt password hashes with configurable cost factors. Hashing runs entirely in your browser — every hash embeds a fresh random salt, and you can verify passwords against the hash below."
      breadcrumbItems={breadcrumbItems}
    >
      {/* Controls */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel={isGenerating ? 'Hashing…' : 'Generate hash'}
        error={!password.trim() ? 'Enter a password to hash.' : null}
      >
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="bcrypt-password">Password to Hash</label>
            <input
              id="bcrypt-password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input w-full font-mono"
              placeholder="Enter password to hash"
            />
            <p className="mt-1 text-xs text-[var(--muted)]">
              Processed locally — never transmitted
            </p>
          </div>
          <div>
            <RangeField label="Cost Factor (Rounds)" value={rounds} onChange={setRounds} min={4} max={15} />
            <p className="mt-1 text-xs text-[var(--muted)]">{getCostDescription(rounds)}</p>
          </div>
        </div>
        <p className="w-full text-14 leading-[1.6] text-[var(--muted)]">
          bcrypt with cost {rounds} ≈ 2^{rounds} = {Math.pow(2, rounds).toLocaleString('en-US')} iterations — higher
          cost slows brute force. For reference, cost 12 ≈ 4,096 iterations, ~250ms per guess on a modern CPU.
        </p>
      </GeneratorControls>

      {/* In-browser hashing notice */}
      <section className="mb-6">
        <SecurityNotice type="warning" title="Hashing runs in your browser">
          <p className="text-sm">
            This tool computes real bcrypt hashes client-side with bcryptjs. Cost factors above 12 can take
            several seconds per hash in the browser — the page may feel unresponsive while hashing.
          </p>
        </SecurityNotice>
      </section>

      {/* Generated Hash */}
      {hash && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Generated Hash</h2>
          <GeneratedValue
            value={hash}
            label="Bcrypt Hash"
            onRegenerate={handleGenerate}
          />

          {/* Hash breakdown */}
          <div className="mt-4 card p-4">
            <h3 className="font-semibold mb-2">Hash Breakdown</h3>
            <div className="space-y-2 text-sm font-mono">
              <div><span className="text-[var(--accent-strong)]">{hash.slice(0, 4)}</span> - Bcrypt algorithm identifier</div>
              <div><span className="text-[var(--accent-strong)]">{rounds.toString().padStart(2, '0')}$</span> - Cost factor ({rounds} rounds)</div>
              <div className="break-all"><span className="text-[var(--accent-strong)]">{hash.slice(7, 29)}</span> - Salt (22 characters)</div>
              <div className="break-all"><span className="text-[var(--accent-strong)]">{hash.slice(29)}</span> - Hash (31 characters)</div>
            </div>
          </div>
        </section>
      )}

      {/* Verification Section */}
      {hash && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Verify Password</h2>
          <div className="card p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="form-label" htmlFor="bcrypt-verify">Test Password</label>
                <div className="flex gap-2">
                  <input
                    id="bcrypt-verify"
                    type="text"
                    value={verificationPassword}
                    onChange={(e) => {
                      setVerificationPassword(e.target.value)
                      setVerificationResult(null)
                    }}
                    className="form-input flex-1 font-mono"
                    placeholder="Enter password to verify"
                  />
                  <button
                    onClick={verifyPassword}
                    disabled={!verificationPassword || isVerifying}
                    className="btn btn-secondary disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying…' : 'Verify'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Runs bcrypt.compareSync against the hash above
                </p>
              </div>

              <div className="flex items-end">
                <div
                  role="status"
                  className={`rounded-[10px] px-3 py-2 text-sm font-medium ${
                    verificationResult === null
                      ? 'bg-[var(--band)] text-[var(--muted)]'
                      : verificationResult
                        ? 'border border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent-strong)]'
                        : 'border border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger-text)]'
                  }`}
                >
                  {verificationResult === null
                    ? 'Enter a password and press Verify'
                    : verificationResult
                      ? '✓ Password matches this hash'
                      : '✗ Password does not match'}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cost Factor Guide */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Cost Factor Recommendations</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card p-4">
            <h3 className="font-semibold mb-2">Development</h3>
            <ul className="space-y-1 text-sm text-[var(--muted)]">
              <li><strong className="text-[var(--foreground)]">4-6 rounds:</strong> Fast for testing</li>
              <li><strong className="text-[var(--foreground)]">8 rounds:</strong> Good for development</li>
              <li>Trade-off: Speed over security</li>
            </ul>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-2">Production</h3>
            <ul className="space-y-1 text-sm text-[var(--muted)]">
              <li><strong className="text-[var(--foreground)]">10 rounds:</strong> Minimum recommended</li>
              <li><strong className="text-[var(--foreground)]">12 rounds:</strong> Good balance</li>
              <li><strong className="text-[var(--foreground)]">14-15 rounds:</strong> High security</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="mb-8">
        <SecurityNotice type="info" title="Bcrypt security benefits">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Adaptive cost:</strong> Can increase difficulty over time as hardware improves</li>
            <li><strong>Built-in salt:</strong> Each hash includes a unique salt to prevent rainbow table attacks</li>
            <li><strong>Time-tested:</strong> Industry standard for password hashing since 1999</li>
            <li><strong>Slow by design:</strong> Computationally expensive to discourage brute force attacks</li>
          </ul>
        </SecurityNotice>
      </section>

      {/* Usage Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Usage in Applications</h2>
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-semibold mb-2">Node.js (bcrypt library)</h3>
            <pre className="overflow-x-auto text-sm">
{`const bcrypt = require('bcrypt');
const saltRounds = ${rounds};

// Hash password
const hash = await bcrypt.hash(plainTextPassword, saltRounds);

// Verify password
const match = await bcrypt.compare(plainTextPassword, hash);`}
            </pre>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-2">Python (bcrypt library)</h3>
            <pre className="overflow-x-auto text-sm">
{`import bcrypt

# Hash password
hash = bcrypt.hashpw(password_bytes, bcrypt.gensalt(rounds=${rounds}))

# Verify password
match = bcrypt.checkpw(password_bytes, hash)`}
            </pre>
          </div>
        </div>
      </section>

      {/* Terminal Commands */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate Bcrypt in Terminal</h2>
        <div className="space-y-3">
          <TerminalCommand
            command={`htpasswd -bnBC ${rounds} "" "password" | tr -d ':\\n'`}
            description="Apache htpasswd utility"
          />
          <TerminalCommand
            command={`python3 -c "import bcrypt; print(bcrypt.hashpw(b'password', bcrypt.gensalt(rounds=${rounds})).decode())"`}
            description="Python bcrypt"
          />
          <TerminalCommand
            command={`node -e "console.log(require('bcrypt').hashSync('password', ${rounds}))"`}
            description="Node.js bcrypt"
          />
        </div>
      </section>

      {/* Related Content */}
      <RelatedContent {...bcryptRelated} />

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
