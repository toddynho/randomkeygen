import type { Metadata } from 'next'
import PasswordLengthClient from '@/app/components/password/PasswordLengthClient'

export const metadata: Metadata = {
  title: '16 Character Password Generator - Extra Strong Passwords | RandomKeygen',
  description: 'Generate highly secure 16 character passwords. The ideal length for most accounts offering excellent protection against brute force attacks.',
  keywords: ['16 character password', '16 char password generator', 'extra strong password', 'secure password 16'],
  openGraph: {
    title: '16 Character Password Generator',
    description: 'Generate highly secure 16 character passwords with excellent protection.',
    url: 'https://randomkeygen.com/password/16-character',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/password/16-character',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: '16 Character Passwords', url: '/password/16-character' },
]

export default function SixteenCharPasswordPage() {
  return (
    <PasswordLengthClient
      title="16 Character Password Generator"
      description="Generate secure 16-character passwords. This length provides excellent security for most applications and is the ideal default for password-manager-stored accounts."
      breadcrumbItems={breadcrumbItems}
      fixedLength={16}
      showExcludeAmbiguous
      csvFilename="passwords-16-character.csv"
    />
  )
}
