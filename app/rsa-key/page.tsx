import type { Metadata } from 'next'
import RsaKeyPageClient from './RsaKeyPageClient'

export const metadata: Metadata = {
  title: 'RSA Key Generator - Generate RSA Key Pairs Online | RandomKeygen',
  description: 'Free RSA key pair generator. Generate secure RSA public and private keys for encryption, digital signatures, and authentication. Supports 2048 and 4096 bit keys.',
  keywords: ['rsa key generator', 'rsa key pair', 'generate rsa key', 'rsa public key', 'rsa private key', 'asymmetric encryption', 'public key cryptography'],
  openGraph: {
    title: 'RSA Key Generator - Generate RSA Key Pairs',
    description: 'Generate secure RSA public and private key pairs for encryption and signing.',
    url: 'https://randomkeygen.com/rsa-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/rsa-key',
  },
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'RSA Key Generator',
  description:
    'Free RSA key pair generator. Generate secure RSA public and private keys for encryption, digital signatures, and authentication.',
  url: 'https://randomkeygen.com/rsa-key',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'RSA Key Generator', url: '/rsa-key' },
]

export default function RsaKeyPage() {
  return (
    <RsaKeyPageClient
      breadcrumbItems={breadcrumbItems}
      schema={[softwareApplicationSchema]}
    />
  )
}
