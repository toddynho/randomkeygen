import type { Metadata } from 'next'
import SHA256GeneratorClient from './SHA256GeneratorClient'

export const metadata: Metadata = {
  title: 'SHA-256 Hash Generator - Generate SHA256 Hashes Online | RandomKeygen',
  description: 'Free SHA-256 hash generator. Create secure SHA256 hashes from text or files instantly. Perfect for checksums, file verification, password hashing, and data integrity.',
  keywords: ['sha256 hash generator', 'sha256 generator online', 'generate sha256', 'sha256 hash', 'sha256 checksum', 'file hash generator', 'sha256 online tool'],
  openGraph: {
    title: 'SHA-256 Hash Generator - Generate SHA256 Hashes Online',
    description: 'Create secure SHA-256 hashes from text or files for checksums and data integrity verification.',
    url: 'https://randomkeygen.com/sha256-generator',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/sha256-generator',
  },
}

// JSON-LD structured data for SHA256 Generator
const sha256AppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SHA-256 Hash Generator',
  alternateName: 'SHA256 Generator',
  description: 'Generate secure SHA-256 hashes from text or files for checksums, file verification, and data integrity. Free online SHA256 hash tool.',
  url: 'https://randomkeygen.com/sha256-generator',
  applicationCategory: 'SecurityApplication',
  applicationSubCategory: 'Cryptographic Hash Generator',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  isPartOf: {
    '@type': 'WebSite',
    name: 'RandomKeygen',
    url: 'https://randomkeygen.com'
  },
  featureList: [
    'SHA-256 hash generation from text input',
    'File hash generation for verification',
    'Real-time hash computation',
    'Copy hash results to clipboard',
    'Client-side processing - no data transmitted',
    'Support for large file hashing',
    'Hexadecimal output format'
  ],
  keywords: [
    'sha256 hash generator',
    'sha256 generator online',
    'generate sha256',
    'sha256 hash',
    'sha256 checksum',
    'file hash generator',
    'cryptographic hash',
    'data integrity'
  ]
}

const sha256HowToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Generate SHA-256 Hash',
  description: 'Step-by-step guide to generate SHA-256 hashes for file verification and data integrity',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Enter text or upload file',
      text: 'Type your text into the input field or upload a file you want to hash',
      url: 'https://randomkeygen.com/sha256-generator#input'
    },
    {
      '@type': 'HowToStep',
      name: 'Generate hash',
      text: 'Click the Generate button or the hash will be computed automatically as you type',
      url: 'https://randomkeygen.com/sha256-generator#generate'
    },
    {
      '@type': 'HowToStep',
      name: 'Copy result',
      text: 'Copy the generated SHA-256 hash to use for verification or storage',
      url: 'https://randomkeygen.com/sha256-generator#result'
    }
  ],
  totalTime: 'PT1M',
  supply: [
    {
      '@type': 'HowToSupply',
      name: 'Text or file to hash'
    }
  ],
  tool: [
    {
      '@type': 'HowToTool',
      name: 'Web browser with JavaScript enabled'
    }
  ]
}

export default function SHA256GeneratorPage() {
  return <SHA256GeneratorClient schema={[sha256AppSchema, sha256HowToSchema]} />
}
