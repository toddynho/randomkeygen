import type { Metadata } from 'next'
import RandomStringPageClient from './RandomStringPageClient'

export const metadata: Metadata = {
  title: 'Random String Generator - Free, Any Length | RandomKeygen',
  description: 'Free random string generator: 8 to 256 characters, alphanumeric, numeric, hex, URL-safe or custom charset. Cryptographically secure, generated in your browser.',
  keywords: ['random string generator', 'random string', 'generate random string', 'alphanumeric generator', 'hex string generator', 'secure random'],
  openGraph: {
    title: 'Random String Generator - Free, Any Length',
    description: 'Free random string generator: 8 to 256 characters, alphanumeric, numeric, hex, URL-safe or custom charset. Cryptographically secure, generated in your browser.',
    url: 'https://randomkeygen.com/random-string',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/random-string',
  },
}

export default function RandomStringPage() {
  return <RandomStringPageClient />
}
