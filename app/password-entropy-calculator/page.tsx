import type { Metadata } from 'next'
import EntropyCalculatorClient from './EntropyCalculatorClient'
import { entropyFaqs } from './content'

export const metadata: Metadata = {
  title: 'Password Entropy Calculator - Bits and Crack Time | RandomKeygen',
  description: 'Password entropy calculator: bits of entropy and estimated crack time update as you change length and character set, or type a password. The math runs in your browser.',
  keywords: ['password entropy', 'password entropy calculator', 'password strength', 'entropy bits', 'time to crack', 'password analysis'],
  openGraph: {
    title: 'Password Entropy Calculator - Bits and Crack Time',
    description: 'See password entropy in bits and estimated crack time as you change length, character set, or the password itself.',
    url: 'https://randomkeygen.com/password-entropy-calculator',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/password-entropy-calculator',
  },
}

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Password Entropy Calculator",
  "url": "https://randomkeygen.com/password-entropy-calculator",
  "description": "Calculate password entropy, strength ratings, and time-to-crack estimates. Analyze character sets, visualize security levels, and get recommendations for stronger passwords.",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "publisher": {
    "@type": "Organization",
    "name": "RandomKeygen",
    "url": "https://randomkeygen.com"
  },
  "featureList": [
    "Real-time entropy calculation",
    "Visual strength meter",
    "Time-to-crack estimates",
    "Character set analysis",
    "Security recommendations",
    "Strength rating system"
  ]
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: entropyFaqs.map((item) => ({
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
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Password Entropy Calculator', url: '/password-entropy-calculator' },
]

export default function PasswordEntropyCalculatorPage() {
  return (
    <EntropyCalculatorClient
      breadcrumbItems={breadcrumbItems}
      schema={[webApplicationSchema, faqSchema]}
    />
  )
}