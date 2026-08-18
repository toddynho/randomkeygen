import type { Metadata } from 'next'
import BcryptGeneratorClient from './BcryptGeneratorClient'

export const metadata: Metadata = {
  title: 'Bcrypt Hash Generator - Hash Passwords with Salt | RandomKeygen',
  description: 'Generate secure bcrypt password hashes with configurable cost factors. Free online bcrypt generator for developers and secure password storage.',
  keywords: ['bcrypt generator', 'bcrypt hash generator', 'password hashing', 'bcrypt online', 'password hash', 'bcrypt cost', 'secure password storage', 'salt hash'],
  openGraph: {
    title: 'Bcrypt Hash Generator - Secure Password Hashing',
    description: 'Generate secure bcrypt password hashes with configurable cost factors.',
    url: 'https://randomkeygen.com/bcrypt-generator',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/bcrypt-generator',
  },
}

export default function BcryptGeneratorPage() {
  return <BcryptGeneratorClient />
}