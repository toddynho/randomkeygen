import type { Metadata } from 'next'
import EncryptionKeyPageClient from './EncryptionKeyPageClient'

export const metadata: Metadata = {
  title: 'Encryption Key Generator - AES Keys & IVs | RandomKeygen',
  description: 'Generate cryptographically secure encryption keys for AES-128, AES-192, and AES-256. Includes initialization vectors (IVs) for CBC and GCM modes.',
  keywords: ['encryption key generator', 'AES key', 'AES-256', 'initialization vector', 'IV generator', 'symmetric encryption'],
  openGraph: {
    title: 'Encryption Key Generator - AES Keys & IVs',
    description: 'Generate cryptographically secure encryption keys for AES encryption.',
    url: 'https://randomkeygen.com/encryption-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/encryption-key',
  },
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Encryption Key Generator',
  description: 'Generate cryptographically secure encryption keys for AES-128, AES-192, and AES-256. Includes initialization vectors (IVs) for CBC and GCM modes.',
  url: 'https://randomkeygen.com/encryption-key',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  softwareVersion: '1.0',
  author: {
    '@type': 'Organization',
    name: 'RandomKeygen',
  },
  publisher: {
    '@type': 'Organization',
    name: 'RandomKeygen',
  },
  downloadUrl: 'https://randomkeygen.com/encryption-key',
  featureList: [
    'Cryptographically secure generation',
    'Client-side processing',
    'No data storage',
    'Open source',
    'Free to use',
  ],
  requirements: 'Web browser with JavaScript enabled',
  softwareHelp: {
    '@type': 'CreativeWork',
    url: 'https://randomkeygen.com/encryption-key',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'Encryption Key Generator', url: '/encryption-key' },
]

export default function EncryptionKeyPage() {
  return (
    <EncryptionKeyPageClient
      breadcrumbItems={breadcrumbItems}
      schema={[softwareApplicationSchema]}
    />
  )
}
