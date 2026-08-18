import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found | RandomKeygen',
  robots: { index: false },
}

const DESTINATIONS = [
  { href: '/passwords', name: 'Password Generators', blurb: 'Strong passwords, passphrases & PINs' },
  { href: '/developer', name: 'Developer Generators', blurb: 'API keys, JWT secrets, UUIDs & tokens' },
  { href: '/encryption', name: 'Encryption Keys', blurb: 'AES, RSA, salts & hashing tools' },
  { href: '/guides', name: 'Security Guides', blurb: 'Best practices for keys & credentials' },
]

export default function NotFound() {
  return (
    <div className="page-container py-16">
      <div className="eyebrow mb-2.5 text-12 tracking-[0.1em]">404</div>
      <h1 className="mb-2.5 text-2xl font-bold tracking-[-0.01em] sm:text-31">Page not found</h1>
      <p className="mb-8 max-w-[60ch] text-16 leading-relaxed text-[var(--muted)]">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Everything still generates locally — try one
        of these instead, or head back to the{' '}
        <Link href="/" className="font-semibold text-[var(--accent-strong)] hover:text-[var(--accent)]">
          homepage
        </Link>
        .
      </p>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {DESTINATIONS.map((destination) => (
          <Link
            key={destination.href}
            href={destination.href}
            className="card-link"
          >
            <span className="card-title mb-0.5">
              {destination.name}
            </span>
            <span className="card-desc">{destination.blurb}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
