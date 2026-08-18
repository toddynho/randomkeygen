import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'
import { GuideRows } from '@/app/components/guide/GuideRows'

export const metadata: Metadata = {
  title: 'UUID vs Sequential IDs: When to Use Each | RandomKeygen',
  description: 'Complete guide to choosing between UUIDs and sequential/auto-increment IDs. Learn performance, security, scalability, and implementation differences.',
  keywords: ['UUID vs auto increment', 'UUID vs sequential ID', 'database ID design', 'UUID performance', 'auto increment vs UUID', 'primary key design'],
  openGraph: {
    title: 'UUID vs Sequential IDs: When to Use Each',
    description: 'Learn when to use UUIDs vs auto-increment IDs for optimal database design and application architecture.',
    url: 'https://randomkeygen.com/guides/uuid-vs-sequential',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/uuid-vs-sequential',
  },
}

export default function UuidVsSequentialPage() {
  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Developer security</p>
        <h1>UUID vs Sequential IDs: When to Use Each</h1>
        <p className="guide-deck">
          A comprehensive comparison of UUIDs versus sequential/auto-increment IDs, covering
          performance, security, scalability, and architectural considerations to help you
          choose the right identifier strategy.
        </p>
      </header>

      <h2 id="the-great-id-debate">The Great ID Debate</h2>
      <p>
        Choosing between UUIDs and sequential IDs is one of the most important architectural
        decisions in application design. Both have compelling advantages and significant
        trade-offs that can impact performance, security, and maintainability.
      </p>

      <h3>Sequential IDs</h3>
      <GuideRows items={[
        ['Format', '1, 2, 3, 4, 5...'],
        ['Size', '4-8 bytes (32/64-bit integers)'],
        ['Generation', 'Database auto-increment'],
        ['Predictability', 'Highly predictable'],
        ['Performance', 'Excellent for indexes'],
      ]} />

      <h3>UUIDs</h3>
      <GuideRows items={[
        ['Format', '550e8400-e29b-41d4-a716-446655440000'],
        ['Size', '16 bytes (128-bit)'],
        ['Generation', 'Application-level random'],
        ['Predictability', 'Cryptographically unpredictable'],
        ['Performance', 'Can impact index performance'],
      ]} />

      <GuideCallout kind="success" label="The bottom line:">
        Sequential IDs optimize for performance and simplicity,
        while UUIDs optimize for security, privacy, and distributed systems. The right choice
        depends on your specific requirements and constraints.
      </GuideCallout>

      <h2 id="performance">Performance Comparison</h2>

      <h3>Database Index Performance</h3>
      <p>This is where the biggest difference lies:</p>

      <GuideCallout kind="success" label="Sequential IDs:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>✅ B-tree indexes stay balanced</li>
          <li>✅ New rows added at the end</li>
          <li>✅ No index page splits</li>
          <li>✅ Better cache locality</li>
          <li>✅ Optimal INSERT performance</li>
        </ul>
      </GuideCallout>
      <GuideCallout kind="danger" label="UUIDs:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>❌ Random insertion points</li>
          <li>❌ Frequent index page splits</li>
          <li>❌ Index fragmentation over time</li>
          <li>❌ Poor cache locality</li>
          <li>❌ Higher write amplification</li>
        </ul>
      </GuideCallout>

      <h3>Storage Impact</h3>
      <p>Storage requirements per record:</p>
      <GuideRows compact items={[
        ['32-bit sequential', '4 bytes'],
        ['64-bit sequential', '8 bytes'],
        ['UUID', '16 bytes (binary) or 36 bytes (text)'],
        ['Impact', '2-4x storage increase for UUID primary keys'],
      ]} />

      <h3>Performance Benchmarks</h3>
      <GuideCodeBlock
        label="SQL benchmark"
        code={`-- PostgreSQL INSERT performance (1M records)
-- Table with sequential ID primary key
Time: 15.3 seconds
Index size: 21 MB
Index depth: 3 levels

-- Table with UUID primary key
Time: 34.7 seconds
Index size: 67 MB
Index depth: 4 levels

-- MySQL InnoDB (similar pattern)
Sequential: 12.1 seconds, 18 MB index
UUID: 41.3 seconds, 89 MB index`}
      />

      <GuideCallout kind="warning" label="Performance tip:">
        If you must use UUIDs as primary keys, consider
        sequential UUID variants like UUID v1 or ULID to reduce index fragmentation while
        maintaining uniqueness.
      </GuideCallout>

      <h2 id="security-privacy">Security &amp; Privacy Considerations</h2>

      <h3>Information Disclosure</h3>
      <GuideCallout kind="danger" label="Sequential ID Vulnerabilities:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>❌ Reveals total record count</li>
          <li>❌ Shows creation order and timing</li>
          <li>❌ Enables enumeration attacks</li>
          <li>❌ Competitor intelligence gathering</li>
          <li>❌ User behavior prediction</li>
        </ul>
      </GuideCallout>
      <GuideCallout kind="success" label="UUID Privacy Benefits:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>✅ No information leakage</li>
          <li>✅ Prevents enumeration attacks</li>
          <li>✅ Hides business metrics</li>
          <li>✅ Unpredictable sequences</li>
          <li>✅ Better for public APIs</li>
        </ul>
      </GuideCallout>

      <h3>Real-World Security Examples</h3>
      <GuideCodeBlock
        label="HTTP"
        code={`// Sequential ID vulnerability
GET /api/users/12345
GET /api/users/12346  // Easy to guess next user
GET /api/users/12347

// Reveals:
// - Total user count (at least 12,347)
// - Registration patterns
// - Business growth metrics

// UUID protection
GET /api/users/550e8400-e29b-41d4-a716-446655440000
GET /api/users/????-????-????-????-????????????  // Cannot guess

// Reveals: Nothing useful to attackers`}
      />

      <h3>Enumeration Attack Scenarios</h3>
      <ul>
        <li><strong>E-commerce:</strong> Competitors scraping product catalogs via sequential IDs</li>
        <li><strong>Social platforms:</strong> Harvesting user profiles by ID iteration</li>
        <li><strong>SaaS applications:</strong> Discovering customer count and growth rates</li>
        <li><strong>Financial systems:</strong> Predicting transaction volumes and timing</li>
      </ul>

      <h2 id="scalability">Scalability &amp; Distribution</h2>

      <h3>Multi-Database Challenges</h3>
      <p>Sequential ID problems in distributed systems:</p>
      <GuideRows compact items={[
        ['ID conflicts', 'Multiple databases generating same IDs'],
        ['Coordination overhead', 'Need centralized ID generation'],
        ['Merge complexity', 'Resolving conflicts during data migration'],
        ['Replication issues', 'Master-slave setup complications'],
      ]} />

      <h3>UUID Advantages in Distributed Systems</h3>
      <ul>
        <li><strong>No coordination required:</strong> Each instance generates unique IDs independently</li>
        <li><strong>Offline-friendly:</strong> Generate IDs without database connection</li>
        <li><strong>Merger-friendly:</strong> No conflicts when combining databases</li>
        <li><strong>Microservices-ready:</strong> Services can own their ID generation</li>
      </ul>

      <h3>Distributed ID Generation Patterns</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`// Sequential ID - requires coordination
class SequentialIDGenerator {
  constructor(nodeId, nodes) {
    this.nodeId = nodeId;
    this.nodes = nodes;
    this.offset = nodeId;
  }

  nextId() {
    // Each node uses different starting offset
    this.offset += this.nodes;
    return this.offset;
  }
}

// Node 1: 1, 4, 7, 10, 13...
// Node 2: 2, 5, 8, 11, 14...
// Node 3: 3, 6, 9, 12, 15...

// UUID - no coordination needed
class UUIDGenerator {
  nextId() {
    return crypto.randomUUID(); // Always unique
  }
}

// Node 1: f47ac10b-58cc-4372-a567-0e02b2c3d479
// Node 2: 6ba7b810-9dad-11d1-80b4-00c04fd430c8
// Node 3: 5f8a7cb2-4923-4567-8901-234567890abc`}
      />

      <h2 id="database-specific">Database-Specific Considerations</h2>

      <h3>PostgreSQL</h3>
      <GuideRows compact items={[
        ['Sequential', 'Use SERIAL or IDENTITY columns'],
        ['UUID', 'Built-in UUID type, use uuid-ossp extension'],
        ['Hybrid', 'UUID column + sequential primary key for performance'],
      ]} />

      <GuideCodeBlock
        label="PostgreSQL"
        code={`-- PostgreSQL UUID setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Performance optimization: separate UUID for external use
CREATE TABLE users_optimized (
  id BIGSERIAL PRIMARY KEY,           -- Fast sequential internal ID
  external_id UUID DEFAULT uuid_generate_v4(),  -- Public UUID
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(external_id)
);`}
      />

      <h3>MySQL</h3>
      <GuideRows compact items={[
        ['Sequential', 'AUTO_INCREMENT with InnoDB'],
        ['UUID', 'CHAR(36) or BINARY(16) storage'],
        ['Performance', 'Consider ordered UUIDs (UUID v1) for better clustering'],
      ]} />

      <GuideCodeBlock
        label="MySQL"
        code={`-- MySQL UUID implementation
CREATE TABLE users (
  id BINARY(16) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert with UUID
INSERT INTO users (id, email)
VALUES (UNHEX(REPLACE(UUID(), '-', '')), 'user@example.com');

-- Query with UUID
SELECT HEX(id) as uuid, email
FROM users
WHERE id = UNHEX(REPLACE('f47ac10b-58cc-4372-a567-0e02b2c3d479', '-', ''));`}
      />

      <h3>MongoDB</h3>
      <GuideRows compact items={[
        ['Default', 'ObjectId (hybrid timestamp + random)'],
        ['Sequential', 'Not recommended for distributed deployments'],
        ['UUID', 'Good alternative to ObjectId for specific use cases'],
      ]} />

      <h2 id="application-impact">Application Development Impact</h2>

      <h3>URL Design</h3>
      <GuideCodeBlock
        label="Sequential IDs"
        code={`/users/12345
/orders/98765
/products/54321

# Short, clean URLs`}
      />
      <GuideCodeBlock
        label="UUIDs"
        code={`/users/f47ac10b-58cc-4372-a567-0e02b2c3d479
/orders/6ba7b810-9dad-11d1-80b4-00c04fd430c8
/products/550e8400-e29b-41d4-a716-446655440000

# Long but secure URLs`}
      />

      <h3>API Response Size</h3>
      <GuideCodeBlock
        label="JSON"
        code={`// Sequential ID response
{
  "users": [
    {"id": 12345, "name": "John"},
    {"id": 12346, "name": "Jane"},
    {"id": 12347, "name": "Bob"}
  ]
}
// Size: ~85 bytes

// UUID response
{
  "users": [
    {"id": "f47ac10b-58cc-4372-a567-0e02b2c3d479", "name": "John"},
    {"id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8", "name": "Jane"},
    {"id": "550e8400-e29b-41d4-a716-446655440000", "name": "Bob"}
  ]
}
// Size: ~205 bytes`}
      />

      <h3>Frontend Development</h3>
      <ul>
        <li><strong>Type safety:</strong> Sequential IDs use simple number types</li>
        <li><strong>Form validation:</strong> UUIDs require regex validation</li>
        <li><strong>URL routing:</strong> UUID patterns are more complex</li>
        <li><strong>Debugging:</strong> Sequential IDs easier to remember and test</li>
      </ul>

      <h2 id="hybrid">Hybrid Approaches</h2>

      <h3>Dual ID Strategy</h3>
      <p>Use both sequential and UUID IDs for different purposes:</p>

      <GuideCodeBlock
        label="PostgreSQL"
        code={`CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,                    -- Internal fast lookups
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE, -- External API access
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Internal queries use sequential ID
SELECT * FROM users WHERE id = 12345;

-- External API uses UUID
SELECT * FROM users WHERE uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';`}
      />

      <h3>Sequential UUIDs (ULID)</h3>
      <p>Combine the benefits of both approaches using ULID (Universally Unique Lexicographically Sortable Identifier):</p>

      <GuideCodeBlock
        label="Node.js"
        code={`// ULID format: 26 characters, sortable
// 01ARZ3NDEKTSV4RRFFQ69G5FAV
//  ^^^^^^^^^^  ^^^^^^^^^^^^^^^^
//  Timestamp    Random entropy

const { ulid } = require('ulid');

// Generate sortable UUIDs
const id1 = ulid(); // 01ARZ3NDEKTSV4RRFFQ69G5FAV
const id2 = ulid(); // 01ARZ3NDEKTSV4RRFFQ69G5FB0

// Naturally sorted by creation time
console.log(id1 < id2); // true`}
      />

      <h3>Short UUIDs</h3>
      <p>Use shortened versions of UUIDs for better URLs while maintaining uniqueness:</p>

      <GuideCodeBlock
        label="Node.js"
        code={`const shortUUID = require('short-uuid');

// Generate short UUID (22 characters vs 36)
const short = shortUUID.generate();
console.log(short); // "mhvXdrZT4jP5T8vBxuvm75"

// Still unique, but more URL-friendly
const longUUID = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
const shortForm = shortUUID.fromUUID(longUUID);
console.log(shortForm); // "9jqo4qWg6dSA7R1JCkz5z6"`}
      />

      <h2 id="migration">Migration Strategies</h2>

      <h3>Sequential to UUID Migration</h3>
      <GuideCodeBlock
        label="SQL"
        code={`-- Step 1: Add UUID column
ALTER TABLE users ADD COLUMN uuid UUID DEFAULT uuid_generate_v4();

-- Step 2: Populate UUIDs for existing records
UPDATE users SET uuid = uuid_generate_v4() WHERE uuid IS NULL;

-- Step 3: Make UUID NOT NULL and add constraint
ALTER TABLE users ALTER COLUMN uuid SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_uuid_unique UNIQUE (uuid);

-- Step 4: Update application to use UUIDs for new records
-- Step 5: Gradually migrate foreign keys
-- Step 6: Eventually drop sequential ID (optional)`}
      />

      <h3>UUID to Sequential Migration</h3>
      <GuideCodeBlock
        label="SQL"
        code={`-- Step 1: Add sequential ID column
ALTER TABLE users ADD COLUMN new_id BIGSERIAL;

-- Step 2: Create mapping table for references
CREATE TABLE id_mapping (
  old_uuid UUID PRIMARY KEY,
  new_id BIGINT NOT NULL
);

INSERT INTO id_mapping (old_uuid, new_id)
SELECT uuid, new_id FROM users;

-- Step 3: Update foreign key tables
UPDATE orders SET user_id = (
  SELECT new_id FROM id_mapping WHERE old_uuid = orders.user_uuid
);

-- Step 4: Switch primary key and clean up`}
      />

      <h2 id="decision-framework">Decision Framework</h2>

      <h3>Use Sequential IDs When</h3>
      <GuideCallout kind="success" label="Sequential IDs fit when:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>✅ Performance is the top priority</li>
          <li>✅ Single database deployment</li>
          <li>✅ Internal-only systems</li>
          <li>✅ High write volume applications</li>
          <li>✅ Storage costs are significant</li>
          <li>✅ Simple debugging is important</li>
          <li>✅ Database supports efficient auto-increment</li>
        </ul>
      </GuideCallout>

      <h3>Use UUIDs When</h3>
      <GuideCallout kind="success" label="UUIDs fit when:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>✅ Security and privacy are critical</li>
          <li>✅ Multi-database or distributed architecture</li>
          <li>✅ Public-facing APIs</li>
          <li>✅ Offline-capable applications</li>
          <li>✅ Microservices architecture</li>
          <li>✅ Data synchronization between systems</li>
          <li>✅ Preventing enumeration attacks</li>
        </ul>
      </GuideCallout>

      <h3>Consider Hybrid Approaches When</h3>
      <GuideCallout kind="warning" label="Hybrid approaches fit when:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>⚡ You need both performance AND security</li>
          <li>⚡ Internal and external access patterns differ</li>
          <li>⚡ Migration complexity is acceptable</li>
          <li>⚡ Database size is growing rapidly</li>
        </ul>
      </GuideCallout>

      <h3>Quick Decision Tree</h3>
      <p><strong>Is this a public-facing API or web application?</strong></p>
      <ul>
        <li>✅ Yes → Use UUIDs</li>
        <li>❌ No → Continue...</li>
      </ul>
      <p><strong>Do you have multiple databases or plan to scale horizontally?</strong></p>
      <ul>
        <li>✅ Yes → Use UUIDs</li>
        <li>❌ No → Continue...</li>
      </ul>
      <p><strong>Is database write performance critical (&gt;10K writes/sec)?</strong></p>
      <ul>
        <li>✅ Yes → Use Sequential IDs (or consider hybrid)</li>
        <li>❌ No → UUIDs are probably fine</li>
      </ul>

      <h2 id="best-practices">Best Practices Summary</h2>

      <h3>For Sequential IDs</h3>
      <ul>
        <li>Use 64-bit integers for future-proofing</li>
        <li>Never expose sequential IDs in public APIs</li>
        <li>Consider adding UUIDs later for external access</li>
        <li>Implement proper authorization to prevent enumeration</li>
        <li>Monitor for ID exhaustion in high-volume systems</li>
      </ul>

      <h3>For UUIDs</h3>
      <ul>
        <li>Use UUID v4 for most applications</li>
        <li>Store as binary (16 bytes) not text (36 bytes)</li>
        <li>Consider UUID v1 or ULID for better database performance</li>
        <li>Index UUID columns properly</li>
        <li>Validate UUID format in application code</li>
        <li>Use appropriate database UUID types when available</li>
      </ul>

      <h3>General Guidelines</h3>
      <ul>
        <li>Profile your specific use case - theoretical performance isn't always reality</li>
        <li>Consider the total cost: development time, maintenance, security</li>
        <li>Plan for growth - what works for 1K records may not work for 1B</li>
        <li>Document your choice and rationale for future developers</li>
        <li>Be consistent within your application architecture</li>
      </ul>

      <section className="guide-related" aria-labelledby="related-tools-title">
        <h2 id="related-tools-title">Related tools</h2>
        <div className="guide-card-grid">
          <Link href="/uuid"><strong>UUID Generator →</strong><span>Generate random UUID v4 identifiers</span></Link>
          <Link href="/guides/uuid-version-comparison"><strong>UUID Version Comparison →</strong><span>Compare UUID v1, v4, and v5 versions</span></Link>
          <Link href="/random-string"><strong>Random String Generator →</strong><span>Generate custom identifiers and tokens</span></Link>
          <Link href="/api-key"><strong>API Key Generator →</strong><span>Generate secure API keys for authentication</span></Link>
        </div>
      </section>
    </article>
  )
}
