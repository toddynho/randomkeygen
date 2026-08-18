import type { Metadata } from 'next'
import KeygenHubClient from './KeygenHubClient'
import { DetailSubnav } from '../components/DetailSubnav'

export const metadata: Metadata = {
  title: 'Keygen Hub - Complete Collection of Key Generators | RandomKeygen',
  description: 'Comprehensive collection of all key generators in one place. Generate passwords, encryption keys, API tokens, JWT secrets, SSH keys, and more. Free, secure, and instant.',
  keywords: ['keygen', 'key generator', 'password generator', 'encryption key', 'api key', 'jwt secret', 'ssh key', 'key generation tools', 'security keys', 'crypto keys'],
  openGraph: {
    title: 'Keygen Hub - Complete Key Generator Collection',
    description: 'All key generators in one place - passwords, encryption keys, API tokens, JWT secrets, and more.',
    url: 'https://randomkeygen.com/keygen-hub',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/keygen-hub',
  },
}

export default function KeygenHubPage() {
  return (
    <>
      <DetailSubnav
        items={[
          { name: 'Home', url: '/' },
          { name: 'Keygen Hub', url: '/keygen-hub' },
        ]}
      />
      <KeygenHubClient />
    </>
  )
}