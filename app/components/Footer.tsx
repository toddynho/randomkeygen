import Link from 'next/link'

const TOOL_CATEGORIES = [
  {
    title: 'Passwords',
    links: [
      { href: '/password', label: 'Password Generator' },
      { href: '/passphrase', label: 'Passphrase' },
      { href: '/pronounceable-password', label: 'Pronounceable' },
      { href: '/master-password', label: 'Master Password' },
      { href: '/bulk-password-generator', label: 'Bulk Generator' },
      { href: '/password-strength', label: 'Strength Checker' },
    ],
  },
  {
    title: 'Password Options',
    links: [
      { href: '/password/8-character', label: '8 Character' },
      { href: '/password/16-character', label: '16 Character' },
      { href: '/password-generator/no-special-characters', label: 'No Symbols' },
      { href: '/password-generator/letters-only', label: 'Letters Only' },
      { href: '/pin-generator', label: 'PIN Codes' },
      { href: '/wifi-password', label: 'WiFi Password' },
    ],
  },
  {
    title: 'Recovery',
    links: [
      { href: '/backup-codes', label: 'Backup Codes' },
      { href: '/recovery-key', label: 'Recovery Key' },
      { href: '/temporary-password', label: 'Temporary' },
      { href: '/gaming-password', label: 'Gaming' },
    ],
  },
  {
    title: 'Developer',
    links: [
      { href: '/api-key', label: 'API Keys' },
      { href: '/jwt-secret', label: 'JWT Secret' },
      { href: '/uuid', label: 'UUID' },
      { href: '/random-string', label: 'Random String' },
      { href: '/totp-secret', label: 'TOTP/2FA' },
    ],
  },
  {
    title: 'Encryption',
    links: [
      { href: '/encryption-key', label: 'Encryption Keys' },
      { href: '/aes-key', label: 'AES Keys' },
      { href: '/rsa-key', label: 'RSA Keys' },
      { href: '/hash-generator', label: 'Hash Generator' },
      { href: '/salt', label: 'Salt' },
    ],
  },
  {
    title: 'Keys & More',
    links: [
      { href: '/ssh-key', label: 'SSH Keys' },
      { href: '/pgp-key', label: 'PGP/GPG Keys' },
      { href: '/django-secret-key', label: 'Django' },
      { href: '/laravel-key', label: 'Laravel' },
      { href: '/wordpress-salts', label: 'WordPress' },
    ],
  },
]

const RESOURCES = [
  { href: '/guides', label: 'Security Guides' },
  { href: '/guides/how-randomkeygen-works', label: 'How Local Generation Works' },
  { href: '/guides/choosing-a-password-manager', label: 'Choose a Password Manager' },
  { href: '/guides/password-manager-vs-browser', label: 'Browser vs Password Manager' },
  { href: '/guides/password-security-best-practices', label: 'Password Best Practices' },
  { href: '/guides/api-key-best-practices', label: 'API Key Best Practices' },
  { href: '/guides/jwt-security', label: 'JWT Security' },
  { href: '/credit-card-generator', label: 'Test Credit Cards' },
]

const FRIENDS = [
  { href: 'https://jsonlint.com', label: 'JSONLint' },
  { href: 'https://colors.to', label: 'Colors.to' },
  { href: 'https://design.dev', label: 'Design.dev' },
]

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--background)] py-9">
      <div className="page-container">
        {/* Tools Grid */}
        <div className="mb-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {TOOL_CATEGORIES.map((category) => (
            <div key={category.title}>
              <h3 className="section-label mb-3">
                {category.title}
              </h3>
              <ul className="space-y-2 text-14">
                {category.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Resources & Friends */}
        <div className="grid grid-cols-2 gap-8 border-t border-[var(--border)] py-7 sm:grid-cols-3">
          <div>
            <h3 className="section-label mb-3">
              Resources
            </h3>
            <ul className="space-y-2 text-14">
              {RESOURCES.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="section-label mb-3">
              Friends
            </h3>
            <ul className="space-y-2 text-14">
              {FRIENDS.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-label mb-3">
              Legal
            </h3>
            <ul className="space-y-2 text-14">
              <li>
                <Link
                  href="/privacy"
                  className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="https://x.com/toddo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Built by @toddo
                </a>
              </li>
              <li>
                <a
                  href="https://ready.dev?ref=randomkeygen.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Hosted by ready.dev
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-2 border-t border-[var(--border)] pt-[18px] text-xs text-[var(--muted)] md:flex-row md:items-center">
          <span>
            © RandomKeygen ·{' '}
            <a
              href="https://github.com/toddynho/randomkeygen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              GitHub
            </a>
          </span>
          <span>Generated locally with crypto.getRandomValues() — generated values are never transmitted.</span>
        </div>
      </div>
    </footer>
  )
}
