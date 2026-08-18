import type { Metadata } from 'next'
import Link from 'next/link'
import PasswordLengthClient from '@/app/components/password/PasswordLengthClient'
import { SecurityNotice } from '@/app/components'
import { DIGITS } from '@/app/lib/crypto'

export const metadata: Metadata = {
  title: 'Numbers Only Password Generator - Numeric Passwords & PINs | RandomKeygen',
  description: 'Generate secure numeric-only passwords and PIN codes. Perfect for phone unlock codes, ATM PINs, and systems requiring digit-only passwords.',
  keywords: ['numbers only password', 'numeric password', 'pin generator', 'digits only password', 'number password generator'],
  openGraph: {
    title: 'Numbers Only Password Generator',
    description: 'Generate secure numeric passwords and PIN codes.',
    url: 'https://randomkeygen.com/password-generator/numbers-only',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/password-generator/numbers-only',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Numbers Only', url: '/password-generator/numbers-only' },
]

const relatedLinks = [
  { href: '/pin-generator', label: 'PIN Generator' },
  { href: '/password', label: 'Full Passwords' },
  { href: '/password-generator/no-special-characters', label: 'Alphanumeric' },
]

export default function NumbersOnlyPage() {
  return (
    <PasswordLengthClient
      title="Numbers Only Password Generator"
      description="Generate secure numeric passwords and PIN codes using only digits 0-9."
      breadcrumbItems={breadcrumbItems}
      lengthRange={{ min: 4, max: 32, initial: 8 }}
      quickLengths={[4, 6, 8, 10, 12]}
      lockedCharset={{ chars: DIGITS, poolLabel: '10-digit pool (0-9)' }}
      noun="codes"
      csvFilename="numeric-codes.csv"
    >
      <SecurityNotice type="warning" title="Numeric passwords have less entropy">
        <p>
          Each digit adds only about 3.3 bits of entropy, so numeric codes are far weaker
          than alphanumeric passwords of the same length. For high-security accounts, use
          longer numeric codes or switch to alphanumeric passwords. Numeric codes are best suited for:
        </p>
        <ul className="list-disc list-inside mt-2 text-sm">
          <li>Phone unlock PINs</li>
          <li>ATM/banking PINs</li>
          <li>Two-factor authentication codes</li>
          <li>Voicemail passwords</li>
        </ul>
      </SecurityNotice>

      <section className="mb-8 mt-8 border-t border-[var(--border)] pt-8">
        <h2 className="mb-4 text-lg font-semibold">Related Generators</h2>
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
