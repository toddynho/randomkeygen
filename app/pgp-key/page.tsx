import type { Metadata } from 'next'
import PgpKeyPageClient from './PgpKeyPageClient'

export const metadata: Metadata = {
  title: 'PGP Key Generator - Create Secure OpenPGP Key Pairs for Email Encryption | RandomKeygen',
  description: 'Learn the OpenPGP key format with an interactive demo and set up real PGP/GPG keys for email encryption and digital signatures. Covers RSA and ECC algorithms, GPG commands, Thunderbird and Mailvelope setup.',
  keywords: ['pgp key generator', 'openpgp key generator', 'gpg key generator', 'email encryption keys', 'pgp key pair generator', 'gpg full generate key', 'secure email keys', 'gnu privacy guard keys', 'digital signature keys', 'pgp key format'],
  openGraph: {
    title: 'PGP Key Format Demo & GPG Setup',
    description: 'Explore the OpenPGP key format with a demo and learn to generate real PGP/GPG keys for email encryption and digital signatures.',
    url: 'https://randomkeygen.com/pgp-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/pgp-key',
  },
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PGP Key Format Demo & GPG Setup',
  description:
    'Interactive demo of the OpenPGP key format plus a complete GPG setup guide: generate real PGP keys locally, encrypt email, and manage revocation certificates.',
  url: 'https://randomkeygen.com/pgp-key',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'PGP Key Format Demo', url: '/pgp-key' },
]

export default function PgpKeyPage() {
  return (
    <PgpKeyPageClient
      breadcrumbItems={breadcrumbItems}
      schema={[softwareApplicationSchema]}
    />
  )
}
