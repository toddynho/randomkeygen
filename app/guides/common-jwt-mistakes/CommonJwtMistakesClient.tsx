import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'
import { GuideRows } from '@/app/components/guide/GuideRows'

const severityBadge = {
  critical: 'bg-[var(--chip-danger-bg)] text-[var(--danger-text)] border border-[var(--chip-danger-border)]',
  high: 'bg-[var(--orange-bg)] text-[var(--orange-text)] border border-[var(--orange-border)]',
  medium: 'bg-[var(--warn-bg)] text-[var(--warn-strong)] border border-[var(--warn-border)]',
} as const

function MistakeCard({
  title,
  severity,
  description,
  badExample,
  goodExample,
  impact,
  howToFix,
}: {
  title: string
  severity: 'critical' | 'high' | 'medium'
  description: string
  badExample?: string
  goodExample?: string
  impact: string
  howToFix: string[]
}) {
  return (
    <>
      <h3 className="flex items-center gap-2">
        {title}
        <span className={`rounded-full px-2 py-0.5 text-11 font-bold uppercase tracking-wide ${severityBadge[severity]}`}>
          {severity}
        </span>
      </h3>
      <p>{description}</p>
      {badExample && <GuideCodeBlock label="Wrong implementation" code={badExample} />}
      {goodExample && <GuideCodeBlock label="Correct implementation" code={goodExample} />}
      <GuideCallout kind="danger" label="Security impact:">
        {impact}
      </GuideCallout>
      <GuideCallout kind="success" label="How to fix:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {howToFix.map((fix) => <li key={fix}>{fix}</li>)}
        </ul>
      </GuideCallout>
    </>
  )
}

export default function CommonJwtMistakesClient() {
  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Developer security</p>
        <h1>Common JWT Implementation Mistakes</h1>
        <p className="guide-deck">
          Learn from the most dangerous JWT implementation mistakes that developers make.
          Avoid critical security vulnerabilities and protect your applications with proper JWT practices.
        </p>
      </header>

      <h2 id="critical-alert">Critical Security Alert</h2>
      <GuideCallout kind="danger" label="JWT implementation errors">
        are among the most common causes of authentication bypass attacks.
        Even a small mistake can expose your entire user base to attackers.
      </GuideCallout>
      <GuideRows items={[
        ['Authentication bypass', 'Forged tokens can impersonate trusted users'],
        ['Privilege escalation', 'Unvalidated claims can grant excess access'],
        ['Persistent access', 'Long-lived tokens extend the attack window'],
      ]} />

      <h2 id="critical-mistakes">Critical Security Mistakes</h2>

      <MistakeCard
        title="Using Weak or Predictable Secrets"
        severity="critical"
        description="Many developers use simple, short, or predictable secrets for signing JWTs. This makes tokens trivially easy to forge."
        badExample={`// VULNERABLE: NEVER do this
const secret = 'secret';
const secret = 'myapp';
const secret = '123456';
const secret = 'your-secret-key'; // Default examples

const token = jwt.sign(payload, secret);`}
        goodExample={`// SECURE: Always do this
const crypto = require('crypto');
const secret = process.env.JWT_SECRET ||
  crypto.randomBytes(64).toString('hex');

// Minimum 256-bit (32 bytes) entropy
if (secret.length < 32) {
  throw new Error('JWT secret too weak');
}

const token = jwt.sign(payload, secret);`}
        impact="Attackers can forge any JWT token, impersonate any user, and gain complete access to your application. This is a complete authentication bypass."
        howToFix={[
          'Generate secrets with at least 256 bits of entropy',
          'Use cryptographically secure random generators',
          'Store secrets in environment variables, never in code',
          'Use different secrets for different environments',
          'Rotate secrets regularly',
        ]}
      />

      <MistakeCard
        title="Algorithm Confusion Attacks"
        severity="critical"
        description="Not specifying or validating the signing algorithm allows attackers to change the algorithm and bypass security."
        badExample={`// VULNERABLE: Accepts any algorithm
jwt.verify(token, publicKey);

// VULNERABLE to 'none' algorithm
jwt.verify(token, secret, { algorithms: ['HS256', 'none'] });

// VULNERABLE: Using public key for HMAC
jwt.verify(token, publicKey, { algorithms: ['HS256', 'RS256'] });`}
        goodExample={`// SECURE: Always specify expected algorithm
jwt.verify(token, secret, { algorithms: ['HS256'] });

// SECURE: For RSA keys, only allow RS algorithms
jwt.verify(token, publicKey, { algorithms: ['RS256'] });

// SECURE: Never allow 'none' algorithm in production
const allowedAlgorithms = process.env.NODE_ENV === 'test'
  ? ['HS256', 'none'] : ['HS256'];`}
        impact="Complete authentication bypass. Attackers can create tokens with no signature or trick servers into using public keys as HMAC secrets."
        howToFix={[
          'Always specify the algorithms parameter',
          "Never include 'none' in production algorithms",
          'Use different validation for symmetric vs asymmetric keys',
          'Validate algorithm in JWT header matches expectation',
          'Implement algorithm allowlist, not blocklist',
        ]}
      />

      <MistakeCard
        title="Storing Sensitive Data in JWTs"
        severity="critical"
        description="JWTs are encoded (base64), not encrypted. Any sensitive data in the payload is visible to anyone who has the token."
        badExample={`// VULNERABLE: NEVER put sensitive data in JWTs
const payload = {
  userId: 123,
  password: 'user-password',        // Visible to anyone!
  ssn: '123-45-6789',              // Major privacy violation
  creditCard: '1234-5678-9012-3456', // Financial data exposed
  apiSecret: 'internal-api-key',    // Internal secrets leaked
  email: 'user@example.com',
  role: 'admin'
};`}
        goodExample={`// SECURE: Only include non-sensitive, verifiable data
const payload = {
  sub: 'user123',           // User identifier (non-sequential)
  username: 'johndoe',      // Public information
  role: 'admin',           // Authorization info
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (60 * 15), // 15 min
  jti: randomUUID()        // Token ID for revocation
};

// Store sensitive data server-side, reference by user ID`}
        impact="Immediate exposure of passwords, personal data, and internal secrets to anyone with token access. Massive privacy violations and regulatory compliance issues."
        howToFix={[
          'Never include passwords or password hashes',
          "Don't put SSN, PII, or financial data in tokens",
          'Avoid API keys or internal secrets',
          'Use non-sequential user IDs',
          'Keep payload minimal - only authorization data',
          'Encrypt JWTs if sensitive data is required (JWE)',
        ]}
      />

      <MistakeCard
        title="Ignoring Token Expiration"
        severity="critical"
        description="Not setting expiration times or not validating them properly allows tokens to live forever, dramatically increasing attack windows."
        badExample={`// VULNERABLE: No expiration set
const token = jwt.sign(payload, secret);

// VULNERABLE: Not validating expiration
const decoded = jwt.decode(token); // Doesn't verify!
console.log(decoded.userId);

// VULNERABLE: Extremely long expiration
const token = jwt.sign(payload, secret, {
  expiresIn: '10y' // 10 years!
});`}
        goodExample={`// SECURE: Always set appropriate expiration
const accessToken = jwt.sign(payload, secret, {
  expiresIn: '15m'  // 15 minutes for access tokens
});

const refreshToken = jwt.sign(refreshPayload, secret, {
  expiresIn: '7d'   // 7 days for refresh tokens
});

// SECURE: Always verify, which includes expiration check
try {
  const decoded = jwt.verify(token, secret, {
    algorithms: ['HS256']
  });
  // Token is valid and not expired
} catch (error) {
  // Handle expired or invalid token
  return res.status(401).json({ error: 'Token invalid' });
}`}
        impact="Stolen tokens remain valid indefinitely. Account takeovers persist even after users change passwords or administrators detect breaches."
        howToFix={[
          'Set short expirations (15-60 minutes) for access tokens',
          'Use refresh tokens for longer sessions',
          'Always use jwt.verify(), never jwt.decode() for auth',
          'Implement token refresh flow',
          'Consider JTI-based token revocation for immediate invalidation',
        ]}
      />

      <h2 id="high-risk-errors">High-Risk Implementation Errors</h2>

      <MistakeCard
        title="Insecure Token Storage"
        severity="high"
        description="Storing JWTs in localStorage or other client-side storage vulnerable to XSS attacks."
        badExample={`// VULNERABLE to XSS attacks
localStorage.setItem('jwt', token);
sessionStorage.setItem('jwt', token);

// VULNERABLE: Accessible to malicious scripts
document.cookie = \`jwt=\${token}\`;

// VULNERABLE: In URL parameters - logged everywhere
window.location = \`/dashboard?token=\${token}\`;`}
        goodExample={`// SECURE: httpOnly cookie (preferred)
res.cookie('jwt', token, {
  httpOnly: true,     // Not accessible to JavaScript
  secure: true,       // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 15 * 60 * 1000 // 15 minutes
});

// SECURE: Authorization header (for SPAs)
fetch('/api/data', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});

// SECURE: Store in memory only (most secure for SPAs)
let authToken = null; // In-memory storage`}
        impact="XSS attacks can steal tokens and impersonate users. Tokens exposed in logs, referrer headers, and browser history."
        howToFix={[
          'Use httpOnly, secure, sameSite cookies when possible',
          'For SPAs, store tokens in memory, not localStorage',
          'Implement token refresh flow for short-lived tokens',
          'Never include tokens in URLs',
          'Use CSP headers to prevent XSS',
        ]}
      />

      <MistakeCard
        title="Missing HTTPS/TLS Protection"
        severity="high"
        description="Transmitting JWTs over unencrypted HTTP connections exposes tokens to interception."
        badExample={`// VULNERABLE: HTTP transmission exposes tokens
fetch('http://api.example.com/login', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});

// VULNERABLE: Mixed content vulnerabilities
const API_URL = 'http://api.example.com'; // HTTP API
const FRONTEND_URL = 'https://app.example.com'; // HTTPS frontend`}
        goodExample={`// SECURE: Always enforce HTTPS
const API_URL = 'https://api.example.com';

// SECURE: HSTS headers
app.use((req, res, next) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  next();
});

// SECURE: Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(\`https://\${req.header('host')}\${req.url}\`);
  }
  next();
});`}
        impact="Man-in-the-middle attacks can intercept tokens. Complete authentication bypass over insecure networks."
        howToFix={[
          'Enforce HTTPS in production everywhere',
          'Set HSTS headers with long max-age',
          'Use secure cookie flags',
          'Implement certificate pinning for mobile apps',
          'Monitor for mixed content warnings',
        ]}
      />

      <MistakeCard
        title="Insufficient Token Validation"
        severity="high"
        description="Not validating all required claims or accepting tokens from unexpected sources."
        badExample={`// VULNERABLE: Minimal validation
const decoded = jwt.verify(token, secret);
const userId = decoded.sub; // Trusting without validation

// VULNERABLE: Not checking issuer/audience
// Accepts tokens from any issuer

// VULNERABLE: Not validating custom claims
if (decoded.role === 'admin') {
  // Allowing any role claim without verification
}`}
        goodExample={`// SECURE: Comprehensive validation
const decoded = jwt.verify(token, secret, {
  algorithms: ['HS256'],
  issuer: 'your-app.com',
  audience: 'api.your-app.com',
  maxAge: '15m'
});

// SECURE: Validate required claims
if (!decoded.sub || !decoded.role) {
  throw new Error('Missing required claims');
}

// SECURE: Validate claim values
const allowedRoles = ['user', 'admin', 'moderator'];
if (!allowedRoles.includes(decoded.role)) {
  throw new Error('Invalid role claim');
}

// SECURE: Additional security checks
if (decoded.role === 'admin' && !isFromTrustedIP(req.ip)) {
  throw new Error('Admin access from untrusted location');
}`}
        impact="Token confusion attacks, privilege escalation, and acceptance of malicious tokens from other applications."
        howToFix={[
          'Validate issuer (iss) and audience (aud) claims',
          'Check all required claims are present',
          'Validate claim values against allowlists',
          'Implement additional context validation',
          'Log and monitor validation failures',
        ]}
      />

      <MistakeCard
        title="No Token Revocation Strategy"
        severity="high"
        description="Once issued, JWTs cannot be revoked without additional infrastructure, making it impossible to immediately invalidate compromised tokens."
        badExample={`// VULNERABLE: No way to revoke tokens
app.post('/logout', (req, res) => {
  // JWT tokens remain valid until expiration
  res.json({ message: 'Logged out' });
});

// VULNERABLE: Compromised account with no immediate remedy
app.post('/change-password', async (req, res) => {
  await updatePassword(userId, newPassword);
  // Old JWT tokens still work!
  res.json({ message: 'Password changed' });
});`}
        goodExample={`// SECURE: Implement token blacklist
const blacklistedTokens = new Set(); // Or use Redis

app.post('/logout', authenticateToken, (req, res) => {
  blacklistedTokens.add(req.token.jti); // Blacklist by JWT ID
  res.json({ message: 'Logged out successfully' });
});

// SECURE: Check blacklist on each request
function authenticateToken(req, res, next) {
  const token = extractToken(req);
  const decoded = jwt.verify(token, secret);

  if (blacklistedTokens.has(decoded.jti)) {
    return res.status(401).json({ error: 'Token revoked' });
  }

  req.user = decoded;
  next();
}

// SECURE: Implement refresh token rotation
app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  // Validate refresh token and issue new access token
  // Invalidate old refresh token (rotation)
});`}
        impact="Unable to immediately invalidate compromised tokens. Logout doesn't actually log users out. Security incidents persist until token expiration."
        howToFix={[
          'Implement JWT ID (jti) based blacklisting',
          'Use Redis or database for scalable blacklist storage',
          'Implement refresh token rotation',
          'Consider short-lived tokens with refresh flow',
          'Provide emergency token revocation endpoints',
        ]}
      />

      <h2 id="common-pitfalls">Common Implementation Pitfalls</h2>

      <MistakeCard
        title="Clock Skew and Timing Issues"
        severity="medium"
        description="Not accounting for clock differences between servers can cause valid tokens to be rejected or invalid tokens to be accepted."
        badExample={`// VULNERABLE: Strict timestamp validation
const decoded = jwt.verify(token, secret);
if (decoded.iat > Date.now() / 1000) {
  throw new Error('Token from future');
}

// VULNERABLE: No clock skew tolerance
if (decoded.nbf && decoded.nbf > Date.now() / 1000) {
  throw new Error('Token not yet valid');
}`}
        goodExample={`// SECURE: Allow for clock skew
const clockSkew = 60; // 60 seconds tolerance

const decoded = jwt.verify(token, secret, {
  algorithms: ['HS256'],
  clockTolerance: clockSkew
});

// SECURE: Manual validation with tolerance
const now = Math.floor(Date.now() / 1000);
if (decoded.nbf && (decoded.nbf - clockSkew) > now) {
  throw new Error('Token not yet valid');
}

// SECURE: Server time synchronization
// Ensure all servers use NTP for time sync`}
        impact="Legitimate users get randomly rejected due to server clock differences. Valid tokens may be incorrectly accepted."
        howToFix={[
          'Set clockTolerance in JWT libraries (30-60 seconds)',
          'Synchronize server clocks with NTP',
          'Monitor time drift between servers',
          'Use UTC for all timestamp calculations',
          'Log timing validation failures for debugging',
        ]}
      />

      <MistakeCard
        title="Oversized JWT Tokens"
        severity="medium"
        description="Including too much data in JWTs creates large tokens that impact performance and may hit browser/server limits."
        badExample={`// VULNERABLE: Including large data sets
const payload = {
  userId: 123,
  preferences: { /* 2KB of user preferences */ },
  permissions: [ /* 100 permission objects */ ],
  profile: {
    bio: "Very long biography...", // Large strings
    avatar: "data:image/jpeg;base64,..." // Base64 image!
  },
  auditLog: [ /* Last 50 user actions */ ]
};

// Results in 8KB+ tokens!`}
        goodExample={`// SECURE: Minimal payload
const payload = {
  sub: 'user123',
  role: 'admin',
  permissions: ['read', 'write'], // Just permission names
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (15 * 60)
};

// SECURE: Store large data server-side
const userPreferences = await getUserPrefs(userId);
const userProfile = await getUserProfile(userId);

// SECURE: Reference by ID, fetch when needed
const tokenPayload = {
  sub: userId,
  role: userRole,
  prefVersion: userPrefVersion // Version for cache invalidation
};`}
        impact="Poor performance, HTTP header size limits exceeded, mobile app crashes, and increased network usage."
        howToFix={[
          'Keep payloads under 1KB when possible',
          'Store large data server-side, reference by ID',
          'Use version numbers for cache invalidation',
          'Paginate permissions instead of including all',
          'Consider JWE (encryption) for larger payloads',
        ]}
      />

      <MistakeCard
        title="Poor Error Handling"
        severity="medium"
        description="Not properly handling JWT validation errors can leak information to attackers or create poor user experience."
        badExample={`// VULNERABLE: Exposing internal error details
try {
  const decoded = jwt.verify(token, secret);
} catch (error) {
  // Leaks implementation details
  res.status(401).json({
    error: error.message, // "jwt signature is invalid"
    stack: error.stack,   // Reveals code structure
    secret: secret       // NEVER expose secrets!
  });
}

// VULNERABLE: Generic error handling
app.use((error, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong' });
  // No logging, can't debug issues
});`}
        goodExample={`// SECURE error handling
try {
  const decoded = jwt.verify(token, secret, {
    algorithms: ['HS256']
  });
  req.user = decoded;
  next();
} catch (error) {
  // Log detailed error internally
  logger.warn('JWT validation failed', {
    error: error.message,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    tokenPrefix: token ? token.substring(0, 20) : 'missing'
  });

  // Return generic error to client
  return res.status(401).json({
    error: 'Authentication failed',
    code: 'INVALID_TOKEN'
  });
}

// SECURE: Differentiate error types for better UX
function handleJWTError(error, res) {
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Generic response for other errors
  return res.status(401).json({
    error: 'Invalid token',
    code: 'INVALID_TOKEN'
  });
}`}
        impact="Information disclosure to attackers, poor debugging capabilities, and confusing user experience during authentication failures."
        howToFix={[
          'Log detailed errors server-side only',
          'Return generic error messages to clients',
          'Use error codes for client-side handling',
          'Implement proper monitoring and alerting',
          'Never expose secrets or internal paths',
        ]}
      />

      <h2 id="testing">Testing Your JWT Implementation</h2>
      <h3>Security Test Cases</h3>
      <ul>
        <li><strong>Expired Token Test:</strong> Verify expired tokens are rejected</li>
        <li><strong>Invalid Signature Test:</strong> Modify token signature and verify rejection</li>
        <li><strong>Algorithm Confusion:</strong> Try changing algorithm in header</li>
        <li><strong>None Algorithm:</strong> Test tokens with &quot;alg&quot;: &quot;none&quot;</li>
        <li><strong>Malformed Token:</strong> Send invalid base64 or JSON</li>
        <li><strong>Missing Claims:</strong> Remove required claims and test</li>
      </ul>
      <h3>Security Tools</h3>
      <GuideRows items={[
        ['jwt.io', 'Decode and verify JWTs online'],
        ['OWASP ZAP', 'Security testing proxy with JWT support'],
        ['Burp Suite', 'Professional security testing platform'],
        ['jwt-cracker', 'Test JWT secret strength'],
      ]} />

      <section className="guide-related" aria-labelledby="related-tools-title">
        <h2 id="related-tools-title">Implement JWT Security Correctly</h2>
        <p className="mb-4 text-16 leading-7 text-[var(--body)]">
          Now that you know the common mistakes, generate secure JWT tokens with proper configuration.
          Use our tool to create tokens with strong secrets and correct settings.
        </p>
        <div className="guide-card-grid">
          <Link href="/jwt-secret"><strong>Generate Secure JWT Tokens →</strong><span>Strong secrets, proper algorithms, and secure defaults built-in.</span></Link>
          <Link href="/guides/jwt-security-checklist"><strong>View Security Checklist →</strong><span>Essential best practices for secure JWT implementations.</span></Link>
        </div>
      </section>
    </article>
  )
}
