import type { Metadata } from 'next'
import TOTPGeneratorClient from './TOTPGeneratorClient'

export const metadata: Metadata = {
  title: 'TOTP Code Generator - Calculate Current 2FA Codes | RandomKeygen',
  description: 'Enter or create a Base32 secret to calculate the current 6-digit TOTP code in your browser. Includes a countdown and otpauth QR setup for authenticator apps.',
  keywords: ['totp generator', '2fa generator', 'two factor authentication', 'google authenticator', 'authy', 'otp generator', 'time based otp', 'authenticator codes'],
  openGraph: {
    title: 'TOTP Code Generator - Calculate Current 2FA Codes',
    description: 'Calculate current 6-digit TOTP codes from a Base32 secret in your browser.',
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
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is TOTP and how does it work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TOTP (Time-based One-Time Password) is a secure two-factor authentication method that generates unique 6-digit codes every 30 seconds using a shared secret key. It\'s based on RFC 6238 and provides time-synchronized authentication between your device and the service.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is this TOTP generator compatible with Google Authenticator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, our TOTP generator is fully compatible with Google Authenticator, Authy, Microsoft Authenticator, and any other RFC 6238 compliant authenticator app. The generated QR codes can be scanned directly by these apps.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is it safe to generate TOTP codes online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our TOTP generator runs entirely in your browser using cryptographically secure random number generation. No secret keys or generated codes are sent to our servers. For maximum security in production, generate TOTP secrets locally or use hardware tokens.'
      }
    },
    {
      '@type': 'Question',
      name: 'How long are TOTP codes valid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard TOTP codes are valid for 30 seconds by default, though this can be configured to 15 or 60 seconds depending on your security requirements. The time window ensures codes expire quickly to maintain security.'
      }
    }
  ]
}

export default function TOTPGeneratorPage() {
  return <TOTPGeneratorClient schema={[totpAppSchema, totpFAQSchema]} />
}
