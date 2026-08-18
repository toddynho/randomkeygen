import type { Metadata } from 'next'
import PasswordLengthClient from '@/app/components/password/PasswordLengthClient'

export const metadata: Metadata = {
  title: '24 Character Password Generator - Strong Random Passwords | RandomKeygen',
  description: 'Generate secure 24 character passwords with uppercase and lowercase letters, numbers, and symbols. Free, private, and generated entirely in your browser.',
  keywords: ['24 character password generator', '24 character password', '24 char password', 'strong random password'],
  openGraph: {
    title: '24 Character Password Generator',
    description: 'Generate secure random passwords that are exactly 24 characters long.',
    url: 'https://randomkeygen.com/password/24-character',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/password/24-character',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: '24 Character Passwords', url: '/password/24-character' },
]

export default function TwentyFourCharPasswordPage() {
  return (
    <PasswordLengthClient
      title="24 Character Password Generator"
      description="Generate secure 24-character passwords. This length provides excellent security for most applications, with generation happening entirely in your browser."
      breadcrumbItems={breadcrumbItems}
      fixedLength={24}
      showExcludeAmbiguous
      csvFilename="passwords-24-character.csv"
    />
  )
}
