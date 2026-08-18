'use client'

import { ReactNode, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  calculateEntropy,
  generateString,
  LOWERCASE,
  UPPERCASE,
  DIGITS,
  SYMBOLS_SAFE,
} from '@/app/lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  CheckboxField,
  RangeField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  PasswordManagerNextStep,
} from '@/app/components'
import type { HowToStep } from '@/app/components'

type CharsetOption = 'lowercase' | 'uppercase' | 'numbers' | 'symbols'

const CHARSET_META: Record<CharsetOption, { label: string; chars: string }> = {
  lowercase: { label: 'Lowercase (a-z)', chars: LOWERCASE },
  uppercase: { label: 'Uppercase (A-Z)', chars: UPPERCASE },
  numbers: { label: 'Numbers (0-9)', chars: DIGITS },
  symbols: { label: 'Symbols (!@#$%^&*)', chars: SYMBOLS_SAFE },
}

const DEFAULT_CHARSET_OPTIONS: CharsetOption[] = ['lowercase', 'uppercase', 'numbers', 'symbols']

const RESULT_COUNT = 6

interface PasswordLengthClientProps {
  title: string
  description: string
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, unknown>[]
  /** Fixed password length (the /password/N-character pages). Takes precedence over lengthRange. */
  fixedLength?: number
  /** Adjustable length slider (charset-restricted pages). */
  lengthRange?: { min: number; max: number; initial: number }
  /** Quick-select length buttons (e.g. common PIN lengths on numbers-only). */
  quickLengths?: number[]
  /** Character-type toggles to offer. Ignored when lockedCharset is set. Defaults to all four. */
  charsetOptions?: CharsetOption[]
  /** Fully locked character pool (e.g. numbers-only), hides all charset toggles. */
  lockedCharset?: { chars: string; poolLabel: string }
  /** Show the "Exclude ambiguous (0O1lI)" toggle. */
  showExcludeAmbiguous?: boolean
  /** Plural noun for the results card, e.g. "passwords" or "codes". */
  noun?: string
  csvFilename?: string
  howToSteps?: HowToStep[]
  howToHeading?: string
  storageCallout?: ReactNode
  /** Page-specific explainer/SEO sections, rendered below the generator. */
  children?: ReactNode
}

export default function PasswordLengthClient({
  title,
  description,
  breadcrumbItems,
  schema,
  fixedLength,
  lengthRange,
  quickLengths,
  charsetOptions = DEFAULT_CHARSET_OPTIONS,
  lockedCharset,
  showExcludeAmbiguous = false,
  noun = 'passwords',
  csvFilename,
  howToSteps,
  howToHeading,
  storageCallout,
  children,
}: PasswordLengthClientProps) {
  const [length, setLength] = useState(fixedLength ?? lengthRange?.initial ?? 16)
  const [selected, setSelected] = useState<Record<CharsetOption, boolean>>({
    lowercase: charsetOptions.includes('lowercase'),
    uppercase: charsetOptions.includes('uppercase'),
    numbers: charsetOptions.includes('numbers'),
    symbols: charsetOptions.includes('symbols'),
  })
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: RESULT_COUNT }, () => ''))
  const [setError, setSetError] = useState(false)
  const [toastMessage, flash] = useToast()

  const getCharset = useCallback(() => {
    if (lockedCharset) return lockedCharset.chars
    let charset = ''
    for (const option of charsetOptions) {
      if (selected[option]) charset += CHARSET_META[option].chars
    }
    if (excludeAmbiguous) {
      charset = charset.replace(/[0O1lI]/g, '')
    }
    return charset
  }, [lockedCharset, charsetOptions, selected, excludeAmbiguous])

  const generatePassword = useCallback((): string | null => {
    const pool = getCharset()
    if (!pool) return null
    return generateString(length, pool)
  }, [length, getCharset])

  const generateAll = useCallback((): boolean => {
    const newValues: string[] = []
    for (let i = 0; i < RESULT_COUNT; i++) {
      const value = generatePassword()
      if (value === null) {
        setSetError(true)
        return false
      }
      newValues.push(value)
    }
    setValues(newValues)
    setSetError(false)
    return true
  }, [generatePassword])

  const regenerateValue = useCallback((index: number) => {
    const newPassword = generatePassword()
    if (newPassword === null) {
      setSetError(true)
      return
    }
    setSetError(false)
    setValues((current) => {
      const next = [...current]
      next[index] = newPassword
      return next
    })
  }, [generatePassword])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    if (generateAll()) flash(`Generated new ${noun}`)
  }, [generateAll, flash, noun])

  const handleRegenerateAll = useCallback(() => {
    if (generateAll()) flash('Regenerated all')
  }, [generateAll, flash])

  // `R` regenerates everything when no field has focus
  useRegenerateHotkey(handleRegenerateAll)

  const charset = getCharset()
  const entropyBits = charset ? calculateEntropy(length, charset.length) : 0
  const getBits = useCallback(
    (value: string) => (charset ? calculateEntropy(value.length || length, charset.length) : 0),
    [charset, length],
  )

  const toggle = (option: CharsetOption) => (checked: boolean) =>
    setSelected((current) => ({ ...current, [option]: checked }))

  const hasLengthControls = !fixedLength && (lengthRange || quickLengths)

  return (
    <GeneratorLayout
      title={title}
      description={description}
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      howToSteps={howToSteps}
      howToHeading={howToHeading}
      storageCallout={storageCallout ?? <PasswordManagerNextStep />}
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel={`Generate ${noun}`}
        readout={{
          bits: entropyBits,
          poolSize: charset.length,
          poolLabel: lockedCharset?.poolLabel,
        }}
        error={setError ? 'Select at least one character type to generate passwords.' : null}
      >
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          {fixedLength ? (
            <div>
              <label className="form-label">Length</label>
              <p className="text-sm text-[var(--muted)]">
                Fixed at <strong className="text-[var(--foreground)]">{fixedLength} characters</strong>
              </p>
            </div>
          ) : (
            hasLengthControls && (
              <div className="space-y-3">
                {lengthRange && (
                  <RangeField
                    label="Length"
                    value={length}
                    onChange={setLength}
                    min={lengthRange.min}
                    max={lengthRange.max}
                  />
                )}
                {quickLengths && quickLengths.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {quickLengths.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLength(l)}
                        aria-pressed={length === l}
                        className={`min-h-9 rounded-[9px] border px-3 text-14 font-semibold transition-colors ${
                          length === l
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]'
                            : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
          {!lockedCharset && (
            <div className="space-y-2">
              <label className="form-label">Character Types</label>
              <div className="space-y-2">
                {charsetOptions.map((option) => (
                  <CheckboxField
                    key={option}
                    label={CHARSET_META[option].label}
                    checked={selected[option]}
                    onChange={toggle(option)}
                  />
                ))}
                {showExcludeAmbiguous && (
                  <CheckboxField
                    label="Exclude ambiguous (0O1lI)"
                    checked={excludeAmbiguous}
                    onChange={setExcludeAmbiguous}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </GeneratorControls>

      {/* Generated passwords: strength rows, per-row regenerate/copy, bulk CSV footer */}
      <OutputDisplay
        values={values}
        noun={noun}
        getBits={getBits}
        onRegenerate={regenerateValue}
        onRegenerateAll={handleRegenerateAll}
        bulkCsv={{
          generate: () => generatePassword() ?? '',
          filename: csvFilename ?? `${noun}.csv`,
          onExport: (count) => flash(`Exported ${count} ${noun} — handle with care`),
        }}
      />

      {fixedLength !== undefined && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Other Lengths</h2>
          <div className="flex flex-wrap gap-2">
            {[8, 12, 16, 20, 24, 32].filter((l) => l !== fixedLength).map((l) => (
              <Link
                key={l}
                href={l === 16 ? '/password' : `/password/${l}-character`}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {l} characters
              </Link>
            ))}
          </div>
        </section>
      )}

      {fixedLength !== undefined && fixedLength <= 10 && (
        <SecurityNotice type="warning" title="Consider longer passwords">
          <p>
            An {fixedLength}-character password provides {entropyBits} bits of entropy.
            For high-security accounts, consider using at least 16 characters
            or a <Link href="/passphrase" className="text-[var(--accent)] hover:underline">passphrase</Link>.
          </p>
        </SecurityNotice>
      )}

      {children}

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
