import type { MetadataRoute } from 'next'

interface SitemapRoute {
  path: string
  priority: number
}

// Keep this list limited to canonical, indexable app routes. Redirect sources
// (for example /uuid-generator) intentionally do not belong in the sitemap.
const routes: SitemapRoute[] = [
  // Primary navigation
  { path: '', priority: 1.0 },
  { path: '/passwords', priority: 0.8 },
  { path: '/developer', priority: 0.8 },
  { path: '/encryption', priority: 0.8 },
  { path: '/keygen-hub', priority: 0.8 },

  // Password generators
  { path: '/password', priority: 0.9 },
  { path: '/passphrase', priority: 0.9 },
  { path: '/pronounceable-password', priority: 0.9 },
  { path: '/memorable-password', priority: 0.9 },
  { path: '/master-password', priority: 0.9 },
  { path: '/bulk-password-generator', priority: 0.9 },
  { path: '/password-strength', priority: 0.9 },
  { path: '/password-entropy-calculator', priority: 0.9 },
  { path: '/password/8-character', priority: 0.8 },
  { path: '/password/12-character', priority: 0.8 },
  { path: '/password/16-character', priority: 0.8 },
  { path: '/password/20-character', priority: 0.8 },
  { path: '/password/24-character', priority: 0.8 },
  { path: '/password/32-character', priority: 0.8 },
  { path: '/password-generator/no-special-characters', priority: 0.8 },
  { path: '/password-generator/letters-only', priority: 0.8 },
  { path: '/password-generator/numbers-only', priority: 0.8 },
  { path: '/gaming-password', priority: 0.8 },
  { path: '/temporary-password', priority: 0.8 },
  { path: '/wifi-password', priority: 0.8 },
  { path: '/pin-generator', priority: 0.8 },
  { path: '/backup-codes', priority: 0.8 },
  { path: '/recovery-key', priority: 0.8 },

  // Developer tools
  { path: '/ai-key-generator', priority: 0.9 },
  { path: '/api-key', priority: 0.9 },
  { path: '/jwt-secret', priority: 0.9 },
  { path: '/oauth-token', priority: 0.8 },
  { path: '/uuid', priority: 0.9 },
  { path: '/random-string', priority: 0.9 },
  { path: '/base32-encode', priority: 0.8 },
  { path: '/totp-secret', priority: 0.8 },
  { path: '/totp-authenticator', priority: 0.8 },
  { path: '/totp-generator', priority: 0.8 },
  { path: '/bcrypt-generator', priority: 0.8 },
  { path: '/username-generator', priority: 0.8 },
  { path: '/credit-card-generator', priority: 0.7 },

  // Framework secrets
  { path: '/django-secret-key', priority: 0.8 },
  { path: '/laravel-key', priority: 0.8 },
  { path: '/flask-secret-key', priority: 0.8 },
  { path: '/wordpress-salts', priority: 0.8 },

  // Hashing and encryption
  { path: '/hash-generator', priority: 0.9 },
  { path: '/sha256-generator', priority: 0.8 },
  { path: '/md5-hash', priority: 0.8 },
  { path: '/encryption-key', priority: 0.9 },
  { path: '/aes-key', priority: 0.8 },
  { path: '/aes-256-key', priority: 0.8 },
  { path: '/rsa-key', priority: 0.8 },
  { path: '/hmac-key', priority: 0.8 },
  { path: '/salt', priority: 0.8 },
  { path: '/secret-key', priority: 0.8 },
  { path: '/ssh-key', priority: 0.8 },
  { path: '/pgp-key', priority: 0.7 },
  { path: '/webauthn-credential', priority: 0.8 },
  { path: '/wireguard-key', priority: 0.7 },
  { path: '/vapid-key', priority: 0.7 },

  // Guides
  { path: '/guides', priority: 0.8 },
  { path: '/guides/api-key-best-practices', priority: 0.7 },
  { path: '/guides/choosing-a-password-manager', priority: 0.8 },
  { path: '/guides/common-jwt-mistakes', priority: 0.7 },
  { path: '/guides/encryption-explained', priority: 0.7 },
  { path: '/guides/hash-generator-complete-guide', priority: 0.7 },
  { path: '/guides/how-password-managers-work', priority: 0.7 },
  { path: '/guides/how-randomkeygen-works', priority: 0.8 },
  { path: '/guides/jwt-microservices', priority: 0.7 },
  { path: '/guides/jwt-playground-tutorial', priority: 0.7 },
  { path: '/guides/jwt-security', priority: 0.7 },
  { path: '/guides/jwt-security-checklist', priority: 0.7 },
  { path: '/guides/jwt-token-generator-guide', priority: 0.7 },
  { path: '/guides/jwt-token-validation', priority: 0.7 },
  { path: '/guides/jwt-vs-jwe', priority: 0.7 },
  { path: '/guides/keygen-comparison-guide', priority: 0.7 },
  { path: '/guides/oauth-security', priority: 0.7 },
  { path: '/guides/password-manager-vs-browser', priority: 0.8 },
  { path: '/guides/password-security-best-practices', priority: 0.7 },
  { path: '/guides/router-password-setup', priority: 0.7 },
  { path: '/guides/ssh-setup', priority: 0.7 },
  { path: '/guides/uuid-version-comparison', priority: 0.7 },
  { path: '/guides/uuid-vs-sequential', priority: 0.7 },

  // Legal
  { path: '/privacy', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://randomkeygen.com'

  return routes.map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: 'monthly',
    priority,
  }))
}
