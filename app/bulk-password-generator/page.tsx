import type { Metadata } from 'next'
import BulkPasswordClient from './BulkPasswordClient'

export const metadata: Metadata = {
  title: 'Bulk Password Generator - Generate Multiple Passwords & CSV Export | RandomKeygen',
  description: 'Generate hundreds of secure passwords at once. Export to CSV for easy import into spreadsheets, user management systems, and onboarding workflows.',
  keywords: ['bulk password generator', 'mass password generator', 'multiple passwords', 'password csv export', 'generate many passwords'],
  openGraph: {
    title: 'Bulk Password Generator - CSV Export',
    description: 'Generate hundreds of secure passwords at once with CSV export.',
    url: 'https://randomkeygen.com/bulk-password-generator',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/bulk-password-generator',
  },
}

export default function BulkPasswordPage() {
  return <BulkPasswordClient />
}
