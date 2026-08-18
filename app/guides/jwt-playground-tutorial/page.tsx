import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/app/components/BreadcrumbSchema';
import { GuideCallout } from '@/app/components/guide/GuideCallout';
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock';
import { GuideRows } from '@/app/components/guide/GuideRows';

export const metadata: Metadata = {
  title: 'JWT Playground Tutorial: Interactive Guide to JSON Web Tokens | RandomKeygen',
  description: 'Learn JWT (JSON Web Tokens) hands-on with this interactive tutorial. Understand JWT structure, create tokens, verify signatures, and master JWT security in practice.',
  keywords: ['jwt tutorial', 'jwt playground', 'json web token tutorial', 'jwt interactive guide', 'jwt token generator tutorial', 'jwt security tutorial'],
  openGraph: {
    title: 'JWT Playground Tutorial: Interactive Guide to JSON Web Tokens',
    description: 'Learn JWT (JSON Web Tokens) hands-on with this interactive tutorial. Understand JWT structure, create tokens, verify signatures, and master JWT security in practice.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/jwt-playground-tutorial',
  },
};

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Guides', url: '/guides' },
  { name: 'JWT Playground Tutorial', url: '/guides/jwt-playground-tutorial' },
];

const cardClass = 'rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]'
const cardTitleClass = 'mb-2 font-semibold text-[var(--foreground)]'
const cardListClass = 'list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--body)]'

export default function JwtPlaygroundTutorial() {
  return (
    <article className="guide-article">
      <BreadcrumbSchema items={breadcrumbItems} />

      <header className="guide-article-header">
        <p className="eyebrow">Guide · Developer security</p>
        <h1>JWT Playground Tutorial: Hands-On Learning</h1>
        <p className="guide-deck">
          Master JSON Web Tokens through interactive examples. Learn to create, decode, and verify JWTs
          step-by-step with real-world scenarios and security best practices.
        </p>
      </header>

      <h2 id="what-youll-learn">What You&apos;ll Learn</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className={cardClass}>
          <h3 className={cardTitleClass}>JWT Anatomy</h3>
          <ul className={cardListClass}>
            <li>Header structure and algorithms</li>
            <li>Payload claims and data</li>
            <li>Signature verification process</li>
            <li>Base64URL encoding explained</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Practical Skills</h3>
          <ul className={cardListClass}>
            <li>Create and sign JWTs</li>
            <li>Decode and validate tokens</li>
            <li>Handle expiration times</li>
            <li>Debug common issues</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Security Focus</h3>
          <ul className={cardListClass}>
            <li>Algorithm security (HS256 vs RS256)</li>
            <li>Secret management</li>
            <li>Attack prevention</li>
            <li>Production deployment</li>
          </ul>
        </div>
      </div>

      <h2 id="jwt-basics">JWT Basics: Understanding the Structure</h2>
      <h3>Anatomy of a JWT</h3>
      <p>
        A JWT consists of three parts separated by dots (.). Let&apos;s break down each component:
      </p>
      <GuideCodeBlock
        label="JWT token"
        segments={[
          { text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', tone: 'vulnerable' },
          { text: '.', tone: 'comment' },
          { text: 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ', tone: 'secure' },
          { text: '.', tone: 'comment' },
          { text: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        ]}
      />
      <h3>Header</h3>
      <p>Contains algorithm and token type</p>
      <GuideCodeBlock
        label="Header"
        code={`{
  "alg": "HS256",
  "typ": "JWT"
}`}
      />
      <h3>Payload</h3>
      <p>Contains the claims/data</p>
      <GuideCodeBlock
        label="Payload"
        code={`{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}`}
      />
      <h3>Signature</h3>
      <p>Verifies token integrity</p>
      <GuideCodeBlock
        label="Signature"
        code={`HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)`}
      />

      <h2 id="exercise-1">Interactive Exercise 1: Creating Your First JWT</h2>
      <p>
        <strong>Goal: Create a Basic JWT.</strong> Let&apos;s create a JWT for a user authentication scenario.
        You&apos;ll learn how each component contributes to the final token.
      </p>

      <h3>Step 1: Define the Header</h3>
      <p>
        The header specifies the algorithm used for signing. HS256 (HMAC with SHA-256) is common for simple use cases.
      </p>
      <GuideCodeBlock
        label="Header JSON"
        code={`{
  "alg": "HS256",
  "typ": "JWT"
}`}
      />
      <p>
        <strong>Base64URL Encoded:</strong> <code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</code>
      </p>
      <GuideCallout kind="success" label="Try it:">
        Use our JWT generator to experiment with different algorithms like RS256 or ES256.
      </GuideCallout>

      <h3>Step 2: Create the Payload</h3>
      <p>
        The payload contains claims about the user and session. Include essential information but keep it lean.
      </p>
      <GuideCodeBlock
        label="Payload JSON"
        code={`{
  "sub": "user123",          // Subject (user ID)
  "name": "Alice Johnson",   // Custom claim
  "role": "user",           // User role
  "iat": 1640995200,        // Issued at (timestamp)
  "exp": 1641001200         // Expires at (timestamp)
}`}
      />
      <p>
        <strong>Base64URL Encoded:</strong>{' '}
        <code className="break-all">eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkFsaWNlIEpvaG5zb24iLCJyb2xlIjoidXNlciIsImlhdCI6MTY0MDk5NTIwMCwiZXhwIjoxNjQxMDAxMjAwfQ</code>
      </p>
      <GuideCallout kind="warning" label="Security note:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Never include passwords or sensitive data in the payload</li>
          <li>JWTs are encoded, not encrypted (readable with base64 decode)</li>
          <li>Use short expiration times (15-60 minutes) for access tokens</li>
        </ul>
      </GuideCallout>

      <h3>Step 3: Generate the Signature</h3>
      <p>
        The signature ensures the token hasn&apos;t been tampered with. It&apos;s created using the header, payload, and a secret key.
      </p>
      <GuideCodeBlock
        label="Signature algorithm"
        code={`signature = HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  "your-secret-key"
)`}
      />
      <p>
        <strong>Example Secret:</strong> <code>mySecureSigningKey2024!</code><br />
        <strong>Resulting Signature:</strong> <code>k8GTeGOJhBtC1esXPRYGHQMnM2s6i4DYvAkGNDqHlJM</code>
      </p>

      <h3>Complete JWT Token</h3>
      <p>
        Combining all three parts with dots creates your final JWT:
      </p>
      <GuideCodeBlock
        label="Complete JWT"
        segments={[
          { text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', tone: 'vulnerable' },
          { text: '.', tone: 'comment' },
          { text: 'eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkFsaWNlIEpvaG5zb24iLCJyb2xlIjoidXNlciIsImlhdCI6MTY0MDk5NTIwMCwiZXhwIjoxNjQxMDAxMjAwfQ', tone: 'secure' },
          { text: '.', tone: 'comment' },
          { text: 'k8GTeGOJhBtC1esXPRYGHQMnM2s6i4DYvAkGNDqHlJM' },
        ]}
      />
      <GuideCallout kind="success" label="Congratulations!">
        You&apos;ve created your first JWT. This token can now be used for authentication.
      </GuideCallout>

      <h2 id="exercise-2">Interactive Exercise 2: Decoding and Validating JWTs</h2>
      <p>
        <strong>Goal: Understand JWT Verification.</strong> Learn how to decode JWT components and verify
        their integrity. This is crucial for secure authentication.
      </p>

      <h3>Sample JWT to Analyze</h3>
      <p>
        Let&apos;s decode this JWT step by step to understand its contents:
      </p>
      <GuideCodeBlock
        label="Sample JWT"
        code={'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyNDU2IiwibmFtZSI6IkJvYiBTbWl0aCIsImFkbWluIjp0cnVlLCJpYXQiOjE2NDA5OTUyMDAsImV4cCI6MTY0MTAwMTIwMH0.t6tH7SqE1X-6SxlsEoaVQFhpvEp7WLLhRqXXXjQfbTc'}
      />
      <h3>1. Decode Header</h3>
      <p>Encoded: <code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</code></p>
      <GuideCodeBlock
        label="Decoded header"
        code={`{
  "alg": "HS256",
  "typ": "JWT"
}`}
      />
      <h3>2. Decode Payload</h3>
      <p>Encoded: <code>eyJzdWIiOiJ1c2VyNDU2Ii...</code></p>
      <GuideCodeBlock
        label="Decoded payload"
        code={`{
  "sub": "user456",
  "name": "Bob Smith",
  "admin": true,
  "iat": 1640995200,
  "exp": 1641001200
}`}
      />
      <h3>3. Verify Signature</h3>
      <p>
        Signature: <code>t6tH7SqE1X-6SxlsEoaVQF...</code><br />
        Verification: valid with secret <code>&quot;mySecretKey123&quot;</code>
      </p>

      <h3>Validation Checklist</h3>
      <p>
        When receiving a JWT, perform these validation steps:
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Structure Validation</h4>
          <ul className={cardListClass}>
            <li>Three parts separated by dots</li>
            <li>Valid Base64URL encoding</li>
            <li>Header contains required fields</li>
            <li>Payload has valid JSON structure</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Security Validation</h4>
          <ul className={cardListClass}>
            <li>Signature verification passes</li>
            <li>Token hasn&apos;t expired (exp claim)</li>
            <li>Token is not used before valid time (nbf)</li>
            <li>Issuer is trusted (iss claim)</li>
          </ul>
        </div>
      </div>
      <GuideCallout kind="danger" label="Common validation mistakes:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Trusting tokens without signature verification</li>
          <li>Not checking expiration times</li>
          <li>Accepting tokens with &quot;none&quot; algorithm</li>
          <li>Using weak or default secrets</li>
        </ul>
      </GuideCallout>

      <h2 id="real-world-scenarios">Real-World Scenarios</h2>

      <h3>Scenario 1: User Login System</h3>
      <p>
        Building a secure login system where JWTs are issued after successful authentication.
      </p>
      <p><strong>Implementation Steps:</strong></p>
      <ol className="list-decimal space-y-2 pl-5 text-16 leading-7 text-[var(--body)]">
        <li><strong>User Authentication:</strong> Verify username and password against database</li>
        <li><strong>Generate JWT:</strong> Create token with user ID, role, and expiration</li>
        <li><strong>Return Token:</strong> Send JWT to client (avoid storing in localStorage for XSS protection)</li>
        <li><strong>Token Usage:</strong> Client includes JWT in Authorization header for API requests</li>
        <li><strong>Token Verification:</strong> Server validates signature and expiration on each request</li>
      </ol>
      <GuideCallout kind="success" label="Best practices:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Use secure HTTP-only cookies for storage</li>
          <li>Implement token refresh mechanism</li>
          <li>Set appropriate expiration times</li>
          <li>Include rate limiting</li>
        </ul>
      </GuideCallout>
      <GuideCallout kind="danger" label="Common pitfalls:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Storing tokens in localStorage</li>
          <li>Not implementing logout/revocation</li>
          <li>Using long expiration times</li>
          <li>Exposing sensitive data in claims</li>
        </ul>
      </GuideCallout>

      <h3>Scenario 2: API Access Control</h3>
      <p>
        Using JWTs to control access to API endpoints based on user roles and permissions.
      </p>
      <GuideCodeBlock
        label="Sample API JWT payload"
        code={`{
  "sub": "api_user_789",
  "iss": "api.mycompany.com",
  "aud": ["api.mycompany.com", "mobile.mycompany.com"],
  "exp": 1641001200,
  "iat": 1640997600,
  "scope": ["read:users", "write:posts", "admin:dashboard"],
  "rate_limit": 1000
}`}
      />
      <GuideRows items={[
        ['1', 'Scope-based permissions: define what actions the token holder can perform'],
        ['2', 'Audience validation: ensure token is intended for your API'],
        ['3', 'Rate limiting: include usage limits to prevent abuse'],
      ]} />

      <h3>Scenario 3: Microservices Communication</h3>
      <p>
        Secure communication between microservices using JWTs for service-to-service authentication.
      </p>
      <GuideCodeBlock
        label="Service JWT example"
        code={`{
  "sub": "order-service",
  "iss": "auth-service",
  "aud": ["inventory-service", "payment-service"],
  "exp": 1641001200,
  "service_id": "order-svc-001",
  "permissions": ["read:inventory", "write:payments"]
}`}
      />
      <p>
        Each service validates tokens before processing requests, ensuring only authorized services can interact.
      </p>

      <h2 id="security-deep-dive">Security Deep Dive</h2>

      <h3>Algorithm Confusion Attacks</h3>
      <p>
        Attackers change the algorithm from RS256 to HS256, then use the public key as the HMAC secret.
        <strong> Prevention:</strong> always specify expected algorithms in your verification code.
      </p>
      <GuideCodeBlock
        label="Node.js"
        code={`// Good: Specify allowed algorithms
jwt.verify(token, secret, { algorithms: ['HS256'] });

// Bad: Accept any algorithm
jwt.verify(token, secret);`}
      />

      <h3>&quot;None&quot; Algorithm Bypass</h3>
      <p>
        Some JWT libraries accept &quot;none&quot; algorithm, which skips signature verification entirely.
      </p>
      <GuideCodeBlock
        label="Example malicious header"
        code={`{
  "alg": "none",
  "typ": "JWT"
}`}
      />
      <GuideCallout kind="danger" label="Prevention:">
        Explicitly reject &quot;none&quot; algorithm in your code.
      </GuideCallout>

      <h3>Weak Secret Keys</h3>
      <p>
        Short or predictable secrets can be brute-forced, allowing attackers to forge tokens.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Weak Secrets</h4>
          <ul className={cardListClass}>
            <li>&quot;secret&quot;</li>
            <li>&quot;password123&quot;</li>
            <li>Company name</li>
            <li>Dictionary words</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Strong Secrets</h4>
          <ul className={cardListClass}>
            <li>256+ bit random keys</li>
            <li>Use crypto.randomBytes(32)</li>
            <li>Store in environment variables</li>
            <li>Rotate regularly</li>
          </ul>
        </div>
      </div>

      <h3>Security Best Practices</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Token Management</h4>
          <ul className={cardListClass}>
            <li><strong>Short expiration:</strong> 15-60 minutes for access tokens</li>
            <li><strong>Refresh tokens:</strong> Longer-lived but revocable</li>
            <li><strong>Revocation list:</strong> Track and invalidate compromised tokens</li>
            <li><strong>Secure storage:</strong> HTTP-only cookies preferred</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Implementation Security</h4>
          <ul className={cardListClass}>
            <li><strong>Algorithm allowlisting:</strong> Specify exact algorithms</li>
            <li><strong>Audience validation:</strong> Verify aud claim</li>
            <li><strong>Issuer validation:</strong> Verify iss claim</li>
            <li><strong>Time validation:</strong> Check iat, exp, nbf claims</li>
          </ul>
        </div>
      </div>

      <h2 id="troubleshooting">Troubleshooting Common Issues</h2>

      <h3>&quot;Invalid Signature&quot; Errors</h3>
      <GuideCallout kind="warning" label="Common causes:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Using different secrets for signing and verification</li>
          <li>Algorithm mismatch (e.g., signed with HS256, verified with RS256)</li>
          <li>Token corruption during transmission</li>
          <li>Clock skew between servers</li>
        </ul>
        <p className="mt-2"><strong>Debug steps:</strong> Log the exact token, algorithm, and secret being used. Compare with original signing parameters.</p>
      </GuideCallout>

      <h3>&quot;Token Expired&quot; Errors</h3>
      <GuideCallout kind="danger" label="Solutions:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Implement automatic token refresh before expiration</li>
          <li>Synchronize server clocks (use NTP)</li>
          <li>Add clock skew tolerance (leeway) to verification</li>
          <li>Use appropriate expiration times for your use case</li>
        </ul>
        <p className="mt-2"><strong>Implementation tip:</strong> Refresh tokens when they&apos;re 80% through their lifespan.</p>
      </GuideCallout>

      <h3>&quot;Malformed Token&quot; Errors</h3>
      <GuideCallout kind="success" label="Validation steps:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Check token format: three parts separated by dots</li>
          <li>Verify Base64URL encoding (not regular Base64)</li>
          <li>Ensure header and payload are valid JSON</li>
          <li>Check for extra whitespace or newlines</li>
        </ul>
        <p className="mt-2"><strong>Quick test:</strong> Use jwt.io to decode your token and check for formatting issues.</p>
      </GuideCallout>

      <h2 id="next-steps">Next Steps</h2>
      <h3>Practice Exercises</h3>
      <ul>
        <li>Build a complete login system with JWT</li>
        <li>Implement token refresh mechanism</li>
        <li>Create role-based access control</li>
        <li>Set up JWT revocation system</li>
      </ul>
      <h3>Advanced Topics</h3>
      <ul>
        <li>JWE (JSON Web Encryption) for sensitive data</li>
        <li>JWK (JSON Web Keys) for key rotation</li>
        <li>OAuth 2.0 integration with JWTs</li>
        <li>Performance optimization for high-traffic apps</li>
      </ul>
      <GuideCallout kind="success" label="Pro tip:">
        Generate secure JWT secrets and experiment with different algorithms using our JWT secret generator.
        Practice makes perfect when it comes to JWT security!
      </GuideCallout>
    </article>
  );
}
