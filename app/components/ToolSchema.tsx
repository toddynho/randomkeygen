'use client'

interface ToolSchemaProps {
  name: string
  description: string
  url: string
  category?: string
  keywords?: string[]
  features?: string[]
  instructions?: Array<{
    name: string
    text: string
  }>
}

export function ToolSchema({ 
  name, 
  description, 
  url, 
  category = 'SecurityApplication',
  keywords = [],
  features = [],
  instructions = []
}: ToolSchemaProps) {
  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: category,
    applicationSubCategory: 'Developer Tool',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    softwareVersion: '2.0',
    datePublished: '2020-01-01',
    publisher: {
      '@type': 'Organization',
      name: 'RandomKeygen',
      url: 'https://randomkeygen.com',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    ...(features.length > 0 && { featureList: features }),
    ...(keywords.length > 0 && { keywords }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    potentialAction: {
      '@type': 'UseAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: url,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform'
        ],
      },
      object: {
        '@type': 'SoftwareApplication',
        name,
      },
    },
  }

  // Add HowTo schema if instructions are provided
  const howToSchema = instructions.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Use ${name}`,
    description: `Step-by-step guide to use ${name} for secure key generation.`,
    totalTime: 'PT2M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0'
    },
    supply: [{
      '@type': 'HowToSupply',
      name: 'Web Browser'
    }],
    tool: [{
      '@type': 'HowToTool',
      name
    }],
    step: instructions.map((instruction, index) => ({
      '@type': 'HowToStep',
      name: instruction.name,
      text: instruction.text,
      position: index + 1
    }))
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
    </>
  )
}

// Specialized components for specific tools
export function JWTToolSchema() {
  return (
    <ToolSchema
      name="JWT Secret Generator"
      description="Generate cryptographically secure JWT signing secrets for HS256, HS384, and HS512 algorithms."
      url="https://randomkeygen.com/jwt-secret"
      keywords={[
        'JWT secret generator',
        'JWT token generator',
        'JSON Web Token',
        'HMAC secret',
        'HS256', 'HS384', 'HS512',
        'token authentication'
      ]}
      features={[
        'HS256 (HMAC-SHA256) secret generation',
        'HS384 (HMAC-SHA384) secret generation',
        'HS512 (HMAC-SHA512) secret generation',
        'Base64 encoded output option',
        'Hex encoded output option',
        'One-click copy to clipboard',
        'Client-side generation - no data sent to server',
        'Framework integration examples'
      ]}
      instructions={[
        {
          name: 'Choose Algorithm',
          text: 'Select your JWT signing algorithm (HS256, HS384, or HS512) based on your security requirements.'
        },
        {
          name: 'Generate Secret',
          text: 'Click the generate button to create a cryptographically secure random secret key.'
        },
        {
          name: 'Copy Key',
          text: 'Copy the generated secret key and store it securely in your environment variables.'
        },
        {
          name: 'Implement',
          text: 'Use the secret key in your JWT library configuration for token signing and verification.'
        }
      ]}
    />
  )
}

export function SHA256ToolSchema() {
  return (
    <ToolSchema
      name="SHA256 Generator"
      description="Generate SHA256 hashes for data integrity verification, digital signatures, and blockchain applications."
      url="https://randomkeygen.com/sha256-generator"
      keywords={[
        'SHA256 generator',
        'SHA256 hash',
        'checksum generator',
        'data integrity',
        'cryptographic hash',
        'file verification'
      ]}
      features={[
        'SHA256 hash generation',
        'File hash verification',
        'Text to SHA256 conversion',
        'Batch hash processing',
        'Checksum validation',
        'Blockchain-compatible hashes',
        'Real-time hash computation'
      ]}
      instructions={[
        {
          name: 'Enter Data',
          text: 'Input the text or upload the file you want to hash.'
        },
        {
          name: 'Generate Hash',
          text: 'Click generate to create the SHA256 hash of your data.'
        },
        {
          name: 'Verify Integrity',
          text: 'Use the hash to verify data integrity or for digital signatures.'
        }
      ]}
    />
  )
}

export function UUIDToolSchema() {
  return (
    <ToolSchema
      name="UUID Generator"
      description="Generate random UUID version 4 identifiers for databases, applications, and distributed systems."
      url="https://randomkeygen.com/uuid"
      keywords={[
        'UUID generator',
        'unique identifier',
        'GUID generator',
        'RFC 4122',
        'database ID',
        'distributed systems'
      ]}
      features={[
        'UUID v4 (random) generation',
        'Bulk UUID generation',
        'Standard, uppercase, and no-dash output formats',
        'Cryptographically secure browser-based generation',
        'Database-ready identifiers'
      ]}
      instructions={[
        {
          name: 'Choose Format',
          text: 'Choose standard, uppercase, or no-dash output.'
        },
        {
          name: 'Generate UUID',
          text: 'Click generate to create a random version 4 UUID.'
        },
        {
          name: 'Use in Application',
          text: 'Copy the UUID for use as a unique identifier in your database or application.'
        }
      ]}
    />
  )
}

// SearchAction schema for on-page search
export function SearchActionSchema({ searchUrl }: { searchUrl: string }) {
  const searchSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://randomkeygen.com',
    name: 'RandomKeygen',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${searchUrl}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }}
    />
  )
}
