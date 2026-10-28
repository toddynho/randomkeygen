import type { Metadata } from 'next'
import WordPressSaltsPageClient from './WordPressSaltsPageClient'

export const metadata: Metadata = {
  title: 'WordPress Salt Generator - wp-config.php Keys | RandomKeygen',
  description: 'WordPress salt generator for all eight wp-config.php constants: AUTH_KEY, SECURE_AUTH_KEY, LOGGED_IN_KEY, NONCE_KEY, and the matching salts. Copy the block in one click.',
  keywords: ['wordpress salts', 'wordpress salt generator', 'WordPress security keys', 'wp-config.php', 'AUTH_KEY', 'SECURE_AUTH_KEY', 'WordPress security'],
  openGraph: {
    title: 'WordPress Salt Generator - wp-config.php Keys',
    description: 'Generate all 8 WordPress security keys and salts and copy them into wp-config.php.',
    url: 'https://randomkeygen.com/wordpress-salts',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/wordpress-salts',
  },
}

export default function WordPressSaltsPage() {
  return <WordPressSaltsPageClient />
}
