import type { Metadata } from 'next'
import SecretKeyPageClient from './SecretKeyPageClient'

export const metadata: Metadata = {
  title: 'Secret Key Generator - Secure Random Secrets | RandomKeygen',
  description: 'Generate cryptographically secure secret keys for sessions, cookies, CSRF tokens, and other security applications. Base64, hex, and URL-safe formats.',
  keywords: ['secret key generator', 'session secret', 'cookie secret', 'CSRF secret', 'random secret', 'secure key'],
  openGraph: {
    title: 'Secret Key Generator - Secure Random Secrets',
    description: 'Generate cryptographically secure secret keys for web applications.',
    url: 'https://randomkeygen.com/secret-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/secret-key',
  },
}

export default function SecretKeyPage() {
  return <SecretKeyPageClient />
}
