import type { Metadata } from 'next'
import PasswordLengthClient from '@/app/components/password/PasswordLengthClient'

export const metadata: Metadata = {
  title: '20 Character Password Generator - Maximum Security Passwords | RandomKeygen',
  description: 'Generate ultra-secure 20 character passwords. Maximum protection for your most important accounts like banking, email, and password managers.',
  keywords: ['20 character password', '20 char password generator', 'maximum security password', 'ultra secure password'],
  openGraph: {
    title: '20 Character Password Generator',
    description: 'Generate ultra-secure 20 character passwords for maximum protection.',
    url: 'https://randomkeygen.com/password/20-character',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/password/20-character',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: '20 Character Passwords', url: '/password/20-character' },
]

export default function TwentyCharPasswordPage() {
  return (
    <PasswordLengthClient
      title="20 Character Password Generator"
      description="Generate secure 20-character passwords. This length provides excellent security for your most important accounts like banking, email, and password managers."
      breadcrumbItems={breadcrumbItems}
      fixedLength={20}
      showExcludeAmbiguous
      csvFilename="passwords-20-character.csv"
    />
  )
}
