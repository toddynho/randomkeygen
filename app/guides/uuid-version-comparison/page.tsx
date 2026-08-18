import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'
import { GuideRows } from '@/app/components/guide/GuideRows'

export const metadata: Metadata = {
  title: 'UUID Version Comparison: v1 vs v4 vs v5 Guide | RandomKeygen',
  description: 'Complete comparison of UUID versions 1, 4, and 5. Learn differences, use cases, security implications, and when to choose each UUID version.',
  keywords: ['UUID versions', 'UUID v1 v4 v5', 'UUID comparison', 'GUID versions', 'UUID types', 'UUID security', 'UUID implementation'],
  openGraph: {
    title: 'UUID Version Comparison: v1 vs v4 vs v5 Guide',
    description: 'Learn the differences between UUID versions and when to use each one.',
    url: 'https://randomkeygen.com/guides/uuid-version-comparison',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/uuid-version-comparison',
  },
}

export default function UuidVersionComparisonPage() {
  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Developer security</p>
        <h1>UUID Version Comparison: v1 vs v4 vs v5</h1>
        <p className="guide-deck">
          A comprehensive comparison of UUID versions 1, 4, and 5, including their differences,
          use cases, security implications, and implementation considerations.
        </p>
      </header>

      <h2 id="overview">UUID Version Overview</h2>
      <p>
        UUID (Universally Unique Identifier) comes in several versions, each with different
        generation methods and use cases. Understanding these differences is crucial for
        choosing the right UUID type for your application.
      </p>

      <h3>UUID v1</h3>
      <GuideRows items={[
        ['Method', 'Timestamp + MAC address'],
        ['Entropy', '74 bits + timestamp'],
        ['Uniqueness', 'Globally unique'],
        ['Privacy', 'Reveals MAC address'],
      ]} />

      <h3>UUID v4</h3>
      <GuideRows items={[
        ['Method', 'Random/pseudo-random'],
        ['Entropy', '122 bits'],
        ['Uniqueness', 'Statistically unique'],
        ['Privacy', 'No identifying information'],
      ]} />

      <h3>UUID v5</h3>
      <GuideRows items={[
        ['Method', 'SHA-1 hash of namespace + name'],
        ['Entropy', 'Deterministic (no randomness)'],
        ['Uniqueness', 'Deterministic uniqueness'],
        ['Privacy', 'May reveal input patterns'],
      ]} />

      <GuideCallout kind="success" label="Most Popular:">
        UUID v4 is the most commonly used version due to its
        simplicity, privacy, and excellent uniqueness properties. It's the default choice
        for most applications.
      </GuideCallout>

      <h2 id="uuid-v1">UUID v1: Timestamp-Based</h2>

      <h3>How UUID v1 Works</h3>
      <p>UUID v1 generates identifiers based on the current timestamp and the MAC address of the generating machine:</p>

      <GuideCodeBlock
        label="UUID v1 structure"
        code={`// UUID v1 structure
xxxxxxxx-xxxx-1xxx-xxxx-xxxxxxxxxxxx

// Breakdown:
// 32-bit: Low field of timestamp
// 16-bit: Middle field of timestamp
// 16-bit: High field of timestamp (version 1)
// 16-bit: Clock sequence and reserved bits
// 48-bit: Node (MAC address)`}
      />

      <h3>UUID v1 Example</h3>
      <GuideCodeBlock
        label="UUID v1 example"
        code={`// Example UUID v1
58a3b6e0-2c5a-11ee-b679-0242ac110002

// Decoded information:
// Timestamp: 2023-08-10 14:30:45.123456 UTC
// Clock sequence: 0x2679
// MAC address: 02:42:ac:11:00:02`}
      />

      <h3>UUID v1 Pros &amp; Cons</h3>
      <GuideCallout kind="success" label="Advantages:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Guaranteed uniqueness across machines</li>
          <li>Sortable by creation time</li>
          <li>Can extract timestamp information</li>
          <li>Very fast generation</li>
          <li>No collision risk (with proper clock sync)</li>
        </ul>
      </GuideCallout>
      <GuideCallout kind="danger" label="Disadvantages:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Reveals MAC address (privacy concern)</li>
          <li>Reveals creation timestamp</li>
          <li>Requires system clock synchronization</li>
          <li>Sequential nature aids database attacks</li>
          <li>Not suitable for security-sensitive applications</li>
        </ul>
      </GuideCallout>

      <h3>When to Use UUID v1</h3>
      <ul>
        <li><strong>Legacy systems:</strong> When compatibility with older systems is required</li>
        <li><strong>Distributed logging:</strong> When you need sortable IDs with timestamp info</li>
        <li><strong>Internal systems:</strong> When MAC address exposure isn't a concern</li>
        <li><strong>High throughput:</strong> When generation speed is critical</li>
      </ul>

      <GuideCallout kind="warning" label="Privacy Warning:">
        UUID v1 reveals your MAC address and creation time.
        This can be a serious privacy and security concern in public-facing applications.
      </GuideCallout>

      <h2 id="uuid-v4">UUID v4: Random-Based</h2>

      <h3>How UUID v4 Works</h3>
      <p>UUID v4 generates identifiers using random or pseudo-random numbers:</p>

      <GuideCodeBlock
        label="UUID v4 structure"
        code={`// UUID v4 structure
xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx

// Breakdown:
// 122 bits: Random data
// 4 bits: Version (always 0100 = 4)
// 2 bits: Variant (always 10)
// Total: 128 bits (122 random + 6 fixed)`}
      />

      <h3>UUID v4 Example</h3>
      <GuideCodeBlock
        label="UUID v4 example"
        code={`// Example UUID v4
f47ac10b-58cc-4372-a567-0e02b2c3d479

// All 'x' positions are random hex digits
// The '4' indicates version 4
// The 'y' is one of 8, 9, a, or b (variant bits)`}
      />

      <h3>UUID v4 Collision Probability</h3>
      <p>Collision probability with 122 bits of randomness:</p>
      <GuideRows compact items={[
        ['1 billion UUIDs', '1 in 5.3 × 10²⁷ chance'],
        ['1 trillion UUIDs', '1 in 5.3 × 10²¹ chance'],
        ['Practical risk', 'Effectively zero for real applications'],
      ]} />

      <h3>UUID v4 Pros &amp; Cons</h3>
      <GuideCallout kind="success" label="Advantages:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>No identifying information revealed</li>
          <li>Excellent privacy properties</li>
          <li>Simple implementation</li>
          <li>No coordination required</li>
          <li>Cryptographically secure randomness</li>
          <li>Statistically unique</li>
        </ul>
      </GuideCallout>
      <GuideCallout kind="danger" label="Disadvantages:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Not sortable by creation time</li>
          <li>Theoretical collision possibility</li>
          <li>Requires good random number source</li>
          <li>No timestamp information available</li>
          <li>Database index performance impact</li>
        </ul>
      </GuideCallout>

      <h3>When to Use UUID v4</h3>
      <ul>
        <li><strong>Web applications:</strong> User accounts, session IDs, API keys</li>
        <li><strong>Public APIs:</strong> Resource identifiers, transaction IDs</li>
        <li><strong>Distributed systems:</strong> Service discovery, message IDs</li>
        <li><strong>Security applications:</strong> When privacy is paramount</li>
        <li><strong>General purpose:</strong> Default choice for most applications</li>
      </ul>

      <h2 id="uuid-v5">UUID v5: Name-Based (SHA-1)</h2>

      <h3>How UUID v5 Works</h3>
      <p>UUID v5 generates identifiers by computing SHA-1 hash of a namespace UUID and a name:</p>

      <GuideCodeBlock
        label="UUID v5 generation"
        code={`// UUID v5 generation process
1. Choose a namespace UUID
2. Concatenate namespace UUID + name
3. Compute SHA-1 hash
4. Format as UUID with version 5 bits

// Structure
xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx

// The hash is deterministic - same input always produces same UUID`}
      />

      <h3>Standard Namespaces</h3>
      <GuideRows items={[
        ['6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'DNS namespace'],
        ['6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'URL namespace'],
        ['6ba7b812-9dad-11d1-80b4-00c04fd430c8', 'OID namespace'],
        ['6ba7b814-9dad-11d1-80b4-00c04fd430c8', 'X.500 namespace'],
      ]} />

      <h3>UUID v5 Examples</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`// Generate UUID v5 for domain name
const uuidv5 = require('uuid/v5');

// DNS namespace
const DNS_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

// Always generates the same UUID for the same input
const uuid1 = uuidv5('example.com', DNS_NAMESPACE);
const uuid2 = uuidv5('example.com', DNS_NAMESPACE);
// uuid1 === uuid2 (always true)

console.log(uuid1); // 9073926b-929f-31c2-abc9-fad77ae3e8eb

// URL namespace
const URL_NAMESPACE = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
const urlUuid = uuidv5('https://example.com/page', URL_NAMESPACE);
console.log(urlUuid); // c6235813-3ba4-3801-ae84-e0a6ebb7d138`}
      />

      <h3>UUID v5 Pros &amp; Cons</h3>
      <GuideCallout kind="success" label="Advantages:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Deterministic - same input = same output</li>
          <li>No random number generation required</li>
          <li>Useful for creating consistent IDs</li>
          <li>Good for mapping external identifiers</li>
          <li>Reproducible across systems</li>
          <li>No storage of previous UUIDs needed</li>
        </ul>
      </GuideCallout>
      <GuideCallout kind="danger" label="Disadvantages:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Uses SHA-1 (cryptographically weak)</li>
          <li>Input can potentially be guessed</li>
          <li>May reveal patterns in input data</li>
          <li>Not suitable for security-critical applications</li>
          <li>Requires namespace planning</li>
          <li>No timestamp information</li>
        </ul>
      </GuideCallout>

      <h3>When to Use UUID v5</h3>
      <ul>
        <li><strong>Content addressing:</strong> Creating consistent IDs for content</li>
        <li><strong>External ID mapping:</strong> Converting external identifiers to UUIDs</li>
        <li><strong>Reproducible builds:</strong> When deterministic IDs are needed</li>
        <li><strong>Distributed caching:</strong> Consistent cache keys across systems</li>
        <li><strong>Testing:</strong> Deterministic UUIDs for test cases</li>
      </ul>

      <GuideCallout kind="warning" label="Security Note:">
        UUID v5 uses SHA-1, which is cryptographically
        compromised. For new applications requiring name-based UUIDs, consider using
        application-specific hashing with stronger algorithms.
      </GuideCallout>

      <h2 id="performance">Performance Comparison</h2>

      <h3>Generation Speed</h3>
      <p>Approximate generation times (per UUID):</p>
      <GuideRows compact items={[
        ['UUID v1', '~0.1 μs (fastest - uses timestamp + MAC)'],
        ['UUID v4', '~0.5 μs (depends on random number generation)'],
        ['UUID v5', '~2.0 μs (SHA-1 computation overhead)'],
      ]} />

      <h3>Database Index Performance</h3>
      <GuideRows compact items={[
        ['UUID v1', 'Good (sequential, time-ordered)'],
        ['UUID v4', 'Poor (random, causes index fragmentation)'],
        ['UUID v5', 'Variable (depends on input distribution)'],
      ]} />

      <h3>Storage Considerations</h3>
      <p>All UUID versions use the same 128-bit storage format, but their impact differs:</p>
      <ul>
        <li><strong>PostgreSQL:</strong> Consider using UUID v1 for primary keys to reduce B-tree fragmentation</li>
        <li><strong>MySQL:</strong> UUID v4 can cause significant page splits with InnoDB</li>
        <li><strong>NoSQL:</strong> UUID v4 randomness is generally less problematic</li>
      </ul>

      <h2 id="security">Security Implications</h2>

      <h3>Information Leakage</h3>
      <GuideRows compact items={[
        ['UUID v1', '❌ Reveals MAC address and timestamp'],
        ['UUID v4', '✅ No information leakage'],
        ['UUID v5', '⚠️ May reveal patterns in input data'],
      ]} />

      <h3>Predictability</h3>
      <GuideRows compact items={[
        ['UUID v1', '❌ Predictable (sequential timestamp)'],
        ['UUID v4', '✅ Cryptographically unpredictable'],
        ['UUID v5', '❌ Deterministic (same input = same output)'],
      ]} />

      <h3>Collision Resistance</h3>
      <GuideRows compact items={[
        ['UUID v1', '✅ Excellent (guaranteed with clock sync)'],
        ['UUID v4', '✅ Excellent (122 bits entropy)'],
        ['UUID v5', '⚠️ Good (depends on SHA-1 strength)'],
      ]} />

      <h2 id="implementation">Implementation Examples</h2>

      <h3>Node.js Implementation</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`const { v1: uuidv1, v4: uuidv4, v5: uuidv5 } = require('uuid');

// UUID v1 - timestamp based
const uuid1 = uuidv1();
console.log(uuid1); // e.g., 58a3b6e0-2c5a-11ee-b679-0242ac110002

// UUID v4 - random
const uuid4 = uuidv4();
console.log(uuid4); // e.g., f47ac10b-58cc-4372-a567-0e02b2c3d479

// UUID v5 - name based
const DNS_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const uuid5 = uuidv5('example.com', DNS_NAMESPACE);
console.log(uuid5); // e.g., 9073926b-929f-31c2-abc9-fad77ae3e8eb

// Custom namespace UUID v5
const CUSTOM_NAMESPACE = uuidv4(); // Generate once, reuse
const customUuid = uuidv5('my-unique-name', CUSTOM_NAMESPACE);`}
      />

      <h3>Python Implementation</h3>
      <GuideCodeBlock
        label="Python"
        code={`import uuid

# UUID v1 - timestamp based
uuid1 = uuid.uuid1()
print(uuid1)  # e.g., 58a3b6e0-2c5a-11ee-b679-0242ac110002

# UUID v4 - random
uuid4 = uuid.uuid4()
print(uuid4)  # e.g., f47ac10b-58cc-4372-a567-0e02b2c3d479

# UUID v5 - name based
uuid5_dns = uuid.uuid5(uuid.NAMESPACE_DNS, 'example.com')
print(uuid5_dns)  # e.g., 9073926b-929f-31c2-abc9-fad77ae3e8eb

uuid5_url = uuid.uuid5(uuid.NAMESPACE_URL, 'https://example.com')
print(uuid5_url)  # e.g., c6235813-3ba4-3801-ae84-e0a6ebb7d138`}
      />

      <h3>Java Implementation</h3>
      <GuideCodeBlock
        label="Java"
        code={`import java.util.UUID;
import java.security.MessageDigest;

// UUID v4 - random (standard library)
UUID uuid4 = UUID.randomUUID();
System.out.println(uuid4); // e.g., f47ac10b-58cc-4372-a567-0e02b2c3d479

// UUID v5 - name based (custom implementation)
public static UUID uuid5(UUID namespace, String name) {
    try {
        MessageDigest md = MessageDigest.getInstance("SHA-1");
        md.update(namespace.toString().getBytes());
        md.update(name.getBytes());
        byte[] hash = md.digest();

        // Set version to 5
        hash[6] &= 0x0f;
        hash[6] |= 0x50;

        // Set variant
        hash[8] &= 0x3f;
        hash[8] |= 0x80;

        return UUID.nameUUIDFromBytes(hash);
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}`}
      />

      <h2 id="best-practices">Best Practices by Use Case</h2>

      <h3>Web Applications</h3>
      <GuideCallout kind="success" label="Recommended: UUID v4">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>User IDs, session tokens, API keys</li>
          <li>Resource identifiers in REST APIs</li>
          <li>Transaction and order IDs</li>
          <li>Any public-facing identifier</li>
        </ul>
      </GuideCallout>

      <h3>Database Primary Keys</h3>
      <GuideCallout kind="warning" label="Consider: UUID v1 (performance) or UUID v4 (privacy)">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>UUID v1 for better index performance</li>
          <li>UUID v4 when privacy is more important</li>
          <li>Consider ULID as alternative (sortable + random)</li>
          <li>Avoid UUID primary keys for high-write tables</li>
        </ul>
      </GuideCallout>

      <h3>Content-Addressable Storage</h3>
      <GuideCallout kind="success" label="Recommended: UUID v5">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>File system content addressing</li>
          <li>Git-like version control systems</li>
          <li>Distributed caching with consistent keys</li>
          <li>Mapping external identifiers to internal UUIDs</li>
        </ul>
      </GuideCallout>

      <h3>Microservices &amp; Logging</h3>
      <GuideCallout kind="warning" label="Mixed: UUID v1 (tracing) + UUID v4 (resources)">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>UUID v1 for request/trace IDs (sortable by time)</li>
          <li>UUID v4 for service instances and resources</li>
          <li>UUID v5 for deterministic service discovery</li>
          <li>Consider correlation ID patterns</li>
        </ul>
      </GuideCallout>

      <h2 id="decision-framework">Decision Framework</h2>

      <h3>Quick Decision Tree</h3>
      <p><strong>Do you need deterministic UUIDs (same input = same output)?</strong></p>
      <ul>
        <li>✅ Yes → Use UUID v5</li>
        <li>❌ No → Continue...</li>
      </ul>
      <p><strong>Do you need time-ordered/sortable UUIDs?</strong></p>
      <ul>
        <li>✅ Yes → Use UUID v1 (accept privacy trade-off)</li>
        <li>❌ No → Continue...</li>
      </ul>
      <p><strong>Is this for a public-facing application?</strong></p>
      <ul>
        <li>✅ Yes → Use UUID v4</li>
        <li>❌ No → UUID v1 or v4 based on performance needs</li>
      </ul>

      <section className="guide-related" aria-labelledby="related-tools-title">
        <h2 id="related-tools-title">Related tools</h2>
        <div className="guide-card-grid">
          <Link href="/uuid"><strong>UUID v4 Generator →</strong><span>Generate random UUID v4 identifiers</span></Link>
          <Link href="/guides/uuid-vs-sequential"><strong>UUID vs Sequential IDs →</strong><span>When to use UUIDs vs auto-incrementing IDs</span></Link>
          <Link href="/random-string"><strong>Random String Generator →</strong><span>Generate custom random identifiers</span></Link>
          <Link href="/hash-generator"><strong>Hash Generator →</strong><span>Generate SHA-1, SHA-256, and other hashes</span></Link>
        </div>
      </section>
    </article>
  )
}
