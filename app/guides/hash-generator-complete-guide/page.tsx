import type { Metadata } from 'next'
import HashGeneratorGuideClient from './HashGeneratorGuideClient'

export const metadata: Metadata = {
  title: 'Hash Generator Complete Guide - MD5, SHA256, SHA512, BCrypt & More',
  description: 'Complete guide to hash generators. Learn when to use MD5, SHA256, SHA512, BCrypt for passwords, data integrity, and cryptographic applications.',
  keywords: 'hash generator, md5 generator, sha256 generator, sha512 generator, bcrypt generator, hash function, cryptographic hash, data integrity',
  openGraph: {
    title: 'Hash Generator Complete Guide - All Hash Functions Explained',
    description: 'Master hash generators for security and data integrity. Complete guide covering MD5, SHA-2, SHA-3, BCrypt, and modern hash functions.',
    type: 'article',
    url: 'https://randomkeygen.com/guides/hash-generator-complete-guide',
  },
  twitter: {
    title: 'Hash Generator Complete Guide - All Hash Functions Explained',
    description: 'Master hash generators for security and data integrity. Complete guide covering MD5, SHA-2, SHA-3, BCrypt, and modern hash functions.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/hash-generator-complete-guide',
  },
}

export default function HashGeneratorGuidePage() {
  return <HashGeneratorGuideClient />
}