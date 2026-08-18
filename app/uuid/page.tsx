import type { Metadata } from 'next'
import UuidPageClient from './UuidPageClient'

export const metadata: Metadata = {
  title: 'UUID Generator - Free Random UUID v4 & GUIDs | RandomKeygen',
  description: 'Generate random UUID v4 and GUID values in standard, uppercase, or no-dash formats. Create one or bulk identifiers locally in your browser.',
  keywords: ['UUID generator', 'UUID v4', 'GUID generator', 'unique identifier', 'random UUID', 'RFC 4122'],
  openGraph: {
    title: 'UUID Generator - Free Random UUID v4 & GUIDs',
    description: 'Generate random UUID v4 and GUID values in standard, uppercase, or no-dash formats.',
    url: 'https://randomkeygen.com/uuid',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/uuid',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'UUID Generator', url: '/uuid' }
]

// Related tools and guides for UUID work
const uuidRelated = {
  tools: [
    { href: '/api-key', label: 'API Key Generator', description: 'Secure API tokens' },
    { href: '/random-string', label: 'Random String Generator', description: 'Custom length and character sets' },
  ],
  guides: [
    { href: '/guides/uuid-version-comparison', title: 'UUID Version Comparison: v1 vs v4 vs v5' },
    { href: '/guides/uuid-vs-sequential', title: 'UUID vs Sequential IDs: When to Use Each' },
  ],
}

// UUID Tool Schema
const uuidToolSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'UUID Generator',
  alternateName: 'GUID Generator',
  description: 'Generate RFC 4122 compliant UUID v4 (Universally Unique Identifiers). Random 128-bit identifiers perfect for database primary keys and unique IDs.',
  url: 'https://randomkeygen.com/uuid',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  featureList: [
    'RFC 4122 compliant UUID v4 generation',
    'Multiple output formats (standard, uppercase, no dashes)',
    '122 bits of entropy',
    'Cryptographically secure random generation',
    'Client-side generation - no server storage',
    'One-click copy to clipboard'
  ]
}

export default function UuidPage() {
  return (
    <>
      <UuidPageClient 
        breadcrumbItems={breadcrumbItems}
        schema={[uuidToolSchema]}
        relatedContent={uuidRelated}
      />
    </>
  )
}
