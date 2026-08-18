import type { Metadata } from 'next'
import GamingPasswordClient from './GamingPasswordClient'

export const metadata: Metadata = {
  title: 'Gaming Password Generator - Xbox, PlayStation, Steam Passwords | RandomKeygen',
  description: 'Generate secure passwords for gaming accounts. Perfect for Xbox Live, PlayStation Network, Steam, Epic Games, and other gaming platforms.',
  keywords: ['gaming password', 'xbox password', 'playstation password', 'steam password', 'gaming account password', 'psn password generator'],
  openGraph: {
    title: 'Gaming Password Generator - Xbox, PlayStation, Steam',
    description: 'Generate secure passwords for your gaming accounts.',
    url: 'https://randomkeygen.com/gaming-password',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/gaming-password',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Gaming Password Generator', url: '/gaming-password' },
]

export default function GamingPasswordPage() {
  return <GamingPasswordClient breadcrumbItems={breadcrumbItems} />
}
