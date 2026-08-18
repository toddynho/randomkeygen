import type { Metadata } from 'next'
import TotpSecretPageClient from './TotpSecretPageClient'

export const metadata: Metadata = {
  title: 'TOTP Secret Generator - Create Base32 2FA Setup Keys | RandomKeygen',
  description: 'Create Base32 TOTP setup secrets and otpauth URIs for adding two-factor authentication to an app. This tool creates the shared secret, not a current 2FA code.',
  keywords: ['totp secret key generator', 'totp secret generator', '2fa secret key', 'authenticator secret', 'google authenticator key', 'otp secret generator', 'two factor authentication'],
  openGraph: {
    title: 'TOTP Secret Generator - Create Base32 2FA Setup Keys',
    description: 'Create Base32 TOTP setup secrets and otpauth URIs for configuring authenticator apps.',
    url: 'https://randomkeygen.com/totp-secret',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/totp-secret',
  },
}

export default function TotpSecretPage() {
  return <TotpSecretPageClient />
}
