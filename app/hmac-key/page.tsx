import type { Metadata } from 'next'
import HmacKeyPageClient from './HmacKeyPageClient'

export const metadata: Metadata = {
  title: 'HMAC Key Generator - SHA-256/384/512 Secrets | RandomKeygen',
  description: 'Generate secure HMAC secrets for message authentication. Supports HMAC-SHA256, HMAC-SHA384, and HMAC-SHA512 with proper key lengths.',
  keywords: ['HMAC key generator', 'HMAC secret', 'SHA-256', 'message authentication', 'MAC key', 'webhook secret'],
  openGraph: {
    title: 'HMAC Key Generator - SHA-256/384/512 Secrets',
    description: 'Generate secure HMAC secrets for message authentication.',
    url: 'https://randomkeygen.com/hmac-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/hmac-key',
  },
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'HMAC Key Generator',
  description: 'Generate secure HMAC secrets for message authentication. Supports HMAC-SHA256, HMAC-SHA384, and HMAC-SHA512 with proper key lengths.',
  url: 'https://randomkeygen.com/hmac-key',
  applicationCategory: 'DeveloperApplication',
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
  downloadUrl: 'https://randomkeygen.com/hmac-key',
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
    url: 'https://randomkeygen.com/hmac-key',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'HMAC Key Generator', url: '/hmac-key' },
]

export default function HmacKeyPage() {
  return (
    <HmacKeyPageClient
      breadcrumbItems={breadcrumbItems}
      schema={[softwareApplicationSchema]}
    />
  )
}
