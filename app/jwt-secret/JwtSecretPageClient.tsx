'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  ControlField,
  BulkGenerator,
  Toast,
  useToast,
  useRegenerateHotkey,
} from '../components'
import type { HowToStep } from '../components'
import { Algorithm, algorithmInfo, decodeJWT, DecodedJwt, DEMO_TOKEN } from './jwt-utils'
import { JwtDecoder } from './JwtDecoder'
import { JwtExpiryCalculator } from './JwtExpiryCalculator'
import { JwtDebugger } from './JwtDebugger'
import { JwtClaimsBuilder } from './JwtClaimsBuilder'
import {
  AlgorithmComparison,
  UsageExamples,
  SecurityBestPractices,
  AdvancedImplementationExamples,
  SecurityAuditChecklist,
  ImplementationExamples,
  JwtTerminalCommands,
  SectionHeading,
} from './sections'

interface JwtSecretPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, any>[]
  howToSteps?: HowToStep[]
  howToHeading?: string
}

export default function JwtSecretPageClient({
  breadcrumbItems,
  schema,
  howToSteps,
  howToHeading,
}: JwtSecretPageClientProps) {
  const [algorithm, setAlgorithm] = useState<Algorithm>('HS256')
  const [format, setFormat] = useState<'base64' | 'hex'>('base64')
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 4 }, () => ''))
  const [toastMessage, flash] = useToast()

  // Shared between the decoder and debugger sub-tools
  const [jwtInput, setJwtInput] = useState('')
  const [decodedJWT, setDecodedJWT] = useState<DecodedJwt | null>(null)

  const info = algorithmInfo[algorithm]
  const isAsymmetric = algorithm === 'RS256' || algorithm === 'ES256'
  const secretBytes = isAsymmetric ? 32 : info.bytes
  const secretBits = secretBytes * 8

  const generateSecret = useCallback(() => {
    // For asymmetric algorithms, generate different content
    if (algorithm === 'RS256' || algorithm === 'ES256') {
      if (format === 'hex') {
        return generators.hex(32) // Standard 32 bytes for demonstration
      }
      // For RS256/ES256, we show a placeholder since these need key pairs
      return `${algorithm}_requires_key_pair_generation_see_examples_below`
    }

    // For HMAC algorithms (HS256, HS384, HS512)
    if (format === 'hex') {
      return generators.hex(algorithmInfo[algorithm].bytes)
    }
    return generators.jwtSecret(algorithm as 'HS256' | 'HS384' | 'HS512')
  }, [algorithm, format])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 4 }, () => generateSecret()))
    // Seed the JWT decoder/debugger demo with a sample token
    setJwtInput(DEMO_TOKEN)
    setDecodedJWT(decodeJWT(DEMO_TOKEN))
  }, [generateSecret])

  const regenerateValue = useCallback(
    (index: number) => {
      setValues((current) => {
        const next = [...current]
        next[index] = generateSecret()
        return next
      })
    },
    [generateSecret],
  )

  const handleJWTDecode = useCallback((token: string) => {
    setJwtInput(token)
    setDecodedJWT(decodeJWT(token))
  }, [])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new JWT secrets')
  }, [generateAll, flash])

  const handleRegenerateAll = useCallback(() => {
    generateAll()
    flash('Regenerated all')
  }, [generateAll, flash])

  // `R` regenerates everything when no field has focus
  useRegenerateHotkey(handleRegenerateAll)

  return (
    <GeneratorLayout
      title="Generate Production-Ready JWT Secrets in One Click"
      description="Create cryptographically secure JWT signing secrets instantly. Get 256-bit, 384-bit, or 512-bit secrets ready for immediate use in your authentication system."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      howToSteps={howToSteps}
      howToHeading={howToHeading}
      storageCallout={
        <aside className="mb-8 flex flex-col gap-4 card p-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="mb-1 text-16 font-semibold">Secret length matters</h2>
            <p className="text-14 leading-5 text-[var(--muted)]">
              For HMAC-based JWT algorithms, the secret should be at least as long as the hash output: HS256 requires at
              least 256 bits (32 bytes), HS384 requires 384 bits (48 bytes), and HS512 requires 512 bits (64 bytes).
              Using a shorter secret weakens the security of your tokens and makes them vulnerable to brute force
              attacks.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-1.5 text-14 font-semibold">
            <Link href="/guides/jwt-security" className="text-[var(--accent)] hover:underline">
              JWT security guide →
            </Link>
          </div>
        </aside>
      }
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate secrets"
        readout={{
          bits: secretBits,
          poolSize: format === 'hex' ? 16 : 64,
          poolLabel: `${secretBytes} random bytes · ${format === 'hex' ? 'hex' : 'base64'} encoded`,
        }}
      >
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <ControlField
              label="Algorithm"
              htmlFor="jwt-algorithm"
              type="select"
              value={algorithm}
              onChange={(value) => setAlgorithm(value as Algorithm)}
              options={[
                { value: 'HS256', label: 'HS256 (256-bit HMAC)' },
                { value: 'HS384', label: 'HS384 (384-bit HMAC)' },
                { value: 'HS512', label: 'HS512 (512-bit HMAC)' },
                { value: 'RS256', label: 'RS256 (RSA-SHA256)' },
                { value: 'ES256', label: 'ES256 (ECDSA-SHA256)' },
              ]}
            />
            <p className="mt-2 text-14 text-[var(--muted)]">
              {info.type} · {info.description}
            </p>
          </div>
          <ControlField
            label="Format"
            htmlFor="jwt-format"
            type="select"
            value={format}
            onChange={(value) => setFormat(value as 'base64' | 'hex')}
            options={[
              { value: 'base64', label: 'Base64' },
              { value: 'hex', label: 'Hexadecimal' },
            ]}
          />
        </div>
      </GeneratorControls>

      {/* Generated secrets: strength rows, per-row regenerate/copy */}
      <OutputDisplay
        values={values}
        noun="secrets"
        getBits={() => secretBits}
        onRegenerate={regenerateValue}
        onRegenerateAll={handleRegenerateAll}
      />

      {/* Sub-tool: Interactive JWT Decoder & Encoder */}
      <JwtDecoder jwtInput={jwtInput} decodedJWT={decodedJWT} onDecode={handleJWTDecode} />

      {/* Sub-tool: JWT Expiration Calculator */}
      <JwtExpiryCalculator />

      {/* Sub-tool: JWT Debugger & Validator */}
      <JwtDebugger jwtInput={jwtInput} decodedJWT={decodedJWT} onDecode={handleJWTDecode} />

      {/* Algorithm Comparison Table */}
      <AlgorithmComparison algorithm={algorithm} />

      {/* Sub-tool: JWT Claims Builder */}
      <JwtClaimsBuilder />

      {/* Usage Examples */}
      <UsageExamples algorithm={algorithm} secret={values[0]} />

      {/* JWT Security Best Practices Guide */}
      <SecurityBestPractices />

      {/* Advanced Implementation Examples */}
      <AdvancedImplementationExamples algorithm={algorithm} />

      {/* Security Audit Checklist */}
      <SecurityAuditChecklist algorithm={algorithm} />

      {/* Bulk Generation */}
      <section className="mb-8">
        <SectionHeading title="Bulk Generation" />
        <BulkGenerator generateFn={generateSecret} label="secrets" />
      </section>

      {/* Framework Implementation Examples */}
      <ImplementationExamples algorithm={algorithm} secret={values[0]} />

      {/* Terminal Commands */}
      <JwtTerminalCommands bytes={secretBytes} bits={secretBits} />

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
