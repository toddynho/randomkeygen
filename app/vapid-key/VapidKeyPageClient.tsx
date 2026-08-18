'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GeneratorLayout,
  GeneratorControls,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  TerminalCommand,
  CodeBlock,
} from '../components'

interface VapidKeyPair {
  publicKey: string
  privateKey: string
}

interface VapidKeyPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, any>[]
}

// Convert ArrayBuffer to URL-safe base64
function arrayBufferToUrlSafeBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

const HOW_TO_STEPS = [
  {
    title: 'Generate one key pair',
    body: 'Generate VAPID keys once per application and reuse them — changing keys invalidates every existing push subscription.',
  },
  {
    title: 'Use the public key in the browser',
    body: 'Pass the public key as applicationServerKey when calling pushManager.subscribe(). It is safe to expose in client-side code.',
  },
  {
    title: 'Keep the private key on your server',
    body: 'Store the private key as an environment variable and use it to sign push requests with a library like web-push.',
  },
]

/** Labeled key panel with per-panel copy feedback. */
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
      <code className="block break-all px-4 py-3 font-mono text-14 leading-[1.6] text-[var(--body)]">
        {value}
      </code>
      <p className="border-t border-[var(--hairline)] px-4 py-2 text-13 text-[var(--muted)]">{hint}</p>
    </div>
  )
}

export default function VapidKeyPageClient({ breadcrumbItems, schema }: VapidKeyPageClientProps) {
  const [keyPair, setKeyPair] = useState<VapidKeyPair | null>(null)
  const [generating, setGenerating] = useState(false)
  const [toastMessage, flash] = useToast()
  const requestId = useRef(0)

  const generateKeyPair = useCallback(async (): Promise<boolean> => {
    const id = ++requestId.current
    setGenerating(true)
    try {
      // Generate ECDSA P-256 key pair (required for VAPID)
      const pair = await window.crypto.subtle.generateKey(
        {
          name: 'ECDSA',
          namedCurve: 'P-256',
        },
        true, // extractable
        ['sign', 'verify']
      )

      // Export public key in raw format (uncompressed point)
      const publicKeyBuffer = await window.crypto.subtle.exportKey('raw', pair.publicKey)
      // Export private key in PKCS8 format, then extract the raw key
      const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', pair.privateKey)

      // For VAPID, we need the raw 32-byte private key.
      // PKCS8 for P-256 has the raw key as the last 32 bytes of the structure.
      const privateKeyArray = new Uint8Array(privateKeyBuffer)
      const rawPrivateKey = privateKeyArray.slice(-32)

      if (id !== requestId.current) return false // stale result — a newer request superseded it

      setKeyPair({
        publicKey: arrayBufferToUrlSafeBase64(publicKeyBuffer),
        privateKey: arrayBufferToUrlSafeBase64(
          rawPrivateKey.buffer.slice(rawPrivateKey.byteOffset, rawPrivateKey.byteOffset + rawPrivateKey.byteLength)
        ),
      })
      return true
    } catch (error) {
      console.error('Failed to generate VAPID key pair:', error)
      return false
    } finally {
      if (id === requestId.current) setGenerating(false)
    }
  }, [])

  // Generate on first load
  useEffect(() => {
    generateKeyPair()
  }, [generateKeyPair])

  const handleRegenerate = useCallback(async () => {
    if (await generateKeyPair()) flash('Generated new VAPID key pair')
  }, [generateKeyPair, flash])

  // `R` regenerates when no field has focus
  useRegenerateHotkey(handleRegenerate)

  return (
    <GeneratorLayout
      title="VAPID Key Generator"
      description="Generate VAPID (Voluntary Application Server Identification) key pairs for Web Push notifications. Required for sending push notifications through browsers."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      howToSteps={HOW_TO_STEPS}
      howToHeading="How to use these VAPID keys"
      storageCallout={
        <SecurityNotice type="warning" title="Important">
          <ul className="list-inside list-disc space-y-1">
            <li>Generate keys once and reuse them for your application</li>
            <li>If you change keys, all existing subscriptions become invalid</li>
            <li>Store the private key securely as an environment variable</li>
            <li>The public key is safe to expose in client-side code</li>
          </ul>
        </SecurityNotice>
      }
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={handleRegenerate}
        generateLabel={generating ? 'Generating…' : 'Generate VAPID keys'}
      >
        <div>
          <span className="form-label">Algorithm</span>
          <p className="pt-2 text-14 text-[var(--muted)]">ECDSA P-256</p>
        </div>
        <div>
          <span className="form-label">Format</span>
          <p className="pt-2 text-14 text-[var(--muted)]">URL-safe Base64</p>
        </div>
      </GeneratorControls>

      {/* Generated key pair */}
      <section className="mb-6 overflow-hidden card shadow-[var(--shadow-sm)]">
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[var(--hairline)] px-[18px] py-[13px]">
          <h2 className="flex items-center gap-2.5 text-15 font-semibold">
            Generated key pair
            <span className="badge badge-entropy">ECDSA P-256</span>
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
                label="Public key (applicationServerKey)"
                hint="Used in the browser when subscribing to push notifications."
                value={keyPair.publicKey}
                onCopied={() => flash('Public key copied')}
              />
              <KeyPanel
                label="Private key"
                hint="Keep secret! Used on your server to sign push notification requests."
                value={keyPair.privateKey}
                secret
                onCopied={() => flash('Private key copied')}
              />
            </>
          ) : (
            <p className="py-8 text-center text-14 text-[var(--muted)]">Generating your VAPID key pair…</p>
          )}
        </div>
        <div className="border-t border-[var(--hairline)] bg-[var(--band)] px-[18px] py-[11px] text-14 text-[var(--muted)]">
          ECDSA key pair over the P-256 curve, encoded as URL-safe Base64 — the format Web Push (VAPID) requires.
        </div>
      </section>

      {/* Usage Examples */}
      {keyPair && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Usage Examples</h2>

          <div className="space-y-4">
            <CodeBlock
              filename=".env"
              code={`VAPID_PUBLIC_KEY=${keyPair.publicKey}
VAPID_PRIVATE_KEY=${keyPair.privateKey}
VAPID_SUBJECT=mailto:admin@example.com`}
            />

            <CodeBlock
              filename="JavaScript (Client - Service Worker Registration)"
              code={`// Subscribe to push notifications
const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: '${keyPair.publicKey}'
});

// Send subscription to your server
await fetch('/api/subscribe', {
  method: 'POST',
  body: JSON.stringify(subscription)
});`}
            />

            <CodeBlock
              filename="Node.js (Server - web-push)"
              code={`const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:admin@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Send notification
await webpush.sendNotification(subscription, JSON.stringify({
  title: 'New Message',
  body: 'You have a new notification!'
}));`}
            />
          </div>
        </section>
      )}

      {/* What is VAPID */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">What is VAPID?</h2>
        <p className="mb-4 max-w-[75ch] text-15 leading-[1.65] text-[var(--body)]">
          VAPID (Voluntary Application Server Identification) is a specification that allows your application server
          to identify itself to push services (like Firebase Cloud Messaging, Mozilla Push Service, etc.) when
          sending push notifications.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-2 text-15 font-semibold">Why VAPID?</h3>
            <ul className="list-inside list-disc space-y-1 text-14 leading-[1.6] text-[var(--body)]">
              <li>No need to register with each push service</li>
              <li>Works with all major browsers</li>
              <li>Provides sender identification</li>
              <li>Enables rate limiting and abuse prevention</li>
            </ul>
          </div>
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="mb-2 text-15 font-semibold">Browser Support</h3>
            <ul className="list-inside list-disc space-y-1 text-14 leading-[1.6] text-[var(--body)]">
              <li>Chrome / Edge (Chromium)</li>
              <li>Firefox</li>
              <li>Safari (macOS/iOS 16+)</li>
              <li>Opera</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Terminal Commands */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Generate Locally</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">Generate VAPID keys using popular libraries:</p>
        <div className="space-y-3">
          <TerminalCommand
            command="npx web-push generate-vapid-keys"
            description="Node.js web-push (recommended)"
          />
          <TerminalCommand
            command="pip install py-vapid && vapid --gen"
            description="Python py-vapid"
          />
          <TerminalCommand
            command="openssl ecparam -name prime256v1 -genkey -noout -out vapid_private.pem"
            description="OpenSSL (generates PEM format)"
          />
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
