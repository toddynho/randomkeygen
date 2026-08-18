import type { Metadata } from 'next'
import DjangoSecretKeyPageClient from './DjangoSecretKeyPageClient'

export const metadata: Metadata = {
  title: 'Django SECRET_KEY Generator - Production-Ready Keys',
  description: 'Generate production-ready Django SECRET_KEY values with proper entropy. Compatible with all Django versions. Includes code examples for settings.py and environment variables.',
  keywords: ['Django SECRET_KEY', 'Django secret key generator', 'Django security', 'Django settings', 'Python secret key'],
  openGraph: {
    title: 'Django SECRET_KEY Generator - Secure Django Keys',
    description: 'Generate secure SECRET_KEY values for Django projects.',
    url: 'https://randomkeygen.com/django-secret-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/django-secret-key',
  },
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Django SECRET_KEY Generator',
  description: 'Generate production-ready Django SECRET_KEY values with proper entropy. Compatible with all Django versions.',
  url: 'https://randomkeygen.com/django-secret-key',
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
  downloadUrl: 'https://randomkeygen.com/django-secret-key',
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
    url: 'https://randomkeygen.com/django-secret-key',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'Django SECRET_KEY Generator', url: '/django-secret-key' },
]

export default function DjangoSecretKeyPage() {
  return (
    <DjangoSecretKeyPageClient
      breadcrumbItems={breadcrumbItems}
      schema={[softwareApplicationSchema]}
    />
  )
}
