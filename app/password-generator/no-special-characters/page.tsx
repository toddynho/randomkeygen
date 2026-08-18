import type { Metadata } from 'next'
import Link from 'next/link'
import PasswordLengthClient from '@/app/components/password/PasswordLengthClient'
import { SecurityNotice } from '@/app/components'

export const metadata: Metadata = {
  title: 'Password Generator Without Special Characters - Alphanumeric Only | RandomKeygen',
  description: 'Generate secure passwords without special characters or symbols. Perfect for sites that don\'t allow special characters. Letters and numbers only.',
  keywords: ['password without special characters', 'alphanumeric password', 'no symbols password', 'password no special chars', 'letters and numbers password'],
  openGraph: {
    title: 'Password Generator Without Special Characters',
    description: 'Generate secure passwords with only letters and numbers - no symbols.',
    url: 'https://randomkeygen.com/password-generator/no-special-characters',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/password-generator/no-special-characters',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'No Special Characters', url: '/password-generator/no-special-characters' },
]

const relatedLinks = [
  { href: '/password', label: 'Full Character Set' },
  { href: '/password-generator/letters-only', label: 'Letters Only' },
  { href: '/pronounceable-password', label: 'Pronounceable' },
  { href: '/passphrase', label: 'Passphrase' },
]

export default function NoSpecialCharsPage() {
  return (
    <PasswordLengthClient
      title="Password Generator Without Special Characters"
      description="Generate secure passwords using only letters and numbers. Perfect for systems that don't allow special characters or have strict character restrictions."
      breadcrumbItems={breadcrumbItems}
      lengthRange={{ min: 8, max: 64, initial: 16 }}
      charsetOptions={['lowercase', 'uppercase', 'numbers']}
      csvFilename="passwords-alphanumeric.csv"
    >
      <SecurityNotice type="info" title="When to use alphanumeric passwords">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Older systems that don&apos;t support special characters</li>
          <li>WiFi passwords shared verbally</li>
          <li>Systems with strict character whitelists</li>
          <li>Applications where special chars cause escaping issues</li>
        </ul>
        <p className="mt-2">
          Since there&apos;s no symbols, consider using a longer password (20+ chars) to maintain security.
        </p>
      </SecurityNotice>

      <section className="mb-8 mt-8 border-t border-[var(--border)] pt-8">
        <h2 className="mb-4 text-lg font-semibold">Other Password Types</h2>
        <div className="flex flex-wrap gap-2">
          {relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:border-[var(--accent)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </PasswordLengthClient>
  )
}
