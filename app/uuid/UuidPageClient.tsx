'use client'

import { useState, useEffect, useCallback } from 'react'
import { generators } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  ControlField,
  SecurityNotice,
  TerminalCommand,
  CodeBlock,
  RelatedContent,
} from '../components'

// UUID v4 has 122 random bits (128 minus 6 version/variant bits)
const UUID_V4_BITS = 122

interface UuidPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, any>[]
  relatedContent?: any
}

export default function UuidPageClient({ 
  breadcrumbItems, 
  schema, 
  relatedContent 
}: UuidPageClientProps) {
  const [format, setFormat] = useState<'standard' | 'uppercase' | 'nodash'>('standard')
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 6 }, () => ''))

  const generateUuid = useCallback(() => {
    const uuid = generators.uuid()
    switch (format) {
      case 'uppercase':
        return uuid.toUpperCase()
      case 'nodash':
        return uuid.replace(/-/g, '')
      default:
        return uuid
    }
  }, [format])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 6 }, () => generateUuid()))
  }, [generateUuid])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  return (
    <GeneratorLayout
      title="UUID Generator"
      description="Generate RFC 4122 compliant UUIDs (Universally Unique Identifiers). Version 4 UUIDs are randomly generated and have 122 bits of entropy."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={generateAll}
        generateLabel="Generate UUIDs"
        readout={{
          bits: UUID_V4_BITS,
          poolSize: 16,
          poolLabel: 'UUID v4 · 122 random bits of 128',
        }}
      >
        <ControlField
          label="Format"
          type="select"
          value={format}
          onChange={(value) => setFormat(value as typeof format)}
          options={[
            { value: "standard", label: "Standard (lowercase with dashes)" },
            { value: "uppercase", label: "Uppercase with dashes" },
            { value: "nodash", label: "No dashes" }
          ]}
        />

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-[var(--muted)]">Version:</span>
          <span className="badge badge-entropy">v4</span>
        </div>

        <p className="w-full text-14 leading-[1.6] text-[var(--muted)]">
          Collision odds: you could generate 1 billion UUIDs every second for about 85 years
          before reaching a 50% chance of a single collision.
        </p>
      </GeneratorControls>

      {/* Generated UUIDs: strength rows, per-row regenerate/copy, bulk CSV footer */}
      <OutputDisplay
        values={values}
        noun="UUIDs"
        getBits={() => UUID_V4_BITS}
        onRegenerate={(index) => {
          const newValues = [...values]
          newValues[index] = generateUuid()
          setValues(newValues)
        }}
        onRegenerateAll={generateAll}
        bulkCsv={{
          generate: generateUuid,
          filename: 'uuids.csv',
        }}
      />

        {/* Usage Example */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
          <div className="space-y-4">
            <CodeBlock 
              filename="SQL (Primary Key)"
              language="sql"
              code={`CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL
);

INSERT INTO users (id, email) VALUES 
  ('${values[0] || 'uuid-here'}', 'user@example.com');`}
            />
            <CodeBlock 
              filename="JavaScript"
              language="javascript"
              code={`// Native (Node.js 14.17+ / modern browsers)
const uuid = crypto.randomUUID();

// With uuid package
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();`}
            />
          </div>
        </section>

        {/* Info */}
        <section className="mb-8">
          <SecurityNotice type="info" title="UUID v4 structure">
            <p className="font-mono text-sm mb-2">
              xxxxxxxx-xxxx-<span className="text-[var(--accent)]">4</span>xxx-<span className="text-[var(--accent)]">y</span>xxx-xxxxxxxxxxxx
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>The <code>4</code> indicates version 4 (random)</li>
              <li>The <code>y</code> is one of 8, 9, a, or b (variant 1)</li>
              <li>All other characters are random hex digits</li>
              <li>Total: 32 hex characters = 128 bits (122 random + 6 version/variant)</li>
            </ul>
          </SecurityNotice>
        </section>

        {/* Terminal Commands */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
          <div className="space-y-3">
            <TerminalCommand 
              command="uuidgen"
              description="macOS / Linux"
            />
            <TerminalCommand 
              command="cat /proc/sys/kernel/random/uuid"
              description="Linux (kernel)"
            />
            <TerminalCommand 
              command={`python3 -c "import uuid; print(uuid.uuid4())"`}
              description="Python"
            />
            <TerminalCommand 
              command={`node -e "console.log(require('crypto').randomUUID())"`}
              description="Node.js"
            />
          </div>
        </section>

        {/* Related Content */}
        {relatedContent && <RelatedContent {...relatedContent} />}
    </GeneratorLayout>
  )
}
