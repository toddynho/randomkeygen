import type { Metadata } from 'next'
import RecoveryKeyClient from './RecoveryKeyClient'

export const metadata: Metadata = {
  title: 'Recovery Key Generator - Account Recovery Keys | RandomKeygen',
  description: 'Generate secure recovery keys like Apple and Google style. Used for account recovery when you lose access to your password or 2FA.',
  keywords: ['recovery key', 'account recovery key', 'apple recovery key', 'google recovery key', 'emergency access key'],
  openGraph: {
    title: 'Recovery Key Generator',
    description: 'Generate secure recovery keys for account backup.',
    url: 'https://randomkeygen.com/recovery-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/recovery-key',
  },
}

export default function RecoveryKeyPage() {
  return <RecoveryKeyClient />
}
