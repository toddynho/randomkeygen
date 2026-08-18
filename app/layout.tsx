import type { Metadata } from 'next'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RandomKeygen - Secure Password & Credential Generation',
  description: 'Generate cryptographically secure passwords, API tokens, encryption values, UUIDs, and more. Free, open-source, and runs entirely in your browser using the Web Crypto API.',
  keywords: ['password', 'random', 'API token', 'encryption', 'UUID', 'secure', 'cryptographic'],
  authors: [{ name: 'RandomKeygen' }],
  openGraph: {
    title: 'RandomKeygen - Secure Password & Credential Generation',
    description: 'Generate cryptographically secure passwords, API tokens, encryption values, and more.',
    url: 'https://randomkeygen.com',
    siteName: 'RandomKeygen',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RandomKeygen - Secure Password & Credential Generation',
    description: 'Generate cryptographically secure passwords, API tokens, encryption values, and more.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Apply the persisted theme before first paint to avoid a flash.
            System preference is the default (no data-theme attribute). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('rkg-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})()",
          }}
        />
        
        {/* Enhanced Organization Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'RandomKeygen',
            url: 'https://randomkeygen.com',
            logo: 'https://randomkeygen.com/favicon.ico',
            description: 'Professional toolkit for generating cryptographically secure passwords, API keys, UUIDs, JWT secrets, and encryption keys.',
            foundingDate: '2020',
            sameAs: [
              'https://github.com/toddynho/randomkeygen'
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              url: 'https://github.com/toddynho/randomkeygen/issues'
            },
            knowsAbout: [
              'Cryptographic key generation',
              'Password security',
              'API key generation', 
              'Two-factor authentication',
              'Encryption key generation',
              'JWT token generation',
              'UUID generation',
              'Hash generation',
              'Web security'
            ]
          })
        }} />
        
      </head>
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
