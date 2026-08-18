import type { Metadata } from 'next'
import OauthSecurityGuideClient from './OauthSecurityGuideClient'

export const metadata: Metadata = {
  title: 'OAuth Security Best Practices - Complete Guide to Secure OAuth 2.0 Implementation | RandomKeygen',
  description: 'Comprehensive OAuth security best practices guide. Learn about common vulnerabilities, secure implementation patterns, token storage strategies, and real-world OAuth 2.0 security measures.',
  keywords: ['oauth security best practices', 'oauth 2.0 security', 'oauth vulnerabilities', 'secure oauth implementation', 'oauth token security', 'pkce oauth', 'oauth security guide', 'oauth authentication security'],
  openGraph: {
    title: 'OAuth Security Best Practices - Complete Implementation Guide',
    description: 'Comprehensive guide to OAuth 2.0 security with best practices, vulnerability prevention, and secure implementation patterns.',
    url: 'https://randomkeygen.com/guides/oauth-security',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/oauth-security',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Guides', url: '/guides' },
  { name: 'OAuth Security', url: '/guides/oauth-security' }
]

export default function OauthSecurityGuidePage() {
  return <OauthSecurityGuideClient breadcrumbItems={breadcrumbItems} />
}