import type { Metadata } from 'next'
import SaltPageClient from './SaltPageClient'

export const metadata: Metadata = {
  title: 'Salt Generator - Cryptographic Salts for Hashing | RandomKeygen',
  description: 'Generate cryptographically random salt values for password hashing and other security operations. Prevents rainbow table attacks.',
  keywords: ['salt generator', 'cryptographic salt', 'password salt', 'hash salt', 'random salt', 'bcrypt salt'],
  openGraph: {
    title: 'Salt Generator - Cryptographic Salts for Hashing',
    description: 'Generate cryptographically random salt values for password hashing.',
    url: 'https://randomkeygen.com/salt',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/salt',
  },
}

export default function SaltPage() {
  return <SaltPageClient />
}
