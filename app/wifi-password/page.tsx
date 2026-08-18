import type { Metadata } from 'next'
import WifiPasswordPageClient from './WifiPasswordPageClient'
import { SoftwareApplicationStructuredData } from '../components/StructuredData'

export const metadata: Metadata = {
  title: 'WiFi Password Generator - WPA2/WPA3 Secure Passwords',
  description: 'Generate secure WiFi passwords for Netgear, Linksys, TP-Link routers. WPA2/WPA3 compatible with guest network setup guides. Instant generation, QR codes included.',
  keywords: ['wifi password generator', 'wpa password generator', 'wireless password', 'router password generator', 'wpa2 key generator', 'wpa3 password', 'secure wifi password', 'network password'],
  openGraph: {
    title: 'WiFi Password Generator - Secure Wireless Network Keys',
    description: 'Generate strong, secure passwords for your WiFi network.',
    url: 'https://randomkeygen.com/wifi-password',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/wifi-password',
  },
}

export default function WifiPasswordPage() {
  return (
    <>
      <SoftwareApplicationStructuredData
        name="WiFi Password Generator"
        description="Generate secure WiFi passwords for Netgear, Linksys, TP-Link routers. WPA2/WPA3 compatible with guest network setup guides."
        url="https://randomkeygen.com/wifi-password"
        applicationCategory="SecurityApplication"
        operatingSystem="Any"
      />
      {/* BreadcrumbList JSON-LD is emitted by GeneratorLayout's DetailSubnav */}
      <WifiPasswordPageClient />
    </>
  )
}
