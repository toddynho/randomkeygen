import type { Metadata } from 'next'
import AiKeyGeneratorPageClient from './AiKeyGeneratorPageClient'

export const metadata: Metadata = {
  title: 'AI Key Generator - OpenAI, Anthropic, Google AI & Custom Formats | RandomKeygen',
  description: 'Generate secure AI API keys for OpenAI, Anthropic, Google AI, and custom AI providers. AI-specific formats, rate limiting presets, and key security best practices for developers.',
  keywords: ['ai key generator', 'openai api key generator', 'anthropic api key', 'google ai api key', 'ai api key format', 'generate ai api key', 'claude api key', 'gpt api key', 'ai authentication token'],
  openGraph: {
    title: 'AI Key Generator - OpenAI, Anthropic, Google AI & Custom Formats',
    description: 'Generate secure API keys for AI providers like OpenAI, Anthropic, and Google AI.',
    url: 'https://randomkeygen.com/ai-key-generator',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/ai-key-generator',
  },
}

// AI Key Generator Tool Schema
const aiKeyToolSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Key Generator',
  alternateName: ['AI API Key Generator', 'OpenAI Key Generator', 'Anthropic Key Generator'],
  description: 'Generate secure API keys specifically designed for AI providers like OpenAI, Anthropic, Google AI. Features provider-specific formats, usage limits simulation, and AI-focused security best practices.',
  url: 'https://randomkeygen.com/ai-key-generator',
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'AI Development Tool',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  isPartOf: {
    '@type': 'WebSite',
    name: 'RandomKeygen',
    url: 'https://randomkeygen.com'
  },
  featureList: [
    'OpenAI API key format (sk-...)',
    'Anthropic Claude API key format',
    'Google AI API key format (AIza...)',
    'Custom AI provider formats',
    'Rate limiting presets for AI APIs',
    'Usage limits simulator',
    'Key strength indicators for AI workloads',
    'AI-specific security recommendations',
    'Cost estimation integration',
    'Client-side generation - no server storage'
  ],
  keywords: [
    'ai key generator',
    'openai api key generator', 
    'anthropic api key',
    'claude api key',
    'gpt api key',
    'google ai api key',
    'ai authentication',
    'machine learning api key',
    'ai development tools'
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  }
}

// HowTo Schema for AI key generation
const aiKeyHowToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Generate AI API Keys for Machine Learning',
  description: 'Complete guide to generating secure API keys for AI providers like OpenAI, Anthropic, and Google AI with proper security practices.',
  totalTime: 'PT2M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0'
  },
  step: [
    {
      '@type': 'HowToStep',
      name: 'Choose AI Provider Format',
      text: 'Select your AI provider format from OpenAI (sk-...), Anthropic, Google AI (AIza...), or create a custom format for your AI service.'
    },
    {
      '@type': 'HowToStep', 
      name: 'Configure Security Settings',
      text: 'Set appropriate key length, rate limits, and usage restrictions based on your AI workload requirements and security policies.'
    },
    {
      '@type': 'HowToStep',
      name: 'Generate Secure AI Key',
      text: 'Click generate to create a cryptographically secure AI API key using your browser\'s Web Crypto API with AI-specific entropy requirements.'
    },
    {
      '@type': 'HowToStep',
      name: 'Implement AI Security Best Practices',
      text: 'Store your AI API key securely using environment variables, implement proper rate limiting, and monitor usage costs to prevent unexpected charges.'
    }
  ]
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'AI Key Generator', url: '/ai-key-generator' }
]

const aiDeveloperRelated = {
  tools: [
    {
      label: "JWT Secret Generator",
      description: "Generate JWT secrets for AI service authentication",
      href: "/jwt-secret"
    },
    {
      label: "API Key Generator",
      description: "General API key generator for all services",
      href: "/api-key"
    },
    {
      label: "OAuth Token Generator",
      description: "OAuth tokens for AI service integrations",
      href: "/oauth-token"
    },
    {
      label: "Encryption Key Generator",
      description: "Encrypt sensitive AI model data",
      href: "/encryption-key"
    }
  ]
}

export default function AiKeyGeneratorPage() {
  return (
    <AiKeyGeneratorPageClient
      breadcrumbItems={breadcrumbItems}
      schema={[aiKeyToolSchema, aiKeyHowToSchema]}
      relatedContent={aiDeveloperRelated}
    />
  )
}
