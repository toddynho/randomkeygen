import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'
import { GuideRows } from '@/app/components/guide/GuideRows'

export const metadata: Metadata = {
  title: 'Encryption Explained: AES vs RSA - When to Use Each | RandomKeygen',
  description: 'Practical guide to encryption: symmetric vs asymmetric, AES key sizes, RSA for key exchange, and choosing the right encryption for your application.',
  keywords: ['encryption explained', 'AES vs RSA', 'symmetric encryption', 'asymmetric encryption', 'AES-256', 'public key cryptography', 'encryption guide'],
  openGraph: {
    title: 'Encryption Explained: AES vs RSA',
    description: 'A practical guide to choosing and implementing encryption.',
    url: 'https://randomkeygen.com/guides/encryption-explained',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/encryption-explained',
  },
}

export default function EncryptionExplainedPage() {
  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Encryption</p>
        <h1>Encryption Explained: AES, RSA, and When to Use Each</h1>
        <p className="guide-deck">
          A practical guide to symmetric vs asymmetric encryption, key sizes,
          and choosing the right approach for your application.
        </p>
        <p className="guide-byline">Encryption · 10 min read</p>
      </header>

      <h2 id="two-types">Two Types of Encryption</h2>
      <p>
        All modern encryption falls into two categories:
      </p>

      <h3>Symmetric (AES)</h3>
      <p>
        Same key encrypts and decrypts. Fast. Used for bulk data.
      </p>
      <GuideCodeBlock
        label="Symmetric"
        code={`encrypt(data, key) → ciphertext
decrypt(ciphertext, key) → data`}
      />

      <h3>Asymmetric (RSA)</h3>
      <p>
        Key pair: public encrypts, private decrypts. Slower. Used for key exchange.
      </p>
      <GuideCodeBlock
        label="Asymmetric"
        code={`encrypt(data, publicKey) → ciphertext
decrypt(ciphertext, privateKey) → data`}
      />

      <p>
        In practice, most systems use <strong>both</strong>: RSA to securely exchange
        an AES key, then AES for the actual data encryption.
      </p>

      <h2 id="aes">AES: The Workhorse</h2>
      <p>
        AES (Advanced Encryption Standard) is the most widely used encryption algorithm.
        It&apos;s what protects your HTTPS connections, encrypted drives, and password vaults.
      </p>

      <table>
        <thead>
          <tr>
            <th>Key Size</th>
            <th>Security Level</th>
            <th>Use Case</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>AES-128</code></td>
            <td>Secure until ~2030+</td>
            <td>General use, slightly faster</td>
          </tr>
          <tr>
            <td><code>AES-192</code></td>
            <td>Rarely used</td>
            <td>Middle ground, not common</td>
          </tr>
          <tr>
            <td><code>AES-256</code></td>
            <td>Recommended</td>
            <td>High security, future-proof</td>
          </tr>
        </tbody>
      </table>

      <GuideCodeBlock
        label="Node.js"
        code={`const crypto = require('crypto');

// Generate a random 256-bit key
const key = crypto.randomBytes(32);  // 32 bytes = 256 bits
const iv = crypto.randomBytes(16);   // Initialization vector

// Encrypt
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update('secret data', 'utf8', 'hex');
encrypted += cipher.final('hex');
const authTag = cipher.getAuthTag();

// Decrypt
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
decipher.setAuthTag(authTag);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');`}
      />

      <p className="guide-inline-cta">Need a key right now? <Link href="/aes-key">Generate an AES key</Link> — created locally, never transmitted.</p>

      <h2 id="rsa">RSA: For Key Exchange and Signatures</h2>
      <p>
        RSA uses a key pair: share your public key with everyone, keep your private key secret.
        Anyone can encrypt a message with your public key, but only you can decrypt it.
      </p>

      <h3>RSA Key Sizes</h3>
      <GuideRows compact items={[
        ['2048 bits', 'Minimum acceptable, equivalent to ~112-bit symmetric'],
        ['3072 bits', 'Recommended for 2030+'],
        ['4096 bits', 'High security, slower operations'],
      ]} />

      <p>
        RSA is too slow for encrypting large amounts of data. Instead, it&apos;s used to:
      </p>

      <ul>
        <li><strong>Key exchange</strong> - Securely send an AES key to someone</li>
        <li><strong>Digital signatures</strong> - Prove a message came from you</li>
        <li><strong>Authentication</strong> - SSH keys, code signing</li>
      </ul>

      <p className="guide-inline-cta">Working with key pairs? <Link href="/rsa-key">Generate an RSA key pair</Link> — created locally, never transmitted.</p>

      <h2 id="hybrid">Hybrid Encryption in Practice</h2>
      <p>
        Here&apos;s how HTTPS, email encryption, and most secure systems actually work:
      </p>

      <ol className="list-decimal pl-6">
        <li>Alice generates a random AES key (session key)</li>
        <li>Alice encrypts the AES key with Bob&apos;s RSA public key</li>
        <li>Alice encrypts her message with the AES key</li>
        <li>Alice sends: [RSA-encrypted AES key] + [AES-encrypted message]</li>
        <li>Bob decrypts the AES key with his RSA private key</li>
        <li>Bob decrypts the message with the AES key</li>
      </ol>

      <p>
        This gives you the best of both worlds: RSA&apos;s secure key exchange and AES&apos;s speed
        for bulk encryption.
      </p>

      <h2 id="decision-guide">Quick Decision Guide</h2>

      <table>
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Encrypting files on disk</td>
            <td><code>AES-256-GCM</code></td>
          </tr>
          <tr>
            <td>Encrypting database fields</td>
            <td><code>AES-256-GCM</code></td>
          </tr>
          <tr>
            <td>Secure communication between two parties</td>
            <td><code>RSA + AES (hybrid)</code></td>
          </tr>
          <tr>
            <td>Signing JWTs</td>
            <td><code>RS256 (RSA) or HS256 (HMAC)</code></td>
          </tr>
          <tr>
            <td>SSH authentication</td>
            <td><code>Ed25519 or RSA-4096</code></td>
          </tr>
          <tr>
            <td>Password hashing</td>
            <td><code>bcrypt or Argon2 (not AES/RSA!)</code></td>
          </tr>
        </tbody>
      </table>

      <h2 id="common-mistakes">Common Mistakes to Avoid</h2>

      <GuideCallout kind="danger" label="Using ECB Mode:">
        ECB (Electronic Codebook) encrypts identical blocks identically, leaking patterns.
        Always use GCM, CBC with HMAC, or another authenticated mode.
      </GuideCallout>

      <GuideCallout kind="danger" label="Reusing IVs/Nonces:">
        Each encryption operation needs a unique IV. Reusing them can completely
        break the encryption. Generate randomly or use a counter.
      </GuideCallout>

      <GuideCallout kind="danger" label="Rolling Your Own Crypto:">
        Use well-tested libraries (libsodium, OpenSSL, Web Crypto API).
        Cryptography is full of subtle pitfalls that experts miss.
      </GuideCallout>

      <section className="guide-related" aria-labelledby="related-tools-title">
        <h2 id="related-tools-title">Related tools</h2>
        <div className="guide-card-grid">
          <Link href="/aes-key"><strong>AES Keys →</strong><span>Generate random AES-128, AES-192, and AES-256 keys.</span></Link>
          <Link href="/rsa-key"><strong>RSA Key Pairs →</strong><span>Generate RSA key pairs for key exchange and signatures.</span></Link>
          <Link href="/encryption-key"><strong>Generic Encryption Keys →</strong><span>Generate general-purpose encryption keys.</span></Link>
        </div>
      </section>
    </article>
  )
}
