// JWT Token Generator Structured Data
// Critical for search engine optimization and "jwt token generator" ranking

interface JWTStructuredDataProps {
  pageUrl?: string;
  includeArticle?: boolean;
  includeFAQ?: boolean;
}

export function JWTStructuredData({ 
  pageUrl = 'https://randomkeygen.com/jwt-token',
  includeArticle = true,
  includeFAQ = true 
}: JWTStructuredDataProps) {
  
  // Software Application schema - primary for tool ranking
  const softwareApplication = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'JWT Token Generator',
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'Any',
    'description': 'Generate JSON Web Tokens (JWT) with custom payloads, headers, and signing algorithms. Supports HS256, HS384, HS512, RS256, and more. Free online JWT generator and validator.',
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
    'featureList': [
      'JWT Token Generation',
      'Custom JWT Payload Creation', 
      'Multiple Signing Algorithms (HS256, HS384, HS512, RS256, RS384, RS512)',
      'JWT Token Validation',
      'Header Customization',
      'Claims Validation',
      'Offline Token Generation',
      'No Server Storage - Browser Only',
      'RFC 7519 Compliant',
      'Developer-Friendly Interface'
    ],
    'applicationSubCategory': [
      'JWT Generator',
      'Token Generator', 
      'Authentication Tool',
      'Developer Tool',
      'Security Tool'
    ]
  };

  // Article schema for SEO content value
  const article = includeArticle ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': 'JWT Token Generator - Create JSON Web Tokens Online',
    'description': 'Comprehensive guide to generating JWT tokens online with our free tool. Learn about JWT structure, algorithms, and security best practices.',
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
    'articleSection': 'Developer Tools',
    'keywords': [
      'JWT token generator',
      'JSON web token',
      'JWT online',
      'token generator',
      'JWT validator',
      'authentication token',
      'JWT signing',
      'developer tools'
    ]
  } : null;

  // FAQ schema for long-tail keyword capture
  const faq = includeFAQ ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is a JWT token generator?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'A JWT token generator is a tool that creates JSON Web Tokens (JWT) with custom payloads, headers, and signing algorithms. JWTs are used for secure information transmission between parties and are commonly used for authentication and authorization.'
        }
      },
      {
        '@type': 'Question', 
        'name': 'How do I generate a JWT token online?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'To generate a JWT token online: 1) Enter your payload data (claims), 2) Choose a signing algorithm (HS256, HS512, RS256, etc.), 3) Provide a secret key or private key for signing, 4) Click Generate to create your JWT token. Our tool generates tokens entirely in your browser for security.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What algorithms does the JWT generator support?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Our JWT generator supports all standard algorithms including HMAC algorithms (HS256, HS384, HS512) and RSA algorithms (RS256, RS384, RS512). HS256 is the most commonly used for symmetric signing, while RS256 is popular for asymmetric signing.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is it safe to generate JWT tokens online?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, our JWT generator is safe because all token generation happens entirely in your browser using JavaScript. No data is sent to our servers. Your secret keys and payload data never leave your device. For production use, always use strong, unique secret keys.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I validate existing JWT tokens?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, our JWT tool includes token validation functionality. You can paste an existing JWT token and verify its signature, decode the payload, and check expiration times. This is useful for debugging and testing JWT implementations.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What is the difference between HS256 and RS256?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'HS256 uses HMAC with SHA-256 and requires a shared secret key for both signing and verification. RS256 uses RSA with SHA-256 and uses a private key for signing and a public key for verification. RS256 is more secure for distributed systems where you need to verify tokens without sharing secrets.'
        }
      }
    ]
  } : null;

  // HowTo schema for tutorial content
  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': 'How to Generate JWT Tokens Online',
    'description': 'Step-by-step guide to creating JSON Web Tokens using our free online generator',
    'image': `${pageUrl}/tutorial-image.png`,
    'totalTime': 'PT2M',
    'estimatedCost': {
      '@type': 'MonetaryAmount',
      'currency': 'USD',
      'value': '0'
    },
    'tool': [
      {
        '@type': 'HowToTool',
        'name': 'JWT Token Generator',
        'url': pageUrl
      }
    ],
    'step': [
      {
        '@type': 'HowToStep',
        'name': 'Enter Payload Data',
        'text': 'Add your JWT claims and payload data in the payload section. Include user information, permissions, expiration time, and other custom claims.',
        'image': `${pageUrl}/step1.png`
      },
      {
        '@type': 'HowToStep', 
        'name': 'Choose Signing Algorithm',
        'text': 'Select your preferred signing algorithm. HS256 is recommended for most use cases. Use RS256 if you need asymmetric key pairs.',
        'image': `${pageUrl}/step2.png`
      },
      {
        '@type': 'HowToStep',
        'name': 'Add Secret Key',
        'text': 'Enter a strong secret key for signing your JWT. For production use, ensure your secret is cryptographically random and sufficiently long.',
        'image': `${pageUrl}/step3.png`
      },
      {
        '@type': 'HowToStep',
        'name': 'Generate Token',
        'text': 'Click the Generate button to create your JWT token. The token will appear in the output section and can be copied for use in your application.',
        'image': `${pageUrl}/step4.png`
      }
    ]
  };

  // BreadcrumbList for navigation context
  const breadcrumbs = {
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
        'name': 'Developer Tools',
        'item': 'https://randomkeygen.com/developer-tools'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'JWT Token Generator',
        'item': pageUrl
      }
    ]
  };

  // Combine all schemas
  const schemas = [
    softwareApplication,
    breadcrumbs,
    howTo,
    ...(article ? [article] : []),
    ...(faq ? [faq] : [])
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
    </>
  );
}

// Simplified version for other JWT pages
export function JWTSimpleStructuredData({ 
  title, 
  description, 
  url 
}: { 
  title: string; 
  description: string; 
  url: string; 
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': title,
    'description': description,
    'url': url,
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'Any',
    'isAccessibleForFree': true,
    'author': {
      '@type': 'Organization',
      'name': 'RandomKeygen'
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

export default JWTStructuredData;