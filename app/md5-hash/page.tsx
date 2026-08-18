import type { Metadata } from 'next'
import MD5HashGenerator from '../components/MD5HashGenerator'
import { RelatedContent, developerRelated } from '../components/RelatedContent'
import { GeneratorLayout } from '../components'

export const metadata: Metadata = {
  title: 'MD5 Hash Generator - Text & File MD5 Calculator | RandomKeygen',
  description: 'Generate MD5 hashes for text and files. Fast MD5 calculator with file upload support. Warning: MD5 is deprecated for security use - provided for legacy compatibility only.',
  keywords: [
    'MD5 hash generator',
    'MD5 calculator',
    'file MD5 checksum',
    'MD5 hash online',
    'text to MD5',
    'file integrity check',
    'hash function',
    'checksum generator',
    'MD5 tool',
    'legacy hash'
  ],
  openGraph: {
    title: 'MD5 Hash Generator - Text & File MD5 Calculator',
    description: 'Generate MD5 hashes for text and files. Fast online MD5 calculator with security warnings.',
    url: 'https://randomkeygen.com/md5-hash',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/md5-hash',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Encryption', url: '/encryption' },
  { name: 'MD5 Hash Generator', url: '/md5-hash' }
]

// MD5 Tool Schema
const md5ToolSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MD5 Hash Generator',
  alternateName: ['MD5 Calculator', 'MD5 Checksum Generator'],
  description: 'Generate MD5 hashes for text and files. Fast MD5 calculator with file upload support and security warnings about deprecated cryptographic use.',
  url: 'https://randomkeygen.com/md5-hash',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  featureList: [
    'MD5 hash generation for text input',
    'File MD5 checksum calculation',
    'Drag and drop file support',
    'Multiple output formats (lowercase, uppercase)',
    'Real-time hash computation',
    'File size and type detection',
    'Security warnings about MD5 vulnerabilities',
    'Client-side processing - no file uploads to server'
  ]
}

// FAQ Schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is MD5 still safe to use for security?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, MD5 is cryptographically broken and should not be used for security purposes. It\'s vulnerable to collision attacks where different inputs produce the same hash. Use SHA-256 or higher for security applications. MD5 is only suitable for non-security purposes like file verification and legacy system compatibility.'
      }
    },
    {
      '@type': 'Question',
      name: 'What can I still use MD5 for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MD5 is still suitable for non-security purposes: file integrity verification (like checksums), legacy system compatibility, database sharding keys, caching identifiers, and data deduplication where speed is more important than collision resistance.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I verify a file\'s MD5 checksum?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your file using this tool and compare the generated MD5 hash with the expected checksum provided by the file source. If they match exactly, the file hasn\'t been corrupted during download or transfer.'
      }
    },
    {
      '@type': 'Question',
      name: 'What should I use instead of MD5 for security?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For security applications, use SHA-256 (minimum), SHA-3, or BLAKE2. For password hashing, use bcrypt, scrypt, or Argon2. These modern algorithms are designed to resist current attack methods and provide adequate security.'
      }
    }
  ]
}

export default function MD5HashPage() {
  return (
    <GeneratorLayout
      title="MD5 Hash Generator"
      description="Generate MD5 hashes for text and files. Fast online MD5 calculator with security warnings. Note: MD5 is cryptographically broken - use SHA-256+ for security applications."
      breadcrumbItems={breadcrumbItems}
      schema={[md5ToolSchema, faqSchema]}
    >
      {/* MD5 Generator Component */}
      <MD5HashGenerator />

      {/* Security Warning Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">⚠️ Security Considerations</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-red-800 mb-3">Why MD5 is No Longer Secure</h3>
          <div className="space-y-3 text-sm text-red-700">
            <p>
              <strong>Collision Attacks:</strong> MD5 is vulnerable to collision attacks where different inputs 
              produce identical hashes. This was proven in 2004 and attacks have become increasingly practical.
            </p>
            <p>
              <strong>Birthday Attacks:</strong> Due to the relatively short 128-bit output, a modern GPU
              can find MD5 collisions in seconds to minutes — never use MD5 for passwords or signatures.
            </p>
            <p>
              <strong>Real-world Impact:</strong> Attackers can create malicious files with the same MD5 hash 
              as legitimate files, bypassing integrity checks.
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded border">
            <h4 className="font-medium text-red-800 mb-2">Secure Alternatives</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <strong>SHA-256:</strong> 256-bit output, widely supported, NIST approved
              </div>
              <div>
                <strong>SHA-3:</strong> Latest standard, different construction than SHA-2
              </div>
              <div>
                <strong>BLAKE2:</strong> Fast, secure, designed for high performance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When MD5 is Still Acceptable */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">When MD5 is Still Acceptable</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-green-700">✓ Acceptable Uses</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <h4 className="font-medium text-green-800">File Integrity Verification</h4>
                <p className="text-sm text-green-700">
                  Checking if a file was corrupted during transfer (not security-critical)
                </p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <h4 className="font-medium text-green-800">Legacy System Compatibility</h4>
                <p className="text-sm text-green-700">
                  Interfacing with older systems that require MD5
                </p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <h4 className="font-medium text-green-800">Non-Security Identifiers</h4>
                <p className="text-sm text-green-700">
                  Database sharding, cache keys, or duplicate detection
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-red-700">✗ Never Use MD5 For</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <h4 className="font-medium text-red-800">Password Hashing</h4>
                <p className="text-sm text-red-700">
                  Use bcrypt, scrypt, or Argon2 instead
                </p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <h4 className="font-medium text-red-800">Digital Signatures</h4>
                <p className="text-sm text-red-700">
                  Use SHA-256 or higher with proper signature algorithms
                </p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <h4 className="font-medium text-red-800">Security-Critical Checksums</h4>
                <p className="text-sm text-red-700">
                  Use SHA-256 for tamper detection
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Command Line Examples */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Command Line Examples</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Linux / macOS</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[var(--band)] rounded">
                <div className="text-xs text-[var(--muted)] mb-1">File MD5</div>
                <code className="text-sm font-mono">md5sum filename.txt</code>
              </div>
              <div className="p-3 bg-[var(--band)] rounded">
                <div className="text-xs text-[var(--muted)] mb-1">Text MD5</div>
                <code className="text-sm font-mono">echo -n "Hello World" | md5sum</code>
              </div>
              <div className="p-3 bg-[var(--band)] rounded">
                <div className="text-xs text-[var(--muted)] mb-1">Multiple files</div>
                <code className="text-sm font-mono">md5sum *.txt</code>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Windows</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[var(--band)] rounded">
                <div className="text-xs text-[var(--muted)] mb-1">PowerShell</div>
                <code className="text-sm font-mono">Get-FileHash -Algorithm MD5 file.txt</code>
              </div>
              <div className="p-3 bg-[var(--band)] rounded">
                <div className="text-xs text-[var(--muted)] mb-1">CertUtil</div>
                <code className="text-sm font-mono">certutil -hashfile file.txt MD5</code>
              </div>
              <div className="p-3 bg-[var(--band)] rounded">
                <div className="text-xs text-[var(--muted)] mb-1">Alternative tools</div>
                <code className="text-sm font-mono">md5.exe filename.txt</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programming Examples */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Programming Examples</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">JavaScript/Node.js</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[var(--band)] rounded">
                <div className="text-xs text-[var(--muted)] mb-2">Node.js (crypto module)</div>
                <pre className="text-xs font-mono overflow-x-auto">
{`const crypto = require('crypto');

// Text MD5
const text = 'Hello World';
const hash = crypto
  .createHash('md5')
  .update(text)
  .digest('hex');

console.log(hash); // b10a8db164e0754105b7a99be72e3fe5`}
                </pre>
              </div>
              <div className="p-3 bg-[var(--band)] rounded">
                <div className="text-xs text-[var(--muted)] mb-2">File MD5</div>
                <pre className="text-xs font-mono overflow-x-auto">
{`const fs = require('fs');
const crypto = require('crypto');

const hash = crypto.createHash('md5');
const stream = fs.createReadStream('file.txt');

stream.on('data', data => hash.update(data));
stream.on('end', () => {
  console.log(hash.digest('hex'));
});`}
                </pre>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Python</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[var(--band)] rounded">
                <div className="text-xs text-[var(--muted)] mb-2">Text MD5</div>
                <pre className="text-xs font-mono overflow-x-auto">
{`import hashlib

text = "Hello World"
hash_object = hashlib.md5(text.encode())
md5_hash = hash_object.hexdigest()

print(md5_hash)  # b10a8db164e0754105b7a99be72e3fe5`}
                </pre>
              </div>
              <div className="p-3 bg-[var(--band)] rounded">
                <div className="text-xs text-[var(--muted)] mb-2">File MD5</div>
                <pre className="text-xs font-mono overflow-x-auto">
{`import hashlib

def file_md5(filename):
    hash_md5 = hashlib.md5()
    with open(filename, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

print(file_md5("file.txt"))`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Comparison */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Algorithm Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-[var(--border)] rounded-lg text-sm">
            <thead>
              <tr className="bg-[var(--band)]">
                <th className="text-left p-3 border-b border-[var(--border)]">Algorithm</th>
                <th className="text-left p-3 border-b border-[var(--border)]">Output Size</th>
                <th className="text-left p-3 border-b border-[var(--border)]">Speed</th>
                <th className="text-left p-3 border-b border-[var(--border)]">Security</th>
                <th className="text-left p-3 border-b border-[var(--border)]">Recommended Use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-[var(--border)] font-mono">MD5</td>
                <td className="p-3 border-b border-[var(--border)]">128 bits</td>
                <td className="p-3 border-b border-[var(--border)] text-green-600">Very Fast</td>
                <td className="p-3 border-b border-[var(--border)] text-red-600">Broken</td>
                <td className="p-3 border-b border-[var(--border)]">Legacy only</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-[var(--border)] font-mono">SHA-1</td>
                <td className="p-3 border-b border-[var(--border)]">160 bits</td>
                <td className="p-3 border-b border-[var(--border)] text-green-600">Fast</td>
                <td className="p-3 border-b border-[var(--border)] text-orange-600">Deprecated</td>
                <td className="p-3 border-b border-[var(--border)]">Legacy only</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-[var(--border)] font-mono">SHA-256</td>
                <td className="p-3 border-b border-[var(--border)]">256 bits</td>
                <td className="p-3 border-b border-[var(--border)] text-yellow-600">Moderate</td>
                <td className="p-3 border-b border-[var(--border)] text-green-600">Secure</td>
                <td className="p-3 border-b border-[var(--border)]">Current standard</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-[var(--border)] font-mono">SHA-3</td>
                <td className="p-3 border-b border-[var(--border)]">224-512 bits</td>
                <td className="p-3 border-b border-[var(--border)] text-yellow-600">Moderate</td>
                <td className="p-3 border-b border-[var(--border)] text-green-600">Secure</td>
                <td className="p-3 border-b border-[var(--border)]">Latest standard</td>
              </tr>
              <tr>
                <td className="p-3 font-mono">BLAKE2</td>
                <td className="p-3">256-512 bits</td>
                <td className="p-3 text-green-600">Fast</td>
                <td className="p-3 text-green-600">Secure</td>
                <td className="p-3">High performance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border border-[var(--border)] rounded-lg">
            <summary className="flex justify-between items-center p-4 cursor-pointer">
              <span className="font-medium">Can I still use MD5 to verify downloaded files?</span>
              <span className="text-[var(--accent)] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-sm text-[var(--muted)]">
              <p className="mb-2">
                Yes, but with caveats. MD5 can still detect accidental corruption during file transfer, 
                but it cannot protect against malicious tampering. If an attacker can modify the file, 
                they can also create a malicious file with the same MD5 hash.
              </p>
              <p>
                For security-critical file verification, use SHA-256 checksums or cryptographic signatures instead.
              </p>
            </div>
          </details>

          <details className="group border border-[var(--border)] rounded-lg">
            <summary className="flex justify-between items-center p-4 cursor-pointer">
              <span className="font-medium">How fast is MD5 compared to SHA-256?</span>
              <span className="text-[var(--accent)] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-sm text-[var(--muted)]">
              <p className="mb-2">
                MD5 is approximately 2-3x faster than SHA-256 on most modern hardware. However, 
                the performance difference is rarely significant enough to justify using MD5 
                in new applications.
              </p>
              <p>
                Modern CPUs often have hardware acceleration for SHA-256, reducing the performance gap. 
                For non-security applications requiring speed, consider BLAKE2, which is both fast and secure.
              </p>
            </div>
          </details>

          <details className="group border border-[var(--border)] rounded-lg">
            <summary className="flex justify-between items-center p-4 cursor-pointer">
              <span className="font-medium">What's the difference between MD5 and CRC32?</span>
              <span className="text-[var(--accent)] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-sm text-[var(--muted)]">
              <p className="mb-2">
                <strong>MD5</strong> produces a 128-bit hash designed to be cryptographically secure 
                (though now broken). It's good for detecting both accidental and some intentional changes.
              </p>
              <p>
                <strong>CRC32</strong> produces a 32-bit checksum designed only for error detection, 
                not security. It's faster but easily manipulated and not suitable for integrity verification.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Related Content */}
      <RelatedContent {...developerRelated} />
    </GeneratorLayout>
  )
}
