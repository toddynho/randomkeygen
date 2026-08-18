import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'
import { GuideRows } from '@/app/components/guide/GuideRows'

const cardClass = 'rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]'
const cardTitleClass = 'mb-2 font-semibold text-[var(--foreground)]'
const cardListClass = 'list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--body)]'

export default function JwtTokenGeneratorGuideClient() {
  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Developer security</p>
        <h1>JWT Token Generator Complete Guide</h1>
        <p className="guide-deck">
          Master JWT token generation with this comprehensive developer guide. Learn structure,
          algorithms, security best practices, and avoid common pitfalls.
        </p>
      </header>

      <h2 id="quick-start">Quick Start: Generate Your First JWT</h2>
      <p>
        Need a JWT token right now? Use our <Link href="/jwt-secret">JWT Token Generator</Link> for instant results.
      </p>
      <GuideCodeBlock
        label="Example JWT"
        code={'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'}
      />

      <h2 id="what-is-jwt">What is a JWT Token?</h2>
      <p>
        JSON Web Token (JWT) is a compact, URL-safe means of representing claims between two parties.
        It&apos;s become the industry standard for stateless authentication and authorization in modern web applications.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h3 className={cardTitleClass}>JWT Advantages</h3>
          <ul className={cardListClass}>
            <li>Stateless - no server storage needed</li>
            <li>Self-contained - includes user info</li>
            <li>URL-safe encoding</li>
            <li>Cross-domain support</li>
            <li>Mobile-friendly</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Common Misconceptions</h3>
          <ul className={cardListClass}>
            <li>JWTs are NOT encrypted by default</li>
            <li>NOT suitable for storing sensitive data</li>
            <li>NOT automatically secure</li>
            <li>Size matters - can get large</li>
            <li>Harder to revoke than sessions</li>
          </ul>
        </div>
      </div>

      <h2 id="jwt-structure">JWT Token Structure</h2>
      <p>
        Every JWT token consists of three parts separated by dots:
      </p>

      <h3>1. Header (Algorithm &amp; Token Type)</h3>
      <GuideCodeBlock
        label="Header"
        code={JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2)}
      />
      <p>
        Specifies the signing algorithm (HS256, RS256, etc.) and token type.
      </p>

      <h3>2. Payload (Claims)</h3>
      <GuideCodeBlock
        label="Payload"
        code={JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          iat: 1516239022,
          exp: 1516242622,
          role: 'admin',
        }, null, 2)}
      />
      <p><strong>Standard Claims:</strong></p>
      <GuideRows compact items={[
        ['iss', 'issuer'],
        ['sub', 'subject'],
        ['aud', 'audience'],
        ['exp', 'expiration'],
        ['iat', 'issued at'],
      ]} />
      <p><strong>Custom Claims:</strong></p>
      <ul>
        <li>User ID, username</li>
        <li>User roles, permissions</li>
        <li>Custom metadata</li>
        <li>Application-specific data</li>
      </ul>

      <h3>3. Signature (Security Verification)</h3>
      <GuideCodeBlock
        label="Signature"
        code={`HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  your-256-bit-secret
)`}
      />
      <p>
        Cryptographically signs the header and payload to ensure the token hasn&apos;t been tampered with.
      </p>

      <h2 id="algorithms">JWT Signing Algorithms</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Symmetric (HMAC)</h3>
          <ul className={cardListClass}>
            <li><strong>HS256</strong> - Most common, fast, single secret key</li>
            <li><strong>HS384</strong> - Longer hash, more secure</li>
            <li><strong>HS512</strong> - Longest hash, maximum security</li>
          </ul>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            <strong>Best for:</strong> Internal APIs, same organization, simple setup
          </p>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Asymmetric (RSA/ECDSA)</h3>
          <ul className={cardListClass}>
            <li><strong>RS256</strong> - RSA with SHA-256, widely supported</li>
            <li><strong>ES256</strong> - ECDSA, smaller signatures</li>
            <li><strong>PS256</strong> - RSA-PSS, enhanced security</li>
          </ul>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            <strong>Best for:</strong> Multi-service, public APIs, microservices
          </p>
        </div>
      </div>
      <h3>Algorithm Selection Guide</h3>
      <GuideRows items={[
        ['Simple Apps', 'Use HS256 for monolithic applications'],
        ['Microservices', 'Use RS256 for distributed systems'],
        ['High Security', 'Use ES256 or PS256 for maximum security'],
      ]} />

      <h2 id="best-practices">JWT Security Best Practices</h2>
      <h3>Security Essentials</h3>
      <GuideCallout kind="success" label="Do:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li><strong>Always use HTTPS</strong> - Prevent token interception</li>
          <li><strong>Set short expiration</strong> - Limit damage if compromised</li>
          <li><strong>Validate algorithm</strong> - Prevent algorithm confusion</li>
          <li><strong>Use strong secrets</strong> - Minimum 256-bit for HS256</li>
          <li><strong>Implement refresh tokens</strong> - For long-lived sessions</li>
        </ul>
      </GuideCallout>
      <h3>Security Pitfalls</h3>
      <GuideCallout kind="danger" label="Don't:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li><strong>Don&apos;t store sensitive data</strong> - JWTs are readable</li>
          <li><strong>Don&apos;t ignore expiration</strong> - Always validate &apos;exp&apos;</li>
          <li><strong>Don&apos;t trust user input</strong> - Validate all claims</li>
          <li><strong>Don&apos;t use &apos;none&apos; algorithm</strong> - Security vulnerability</li>
          <li><strong>Don&apos;t store in localStorage</strong> - XSS vulnerable</li>
        </ul>
      </GuideCallout>
      <h3>Recommended Token Lifetimes</h3>
      <GuideRows compact items={[
        ['15min', 'Access Tokens'],
        ['7 days', 'Refresh Tokens'],
        ['1 hour', 'API Keys'],
        ['24 hours', 'Internal Services'],
      ]} />

      <h2 id="use-cases">Common JWT Use Cases</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Authentication</h3>
          <p className="mb-2 text-sm leading-6 text-[var(--body)]">
            User login verification and session management
          </p>
          <code className="text-xs">POST /login → JWT with user claims</code>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Authorization</h3>
          <p className="mb-2 text-sm leading-6 text-[var(--body)]">
            Role-based access control and permissions
          </p>
          <code className="text-xs">{`{ "role": "admin", "permissions": ["read", "write"] }`}</code>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Single Sign-On (SSO)</h3>
          <p className="mb-2 text-sm leading-6 text-[var(--body)]">
            Cross-domain authentication for multiple apps
          </p>
          <code className="text-xs">app1.com ← JWT → app2.com</code>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>API Access</h3>
          <p className="mb-2 text-sm leading-6 text-[var(--body)]">
            Secure API endpoints and rate limiting
          </p>
          <code className="text-xs">Authorization: Bearer eyJhbGc...</code>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Mobile Apps</h3>
          <p className="mb-2 text-sm leading-6 text-[var(--body)]">
            Stateless authentication for mobile clients
          </p>
          <code className="text-xs">localStorage.setItem(&apos;jwt&apos;, token)</code>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Microservices</h3>
          <p className="mb-2 text-sm leading-6 text-[var(--body)]">
            Service-to-service authentication
          </p>
          <code className="text-xs">service-mesh auth with RS256</code>
        </div>
      </div>

      <h2 id="implementation-examples">Implementation Examples</h2>
      <h3>Node.js with jsonwebtoken</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`const jwt = require('jsonwebtoken');

// Generate JWT
const token = jwt.sign(
  { userId: 123, role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// Verify JWT
const decoded = jwt.verify(token, process.env.JWT_SECRET);`}
      />
      <h3>Python with PyJWT</h3>
      <GuideCodeBlock
        label="Python"
        code={`import jwt
from datetime import datetime, timedelta

# Generate JWT
token = jwt.encode({
    'user_id': 123,
    'role': 'admin',
    'exp': datetime.utcnow() + timedelta(minutes=15)
}, secret_key, algorithm='HS256')

# Verify JWT
decoded = jwt.decode(token, secret_key, algorithms=['HS256'])`}
      />
      <h3>Frontend JavaScript</h3>
      <GuideCodeBlock
        label="JavaScript"
        code={`// Store JWT
const storeToken = (token) => {
  // Secure httpOnly cookie (preferred)
  document.cookie = \`jwt=\${token}; secure; httponly; samesite=strict\`;

  // Or localStorage (less secure but convenient)
  localStorage.setItem('jwt', token);
};

// Send with requests
fetch('/api/protected', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});`}
      />

      <h2 id="debugging">Debugging &amp; Testing JWTs</h2>
      <h3>Debugging Tools</h3>
      <GuideRows items={[
        ['jwt.io', 'Online JWT decoder and validator'],
        ['jwt.ms', 'JWT analyzer and debugger'],
        ['Browser DevTools', 'Network tab to inspect tokens'],
      ]} />
      <h3>Testing Strategies</h3>
      <GuideRows items={[
        ['Expiration Testing', 'Test tokens with past expiration dates'],
        ['Signature Verification', 'Test with wrong secrets and algorithms'],
        ['Malformed Tokens', 'Test invalid base64 and JSON'],
      ]} />
      <h3>Common JWT Errors</h3>
      <GuideRows items={[
        ['Token expired', "Check 'exp' claim and server time"],
        ['Invalid signature', 'Verify secret key and algorithm match'],
        ['Malformed JWT', 'Check for proper base64 encoding'],
      ]} />

      <h2 id="advanced-topics">Advanced JWT Topics</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Refresh Tokens</h3>
          <p className="mb-2 text-sm leading-6 text-[var(--body)]">
            Long-lived tokens to obtain new access tokens without re-authentication.
          </p>
          <ul className={cardListClass}>
            <li>Store securely (httpOnly cookies)</li>
            <li>Implement rotation policy</li>
            <li>Support revocation</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>JWT Encryption (JWE)</h3>
          <p className="mb-2 text-sm leading-6 text-[var(--body)]">
            Encrypt JWT payload for additional security when transmitting sensitive data.
          </p>
          <ul className={cardListClass}>
            <li>A256GCM encryption</li>
            <li>RSA-OAEP key encryption</li>
            <li>Nested JWT structures</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>JWT Blacklisting</h3>
          <p className="mb-2 text-sm leading-6 text-[var(--body)]">
            Revoke JWTs before expiration for security incidents or user logout.
          </p>
          <ul className={cardListClass}>
            <li>Redis blacklist cache</li>
            <li>Short expiration times</li>
            <li>JTI (JWT ID) tracking</li>
          </ul>
        </div>
      </div>

      <section className="guide-related" aria-labelledby="related-tools-title">
        <h2 id="related-tools-title">Ready to Generate Your JWT Tokens?</h2>
        <p className="mb-4 text-16 leading-7 text-[var(--body)]">
          Put your knowledge into practice with our secure JWT token generator.
          Create, validate, and test JWT tokens instantly.
        </p>
        <div className="guide-card-grid">
          <Link href="/jwt-secret"><strong>Generate JWT Tokens Now →</strong><span>Secure generation, multiple algorithms, no server storage, instant results.</span></Link>
          <Link href="/guides/jwt-security"><strong>JWT Security Best Practices →</strong><span>Algorithms, secret keys, common attacks, and safe storage.</span></Link>
        </div>
      </section>
    </article>
  )
}
