// Hash Generator Hub Structured Data
// Optimized for "hash generator" keyword (8,900 search volume)

interface HashGeneratorStructuredDataProps {
  pageUrl?: string;
  hashType?: 'hub' | 'sha256' | 'md5' | 'bcrypt' | 'sha1' | 'sha512';
}

export function HashGeneratorStructuredData({ 
  pageUrl = 'https://randomkeygen.com/hash-generator',
  hashType = 'hub'
}: HashGeneratorStructuredDataProps) {
  
  // Main Software Application schema for hash generator hub
  const softwareApplication = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': hashType === 'hub' ? 'Hash Generator Hub' : `${hashType.toUpperCase()} Hash Generator`,
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'Any',
    'description': hashType === 'hub' 
      ? 'Comprehensive hash generator supporting MD5, SHA256, SHA1, SHA512, BCrypt, and more. Generate secure hashes for passwords, data integrity, and cryptographic applications.'
      : `Generate ${hashType.toUpperCase()} hashes for secure password storage, data verification, and cryptographic applications. Fast, secure, browser-based hash generation.`,
    'url': pageUrl,
    'author': {
      '@type': 'Organization',
      'name': 'RandomKeygen',
      'url': 'https://randomkeygen.com'
    },
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'softwareVersion': '2.0',
    'datePublished': '2026-04-06',
    'dateModified': '2026-04-06',
    'inLanguage': 'en',
    'isAccessibleForFree': true,
    'browserRequirements': 'Modern web browser with JavaScript enabled',
    'screenshot': `${pageUrl}/screenshot.png`,
    'featureList': hashType === 'hub' ? [
      'MD5 Hash Generation',
      'SHA256 Hash Generation', 
      'SHA1 Hash Generation',
      'SHA512 Hash Generation',
      'BCrypt Hash Generation',
      'HMAC Hash Generation',
      'File Hash Calculation',
      'Text Hash Generation',
      'Batch Hash Processing',
      'Hash Verification',
      'Multiple Input Formats',
      'Secure Browser-Only Processing'
    ] : [
      `${hashType.toUpperCase()} Hash Generation`,
      'Text and File Input Support',
      'Instant Hash Calculation',
      'Copy to Clipboard',
      'Batch Processing',
      'Hash Verification',
      'Secure Local Processing'
    ],
    'applicationSubCategory': hashType === 'hub' ? [
      'Hash Generator',
      'Cryptographic Tool',
      'Data Integrity Tool',
      'Developer Tool',
      'Security Tool',
      'Password Tool'
    ] : [
      `${hashType.toUpperCase()} Generator`,
      'Hash Generator',
      'Cryptographic Tool',
      'Developer Tool'
    ]
  };

  // FAQ schema for hash generator hub
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is a hash generator?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'A hash generator is a tool that creates fixed-length cryptographic hash values from input data. Hash functions like MD5, SHA256, and BCrypt are used for data integrity verification, password storage, and digital signatures.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Which hash algorithm should I use?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'For password storage, use BCrypt or Argon2. For data integrity and general hashing, use SHA256 or SHA512. Avoid MD5 and SHA1 for security-critical applications as they have known vulnerabilities. For digital signatures, use SHA256 or higher.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is SHA256 better than MD5?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, SHA256 is significantly more secure than MD5. MD5 has known collision vulnerabilities and should not be used for security purposes. SHA256 is part of the SHA-2 family and is currently considered cryptographically secure.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I generate hashes for files?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, our hash generator supports both text input and file uploads. You can generate hashes for any file type to verify integrity, create checksums, or for digital forensics purposes.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What is BCrypt used for?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'BCrypt is specifically designed for password hashing. It includes a salt and is computationally expensive to make brute force attacks difficult. BCrypt is the recommended method for storing user passwords in databases.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Are the hashes generated securely?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, all hash generation happens locally in your browser using the Web Crypto API and proven JavaScript libraries. Your data never leaves your device, ensuring complete privacy and security.'
        }
      }
    ]
  };

  // HowTo schema for hash generation tutorial
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': 'How to Generate Cryptographic Hashes Online',
    'description': 'Learn how to generate MD5, SHA256, BCrypt and other secure hashes for your data',
    'image': `${pageUrl}/howto-image.png`,
    'totalTime': 'PT1M',
    'estimatedCost': {
      '@type': 'MonetaryAmount',
      'currency': 'USD',
      'value': '0'
    },
    'tool': [
      {
        '@type': 'HowToTool',
        'name': 'Hash Generator Hub',
        'url': pageUrl
      }
    ],
    'step': [
      {
        '@type': 'HowToStep',
        'name': 'Choose Hash Algorithm',
        'text': 'Select the hash algorithm you need: SHA256 for general use, BCrypt for passwords, MD5 for legacy compatibility, or SHA512 for maximum security.',
        'image': `${pageUrl}/step1.png`
      },
      {
        '@type': 'HowToStep',
        'name': 'Input Your Data',
        'text': 'Enter your text data or upload a file that you want to hash. The tool supports various input formats including plain text, files, and binary data.',
        'image': `${pageUrl}/step2.png`
      },
      {
        '@type': 'HowToStep',
        'name': 'Generate Hash',
        'text': 'Click the Generate button to create your hash. The result appears immediately and can be copied to clipboard for use in your applications.',
        'image': `${pageUrl}/step3.png`
      },
      {
        '@type': 'HowToStep',
        'name': 'Verify and Use',
        'text': 'Copy your generated hash and use it in your application. You can also verify existing hashes by comparing them with newly generated ones.',
        'image': `${pageUrl}/step4.png`
      }
    ]
  };

  // Article schema for content value
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': hashType === 'hub' 
      ? 'Hash Generator Hub - Generate MD5, SHA256, BCrypt Hashes Online'
      : `${hashType.toUpperCase()} Hash Generator - Create ${hashType.toUpperCase()} Hashes Online`,
    'description': hashType === 'hub'
      ? 'Comprehensive guide to generating cryptographic hashes online. Learn about different hash algorithms, their uses, and security considerations.'
      : `Generate ${hashType.toUpperCase()} hashes online with our free tool. Learn about ${hashType.toUpperCase()} algorithm properties, security, and best practices.`,
    'author': {
      '@type': 'Organization',
      'name': 'RandomKeygen'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'RandomKeygen',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://randomkeygen.com/logo.png'
      }
    },
    'datePublished': '2026-04-06',
    'dateModified': '2026-04-06',
    'mainEntityOfPage': pageUrl,
    'articleSection': 'Cryptography Tools',
    'keywords': hashType === 'hub' ? [
      'hash generator',
      'md5 generator',
      'sha256 generator',
      'bcrypt generator',
      'cryptographic hash',
      'hash function',
      'data integrity',
      'password hashing'
    ] : [
      `${hashType} generator`,
      `${hashType} hash`,
      'hash generator',
      'cryptographic hash',
      'online hash tool'
    ]
  };

  // WebApplication schema for tool functionality
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': hashType === 'hub' ? 'Hash Generator Hub' : `${hashType.toUpperCase()} Generator`,
    'url': pageUrl,
    'applicationCategory': 'CryptographyApplication',
    'operatingSystem': 'Any',
    'browserRequirements': 'JavaScript enabled',
    'permissions': 'none',
    'offers': {
      '@type': 'Offer',
      'price': '0'
    },
    'featureList': hashType === 'hub' ? [
      'Multiple hash algorithms',
      'File and text input',
      'Instant generation',
      'Browser-based security'
    ] : [
      `${hashType.toUpperCase()} hash generation`,
      'Secure processing',
      'Copy to clipboard',
      'File support'
    ]
  };

  // Breadcrumb navigation
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'RandomKeygen',
        'item': 'https://randomkeygen.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Crypto Tools',
        'item': 'https://randomkeygen.com/crypto-tools'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': hashType === 'hub' ? 'Hash Generator Hub' : `${hashType.toUpperCase()} Generator`,
        'item': pageUrl
      }
    ]
  };

  const schemas = [
    softwareApplication,
    webAppSchema,
    breadcrumbSchema,
    howToSchema,
    articleSchema,
    faqSchema
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </>
  );
}

// Hash comparison table structured data
export function HashComparisonStructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Table',
    'name': 'Hash Algorithm Comparison Table',
    'description': 'Comparison of popular cryptographic hash algorithms including security, speed, and use cases',
    'about': 'Hash algorithms comparison',
    'mainEntity': {
      '@type': 'Dataset',
      'name': 'Hash Algorithm Properties',
      'description': 'Security properties and characteristics of different hash functions'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}

export default HashGeneratorStructuredData;