'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getSecureRandomInt, EFF_WORDLIST, calculatePassphraseEntropy } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  ControlField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  BulkGenerator,
} from '../components'

type PasswordStyle = 'words' | 'wordsnumbers' | 'sentence' | 'acronym'

function getRandomElement<T>(arr: T[]): T {
  return arr[getSecureRandomInt(arr.length)]
}

function getRandomNumber(min: number, max: number): number {
  return min + getSecureRandomInt(max - min + 1)
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const SENTENCE_VERBS = ['runs', 'jumps', 'walks', 'flies', 'swims', 'drives', 'reads', 'writes', 'builds', 'makes']
const SENTENCE_ARTICLES = ['the', 'a', 'one', 'some', 'this', 'that']

function generateMemorablePassword(style: PasswordStyle, wordCount: number, separator: string): string {
  const words: string[] = []

  for (let i = 0; i < wordCount; i++) {
    words.push(getRandomElement(EFF_WORDLIST))
  }

  switch (style) {
    case 'words':
      // Simple word combination: word-word-word
      return words.map(capitalize).join(separator)

    case 'wordsnumbers':
      // Words with numbers: Word1-Word2-Word3
      return words.map((w) => capitalize(w) + getRandomNumber(0, 9)).join(separator)

    case 'sentence':
      // Sentence style: The quick fox jumps over
      return `${capitalize(getRandomElement(SENTENCE_ARTICLES))} ${words[0]} ${getRandomElement(SENTENCE_VERBS)} ${words.slice(1).join(' ')}`

    case 'acronym': {
      // First letters with symbols: Tqfj@2024
      const symbols = '!@#$%&*'
      const firstLetters = words.map(w => w[0]).join('')
      return capitalize(firstLetters) + getRandomElement(symbols.split('')) + getRandomNumber(1000, 9999)
    }

    default:
      return words.map(capitalize).join(separator)
  }
}

// Entropy computed from the actual configuration of each style.
function estimateBits(style: PasswordStyle, wordCount: number): number {
  switch (style) {
    case 'wordsnumbers':
      // Each word also carries an independent random digit.
      return Math.round(wordCount * (Math.log2(EFF_WORDLIST.length) + Math.log2(10)))
    case 'sentence':
      // Random article + verb + the words themselves.
      return Math.round(
        wordCount * Math.log2(EFF_WORDLIST.length) +
        Math.log2(SENTENCE_ARTICLES.length) +
        Math.log2(SENTENCE_VERBS.length)
      )
    case 'acronym':
      return Math.round(wordCount * Math.log2(26) + Math.log2(7) + Math.log2(9000))
    case 'words':
    default:
      return Math.round(calculatePassphraseEntropy(wordCount))
  }
}

interface MemorablePasswordPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
}

export default function MemorablePasswordPageClient({ breadcrumbItems }: MemorablePasswordPageClientProps) {
  const [style, setStyle] = useState<PasswordStyle>('words')
  const [wordCount, setWordCount] = useState(4)
  const [separator, setSeparator] = useState('-')
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 5 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generate = useCallback(() => {
    return generateMemorablePassword(style, wordCount, separator)
  }, [style, wordCount, separator])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 5 }, () => generate()))
  }, [generate])

  const regenerateValue = useCallback((index: number) => {
    setValues((current) => {
      const next = [...current]
      next[index] = generate()
      return next
    })
  }, [generate])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new passwords')
  }, [generateAll, flash])

  const handleRegenerateAll = useCallback(() => {
    generateAll()
    flash('Regenerated all')
  }, [generateAll, flash])

  // `R` regenerates everything when no field has focus
  useRegenerateHotkey(handleRegenerateAll)

  const entropyBits = estimateBits(style, wordCount)
  const getBits = useCallback(() => estimateBits(style, wordCount), [style, wordCount])

  return (
    <GeneratorLayout
      title="Memorable Password Generator"
      description="Generate passwords that are both secure AND easy to remember. Using word-based patterns makes passwords memorable without sacrificing security."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <SecurityNotice type="info" title="Tips for Memorable Passwords">
          <ul className="list-disc list-inside space-y-1">
            <li>Create a mental image or story connecting the words</li>
            <li>Use more words for higher assurance; 6 words from this vocabulary provide about 58 bits of ideal entropy</li>
            <li>Adding a number or symbol increases security with minimal memory burden</li>
            <li>Each independently selected word multiplies the search space by {EFF_WORDLIST.length}</li>
            <li>Still use unique passwords for each account - use a password manager!</li>
          </ul>
          <p className="mt-2">
            <Link href="/guides/password-security-best-practices" className="font-semibold text-[var(--accent)] hover:underline">
              Password security best practices →
            </Link>
          </p>
        </SecurityNotice>
      }
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate passwords"
        readout={{
          bits: entropyBits,
          poolSize: EFF_WORDLIST.length,
          poolLabel: `${wordCount} words from ${EFF_WORDLIST.length}-word list`,
        }}
      >
        <ControlField
          label="Style"
          htmlFor="memorable-style"
          type="select"
          value={style}
          onChange={(value) => setStyle(value as PasswordStyle)}
          options={[
            { value: 'words', label: 'Words (Correct-Horse-Battery)' },
            { value: 'wordsnumbers', label: 'Words + Numbers (Correct1-Horse2-Battery3)' },
            { value: 'sentence', label: 'Sentence (The quick fox jumps)' },
            { value: 'acronym', label: 'Acronym (Chbs@2024)' },
          ]}
        />
        <ControlField
          label="Word Count"
          htmlFor="memorable-word-count"
          type="select"
          value={wordCount}
          onChange={(value) => setWordCount(Number(value))}
          options={[
            { value: 3, label: '3 words' },
            { value: 4, label: '4 words (recommended)' },
            { value: 5, label: '5 words' },
            { value: 6, label: '6 words (high security)' },
          ]}
        />
        {(style === 'words' || style === 'wordsnumbers') && (
          <ControlField
            label="Separator"
            htmlFor="memorable-separator"
            type="select"
            value={separator}
            onChange={(value) => setSeparator(value as string)}
            options={[
              { value: '-', label: 'Hyphen (-)' },
              { value: '.', label: 'Period (.)' },
              { value: '_', label: 'Underscore (_)' },
              { value: ' ', label: 'Space' },
              { value: '', label: 'None' },
            ]}
          />
        )}
      </GeneratorControls>

      {/* Generated passwords */}
      <OutputDisplay
        values={values}
        noun="passwords"
        getBits={getBits}
        onRegenerate={regenerateValue}
        onRegenerateAll={handleRegenerateAll}
      />

      {/* XKCD Reference */}
      <section className="mb-8 card p-6">
        <h2 className="text-xl font-semibold mb-3">Why Word-Based Passwords?</h2>
        <p className="text-[var(--muted)] mb-4">
          As famously illustrated by <a href="https://xkcd.com/936/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">XKCD #936</a>,
          a password like <code>correct-horse-battery-staple</code> is both easier to remember
          AND more secure than something like <code>Tr0ub4dor&amp;3</code>.
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-[10px] bg-[var(--band)] p-3">
            <div className="font-mono text-[var(--destructive)] mb-1">Tr0ub4dor&amp;3</div>
            <div className="text-[var(--muted)]">~28 bits entropy, hard to remember</div>
          </div>
          <div className="rounded-[10px] bg-[var(--band)] p-3">
            <div className="font-mono text-[var(--accent-strong)] mb-1">correct-horse-battery-staple</div>
            <div className="text-[var(--muted)]">~44 bits entropy, easy to remember</div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Security Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 pr-4">Words</th>
                <th className="text-left py-2 pr-4">Entropy</th>
                <th className="text-left py-2">Equivalent Random Chars</th>
              </tr>
            </thead>
            <tbody className="text-[var(--muted)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">3 words</td>
                <td className="py-2 pr-4">~29 bits</td>
                <td className="py-2">~5 random characters</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">4 words</td>
                <td className="py-2 pr-4">~38 bits</td>
                <td className="py-2">~6 random characters</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">5 words</td>
                <td className="py-2 pr-4">~48 bits</td>
                <td className="py-2">~8 random characters</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">6 words</td>
                <td className="py-2 pr-4">~58 bits</td>
                <td className="py-2">~9 random characters</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bulk Generation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generate}
          getBits={getBits}
          label="passwords"
        />
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
