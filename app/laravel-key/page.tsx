import type { Metadata } from 'next'
import LaravelKeyPageClient from './LaravelKeyPageClient'

export const metadata: Metadata = {
  title: 'Laravel Key Generator - Generate APP_KEY Online | RandomKeygen',
  description: 'Free Laravel APP_KEY generator. Generate secure application keys for Laravel projects. Compatible with php artisan key:generate format (base64:...).',
  keywords: ['laravel key generator', 'laravel app key', 'php artisan key:generate', 'APP_KEY generator', 'laravel secret key', 'laravel generate key'],
  openGraph: {
    title: 'Laravel Key Generator - Generate APP_KEY Online',
    description: 'Generate secure application keys for Laravel projects.',
    url: 'https://randomkeygen.com/laravel-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/laravel-key',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'Laravel APP_KEY Generator', url: '/laravel-key' },
]

export default function LaravelKeyPage() {
  return <LaravelKeyPageClient breadcrumbItems={breadcrumbItems} />
}
