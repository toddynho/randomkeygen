import type { Metadata } from 'next'
import PasswordLengthClient from '@/app/components/password/PasswordLengthClient'
import { SecurityNotice, RelatedContent, PasswordManagerNextStep } from '@/app/components'
import { passwordRelated } from '@/app/components/RelatedContent'

export const metadata: Metadata = {
  title: '8 Character Password Generator & Examples | RandomKeygen',
  description: 'Generate random 8-character passwords with uppercase and lowercase letters, numbers, symbols, optional ambiguous-character exclusion, and bulk output.',
  keywords: ['8 character password generator', '8 character password', 'password generator 8 characters', 'minimum length password', 'secure 8 char password', '8-digit password', 'eight character password'],
  openGraph: {
    title: '8 Character Password Generator & Examples',
    description: 'Generate random 8-character passwords with configurable letters, numbers, symbols, and bulk output.',
    url: 'https://randomkeygen.com/password/8-character',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/password/8-character',
  },
}

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "8 Character Password Generator",
  "url": "https://randomkeygen.com/password/8-character",
  "description": "Generate cryptographically secure 8-character passwords that meet minimum system requirements. Perfect for legacy systems and security policies requiring exactly 8 characters.",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "publisher": {
    "@type": "Organization",
    "name": "RandomKeygen",
    "url": "https://randomkeygen.com"
  },
  "featureList": [
    "Exactly 8 characters long",
    "Mixed case letters, numbers, symbols",
    "Cryptographically secure generation",
    "Meets minimum password requirements",
    "Instant generation",
    "Copy to clipboard"
  ]
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: '8 Character Passwords', url: '/password/8-character' },
]

const PASSWORD_EXAMPLES = [
  { value: 'K7m$9Lpx', note: 'Mixed case + numbers + symbols (recommended)' },
  { value: 'Ht6nQ2mR', note: 'Alphanumeric only (for symbol-restricted systems)' },
  { value: 'P4ssW0rd', note: 'Avoid predictable patterns like this' },
]

const FAQ_ITEMS = [
  {
    question: 'Are 8-character passwords secure enough?',
    answer: '8-character passwords meet most minimum requirements and provide adequate security for many systems. However, for critical accounts, consider using 12+ characters. Our 8-character generator with mixed case, numbers, and symbols creates passwords with approximately 52.6 bits of entropy.',
  },
  {
    question: 'Which systems require exactly 8 characters?',
    answer: 'Many legacy systems, corporate networks, banking applications, and older mainframe systems have 8-character password limits. Some Unix systems, AS/400 platforms, and embedded devices also enforce this restriction.',
  },
  {
    question: 'Should I use symbols in 8-character passwords?',
    answer: "Yes, including symbols significantly increases password strength. However, some older systems don't support special characters. If symbols are rejected, try alphanumeric-only passwords by unchecking the symbols option above.",
  },
  {
    question: 'How often should I change 8-character passwords?',
    answer: 'Modern security guidelines recommend changing passwords only when compromised, not on a schedule. Focus on using unique passwords for each account and enabling two-factor authentication when available.',
  },
  {
    question: 'Can I use these passwords for banking?',
    answer: 'Our 8-character passwords are cryptographically secure and suitable for banking applications. Many banks actually require 8-character passwords as their standard. Always use unique passwords for different financial accounts.',
  },
]

export default function EightCharacterPasswordPage() {
  return (
    <PasswordLengthClient
      title="8 Character Password Generator"
      description="Generate secure 8-character passwords that meet minimum requirements for most systems. Perfect for legacy applications and security policies requiring exactly 8 characters."
      breadcrumbItems={breadcrumbItems}
      schema={[webApplicationSchema]}
      fixedLength={8}
      showExcludeAmbiguous
      csvFilename="passwords-8-character.csv"
      storageCallout={
        <PasswordManagerNextStep
          title="Eight characters is a limit, not a storage strategy."
          description="Use a different generated password for every legacy account and save each one in a manager. Choose a longer password whenever the site allows it."
        />
      }
    >
      {/* Why 8 Characters */}
      <section className="mb-8 card p-6">
        <h2 className="mb-4 text-xl font-semibold">Why 8 Characters?</h2>
        <div className="space-y-4 text-[var(--muted)]">
          <p>
            Eight characters is the minimum password length recommended by most security frameworks and required by many legacy systems:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>NIST Guidelines:</strong> 8 characters minimum for user-chosen passwords</li>
            <li><strong>Legacy Systems:</strong> Many older applications have 8-character limits</li>
            <li><strong>Corporate Policies:</strong> Common minimum requirement in enterprise environments</li>
            <li><strong>Compliance Standards:</strong> PCI DSS and other frameworks specify 8-character minimums</li>
            <li><strong>Unix/Linux:</strong> Traditional password complexity requirements</li>
          </ul>
        </div>
        <div className="mt-4">
          <SecurityNotice type="warning" title="Security Note">
            <p>
              While 8 characters meets minimum requirements, consider using longer passwords (12+ characters)
              when possible for better security against modern attack methods.
            </p>
          </SecurityNotice>
        </div>
      </section>

      {/* Examples */}
      <section className="mb-8 card p-6">
        <h2 className="mb-4 text-xl font-semibold">8-Character Password Examples</h2>
        <div className="space-y-3">
          {PASSWORD_EXAMPLES.map((example) => (
            <div key={example.value}>
              <div className="rounded-[10px] border border-[var(--border)] bg-[var(--band)] p-3 font-mono text-lg">
                {example.value}
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">{example.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8 card p-6">
        <h2 className="mb-4 text-xl font-semibold">8-Character Password FAQ</h2>
        <div className="space-y-6">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question}>
              <h3 className="mb-2 font-medium">{item.question}</h3>
              <p className="text-[var(--muted)]">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <SecurityNotice type="info" title="Security Note">
        All passwords are generated client-side using crypto.getRandomValues() for maximum security.
        No data is transmitted to our servers.
      </SecurityNotice>

      <RelatedContent {...passwordRelated} />
    </PasswordLengthClient>
  )
}
