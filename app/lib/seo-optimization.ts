// SEO and Technical Optimization Utilities
// Supports the strategic goals for JWT, Hash Generator, and Keygen ranking

import { Metadata } from 'next';

// Metadata generators for high-priority pages
export function generateJWTTokenMetadata(customTitle?: string, customDescription?: string): Metadata {
  const title = customTitle || 'JWT Token Generator - Create JSON Web Tokens Online | RandomKeygen';
  const description = customDescription || 'Generate JSON Web Tokens (JWT) with custom payloads and signing algorithms. Supports HS256, RS256, and more. Free JWT generator and validator tool.';
  
  return {
    title,
    description,
    keywords: [
      'jwt token generator',
      'json web token', 
      'jwt online',
      'jwt generator',
      'token generator',
      'jwt validator',
      'jwt signing',
      'authentication token',
      'hs256',
      'rs256',
      'jwt payload',
      'jwt header',
      'jwt decode'
    ],
    openGraph: {
      title,
      description,
      url: 'https://randomkeygen.com/jwt-token',
      type: 'website',
      siteName: 'RandomKeygen',
      images: [
        {
          url: 'https://randomkeygen.com/jwt-token/og-image.png',
          width: 1200,
          height: 630,
          alt: 'JWT Token Generator Tool',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://randomkeygen.com/jwt-token/twitter-image.png'],
      creator: '@randomkeygen'
    },
    alternates: {
      canonical: 'https://randomkeygen.com/jwt-token'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    other: {
      'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
      'bing-site-verification': process.env.BING_SITE_VERIFICATION || ''
    }
  };
}

export function generateHashGeneratorMetadata(hashType: 'hub' | 'sha256' | 'md5' | 'bcrypt' = 'hub'): Metadata {
  const titleMap = {
    hub: 'Hash Generator Hub - MD5, SHA256, BCrypt, SHA1 Online | RandomKeygen',
    sha256: 'SHA256 Hash Generator - Create SHA256 Hashes Online | RandomKeygen',
    md5: 'MD5 Hash Generator - Generate MD5 Hashes Online | RandomKeygen',
    bcrypt: 'BCrypt Hash Generator - Create BCrypt Hashes for Passwords | RandomKeygen'
  };

  const descriptionMap = {
    hub: 'Generate MD5, SHA256, BCrypt, SHA1, SHA512, and other cryptographic hashes online. Free hash generator with file support and secure browser-based processing.',
    sha256: 'Generate SHA256 hashes for data integrity verification and digital signatures. Free online SHA256 generator with text and file input support.',
    md5: 'Generate MD5 hashes online for checksums and legacy applications. Fast MD5 hash generator with support for text and file inputs.',
    bcrypt: 'Generate secure BCrypt hashes for password storage. BCrypt hash generator with customizable rounds for optimal security in web applications.'
  };

  const keywordsMap = {
    hub: [
      'hash generator',
      'md5 generator',
      'sha256 generator', 
      'bcrypt generator',
      'cryptographic hash',
      'hash function',
      'online hash tool',
      'hash calculator',
      'checksum generator',
      'data integrity',
      'file hash',
      'password hashing'
    ],
    sha256: ['sha256 generator', 'sha256 hash', 'sha256 online', 'sha2 hash', 'secure hash'],
    md5: ['md5 generator', 'md5 hash', 'md5 online', 'md5 checksum', 'file md5'],
    bcrypt: ['bcrypt generator', 'bcrypt hash', 'password hash', 'bcrypt online', 'secure password storage']
  };

  const title = titleMap[hashType];
  const description = descriptionMap[hashType];
  const keywords = keywordsMap[hashType];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://randomkeygen.com/${hashType === 'hub' ? 'hash-generator' : `${hashType}-generator`}`,
      type: 'website',
      siteName: 'RandomKeygen',
      images: [
        {
          url: `https://randomkeygen.com/hash-generator/${hashType}-og-image.png`,
          width: 1200,
          height: 630,
          alt: `${hashType.toUpperCase()} Hash Generator Tool`,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://randomkeygen.com/hash-generator/${hashType}-twitter.png`]
    },
    alternates: {
      canonical: `https://randomkeygen.com/${hashType === 'hub' ? 'hash-generator' : `${hashType}-generator`}`
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

export function generateKeygenMetadata(): Metadata {
  return {
    title: 'Keygen - Random Key Generator | Secure API Keys, Passwords & Tokens',
    description: 'Generate secure API keys, encryption keys, passwords, and tokens with RandomKeygen. Cryptographically secure random key generation for developers and security professionals.',
    keywords: [
      'keygen',
      'key generator',
      'random key generator',
      'api key generator',
      'encryption key generator',
      'secure key generation',
      'cryptographic keys',
      'password generator',
      'token generator',
      'random password',
      'secure password',
      'key generation tool'
    ],
    openGraph: {
      title: 'Keygen - Secure Random Key Generator',
      description: 'Generate cryptographically secure keys, passwords, and tokens instantly. Free key generation tool for developers.',
      url: 'https://randomkeygen.com',
      type: 'website',
      siteName: 'RandomKeygen',
      images: [
        {
          url: 'https://randomkeygen.com/keygen-og-image.png',
          width: 1200,
          height: 630,
          alt: 'RandomKeygen - Secure Key Generator',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Keygen - Secure Random Key Generator',
      description: 'Generate cryptographically secure keys, passwords, and tokens instantly',
      images: ['https://randomkeygen.com/keygen-twitter-image.png']
    },
    alternates: {
      canonical: 'https://randomkeygen.com'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

// Internal linking optimization
export const INTERNAL_LINK_STRATEGIES = {
  // Strategic linking for pages approaching page 1
  jwt: [
    { href: '/jwt-secret', anchor: 'JWT Secret Generator', context: 'signing keys' },
    { href: '/api-key', anchor: 'API Key Generator', context: 'authentication' },
    { href: '/guides/jwt-security', anchor: 'JWT Security Guide', context: 'best practices' },
    { href: '/oauth-token', anchor: 'OAuth Token Generator', context: 'oauth integration' }
  ],
  
  // Hash ecosystem linking
  hash: [
    { href: '/sha256-generator', anchor: 'SHA256 Generator', context: 'secure hashing' },
    { href: '/bcrypt-generator', anchor: 'BCrypt Generator', context: 'password hashing' },
    { href: '/password-strength', anchor: 'Password Strength Checker', context: 'security validation' },
    { href: '/encryption-key', anchor: 'Encryption Key Generator', context: 'cryptographic keys' }
  ],
  
  // Keygen ecosystem for homepage optimization
  keygen: [
    { href: '/api-key', anchor: 'API Key Generator', context: 'application keys' },
    { href: '/encryption-key', anchor: 'Encryption Key Generator', context: 'data protection' },
    { href: '/jwt-secret', anchor: 'JWT Secret Generator', context: 'token signing' },
    { href: '/password', anchor: 'Password Generator', context: 'secure passwords' },
    { href: '/uuid', anchor: 'UUID Generator', context: 'unique identifiers' },
    { href: '/random-string', anchor: 'Random String Generator', context: 'custom strings' }
  ]
};

// Site speed optimization hints
export const PERFORMANCE_HINTS = {
  criticalPages: [
    '/jwt-token',  // Page 1 push priority
    '/hash-generator', // 8,900 volume opportunity
    '/', // Keygen top 3 push
    '/password', // High traffic retention
    '/api-key' // Strategic support
  ],
  
  prefetchResources: {
    '/jwt-token': [
      '/_next/static/chunks/jwt-generator.js',
      '/_next/static/chunks/crypto-utils.js',
      '/api/jwt-algorithms'
    ],
    '/hash-generator': [
      '/_next/static/chunks/hash-algorithms.js', 
      '/_next/static/chunks/file-processor.js'
    ],
    '/': [
      '/_next/static/chunks/homepage.js',
      '/_next/static/chunks/key-generators.js'
    ]
  },
  
  lazyLoadThreshold: {
    'below-fold-components': '50px',
    'secondary-tools': '100px', 
    'footer-links': '200px'
  }
};

// Core Web Vitals optimization strategies per page
export const CORE_WEB_VITALS_OPTIMIZATION = {
  // Largest Contentful Paint (LCP) optimizations
  LCP: {
    '/jwt-token': {
      preloadImage: '/jwt-token/hero-image.webp',
      criticalCSS: 'jwt-generator-critical.css',
      removeRenderBlocking: ['non-critical-jwt.css']
    },
    '/hash-generator': {
      preloadImage: '/hash-generator/hero-image.webp',
      criticalCSS: 'hash-generator-critical.css'
    },
    '/': {
      preloadImage: '/homepage-hero.webp',
      criticalCSS: 'homepage-critical.css'
    }
  },
  
  // First Input Delay (FID) optimizations
  FID: {
    codesplitting: {
      '/jwt-token': ['jwt-validation', 'jwt-algorithms'],
      '/hash-generator': ['hash-algorithms', 'file-processing']
    },
    deferNonCritical: [
      'analytics.js',
      'social-widgets.js',
      'feedback-forms.js'
    ]
  },
  
  // Cumulative Layout Shift (CLS) optimizations
  CLS: {
    reservedSpaces: {
      'generator-output': 'min-height: 120px',
      'tool-form': 'min-height: 400px',
      'related-links': 'min-height: 300px'
    },
    fontDisplay: 'swap',
    imageAspectRatios: true
  }
};

// Technical SEO automation helpers
export function generateCanonicalUrl(path: string): string {
  const baseUrl = 'https://randomkeygen.com';
  return `${baseUrl}${path === '/' ? '' : path}`;
}

export function generateSitemapEntry(path: string, priority: number = 0.8): object {
  return {
    url: generateCanonicalUrl(path),
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority
  };
}

// JSON-LD structured data generators
export function generateToolStructuredData(
  name: string, 
  description: string, 
  url: string,
  category: string = 'DeveloperApplication'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': name,
    'description': description,
    'url': url,
    'applicationCategory': category,
    'operatingSystem': 'Any',
    'isAccessibleForFree': true,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'author': {
      '@type': 'Organization', 
      'name': 'RandomKeygen',
      'url': 'https://randomkeygen.com'
    }
  };
}

export default {
  generateJWTTokenMetadata,
  generateHashGeneratorMetadata,
  generateKeygenMetadata,
  INTERNAL_LINK_STRATEGIES,
  PERFORMANCE_HINTS,
  CORE_WEB_VITALS_OPTIMIZATION
};