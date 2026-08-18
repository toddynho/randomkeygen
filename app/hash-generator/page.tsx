import type { Metadata } from 'next'
import HashGeneratorPageClient from './HashGeneratorPageClient'

export const metadata: Metadata = {
  title: 'Hash Generator - MD5, SHA256, SHA512, bcrypt Online | RandomKeygen',
  description: 'Free online hash generator. Create MD5, SHA-1, SHA-256, SHA-512, and bcrypt hashes instantly. Perfect for password hashing, checksums, and data integrity verification.',
  keywords: ['hash generator', 'md5 generator', 'sha256 generator', 'sha512 generator', 'bcrypt generator', 'password hash generator', 'online hash', 'hash calculator'],
  openGraph: {
    title: 'Hash Generator - MD5, SHA256, SHA512, bcrypt',
    description: 'Generate MD5, SHA-256, SHA-512, and bcrypt hashes online.',
    url: 'https://randomkeygen.com/hash-generator',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/hash-generator',
  },
}

export default function HashGeneratorPage() {
  return <HashGeneratorPageClient />
}
