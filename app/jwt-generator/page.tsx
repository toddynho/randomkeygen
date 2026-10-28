import type { Metadata } from 'next'
import JwtGeneratorClient from './JwtGeneratorClient'
import { jwtFaqs } from './content'

export const metadata: Metadata = {
  title: 'JWT Token Generator - Sign and Inspect HS256 and RS256 | RandomKeygen',
  description: 'JWT token generator that encodes, decodes, and verifies JSON Web Tokens in your browser. Edit header and payload JSON, sign with HS256 or RS256, and copy the token. Secrets never leave this device.',
  keywords: ['jwt token generator', 'jwt generator', 'json web token', 'jwt decode', 'jwt debugger', 'HS256', 'RS256', 'sign jwt online'],
  openGraph: {
    title: 'JWT Token Generator - Sign and Inspect HS256 and RS256',
    description: 'Encode, decode, and verify JSON Web Tokens in your browser. Secrets stay on this device.',
    url: 'https://randomkeygen.com/jwt-generator',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/jwt-generator',
  },
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JWT Token Generator',
  description: 'Encode, decode, and verify JSON Web Tokens in the browser. Supports HMAC (HS256, HS384, HS512) and RS256. Secrets and private keys never leave the device.',
  url: 'https://randomkeygen.com/jwt-generator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  isAccessibleForFree: true,
  browserRequirements: 'Requires JavaScript and the Web Crypto API',
  featureList: [
    'HS256, HS384, and HS512 signing',
    'RS256 signing with an in-browser RSA key pair',
    'Decode header and payload',
    'Verify HMAC and RS256 signatures',
    'Client-side only — secrets are not uploaded',
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: jwtFaqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'JWT Token Generator', url: '/jwt-generator' },
]

export default function JwtGeneratorPage() {
  return (
    <JwtGeneratorClient
      breadcrumbItems={breadcrumbItems}
      schema={[softwareApplicationSchema, faqSchema]}
    />
  )
}
