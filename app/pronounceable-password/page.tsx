import type { Metadata } from 'next'
import PronounceableClient from './PronounceableClient'

export const metadata: Metadata = {
  title: 'Pronounceable Password Generator - Easy to Say Passwords | RandomKeygen',
  description: 'Generate secure passwords that are easy to pronounce and remember. Perfect for sharing over phone or reading aloud. Consonant-vowel patterns for natural pronunciation.',
  keywords: ['pronounceable password', 'speakable password', 'easy to say password', 'readable password generator', 'phonetic password'],
  openGraph: {
    title: 'Pronounceable Password Generator',
    description: 'Generate secure passwords that are easy to pronounce and remember.',
    url: 'https://randomkeygen.com/pronounceable-password',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/pronounceable-password',
  },
}

export default function PronounceablePage() {
  return <PronounceableClient />
}
