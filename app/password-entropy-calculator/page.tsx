import type { Metadata } from 'next'
import EntropyCalculatorClient from './EntropyCalculatorClient'

export const metadata: Metadata = {
  title: 'Password Entropy Calculator - Analyze Password Strength & Security | RandomKeygen',
  description: 'Calculate password entropy, strength ratings, and time-to-crack estimates. Analyze character sets, visualize security levels, and get recommendations for stronger passwords.',
  keywords: ['password entropy calculator', 'password strength', 'password security', 'entropy bits', 'password analysis', 'time to crack', 'password meter'],
  openGraph: {
    title: 'Password Entropy Calculator - Analyze Password Strength & Security',
    description: 'Calculate password entropy, strength ratings, and time-to-crack estimates. Analyze character sets and get security recommendations.',
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

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Password Entropy Calculator', url: '/password-entropy-calculator' },
]

export default function PasswordEntropyCalculatorPage() {
  return (
    <EntropyCalculatorClient
      breadcrumbItems={breadcrumbItems}
      schema={[webApplicationSchema]}
    />
  )
}