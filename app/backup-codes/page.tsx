import type { Metadata } from 'next'
import BackupCodesClient from './BackupCodesClient'

export const metadata: Metadata = {
  title: 'Backup Codes Generator - 2FA Recovery Codes | RandomKeygen',
  description: 'Generate secure backup codes for two-factor authentication recovery. Like Google and GitHub style 2FA backup codes for account recovery.',
  keywords: ['backup codes', '2fa recovery codes', 'two factor backup', 'recovery codes generator', 'google backup codes'],
  openGraph: {
    title: 'Backup Codes Generator - 2FA Recovery',
    description: 'Generate secure backup codes for two-factor authentication recovery.',
    url: 'https://randomkeygen.com/backup-codes',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/backup-codes',
  },
}

// JSON-LD structured data for Backup Codes Generator
const backupCodesAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Backup Codes Generator',
  alternateName: '2FA Recovery Codes Generator',
  description: 'Generate secure backup codes for two-factor authentication recovery. Create Google and GitHub style 2FA backup codes for account recovery.',
  url: 'https://randomkeygen.com/backup-codes',
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
    'Generate 8-16 backup recovery codes',
    'Google Authenticator style codes', 
    'GitHub style backup codes',
    'Cryptographically secure generation',
    'Print-friendly format',
    'Copy all codes to clipboard',
    'Client-side generation - no storage'
  ],
  keywords: [
    'backup codes',
    '2fa recovery codes',
    'two factor backup',
    'recovery codes generator',
    'google backup codes',
    'github backup codes',
    'authenticator backup',
    '2fa recovery'
  ]
}

const backupCodesFAQSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are 2FA backup codes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Backup codes are single-use recovery codes that allow you to access your account if you lose your primary 2FA device. Each code can only be used once and should be stored securely.'
      }
    },
    {
      '@type': 'Question',
      name: 'How should I store my backup codes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Store backup codes in a secure location like a password manager, encrypted file, or printed copy in a safe place. Never share them or store them in plain text online.'
      }
    },
    {
      '@type': 'Question',
      name: 'How many backup codes should I generate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most services provide 8-16 backup codes. This generator allows you to create 8, 12, or 16 codes depending on your needs and the service requirements.'
      }
    }
  ]
}

export default function BackupCodesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(backupCodesAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(backupCodesFAQSchema) }}
      />
      <BackupCodesClient />
    </>
  )
}
