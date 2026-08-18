import type { Metadata } from 'next'
import WebauthnCredentialPageClient from './WebauthnCredentialPageClient'

export const metadata: Metadata = {
  title: 'Passwordless Authentication Generator - WebAuthn Biometric Keys & FIDO2 Passkeys | RandomKeygen',
  description: 'Generate WebAuthn credentials and biometric keys for passwordless authentication. Configure Touch ID, Face ID, fingerprint, and platform authenticators with FIDO2 passkeys.',
  keywords: ['passwordless authentication generator', 'biometric key generator', 'webauthn credential generator', 'fido2 passkey generator', 'passwordless login generator', 'touch id key generator', 'face id authentication', 'fingerprint key generator', 'biometric authentication setup', 'platform authenticator', 'passwordless security', 'webauthn passkey', 'credential id generator', 'windows hello key'],
  openGraph: {
    title: 'Biometric Key Generator - WebAuthn Credential & FIDO2 Passkey Tool',
    description: 'Generate biometric keys and WebAuthn credentials for Touch ID, Face ID, fingerprint authentication, and passwordless login with FIDO2 passkeys.',
    url: 'https://randomkeygen.com/webauthn-credential',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/webauthn-credential',
  },
}

// HowTo Schema for biometric key generation
const biometricKeyHowToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Generate Biometric Keys for WebAuthn Authentication',
  description: 'Step-by-step guide to generate secure biometric keys and WebAuthn credentials for Touch ID, Face ID, and fingerprint authentication.',
  totalTime: 'PT5M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0'
  },
  supply: [
    {
      '@type': 'HowToSupply',
      name: 'Device with biometric sensor (Touch ID, Face ID, fingerprint)'
    },
    {
      '@type': 'HowToSupply',
      name: 'Modern web browser with WebAuthn support'
    }
  ],
  tool: [
    {
      '@type': 'HowToTool',
      name: 'RandomKeygen Biometric Key Generator'
    }
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Configure Biometric Settings',
      text: 'Select your preferred biometric authentication type (Touch ID, Face ID, fingerprint) and platform authenticator settings.'
    },
    {
      '@type': 'HowToStep',
      name: 'Set User Verification Requirements',
      text: 'Choose whether to require biometric verification always, prefer it when available, or allow fallback methods.'
    },
    {
      '@type': 'HowToStep',
      name: 'Generate WebAuthn Credential',
      text: 'Create the biometric-enabled credential with proper key algorithms and security parameters.'
    },
    {
      '@type': 'HowToStep',
      name: 'Test Biometric Authentication',
      text: 'Verify the generated credential works with your device\'s biometric sensors and implements proper security measures.'
    }
  ]
}

// SoftwareApplication schema for biometric key generator
const biometricKeyAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Biometric Key Generator',
  alternateName: 'WebAuthn Credential Generator',
  description: 'Generate secure biometric keys and WebAuthn credentials for Touch ID, Face ID, fingerprint authentication, and passwordless login. Supports FIDO2 passkeys and platform authenticators.',
  url: 'https://randomkeygen.com/webauthn-credential',
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'Biometric Security Tool',
  operatingSystem: 'Any',
  browserRequirements: 'Requires WebAuthn support',
  isPartOf: {
    '@type': 'WebSite',
    name: 'RandomKeygen',
    url: 'https://randomkeygen.com'
  },
  featureList: [
    'Touch ID biometric key generation',
    'Face ID authentication setup',
    'Fingerprint key configuration',
    'Windows Hello integration',
    'FIDO2 passkey generation',
    'Platform authenticator configuration',
    'WebAuthn credential creation',
    'Biometric security implementation'
  ],
  keywords: [
    'biometric key generator',
    'touch id key generator',
    'face id authentication',
    'fingerprint key generator',
    'webauthn credential generator',
    'fido2 passkey generator',
    'platform authenticator',
    'biometric authentication'
  ]
}

// FAQ Schema for biometric authentication
const biometricFAQSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a biometric key generator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A biometric key generator creates secure cryptographic keys that work with biometric authentication methods like Touch ID, Face ID, and fingerprint sensors. These keys enable passwordless authentication using WebAuthn and FIDO2 standards.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which biometric authentication types are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our generator supports Touch ID (fingerprint), Face ID (facial recognition), Windows Hello (fingerprint, face, iris), Android biometric authentication, and other platform authenticators that comply with WebAuthn standards.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is biometric key generation secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, biometric keys are highly secure. Biometric data never leaves your device, keys are generated in secure hardware, and authentication uses proven cryptographic algorithms. The system includes liveness detection and anti-spoofing measures.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I use biometric keys for passwordless login?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! Biometric keys enable true passwordless authentication. Users can log in using just their fingerprint, face, or other biometric data, eliminating the need for passwords while maintaining high security.'
      }
    }
  ]
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'WebAuthn Credential Generator', url: '/webauthn-credential' }
]

export default function WebauthnCredentialPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(biometricKeyHowToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(biometricKeyAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(biometricFAQSchema) }}
      />
      <WebauthnCredentialPageClient breadcrumbItems={breadcrumbItems} />
    </>
  )
}
