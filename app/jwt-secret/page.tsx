import type { Metadata } from 'next'
import JwtSecretPageClient from './JwtSecretPageClient'

export const metadata: Metadata = {
  title: 'JWT Secret Generator - Secure Keys for HS256, RS256, ES256 | Free Online Tool',
  description: 'Generate secure JWT secrets instantly with our free online tool. Supports HS256, HS384, HS512, RS256, ES256 algorithms. Includes playground, debugger & framework examples for Node.js, Python, Java, Go, C#, PHP.',
  keywords: ['JWT secret generator', 'JWT token generator', 'JWT playground', 'JWT debugger', 'HS256', 'RS256', 'ES256', 'JSON Web Token', 'HMAC secret', 'JWT tools online'],
  openGraph: {
    title: 'JWT Secret Key Generator - Free & Secure with Implementation Guide',
    description: 'Generate JWT secrets with complete implementation examples and security best practices.',
    url: 'https://randomkeygen.com/jwt-secret',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/jwt-secret',
  },
}

// HowTo Schema for JWT secret generation
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Generate a Secure JWT Secret Key',
  description: 'Step-by-step guide to generate cryptographically secure JWT signing secrets for HS256, HS384, and HS512 algorithms.',
  totalTime: 'PT2M',
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
      name: 'RandomKeygen JWT Secret Generator'
    }
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Choose JWT Algorithm',
      text: 'Select your JWT signing algorithm (HS256, HS384, or HS512) based on your security requirements.'
    },
    {
      '@type': 'HowToStep',
      name: 'Generate Secret Key',
      text: 'Click the generate button to create a cryptographically secure random secret key.'
    },
    {
      '@type': 'HowToStep',
      name: 'Copy Secret Key',
      text: 'Copy the generated secret key and store it securely in your application\'s environment variables.'
    },
    {
      '@type': 'HowToStep',
      name: 'Implement in Code',
      text: 'Use the secret key in your JWT library configuration for token signing and verification.'
    }
  ]
}

// SoftwareApplication schema specific to JWT generator
const jwtAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JWT Secret Key Generator',
  alternateName: 'JSON Web Token Secret Generator',
  description: 'Generate cryptographically secure JWT signing secrets for HS256, HS384, and HS512 token authentication.',
  url: 'https://randomkeygen.com/jwt-secret',
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'Security Tool',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  isPartOf: {
    '@type': 'WebSite',
    name: 'RandomKeygen',
    url: 'https://randomkeygen.com'
  },
  featureList: [
    'HS256 (HMAC-SHA256) secret generation',
    'HS384 (HMAC-SHA384) secret generation', 
    'HS512 (HMAC-SHA512) secret generation',
    'Base64 encoded output option',
    'Hex encoded output option',
    'One-click copy to clipboard',
    'Client-side generation - no data sent to server'
  ],
  keywords: [
    'JWT secret generator',
    'JWT token generator', 
    'JWT playground',
    'JWT debugger',
    'JSON Web Token',
    'HMAC secret',
    'HS256',
    'HS384', 
    'HS512',
    'RS256',
    'ES256',
    'token signing key'
  ]
}

// FAQ Schema for JWT generator
const jwtFAQSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a JWT secret key?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A JWT secret key is a cryptographic key used to sign and verify JSON Web Tokens. It ensures token integrity and authenticity by creating a digital signature using algorithms like HS256, HS384, or HS512.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which JWT algorithm should I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'HS256 (HMAC-SHA256) is the most common choice for web applications due to its balance of security and performance. Use HS512 for maximum security, RS256 for distributed systems requiring public key verification, or ES256 for modern applications requiring excellent performance.'
      }
    },
    {
      '@type': 'Question',
      name: 'How long should a JWT secret key be?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'JWT secret keys should be at least 256 bits (32 bytes) for HS256, 384 bits (48 bytes) for HS384, and 512 bits (64 bytes) for HS512. Our generator creates cryptographically secure keys with the appropriate length for each algorithm.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is it safe to generate JWT secrets online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our JWT secret generator runs entirely in your browser using cryptographically secure random number generation. No secrets are sent to our servers or stored anywhere. For maximum security in production, you can also generate keys locally using our provided terminal commands.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I use a JWT secret in my application?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Store your JWT secret as an environment variable (e.g., JWT_SECRET=your_generated_secret) and use it in your JWT library to sign and verify tokens. Never hardcode secrets in your source code or commit them to version control.'
      }
    }
  ]
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'JWT Secret Generator', url: '/jwt-secret' }
]

// Visible "How to use" cards reuse the exact HowTo schema copy above.
const howToSteps = howToSchema.step.map((step) => ({
  title: step.name,
  body: step.text,
}))

export default function JwtSecretPage() {
  return (
    <JwtSecretPageClient
      breadcrumbItems={breadcrumbItems}
      schema={[howToSchema, jwtAppSchema, jwtFAQSchema]}
      howToSteps={howToSteps}
      howToHeading="How to Generate a Secure JWT Secret Key"
    />
  )
}
