import type { Metadata } from 'next'
import { CategoryIndexPage } from '../components/CategoryIndexPage'

export const metadata: Metadata = {
  title: 'Developer Generators - API Keys, JWT Secrets, UUIDs & Tokens | RandomKeygen',
  description:
    'Every RandomKeygen developer tool in one place: API keys, JWT secrets, UUIDs, OAuth tokens, TOTP setup keys, and framework secrets. Generated locally, never transmitted.',
  alternates: { canonical: 'https://randomkeygen.com/developer' },
}

export default function DeveloperIndexPage() {
  return <CategoryIndexPage slug="developer" />
}
