import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideChecklist } from '@/app/components/guide/GuideChecklist'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'
import { GuideRows } from '@/app/components/guide/GuideRows'

const CHECKLIST_ITEMS = [
  'Always use jwt.verify(), never jwt.decode() for authentication',
  'Explicitly specify allowed algorithms (prevent alg=none attacks)',
  'Validate all standard claims (exp, nbf, iat, iss, aud)',
  'Implement proper error handling without information leakage',
  'Use appropriate clock tolerance (30-60 seconds maximum)',
  'Validate custom claims based on your application needs',
  'Implement token blacklist for revocation scenarios',
  'Use secure key storage for signing secrets',
  'Regularly rotate signing keys',
  'Log validation failures for security monitoring',
  'Rate limit token validation attempts',
  'Validate tokens on every protected request',
]

export const metadata: Metadata = {
  title: 'How to Validate JWT Tokens Securely: Complete Guide | RandomKeygen',
  description: 'Learn how to properly validate JWT tokens including signature verification, claims validation, and preventing common security vulnerabilities.',
  keywords: ['JWT validation', 'JWT security', 'token validation', 'JWT verify', 'JSON Web Token', 'JWT best practices', 'JWT claims'],
  openGraph: {
    title: 'How to Validate JWT Tokens Securely: Complete Guide',
    description: 'Step-by-step guide to secure JWT validation with code examples and security considerations.',
    url: 'https://randomkeygen.com/guides/jwt-token-validation',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/jwt-token-validation',
  },
}

export default function JwtValidationPage() {
  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Developer security</p>
        <h1>How to Validate JWT Tokens Securely</h1>
        <p className="guide-deck">
          A comprehensive guide to properly validating JSON Web Tokens, including signature verification,
          claims validation, and preventing common security vulnerabilities.
        </p>
      </header>

      <h2 id="why-validation-matters">Why Proper JWT Validation Matters</h2>
      <p>
        JWT validation is your primary defense against token-based attacks. Improper validation
        can lead to authentication bypass, privilege escalation, and unauthorized access. This
        guide covers every aspect of secure JWT validation.
      </p>

      <GuideCallout kind="danger" label="Critical Security Warning:">
        Never trust the contents of a JWT without
        properly validating its signature and claims. A decoded JWT without verification is just
        untrustworthy data that anyone could have created.
      </GuideCallout>

      <h2 id="validation-process">The JWT Validation Process</h2>

      <h3>Validation Steps Overview</h3>
      <ol className="list-decimal pl-6">
        <li><strong>Format validation</strong> - Ensure proper JWT structure</li>
        <li><strong>Header validation</strong> - Check algorithm and token type</li>
        <li><strong>Signature verification</strong> - Cryptographic validation</li>
        <li><strong>Claims validation</strong> - Verify standard and custom claims</li>
        <li><strong>Context validation</strong> - Application-specific checks</li>
      </ol>

      <h3>Common Validation Vulnerabilities</h3>
      <ul>
        <li><strong>Algorithm confusion attacks</strong> - Accepting unexpected algorithms</li>
        <li><strong>Signature bypass</strong> - Using decode instead of verify</li>
        <li><strong>Missing expiration checks</strong> - Accepting expired tokens</li>
        <li><strong>Insufficient claim validation</strong> - Not checking issuer/audience</li>
        <li><strong>Time validation issues</strong> - Ignoring nbf, iat claims</li>
      </ul>

      <h2 id="format-validation">Step 1: Format Validation</h2>

      <h3>JWT Structure Requirements</h3>
      <p>A valid JWT must have exactly three parts separated by dots:</p>

      <GuideCodeBlock
        label="JWT format"
        code={`// Valid JWT format
header.payload.signature

// Example
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
      />

      <h3>Basic Format Validation</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`function validateJWTFormat(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Token must be a non-empty string');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format: must have 3 parts');
  }

  // Validate each part is valid base64url
  for (let i = 0; i < 3; i++) {
    try {
      atob(parts[i].replace(/-/g, '+').replace(/_/g, '/'));
    } catch (e) {
      throw new Error(\`Invalid JWT part \${i + 1}: not valid base64url\`);
    }
  }

  return true;
}`}
      />

      <GuideCallout kind="warning" label="Note:">
        Most JWT libraries handle format validation automatically,
        but it's important to understand what's happening under the hood.
      </GuideCallout>

      <h2 id="header-validation">Step 2: Header Validation</h2>

      <h3>Critical Header Checks</h3>
      <p>The JWT header contains metadata about the token that must be validated:</p>

      <GuideCodeBlock
        label="Node.js"
        code={`function validateJWTHeader(header) {
  // Parse the header
  const headerObj = JSON.parse(atob(header));

  // 1. Check token type
  if (headerObj.typ && headerObj.typ !== 'JWT') {
    throw new Error(\`Unexpected token type: \${headerObj.typ}\`);
  }

  // 2. Validate algorithm
  const allowedAlgorithms = ['HS256', 'HS384', 'HS512', 'RS256', 'ES256'];
  if (!allowedAlgorithms.includes(headerObj.alg)) {
    throw new Error(\`Unsupported algorithm: \${headerObj.alg}\`);
  }

  // 3. Prevent algorithm confusion attacks
  if (headerObj.alg === 'none') {
    throw new Error('Algorithm "none" is not allowed');
  }

  return headerObj;
}`}
      />

      <h3>Algorithm Whitelist Approach</h3>
      <p>Recommended algorithm configurations:</p>
      <GuideRows items={[
        ['HS256', 'For single-service applications'],
        ['RS256', 'For distributed services with public key verification'],
        ['ES256', 'For high-performance applications'],
      ]} />

      <h2 id="signature-verification">Step 3: Signature Verification</h2>

      <h3>HMAC Signature Verification (HS256)</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Secure HMAC verification
function verifyHMACToken(token, secret) {
  try {
    // Always specify allowed algorithms explicitly
    const payload = jwt.verify(token, secret, {
      algorithms: ['HS256'],  // Explicit algorithm whitelist
      clockTolerance: 30,     // Allow 30 seconds clock drift
    });

    return payload;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error(\`Invalid token: \${error.message}\`);
    }
    throw error;
  }
}`}
      />

      <h3>RSA Signature Verification (RS256)</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`const fs = require('fs');

function verifyRSAToken(token, publicKeyPath) {
  try {
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

    const payload = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],  // Only allow RS256
      issuer: 'https://your-auth-server.com',
      audience: 'your-api-id',
    });

    return payload;
  } catch (error) {
    // Handle specific error types
    switch (error.name) {
      case 'TokenExpiredError':
        throw new Error('Token expired');
      case 'NotBeforeError':
        throw new Error('Token not yet active');
      case 'JsonWebTokenError':
        throw new Error(\`Token validation failed: \${error.message}\`);
      default:
        throw new Error('Unknown token validation error');
    }
  }
}`}
      />

      <GuideCallout kind="success" label="Pro tip:">
        Never use <code>jwt.decode()</code> in production. It returns
        the payload without verification. Always use <code>jwt.verify()</code> which validates
        the signature before returning the payload.
      </GuideCallout>

      <h2 id="claims-validation">Step 4: Claims Validation</h2>

      <h3>Standard Claims Validation</h3>
      <p>JWT defines several standard claims that should be validated:</p>

      <GuideRows compact items={[
        ['exp', 'Expiration time (Unix timestamp)'],
        ['nbf', 'Not before time (Unix timestamp)'],
        ['iat', 'Issued at time (Unix timestamp)'],
        ['iss', 'Issuer (who created the token)'],
        ['aud', 'Audience (who the token is for)'],
        ['sub', 'Subject (user/resource identifier)'],
        ['jti', 'JWT ID (unique token identifier)'],
      ]} />

      <h3>Comprehensive Claims Validation</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`function validateJWTClaims(payload, options = {}) {
  const now = Math.floor(Date.now() / 1000);
  const clockTolerance = options.clockTolerance || 30;

  // 1. Expiration validation (exp)
  if (payload.exp && payload.exp < (now - clockTolerance)) {
    throw new Error('Token has expired');
  }

  // 2. Not before validation (nbf)
  if (payload.nbf && payload.nbf > (now + clockTolerance)) {
    throw new Error('Token is not yet active');
  }

  // 3. Issued at validation (iat)
  if (payload.iat && payload.iat > (now + clockTolerance)) {
    throw new Error('Token issued in the future');
  }

  // 4. Issuer validation (iss)
  if (options.issuer && payload.iss !== options.issuer) {
    throw new Error(\`Invalid issuer: expected \${options.issuer}, got \${payload.iss}\`);
  }

  // 5. Audience validation (aud)
  if (options.audience) {
    if (Array.isArray(payload.aud)) {
      if (!payload.aud.includes(options.audience)) {
        throw new Error(\`Invalid audience: token not intended for \${options.audience}\`);
      }
    } else if (payload.aud !== options.audience) {
      throw new Error(\`Invalid audience: expected \${options.audience}, got \${payload.aud}\`);
    }
  }

  // 6. Subject validation (sub)
  if (options.subject && payload.sub !== options.subject) {
    throw new Error(\`Invalid subject: expected \${options.subject}, got \${payload.sub}\`);
  }

  return true;
}`}
      />

      <h3>Custom Claims Validation</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`function validateCustomClaims(payload, requirements) {
  // Validate user roles
  if (requirements.requiredRoles) {
    const userRoles = payload.roles || [];
    const hasRequired = requirements.requiredRoles.some(role =>
      userRoles.includes(role)
    );
    if (!hasRequired) {
      throw new Error('Insufficient permissions');
    }
  }

  // Validate permissions
  if (requirements.requiredPermissions) {
    const userPermissions = payload.permissions || [];
    const hasAllPermissions = requirements.requiredPermissions.every(perm =>
      userPermissions.includes(perm)
    );
    if (!hasAllPermissions) {
      throw new Error('Missing required permissions');
    }
  }

  // Validate scope (OAuth2)
  if (requirements.requiredScope) {
    const tokenScope = (payload.scope || '').split(' ');
    const hasScope = requirements.requiredScope.every(scope =>
      tokenScope.includes(scope)
    );
    if (!hasScope) {
      throw new Error('Insufficient scope');
    }
  }

  // Validate token type
  if (requirements.tokenType && payload.token_type !== requirements.tokenType) {
    throw new Error(\`Invalid token type: expected \${requirements.tokenType}\`);
  }
}`}
      />

      <h2 id="context-validation">Step 5: Context Validation</h2>

      <h3>Application-Specific Validation</h3>
      <p>Beyond standard claims, you may need application-specific validation:</p>

      <GuideCodeBlock
        label="Node.js"
        code={`async function validateContextualClaims(payload, request) {
  // 1. IP address validation
  if (payload.ip && request.ip !== payload.ip) {
    throw new Error('Token bound to different IP address');
  }

  // 2. User agent validation
  if (payload.user_agent && request.headers['user-agent'] !== payload.user_agent) {
    console.warn('User agent mismatch - possible token theft');
    // Decide whether to reject or just log
  }

  // 3. Session validation
  if (payload.session_id) {
    const sessionValid = await validateSession(payload.session_id);
    if (!sessionValid) {
      throw new Error('Session has been revoked');
    }
  }

  // 4. Rate limiting
  if (payload.rate_limit) {
    await checkRateLimit(payload.sub, payload.rate_limit);
  }

  // 5. Feature flags
  if (payload.features) {
    const enabledFeatures = await getEnabledFeatures(payload.sub);
    payload.features = payload.features.filter(feature =>
      enabledFeatures.includes(feature)
    );
  }
}`}
      />

      <h3>Token Blacklist Validation</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`const redis = require('redis');
const client = redis.createClient();

async function validateTokenNotBlacklisted(payload) {
  // Check if token is blacklisted by JTI
  if (payload.jti) {
    const isBlacklisted = await client.get(\`blacklist:\${payload.jti}\`);
    if (isBlacklisted) {
      throw new Error('Token has been revoked');
    }
  }

  // Check if all user tokens are revoked
  if (payload.sub) {
    const userTokensRevoked = await client.get(\`revoked_user:\${payload.sub}\`);
    if (userTokensRevoked && parseInt(userTokensRevoked) > payload.iat) {
      throw new Error('All user tokens have been revoked');
    }
  }
}`}
      />

      <h2 id="complete-implementation">Complete Validation Implementation</h2>

      <h3>Production-Ready Validation Function</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`const jwt = require('jsonwebtoken');

class JWTValidator {
  constructor(options) {
    this.secret = options.secret;
    this.publicKey = options.publicKey;
    this.algorithm = options.algorithm || 'HS256';
    this.issuer = options.issuer;
    this.audience = options.audience;
    this.clockTolerance = options.clockTolerance || 30;
  }

  async validate(token, additionalOptions = {}) {
    try {
      // Step 1: Basic format validation
      this.validateFormat(token);

      // Step 2: Signature verification with claims validation
      const payload = this.verifySignature(token, additionalOptions);

      // Step 3: Additional custom validations
      await this.validateCustomClaims(payload, additionalOptions);

      // Step 4: Context-specific validation
      await this.validateContext(payload, additionalOptions);

      return {
        valid: true,
        payload,
        header: jwt.decode(token, { complete: true }).header
      };

    } catch (error) {
      return {
        valid: false,
        error: error.message,
        type: this.classifyError(error)
      };
    }
  }

  validateFormat(token) {
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token format');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT structure');
    }
  }

  verifySignature(token, options) {
    const verificationOptions = {
      algorithms: [this.algorithm],
      issuer: this.issuer,
      audience: this.audience,
      clockTolerance: this.clockTolerance,
      ...options.jwtOptions
    };

    const key = this.algorithm.startsWith('HS') ? this.secret : this.publicKey;
    return jwt.verify(token, key, verificationOptions);
  }

  async validateCustomClaims(payload, options) {
    // Implement your custom claim validation logic
    if (options.requiredRoles) {
      const userRoles = payload.roles || [];
      if (!options.requiredRoles.some(role => userRoles.includes(role))) {
        throw new Error('Insufficient roles');
      }
    }
  }

  async validateContext(payload, options) {
    // Blacklist check
    if (options.checkBlacklist && payload.jti) {
      // Implement blacklist checking
    }

    // Session validation
    if (options.validateSession && payload.session_id) {
      // Implement session validation
    }
  }

  classifyError(error) {
    if (error.name === 'TokenExpiredError') return 'EXPIRED';
    if (error.name === 'NotBeforeError') return 'NOT_ACTIVE';
    if (error.name === 'JsonWebTokenError') return 'INVALID';
    return 'UNKNOWN';
  }
}

// Usage example
const validator = new JWTValidator({
  secret: process.env.JWT_SECRET,
  algorithm: 'HS256',
  issuer: 'https://your-app.com',
  audience: 'your-api'
});

// Middleware usage
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  const result = await validator.validate(token, {
    requiredRoles: ['user'],
    checkBlacklist: true
  });

  if (!result.valid) {
    return res.status(401).json({ error: result.error });
  }

  req.user = result.payload;
  next();
}`}
      />

      <h2 id="error-handling">Error Handling Best Practices</h2>

      <h3>Specific Error Types</h3>
      <GuideRows compact items={[
        ['TokenExpiredError', 'Token has expired (401)'],
        ['NotBeforeError', 'Token not yet active (401)'],
        ['JsonWebTokenError', 'Invalid signature/format (401)'],
        ['InvalidIssuer', 'Wrong issuer (401)'],
        ['InvalidAudience', 'Wrong audience (401)'],
        ['InsufficientScope', 'Missing permissions (403)'],
      ]} />

      <h3>Secure Error Responses</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`function handleValidationError(error, req, res) {
  // Log detailed error for debugging (server-side only)
  console.error('JWT Validation Error:', {
    error: error.message,
    token: req.headers.authorization?.substring(0, 20) + '...',
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  // Return generic error to client (don't leak internals)
  switch (error.type) {
    case 'EXPIRED':
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });

    case 'NOT_ACTIVE':
      return res.status(401).json({
        error: 'Token not yet valid',
        code: 'TOKEN_NOT_ACTIVE'
      });

    case 'INVALID':
      return res.status(401).json({
        error: 'Invalid token',
        code: 'TOKEN_INVALID'
      });

    default:
      return res.status(401).json({
        error: 'Authentication failed',
        code: 'AUTH_FAILED'
      });
  }
}`}
      />

      <h2 id="performance">Performance Optimizations</h2>

      <h3>Caching Strategies</h3>
      <ul>
        <li><strong>Public key caching:</strong> Cache RSA/ECDSA public keys from JWKS endpoints</li>
        <li><strong>Validation result caching:</strong> Cache valid tokens with short TTL</li>
        <li><strong>Blacklist caching:</strong> Cache blacklist checks in memory</li>
      </ul>

      <h3>Key Rotation Handling</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`class JWKSValidator {
  constructor(jwksUri) {
    this.jwksUri = jwksUri;
    this.keyCache = new Map();
    this.lastFetch = 0;
  }

  async getKey(kid) {
    // Refresh keys if cache is stale
    if (Date.now() - this.lastFetch > 300000) { // 5 minutes
      await this.refreshKeys();
    }

    const key = this.keyCache.get(kid);
    if (!key) {
      // Try one more refresh in case of new key
      await this.refreshKeys();
      return this.keyCache.get(kid);
    }

    return key;
  }

  async refreshKeys() {
    try {
      const response = await fetch(this.jwksUri);
      const jwks = await response.json();

      for (const key of jwks.keys) {
        this.keyCache.set(key.kid, key);
      }

      this.lastFetch = Date.now();
    } catch (error) {
      console.error('Failed to refresh JWKS:', error);
    }
  }
}`}
      />

      <h2 id="security-checklist">Security Checklist</h2>
      <p>JWT validation security checklist:</p>
      <GuideChecklist items={CHECKLIST_ITEMS} storageKey="rk-jwt-validation-checklist" />

      <section className="guide-related" aria-labelledby="related-tools-title">
        <h2 id="related-tools-title">Related tools</h2>
        <div className="guide-card-grid">
          <Link href="/jwt-secret"><strong>JWT Secret Generator →</strong><span>Generate secure keys for JWT signing</span></Link>
          <Link href="/guides/jwt-security"><strong>JWT Security Best Practices →</strong><span>Complete JWT security guide</span></Link>
          <Link href="/guides/jwt-vs-jwe"><strong>JWT vs JWE Guide →</strong><span>Understanding JWT and JWE differences</span></Link>
          <Link href="/rsa-key"><strong>RSA Key Generator →</strong><span>Generate RSA key pairs for RS256 tokens</span></Link>
        </div>
      </section>
    </article>
  )
}
