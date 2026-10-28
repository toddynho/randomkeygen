'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  GeneratorLayout,
  SecurityNotice,
  RelatedContent,
} from '../components'
import { FaqList } from '../components/FaqList'
import { jwtFaqs, jwtRelated } from './content'
import {
  generateRsaKeyPair,
  inspectJwt,
  randomHmacSecret,
  signJwt,
  verifyJwt,
  type JwtAlg,
  type VerifyResult,
} from './jwt-codec'

const ALGS: { value: JwtAlg; label: string }[] = [
  { value: 'HS256', label: 'HS256 (HMAC-SHA256)' },
  { value: 'HS384', label: 'HS384 (HMAC-SHA384)' },
  { value: 'HS512', label: 'HS512 (HMAC-SHA512)' },
  { value: 'RS256', label: 'RS256 (RSA-SHA256)' },
]

function defaultPayload(): string {
  const now = Math.floor(Date.now() / 1000)
  return JSON.stringify(
    { sub: 'user-123', name: 'Ada Lovelace', iat: now, exp: now + 3600 },
    null,
    2,
  )
}

function syncHeaderAlg(headerText: string, alg: JwtAlg): string {
  try {
    const parsed = JSON.parse(headerText)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return headerText
    if (parsed.alg === alg) return headerText
    return JSON.stringify({ ...parsed, alg }, null, 2)
  } catch {
    return headerText
  }
}

interface JwtGeneratorClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, unknown>[]
}

export default function JwtGeneratorClient({ breadcrumbItems, schema }: JwtGeneratorClientProps) {
  const [alg, setAlg] = useState<JwtAlg>('HS256')
  const [headerText, setHeaderText] = useState(JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2))
  const [payloadText, setPayloadText] = useState(defaultPayload)
  const [secret, setSecret] = useState('')
  const [privateKeyPem, setPrivateKeyPem] = useState('')
  const [publicKeyPem, setPublicKeyPem] = useState('')
  const [token, setToken] = useState('')
  const [encodeError, setEncodeError] = useState('')
  const [pastedToken, setPastedToken] = useState('')
  const [verify, setVerify] = useState<VerifyResult | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [generatingKey, setGeneratingKey] = useState(false)

  const isRsa = alg === 'RS256'

  const onAlg = (next: JwtAlg) => {
    setAlg(next)
    setHeaderText((current) => syncHeaderAlg(current, next))
  }

  const copy = useCallback(async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(id)
      window.setTimeout(() => setCopied((current) => (current === id ? null : current)), 1400)
    } catch {
      setCopied(null)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const keyMaterial = isRsa ? privateKeyPem : secret
    signJwt(headerText, payloadText, alg, keyMaterial)
      .then((signed) => {
        if (!cancelled) {
          setToken(signed)
          setEncodeError('')
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setToken('')
          setEncodeError(error instanceof Error ? error.message : 'Could not sign the token.')
        }
      })
    return () => {
      cancelled = true
    }
  }, [alg, headerText, payloadText, secret, privateKeyPem, isRsa])

  useEffect(() => {
    let cancelled = false
    if (!pastedToken.trim()) {
      setVerify(null)
      return
    }
    let keyMaterial = ''
    try {
      const algInToken = inspectJwt(pastedToken).algorithm
      keyMaterial = algInToken === 'RS256' ? publicKeyPem : secret
    } catch {
      keyMaterial = secret
    }
    verifyJwt(pastedToken, keyMaterial).then((result) => {
      if (!cancelled) setVerify(result)
    })
    return () => {
      cancelled = true
    }
  }, [pastedToken, secret, publicKeyPem])

  const generateSecret = () => setSecret(randomHmacSecret())

  const generateKeys = async () => {
    setGeneratingKey(true)
    try {
      const pair = await generateRsaKeyPair()
      setPrivateKeyPem(pair.privateKeyPem)
      setPublicKeyPem(pair.publicKeyPem)
    } finally {
      setGeneratingKey(false)
    }
  }

  let inspected: ReturnType<typeof inspectJwt> | null = null
  let inspectError = ''
  if (pastedToken.trim()) {
    try {
      inspected = inspectJwt(pastedToken)
    } catch (error) {
      inspectError = error instanceof Error ? error.message : 'Invalid JWT.'
    }
  }

  return (
    <GeneratorLayout
      title="JWT Token Generator"
      description="Encode a JSON Web Token from an editable header and payload, or paste one to inspect and verify it. HS256, HS384, HS512, and RS256 run in your browser. For development and testing — the secret and private key stay on this device."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
    >
      <SecurityNotice type="warning" title="Local development tool">
        <p>
          Signing and verification happen in this browser with the Web Crypto API. Nothing is uploaded.
          Do not paste a production private key, and do not put secrets in the payload — a JWT is signed, not encrypted.
          Need only the HMAC key? Use the <Link href="/jwt-secret" className="font-semibold text-[var(--accent-strong)] hover:underline">JWT secret generator</Link>.
        </p>
      </SecurityNotice>

      <section className="mt-6 mb-8">
        <h2 className="mb-4 text-xl font-semibold">Encode</h2>
        <div className="control-panel mb-4 p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="jwt-alg">Algorithm</label>
              <select
                id="jwt-alg"
                className="form-input w-full"
                value={alg}
                onChange={(event) => onAlg(event.target.value as JwtAlg)}
              >
                {ALGS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-[var(--muted)]">
                The <code className="font-mono">alg</code> field is set from this control when the token is signed.
                ES256 is not signed here.
              </p>
            </div>
            {isRsa ? (
              <div className="flex items-end">
                <button type="button" onClick={generateKeys} className="btn btn-primary" disabled={generatingKey}>
                  {generatingKey ? 'Generating RSA key…' : 'Generate RSA key pair'}
                </button>
              </div>
            ) : (
              <div className="flex items-end">
                <button type="button" onClick={generateSecret} className="btn btn-primary">
                  Generate HMAC secret
                </button>
              </div>
            )}
          </div>

          {isRsa ? (
            <div className="mt-4 grid gap-4">
              <KeyField
                id="jwt-private"
                label="RSA private key (PKCS#8 PEM)"
                value={privateKeyPem}
                onChange={setPrivateKeyPem}
                onCopy={() => copy(privateKeyPem, 'private')}
                copied={copied === 'private'}
                rows={6}
              />
              <KeyField
                id="jwt-public"
                label="RSA public key (SPKI PEM) — used to verify"
                value={publicKeyPem}
                onChange={setPublicKeyPem}
                onCopy={() => copy(publicKeyPem, 'public')}
                copied={copied === 'public'}
                rows={5}
              />
            </div>
          ) : (
            <div className="mt-4">
              <label className="form-label" htmlFor="jwt-secret">HMAC secret</label>
              <div className="flex gap-2">
                <input
                  id="jwt-secret"
                  type="text"
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                  className="form-input min-w-0 flex-1 font-mono"
                  placeholder="Paste a secret or generate one"
                  spellCheck={false}
                  autoComplete="off"
                />
                <button type="button" onClick={() => copy(secret, 'secret')} className="btn btn-secondary" disabled={!secret}>
                  {copied === 'secret' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Used as UTF-8 text, matching <code className="font-mono">jwt.sign(payload, secret)</code> when the secret is a string.
                A value from the <Link href="/jwt-secret" className="font-semibold text-[var(--accent-strong)] hover:underline">JWT secret generator</Link> can be pasted as-is.
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="jwt-header">Header JSON</label>
            <textarea
              id="jwt-header"
              value={headerText}
              onChange={(event) => setHeaderText(event.target.value)}
              className="form-textarea h-36 w-full font-mono text-sm"
              spellCheck={false}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="jwt-payload">Payload JSON</label>
            <textarea
              id="jwt-payload"
              value={payloadText}
              onChange={(event) => setPayloadText(event.target.value)}
              className="form-textarea h-36 w-full font-mono text-sm"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Signed token</h3>
            <div className="flex gap-2">
              <button type="button" onClick={() => copy(token, 'token')} className="btn btn-secondary" disabled={!token}>
                {copied === 'token' ? '✓ Copied' : 'Copy token'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={!token}
                onClick={() => setPastedToken(token)}
              >
                Inspect this token
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={token}
            aria-label="Signed JWT"
            className="form-textarea h-28 w-full bg-[var(--band)] font-mono text-sm"
            placeholder="The signed token appears here."
          />
          {encodeError && (
            <p
              role={/Enter an HMAC secret|RSA private key/.test(encodeError) ? 'status' : 'alert'}
              className={`mt-2 text-sm ${/Enter an HMAC secret|RSA private key/.test(encodeError) ? 'text-[var(--muted)]' : 'text-[var(--danger-text)]'}`}
            >
              {encodeError}
            </p>
          )}
          <p className="mt-1 text-xs text-[var(--muted)]">
            Header and payload are parsed and re-serialized without extra whitespace before signing.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Decode and verify</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Paste a token to read the header and payload. Add the HMAC secret or the RS256 public key above to check the signature.
        </p>
        <label className="form-label" htmlFor="jwt-paste">JWT</label>
        <textarea
          id="jwt-paste"
          value={pastedToken}
          onChange={(event) => setPastedToken(event.target.value)}
          className="form-textarea h-24 w-full font-mono text-sm"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          spellCheck={false}
        />
        {inspectError && (
          <p role="alert" className="mt-2 text-sm text-[var(--danger-text)]">{inspectError}</p>
        )}
        {inspected && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <JsonBlock label="Header" value={inspected.header} />
            <JsonBlock label="Payload" value={inspected.payload} />
          </div>
        )}
        {verify && verify.status !== 'malformed' && (
          <p
            role="status"
            className={`mt-4 rounded-[10px] border px-3 py-2 text-sm ${
              verify.status === 'valid'
                ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent-strong)]'
                : verify.status === 'invalid'
                  ? 'border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger-text)]'
                  : 'border-[var(--border)] bg-[var(--band)] text-[var(--muted)]'
            }`}
          >
            {verify.status === 'valid' ? 'Signature is valid.' : verify.message}
          </p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Frequently asked questions</h2>
        <FaqList items={jwtFaqs} />
      </section>

      <RelatedContent {...jwtRelated} />
    </GeneratorLayout>
  )
}

function KeyField({
  id,
  label,
  value,
  onChange,
  onCopy,
  copied,
  rows,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onCopy: () => void
  copied: boolean
  rows: number
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label className="form-label mb-0" htmlFor={id}>{label}</label>
        <button type="button" onClick={onCopy} className="btn btn-secondary" disabled={!value}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="form-textarea w-full font-mono text-xs"
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  )
}

function JsonBlock({ label, value }: { label: string; value: Record<string, unknown> }) {
  return (
    <div>
      <h3 className="form-label">{label}</h3>
      <pre className="overflow-x-auto rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3 text-sm">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}
