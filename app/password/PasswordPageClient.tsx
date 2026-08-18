'use client'

import { useState, useEffect, useCallback } from 'react'
import { generators, EFF_WORDLIST, LOWERCASE, UPPERCASE, DIGITS, SYMBOLS_SAFE } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  ControlField,
  CheckboxField,
  RangeField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  TerminalCommand,
  RelatedContent,
  PasswordManagerNextStep,
} from '../components'
import { passwordRelated } from '../components/RelatedContent'

interface PasswordPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, any>[]
}

type GeneratorMode = 'random' | 'passphrase' | 'pronounceable' | 'memorable'

const HOW_TO_STEPS = [
  {
    title: 'Choose a mode',
    body: "Random for maximum strength, passphrase or memorable when you'll need to type it from memory.",
  },
  {
    title: 'Configure length and characters',
    body: 'Longer is stronger. 16 characters with mixed types covers most accounts; use the entropy readout as your guide.',
  },
  {
    title: 'Copy and store securely',
    body: 'Copy the result into a password manager. Never reuse it across accounts.',
  },
]

export default function PasswordPageClient({
  breadcrumbItems,
  schema
}: PasswordPageClientProps) {
  // Mode and basic settings
  const [mode, setMode] = useState<GeneratorMode>('random')
  const [length, setLength] = useState(16)
  const [wordCount, setWordCount] = useState(4)
  const [separator, setSeparator] = useState('-')

  // Character type settings
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)

  const [values, setValues] = useState<string[]>(() => Array.from({ length: 6 }, () => ''))
  const [setError, setSetError] = useState(false)
  const [toastMessage, flash] = useToast()

  const getCharset = useCallback(() => {
    let charset = ''
    if (includeLowercase) charset += LOWERCASE
    if (includeUppercase) charset += UPPERCASE
    if (includeNumbers) charset += DIGITS
    if (includeSymbols) charset += SYMBOLS_SAFE

    if (excludeAmbiguous) {
      charset = charset.replace(/[0O1lI]/g, '')
    }

    return charset
  }, [includeLowercase, includeUppercase, includeNumbers, includeSymbols, excludeAmbiguous])

  const charset = getCharset()

  // Per-value entropy estimate in bits (mode-aware; uses the value's own length when available)
  const estimateBits = useCallback((value?: string): number => {
    switch (mode) {
      case 'passphrase':
        return Math.round(wordCount * Math.log2(EFF_WORDLIST.length))
      case 'pronounceable':
        return Math.round((value?.length || length) * Math.log2(11.5))
      case 'memorable':
        return Math.round(Math.min(length, 16) * Math.log2(11.5) + 4 * Math.log2(10))
      case 'random':
      default: {
        const pool = getCharset()
        return pool ? Math.round((value?.length || length) * Math.log2(pool.length)) : 0
      }
    }
  }, [mode, wordCount, length, getCharset])

  const generatePassword = useCallback((): string | null => {
    switch (mode) {
      case 'passphrase':
        return generators.passphrase(wordCount, separator)
      case 'pronounceable':
        return generators.pronounceable(length, includeNumbers, includeUppercase)
      case 'memorable':
        return generators.pronounceable(Math.min(length, 16), true, true) + generators.randomString(4, DIGITS)
      case 'random':
      default: {
        const pool = getCharset()
        if (!pool) return null
        return generators.randomString(length, pool)
      }
    }
  }, [mode, length, wordCount, separator, includeNumbers, includeUppercase, getCharset])

  const generateAll = useCallback((): boolean => {
    const newValues: string[] = []
    for (let i = 0; i < 6; i++) {
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
    if (generateAll()) flash('Generated new passwords')
  }, [generateAll, flash])

  const handleRegenerateAll = useCallback(() => {
    if (generateAll()) flash('Regenerated all')
  }, [generateAll, flash])

  // `R` regenerates everything when no field has focus
  useRegenerateHotkey(handleRegenerateAll)

  const entropyBits = estimateBits()
  const readout = mode === 'passphrase'
    ? { bits: entropyBits, poolSize: EFF_WORDLIST.length, poolLabel: `${EFF_WORDLIST.length}-word pool` }
    : mode === 'random'
      ? { bits: entropyBits, poolSize: charset.length }
      : { bits: entropyBits, poolSize: charset.length, poolLabel: 'pronounceable pattern' }

  return (
    <GeneratorLayout
      title="Secure Password Generator"
      description="Generate cryptographically secure random passwords with customizable length, character sets, and memorable alternatives. Every password is created locally in your browser and is never transmitted."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      howToSteps={HOW_TO_STEPS}
      howToHeading="How to use this password generator"
      storageCallout={<PasswordManagerNextStep />}
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate passwords"
        readout={readout}
        error={setError ? 'Select at least one character type to generate passwords.' : null}
      >
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          <div>
            <label className="form-label">Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'random', label: 'Random' },
                { value: 'passphrase', label: 'Passphrase' },
                { value: 'pronounceable', label: 'Pronounceable' },
                { value: 'memorable', label: 'Memorable' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setMode(value as GeneratorMode)}
                  aria-pressed={mode === value}
                  className={`min-h-11 rounded-[10px] border px-3 text-14 font-semibold transition-colors ${
                    mode === value
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]'
                      : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {mode === 'passphrase' ? (
            <>
              <RangeField label="Number of Words" value={wordCount} onChange={setWordCount} min={3} max={8} />
              <ControlField
                label="Separator"
                type="select"
                value={separator}
                onChange={(value) => setSeparator(value as string)}
                options={[
                  { value: "-", label: "Hyphen (-)" },
                  { value: " ", label: "Space ( )" },
                  { value: ".", label: "Period (.)" },
                  { value: "_", label: "Underscore (_)" },
                  { value: "", label: "None" }
                ]}
              />
            </>
          ) : (
            <>
              <RangeField label="Length" value={length} onChange={setLength} min={mode === 'pronounceable' ? 8 : 6} max={mode === 'pronounceable' ? 20 : 128} />
              {mode === 'random' && (
                <div className="space-y-2">
                  <label className="form-label">Character Types</label>
                  <div className="space-y-2">
                    <CheckboxField
                      label="Lowercase (a-z)"
                      checked={includeLowercase}
                      onChange={setIncludeLowercase}
                    />
                    <CheckboxField
                      label="Uppercase (A-Z)"
                      checked={includeUppercase}
                      onChange={setIncludeUppercase}
                    />
                    <CheckboxField
                      label="Numbers (0-9)"
                      checked={includeNumbers}
                      onChange={setIncludeNumbers}
                    />
                    <CheckboxField
                      label="Symbols (!@#$%^&*)"
                      checked={includeSymbols}
                      onChange={setIncludeSymbols}
                    />
                    <CheckboxField
                      label="Exclude ambiguous (0O1lI)"
                      checked={excludeAmbiguous}
                      onChange={setExcludeAmbiguous}
                    />
                  </div>
                </div>
              )}
              {(mode === 'pronounceable' || mode === 'memorable') && (
                <div className="space-y-2">
                  <CheckboxField
                    label="Include Numbers"
                    checked={includeNumbers}
                    onChange={setIncludeNumbers}
                  />
                  <CheckboxField
                    label="Capitalize Letters"
                    checked={includeUppercase}
                    onChange={setIncludeUppercase}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </GeneratorControls>

      {/* Generated passwords: strength rows, per-row regenerate/copy, bulk CSV footer */}
      <OutputDisplay
        values={values}
        noun="passwords"
        getBits={(value) => estimateBits(value)}
        onRegenerate={regenerateValue}
        onRegenerateAll={handleRegenerateAll}
        bulkCsv={{
          generate: () => generatePassword() ?? '',
          filename: 'passwords.csv',
          onExport: (count) => flash(`Exported ${count} passwords — handle with care`),
        }}
      />

      {/* Strength Guide */}
      <section className="mb-8">
        <SecurityNotice type="info" title="Password strength guide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Entropy Levels:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>50-69 bits:</strong> Minimum for online accounts</li>
                <li><strong>70-99 bits:</strong> Good for most accounts</li>
                <li><strong>100-127 bits:</strong> Strong protection</li>
                <li><strong>128+ bits:</strong> Excellent for critical accounts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Mode Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Passphrase:</strong> Easy to remember, very secure</li>
                <li><strong>Random:</strong> Maximum entropy per character</li>
                <li><strong>Pronounceable:</strong> Balance of usability and security</li>
                <li><strong>Memorable:</strong> Pattern-based, moderate security</li>
              </ul>
            </div>
          </div>
        </SecurityNotice>
      </section>

      {/* Password Manager Integration Guides */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Password Manager Integration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: '1Password',
              command: '# 1Password CLI\nop item create --category=login --title="My Account" --vault="Private" login.username=user login.password="$(node -e \'console.log(require("crypto").randomBytes(16).toString("hex"))\')"',
              description: 'Generate and store passwords directly in 1Password'
            },
            {
              name: 'Bitwarden',
              command: '# Bitwarden CLI\nbw generate --length 20 --uppercase --lowercase --number --special\nbw create item \'{"type":1,"name":"My Account","login":{"username":"user","password":"generated_password"}}\'',
              description: 'Create secure entries with Bitwarden CLI'
            },
            {
              name: 'KeePass',
              command: '# For import into KeePass\necho "Group,Title,Username,Password,URL" > passwords.csv\necho "Internet,My Account,user,$(openssl rand -base64 20 | tr -dc \'a-zA-Z0-9!@#$%^&*\' | head -c16),https://example.com" >> passwords.csv',
              description: 'Generate CSV format for KeePass import'
            }
          ].map((manager, index) => (
            <div key={index} className="card p-4">
              <h3 className="font-medium mb-2">{manager.name}</h3>
              <div className="mb-2 overflow-x-auto rounded bg-[var(--band)] p-3 font-mono text-xs">
                {manager.command}
              </div>
              <p className="text-sm text-[var(--muted)]">{manager.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Terminal Commands */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
        <div className="space-y-3">
          <TerminalCommand
            command={`openssl rand -base64 ${Math.ceil(length * 0.75)} | tr -dc 'a-zA-Z0-9!@#$%^&*' | head -c ${length}`}
            description="OpenSSL with special characters"
          />
          <TerminalCommand
            command={`LC_ALL=C tr -dc 'a-zA-Z0-9!@#$%^&*' < /dev/urandom | head -c ${length}`}
            description="Linux /dev/urandom"
          />
          <TerminalCommand
            command={`python3 -c "import secrets; import string; print(''.join(secrets.choice(string.ascii_letters + string.digits + '!@#$%^&*') for _ in range(${length})))"`}
            description="Python secrets module"
          />
          {mode === 'passphrase' && (
            <TerminalCommand
              command={`shuf -n${wordCount} /usr/share/dict/words | tr '\\n' '${separator}' | sed 's/${separator}$//'`}
              description="Unix passphrase generation"
            />
          )}
        </div>
      </section>

      {/* Related Content */}
      <RelatedContent {...passwordRelated} />

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
