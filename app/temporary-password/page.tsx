import type { Metadata } from 'next'
import TemporaryPasswordClient from './TemporaryPasswordClient'

export const metadata: Metadata = {
  title: 'Temporary Password Generator - One-Time Use Passwords | RandomKeygen',
  description: 'Generate temporary passwords for one-time use. Perfect for new user onboarding, password resets, guest access, and IT admin tasks.',
  keywords: ['temporary password', 'one time password', 'temp password generator', 'disposable password', 'initial password'],
  openGraph: {
    title: 'Temporary Password Generator - One-Time Use',
    description: 'Generate temporary passwords for one-time use.',
    url: 'https://randomkeygen.com/temporary-password',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/temporary-password',
  },
}

export default function TemporaryPasswordPage() {
  return <TemporaryPasswordClient />
}
