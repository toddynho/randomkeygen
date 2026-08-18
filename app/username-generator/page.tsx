import type { Metadata } from 'next'
import UsernameGeneratorPageClient from './UsernameGeneratorPageClient'

export const metadata: Metadata = {
  title: 'Username Generator - Generate Random Usernames | RandomKeygen',
  description: 'Free random username generator. Create unique usernames for gaming, social media, email, and online accounts. Multiple styles: cool, professional, anonymous.',
  keywords: ['username generator', 'random username', 'username ideas', 'gaming username generator', 'random username generator', 'cool username generator', 'unique username'],
  openGraph: {
    title: 'Username Generator - Generate Random Usernames',
    description: 'Create unique usernames for gaming, social media, and online accounts.',
    url: 'https://randomkeygen.com/username-generator',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/username-generator',
  },
}

// JSON-LD structured data for Username Generator
const usernameAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Username Generator',
  alternateName: 'Random Username Generator',
  description: 'Generate unique usernames for gaming, social media, email, and online accounts. Multiple styles including cool, professional, and anonymous usernames.',
  url: 'https://randomkeygen.com/username-generator',
  applicationCategory: 'UtilitiesApplication',
  applicationSubCategory: 'Username Generator',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  isPartOf: {
    '@type': 'WebSite',
    name: 'RandomKeygen',
    url: 'https://randomkeygen.com'
  },
  featureList: [
    'Gaming username generation',
    'Professional username creation',
    'Anonymous username generation',
    'Social media username ideas',
    'Custom length and format options',
    'Availability checking suggestions',
    'Copy to clipboard functionality'
  ],
  keywords: [
    'username generator',
    'random username',
    'username ideas',
    'gaming username generator',
    'cool username generator',
    'unique username',
    'username creator',
    'handle generator'
  ]
}

const usernameHowToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Generate a Username',
  description: 'Step-by-step guide to create unique usernames for online accounts',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Choose username style',
      text: 'Select the type of username you need: gaming, professional, anonymous, or custom',
      url: 'https://randomkeygen.com/username-generator#style'
    },
    {
      '@type': 'HowToStep',
      name: 'Set preferences',
      text: 'Adjust length, include numbers, and set other preferences for your username',
      url: 'https://randomkeygen.com/username-generator#preferences'
    },
    {
      '@type': 'HowToStep',
      name: 'Generate username',
      text: 'Click Generate to create unique username suggestions that match your criteria',
      url: 'https://randomkeygen.com/username-generator#generate'
    },
    {
      '@type': 'HowToStep',
      name: 'Check availability',
      text: 'Test the username on your target platform to ensure it\'s available',
      url: 'https://randomkeygen.com/username-generator#check'
    }
  ],
  totalTime: 'PT2M',
  tool: [
    {
      '@type': 'HowToTool',
      name: 'Web browser'
    }
  ]
}

export default function UsernameGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(usernameAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(usernameHowToSchema) }}
      />
      <UsernameGeneratorPageClient />
    </>
  )
}
