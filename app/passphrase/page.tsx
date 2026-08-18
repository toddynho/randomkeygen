import type { Metadata } from 'next'
import PassphraseGenerator from './PassphraseGenerator'

export const metadata: Metadata = {
  title: 'Passphrase Generator - Create Memorable Secure Passphrases | RandomKeygen',
  description: 'Generate strong, memorable passphrases using the EFF wordlist. Diceware-style random word combinations that are easy to remember but hard to crack.',
  keywords: ['passphrase generator', 'diceware', 'random words', 'memorable password', 'EFF wordlist', 'secure passphrase'],
  openGraph: {
    title: 'Passphrase Generator - Create Memorable Secure Passphrases',
    description: 'Generate strong, memorable passphrases using the EFF wordlist.',
    url: 'https://randomkeygen.com/passphrase',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/passphrase',
  },
}

export default function PassphrasePage() {
  return <PassphraseGenerator />
}
