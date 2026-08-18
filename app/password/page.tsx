import type { Metadata } from 'next'
import PasswordPageClient from './PasswordPageClient'

export const metadata: Metadata = {
  title: 'Secure Password Generator - Strong Random Passwords & Passphrases | RandomKeygen',
  description: 'Generate cryptographically secure passwords with strength visualization, passphrase mode, pronounceable passwords, and bulk CSV export. Advanced password generator with manager integration guides.',
  keywords: ['secure password generator', 'random password', 'strong password', 'passphrase generator', 'pronounceable password', 'password strength checker', 'bulk password generator', 'password manager setup'],
  openGraph: {
    title: 'Secure Password Generator - Strong Random Passwords & Passphrases',
    description: 'Generate cryptographically secure passwords with strength visualization, passphrase mode, and bulk CSV export.',
    url: 'https://randomkeygen.com/password',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/password',
  },
}

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Password Generator",
  "url": "https://randomkeygen.com/password",
  "description": "Generate cryptographically secure random passwords with customizable length and character sets. Free online password generator using Web Crypto API.",
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
    "Customizable password length",
    "Multiple character set options",
    "Cryptographically secure generation",
    "No server transmission",
    "Instant generation",
    "Copy to clipboard"
  ]
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Password Generator', url: '/password' }
]

export default function PasswordPage() {
  return (
    <PasswordPageClient 
      breadcrumbItems={breadcrumbItems}
      schema={[webApplicationSchema]}
    />
  )
}
