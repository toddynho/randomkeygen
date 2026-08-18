import type { Metadata } from 'next'
import { CategoryIndexPage } from '../components/CategoryIndexPage'

export const metadata: Metadata = {
  title: 'Password Generators - Strong, Memorable & Bulk Passwords | RandomKeygen',
  description:
    'Every RandomKeygen password tool in one place: strong random passwords, passphrases, PINs, recovery codes, and strength checkers. Generated locally, never transmitted.',
  alternates: { canonical: 'https://randomkeygen.com/passwords' },
}

export default function PasswordsIndexPage() {
  return <CategoryIndexPage slug="passwords" />
}
