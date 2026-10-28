import type { Metadata } from 'next'
import TOTPGeneratorClient from './TOTPGeneratorClient'
import { totpFaqs } from './content'

export const metadata: Metadata = {
  title: 'TOTP Generator - Codes, QR and otpauth | RandomKeygen',
  description: 'TOTP generator for Google Authenticator, Authy, and other authenticator apps. Create a Base32 secret, scan a QR code, and copy the otpauth URI. Codes stay in your browser.',
  keywords: ['totp generator', '2fa generator', 'two factor authentication', 'google authenticator', 'authy', 'otpauth', 'otp generator', 'time based otp'],
  openGraph: {
    title: 'TOTP Generator - Codes, QR and otpauth',
    description: 'Generate a TOTP secret, QR code, and otpauth URI, and read the current 6-digit code in your browser.',
    url: 'https://randomkeygen.com/totp-generator',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/totp-generator',
  },
}

// JSON-LD structured data for TOTP Generator
const totpAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TOTP Generator',
  alternateName: 'Time-based One-Time Password Generator',
  description: 'Generate RFC 6238 compliant TOTP codes for two-factor authentication. Compatible with Google Authenticator, Authy, and other authenticator apps.',
  url: 'https://randomkeygen.com/totp-generator',
  applicationCategory: 'SecurityApplication',
  applicationSubCategory: 'Two-Factor Authentication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  isPartOf: {
    '@type': 'WebSite',
    name: 'RandomKeygen',
    url: 'https://randomkeygen.com'
  },
  featureList: [
    'RFC 6238 compliant TOTP generation',
    'Google Authenticator compatibility',
    'Authy compatibility', 
    'Custom time periods (15, 30, 60 seconds)',
    'SHA-1, SHA-256, SHA-512 support',
    'QR code generation for easy setup',
    'Client-side generation - no secrets sent to server'
  ],
  keywords: [
    'totp generator',
    '2fa generator', 
    'two factor authentication',
    'google authenticator',
    'authy',
    'otp generator',
    'time based otp',
    'authenticator codes',
    'rfc 6238',
    'totp secret'
  ]
}

const totpFAQSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: totpFaqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

export default function TOTPGeneratorPage() {
  return <TOTPGeneratorClient schema={[totpAppSchema, totpFAQSchema]} />
}
