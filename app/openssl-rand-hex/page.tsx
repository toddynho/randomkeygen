import type { Metadata } from 'next'
import OpensslRandHexPageClient from './OpensslRandHexPageClient'

export const metadata: Metadata = {
  title: 'OpenSSL rand -hex 32 Generator – Random Hex Strings Online | RandomKeygen',
  description: 'Generate the same random hex string as openssl rand -hex 32 in your browser. 16, 32 or 64 random bytes as hexadecimal, with the matching openssl rand -hex and -base64 commands.',
  keywords: ['openssl rand -hex 32', 'openssl rand hex', 'openssl rand -base64 32', 'random hex string generator', 'random hex key', '64 character hex string'],
  openGraph: {
    title: 'OpenSSL rand -hex 32 Generator – Random Hex Strings Online',
    description: 'Generate random hex strings like openssl rand -hex 32, with the matching OpenSSL commands.',
    url: 'https://randomkeygen.com/openssl-rand-hex',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/openssl-rand-hex',
  },
}

export default function OpensslRandHexPage() {
  return <OpensslRandHexPageClient />
}
