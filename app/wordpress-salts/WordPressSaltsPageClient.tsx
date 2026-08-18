'use client'

import { useState, useEffect, useCallback } from 'react'
import { generators } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratedValue,
  SecurityNotice,
  TerminalCommand,
  CodeBlock,
  Toast,
  useToast,
  useRegenerateHotkey,
} from '../components'

const SALT_KEYS = [
  'AUTH_KEY',
  'SECURE_AUTH_KEY',
  'LOGGED_IN_KEY',
  'NONCE_KEY',
  'AUTH_SALT',
  'SECURE_AUTH_SALT',
  'LOGGED_IN_SALT',
  'NONCE_SALT',
]

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'WordPress Salts', url: '/wordpress-salts' },
]

export default function WordPressSaltsPageClient() {
  const [salts, setSalts] = useState<Record<string, string>>({})
  const [toastMessage, flash] = useToast()

  const generateAll = useCallback(() => {
    const newSalts: Record<string, string> = {}
    SALT_KEYS.forEach(key => {
      newSalts[key] = generators.wordpressSalt()
    })
    setSalts(newSalts)
  }, [])

  const regenerateOne = useCallback((key: string) => {
    setSalts((current) => ({ ...current, [key]: generators.wordpressSalt() }))
  }, [])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleRegenerateAll = useCallback(() => {
    generateAll()
    flash('Regenerated all salts')
  }, [generateAll, flash])

  // `R` regenerates everything when no field has focus
  useRegenerateHotkey(handleRegenerateAll)

  const formatForWpConfig = () => {
    return SALT_KEYS.map(key =>
      `define('${key}', '${salts[key] || ''}');`
    ).join('\n')
  }

  return (
    <GeneratorLayout
      title="WordPress Security Keys & Salts"
      description="Generate all 8 secure authentication keys and salts for your WordPress wp-config.php file. These enhance the security of cookies and user sessions."
      breadcrumbItems={breadcrumbItems}
    >
      {/* Controls */}
      <section className="control-panel mb-6 p-5 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--muted)]">
              All 8 keys generate together — paste the wp-config block below into your{' '}
              <code className="font-mono text-14 text-[var(--foreground)]">wp-config.php</code>.
              Press <kbd className="rounded border border-[var(--border-strong)] bg-[var(--band)] px-1 font-mono text-12">R</kbd> to regenerate.
            </p>
            <button onClick={handleRegenerateAll} className="btn btn-primary min-h-[46px] px-6">
              ↻ Regenerate all
            </button>
          </div>
          <p className="border-t border-[var(--hairline)] pt-3.5 text-14 leading-[1.6] text-[var(--muted)]">
            Each salt is 64 characters drawn from a 92-character pool ≈ 417 bits of entropy — far beyond
            brute force. WordPress uses these to sign cookies and nonces, so they never need to be memorized.
          </p>
        </div>
      </section>

      {/* Named salts */}
      <section className="mb-6 card p-5 shadow-[var(--shadow-sm)]">
        <h2 className="mb-4 text-15 font-semibold">Generated keys &amp; salts</h2>
        <div className="space-y-4">
          {SALT_KEYS.map((key) => (
            <GeneratedValue
              key={key}
              value={salts[key] || ''}
              label={key}
              onRegenerate={() => regenerateOne(key)}
            />
          ))}
        </div>
      </section>

      {/* Copy-all wp-config block */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Copy into wp-config.php</h2>
        <CodeBlock
          filename="wp-config.php"
          language="php"
          showLineNumbers
          code={formatForWpConfig()}
        />
      </section>

      {/* Info */}
      <section className="mb-8 space-y-4">
        <SecurityNotice type="info" title="What these keys do">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>AUTH_KEY/SALT:</strong> Encrypts admin cookies</li>
            <li><strong>SECURE_AUTH_KEY/SALT:</strong> Encrypts SSL admin cookies</li>
            <li><strong>LOGGED_IN_KEY/SALT:</strong> Encrypts non-SSL logged-in cookies</li>
            <li><strong>NONCE_KEY/SALT:</strong> Protects nonces against CSRF attacks</li>
          </ul>
        </SecurityNotice>

        <SecurityNotice type="warning" title="When to regenerate">
          <p>
            Regenerate these keys if you suspect your site has been compromised.
            This will invalidate all existing logged-in sessions, forcing all users
            (including yourself) to log in again.
          </p>
        </SecurityNotice>
      </section>

      {/* Official Generator */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Official WordPress Salt Generator</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          WordPress also provides an official API for generating salts:
        </p>
        <TerminalCommand
          command="curl https://api.wordpress.org/secret-key/1.1/salt/"
          description="Fetch from WordPress.org API"
        />
      </section>

      {/* Installation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Installation</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Copy the generated keys and paste them into your <code className="font-mono">wp-config.php</code> file,
          replacing any existing salt definitions:
        </p>
        <CodeBlock
          filename="wp-config.php"
          language="php"
          code={`<?php
/**
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * https://api.wordpress.org/secret-key/1.1/salt/
 */
${formatForWpConfig()}

/* That's all, stop editing! */`}
        />
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
