'use client'

import Link from 'next/link'

interface RelatedTool {
  href: string
  label: string
  description: string
}

interface RelatedGuide {
  href: string
  title: string
}

interface RelatedContentProps {
  tools?: RelatedTool[]
  guides?: RelatedGuide[]
  tips?: string[]
}

export function RelatedContent({ tools, guides, tips }: RelatedContentProps) {
  return (
    <aside className="mt-12 pt-8 border-t border-[var(--border)]">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Related Tools */}
        {tools && tools.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
              Related Tools
            </h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="block p-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
                  >
                    <div className="font-medium text-sm">{tool.label}</div>
                    <div className="text-xs text-[var(--muted)]">{tool.description}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Security Tips */}
        {tips && tips.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
              Security Tips
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[var(--accent)]">*</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Guides */}
        {guides && guides.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
              Learn More
            </h3>
            <ul className="space-y-2">
              {guides.map((guide) => (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1"
                  >
                    {guide.title}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </aside>
  )
}

// Pre-configured related content for different tool categories
export const passwordRelated: RelatedContentProps = {
  tools: [
    { href: '/password/8-character', label: '8 Character Password', description: 'Legacy system compatible' },
    { href: '/password-strength', label: 'Password Strength Checker', description: 'Test your password security' },
    { href: '/passphrase', label: 'Passphrase Generator', description: 'Easy to remember passwords' },
    { href: '/memorable-password', label: 'Memorable Passwords', description: 'Word-based passwords' },
    { href: '/pin-generator', label: 'PIN Generator', description: 'Secure 4-6 digit PINs' },
  ],
  guides: [
    { href: '/guides/choosing-a-password-manager', title: 'How to Choose a Password Manager' },
    { href: '/guides/password-manager-vs-browser', title: 'Browser vs Dedicated Password Manager' },
    { href: '/guides/password-security-best-practices', title: 'Password Security Best Practices' },
    { href: '/guides/how-password-managers-work', title: 'How Password Managers Work' },
  ],
  tips: [
    'Use unique passwords for every account',
    'Enable 2FA wherever possible',
    'Use a password manager to store credentials',
    'Never share passwords via email or text',
  ],
}

export const encryptionRelated: RelatedContentProps = {
  tools: [
    { href: '/aes-key', label: 'AES Key Generator', description: '128/192/256 bit keys' },
    { href: '/rsa-key', label: 'RSA Key Generator', description: 'Asymmetric key pairs' },
    { href: '/hmac-key', label: 'HMAC Key Generator', description: 'Message authentication keys' },
    { href: '/hash-generator', label: 'Hash Generator', description: 'SHA256, SHA512, MD5' },
    { href: '/encryption-key', label: 'Encryption Keys', description: 'Hex keys for encryption' },
  ],
  guides: [
    { href: '/guides/encryption-explained', title: 'Encryption Explained: AES vs RSA' },
    { href: '/guides/api-key-best-practices', title: 'API Key Storage and Rotation' },
  ],
  tips: [
    'Use AES-256 for symmetric encryption',
    'Never store encryption keys in code',
    'Rotate keys periodically',
    'Use environment variables for secrets',
  ],
}

export const developerRelated: RelatedContentProps = {
  tools: [
    { href: '/api-key', label: 'API Key Generator', description: 'Secure API tokens' },
    { href: '/jwt-secret', label: 'JWT Secret Generator', description: 'Token signing keys' },
    { href: '/django-secret-key', label: 'Django Secret Key', description: 'For Django settings' },
    { href: '/uuid', label: 'UUID Generator', description: 'Unique identifiers' },
    { href: '/backup-codes', label: 'Backup Codes', description: '2FA recovery codes' },
  ],
  guides: [
    { href: '/guides/api-key-best-practices', title: 'API Key Best Practices' },
    { href: '/guides/jwt-security', title: 'JWT Security Guide' },
  ],
  tips: [
    'Use prefixes to identify key types (sk_, pk_)',
    'Set appropriate expiration on tokens',
    'Implement rate limiting on API endpoints',
    'Log and monitor key usage',
  ],
}

// Popular generators for homepage cross-linking
export const popularGenerators: RelatedContentProps = {
  tools: [
    { href: '/password', label: 'Password Generator', description: 'Strong random passwords' },
    { href: '/password/8-character', label: '8-Character Passwords', description: 'Legacy system compatible' },
    { href: '/jwt-secret', label: 'JWT Secret Generator', description: '256-bit signing keys' },
    { href: '/uuid', label: 'UUID Generator', description: 'Unique identifiers' },
    { href: '/api-key', label: 'API Key Generator', description: 'Secure API tokens' },
    { href: '/pin-generator', label: 'PIN Generator', description: 'Banking & device PINs' },
    { href: '/aes-key', label: 'AES Key Generator', description: 'Encryption keys' },
    { href: '/rsa-key', label: 'RSA Key Generator', description: 'Public/private pairs' },
  ],
}
