// Single source of truth for guide chrome + the /guides index.
// `title` is the display/breadcrumb title, `deck` the card one-liner
// (condensed from each guide's page metadata description).

export interface GuideMeta {
  title: string
  readTime: string
  category: string
  deck: string
}

export const GUIDE_META: Record<string, GuideMeta> = {
  'api-key-best-practices': {
    title: 'API Key Security Best Practices',
    readTime: '10 min read',
    category: 'Developer security',
    deck: 'Generate, store, rotate, and manage API keys securely.',
  },
  'choosing-a-password-manager': {
    title: 'How to Choose a Password Manager',
    readTime: '12 min read',
    category: 'Passwords',
    deck: 'An evidence-based checklist comparing 1Password, Bitwarden, Proton Pass, Apple Passwords, and KeePassXC.',
  },
  'common-jwt-mistakes': {
    title: 'Common JWT Implementation Mistakes',
    readTime: '14 min read',
    category: 'Developer security',
    deck: 'The most common JWT mistakes developers make — and how to fix them.',
  },
  'encryption-explained': {
    title: 'Encryption Explained',
    readTime: '11 min read',
    category: 'Encryption',
    deck: 'Symmetric vs asymmetric, AES key sizes, and choosing the right encryption.',
  },
  'hash-generator-complete-guide': {
    title: 'The Complete Guide to Hash Generators',
    readTime: '15 min read',
    category: 'Encryption',
    deck: 'When to use MD5, SHA-256, SHA-512, and bcrypt for passwords and integrity.',
  },
  'how-password-managers-work': {
    title: 'How Password Managers Work',
    readTime: '12 min read',
    category: 'Passwords',
    deck: 'Zero-knowledge encryption, master passwords, and how vault keys are derived.',
  },
  'how-randomkeygen-works': {
    title: 'How RandomKeygen Works',
    readTime: '8 min read',
    category: 'Security & privacy',
    deck: 'How the Web Crypto API generates values locally — and how to verify it yourself.',
  },
  'jwt-microservices': {
    title: 'JWT Authentication in Microservices',
    readTime: '18 min read',
    category: 'Developer security',
    deck: 'Token propagation, validation strategies, and key management across services.',
  },
  'jwt-playground-tutorial': {
    title: 'JWT Playground Tutorial',
    readTime: '12 min read',
    category: 'Developer security',
    deck: 'Hands-on JWT: structure, creating tokens, and verifying signatures.',
  },
  'jwt-security-checklist': {
    title: 'JWT Security Checklist',
    readTime: '10 min read',
    category: 'Developer security',
    deck: 'Essential best practices and configurations for secure JWT implementations.',
  },
  'jwt-security': {
    title: 'JWT Security Best Practices',
    readTime: '12 min read',
    category: 'Developer security',
    deck: 'Algorithms, secret keys, common attacks, and safe storage for JWTs.',
  },
  'jwt-token-generator-guide': {
    title: 'JWT Token Generator Guide',
    readTime: '14 min read',
    category: 'Developer security',
    deck: 'JWT structure, algorithms, and pitfalls with practical examples.',
  },
  'jwt-token-validation': {
    title: 'JWT Token Validation',
    readTime: '16 min read',
    category: 'Developer security',
    deck: 'Signature verification, claims validation, and preventing common vulnerabilities.',
  },
  'jwt-vs-jwe': {
    title: 'JWT vs JWE',
    readTime: '11 min read',
    category: 'Developer security',
    deck: 'Signing vs encryption: when to use each and how they differ.',
  },
  'keygen-comparison-guide': {
    title: 'RandomKeygen Comparison Guide',
    readTime: '10 min read',
    category: 'Security & privacy',
    deck: 'Online vs offline key generators — security trade-offs and which fits your needs.',
  },
  'oauth-security': {
    title: 'OAuth Security Best Practices',
    readTime: '16 min read',
    category: 'Developer security',
    deck: 'Common OAuth vulnerabilities, secure flows, and token storage strategies.',
  },
  'password-manager-vs-browser': {
    title: 'Password Manager vs Browser Storage',
    readTime: '12 min read',
    category: 'Passwords',
    deck: 'Browser password storage vs dedicated managers, compared by security and features.',
  },
  'password-security-best-practices': {
    title: 'Password Security Best Practices',
    readTime: '12 min read',
    category: 'Passwords',
    deck: 'Length, complexity, 2FA, and the mistakes that put accounts at risk.',
  },
  'router-password-setup': {
    title: 'Router Password Setup Guide',
    readTime: '10 min read',
    category: 'Passwords',
    deck: 'Step-by-step WiFi password setup for Netgear, Linksys, TP-Link, ASUS, and more.',
  },
  'ssh-setup': {
    title: 'SSH Key Setup Guide',
    readTime: '14 min read',
    category: 'Developer security',
    deck: 'Generate, configure, and troubleshoot SSH keys for GitHub, GitLab, and servers.',
  },
  'uuid-version-comparison': {
    title: 'UUID Version Comparison',
    readTime: '10 min read',
    category: 'Developer security',
    deck: 'v1 vs v4 vs v5 — differences, use cases, and security implications.',
  },
  'uuid-vs-sequential': {
    title: 'UUID vs Sequential IDs',
    readTime: '10 min read',
    category: 'Developer security',
    deck: 'Performance, security, and scalability trade-offs between ID strategies.',
  },
}

/** Index-page ordering: reading-path order within each category. */
export const GUIDE_ORDER: string[] = [
  'how-randomkeygen-works',
  'password-security-best-practices',
  'choosing-a-password-manager',
  'how-password-managers-work',
  'password-manager-vs-browser',
  'router-password-setup',
  'api-key-best-practices',
  'jwt-security',
  'jwt-security-checklist',
  'common-jwt-mistakes',
  'jwt-token-generator-guide',
  'jwt-token-validation',
  'jwt-vs-jwe',
  'jwt-microservices',
  'jwt-playground-tutorial',
  'oauth-security',
  'ssh-setup',
  'uuid-version-comparison',
  'uuid-vs-sequential',
  'encryption-explained',
  'hash-generator-complete-guide',
  'keygen-comparison-guide',
]
