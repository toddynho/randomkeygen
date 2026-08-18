import type { Metadata } from 'next'
import JwtSecurityChecklistClient from './JwtSecurityChecklistClient'

export const metadata: Metadata = {
  title: 'JWT Security Checklist - Essential Security Best Practices for Developers',
  description: 'Comprehensive JWT security checklist for developers. Essential best practices, common vulnerabilities, and security configurations for secure JWT implementation.',
  keywords: 'jwt security, jwt security checklist, jwt best practices, jwt vulnerabilities, jwt security guide, jwt secure implementation',
  openGraph: {
    title: 'JWT Security Checklist for Developers',
    description: 'Essential security checklist for JWT implementation. Protect your apps with proven security practices and avoid common vulnerabilities.',
    type: 'article',
    url: 'https://randomkeygen.com/guides/jwt-security-checklist',
  },
  twitter: {
    title: 'JWT Security Checklist for Developers',
    description: 'Essential security checklist for JWT implementation. Protect your apps with proven security practices and avoid common vulnerabilities.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/jwt-security-checklist',
  },
}

export default function JwtSecurityChecklistPage() {
  return <JwtSecurityChecklistClient />
}