import type { Metadata } from 'next'
import MasterPasswordClient from './MasterPasswordClient'

export const metadata: Metadata = {
  title: 'Master Password Generator - Password Manager Keys | RandomKeygen',
  description: 'Generate ultra-secure master passwords for password managers like 1Password, Bitwarden, LastPass. Maximum entropy for your most important password.',
  keywords: ['master password', 'password manager password', '1password master', 'bitwarden master password', 'lastpass master password'],
  openGraph: {
    title: 'Master Password Generator - Password Manager Keys',
    description: 'Generate ultra-secure master passwords for password managers.',
    url: 'https://randomkeygen.com/master-password',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/master-password',
  },
}

export default function MasterPasswordPage() {
  return <MasterPasswordClient />
}
