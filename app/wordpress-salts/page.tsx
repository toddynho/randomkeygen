import type { Metadata } from 'next'
import WordPressSaltsPageClient from './WordPressSaltsPageClient'

export const metadata: Metadata = {
  title: 'WordPress Salt Generator - Security Keys & Salts | RandomKeygen',
  description: 'Generate all 8 WordPress security keys and salts for wp-config.php. AUTH_KEY, SECURE_AUTH_KEY, LOGGED_IN_KEY, NONCE_KEY and their corresponding salts.',
  keywords: ['WordPress salts', 'WordPress security keys', 'wp-config.php', 'AUTH_KEY', 'WordPress security', 'WordPress generator'],
  openGraph: {
    title: 'WordPress Salt Generator - Security Keys & Salts',
    description: 'Generate all 8 WordPress security keys and salts for wp-config.php.',
    url: 'https://randomkeygen.com/wordpress-salts',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/wordpress-salts',
  },
}

export default function WordPressSaltsPage() {
  return <WordPressSaltsPageClient />
}
