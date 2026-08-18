import type { Metadata } from 'next'
import TOTPAuthenticatorClient from './TOTPAuthenticatorClient'

export const metadata: Metadata = {
  title: 'TOTP Authenticator Generator - 2FA QR Code & Secret Key | RandomKeygen',
  description: 'Generate TOTP authenticator secrets with QR codes for Google Authenticator, Authy, and other 2FA apps. Complete two-factor authentication setup tool.',
  keywords: ['totp authenticator generator', '2fa qr code generator', 'google authenticator setup', 'totp generator', 'authenticator app setup', 'two factor authentication', 'otp generator', '2fa secret key'],
  openGraph: {
    title: 'TOTP Authenticator Generator - 2FA QR Code & Secret',
    description: 'Generate TOTP authenticator secrets with QR codes for 2FA apps.',
    url: 'https://randomkeygen.com/totp-authenticator',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/totp-authenticator',
  },
}

// JSON-LD structured data for TOTP Authenticator Generator
const totpAuthenticatorAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TOTP Authenticator Generator',
  alternateName: '2FA QR Code Generator',
  description: 'Generate TOTP authenticator secrets with QR codes for Google Authenticator, Authy, and other 2FA apps. Complete setup tool for two-factor authentication.',
  url: 'https://randomkeygen.com/totp-authenticator',
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
    'Generate TOTP secret keys',
    'Create QR codes for easy scanning',
    'Google Authenticator compatible',
    'Authy app compatible',
    'Microsoft Authenticator compatible',
    'Custom service name and account settings',
    'RFC 6238 compliant generation',
    'Real-time TOTP code preview'
  ],
  keywords: [
    'totp authenticator generator',
    '2fa qr code generator',
    'google authenticator setup',
    'totp generator',
    'authenticator app setup',
    'two factor authentication',
    'otp generator',
    '2fa secret key',
    'authenticator qr code'
  ]
}

const totpAuthenticatorHowToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Set Up TOTP Authenticator',
  description: 'Complete guide to setting up two-factor authentication with authenticator apps',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Generate TOTP secret',
      text: 'Enter your service name and account details, then generate a secure TOTP secret key',
      url: 'https://randomkeygen.com/totp-authenticator#generate'
    },
    {
      '@type': 'HowToStep',
      name: 'Scan QR code',
      text: 'Open your authenticator app (Google Authenticator, Authy, etc.) and scan the generated QR code',
      url: 'https://randomkeygen.com/totp-authenticator#qr'
    },
    {
      '@type': 'HowToStep',
      name: 'Verify setup',
      text: 'Enter the 6-digit code from your authenticator app to verify the setup works correctly',
      url: 'https://randomkeygen.com/totp-authenticator#verify'
    },
    {
      '@type': 'HowToStep',
      name: 'Save backup secret',
      text: 'Store the secret key securely as a backup in case you lose access to your authenticator device',
      url: 'https://randomkeygen.com/totp-authenticator#backup'
    }
  ],
  totalTime: 'PT3M',
  supply: [
    {
      '@type': 'HowToSupply',
      name: 'Authenticator app (Google Authenticator, Authy, Microsoft Authenticator)'
    },
    {
      '@type': 'HowToSupply',
      name: 'Smartphone or device with camera for QR scanning'
    }
  ],
  tool: [
    {
      '@type': 'HowToTool',
      name: 'Web browser with JavaScript enabled'
    }
  ]
}

export default function TOTPAuthenticatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(totpAuthenticatorAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(totpAuthenticatorHowToSchema) }}
      />
      <TOTPAuthenticatorClient />
    </>
  )
}