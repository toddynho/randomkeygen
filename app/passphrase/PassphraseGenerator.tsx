'use client'

import { useState, useEffect, useCallback } from 'react'
import { generators, EFF_WORDLIST, calculatePassphraseEntropy } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  ControlField,
  CheckboxField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  TerminalCommand,
  BulkGenerator,
  PasswordManagerNextStep,
} from '../components'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Passphrase Generator', url: '/passphrase' },
]

export default function PassphraseGenerator() {
  const [wordCount, setWordCount] = useState(4)
  const [separator, setSeparator] = useState('-')
  const [capitalize, setCapitalize] = useState(false)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 5 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generatePassphrase = useCallback(() => {
    let phrase = generators.passphrase(wordCount, separator)
    if (capitalize) {
      phrase = phrase.split(separator).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(separator)
    }
    return phrase
  }, [wordCount, separator, capitalize])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 5 }, () => generatePassphrase()))
  }, [generatePassphrase])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new passphrases')
  }, [generateAll, flash])

  useRegenerateHotkey(handleGenerate)

  // Entropy from the actual pool: wordCount random picks from the EFF wordlist
  const entropy = Math.floor(calculatePassphraseEntropy(wordCount))

  return (
    <GeneratorLayout
      title="Passphrase Generator"
      description="Generate memorable passphrases using the EFF wordlist. Easier to remember than random characters, but still cryptographically strong."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <PasswordManagerNextStep
          title="Decide whether to memorize or store this passphrase."
          description="A vault account passphrase should be unique and recoverable from a safe backup. Passphrases for ordinary sites are best saved in a password manager like any other credential."
        />
      }
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate passphrases"
        readout={{ bits: entropy, poolSize: EFF_WORDLIST.length, poolLabel: `${EFF_WORDLIST.length}-word pool` }}
      >
        <ControlField
          label="Words"
          type="select"
          value={wordCount}
          onChange={(value) => setWordCount(Number(value))}
          options={[
            { value: 3, label: '3 words' },
            { value: 4, label: '4 words' },
            { value: 5, label: '5 words' },
            { value: 6, label: '6 words' },
            { value: 8, label: '8 words' },
          ]}
        />
        <ControlField
          label="Separator"
          type="select"
          value={separator}
          onChange={(value) => setSeparator(value as string)}
          options={[
            { value: '-', label: 'Hyphen (-)' },
            { value: '_', label: 'Underscore (_)' },
            { value: ' ', label: 'Space' },
            { value: '.', label: 'Period (.)' },
            { value: '', label: 'None' },
          ]}
        />
        <div className="flex items-end">
          <CheckboxField label="Capitalize words" checked={capitalize} onChange={setCapitalize} />
        </div>
      </GeneratorControls>

      <OutputDisplay
        values={values}
        noun="passphrases"
        getBits={() => entropy}
        onRegenerate={(index) => {
          setValues((current) => {
            const next = [...current]
            next[index] = generatePassphrase()
            return next
          })
        }}
        onRegenerateAll={handleGenerate}
      />

      {/* Info */}
      <section className="mb-8">
        <SecurityNotice type="info" title="Why passphrases?">
          <p className="mb-2">
            Passphrases like <code>correct-horse-battery-staple</code> are often more secure
            than complex passwords because they're longer and harder to crack, while being
            easier to remember.
          </p>
          <p>
            A 4-word passphrase from this {EFF_WORDLIST.length.toLocaleString('en-US')}-word vocabulary has approximately{' '}
            {Math.floor(calculatePassphraseEntropy(4))} bits of ideal entropy. Each additional randomly selected word adds about{' '}
            {Math.log2(EFF_WORDLIST.length).toFixed(1)} bits.
          </p>
        </SecurityNotice>
      </section>

      {/* Bulk Generation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generatePassphrase}
          getBits={() => entropy}
          label="passphrases"
        />
      </section>

      {/* Terminal Commands */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
        <p className="text-[var(--muted)] text-sm mb-4">
          For production systems, consider generating passphrases locally:
        </p>
        <div className="space-y-3">
          <TerminalCommand
            command="shuf -n 4 /usr/share/dict/words | tr '\n' '-' | sed 's/-$//'"
            description="Linux (using system dictionary)"
          />
          <TerminalCommand
            command={`python3 -c "import secrets; words=['apple','banana','cherry',...]; print('-'.join(secrets.choice(words) for _ in range(4)))"`}
            description="Python (with custom wordlist)"
          />
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
