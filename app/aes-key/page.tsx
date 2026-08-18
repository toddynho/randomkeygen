import type { Metadata } from 'next'
import AesKeyPageClient from './AesKeyPageClient'

export const metadata: Metadata = {
  title: 'AES Key Generator - 128/192/256-bit Keys | RandomKeygen',
  description: 'Generate secure AES encryption keys in 128-bit, 192-bit, and 256-bit sizes. Includes initialization vectors for CBC and GCM cipher modes.',
  keywords: ['AES key generator', 'AES-128', 'AES-256', 'symmetric key', 'encryption key', 'cipher key'],
  openGraph: {
    title: 'AES Key Generator - 128/192/256-bit Keys',
    description: 'Generate secure AES encryption keys with initialization vectors.',
    url: 'https://randomkeygen.com/aes-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/aes-key',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'AES Key Generator', url: '/aes-key' },
]

export default function AesKeyPage() {
  return <AesKeyPageClient breadcrumbItems={breadcrumbItems} />
}
