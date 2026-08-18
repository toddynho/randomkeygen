import type { Metadata } from 'next'
import ApiKeyPageClient from './ApiKeyPageClient'
import { developerRelated } from '../components'

export const metadata: Metadata = {
  title: 'API Key Generator - Custom Prefixes & Lengths | RandomKeygen',
  description: 'Generate secure API keys for REST, GraphQL, OAuth, and custom applications. Choose a prefix, length, permissions, version, and rate-limit preset.',
  keywords: ['API key generator', 'API key permissions', 'API token with scopes', 'rate limited API keys', 'secret key', 'sk_live', 'authentication token', 'API access control'],
  openGraph: {
    title: 'API Key Generator - Custom Prefixes & Lengths',
    description: 'Generate secure API keys for REST, GraphQL, OAuth, and custom applications with configurable prefixes and lengths.',
    url: 'https://randomkeygen.com/api-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/api-key',
  },
}

// API Key Generator Tool Schema
const apiKeyToolSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'API Key Generator',
  alternateName: 'API Token Generator',
  description: 'Generate random API credential strings for applications you control, with customizable prefixes, lengths, permission examples, versions, and rate-limit presets.',
  url: 'https://randomkeygen.com/api-key',
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
    'REST, GraphQL, and OAuth prefix presets',
    'Stripe-style prefix options (sk_live, sk_test, pk_live)',
    'GitHub-style ghp_ prefix option',
    'AWS-style AKIA prefix option',
    'Custom prefix support',
    'Configurable key length',
    'Permission and scope configuration examples',
    'API version and rate-limit presets',
    'One-click copy to clipboard',
    'Client-side generation - no server storage'
  ],
  keywords: [
    'API key generator',
    'API token generator', 
    'secret key generator',
    'authentication token',
    'stripe api key',
    'github token',
    'openai api key',
    'aws access key',
    'secure token generator'
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  }
}

// HowTo Schema for API key generation
const apiKeyHowToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Generate Secure API Keys',
  description: 'Step-by-step guide to generate a random API credential string for an application you control.',
  totalTime: 'PT1M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0'
  },
  step: [
    {
      '@type': 'HowToStep',
      name: 'Choose API Key Format',
      text: 'Choose a REST, GraphQL, OAuth, platform-style, or custom prefix for your API credential.'
    },
    {
      '@type': 'HowToStep', 
      name: 'Configure Key Settings',
      text: 'Adjust the key length and encoding options (Base64 or hex) based on your security requirements.'
    },
    {
      '@type': 'HowToStep',
      name: 'Generate API Key',
      text: 'Click the generate button to create a cryptographically secure random API key using your browser\'s Web Crypto API.'
    },
    {
      '@type': 'HowToStep',
      name: 'Copy and Store Securely',
      text: 'Copy the generated API key and store it securely in your environment variables or key management system. Never expose API keys in client-side code.'
    }
  ]
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'API Key Generator', url: '/api-key' }
]

// Visible "How to use" cards reuse the exact HowTo schema copy above.
const howToSteps = apiKeyHowToSchema.step.map((step) => ({
  title: step.name,
  body: step.text,
}))

export default function ApiKeyPage() {
  return (
    <ApiKeyPageClient
      breadcrumbItems={breadcrumbItems}
      schema={[apiKeyToolSchema, apiKeyHowToSchema]}
      relatedContent={developerRelated}
      howToSteps={howToSteps}
      howToHeading="How to Generate Secure API Keys"
    />
  )
}
