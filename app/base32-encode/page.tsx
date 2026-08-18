import type { Metadata } from 'next'
import Base32EncodePageClient from './Base32EncodePageClient'

export const metadata: Metadata = {
  title: 'Base32 Encoder - Convert Text to Base32 Encoding Online',
  description: 'Free online Base32 encoder tool. Convert text, URLs, and data to Base32 encoding instantly. Supports RFC 4648 standard with padding options.',
  keywords: 'base32 encode, base32 encoder, base32 encoding, text to base32, url encoding, rfc 4648, base32 converter, online encoder',
  openGraph: {
    title: 'Base32 Encoder - Convert Text to Base32 Encoding',
    description: 'Free online Base32 encoder. Convert text and data to Base32 format with RFC 4648 standard compliance and instant results.',
    type: 'website',
    url: 'https://randomkeygen.com/base32-encode',
  },
  twitter: {
    title: 'Base32 Encoder - Convert Text to Base32 Encoding',
    description: 'Free online Base32 encoder. Convert text and data to Base32 format with RFC 4648 standard compliance and instant results.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/base32-encode',
  },
}

export default function Base32EncodePage() {
  return <Base32EncodePageClient />
}