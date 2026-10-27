// Plain data, not a Client Component module.
// Server pages spread these objects into <RelatedContent>. Importing them
// from the 'use client' RelatedContent module makes that spread empty during
// server render, so the cards never appear in the HTML.

export interface RelatedTool {
  href: string
  label: string
  description: string
}

export interface RelatedGuide {
  href: string
  title: string
}

export interface RelatedContentProps {
  tools?: RelatedTool[]
  guides?: RelatedGuide[]
  tips?: string[]
}

// Pre-configured related content for different tool categories
export const passwordRelated: RelatedContentProps = {
  tools: [
    { href: '/password/8-character', label: '8 Character Password', description: 'Legacy system compatible' },
    { href: '/password-strength', label: 'Password Strength Checker', description: 'Test your password security' },
    { href: '/passphrase', label: 'Passphrase Generator', description: 'Easy to remember passwords' },
    { href: '/memorable-password', label: 'Memorable Passwords', description: 'Word-based passwords' },
    { href: '/pin-generator', label: 'PIN Generator', description: 'Secure 4-6 digit PINs' },
  ],
  guides: [
    { href: '/guides/choosing-a-password-manager', title: 'How to Choose a Password Manager' },
    { href: '/guides/password-manager-vs-browser', title: 'Browser vs Dedicated Password Manager' },
    { href: '/guides/password-security-best-practices', title: 'Password Security Best Practices' },
    { href: '/guides/how-password-managers-work', title: 'How Password Managers Work' },
  ],
  tips: [
    'Use unique passwords for every account',
    'Enable 2FA wherever possible',
    'Use a password manager to store credentials',
    'Never share passwords via email or text',
  ],
}

export const encryptionRelated: RelatedContentProps = {
  tools: [
    { href: '/aes-key', label: 'AES Key Generator', description: '128/192/256 bit keys' },
    { href: '/rsa-key', label: 'RSA Key Generator', description: 'Asymmetric key pairs' },
    { href: '/hmac-key', label: 'HMAC Key Generator', description: 'Message authentication keys' },
    { href: '/hash-generator', label: 'Hash Generator', description: 'SHA256, SHA512, MD5' },
    { href: '/encryption-key', label: 'Encryption Keys', description: 'Hex keys for encryption' },
    { href: '/aes-256-key', label: 'AES-256 Key Generator', description: 'Hex or Base64 256-bit keys' },
  ],
  guides: [
    { href: '/guides/encryption-explained', title: 'Encryption Explained: AES vs RSA' },
    { href: '/guides/api-key-best-practices', title: 'API Key Storage and Rotation' },
  ],
  tips: [
    'Use AES-256 for symmetric encryption',
    'Never store encryption keys in code',
    'Rotate keys periodically',
    'Use environment variables for secrets',
  ],
}

export const developerRelated: RelatedContentProps = {
  tools: [
    { href: '/api-key', label: 'API Key Generator', description: 'Secure API tokens' },
    { href: '/jwt-secret', label: 'JWT Secret Generator', description: 'Token signing keys' },
    { href: '/django-secret-key', label: 'Django Secret Key', description: 'For Django settings' },
    { href: '/uuid', label: 'UUID Generator', description: 'Unique identifiers' },
    { href: '/backup-codes', label: 'Backup Codes', description: '2FA recovery codes' },
    { href: '/base32-encode', label: 'Base32 Encoder', description: 'Text to Base32 encoding' },
  ],
  guides: [
    { href: '/guides/api-key-best-practices', title: 'API Key Best Practices' },
    { href: '/guides/jwt-security', title: 'JWT Security Guide' },
  ],
  tips: [
    'Use prefixes to identify key types (sk_, pk_)',
    'Set appropriate expiration on tokens',
    'Implement rate limiting on API endpoints',
    'Log and monitor key usage',
  ],
}

// Popular generators for homepage cross-linking
export const popularGenerators: RelatedContentProps = {
  tools: [
    { href: '/password', label: 'Password Generator', description: 'Strong random passwords' },
    { href: '/password/8-character', label: '8-Character Passwords', description: 'Legacy system compatible' },
    { href: '/jwt-secret', label: 'JWT Secret Generator', description: '256-bit signing keys' },
    { href: '/uuid', label: 'UUID Generator', description: 'Unique identifiers' },
    { href: '/api-key', label: 'API Key Generator', description: 'Secure API tokens' },
    { href: '/pin-generator', label: 'PIN Generator', description: 'Banking & device PINs' },
    { href: '/aes-key', label: 'AES Key Generator', description: 'Encryption keys' },
    { href: '/rsa-key', label: 'RSA Key Generator', description: 'Public/private pairs' },
  ],
}
