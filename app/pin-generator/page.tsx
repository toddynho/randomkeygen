import type { Metadata } from 'next'
import PinGeneratorPageClient from './PinGeneratorPageClient'
import { SoftwareApplicationStructuredData } from '../components/StructuredData'

export const metadata: Metadata = {
  title: 'PIN Generator - Secure 4-6 Digit PINs for Banking & Devices',
  description: 'Generate secure PINs for ATMs, banking, smartphones, and device security. 4-digit, 6-digit, or custom length PIN codes. Instant generation.',
  keywords: ['pin generator', 'random pin', 'pin code generator', '4 digit pin generator', '6 digit pin generator', 'random pin number', 'secure pin'],
  openGraph: {
    title: 'PIN Generator - Generate Random PIN Codes',
    description: 'Create secure random PIN codes for ATMs, phones, and apps.',
    url: 'https://randomkeygen.com/pin-generator',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/pin-generator',
  },
}

export default function PinGeneratorPage() {
  return (
    <>
      <SoftwareApplicationStructuredData
        name="PIN Generator"
        description="Generate secure PINs for ATMs, banking, smartphones, and device security. 4-digit, 6-digit, or custom length PIN codes."
        url="https://randomkeygen.com/pin-generator"
        applicationCategory="SecurityApplication"
        operatingSystem="Any"
      />
      <PinGeneratorPageClient />
    </>
  )
}
