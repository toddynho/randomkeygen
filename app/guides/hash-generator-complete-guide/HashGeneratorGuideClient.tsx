import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'

const cardClass = 'rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]'
const cardTitleClass = 'mb-2 font-semibold text-[var(--foreground)]'
const cardListClass = 'list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--body)]'

const chipClass = {
  weak: 'bg-[var(--chip-danger-bg)] text-[var(--danger-text)] border border-[var(--chip-danger-border)]',
  medium: 'bg-[var(--warn-bg)] text-[var(--warn-strong)] border border-[var(--warn-border)]',
  strong: 'bg-[var(--ok-bg)] text-[var(--ok-text)] border border-[var(--ok-border)]',
  'very-strong': 'bg-[var(--info-bg)] text-[var(--info-text)] border border-[var(--info-border)]',
  slow: 'bg-[var(--chip-danger-bg)] text-[var(--danger-text)] border border-[var(--chip-danger-border)]',
  fast: 'bg-[var(--ok-bg)] text-[var(--ok-text)] border border-[var(--ok-border)]',
  'very-fast': 'bg-[var(--info-bg)] text-[var(--info-text)] border border-[var(--info-border)]',
} as const

function HashCard({
  title,
  algorithm,
  strength,
  speed,
  useCase,
  description,
  outputExample,
  whenToUse,
  whenNotToUse,
  tools,
}: {
  title: string
  algorithm: string
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  speed: 'slow' | 'medium' | 'fast' | 'very-fast'
  useCase: string
  description: string
  outputExample: string
  whenToUse: string[]
  whenNotToUse: string[]
  tools: string[]
}) {
  return (
    <>
      <h3 className="flex flex-wrap items-center gap-2">
        {title}
        <span className={`rounded-full px-2 py-0.5 text-11 font-bold uppercase tracking-wide ${chipClass[strength]}`}>
          {strength.replace('-', ' ')} security
        </span>
        <span className={`rounded-full px-2 py-0.5 text-11 font-bold uppercase tracking-wide ${chipClass[speed]}`}>
          {speed.replace('-', ' ')} speed
        </span>
      </h3>
      <p><strong>Algorithm: {algorithm}.</strong> {description}</p>
      <p><strong>Primary Use Case:</strong> {useCase}</p>
      <GuideCodeBlock label="Example output" code={outputExample} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>When to Use</h4>
          <ul className={cardListClass}>
            {whenToUse.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>When NOT to Use</h4>
          <ul className={cardListClass}>
            {whenNotToUse.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
      <p>
        {tools.map((tool, index) => (
          <span key={tool}>
            {index > 0 && ' · '}
            <Link href={tool.startsWith('/') ? tool : `/${tool}`}>
              {tool.replace('/', '').replace('-', ' ').toUpperCase()} Generator →
            </Link>
          </span>
        ))}
      </p>
    </>
  )
}

export default function HashGeneratorGuideClient() {
  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Encryption</p>
        <h1>Hash Generator Complete Guide</h1>
        <p className="guide-deck">
          Master cryptographic hash functions for security, data integrity, and modern applications.
          Complete guide to MD5, SHA-2, SHA-3, BCrypt, and when to use each algorithm.
        </p>
      </header>

      <h2 id="quick-access">Quick Hash Generator Access</h2>
      <div className="guide-card-grid">
        <Link href="/sha256-generator"><strong>SHA256 →</strong><span>Most Popular</span></Link>
        <Link href="/hash-generator"><strong>All Hashes →</strong><span>Universal Tool</span></Link>
        <Link href="/bcrypt-generator"><strong>BCrypt →</strong><span>Password Hashing</span></Link>
        <Link href="/md5-hash"><strong>MD5 →</strong><span>Legacy/Checksums</span></Link>
      </div>

      <h2 id="what-are-hash-functions">What are Hash Functions?</h2>
      <p>
        Hash functions are mathematical algorithms that convert input data of any size into
        a fixed-size string of bytes. They&apos;re fundamental to computer security, data integrity,
        and many cryptographic applications.
      </p>
      <h3>Key Properties:</h3>
      <ul>
        <li><strong>Deterministic:</strong> Same input always produces same output</li>
        <li><strong>Fixed Output Size:</strong> Hash length stays constant regardless of input size</li>
        <li><strong>Avalanche Effect:</strong> Small input change dramatically changes output</li>
        <li><strong>One-Way Function:</strong> Nearly impossible to reverse the process</li>
      </ul>
      <h3>Hash Function Example</h3>
      <GuideCodeBlock
        label="SHA-256 example"
        code={`# Input: "Hello World"
a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e

# Input: "Hello World!" (one char change)
7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`}
      />

      <h2 id="modern-hash-functions">Modern Secure Hash Functions</h2>

      <HashCard
        title="SHA-256"
        algorithm="SHA-2 Family"
        strength="strong"
        speed="fast"
        useCase="General-purpose security, blockchain, digital signatures"
        description="The most widely used secure hash function today. Part of the SHA-2 family, designed by NSA and adopted globally for security applications."
        outputExample="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        whenToUse={[
          'Data integrity verification',
          'Digital signatures and certificates',
          'Blockchain and cryptocurrency',
          'Password storage (with salt)',
          'File checksums for security',
        ]}
        whenNotToUse={[
          'Direct password hashing (use BCrypt instead)',
          'When you need faster performance for non-security use',
          'Systems requiring post-quantum security',
        ]}
        tools={['sha256-generator', 'hash-generator']}
      />

      <HashCard
        title="SHA-512"
        algorithm="SHA-2 Family"
        strength="very-strong"
        speed="medium"
        useCase="High-security applications, large-scale systems"
        description="Stronger variant of SHA-2 with 512-bit output. Provides higher security margin and is preferred for applications requiring maximum security."
        outputExample="cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e"
        whenToUse={[
          'Maximum security requirements',
          'Government and military applications',
          'Long-term data integrity (10+ years)',
          'Root certificate authorities',
          'High-value transaction verification',
        ]}
        whenNotToUse={[
          'Performance-critical applications',
          'Mobile apps with limited processing power',
          'When 256-bit security is sufficient',
        ]}
        tools={['hash-generator']}
      />

      <HashCard
        title="SHA-3 (Keccak)"
        algorithm="SHA-3 Family"
        strength="very-strong"
        speed="medium"
        useCase="Next-generation security, quantum-resistant applications"
        description="Latest SHA standard with different internal structure than SHA-2. Provides additional security assurance and is being adopted for future-proofing."
        outputExample="a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a"
        whenToUse={[
          'Future-proofing against cryptographic advances',
          'Systems requiring diverse hash algorithms',
          'Compliance with latest standards',
          'Research and experimental applications',
        ]}
        whenNotToUse={[
          'Legacy system compatibility required',
          'When SHA-2 is mandated by standards',
          'Performance is the primary concern',
        ]}
        tools={['hash-generator']}
      />

      <HashCard
        title="BCrypt"
        algorithm="Adaptive Hash Function"
        strength="very-strong"
        speed="slow"
        useCase="Password hashing and authentication systems"
        description="Designed specifically for password hashing. Uses adaptive cost parameter to remain secure against advancing hardware capabilities."
        outputExample="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNi9cK2K.ljq"
        whenToUse={[
          'User password storage',
          'Authentication systems',
          'Any application storing sensitive credentials',
          'When you need built-in salting',
        ]}
        whenNotToUse={[
          'File integrity checking',
          'Digital signatures',
          'High-performance applications',
          'Real-time systems',
        ]}
        tools={['bcrypt-generator']}
      />

      <h2 id="legacy-hash-functions">Legacy and Specialized Hash Functions</h2>

      <HashCard
        title="MD5"
        algorithm="Message Digest 5"
        strength="weak"
        speed="very-fast"
        useCase="Checksums, non-security applications, legacy systems"
        description="Fast legacy hash function. Cryptographically broken but still useful for non-security applications like checksums and data deduplication."
        outputExample="5d41402abc4b2a76b9719d911017c592"
        whenToUse={[
          'File integrity checks (non-security)',
          'Data deduplication',
          'Legacy system compatibility',
          'Quick data fingerprinting',
          'Cache keys and database indexing',
        ]}
        whenNotToUse={[
          'Password storage',
          'Security-critical applications',
          'Digital signatures',
          'Cryptographic protocols',
          'Any application where collision resistance matters',
        ]}
        tools={['md5-hash', 'hash-generator']}
      />

      <HashCard
        title="SHA-1"
        algorithm="Secure Hash Algorithm 1"
        strength="weak"
        speed="fast"
        useCase="Legacy compatibility (deprecated for security use)"
        description="Predecessor to SHA-2. Cryptographically broken since 2017 but still found in legacy systems. Should be migrated to SHA-2 or SHA-3."
        outputExample="aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d"
        whenToUse={[
          'Legacy system maintenance only',
          'Git commit hashing (being phased out)',
          'Non-security data fingerprinting',
        ]}
        whenNotToUse={[
          'Any new security applications',
          'Digital certificates',
          'Password hashing',
          'Cryptographic protocols',
          'Long-term data integrity',
        ]}
        tools={['hash-generator']}
      />

      <HashCard
        title="BLAKE2"
        algorithm="BLAKE2b/BLAKE2s"
        strength="strong"
        speed="very-fast"
        useCase="High-performance applications, cryptocurrency, file systems"
        description="High-speed secure hash function. Faster than SHA-2 while maintaining security. Popular in performance-critical applications."
        outputExample="786a02f742015903c6c6fd852552d272912f4740e15847618a86e217f71f5419d25e1031afee585313896444934eb04b903a685b1448b755d56f701afe9be2ce"
        whenToUse={[
          'High-performance applications',
          'Real-time systems',
          'Cryptocurrency mining',
          'File system integrity',
          'Network protocols requiring speed',
        ]}
        whenNotToUse={[
          'When SHA-2 compatibility is required',
          'Regulated environments requiring FIPS approval',
          "Applications where speed isn't critical",
        ]}
        tools={['hash-generator']}
      />

      <h2 id="comparison">Hash Function Comparison</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Output Size</th>
              <th>Security Level</th>
              <th>Performance</th>
              <th>Best Use Case</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>SHA-256</strong></td>
              <td>256 bits</td>
              <td>Strong</td>
              <td>Fast</td>
              <td>General security</td>
              <td>Recommended</td>
            </tr>
            <tr>
              <td><strong>SHA-512</strong></td>
              <td>512 bits</td>
              <td>Very Strong</td>
              <td>Medium</td>
              <td>High security</td>
              <td>Recommended</td>
            </tr>
            <tr>
              <td><strong>SHA-3</strong></td>
              <td>Variable</td>
              <td>Very Strong</td>
              <td>Medium</td>
              <td>Future-proofing</td>
              <td>Recommended</td>
            </tr>
            <tr>
              <td><strong>BCrypt</strong></td>
              <td>184 bits</td>
              <td>Very Strong</td>
              <td>Slow</td>
              <td>Password hashing</td>
              <td>Recommended</td>
            </tr>
            <tr>
              <td><strong>BLAKE2</strong></td>
              <td>256/512 bits</td>
              <td>Strong</td>
              <td>Very Fast</td>
              <td>High performance</td>
              <td>Recommended</td>
            </tr>
            <tr>
              <td><strong>MD5</strong></td>
              <td>128 bits</td>
              <td>Broken</td>
              <td>Very Fast</td>
              <td>Checksums only</td>
              <td>Legacy Only</td>
            </tr>
            <tr>
              <td><strong>SHA-1</strong></td>
              <td>160 bits</td>
              <td>Broken</td>
              <td>Fast</td>
              <td>Legacy systems</td>
              <td>Deprecated</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="choosing">Choosing the Right Hash Function</h2>

      <h3>For Password Storage</h3>
      <GuideCallout kind="success" label="Recommended:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li><strong>BCrypt</strong> - Industry standard, adaptive cost</li>
          <li><strong>Argon2</strong> - Modern, memory-hard function</li>
          <li><strong>PBKDF2</strong> - NIST approved, widely supported</li>
        </ul>
      </GuideCallout>
      <GuideCallout kind="danger" label="Never use:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Plain SHA-256/SHA-512 (too fast)</li>
          <li>MD5 or SHA-1 (cryptographically broken)</li>
          <li>Unsalted hashes (rainbow table attacks)</li>
        </ul>
      </GuideCallout>

      <h3>For Data Integrity</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Security Critical</h4>
          <ul className={cardListClass}>
            <li>SHA-256 (recommended)</li>
            <li>SHA-512 (high security)</li>
            <li>SHA-3 (future-proof)</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Performance Critical</h4>
          <ul className={cardListClass}>
            <li>BLAKE2 (fastest secure)</li>
            <li>SHA-256 (good balance)</li>
            <li>xxHash (non-crypto, speed)</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Legacy/Non-Security</h4>
          <ul className={cardListClass}>
            <li>MD5 (checksums only)</li>
            <li>CRC32 (error detection)</li>
            <li>SHA-1 (if required by legacy)</li>
          </ul>
        </div>
      </div>

      <h3>For High-Performance Applications</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Real-Time Systems</h4>
          <p className="mb-2 text-sm leading-6 text-[var(--body)]">When speed is critical but security still matters:</p>
          <ul className={cardListClass}>
            <li>BLAKE2b/BLAKE2s (fastest secure option)</li>
            <li>SHA-256 (if BLAKE2 not available)</li>
            <li>Hardware-accelerated hashes when available</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Non-Cryptographic Use</h4>
          <p className="mb-2 text-sm leading-6 text-[var(--body)]">When security isn&apos;t required:</p>
          <ul className={cardListClass}>
            <li>xxHash (extremely fast)</li>
            <li>CityHash (Google&apos;s fast hash)</li>
            <li>MurmurHash (good distribution)</li>
          </ul>
        </div>
      </div>

      <h2 id="security-best-practices">Hash Function Security Best Practices</h2>
      <h3>Security Guidelines</h3>
      <GuideCallout kind="success" label="Always use salt:">
        Add random salt to prevent rainbow table attacks and make each hash unique.
      </GuideCallout>
      <GuideCallout kind="success" label="Choose appropriate algorithm:">
        Use password-specific functions (BCrypt) for passwords, SHA-2/3 for general security.
      </GuideCallout>
      <GuideCallout kind="success" label="Keep libraries updated:">
        Regularly update cryptographic libraries to patch security vulnerabilities.
      </GuideCallout>
      <h3>Common Mistakes</h3>
      <GuideCallout kind="danger" label="Using broken algorithms:">
        Avoid MD5 and SHA-1 for security. They&apos;re cryptographically broken and vulnerable.
      </GuideCallout>
      <GuideCallout kind="warning" label="No salt or fixed salt:">
        Never use the same salt for all hashes. Generate unique salts for each hash.
      </GuideCallout>
      <GuideCallout kind="warning" label="Wrong algorithm for purpose:">
        Don&apos;t use fast hashes for passwords or slow hashes for performance-critical code.
      </GuideCallout>

      <h2 id="implementation-examples">Implementation Examples</h2>
      <h3>Secure Password Hashing</h3>
      <GuideCodeBlock
        label="Node.js (BCrypt)"
        code={`const bcrypt = require('bcryptjs');

// Hash password
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(
  password,
  saltRounds
);

// Verify password
const isValid = await bcrypt.compare(
  password,
  hashedPassword
);`}
      />
      <GuideCodeBlock
        label="Python (BCrypt)"
        code={`import bcrypt

# Hash password
password = "user_password"
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(
    password.encode('utf-8'),
    salt
)

# Verify password
is_valid = bcrypt.checkpw(
    password.encode('utf-8'),
    hashed
)`}
      />
      <h3>Data Integrity Checking</h3>
      <GuideCodeBlock
        label="SHA-256 (Node.js)"
        code={`const crypto = require('crypto');

// Hash string
const hash = crypto
  .createHash('sha256')
  .update('data to hash')
  .digest('hex');

// Hash file
const fs = require('fs');
const hash = crypto.createHash('sha256');
const stream = fs.createReadStream('file.txt');
stream.on('data', data => hash.update(data));
stream.on('end', () => {
  console.log(hash.digest('hex'));
});`}
      />
      <GuideCodeBlock
        label="SHA-256 (Python)"
        code={`import hashlib

# Hash string
data = "data to hash"
hash_object = hashlib.sha256(
    data.encode()
)
hex_dig = hash_object.hexdigest()

# Hash file
def hash_file(filename):
    h = hashlib.sha256()
    with open(filename, 'rb') as file:
        for chunk in iter(
            lambda: file.read(4096),
            b""
        ):
            h.update(chunk)
    return h.hexdigest()`}
      />

      <h2 id="testing">Testing and Validation</h2>
      <h3>Online Hash Tools</h3>
      <div className="guide-card-grid">
        <Link href="/hash-generator"><strong>Universal Hash Generator →</strong><span>Generate hashes with multiple algorithms</span></Link>
        <Link href="/sha256-generator"><strong>SHA-256 Generator →</strong><span>Fast SHA-256 hash generation</span></Link>
        <Link href="/bcrypt-generator"><strong>BCrypt Generator →</strong><span>Secure password hashing</span></Link>
        <Link href="/md5-hash"><strong>MD5 Generator →</strong><span>Legacy MD5 checksums</span></Link>
      </div>
      <h3>Command Line Tools</h3>
      <GuideCodeBlock
        label="Linux/macOS"
        code={`# SHA-256
echo -n "text" | sha256sum

# MD5
echo -n "text" | md5sum

# File hashing
sha256sum filename.txt`}
      />
      <GuideCodeBlock
        label="Windows (PowerShell)"
        code={`# SHA-256
Get-FileHash -Algorithm SHA256 file.txt

# MD5
Get-FileHash -Algorithm MD5 file.txt`}
      />
      <GuideCodeBlock
        label="OpenSSL"
        code={`# Various algorithms
openssl dgst -sha256 file.txt
openssl dgst -sha512 file.txt
openssl dgst -md5 file.txt`}
      />

      <section className="guide-related" aria-labelledby="related-tools-title">
        <h2 id="related-tools-title">Ready to Generate Secure Hashes?</h2>
        <p className="mb-4 text-16 leading-7 text-[var(--body)]">
          Use our comprehensive hash generators to create secure hashes for your applications.
          Choose the right algorithm for your specific security and performance needs.
        </p>
        <div className="guide-card-grid">
          <Link href="/hash-generator"><strong>Universal Hash Generator →</strong><span>Multiple algorithms, secure implementation, no data storage.</span></Link>
          <Link href="/sha256-generator"><strong>SHA-256 Generator →</strong><span>Instant results with the most widely used secure hash.</span></Link>
        </div>
      </section>
    </article>
  )
}
