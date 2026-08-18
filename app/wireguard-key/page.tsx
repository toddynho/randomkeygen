import type { Metadata } from 'next'
import WireguardKeyPageClient from './WireguardKeyPageClient'

export const metadata: Metadata = {
  title: 'WireGuard Key Generator Guide - VPN Key Commands | RandomKeygen',
  description: 'Learn how to generate WireGuard VPN keys locally using wg commands. Guide for key pair generation, preshared keys, and configuration examples.',
  keywords: ['WireGuard key generator', 'WireGuard VPN', 'wg genkey', 'VPN key', 'WireGuard config', 'preshared key'],
  openGraph: {
    title: 'WireGuard Key Generator Guide - VPN Key Commands',
    description: 'Learn how to generate WireGuard VPN keys locally.',
    url: 'https://randomkeygen.com/wireguard-key',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/wireguard-key',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'WireGuard Key Generator', url: '/wireguard-key' },
]

export default function WireguardKeyPage() {
  return <WireguardKeyPageClient breadcrumbItems={breadcrumbItems} />
}
