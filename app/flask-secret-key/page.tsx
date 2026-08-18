import type { Metadata } from 'next'
import FlaskSecretKeyPageClient from './FlaskSecretKeyPageClient'

export const metadata: Metadata = {
  title: 'Flask Secret Key Generator - Generate Secure SECRET_KEY | RandomKeygen',
  description: 'Free Flask secret key generator. Generate cryptographically secure SECRET_KEY values for Flask applications. Protects sessions, cookies, and CSRF tokens.',
  keywords: ['flask secret key generator', 'flask SECRET_KEY', 'flask secret key', 'python secret key', 'flask session secret', 'flask security'],
  openGraph: {
    title: 'Flask Secret Key Generator - Generate Secure SECRET_KEY',
    description: 'Generate cryptographically secure SECRET_KEY values for Flask applications.',
    url: 'https://randomkeygen.com/flask-secret-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/flask-secret-key',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'Flask Secret Key Generator', url: '/flask-secret-key' },
]

export default function FlaskSecretKeyPage() {
  return <FlaskSecretKeyPageClient breadcrumbItems={breadcrumbItems} />
}
