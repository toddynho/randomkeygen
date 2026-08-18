import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideChecklist } from '@/app/components/guide/GuideChecklist'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'
import { GuideRows } from '@/app/components/guide/GuideRows'

const CHECKLIST_ITEMS = [
  '[Critical] Enforce HTTPS Only',
  '[Critical] Use Cryptographically Strong Secrets',
  '[High] Set Short Token Expiration',
  '[Critical] Validate and Specify Algorithm',
  '[Critical] Never Store Sensitive Data in JWT',
  '[Critical] Always Verify Token Signature',
  '[Critical] Validate Token Expiration',
  '[High] Validate Token Issuer (iss)',
  '[High] Validate Token Audience (aud)',
  "[Medium] Validate 'Not Before' Claim (nbf)",
  '[High] Use Secure Storage Methods',
  '[High] Use Authorization Header',
  '[High] Implement CSRF Protection',
  '[Medium] Configure CORS Properly',
  '[High] Implement Refresh Token Strategy',
  '[High] Implement Token Blacklisting',
  '[Medium] Implement Rate Limiting',
  '[Medium] Implement Security Logging',
  '[Medium] Set Security Headers',
  '[Critical] Secure Environment Configuration',
  '[High] Use Different Secrets Per Environment',
  '[Medium] Test Security Scenarios',
  '[Medium] Regular Security Audits',
  '[Medium] Document Security Decisions',
]

const cardClass = 'rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]'
const cardTitleClass = 'mb-2 font-semibold text-[var(--foreground)]'
const cardListClass = 'list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--body)]'

const severityBadge = {
  critical: 'bg-[var(--chip-danger-bg)] text-[var(--danger-text)] border border-[var(--chip-danger-border)]',
  high: 'bg-[var(--orange-bg)] text-[var(--orange-text)] border border-[var(--orange-border)]',
  medium: 'bg-[var(--warn-bg)] text-[var(--warn-strong)] border border-[var(--warn-border)]',
} as const

function ItemHeading({ title, priority }: { title: string; priority: 'critical' | 'high' | 'medium' }) {
  return (
    <h3 className="flex flex-wrap items-center gap-2">
      {title}
      <span className={`rounded-full px-2 py-0.5 text-11 font-bold uppercase tracking-wide ${severityBadge[priority]}`}>
        {priority}
      </span>
    </h3>
  )
}

export default function JwtSecurityChecklistClient() {
  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Developer security</p>
        <h1>JWT Security Checklist</h1>
        <p className="guide-deck">
          Essential security checklist for JWT implementation. Follow these proven practices
          to protect your applications from common JWT vulnerabilities and attacks.
        </p>
      </header>

      <h2 id="critical-priorities">Critical Security Priorities</h2>
      <GuideRows items={[
        ['1. Always Use HTTPS', 'Never transmit JWTs over unencrypted connections'],
        ['2. Set Short Expiration', 'Limit token lifetime to reduce attack window'],
        ['3. Validate Everything', 'Verify signature, expiration, and all claims'],
      ]} />

      <h2 id="checklist">Security Implementation Progress</h2>
      <GuideChecklist items={CHECKLIST_ITEMS} storageKey="rk-jwt-security-checklist" />

      <h2 id="token-generation">Token Generation Security</h2>

      <ItemHeading title="Enforce HTTPS Only" priority="critical" />
      <p>Never generate, transmit, or accept JWT tokens over unencrypted HTTP connections.</p>
      <GuideCodeBlock
        label="HTTPS"
        code={`# VULNERABLE: Never do this
http://api.example.com/login

# SECURE: Always use HTTPS
https://api.example.com/login`}
      />

      <ItemHeading title="Use Cryptographically Strong Secrets" priority="critical" />
      <p>Generate secrets with at least 256 bits of entropy. Never use predictable or weak secrets.</p>
      <GuideCodeBlock
        label="Node.js"
        code={`// SECURE: Generate strong secret
const secret = crypto.randomBytes(32).toString('hex');
// Result: 64-character hex string (256 bits)`}
      />

      <ItemHeading title="Set Short Token Expiration" priority="high" />
      <p>Use 15-60 minutes for access tokens. Implement refresh tokens for longer sessions.</p>
      <GuideRows compact items={[
        ['Access Tokens', '15-60 minutes'],
        ['API Tokens', '1-24 hours'],
        ['Refresh Tokens', '7-30 days'],
      ]} />

      <ItemHeading title="Validate and Specify Algorithm" priority="critical" />
      <p>Always specify and validate the expected signing algorithm. Prevent algorithm confusion attacks.</p>
      <GuideCodeBlock
        label="Node.js"
        code={`// VULNERABLE: Accepts any algorithm
jwt.verify(token, secret)

// SECURE: Specify expected algorithm
jwt.verify(token, secret, { algorithms: ['HS256'] })`}
      />

      <ItemHeading title="Never Store Sensitive Data in JWT" priority="critical" />
      <p>JWTs are encoded, not encrypted. Never include passwords, SSNs, or other sensitive information.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Never Include</h4>
          <ul className={cardListClass}>
            <li>Passwords or password hashes</li>
            <li>Social Security Numbers</li>
            <li>Credit card information</li>
            <li>API secrets or keys</li>
            <li>Personal identification numbers</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Safe to Include</h4>
          <ul className={cardListClass}>
            <li>User ID (non-sequential)</li>
            <li>Username or email</li>
            <li>User roles and permissions</li>
            <li>Non-sensitive metadata</li>
            <li>Application preferences</li>
          </ul>
        </div>
      </div>

      <h2 id="token-validation">Token Validation Security</h2>

      <ItemHeading title="Always Verify Token Signature" priority="critical" />
      <p>Never skip signature verification. This is your primary defense against token tampering.</p>
      <GuideCodeBlock
        label="Node.js"
        code={`// SECURE: Proper verification
try {
  const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
  // Token is valid and verified
} catch (error) {
  // Invalid token - reject request
  return res.status(401).json({ error: 'Invalid token' });
}`}
      />

      <ItemHeading title="Validate Token Expiration" priority="critical" />
      <p>Always check the &apos;exp&apos; claim. Expired tokens should be immediately rejected.</p>
      <GuideCodeBlock
        label="Node.js"
        code={`// Expiration is automatically checked by most libraries
// But you can also manually verify:
if (decoded.exp && Date.now() >= decoded.exp * 1000) {
  throw new Error('Token has expired');
}`}
      />

      <ItemHeading title="Validate Token Issuer (iss)" priority="high" />
      <p>Check that tokens come from expected issuers to prevent token confusion attacks.</p>
      <GuideCodeBlock
        label="Node.js"
        code={`const decoded = jwt.verify(token, secret, {
  algorithms: ['HS256'],
  issuer: 'your-app-name',
  audience: 'your-api'
});`}
      />

      <ItemHeading title="Validate Token Audience (aud)" priority="high" />
      <p>Ensure tokens are intended for your application by validating the audience claim.</p>
      <GuideCodeBlock
        label="Node.js"
        code={`// Token should specify intended audience
const payload = {
  sub: 'user123',
  aud: 'api.yourapp.com', // Your API endpoint
  iss: 'yourapp.com'
};`}
      />

      <ItemHeading title="Validate 'Not Before' Claim (nbf)" priority="medium" />
      <p>If using nbf claim, ensure tokens are not used before their valid time.</p>
      <GuideCodeBlock
        label="Node.js"
        code={`if (decoded.nbf && Date.now() < decoded.nbf * 1000) {
  throw new Error('Token not yet valid');
}`}
      />

      <h2 id="storage-transmission">Storage and Transmission Security</h2>

      <ItemHeading title="Use Secure Storage Methods" priority="high" />
      <p>Store tokens in httpOnly cookies or secure storage. Avoid localStorage for sensitive tokens.</p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Secure Options</h4>
          <ul className={cardListClass}>
            <li>httpOnly cookies</li>
            <li>Secure cookies</li>
            <li>SameSite cookies</li>
            <li>Memory (temporary)</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Use with Caution</h4>
          <ul className={cardListClass}>
            <li>localStorage (XSS risk)</li>
            <li>sessionStorage</li>
            <li>Regular cookies</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Never Use</h4>
          <ul className={cardListClass}>
            <li>URL parameters</li>
            <li>Referer headers</li>
            <li>Unencrypted storage</li>
            <li>Plain text files</li>
          </ul>
        </div>
      </div>

      <ItemHeading title="Use Authorization Header" priority="high" />
      <p>Send tokens in Authorization header with Bearer scheme, not in URL or body.</p>
      <GuideCodeBlock
        label="HTTP"
        code={`# SECURE: Correct way
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

# VULNERABLE: Never in URL
https://api.example.com/data?token=eyJhbGc...`}
      />

      <ItemHeading title="Implement CSRF Protection" priority="high" />
      <p>Use CSRF tokens or double-submit cookie pattern when storing JWTs in cookies.</p>
      <GuideCodeBlock
        label="Node.js"
        code={`// Set secure cookie with CSRF protection
res.cookie('jwt', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});`}
      />

      <ItemHeading title="Configure CORS Properly" priority="medium" />
      <p>Set specific origins in CORS, never use wildcards (*) for credentials.</p>
      <GuideCodeBlock
        label="HTTP headers"
        code={`# SECURE: Specific origins
Access-Control-Allow-Origin: https://yourapp.com
Access-Control-Allow-Credentials: true

# VULNERABLE: Never with credentials
Access-Control-Allow-Origin: *`}
      />

      <h2 id="application-security">Application Security</h2>

      <ItemHeading title="Implement Refresh Token Strategy" priority="high" />
      <p>Use refresh tokens for long-lived sessions to minimize exposure of access tokens.</p>
      <GuideCodeBlock
        label="Node.js"
        code={`// Access token: short-lived (15-60 minutes)
const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });

// Refresh token: longer-lived (7-30 days)
const refreshToken = jwt.sign({ type: 'refresh' }, secret, { expiresIn: '7d' });`}
      />

      <ItemHeading title="Implement Token Blacklisting" priority="high" />
      <p>Maintain a blacklist for revoked tokens, especially for logout and security incidents.</p>
      <GuideCodeBlock
        label="Node.js"
        code={`// Store revoked token IDs in Redis/database
await redis.setex('blacklist:' + jti, expTime, 'true');

// Check blacklist on each request
const isBlacklisted = await redis.get('blacklist:' + decoded.jti);`}
      />

      <ItemHeading title="Implement Rate Limiting" priority="medium" />
      <p>Add rate limiting to token endpoints to prevent brute force and abuse.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Login Endpoint</h4>
          <ul className={cardListClass}>
            <li>5 attempts per minute per IP</li>
            <li>10 attempts per hour per user</li>
            <li>Progressive delays</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Token Refresh</h4>
          <ul className={cardListClass}>
            <li>10 requests per minute</li>
            <li>Monitor for unusual patterns</li>
            <li>Implement circuit breakers</li>
          </ul>
        </div>
      </div>

      <ItemHeading title="Implement Security Logging" priority="medium" />
      <p>Log security events for monitoring and incident response.</p>
      <GuideCodeBlock
        label="Node.js"
        code={`// Log security events
logger.warn('Invalid JWT signature', { ip, userAgent, token: token.slice(0,20) });
logger.info('Token refreshed', { userId, ip });
logger.error('Expired token used', { userId, expired: decoded.exp });`}
      />

      <ItemHeading title="Set Security Headers" priority="medium" />
      <p>Configure security headers to protect against common attacks.</p>
      <GuideCodeBlock
        label="HTTP headers"
        code={`Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'`}
      />

      <h2 id="development-testing">Development and Testing</h2>

      <ItemHeading title="Secure Environment Configuration" priority="critical" />
      <p>Use environment variables for secrets, never hardcode in source code.</p>
      <GuideCodeBlock
        label="Node.js"
        code={`// VULNERABLE: Never do this
const secret = 'mysecretkey123';
const secret = 'hardcoded-in-repo';

// SECURE: Always do this
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('Missing JWT_SECRET');`}
      />

      <ItemHeading title="Use Different Secrets Per Environment" priority="high" />
      <p>Development, staging, and production should use completely different secrets.</p>
      <GuideCodeBlock
        label=".env"
        code={`# Development .env
JWT_SECRET=dev_secret_32_char_minimum_12345

# Production .env
JWT_SECRET=prod_different_secret_67890_xyz

# Never reuse secrets across environments`}
      />

      <ItemHeading title="Test Security Scenarios" priority="medium" />
      <p>Write tests for token validation, expiration, and attack scenarios.</p>
      <GuideCodeBlock
        label="Test cases"
        code={`// Test cases to include:
// - Expired token rejection
// - Invalid signature detection
// - Malformed token handling
// - Algorithm confusion prevention
// - Missing claims validation`}
      />

      <ItemHeading title="Regular Security Audits" priority="medium" />
      <p>Conduct regular security reviews and dependency updates.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Monthly Tasks</h4>
          <ul className={cardListClass}>
            <li>Review token lifetimes</li>
            <li>Check for library updates</li>
            <li>Analyze security logs</li>
            <li>Review access patterns</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Quarterly Tasks</h4>
          <ul className={cardListClass}>
            <li>Rotate signing secrets</li>
            <li>Security penetration testing</li>
            <li>Update security policies</li>
            <li>Team security training</li>
          </ul>
        </div>
      </div>

      <ItemHeading title="Document Security Decisions" priority="medium" />
      <p>Document your JWT configuration, security policies, and incident procedures.</p>
      <ul>
        <li>Document algorithm choices and rationale</li>
        <li>Record token lifetime decisions</li>
        <li>Maintain incident response procedures</li>
        <li>Document key rotation schedule</li>
        <li>Keep security contact information current</li>
      </ul>

      <GuideCallout kind="success" label="Keep improving:">
        Work through the checklist above until every practice is implemented, then keep monitoring and updating.
      </GuideCallout>

      <section className="guide-related" aria-labelledby="related-tools-title">
        <h2 id="related-tools-title">Related tools</h2>
        <div className="guide-card-grid">
          <Link href="/jwt-secret"><strong>Generate Secure JWT Tokens →</strong><span>Create strong signing secrets locally in your browser.</span></Link>
          <Link href="/guides/common-jwt-mistakes"><strong>Common JWT Mistakes →</strong><span>The most dangerous JWT implementation mistakes and how to fix them.</span></Link>
        </div>
      </section>
    </article>
  )
}
