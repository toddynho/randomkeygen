import type { Metadata } from 'next'
import Aes256KeyPageClient from './Aes256KeyPageClient'
import { SoftwareApplicationStructuredData } from '../components/StructuredData'

export const metadata: Metadata = {
  title: 'AES-256 Key Generator - Create Secure 256-bit Encryption Keys Online | RandomKeygen',
  description: 'Generate cryptographically secure AES-256 encryption keys and initialization vectors instantly. Support for CBC, GCM, CTR cipher modes with hex, base64 output formats for symmetric encryption.',
  keywords: ['aes-256 key generator', 'aes 256 bit key generator', 'symmetric encryption key generator', 'aes encryption key online', 'initialization vector generator', 'iv generator hex', 'cipher key generator', 'aes key hex', 'aes-256 encryption tool', 'secure encryption keys'],
  openGraph: {
    title: 'AES-256 Key Generator - Create Secure 256-bit Encryption Keys Online',
    description: 'Generate cryptographically secure AES-256 encryption keys and initialization vectors with multiple output formats.',
    url: 'https://randomkeygen.com/aes-256-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/aes-256-key',
  },
}

export default function Aes256KeyPage() {
  return (
    <>
      <SoftwareApplicationStructuredData
        name="AES-256 Key Generator"
        description="Generate cryptographically secure AES-256 encryption keys and initialization vectors instantly. Support for CBC, GCM, CTR cipher modes with multiple output formats."
        url="https://randomkeygen.com/aes-256-key"
        applicationCategory="SecurityApplication"
        operatingSystem="Any"
      />
      {/* BreadcrumbList JSON-LD is emitted by GeneratorLayout's DetailSubnav */}
      <Aes256KeyPageClient />
    </>
  )
}