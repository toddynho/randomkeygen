import type { Metadata } from 'next'
import VapidKeyPageClient from './VapidKeyPageClient'

export const metadata: Metadata = {
  title: 'VAPID Key Generator - Generate Web Push Keys | RandomKeygen',
  description: 'Free VAPID key generator for Web Push notifications. Generate ECDSA P-256 public and private key pairs for the Voluntary Application Server Identification protocol.',
  keywords: ['vapid key generator', 'web push keys', 'push notification keys', 'applicationServerKey', 'ECDSA P-256', 'service worker push'],
  openGraph: {
    title: 'VAPID Key Generator - Generate Web Push Keys',
    description: 'Generate VAPID key pairs for Web Push notifications.',
    url: 'https://randomkeygen.com/vapid-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/vapid-key',
  },
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VAPID Key Generator',
  description:
    'Free VAPID key generator for Web Push notifications. Generate ECDSA P-256 public and private key pairs for the Voluntary Application Server Identification protocol.',
  url: 'https://randomkeygen.com/vapid-key',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'VAPID Key Generator', url: '/vapid-key' },
]

export default function VapidKeyPage() {
  return (
    <VapidKeyPageClient
      breadcrumbItems={breadcrumbItems}
      schema={[softwareApplicationSchema]}
    />
  )
}
