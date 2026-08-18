import type { Metadata } from 'next'
import PasswordLengthClient from '@/app/components/password/PasswordLengthClient'

export const metadata: Metadata = {
  title: '32 Character Password Generator - High-Entropy Passwords | RandomKeygen',
  description: 'Generate secure 32 character passwords with high entropy. Customize letters, numbers, and symbols; generation stays entirely in your browser.',
  keywords: ['32 character password generator', '32 character password', '32 char password', 'high entropy password'],
  openGraph: {
    title: '32 Character Password Generator',
    description: 'Generate high-entropy random passwords that are exactly 32 characters long.',
    url: 'https://randomkeygen.com/password/32-character',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/password/32-character',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: '32 Character Passwords', url: '/password/32-character' },
]

export default function ThirtyTwoCharPasswordPage() {
  return (
    <PasswordLengthClient
      title="32 Character Password Generator"
      description="Generate high-entropy 32-character passwords. This length provides excellent security for critical secrets, API credentials, and vault master keys."
      breadcrumbItems={breadcrumbItems}
      fixedLength={32}
      showExcludeAmbiguous
      csvFilename="passwords-32-character.csv"
    />
  )
}
