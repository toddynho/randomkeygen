'use client'

import { useCallback, useState } from 'react'
import {
  GeneratorLayout,
  GeneratorControls,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  TerminalCommand,
} from '../components'

interface PgpKeyPair {
  publicKey: string
  privateKey: string
  revocationCertificate: string
  fingerprint: string
  keyId: string
}

interface UserInfo {
  name: string
  email: string
  comment: string
}

interface PgpKeyPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, any>[]
}

const EXAMPLE_NAME = 'Alice Example'
const EXAMPLE_EMAIL = 'alice@example.com'

const HOW_TO_STEPS = [
  {
    title: 'Generate real keys with GPG',
    body: 'Run gpg --full-generate-key in your terminal. GPG walks you through algorithm, key size, expiration, and identity — everything this demo illustrates.',
  },
  {
    title: 'Study the format with the demo',
    body: 'Use the demo blocks below to see how armored OpenPGP public keys, private keys, and revocation certificates are structured.',
  },
  {
    title: 'Back up and share correctly',
    body: 'Export your real public key to share it, keep the private key and revocation certificate offline and secure.',
  },
]

/** Labeled armored-block panel with per-panel copy feedback. */
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
  onCopied: () => void
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      onCopied()
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
          <span className="badge badge-demo">Demo</span>
          {secret && (
            <span className="rounded-full border border-[color-mix(in_srgb,var(--border)_60%,var(--destructive))] px-2 py-px text-12 font-semibold text-[var(--destructive)]">
              Would be secret
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

export default function PgpKeyPageClient({ breadcrumbItems, schema }: PgpKeyPageClientProps) {
  const [algorithm, setAlgorithm] = useState<'RSA' | 'ECC'>('RSA')
  const [keySize, setKeySize] = useState<2048 | 4096>(2048)
  const [curve, setCurve] = useState<'P-256' | 'P-384' | 'P-521'>('P-256')
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    comment: '',
  })
  const [keyPair, setKeyPair] = useState<PgpKeyPair | null>(null)
  const [generating, setGenerating] = useState(false)
  const [toastMessage, flash] = useToast()

  const displayName = userInfo.name.trim() || EXAMPLE_NAME
  const displayEmail = userInfo.email.trim() || EXAMPLE_EMAIL

  // Helper to generate a random example key ID (8 hex characters)
  const generateKeyId = (): string => {
    const bytes = new Uint8Array(4)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase()
  }

  // Helper to generate an example fingerprint (40 hex characters)
  const generateFingerprint = (): string => {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase()
  }

  // Generate a checksum-shaped placeholder line
  const generateChecksum = (): string => {
    const bytes = new Uint8Array(3)
    crypto.getRandomValues(bytes)
    return btoa(String.fromCharCode(...bytes))
  }

  // Format raw base64 as a structurally PGP-shaped armored block.
  // NOT a real OpenPGP packet — the header comment says so explicitly.
  const formatDemoBlock = (key: string, type: 'PUBLIC' | 'PRIVATE'): string => {
    const header = type === 'PUBLIC' ? 'PGP PUBLIC KEY BLOCK' : 'PGP PRIVATE KEY BLOCK'
    const lines = key.match(/.{1,64}/g) || []

    return `-----BEGIN ${header}-----
Comment: DEMO ONLY - structural example, NOT a usable OpenPGP key
Comment: Generate real keys with: gpg --full-generate-key

${lines.join('\n')}
=${generateChecksum()}
-----END ${header}-----`
  }

  // Placeholder signature-shaped lines for the revocation certificate example
  const generateDemoSignatureBody = (): string => {
    const lines = []
    for (let i = 0; i < 8; i++) {
      const bytes = new Uint8Array(48)
      crypto.getRandomValues(bytes)
      lines.push(btoa(String.fromCharCode(...bytes)))
    }
    return lines.join('\n')
  }

  // Structural example of a revocation certificate (the real one comes from
  // gpg --generate-revocation, or ~/.gnupg/openpgp-revocs.d/ after key creation)
  const generateDemoRevocationCert = (fingerprint: string): string => {
    const today = new Date()
    const dateStamp = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    return `-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: DEMO ONLY - structural example, NOT a usable revocation certificate
Comment: This shows the format of a revocation certificate for an OpenPGP key:

Comment: pub   ${algorithm === 'RSA' ? `rsa${keySize}` : curve.toLowerCase()} ${dateStamp} [SC]
Comment:       ${fingerprint}
Comment: uid                     ${displayName} ${userInfo.comment ? `(${userInfo.comment}) ` : ''}<${displayEmail}>
Comment:
Comment: A revocation certificate is a kind of "kill switch" to publicly
Comment: declare that a key shall not anymore be used.  It is not possible
Comment: to retract such a revocation certificate once it has been published.
Comment:
Comment: Use it to revoke this key in case of a compromise or loss of
Comment: the secret key.  However, if the secret key is still accessible,
Comment: it is better to generate a new revocation certificate and give
Comment: a reason for the revocation.  For details see the description of
Comment: of the gpg command "--generate-revocation" in the GnuPG manual.
Comment:
Comment: To avoid an accidental use of this file, a colon has been inserted
Comment: before the 5 dashes below.  Remove this colon with a text editor
Comment: before importing and publishing this revocation certificate.

:-----BEGIN PGP SIGNATURE-----

${generateDemoSignatureBody()}
-----END PGP SIGNATURE-----`
  }

  const generateDemoBlocks = useCallback(async (): Promise<boolean> => {
    setGenerating(true)
    try {
      let keyPairData

      if (algorithm === 'RSA') {
        keyPairData = await window.crypto.subtle.generateKey(
          {
            name: 'RSA-OAEP',
            modulusLength: keySize,
            publicExponent: new Uint8Array([1, 0, 1]), // 65537
            hash: 'SHA-256',
          },
          true, // extractable
          ['encrypt', 'decrypt']
        )
      } else {
        keyPairData = await window.crypto.subtle.generateKey(
          {
            name: 'ECDSA',
            namedCurve: curve,
          },
          true, // extractable
          ['sign', 'verify']
        )
      }

      const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPairData.publicKey)
      const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPairData.privateKey)

      // Convert to base64 (raw SPKI/PKCS8 material, wrapped in PGP-shaped armor below)
      const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)))
      const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)))

      const keyId = generateKeyId()
      const fingerprint = generateFingerprint()

      setKeyPair({
        publicKey: formatDemoBlock(publicKeyBase64, 'PUBLIC'),
        privateKey: formatDemoBlock(privateKeyBase64, 'PRIVATE'),
        revocationCertificate: generateDemoRevocationCert(fingerprint),
        fingerprint,
        keyId,
      })
      return true
    } catch (error) {
      console.error('Failed to generate demo key blocks:', error)
      return false
    } finally {
      setGenerating(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm, keySize, curve, userInfo, displayName, displayEmail])

  const handleGenerate = useCallback(async () => {
    if (await generateDemoBlocks()) flash('Generated demo key blocks')
  }, [generateDemoBlocks, flash])

  // `R` regenerates the demo blocks when no field has focus
  useRegenerateHotkey(handleGenerate)

  return (
    <GeneratorLayout
      title="PGP Key Format Demo & GPG Setup"
      description="Learn what OpenPGP key blocks look like and how to generate real PGP keys with GPG. The demo below produces structurally-formatted example blocks — not usable keys — so you can explore the format safely."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      howToSteps={HOW_TO_STEPS}
      howToHeading="How to get real PGP keys"
      storageCallout={
        <SecurityNotice type="warning" title="Security notice">
          <p>
            Real PGP private keys should be generated offline with GPG — ideally on an air-gapped computer for
            high-value keys — and never pasted into a browser or transmitted over the network. Store your private
            key and revocation certificate securely: losing them means losing access to encrypted data. The demo
            blocks on this page contain no usable key material.
          </p>
        </SecurityNotice>
      }
    >
      {/* Demo-only banner */}
      <div className="mb-6 flex flex-col gap-3">
        <div>
          <span className="badge badge-demo px-3 py-1 text-14">Demo Only — no real keys are generated on this page</span>
        </div>
        <SecurityNotice type="danger" title="These are not usable OpenPGP keys">
          <p>
            The blocks this demo produces are <strong>structurally-formatted examples</strong> that show what
            armored OpenPGP output looks like. They are <strong>not valid OpenPGP packets</strong> and cannot be
            imported into GPG or used for email encryption. To create real keys, run{' '}
            <code className="rounded bg-[var(--band)] px-1 font-mono">gpg --full-generate-key</code> in your
            terminal — see the commands below.
          </p>
        </SecurityNotice>
      </div>

      {/* Real key generation — the actual recommendation, above the demo */}
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Generate Real PGP Keys with GPG</h2>
        <p className="mb-4 max-w-[75ch] text-sm text-[var(--muted)]">
          GPG (GNU Privacy Guard) is the standard, free OpenPGP implementation. Generate your key pair locally so
          the private key never leaves your machine:
        </p>
        <div className="space-y-3">
          <TerminalCommand
            command="gpg --full-generate-key"
            description="Interactive key generation — choose algorithm, key size, expiration, and identity"
          />
          <TerminalCommand
            command="gpg --list-secret-keys --keyid-format LONG"
            description="List your keys and find your key ID"
          />
          <TerminalCommand
            command="gpg --export --armor your-email@example.com > public-key.asc"
            description="Export your public key to share with others"
          />
          <TerminalCommand
            command="gpg --output revocation.asc --generate-revocation YOUR_KEY_ID"
            description="Create a revocation certificate and store it somewhere safe"
          />
        </div>
      </section>

      {/* Demo configuration */}
      <section className="mb-2">
        <h2 className="mb-2 text-xl font-semibold">Format Demo</h2>
        <p className="mb-4 max-w-[75ch] text-sm text-[var(--muted)]">
          Configure the options below to see how the choices you&apos;d make in{' '}
          <code className="rounded bg-[var(--band)] px-1 font-mono">gpg --full-generate-key</code> shape the
          armored output. Identity fields are optional — example values are used if you leave them blank.
        </p>
      </section>

      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel={generating ? 'Generating…' : 'Generate demo key blocks'}
      >
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="form-label" htmlFor="pgp-name">Name (optional)</label>
            <input
              id="pgp-name"
              type="text"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="form-input"
              placeholder={EXAMPLE_NAME}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="pgp-email">Email (optional)</label>
            <input
              id="pgp-email"
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="form-input"
              placeholder={EXAMPLE_EMAIL}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="pgp-comment">Comment (optional)</label>
            <input
              id="pgp-comment"
              type="text"
              value={userInfo.comment}
              onChange={(e) => setUserInfo({ ...userInfo, comment: e.target.value })}
              className="form-input"
              placeholder="Work key"
            />
          </div>
          <div>
            <label className="form-label" htmlFor="pgp-algorithm">Algorithm</label>
            <select
              id="pgp-algorithm"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as 'RSA' | 'ECC')}
              className="form-select"
            >
              <option value="RSA">RSA</option>
              <option value="ECC">ECC (Elliptic Curve)</option>
            </select>
          </div>
          {algorithm === 'RSA' ? (
            <div>
              <label className="form-label" htmlFor="pgp-keysize">Key Size</label>
              <select
                id="pgp-keysize"
                value={keySize}
                onChange={(e) => setKeySize(Number(e.target.value) as 2048 | 4096)}
                className="form-select"
              >
                <option value={2048}>2048 bits</option>
                <option value={4096}>4096 bits (Recommended)</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="form-label" htmlFor="pgp-curve">Elliptic Curve</label>
              <select
                id="pgp-curve"
                value={curve}
                onChange={(e) => setCurve(e.target.value as 'P-256' | 'P-384' | 'P-521')}
                className="form-select"
              >
                <option value="P-256">P-256 (256-bit)</option>
                <option value="P-384">P-384 (384-bit)</option>
                <option value="P-521">P-521 (521-bit)</option>
              </select>
            </div>
          )}
        </div>
      </GeneratorControls>

      {/* Demo output */}
      {keyPair && (
        <section className="mb-6 overflow-hidden card shadow-[var(--shadow-sm)]">
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[var(--hairline)] px-[18px] py-[13px]">
            <h2 className="flex items-center gap-2.5 text-15 font-semibold">
              Demo key blocks
              <span className="badge badge-entropy">{algorithm === 'RSA' ? `RSA-${keySize}` : `ECC ${curve}`}</span>
              <span className="badge badge-demo">Demo Only</span>
            </h2>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="min-h-10 rounded-[9px] border border-[var(--border-strong)] bg-[var(--background)] px-[15px] text-14 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)] disabled:opacity-60"
            >
              {generating ? 'Generating…' : '↻ Regenerate'}
            </button>
          </div>

          <div className="space-y-4 p-4">
            <div
              role="alert"
              className="rounded-[10px] border border-[color-mix(in_srgb,var(--border)_60%,var(--destructive))] bg-[color-mix(in_srgb,var(--background)_95%,var(--destructive))] px-[13px] py-2.5 text-14 text-[var(--body)]"
            >
              <strong className="text-[var(--destructive)]">Demo output.</strong> These blocks are
              structurally-formatted examples, NOT usable OpenPGP keys. They cannot be imported into GPG or used to
              encrypt anything. Generate real keys with{' '}
              <code className="font-mono">gpg --full-generate-key</code>.
            </div>

            {/* Example key info */}
            <div className="rounded-[12px] border border-[var(--border)] bg-[var(--band)] p-4">
              <h3 className="mb-3 text-15 font-semibold">Key Information (example values)</h3>
              <div className="grid grid-cols-1 gap-3 text-14 text-[var(--body)] md:grid-cols-2">
                <div>
                  <span className="text-[var(--muted)]">Key ID:</span>{' '}
                  <code className="font-mono">{keyPair.keyId}</code>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Algorithm:</span>{' '}
                  {algorithm === 'RSA' ? `RSA ${keySize}-bit` : `ECC ${curve}`}
                </div>
                <div className="md:col-span-2">
                  <span className="text-[var(--muted)]">Fingerprint:</span>{' '}
                  <code className="break-all font-mono">{keyPair.fingerprint}</code>
                </div>
                <div className="md:col-span-2">
                  <span className="text-[var(--muted)]">User ID:</span>{' '}
                  {displayName} {userInfo.comment && `(${userInfo.comment})`} &lt;{displayEmail}&gt;
                </div>
              </div>
            </div>

            <KeyPanel
              label="Public key block"
              hint="In a real key pair, this block is safe to share — others use it to encrypt messages to you and verify your signatures."
              value={keyPair.publicKey}
              onCopied={() => flash('Demo public key block copied')}
            />
            <KeyPanel
              label="Private key block"
              hint="A real private key block must never be shared or pasted into websites. This demo block contains no usable key material."
              value={keyPair.privateKey}
              secret
              onCopied={() => flash('Demo private key block copied')}
            />
            <KeyPanel
              label="Revocation certificate"
              hint="A real revocation certificate is your key's kill switch — store it separately from the private key. GPG creates one automatically in ~/.gnupg/openpgp-revocs.d/."
              value={keyPair.revocationCertificate}
              onCopied={() => flash('Demo revocation certificate copied')}
            />
          </div>

          <div className="border-t border-[var(--hairline)] bg-[var(--band)] px-[18px] py-[11px] text-14 text-[var(--muted)]">
            Formatting demo only — the armor headers label every block as demo output, and no real OpenPGP packets
            are produced.
          </div>
        </section>
      )}

      {/* Usage Instructions */}
      <section className="mb-8">
        <h2 className="mb-2 text-2xl font-semibold">Using Real GPG Keys</h2>
        <p className="mb-4 max-w-[75ch] text-sm text-[var(--muted)]">
          Once you&apos;ve generated a real key pair with <code className="rounded bg-[var(--band)] px-1 font-mono">gpg --full-generate-key</code>,
          these commands cover the everyday OpenPGP workflow:
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold">1. Import Keys into GPG</h3>
            <p className="mb-3 text-sm text-[var(--muted)]">
              If you received key files (for example from a backup or another machine), import them into your GPG keyring:
            </p>
            <TerminalCommand command="gpg --import public-key.asc" />
            <TerminalCommand command="gpg --import private-key.asc" />
            <TerminalCommand command="gpg --list-secret-keys --keyid-format LONG" />
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">2. Encrypt a Message</h3>
            <p className="mb-3 text-sm text-[var(--muted)]">
              Encrypt a message for someone using their public key:
            </p>
            <TerminalCommand command="echo 'Secret message' | gpg --encrypt --armor --recipient recipient@example.com" />
            <TerminalCommand command="gpg --encrypt --armor --recipient recipient@example.com message.txt" />
            <p className="mt-2 text-sm text-[var(--muted)]">
              The encrypted output can be safely sent via email or any insecure channel.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">3. Decrypt a Message</h3>
            <p className="mb-3 text-sm text-[var(--muted)]">Decrypt messages sent to you:</p>
            <TerminalCommand command="gpg --decrypt encrypted-message.asc" />
            <TerminalCommand command="echo '-----BEGIN PGP MESSAGE-----...' | gpg --decrypt" />
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">4. Sign a Message</h3>
            <p className="mb-3 text-sm text-[var(--muted)]">
              Create a digital signature to verify message authenticity:
            </p>
            <TerminalCommand command="gpg --clearsign message.txt" />
            <TerminalCommand command="echo 'Important message' | gpg --clearsign" />
            <TerminalCommand command="gpg --detach-sign --armor document.pdf" />
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">5. Verify Signatures</h3>
            <p className="mb-3 text-sm text-[var(--muted)]">
              Verify the authenticity of signed messages:
            </p>
            <TerminalCommand command="gpg --verify signed-message.asc" />
            <TerminalCommand command="gpg --verify document.pdf.asc document.pdf" />
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">6. Export and Share Keys</h3>
            <p className="mb-3 text-sm text-[var(--muted)]">Share your public key with others:</p>
            <TerminalCommand command="gpg --export --armor your-email@example.com > public-key.asc" />
            <TerminalCommand command="gpg --send-keys --keyserver keyserver.ubuntu.com YOUR_KEY_ID" />
            <TerminalCommand command="gpg --search-keys someone@example.com" />
          </div>
        </div>
      </section>

      {/* Email Client Integration */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Email Client Integration Examples</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-16 font-semibold">Thunderbird Setup</h3>
            <ol className="list-inside list-decimal space-y-2 text-14 leading-[1.6] text-[var(--body)]">
              <li>Install Thunderbird and set up your email account</li>
              <li>Go to Tools → Account Settings → End-to-End Encryption</li>
              <li>Click &quot;Add Key&quot; → &quot;Import a personal key from file&quot;</li>
              <li>Select your private key file and enter passphrase</li>
              <li>Enable &quot;Digital signing&quot; and &quot;Require encryption&quot; as needed</li>
            </ol>
          </div>

          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-16 font-semibold">Mailvelope (Web)</h3>
            <ol className="list-inside list-decimal space-y-2 text-14 leading-[1.6] text-[var(--body)]">
              <li>Install Mailvelope browser extension</li>
              <li>Open Mailvelope Options → Key Management</li>
              <li>Click &quot;Import Keys&quot; and paste your private key</li>
              <li>Add your email accounts to Mailvelope</li>
              <li>Compose encrypted emails directly in your webmail</li>
            </ol>
          </div>

          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-16 font-semibold">Apple Mail (macOS)</h3>
            <ol className="list-inside list-decimal space-y-2 text-14 leading-[1.6] text-[var(--body)]">
              <li>Import your key into GPG Suite for macOS</li>
              <li>Open Apple Mail preferences</li>
              <li>Go to Accounts → Select account → Advanced</li>
              <li>Enable &quot;Encrypt outgoing mail&quot; and &quot;Sign outgoing mail&quot;</li>
              <li>Mail will automatically use your PGP key</li>
            </ol>
          </div>

          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-16 font-semibold">Outlook with Gpg4win</h3>
            <ol className="list-inside list-decimal space-y-2 text-14 leading-[1.6] text-[var(--body)]">
              <li>Install Gpg4win (includes Kleopatra key manager)</li>
              <li>Import your key using Kleopatra</li>
              <li>Install GpgOL plugin for Outlook integration</li>
              <li>Restart Outlook and look for encryption options</li>
              <li>Use encrypt/sign buttons when composing emails</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Real-World Use Cases */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Real-World Use Cases &amp; Examples</h2>

        <div className="space-y-6">
          {[
            {
              title: 'Business Communication',
              intro: 'Secure client communications and confidential documents:',
              lines: [
                { comment: '# Encrypt contract for client review', code: 'gpg --encrypt --armor --recipient client@company.com contract-v2.pdf' },
                { comment: '# Sign press release for authenticity', code: 'gpg --clearsign --local-user pr@yourcompany.com press-release.txt' },
              ],
            },
            {
              title: 'Software Development',
              intro: 'Sign git commits and release packages:',
              lines: [
                { comment: '# Configure git to sign commits', code: 'git config --global user.signingkey YOUR_KEY_ID\ngit config --global commit.gpgsign true' },
                { comment: '# Sign a software release', code: 'gpg --detach-sign --armor myapp-v1.2.3.tar.gz' },
              ],
            },
            {
              title: 'Healthcare & Legal',
              intro: 'HIPAA-compliant communication and legal document verification:',
              lines: [
                { comment: '# Encrypt patient records for transfer', code: 'gpg --cipher-algo AES256 --encrypt --recipient doctor@hospital.com patient-file.pdf' },
                { comment: '# Sign legal document with timestamp', code: 'gpg --clearsign --local-user lawyer@firm.com legal-brief.txt' },
              ],
            },
            {
              title: 'Personal Privacy',
              intro: 'Secure personal communications and file backup:',
              lines: [
                { comment: '# Encrypt backup files', code: "tar czf - important-docs/ | gpg --symmetric --cipher-algo AES256 > backup.tar.gz.gpg" },
                { comment: '# Secure email to family member', code: 'echo "Family news..." | gpg --encrypt --armor --recipient family@example.com' },
              ],
            },
          ].map((useCase) => (
            <div key={useCase.title} className="rounded-[12px] border border-[var(--border)] bg-[var(--band)] p-4">
              <h3 className="mb-2 text-16 font-semibold">{useCase.title}</h3>
              <p className="mb-3 text-14 text-[var(--muted)]">{useCase.intro}</p>
              <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--surface)] p-3 text-14">
                {useCase.lines.map((line, i) => (
                  <div key={i} className={i > 0 ? 'mt-2' : ''}>
                    <div className="mb-1 font-mono text-[var(--accent-strong)]">{line.comment}</div>
                    <code className="block whitespace-pre-wrap break-all font-mono text-[var(--body)]">{line.code}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About PGP */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">About PGP Encryption</h2>

        <p className="mb-4 max-w-[75ch] text-15 leading-[1.65] text-[var(--body)]">
          Pretty Good Privacy (PGP) is a data encryption and decryption program that provides cryptographic privacy
          and authentication for data communication. PGP uses a combination of symmetric-key cryptography and
          public-key cryptography.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-16 font-semibold text-[var(--accent-strong)]">Key Features</h3>
            <ul className="space-y-2 text-14 leading-[1.6] text-[var(--body)]">
              <li>• End-to-end encryption for emails</li>
              <li>• Digital signatures for authenticity</li>
              <li>• Key distribution and management</li>
              <li>• Cross-platform compatibility</li>
              <li>• Open source implementations (GPG)</li>
            </ul>
          </div>

          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-3 text-16 font-semibold text-[var(--accent-strong)]">Use Cases</h3>
            <ul className="space-y-2 text-14 leading-[1.6] text-[var(--body)]">
              <li>• Secure email communication</li>
              <li>• File encryption and signing</li>
              <li>• Software distribution verification</li>
              <li>• Secure messaging applications</li>
              <li>• Document authentication</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Algorithm Comparison */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Algorithm Comparison</h2>

        <div className="overflow-x-auto rounded-[12px] border border-[var(--border)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--band)] text-left">
                <th className="border-b border-[var(--border)] px-4 py-2.5 font-semibold">Algorithm</th>
                <th className="border-b border-[var(--border)] px-4 py-2.5 font-semibold">Key Size</th>
                <th className="border-b border-[var(--border)] px-4 py-2.5 font-semibold">Performance</th>
                <th className="border-b border-[var(--border)] px-4 py-2.5 font-semibold">Security Level</th>
                <th className="border-b border-[var(--border)] px-4 py-2.5 font-semibold">Recommended For</th>
              </tr>
            </thead>
            <tbody className="text-[var(--body)]">
              {[
                ['RSA 2048', '2048 bits', 'Fast', 'Good', 'General use, compatibility'],
                ['RSA 4096', '4096 bits', 'Slower', 'Excellent', 'Long-term security'],
                ['ECC P-256', '256 bits', 'Very Fast', 'Good', 'Mobile, IoT devices'],
                ['ECC P-384', '384 bits', 'Fast', 'Excellent', 'High security applications'],
              ].map((row, i) => (
                <tr key={row[0]} className={i % 2 === 1 ? 'bg-[var(--band)]' : ''}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-4 py-2 ${i < 3 ? 'border-b border-[var(--hairline)]' : ''}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {[
            {
              q: 'Does this page generate real PGP keys?',
              a: 'No. The demo blocks are structurally-formatted examples that show what armored OpenPGP output looks like — they contain no usable OpenPGP key material and cannot be imported into GPG. Generate real keys locally with gpg --full-generate-key.',
            },
            {
              q: 'What is the difference between RSA and ECC keys?',
              a: 'RSA keys are widely supported and use larger key sizes (2048-4096 bits). ECC keys are newer, more efficient, and provide equivalent security with smaller key sizes (256-384 bits). Choose RSA for maximum compatibility, ECC for better performance.',
            },
            {
              q: 'How do I use real PGP keys once I have them?',
              a: 'After generating a key pair with GPG, configure your email client (Thunderbird, Apple Mail) or use browser extensions like Mailvelope for webmail. Always keep your private key secure and never share it.',
            },
            {
              q: 'Should my PGP key expire?',
              a: 'Yes, setting an expiration date is recommended for security. You can always extend the expiration later if needed. If you lose access to your key, expiration prevents it from being used indefinitely. Choose 1-2 years for personal use, shorter for high-security contexts.',
            },
            {
              q: 'Is it safe to generate PGP keys in a browser?',
              a: 'Real PGP keys should be generated offline with GPG — for high-value keys, on an air-gapped computer. That is why this page is a format demo rather than a real key generator: pasting or generating real private keys in a browser adds unnecessary risk.',
            },
            {
              q: 'What should I do with the revocation certificate?',
              a: 'Store your revocation certificate in a safe place separate from your private key. If your private key is ever compromised or lost, you can use the revocation certificate to notify others that the key should no longer be trusted.',
            },
            {
              q: 'Can I use PGP for file encryption, not just email?',
              a: 'Absolutely! PGP can encrypt any type of file or data. Use gpg --encrypt to encrypt files, documents, backups, or any sensitive data. Many backup tools and applications also support PGP encryption natively.',
            },
          ].map((faq) => (
            <div key={faq.q} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
              <h3 className="mb-2 text-15 font-semibold">{faq.q}</h3>
              <p className="text-14 leading-[1.6] text-[var(--muted)]">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
