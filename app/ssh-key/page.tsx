import type { Metadata } from 'next'
import SshKeyPageClient from './SshKeyPageClient'
import { SoftwareApplicationStructuredData } from '../components/StructuredData'

export const metadata: Metadata = {
  title: 'SSH Key Generator - Ed25519 & RSA ssh-keygen Guide | RandomKeygen',
  description: 'Generate SSH keys safely on your own machine with copyable ssh-keygen commands for Ed25519 and RSA, plus SSH agent setup and security guidance.',
  keywords: ['SSH key generator', 'ssh-keygen', 'Ed25519', 'RSA key', 'SSH authentication', 'public key'],
  openGraph: {
    title: 'SSH Key Generator - Ed25519 & RSA ssh-keygen Guide',
    description: 'Use copyable ssh-keygen commands to create Ed25519 or RSA SSH keys safely on your own machine.',
    url: 'https://randomkeygen.com/ssh-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/ssh-key',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'SSH Key Generator', url: '/ssh-key' },
]

export default function SshKeyPage() {
  return (
    <>
      <SoftwareApplicationStructuredData
        name="SSH Key Generator Guide"
        description="Learn how to generate secure SSH keys locally using ssh-keygen. Guide for Ed25519 and RSA key generation, SSH agent setup, and best practices."
        url="https://randomkeygen.com/ssh-key"
        applicationCategory="DeveloperApplication"
        operatingSystem="Unix, Linux, macOS, Windows"
      />
      <SshKeyPageClient breadcrumbItems={breadcrumbItems} />
    </>
  )
}
