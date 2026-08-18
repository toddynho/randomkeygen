import type { Metadata } from 'next'
import Link from 'next/link'
import PasswordLengthClient from '@/app/components/password/PasswordLengthClient'

export const metadata: Metadata = {
  title: 'Letters Only Password Generator - Alphabetic Passwords | RandomKeygen',
  description: 'Generate secure passwords using only letters (A-Z, a-z). No numbers or symbols. Perfect for systems with strict alphabetic-only requirements.',
  keywords: ['letters only password', 'alphabetic password', 'no numbers password', 'password letters only', 'alpha password generator'],
  openGraph: {
    title: 'Letters Only Password Generator',
    description: 'Generate secure passwords using only letters - no numbers or symbols.',
    url: 'https://randomkeygen.com/password-generator/letters-only',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/password-generator/letters-only',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Letters Only', url: '/password-generator/letters-only' },
]

const relatedLinks = [
  { href: '/password', label: 'Full Character Set' },
  { href: '/password-generator/no-special-characters', label: 'Alphanumeric' },
  { href: '/password-generator/numbers-only', label: 'Numbers Only' },
  { href: '/pronounceable-password', label: 'Pronounceable' },
]

export default function LettersOnlyPage() {
  return (
    <PasswordLengthClient
      title="Letters Only Password Generator"
      description="Generate passwords using only alphabetic characters. No numbers or symbols - just letters from A to Z."
      breadcrumbItems={breadcrumbItems}
      lengthRange={{ min: 8, max: 64, initial: 20 }}
      charsetOptions={['lowercase', 'uppercase']}
      csvFilename="passwords-letters-only.csv"
    >
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
