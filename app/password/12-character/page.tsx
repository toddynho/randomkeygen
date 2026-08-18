import type { Metadata } from 'next'
import PasswordLengthClient from '@/app/components/password/PasswordLengthClient'

export const metadata: Metadata = {
  title: '12 Character Password Generator - Strong 12-Char Passwords | RandomKeygen',
  description: 'Generate secure 12 character passwords instantly. The recommended minimum length for strong passwords. Includes uppercase, lowercase, numbers, and symbols.',
  keywords: ['12 character password', '12 char password generator', 'strong password generator', 'password length 12'],
  openGraph: {
    title: '12 Character Password Generator',
    description: 'Generate secure 12 character passwords - the recommended minimum for strong security.',
    url: 'https://randomkeygen.com/password/12-character',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/password/12-character',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: '12 Character Passwords', url: '/password/12-character' },
]

export default function TwelveCharPasswordPage() {
  return (
    <PasswordLengthClient
      title="12 Character Password Generator"
      description="Generate secure 12-character passwords. Twelve characters is the recommended minimum length for strong passwords on most modern systems."
      breadcrumbItems={breadcrumbItems}
      fixedLength={12}
      showExcludeAmbiguous
      csvFilename="passwords-12-character.csv"
    />
  )
}
