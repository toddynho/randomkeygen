import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideChecklist } from '@/app/components/guide/GuideChecklist'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'
import { GuideRows } from '@/app/components/guide/GuideRows'

const CHECKLIST_ITEMS = [
  'Use a well-maintained JWT library',
  'Generate secrets with a CSPRNG (at least 256 bits)',
  'Explicitly specify allowed algorithms',
  'Always verify signatures before trusting payloads',
  'Set appropriate expiration times',
  'Validate issuer and audience claims',
  'Use HttpOnly cookies for browser storage',
  'Implement refresh token rotation',
  'Have a token revocation strategy',
  'Never store sensitive data in JWT payloads',
]

export const metadata: Metadata = {
  title: 'JWT Security Best Practices: Complete Guide | RandomKeygen',
  description: 'Learn JWT security best practices including choosing algorithms, secret management, token validation, and preventing common vulnerabilities like alg=none attacks.',
  keywords: ['JWT security', 'JSON Web Token', 'JWT best practices', 'JWT secret', 'token authentication', 'JWT vulnerabilities', 'HS256', 'RS256'],
  openGraph: {
    title: 'JWT Security Best Practices: Complete Guide',
    description: 'Learn JWT security best practices including algorithms, secrets, and preventing vulnerabilities.',
    url: 'https://randomkeygen.com/guides/jwt-security',
  },
  alternates: { canonical: 'https://randomkeygen.com/guides/jwt-security' },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'JWT Security Best Practices',
  description: 'A practical guide to implementing JSON Web Tokens securely.',
  dateModified: '2026-08-18',
  author: { '@type': 'Organization', name: 'RandomKeygen' },
  publisher: { '@type': 'Organization', name: 'RandomKeygen', url: 'https://randomkeygen.com' },
  mainEntityOfPage: 'https://randomkeygen.com/guides/jwt-security',
}

function NumberedHeading({ number, children }: { number: number; children: ReactNode }) {
  return <h3 className="guide-numbered-heading"><span>{number}</span>{children}</h3>
}

export default function JwtSecurityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <article className="guide-article">
          <header className="guide-article-header">
            <p className="eyebrow">Guide · Developer security</p>
            <h1>JWT Security Best Practices</h1>
            <p className="guide-deck">
              Everything you need to know about implementing JSON Web Tokens securely — algorithms, secret keys, common attacks, and safe storage.
            </p>
            <p className="guide-byline">Updated August 2026 · Reviewed by the RandomKeygen team</p>
          </header>

          <h2 id="understanding">Understanding JWT security</h2>
          <p>
            JSON Web Tokens (JWTs) are widely used for authentication and authorization, but they are also frequently misconfigured. This guide covers the essential security practices for working with JWTs.
          </p>
          <GuideCallout kind="warning" label="Important:">
            JWTs are signed, not encrypted. Anyone can read the payload — the signature only ensures it has not been tampered with. Never put sensitive data in a JWT without additional encryption.
          </GuideCallout>

          <h2 id="algorithms">Choosing the right algorithm</h2>
          <h3>Symmetric algorithms (HMAC)</h3>
          <p>Use HMAC algorithms when the same party signs and verifies tokens.</p>
          <GuideRows items={[
            ['HS256', 'HMAC with SHA-256 (256-bit key minimum)'],
            ['HS384', 'HMAC with SHA-384 (384-bit key minimum)'],
            ['HS512', 'HMAC with SHA-512 (512-bit key minimum)'],
          ]} />

          <h3>Asymmetric algorithms (RSA / ECDSA)</h3>
          <p>Use asymmetric algorithms when different parties sign and verify tokens, such as across microservices.</p>
          <GuideRows items={[
            ['RS256', 'RSA with SHA-256 (2048-bit key minimum)'],
            ['ES256', 'ECDSA with P-256 curve (recommended)'],
            ['ES384', 'ECDSA with P-384 curve'],
          ]} />
          <GuideCallout kind="success" label="Recommendation:">
            for most applications, use <code>HS256</code> with a 256-bit secret, or <code>ES256</code> for asymmetric signing. ES256 offers strong security with smaller keys and signatures than RSA.
          </GuideCallout>

          <h2 id="secret-keys">Secret key requirements</h2>
          <p>For HMAC algorithms, your secret key should be:</p>
          <ul>
            <li>At least as long as the hash output (256 bits for HS256)</li>
            <li>Generated using a cryptographically secure random number generator</li>
            <li>Unique per environment (development, staging, and production)</li>
          </ul>
          <GuideCodeBlock
            label="Terminal"
            code={`# Good: generate a secure 256-bit secret
openssl rand -base64 32

# Example output (DO NOT USE THIS!)
# K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=`}
          />
          <GuideCallout kind="danger" label="Never use:">
            short secrets, dictionary words, application names, or predictable values such as <code>&quot;secret&quot;</code>, <code>&quot;jwt-secret&quot;</code>, or <code>&quot;your-256-bit-secret&quot;</code>.
          </GuideCallout>
          <p className="guide-inline-cta">Need a key right now? <Link href="/jwt-secret">Generate a JWT secret</Link> — created locally, never transmitted.</p>

          <h2 id="vulnerabilities">Common vulnerabilities &amp; prevention</h2>
          <NumberedHeading number={1}>Algorithm confusion (alg=none)</NumberedHeading>
          <p>Attackers may try to change the algorithm to <code>none</code> or switch between symmetric and asymmetric algorithms.</p>
          <GuideCodeBlock
            label="Node.js"
            code={`// VULNERABLE: accepts any algorithm
jwt.verify(token, secret);

// SECURE: explicitly specify allowed algorithms
jwt.verify(token, secret, { algorithms: ['HS256'] });`}
          />

          <NumberedHeading number={2}>Missing signature verification</NumberedHeading>
          <p>Always verify the signature before trusting token contents.</p>
          <GuideCodeBlock
            label="Node.js"
            code={`// VULNERABLE: decodes without verification
const payload = jwt.decode(token);

// SECURE: verifies signature first
const payload = jwt.verify(token, secret);`}
          />

          <NumberedHeading number={3}>Key confusion attack</NumberedHeading>
          <p>When using RS256, attackers may try to verify with the public key as an HMAC secret.</p>
          <GuideCodeBlock
            label="Node.js"
            code={`// VULNERABLE: could be tricked into HMAC verification
jwt.verify(token, publicKey);

// SECURE: explicitly require RS256
jwt.verify(token, publicKey, { algorithms: ['RS256'] });`}
          />

          <NumberedHeading number={4}>Missing expiration</NumberedHeading>
          <p>Tokens without expiration never become invalid.</p>
          <GuideCodeBlock
            label="Node.js"
            segments={[
              { text: '// Always include expiration\n', tone: 'secure' },
              { text: "const token = jwt.sign(\n  { userId: 123 },\n  secret,\n  { expiresIn: '1h' }  " },
              { text: "// or use 'exp' claim directly", tone: 'comment' },
              { text: '\n);' },
            ]}
          />

          <h2 id="validation">Token validation checklist</h2>
          <p>Always validate these claims when verifying a JWT:</p>
          <GuideRows compact items={[
            ['Signature', 'Must be valid for the specified algorithm'],
            ['exp', 'Token must not be expired'],
            ['nbf', 'Token must be active (not before)'],
            ['iss', 'Must match the expected issuer'],
            ['aud', 'Must include your application (audience)'],
            ['iat', 'Issued-at should not be in the future'],
          ]} />
          <GuideCodeBlock
            label="Node.js"
            code={`// Comprehensive validation
jwt.verify(token, secret, {
  algorithms: ['HS256'],
  issuer: 'https://yourapp.com',
  audience: 'your-api',
  clockTolerance: 30,  // 30 second clock skew
});`}
          />

          <h2 id="lifetime">Token lifetime &amp; refresh</h2>
          <GuideRows items={[
            ['Access tokens', '15 minutes to 1 hour'],
            ['Refresh tokens', '7–30 days (stored securely)'],
            ['ID tokens', '5–15 minutes'],
          ]} />
          <h3>Refresh token strategy</h3>
          <ul>
            <li>Use short-lived access tokens with longer-lived refresh tokens</li>
            <li>Store refresh tokens securely in HttpOnly cookies or secure storage</li>
            <li>Rotate refresh tokens by issuing a new one on every use</li>
            <li>Maintain a token blacklist or use token families for revocation</li>
          </ul>

          <h2 id="storage">Storage best practices</h2>
          <p>In browser applications, where you keep a token determines how exposed it is. Options ranked by security:</p>
          <GuideRows items={[
            ['1', 'HttpOnly cookies — best protection against XSS'],
            ['2', 'In-memory — good security, but lost on refresh'],
            ['3', 'sessionStorage — tab-specific and cleared on close'],
            ['4', 'localStorage — vulnerable to XSS (avoid)'],
          ]} />
          <GuideCodeBlock
            label="Cookie configuration"
            code={`// Secure cookie settings
res.cookie('token', jwt, {
  httpOnly: true,      // prevents JavaScript access
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 3600000,     // 1 hour
  path: '/',
});`}
          />

          <h2 id="revocation">Token revocation</h2>
          <p>JWTs are stateless by design, making revocation challenging. Consider these approaches:</p>
          <ul>
            <li><strong>Short expiration</strong> — tokens naturally expire quickly</li>
            <li><strong>Token blacklist</strong> — store revoked token IDs using the <code>jti</code> claim</li>
            <li><strong>Token versioning</strong> — increment the user&apos;s token version on logout</li>
            <li><strong>Refresh token revocation</strong> — revoke refresh tokens to prevent new access tokens</li>
          </ul>
          <GuideCallout kind="success" label="Pro tip:">
            for high-security applications, consider opaque tokens that reference server-side sessions. This enables instant revocation at the cost of a data lookup per request.
          </GuideCallout>

          <h2 id="checklist">Implementation checklist</h2>
          <GuideChecklist items={CHECKLIST_ITEMS} storageKey="rk-jwt-checklist" />

          <section className="guide-related" aria-labelledby="related-tools-title">
            <h2 id="related-tools-title">Related tools</h2>
            <div className="guide-card-grid">
              <Link href="/jwt-secret"><strong>JWT Secret Generator →</strong><span>Generate secure signing keys for HS256, HS384, and HS512.</span></Link>
              <Link href="/rsa-key"><strong>RSA Key Generator →</strong><span>Generate key pairs for RS256, RS384, and RS512.</span></Link>
              <Link href="/secret-key"><strong>Secret Key Generator →</strong><span>Generate secure general-purpose secrets.</span></Link>
              <Link href="/guides/api-key-best-practices"><strong>API Key Best Practices →</strong><span>Read the guide to secure API token management.</span></Link>
            </div>
          </section>
      </article>
    </>
  )
}
