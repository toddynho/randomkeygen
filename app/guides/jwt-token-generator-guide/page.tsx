import type { Metadata } from 'next'
import JwtTokenGeneratorGuideClient from './JwtTokenGeneratorGuideClient'

export const metadata: Metadata = {
  title: 'JWT Token Generator Complete Guide - Create & Validate JWT Tokens',
  description: 'Complete guide to generating JWT tokens securely. Learn JWT structure, algorithms, best practices, and common pitfalls with practical examples.',
  keywords: 'jwt token generator, jwt generator, json web token, jwt create, jwt validation, jwt security, jwt guide, jwt tutorial',
  openGraph: {
    title: 'JWT Token Generator Complete Guide',
    description: 'Master JWT token generation with this comprehensive developer guide. Learn structure, algorithms, security best practices.',
    type: 'article',
    url: 'https://randomkeygen.com/guides/jwt-token-generator-guide',
  },
  twitter: {
    title: 'JWT Token Generator Complete Guide',
    description: 'Master JWT token generation with this comprehensive developer guide. Learn structure, algorithms, security best practices.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/jwt-token-generator-guide',
  },
}

export default function JwtTokenGeneratorGuidePage() {
  return <JwtTokenGeneratorGuideClient />
}