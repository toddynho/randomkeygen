import type { Metadata } from 'next'
import { CategoryIndexPage } from '../components/CategoryIndexPage'

export const metadata: Metadata = {
  title: 'Encryption Key Generators - AES, RSA, Salts & Hashing | RandomKeygen',
  description:
    'Every RandomKeygen encryption tool in one place: AES keys, RSA key pairs, HMAC secrets, salts, and hashing utilities. Generated locally with the Web Crypto API, never transmitted.',
  alternates: { canonical: 'https://randomkeygen.com/encryption' },
}

export default function EncryptionIndexPage() {
  return <CategoryIndexPage slug="encryption" />
}
