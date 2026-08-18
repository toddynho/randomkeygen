import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'
import { GuideRows } from '@/app/components/guide/GuideRows'

export const metadata: Metadata = {
  title: 'JWT vs JWE: Understanding JSON Web Encryption | RandomKeygen',
  description: 'Complete guide to JWT (JSON Web Tokens) vs JWE (JSON Web Encryption). Learn when to use each, implementation differences, and security considerations.',
  keywords: ['JWT vs JWE', 'JSON Web Token', 'JSON Web Encryption', 'JWT JWE difference', 'token encryption', 'JWT security', 'JWE implementation'],
  openGraph: {
    title: 'JWT vs JWE: Understanding JSON Web Encryption',
    description: 'Learn the differences between JWT and JWE, when to use each, and implementation best practices.',
    url: 'https://randomkeygen.com/guides/jwt-vs-jwe',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/jwt-vs-jwe',
  },
}

export default function JwtVsJwePage() {
  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Developer security</p>
        <h1>JWT vs JWE: Understanding JSON Web Encryption</h1>
        <p className="guide-deck">
          Learn the differences between signed tokens (JWT) and encrypted tokens (JWE), when to use each, and implementation considerations.
        </p>
      </header>

      <h2 id="fundamental-difference">The Fundamental Difference</h2>
      <p>
        While JWT (JSON Web Tokens) and JWE (JSON Web Encryption) are both part of the JOSE
        (JSON Object Signing and Encryption) framework, they serve different security purposes:
      </p>

      <h3>JWT (JSON Web Tokens)</h3>
      <GuideRows items={[
        ['Purpose', 'Authentication & Authorization'],
        ['Security', 'Integrity (signed, not encrypted)'],
        ['Readability', 'Base64-encoded payload (readable)'],
        ['Use case', 'Identity claims, permissions'],
      ]} />

      <h3>JWE (JSON Web Encryption)</h3>
      <GuideRows items={[
        ['Purpose', 'Confidentiality'],
        ['Security', 'Encrypted payload (confidential)'],
        ['Readability', 'Encrypted payload (unreadable)'],
        ['Use case', 'Sensitive data transport'],
      ]} />

      <GuideCallout kind="warning" label="Key Point:">
        JWT provides integrity (you know it hasn't been tampered with)
        but not confidentiality (anyone can read the payload). JWE provides both integrity and
        confidentiality by encrypting the entire payload.
      </GuideCallout>

      <h2 id="jwt-structure">JWT Structure &amp; Security</h2>

      <h3>Standard JWT Format</h3>
      <GuideCodeBlock
        label="JWT token"
        code={`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
      />

      <p>Three parts separated by dots:</p>
      <GuideRows compact items={[
        ['Header', 'Algorithm and token type (Base64URL)'],
        ['Payload', 'Claims and data (Base64URL)'],
        ['Signature', 'Cryptographic signature'],
      ]} />

      <h3>JWT Security Properties</h3>
      <ul>
        <li><strong>Integrity:</strong> Signature prevents tampering</li>
        <li><strong>Authenticity:</strong> Signature verifies the issuer</li>
        <li><strong>No Confidentiality:</strong> Payload is Base64-encoded (not encrypted)</li>
      </ul>

      <GuideCodeBlock
        label="Node.js"
        code={`// Anyone can decode the payload
const payload = JSON.parse(atob('eyJzdWIiOiIxMjM0...'));
console.log(payload.name); // "John Doe" - visible to anyone!`}
      />

      <h2 id="jwe-structure">JWE Structure &amp; Security</h2>

      <h3>JWE Format</h3>
      <GuideCodeBlock
        label="JWE token"
        code={`eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00ifQ.
OKOawDo13gRp2ojaHV7LFpZcgV7T6DVZKTyKOMTYUmKoTCVJRgckCL9kiMT03JGe...
48V1_ALb6US04U3b.
5eym8TW_c8SuK0ltJ3rpYIzOeDQz7TALvtu6UG9oMo4vpzs9tX_EFShS8iB7j6ji...
XFBoag`}
      />

      <p>Five parts separated by dots:</p>
      <GuideRows compact items={[
        ['Header', 'Encryption algorithm and parameters'],
        ['Encrypted Key', 'Encrypted content encryption key'],
        ['Initialization Vector', 'Random IV for encryption'],
        ['Ciphertext', 'Encrypted payload'],
        ['Authentication Tag', 'Integrity verification'],
      ]} />

      <h3>JWE Security Properties</h3>
      <ul>
        <li><strong>Confidentiality:</strong> Payload is encrypted and unreadable</li>
        <li><strong>Integrity:</strong> Authentication tag prevents tampering</li>
        <li><strong>Authenticity:</strong> Verifies the encryptor</li>
      </ul>

      <h2 id="when-to-use">When to Use JWT vs JWE</h2>

      <h3>Use JWT When:</h3>
      <ul>
        <li><strong>Identity tokens:</strong> User authentication and basic claims</li>
        <li><strong>Public information:</strong> User roles, permissions, non-sensitive data</li>
        <li><strong>Performance priority:</strong> Lower overhead than encryption</li>
        <li><strong>Stateless authentication:</strong> Microservices, APIs</li>
        <li><strong>Client-side processing:</strong> JavaScript can read claims without server calls</li>
      </ul>

      <GuideCallout kind="success" label="Example use case:">
        User authentication in a React app where you need
        to check user roles client-side to show/hide UI elements.
      </GuideCallout>

      <h3>Use JWE When:</h3>
      <ul>
        <li><strong>Sensitive data:</strong> Personal information, financial data</li>
        <li><strong>Compliance requirements:</strong> GDPR, HIPAA, PCI-DSS</li>
        <li><strong>Zero-trust networks:</strong> Data transits untrusted infrastructure</li>
        <li><strong>Temporary credentials:</strong> API keys, temporary passwords</li>
        <li><strong>Cross-domain data sharing:</strong> Encrypted data exchange</li>
      </ul>

      <GuideCallout kind="success" label="Example use case:">
        Passing encrypted user data between microservices
        where intermediate proxies or load balancers shouldn't see the content.
      </GuideCallout>

      <h2 id="implementation">Implementation Examples</h2>

      <h3>Creating a JWT</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`const jwt = require('jsonwebtoken');

// Create a standard JWT
const token = jwt.sign(
  {
    sub: '1234567890',
    name: 'John Doe',
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
  },
  'your-secret-key',
  { algorithm: 'HS256' }
);

// Token payload is readable by anyone
console.log(jwt.decode(token)); // Shows payload without verification`}
      />

      <h3>Creating a JWE</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`const jose = require('jose');

async function createJWE() {
  const secret = new TextEncoder().encode('your-256-bit-secret');

  const jwt = await new jose.EncryptJWT({
    sub: '1234567890',
    sensitive_data: 'confidential information',
    ssn: '123-45-6789'
  })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .encrypt(secret);

  return jwt; // Encrypted - payload not readable
}

// Decryption requires the secret
async function decryptJWE(token, secret) {
  const { payload } = await jose.jwtDecrypt(token, secret);
  return payload;
}`}
      />

      <h3>Hybrid Approach: Nested JWT</h3>
      <p>
        You can combine both by creating a JWT and then encrypting it with JWE:
      </p>
      <GuideCodeBlock
        label="Node.js"
        code={`async function createNestedToken() {
  // Step 1: Create a signed JWT
  const innerJWT = jwt.sign(
    { sub: '123', role: 'admin', sensitive: 'data' },
    'signing-secret',
    { algorithm: 'HS256' }
  );

  // Step 2: Encrypt the JWT with JWE
  const encryptedJWT = await new jose.EncryptJWT({ jwt: innerJWT })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(encryptionSecret);

  return encryptedJWT; // Both signed AND encrypted
}`}
      />

      <h2 id="algorithms">Algorithm Choices</h2>

      <h3>JWT Signing Algorithms</h3>
      <GuideRows items={[
        ['HS256', 'HMAC with SHA-256 (shared secret)'],
        ['RS256', 'RSA with SHA-256 (public/private key)'],
        ['ES256', 'ECDSA with P-256 (recommended for new projects)'],
      ]} />

      <h3>JWE Encryption Algorithms</h3>
      <p>Key Management:</p>
      <GuideRows items={[
        ['dir', 'Direct use of shared symmetric key'],
        ['RSA-OAEP', 'RSA with OAEP padding'],
        ['A256KW', 'AES Key Wrap with 256-bit key'],
      ]} />
      <p>Content Encryption:</p>
      <GuideRows items={[
        ['A256GCM', 'AES-256 in GCM mode (recommended)'],
        ['A256CBC-HS512', 'AES-256-CBC with HMAC-SHA-512'],
      ]} />

      <h2 id="performance">Performance Considerations</h2>

      <h3>Computational Overhead</h3>
      <GuideRows compact items={[
        ['JWT (HS256)', 'Very fast - simple HMAC operation'],
        ['JWT (RS256)', 'Moderate - RSA signature verification'],
        ['JWE (A256GCM)', 'Higher - encryption/decryption overhead'],
        ['Nested JWT in JWE', 'Highest - both signing and encryption'],
      ]} />

      <h3>Size Comparison</h3>
      <GuideRows compact items={[
        ['JWT', '~200-400 bytes for typical claims'],
        ['JWE', '~300-600 bytes (includes encryption overhead)'],
        ['Nested', '~400-700 bytes (largest footprint)'],
      ]} />

      <GuideCallout kind="success" label="Optimization tip:">
        For high-throughput APIs, use JWT for non-sensitive
        data and JWE only when confidentiality is required. Consider caching decrypted JWE
        payloads in memory for the token lifetime.
      </GuideCallout>

      <h2 id="best-practices">Security Best Practices</h2>

      <h3>JWT Security</h3>
      <ul>
        <li>Use strong signing keys (256+ bits for HMAC)</li>
        <li>Always validate signatures before trusting payload</li>
        <li>Set appropriate expiration times</li>
        <li>Never store sensitive data in JWT payloads</li>
        <li>Validate all standard claims (exp, iss, aud)</li>
      </ul>

      <h3>JWE Security</h3>
      <ul>
        <li>Use authenticated encryption modes (GCM, CCM)</li>
        <li>Generate unique initialization vectors for each encryption</li>
        <li>Protect encryption keys with the same rigor as signing keys</li>
        <li>Consider key rotation for long-term deployments</li>
        <li>Validate authentication tags before processing plaintext</li>
      </ul>

      <h3>Common Pitfalls</h3>
      <GuideCallout kind="danger" label="Avoid:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Using JWT for sensitive data</strong> - Remember: JWT payloads are readable</li>
          <li><strong>Algorithm confusion</strong> - Always specify allowed algorithms</li>
          <li><strong>Key reuse</strong> - Don't use the same key for signing and encryption</li>
          <li><strong>Missing validation</strong> - Verify tokens before trusting any claims</li>
          <li><strong>Ignoring expiration</strong> - Both JWT and JWE should have time limits</li>
        </ul>
      </GuideCallout>

      <h2 id="decision-framework">Decision Framework</h2>

      <h3>Quick Decision Tree</h3>
      <p><strong>Does your payload contain sensitive data?</strong></p>
      <ul>
        <li>✅ Yes → Use JWE</li>
        <li>❌ No → Continue...</li>
      </ul>
      <p><strong>Do you need client-side access to claims?</strong></p>
      <ul>
        <li>✅ Yes → Use JWT</li>
        <li>❌ No → Continue...</li>
      </ul>
      <p><strong>Is maximum performance critical?</strong></p>
      <ul>
        <li>✅ Yes → Use JWT</li>
        <li>❌ No → Consider JWE for defense in depth</li>
      </ul>

      <h3>Hybrid Scenarios</h3>
      <ul>
        <li><strong>Public claims in JWT + sensitive data in JWE:</strong> Separate tokens for different purposes</li>
        <li><strong>JWT in JWE:</strong> Sign first, encrypt second for both integrity and confidentiality</li>
        <li><strong>Different algorithms per environment:</strong> JWE in production, JWT in development</li>
      </ul>

      <section className="guide-related" aria-labelledby="related-tools-title">
        <h2 id="related-tools-title">Related tools</h2>
        <div className="guide-card-grid">
          <Link href="/jwt-secret"><strong>JWT Secret Generator →</strong><span>Generate secure keys for JWT signing</span></Link>
          <Link href="/encryption-key"><strong>Encryption Key Generator →</strong><span>Generate keys for JWE encryption</span></Link>
          <Link href="/guides/jwt-security"><strong>JWT Security Best Practices →</strong><span>Complete security guide for JWT implementation</span></Link>
          <Link href="/rsa-key"><strong>RSA Key Generator →</strong><span>Generate RSA key pairs for asymmetric encryption</span></Link>
        </div>
      </section>
    </article>
  )
}
