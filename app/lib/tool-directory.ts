// Single source of truth for the category index pages (/passwords, /developer,
// /encryption), the header nav active-state matchers, and category breadcrumbs.
// Blurbs are condensed from each tool's existing page metadata — keep them in
// sync when a tool's positioning changes.

export interface DirectoryTool {
  href: string
  name: string
  blurb: string
}

export interface DirectorySection {
  title: string
  tools: DirectoryTool[]
}

export interface DirectoryCategory {
  slug: string
  href: string
  label: string
  title: string
  description: string
  sections: DirectorySection[]
}

export const TOOL_DIRECTORY: DirectoryCategory[] = [
  {
    slug: 'passwords',
    href: '/passwords',
    label: 'Passwords',
    title: 'Password Generators',
    description:
      'Strong random passwords, passphrases, PINs, and recovery codes — generated locally in your browser and never transmitted.',
    sections: [
      {
        title: 'Generators',
        tools: [
          { href: '/password', name: 'Password Generator', blurb: 'Strong random passwords & passphrases' },
          { href: '/passphrase', name: 'Passphrase', blurb: 'Memorable multi-word passphrases' },
          { href: '/pronounceable-password', name: 'Pronounceable', blurb: 'Easy-to-say passwords' },
          { href: '/memorable-password', name: 'Memorable Password', blurb: 'Easy-to-remember patterns' },
          { href: '/master-password', name: 'Master Password', blurb: 'Keys for your password manager' },
          { href: '/bulk-password-generator', name: 'Bulk Generator', blurb: 'Many passwords + CSV export' },
          { href: '/wifi-password', name: 'WiFi Password', blurb: 'WPA2/WPA3 network passwords' },
          { href: '/gaming-password', name: 'Gaming Password', blurb: 'Xbox, PlayStation & Steam accounts' },
          { href: '/temporary-password', name: 'Temporary Password', blurb: 'One-time-use passwords' },
          { href: '/pin-generator', name: 'PIN Generator', blurb: '4–6 digit banking & device PINs' },
          { href: '/username-generator', name: 'Username Generator', blurb: 'Random usernames' },
        ],
      },
      {
        title: 'Password options',
        tools: [
          { href: '/password/8-character', name: '8 Character', blurb: 'Legacy system compatible' },
          { href: '/password/12-character', name: '12 Character', blurb: 'Strong 12-char passwords' },
          { href: '/password/16-character', name: '16 Character', blurb: 'Extra-strong default length' },
          { href: '/password/20-character', name: '20 Character', blurb: 'Maximum-security length' },
          { href: '/password/24-character', name: '24 Character', blurb: 'High-entropy passwords' },
          { href: '/password/32-character', name: '32 Character', blurb: 'Highest-entropy passwords' },
          { href: '/password-generator/letters-only', name: 'Letters Only', blurb: 'Alphabetic passwords' },
          { href: '/password-generator/no-special-characters', name: 'No Symbols', blurb: 'Alphanumeric only' },
          { href: '/password-generator/numbers-only', name: 'Numbers Only', blurb: 'Numeric passwords & PINs' },
        ],
      },
      {
        title: 'Recovery & analysis',
        tools: [
          { href: '/backup-codes', name: 'Backup Codes', blurb: '2FA recovery codes' },
          { href: '/recovery-key', name: 'Recovery Key', blurb: 'Account recovery keys' },
          { href: '/password-strength', name: 'Strength Checker', blurb: 'Test how strong a password is' },
          { href: '/password-entropy-calculator', name: 'Entropy Calculator', blurb: 'Analyze password entropy' },
        ],
      },
    ],
  },
  {
    slug: 'developer',
    href: '/developer',
    label: 'Developer',
    title: 'Developer Generators',
    description:
      'API keys, JWT secrets, UUIDs, tokens, and framework keys for development and production — generated locally, never transmitted.',
    sections: [
      {
        title: 'Keys & tokens',
        tools: [
          { href: '/api-key', name: 'API Key Generator', blurb: 'Custom prefixes & lengths' },
          { href: '/jwt-secret', name: 'JWT Secret', blurb: 'HS256/RS256/ES256 signing keys' },
          { href: '/oauth-token', name: 'OAuth Token', blurb: 'Access & refresh tokens, client secrets' },
          { href: '/ai-key-generator', name: 'AI Key Generator', blurb: 'OpenAI, Anthropic & custom formats' },
          { href: '/webauthn-credential', name: 'WebAuthn Credential', blurb: 'FIDO2 passkey test credentials' },
          { href: '/random-string', name: 'Random String', blurb: 'Secure custom strings' },
          { href: '/vapid-key', name: 'VAPID Key', blurb: 'Web Push key pairs' },
        ],
      },
      {
        title: 'Identifiers & 2FA',
        tools: [
          { href: '/uuid', name: 'UUID Generator', blurb: 'Random UUID v4 & GUIDs' },
          { href: '/totp-secret', name: 'TOTP Secret', blurb: 'Base32 2FA setup keys' },
          { href: '/totp-authenticator', name: 'TOTP Authenticator', blurb: '2FA QR code & secret key' },
          { href: '/totp-generator', name: 'TOTP Code Generator', blurb: 'Calculate current 2FA codes' },
          { href: '/base32-encode', name: 'Base32 Encoder', blurb: 'Text to Base32 encoding' },
          { href: '/credit-card-generator', name: 'Test Credit Cards', blurb: 'Luhn-valid test card numbers' },
        ],
      },
      {
        title: 'Frameworks',
        tools: [
          { href: '/django-secret-key', name: 'Django SECRET_KEY', blurb: 'Production-ready Django keys' },
          { href: '/flask-secret-key', name: 'Flask Secret Key', blurb: 'Flask SECRET_KEY values' },
          { href: '/laravel-key', name: 'Laravel APP_KEY', blurb: 'Laravel encryption keys' },
          { href: '/wordpress-salts', name: 'WordPress Salts', blurb: 'Security keys & salts' },
        ],
      },
    ],
  },
  {
    slug: 'encryption',
    href: '/encryption',
    label: 'Encryption',
    title: 'Encryption Key Generators',
    description:
      'AES keys, RSA key pairs, salts, secrets, and hashing tools — generated locally with the Web Crypto API and never transmitted.',
    sections: [
      {
        title: 'Keys',
        tools: [
          { href: '/encryption-key', name: 'Encryption Keys', blurb: 'AES keys & IVs' },
          { href: '/aes-key', name: 'AES Key', blurb: '128/192/256-bit keys' },
          { href: '/aes-256-key', name: 'AES-256 Key', blurb: '256-bit encryption keys' },
          { href: '/rsa-key', name: 'RSA Key Pairs', blurb: 'Public/private key pairs' },
          { href: '/hmac-key', name: 'HMAC Key', blurb: 'SHA-256/384/512 secrets' },
          { href: '/secret-key', name: 'Secret Key', blurb: 'General-purpose secrets' },
          { href: '/salt', name: 'Salt Generator', blurb: 'Cryptographic salts for hashing' },
        ],
      },
      {
        title: 'SSH, VPN & PGP',
        tools: [
          { href: '/ssh-key', name: 'SSH Keys', blurb: 'Ed25519 & RSA ssh-keygen guide' },
          { href: '/pgp-key', name: 'PGP/GPG Keys', blurb: 'OpenPGP key pairs' },
          { href: '/wireguard-key', name: 'WireGuard Keys', blurb: 'VPN key commands' },
        ],
      },
      {
        title: 'Hashing',
        tools: [
          { href: '/hash-generator', name: 'Hash Generator', blurb: 'SHA-256, SHA-512 & more' },
          { href: '/sha256-generator', name: 'SHA-256 Generator', blurb: 'SHA-256 hashes' },
          { href: '/md5-hash', name: 'MD5 Hash', blurb: 'Text & file MD5 (legacy)' },
          { href: '/bcrypt-generator', name: 'Bcrypt Generator', blurb: 'Password hashing with salt' },
        ],
      },
    ],
  },
]

export function getCategory(slug: string): DirectoryCategory | undefined {
  return TOOL_DIRECTORY.find((category) => category.slug === slug)
}

/** All tool hrefs in a category — used for header nav active states. */
export function categoryHrefs(slug: string): string[] {
  const category = getCategory(slug)
  if (!category) return []
  return [category.href, ...category.sections.flatMap((section) => section.tools.map((tool) => tool.href))]
}
