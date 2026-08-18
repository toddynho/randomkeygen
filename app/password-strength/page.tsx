import type { Metadata } from 'next'
import PasswordStrengthPageClient from './PasswordStrengthPageClient'

export const metadata: Metadata = {
  title: 'Password Strength Checker - Test How Strong Your Password Is | RandomKeygen',
  description: 'Free password strength checker. Test how secure your password is with instant analysis of length, complexity, entropy, and estimated crack time. No passwords stored.',
  keywords: ['password strength checker', 'password strength meter', 'how strong is my password', 'check password strength', 'password security test', 'password analyzer'],
  openGraph: {
    title: 'Password Strength Checker - Test Your Password Security',
    description: 'Test how secure your password is with instant strength analysis.',
    url: 'https://randomkeygen.com/password-strength',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/password-strength',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Password Strength Checker', url: '/password-strength' },
]

export default function PasswordStrengthPage() {
  return <PasswordStrengthPageClient breadcrumbItems={breadcrumbItems} />
}
