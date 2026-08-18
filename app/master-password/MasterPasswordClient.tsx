'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators, calculateEntropy, calculatePassphraseEntropy, EFF_WORDLIST, ALL_CHARS } from '@/app/lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  RangeField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  PasswordManagerNextStep,
} from '@/app/components'

type PasswordType = 'random' | 'passphrase'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Master Password Generator', url: '/master-password' },
]

export default function MasterPasswordClient() {
  const [type, setType] = useState<PasswordType>('passphrase')
  const [randomLength, setRandomLength] = useState(24)
  const [wordCount, setWordCount] = useState(5)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 4 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generatePassword = useCallback(() => {
    if (type === 'passphrase') {
      return generators.passphrase(wordCount, '-')
    }
    return generators.password(randomLength, true)
  }, [type, randomLength, wordCount])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 4 }, () => generatePassword()))
  }, [generatePassword])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new master passwords')
  }, [generateAll, flash])

  useRegenerateHotkey(handleGenerate)

  // Entropy from the actual pool: EFF wordlist for passphrases, full charset for random
  const entropy = type === 'passphrase'
    ? Math.floor(calculatePassphraseEntropy(wordCount))
    : calculateEntropy(randomLength, ALL_CHARS.length)

  const readout = type === 'passphrase'
    ? { bits: entropy, poolSize: EFF_WORDLIST.length, poolLabel: `${EFF_WORDLIST.length}-word pool` }
    : { bits: entropy, poolSize: ALL_CHARS.length }

  const typeButton = (value: PasswordType, label: string) => (
    <button
      onClick={() => setType(value)}
      aria-pressed={type === value}
      className={`min-h-11 flex-1 rounded-[10px] border px-3 text-14 font-semibold transition-colors ${
        type === value
          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]'
          : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]'
      }`}
    >
      {label}
    </button>
  )

  return (
    <GeneratorLayout
      title="Master Password Generator"
      description="Generate an ultra-secure master password for your password manager. This is the most important password you'll ever create - make it strong."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <PasswordManagerNextStep
          title="Your vault password and recovery plan belong together."
          description="Before adopting one of these values, compare how managers protect the vault, approve new devices, and recover access if you lose every trusted device."
        />
      }
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate master passwords"
        readout={readout}
      >
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="form-label">Type</label>
            <div className="flex gap-2">
              {typeButton('passphrase', 'Passphrase (Recommended)')}
              {typeButton('random', 'Random')}
            </div>
          </div>

          <div>
            {type === 'passphrase' ? (
              <>
                <label className="form-label">Words</label>
                <div className="flex flex-wrap gap-2">
                  {[4, 5, 6, 7].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWordCount(w)}
                      aria-pressed={wordCount === w}
                      className={`min-h-11 rounded-[10px] border px-4 text-14 font-semibold transition-colors ${
                        wordCount === w
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]'
                          : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]'
                      }`}
                    >
                      {w} words
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <RangeField label="Length" value={randomLength} onChange={setRandomLength} min={20} max={40} />
            )}
          </div>
        </div>
      </GeneratorControls>

      <OutputDisplay
        values={values}
        noun="passwords"
        getBits={() => entropy}
        onRegenerate={(index) => {
          setValues((current) => {
            const next = [...current]
            next[index] = generatePassword()
            return next
          })
        }}
        onRegenerateAll={handleGenerate}
      />

      <SecurityNotice type="warning" title="Master password security is critical">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Memorize it</strong> - Don't write it down anywhere digitally</li>
          <li><strong>Never reuse</strong> - Use it only for your password manager</li>
          <li><strong>Enable 2FA</strong> - Add another layer of protection</li>
          <li><strong>Write it down securely</strong> - Store a physical backup in a safe place (safety deposit box)</li>
          <li><strong>Test your memory</strong> - Practice typing it before relying on it</li>
        </ul>
      </SecurityNotice>

      <section className="mt-8 border-t border-[var(--border)] pt-8">
        <h2 className="text-lg font-semibold mb-4">Why passphrases are recommended</h2>
        <p className="text-[var(--muted)] mb-4">
          A 5-word passphrase like <code className="text-[var(--accent-strong)]">correct-horse-battery-staple</code> is
          easier to remember than a random string but can have comparable entropy. The key is using
          truly random words, not a phrase you make up.
        </p>
        <Link href="/passphrase" className="text-[var(--accent)] hover:underline">
          Learn more about passphrases →
        </Link>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
