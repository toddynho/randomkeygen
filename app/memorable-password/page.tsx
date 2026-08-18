import type { Metadata } from 'next'
import MemorablePasswordPageClient from './MemorablePasswordPageClient'

export const metadata: Metadata = {
  title: 'Memorable Password Generator - Easy to Remember Passwords | RandomKeygen',
  description: 'Generate secure yet memorable passwords. Create easy-to-remember passwords using word combinations, patterns, and mnemonics while maintaining strong security.',
  keywords: ['memorable password generator', 'easy to remember password', 'memorable password', 'pronounceable password', 'word based password', 'secure memorable password'],
  openGraph: {
    title: 'Memorable Password Generator - Easy to Remember Passwords',
    description: 'Generate secure passwords that are actually easy to remember.',
    url: 'https://randomkeygen.com/memorable-password',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/memorable-password',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Memorable Password Generator', url: '/memorable-password' },
]

export default function MemorablePasswordPage() {
  return <MemorablePasswordPageClient breadcrumbItems={breadcrumbItems} />
}
