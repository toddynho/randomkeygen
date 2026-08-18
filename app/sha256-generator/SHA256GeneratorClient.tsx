'use client'

import { GeneratorLayout, SecurityNotice, CodeBlock, RelatedContent } from '../components'
import { encryptionRelated } from '../components/RelatedContent'
import SHA256Generator from '../components/SHA256Generator'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption Key Generators', url: '/encryption' },
  { name: 'SHA-256 Generator', url: '/sha256-generator' },
]

// How-to cards derived from the page's existing HowTo schema
const HOW_TO_STEPS = [
  {
    title: 'Enter text or upload file',
    body: 'Type your text into the input field or upload a file you want to hash.',
  },
  {
    title: 'Generate hash',
    body: 'The SHA-256 hash is computed automatically as you type, entirely in your browser.',
  },
  {
    title: 'Copy result',
    body: 'Copy the generated SHA-256 hash to use for verification or storage.',
  },
]

interface SHA256GeneratorClientProps {
  schema?: Record<string, unknown>[]
}

export default function SHA256GeneratorClient({ schema }: SHA256GeneratorClientProps) {
  return (
    <GeneratorLayout
      title="SHA-256 Hash Generator"
      description="Generate secure SHA-256 hashes from text or files. Perfect for checksums, file verification, and ensuring data integrity across systems."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      howToSteps={HOW_TO_STEPS}
      howToHeading="How to generate a SHA-256 hash"
    >
      {/* Main Generator */}
      <SHA256Generator />

      {/* Security Notice */}
      <section className="mb-8 mt-6">
        <SecurityNotice type="info" title="About SHA-256 Security">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Cryptographically secure</strong> - SHA-256 is approved by NIST and widely trusted</li>
            <li><strong>One-way function</strong> - Cannot be reversed to recover original input</li>
            <li><strong>Deterministic</strong> - Same input always produces the same 64-character hex output</li>
            <li><strong>Collision resistant</strong> - Extremely difficult to find two inputs with same hash</li>
          </ul>
        </SecurityNotice>
      </section>

      {/* Use Cases */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Common SHA-256 Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: 'File Verification', body: "Verify file integrity after downloads. Compare SHA-256 checksums to ensure files haven't been corrupted or modified." },
            { title: 'Bitcoin Mining', body: "SHA-256 is the core algorithm used in Bitcoin's proof-of-work mining process and block creation." },
            { title: 'Digital Signatures', body: 'Create digital signatures by hashing documents before encryption, improving efficiency and security.' },
            { title: 'Data Deduplication', body: 'Identify duplicate content in storage systems by comparing SHA-256 hashes instead of full content.' },
            { title: 'Password Storage', body: 'Part of password hashing schemes like PBKDF2-SHA256, though use bcrypt/Argon2 for direct password storage.' },
            { title: 'Caching Keys', body: 'Generate unique, fixed-length cache keys from variable-length input data for efficient storage systems.' },
          ].map((useCase) => (
            <div key={useCase.title} className="card p-4">
              <h3 className="font-medium mb-2">{useCase.title}</h3>
              <p className="text-sm text-[var(--muted)]">{useCase.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison with Other Hashes */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">SHA-256 vs Other Hash Functions</h2>
        <div className="overflow-hidden card">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--hairline)] bg-[var(--band)] text-left">
                  <th className="p-3 font-semibold">Algorithm</th>
                  <th className="p-3 font-semibold">Output Size</th>
                  <th className="p-3 font-semibold">Security</th>
                  <th className="p-3 font-semibold">Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--hairline)]">
                  <td className="p-3 font-mono">MD5</td>
                  <td className="p-3">128-bit (32 chars)</td>
                  <td className="p-3 font-semibold text-[var(--destructive)]">Broken</td>
                  <td className="p-3 text-[var(--muted)]">Legacy checksums only</td>
                </tr>
                <tr className="border-b border-[var(--hairline)]">
                  <td className="p-3 font-mono">SHA-1</td>
                  <td className="p-3">160-bit (40 chars)</td>
                  <td className="p-3 font-semibold text-[var(--warning)]">Deprecated</td>
                  <td className="p-3 text-[var(--muted)]">Git commits (legacy)</td>
                </tr>
                <tr className="border-b border-[var(--hairline)] bg-[var(--accent-soft)]">
                  <td className="p-3 font-mono font-bold">SHA-256</td>
                  <td className="p-3 font-bold">256-bit (64 chars)</td>
                  <td className="p-3 font-bold text-[var(--accent-strong)]">Secure</td>
                  <td className="p-3 font-bold">Recommended standard</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono">SHA-512</td>
                  <td className="p-3">512-bit (128 chars)</td>
                  <td className="p-3 font-semibold text-[var(--accent-strong)]">Very Secure</td>
                  <td className="p-3 text-[var(--muted)]">High-security applications</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Programming Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate SHA-256 in Code</h2>
        <div className="space-y-4">
          <CodeBlock
            filename="JavaScript (Browser)"
            code={`// Using Web Crypto API
async function sha256(text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const hash = await sha256('Hello World')
console.log(hash) // a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e`}
          />
          <CodeBlock
            filename="Node.js"
            code={`const crypto = require('crypto')

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex')
}

const hash = sha256('Hello World')
console.log(hash) // a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e`}
          />
          <CodeBlock
            filename="Python"
            code={`import hashlib

def sha256(text):
    return hashlib.sha256(text.encode()).hexdigest()

hash_value = sha256('Hello World')
print(hash_value)  # a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e`}
          />
          <CodeBlock
            filename="Terminal Commands"
            code={`# Hash text
echo -n "Hello World" | sha256sum
echo -n "Hello World" | openssl dgst -sha256

# Hash files
sha256sum filename.txt
openssl dgst -sha256 filename.txt

# Verify file integrity
sha256sum --check checksums.txt`}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Is SHA-256 reversible?',
              a: "No, SHA-256 is a one-way cryptographic hash function. It's computationally infeasible to reverse a SHA-256 hash to recover the original input. This is by design and a core security feature.",
            },
            {
              q: 'How long is a SHA-256 hash?',
              a: 'SHA-256 produces a 256-bit (32-byte) hash, typically displayed as a 64-character hexadecimal string. Each hex character represents 4 bits, so 64 × 4 = 256 bits.',
            },
            {
              q: 'Can I use SHA-256 for passwords?',
              a: "Don't use plain SHA-256 for password storage. It's too fast and vulnerable to rainbow table attacks. Use bcrypt, Argon2, or scrypt instead, which include salting and are intentionally slow.",
            },
            {
              q: 'Is SHA-256 the same as AES-256?',
              a: "No, they're completely different. SHA-256 is a one-way hash function for data integrity, while AES-256 is a symmetric encryption algorithm for securing data that needs to be decrypted later.",
            },
            {
              q: "What's the difference between SHA-256 and SHA-512?",
              a: 'SHA-512 produces longer hashes (512-bit vs 256-bit) and offers higher theoretical security, but SHA-256 is sufficient for most applications and is more widely supported and efficient.',
            },
          ].map((faq) => (
            <details key={faq.q} className="group card">
              <summary className="cursor-pointer p-4 transition-colors hover:bg-[var(--band)]">
                <strong>{faq.q}</strong>
              </summary>
              <div className="p-4 pt-0 text-[var(--muted)]">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">SHA-256 Best Practices</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-4">
            <h3 className="font-medium text-[var(--accent-strong)] mb-3">✓ Do</h3>
            <ul className="space-y-1 text-sm text-[var(--muted)]">
              <li>• Use for file integrity verification</li>
              <li>• Implement in digital signature schemes</li>
              <li>• Use for blockchain and cryptocurrency</li>
              <li>• Generate cache keys from variable data</li>
              <li>• Use in HMAC constructions for authentication</li>
              <li>• Verify software download checksums</li>
            </ul>
          </div>
          <div className="card p-4">
            <h3 className="font-medium text-[var(--destructive)] mb-3">✗ Don&apos;t</h3>
            <ul className="space-y-1 text-sm text-[var(--muted)]">
              <li>• Use plain SHA-256 for password storage</li>
              <li>• Expect to reverse hashes to get original data</li>
              <li>• Use for generating random values</li>
              <li>• Hash sensitive data without proper key management</li>
              <li>• Assume collision resistance for eternity</li>
              <li>• Use for encryption (it&apos;s hashing, not encryption)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <RelatedContent {...encryptionRelated} />
    </GeneratorLayout>
  )
}
