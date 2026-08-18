import type { Metadata } from 'next'
import OauthTokenPageClient from './OauthTokenPageClient'

export const metadata: Metadata = {
  title: 'OAuth Token Generator - Access Tokens, Refresh Tokens & Client Secrets',
  description: 'Generate OAuth 2.0 tokens with interactive playground. Create access tokens, refresh tokens, client secrets with 4-step authorization flow examples, security checklist, and framework implementations.',
  keywords: ['oauth token generator', 'oauth access token', 'oauth refresh token', 'client secret generator', 'oauth 2.0', 'API token', 'bearer token'],
  openGraph: {
    title: 'OAuth Token Generator - Free & Secure with Implementation Guide',
    description: 'Generate OAuth 2.0 tokens with complete implementation examples and security best practices.',
    url: 'https://randomkeygen.com/oauth-token',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/oauth-token',
  },
}

// HowTo Schema for OAuth token generation
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Generate OAuth 2.0 Tokens',
  description: 'Step-by-step guide to generate secure OAuth 2.0 access tokens, refresh tokens, and client secrets for API authentication.',
  totalTime: 'PT3M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0'
  },
  supply: [
    {
      '@type': 'HowToSupply',
      name: 'Web Browser'
    }
  ],
  tool: [
    {
      '@type': 'HowToTool',
      name: 'RandomKeygen OAuth Token Generator'
    }
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Choose Token Type',
      text: 'Select the OAuth token type you need: access token, refresh token, or client secret.'
    },
    {
      '@type': 'HowToStep',
      name: 'Configure Token Parameters',
      text: 'Set token length, expiration, and scope requirements based on your OAuth flow.'
    },
    {
      '@type': 'HowToStep',
      name: 'Generate Secure Tokens',
      text: 'Click generate to create cryptographically secure tokens with proper entropy.'
    },
    {
      '@type': 'HowToStep',
      name: 'Implement in OAuth Flow',
      text: 'Use the tokens in your OAuth 2.0 authorization flow with proper validation and expiry.'
    }
  ]
}

// SoftwareApplication schema for OAuth generator
const oauthAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'OAuth Token Generator',
  alternateName: 'OAuth 2.0 Token Generator',
  description: 'Generate secure OAuth 2.0 tokens including access tokens, refresh tokens, and client secrets. Complete with implementation guides and security best practices.',
  url: 'https://randomkeygen.com/oauth-token',
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'API Security Tool',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  isPartOf: {
    '@type': 'WebSite',
    name: 'RandomKeygen',
    url: 'https://randomkeygen.com'
  },
  featureList: [
    'OAuth 2.0 access token generation',
    'Refresh token generation',
    'Client secret generation',
    'Authorization code generation',
    'Configurable token length and format',
    'Scope and audience configuration',
    'Interactive OAuth playground',
    'Implementation examples for major frameworks'
  ],
  keywords: [
    'oauth token generator',
    'oauth access token',
    'oauth refresh token',
    'client secret',
    'oauth 2.0',
    'API authentication',
    'bearer token'
  ]
}

// FAQ Schema for OAuth generator
const oauthFAQSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are OAuth 2.0 tokens?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'OAuth 2.0 tokens are secure credentials used for API authentication and authorization. Access tokens grant temporary access to resources, refresh tokens allow obtaining new access tokens, and client secrets authenticate applications in the OAuth flow.'
      }
    },
    {
      '@type': 'Question',
      name: 'How long should OAuth tokens be?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Access tokens should be 32-64 characters, refresh tokens 64-128 characters, and client secrets at least 32 characters. Use sufficient entropy and avoid predictable patterns for security.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is it secure to generate OAuth tokens online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our OAuth token generator runs entirely in your browser using cryptographically secure random generation. No tokens are sent to servers. For production systems, consider generating tokens on your secure infrastructure.'
      }
    },
    {
      '@type': 'Question',
      name: 'What\'s the difference between access and refresh tokens?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Access tokens are short-lived credentials (minutes to hours) that grant access to protected resources. Refresh tokens are long-lived (days to months) and are used to obtain new access tokens when they expire, reducing the need for repeated user authentication.'
      }
    }
  ]
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'OAuth Token Generator', url: '/oauth-token' }
]

// Visible "How to use" cards reuse the exact HowTo schema copy above.
const howToSteps = howToSchema.step.map((step) => ({
  title: step.name,
  body: step.text,
}))

export default function OauthTokenPage() {
  return (
    <OauthTokenPageClient
      breadcrumbItems={breadcrumbItems}
      schema={[howToSchema, oauthAppSchema, oauthFAQSchema]}
      howToSteps={howToSteps}
      howToHeading="How to Generate OAuth 2.0 Tokens"
    />
  )
}
