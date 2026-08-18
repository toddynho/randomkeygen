'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  ControlField,
  CheckboxField,
  BulkGenerator,
  Toast,
  useToast,
  useRegenerateHotkey,
} from '../components'
import type { HowToStep } from '../components'
import { TokenType, tokenTypes } from './oauth-utils'
import { OauthPlayground } from './OauthPlayground'
import {
  OauthFlowComparison,
  OauthImplementationExamples,
  OauthSecurityBestPractices,
  OauthTerminalCommands,
  SectionHeading,
} from './sections'

interface OauthTokenPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, any>[]
  howToSteps?: HowToStep[]
  howToHeading?: string
}

export default function OauthTokenPageClient({
  breadcrumbItems,
  schema,
  howToSteps,
  howToHeading,
}: OauthTokenPageClientProps) {
  const [tokenType, setTokenType] = useState<TokenType>('access_token')
  const [customLength, setCustomLength] = useState(32)
  const [format, setFormat] = useState<'base64' | 'hex' | 'alphanumeric'>('base64')
  const [includePrefix, setIncludePrefix] = useState(true)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 4 }, () => ''))
  const [toastMessage, flash] = useToast()

  // Shared with the interactive playground and implementation examples
  const [clientId, setClientId] = useState('client_123456')
  const [redirectUri, setRedirectUri] = useState('https://example.com/callback')
  const [scope, setScope] = useState('read:profile read:email')
  const [state, setState] = useState('')

  const config = tokenTypes[tokenType]
  const length = customLength || config.length

  const generateToken = useCallback(() => {
    let token = ''
    if (format === 'base64') {
      token = generators.base64(length)
    } else if (format === 'hex') {
      token = generators.hex(length)
    } else {
      token = generators.alphanumeric(length)
    }

    return includePrefix ? `${config.prefix}_${token}` : token
  }, [config.prefix, length, format, includePrefix])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 4 }, () => generateToken()))
    // Also generate a new state parameter for the playground
    setState(generators.base64(16))
  }, [generateToken])

  const regenerateValue = useCallback(
    (index: number) => {
      setValues((current) => {
        const next = [...current]
        next[index] = generateToken()
        return next
      })
    },
    [generateToken],
  )

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new tokens')
  }, [generateAll, flash])

  const handleRegenerateAll = useCallback(() => {
    generateAll()
    flash('Regenerated all')
  }, [generateAll, flash])

  // `R` regenerates everything when no field has focus
  useRegenerateHotkey(handleRegenerateAll)

  // Bits from byte length for the byte-based encodings; per-character for alphanumeric
  const bits = format === 'alphanumeric' ? Math.round(length * Math.log2(62)) : length * 8
  const readout =
    format === 'alphanumeric'
      ? { bits, poolSize: 62, poolLabel: `${length} chars · 62-character pool` }
      : {
          bits,
          poolSize: format === 'hex' ? 16 : 64,
          poolLabel: `${length} random bytes · ${format === 'hex' ? 'hex' : 'base64'} encoded`,
        }

  return (
    <GeneratorLayout
      title="OAuth 2.0 Token Generator with Interactive Playground"
      description="Generate production-ready OAuth tokens for access control, refresh flows, and client authentication. Test complete OAuth flows with our interactive playground."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      howToSteps={howToSteps}
      howToHeading={howToHeading}
      storageCallout={
        <aside className="mb-8 flex flex-col gap-4 card p-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="mb-1 text-16 font-semibold">Generated a token? Store it safely.</h2>
            <p className="text-14 leading-5 text-[var(--muted)]">
              Store refresh tokens securely (encrypted, secure storage), implement proper token storage (secure,
              httpOnly cookies), and keep client credentials out of source code. Rotate refresh tokens with each use
              and revoke them on logout or suspicious activity.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-1.5 text-14 font-semibold">
            <Link href="/guides/oauth-security" className="text-[var(--accent)] hover:underline">
              OAuth 2.0 security guide →
            </Link>
          </div>
        </aside>
      }
    >
      {/* Options */}
      <GeneratorControls onGenerate={handleGenerate} generateLabel="Generate tokens" readout={readout}>
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-4">
          <div>
            <ControlField
              label="Token Type"
              htmlFor="oauth-token-type"
              type="select"
              value={tokenType}
              onChange={(value) => setTokenType(value as TokenType)}
              options={[
                { value: 'access_token', label: 'Access Token' },
                { value: 'refresh_token', label: 'Refresh Token' },
                { value: 'client_secret', label: 'Client Secret' },
                { value: 'authorization_code', label: 'Authorization Code' },
              ]}
            />
            <p className="mt-2 text-14 text-[var(--muted)]">
              {config.description} · Recommended expiry: {config.expiryRecommendation}
            </p>
          </div>

          <ControlField label="Length (bytes)" htmlFor="oauth-length">
            <input
              id="oauth-length"
              type="number"
              value={customLength}
              onChange={(e) => setCustomLength(parseInt(e.target.value) || config.length)}
              min="8"
              max="128"
              className="form-input w-full"
            />
          </ControlField>

          <ControlField
            label="Format"
            htmlFor="oauth-format"
            type="select"
            value={format}
            onChange={(value) => setFormat(value as 'base64' | 'hex' | 'alphanumeric')}
            options={[
              { value: 'base64', label: 'Base64' },
              { value: 'alphanumeric', label: 'Alphanumeric' },
              { value: 'hex', label: 'Hexadecimal' },
            ]}
          />

          <div className="flex items-end pb-1">
            <CheckboxField label={`Include prefix (${config.prefix}_)`} checked={includePrefix} onChange={setIncludePrefix} />
          </div>
        </div>
      </GeneratorControls>

      {/* Generated tokens: strength rows, per-row regenerate/copy */}
      <OutputDisplay
        values={values}
        noun="tokens"
        getBits={() => bits}
        onRegenerate={regenerateValue}
        onRegenerateAll={handleRegenerateAll}
      />

      {/* Interactive OAuth Playground */}
      <OauthPlayground
        values={values}
        tokenType={tokenType}
        clientId={clientId}
        setClientId={setClientId}
        redirectUri={redirectUri}
        setRedirectUri={setRedirectUri}
        scope={scope}
        setScope={setScope}
        state={state}
        setState={setState}
      />

      {/* OAuth Flow Comparison */}
      <OauthFlowComparison />

      {/* Implementation Examples */}
      <OauthImplementationExamples
        clientId={clientId}
        redirectUri={redirectUri}
        scope={scope}
        tokenType={tokenType}
        values={values}
      />

      {/* Security Best Practices */}
      <OauthSecurityBestPractices />

      {/* Bulk Generation */}
      <section className="mb-8">
        <SectionHeading title="Bulk Token Generation" />
        <BulkGenerator generateFn={generateToken} label={`${tokenType.replace('_', ' ')}s`} />
      </section>

      {/* Terminal Commands */}
      <OauthTerminalCommands tokenType={tokenType} customLength={customLength} />

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
