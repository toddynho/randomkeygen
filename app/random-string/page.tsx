import type { Metadata } from 'next'
import RandomStringPageClient from './RandomStringPageClient'

export const metadata: Metadata = {
  title: 'Random String Generator - Secure Custom Strings | RandomKeygen',
  description: 'Generate secure random strings from 8 to 256 characters. Choose alphanumeric, numeric, hexadecimal, URL-safe, or a custom character set.',
  keywords: ['random string generator', 'random string', 'generate random string', 'alphanumeric generator', 'hex string generator', 'secure random'],
  openGraph: {
    title: 'Random String Generator - Secure Custom Strings',
    description: 'Generate secure random strings with custom length and alphanumeric, numeric, hex, URL-safe, or custom character sets.',
    url: 'https://randomkeygen.com/random-string',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/random-string',
  },
}

export default function RandomStringPage() {
  return <RandomStringPageClient />
}
