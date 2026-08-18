import type { Metadata } from 'next'
import CommonJwtMistakesClient from './CommonJwtMistakesClient'

export const metadata: Metadata = {
  title: 'Common JWT Implementation Mistakes - Avoid These Critical Security Errors',
  description: 'Learn the most common JWT implementation mistakes developers make and how to fix them. Avoid security vulnerabilities and implementation pitfalls.',
  keywords: 'jwt mistakes, jwt errors, jwt security vulnerabilities, jwt implementation errors, jwt common pitfalls, jwt troubleshooting',
  openGraph: {
    title: 'Common JWT Implementation Mistakes Developers Make',
    description: 'Avoid critical JWT security vulnerabilities. Learn from common mistakes and implement secure JWT authentication correctly.',
    type: 'article',
    url: 'https://randomkeygen.com/guides/common-jwt-mistakes',
  },
  twitter: {
    title: 'Common JWT Implementation Mistakes Developers Make',
    description: 'Avoid critical JWT security vulnerabilities. Learn from common mistakes and implement secure JWT authentication correctly.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/common-jwt-mistakes',
  },
}

export default function CommonJwtMistakesPage() {
  return <CommonJwtMistakesClient />
}