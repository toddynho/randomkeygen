import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'
import { GuideRows } from '@/app/components/guide/GuideRows'

export const metadata: Metadata = {
  title: 'API Key Best Practices: Security Guide for Developers | RandomKeygen',
  description: 'Learn how to generate, store, rotate, and manage API keys securely. Best practices for authentication tokens, secret management, and preventing API key leaks.',
  keywords: ['API key security', 'API key best practices', 'secure API tokens', 'API authentication', 'secret management', 'API key rotation'],
  openGraph: {
    title: 'API Key Best Practices: Security Guide for Developers',
    description: 'Learn how to generate, store, rotate, and manage API keys securely.',
    url: 'https://randomkeygen.com/guides/api-key-best-practices',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/api-key-best-practices',
  },
}

export default function ApiKeyBestPracticesPage() {
  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Developer security</p>
        <h1>API Key Best Practices</h1>
        <p className="guide-deck">
          A comprehensive guide to generating, storing, and managing API keys securely.
        </p>
      </header>

      <h2 id="secure-api-key">What Makes a Secure API Key?</h2>
      <p>
        API keys are the credentials that authenticate your applications with external services.
        A compromised API key can lead to data breaches, financial losses, and service abuse.
        Here's how to keep them secure.
      </p>

      <h3>Key Generation Requirements</h3>
      <ul>
        <li><strong>Length:</strong> Minimum 32 characters for adequate entropy</li>
        <li><strong>Randomness:</strong> Use cryptographically secure random number generators (CSPRNG)</li>
        <li><strong>Character Set:</strong> Alphanumeric (62 characters) provides good entropy density</li>
        <li><strong>Entropy:</strong> Aim for at least 128 bits of entropy</li>
      </ul>

      <p>Recommended entropy levels:</p>
      <GuideRows items={[
        ['128 bits', 'Good for most applications'],
        ['192 bits', 'High-security applications'],
        ['256 bits', 'Maximum security / encryption keys'],
      ]} />

      <h2 id="prefixes">Use Meaningful Prefixes</h2>
      <p>
        Key prefixes help identify the type and environment of a key at a glance,
        making it easier to detect misuse and prevent accidents.
      </p>

      <p>Common prefix patterns:</p>
      <GuideRows items={[
        ['sk_live_', 'Secret key, production'],
        ['sk_test_', 'Secret key, test/sandbox'],
        ['pk_live_', 'Public key, production'],
        ['pk_test_', 'Public key, test/sandbox'],
        ['rk_', 'Restricted/limited permissions'],
      ]} />

      <p>
        Prefixes make it easy to set up automated scanning for leaked keys. Services like
        GitHub's secret scanning can detect keys with known prefixes.
      </p>

      <h2 id="storage">Storage Best Practices</h2>

      <h3>Do: Use Environment Variables</h3>
      <GuideCodeBlock
        label="Environment variables"
        code={`# .env (never commit this file!)
STRIPE_API_KEY=sk_live_abc123...
DATABASE_URL=postgres://...

# Access in code
const apiKey = process.env.STRIPE_API_KEY;`}
      />

      <h3>Do: Use Secret Management Services</h3>
      <ul>
        <li><strong>AWS Secrets Manager</strong> - Automatic rotation, IAM integration</li>
        <li><strong>HashiCorp Vault</strong> - Self-hosted, dynamic secrets</li>
        <li><strong>Google Secret Manager</strong> - GCP-native, versioning</li>
        <li><strong>Azure Key Vault</strong> - Azure-native, HSM-backed</li>
      </ul>

      <h3>Don't: Store in Code or Repos</h3>
      <GuideCodeBlock
        label="Node.js"
        segments={[
          { text: '// NEVER do this!\n', tone: 'vulnerable' },
          { text: 'const apiKey = "sk_live_abc123...";  ' },
          { text: '// Hardcoded\n', tone: 'comment' },
          { text: "const config = require('./config.json');  " },
          { text: '// Committed file', tone: 'comment' },
        ]}
      />

      <h3>Don't: Log API Keys</h3>
      <GuideCodeBlock
        label="Node.js"
        segments={[
          { text: '// NEVER do this!\n', tone: 'vulnerable' },
          { text: 'console.log("Using API key:", apiKey);\nlogger.info({ apiKey, request });' },
        ]}
      />

      <h2 id="rotation">Key Rotation Strategy</h2>
      <p>
        Regular key rotation limits the window of exposure if a key is compromised.
        Implement a rotation strategy that minimizes downtime.
      </p>

      <h3>Rotation Process</h3>
      <ol className="list-decimal pl-6">
        <li><strong>Generate new key</strong> - Create a new key before revoking the old one</li>
        <li><strong>Deploy new key</strong> - Update your applications to use the new key</li>
        <li><strong>Verify functionality</strong> - Ensure everything works with the new key</li>
        <li><strong>Revoke old key</strong> - Disable the previous key</li>
        <li><strong>Monitor</strong> - Watch for any failures using the old key</li>
      </ol>

      <p>Recommended rotation frequency:</p>
      <GuideRows compact items={[
        ['High-security keys', 'Every 30-90 days'],
        ['Standard keys', 'Every 90-180 days'],
        ['After incidents', 'Immediately'],
        ['Personnel changes', 'When developers leave the team'],
      ]} />

      <h2 id="access-control">Access Control &amp; Permissions</h2>
      <p>
        Follow the principle of least privilege. Each key should have only the
        permissions it needs to function.
      </p>

      <h3>Permission Scoping</h3>
      <ul>
        <li><strong>Read-only keys</strong> for analytics and reporting</li>
        <li><strong>Write keys</strong> only where needed</li>
        <li><strong>Admin keys</strong> only for administrative applications</li>
        <li><strong>Environment separation</strong> - different keys for dev/staging/production</li>
      </ul>

      <h3>Rate Limiting &amp; Quotas</h3>
      <p>
        Set rate limits and quotas on your API keys to prevent abuse:
      </p>
      <ul>
        <li>Requests per minute/hour/day</li>
        <li>Maximum data transfer</li>
        <li>IP allowlisting where possible</li>
      </ul>

      <h2 id="monitoring">Monitoring &amp; Alerting</h2>
      <p>
        Active monitoring helps detect compromised keys quickly:
      </p>

      <ul>
        <li><strong>Usage anomalies</strong> - Sudden spikes in API calls</li>
        <li><strong>Geographic anomalies</strong> - Requests from unexpected locations</li>
        <li><strong>Failed authentication</strong> - Multiple failed auth attempts</li>
        <li><strong>Secret scanning</strong> - Monitor GitHub, GitLab for leaked keys</li>
      </ul>

      <GuideCallout kind="success" label="Pro tip:">
        Use services like{' '}
        <a href="https://haveibeenpwned.com/API" target="_blank" rel="noopener">
          HaveIBeenPwned
        </a>{' '}
        to check if your keys have appeared in data breaches.
      </GuideCallout>

      <h2 id="emergency-response">Emergency Response</h2>
      <p>
        If you suspect an API key has been compromised:
      </p>

      <ol className="list-decimal pl-6">
        <li><strong>Revoke immediately</strong> - Disable the compromised key</li>
        <li><strong>Audit usage</strong> - Review logs for unauthorized access</li>
        <li><strong>Generate new key</strong> - Create a replacement with new value</li>
        <li><strong>Deploy replacement</strong> - Update all applications</li>
        <li><strong>Investigate</strong> - Determine how the key was exposed</li>
        <li><strong>Document</strong> - Record the incident and response</li>
      </ol>

      <section className="guide-related" aria-labelledby="related-tools-title">
        <h2 id="related-tools-title">Related tools</h2>
        <div className="guide-card-grid">
          <Link href="/api-key"><strong>API Key Generator →</strong><span>Generate secure API tokens with prefixes</span></Link>
          <Link href="/jwt-secret"><strong>JWT Secret Generator →</strong><span>Generate signing keys for JWTs</span></Link>
          <Link href="/secret-key"><strong>Secret Key Generator →</strong><span>Generate general-purpose secrets</span></Link>
          <Link href="/guides/jwt-security"><strong>JWT Security Guide →</strong><span>Best practices for JWT tokens</span></Link>
        </div>
      </section>
    </article>
  )
}
