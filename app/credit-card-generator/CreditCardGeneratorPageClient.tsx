'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { getSecureRandomInt } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  ControlField,
  SecurityNotice,
  Toast,
  useToast,
  useRegenerateHotkey,
} from '../components'

type CardType = 'visa' | 'mastercard' | 'amex' | 'discover'

interface CardConfig {
  name: string
  prefixes: string[]
  length: number
}

const CARD_CONFIGS: Record<CardType, CardConfig> = {
  visa: { name: 'Visa', prefixes: ['4'], length: 16 },
  mastercard: { name: 'Mastercard', prefixes: ['51', '52', '53', '54', '55'], length: 16 },
  amex: { name: 'American Express', prefixes: ['34', '37'], length: 15 },
  discover: { name: 'Discover', prefixes: ['6011', '65'], length: 16 },
}

function getRandomDigit(): number {
  return getSecureRandomInt(10)
}

function getRandomElement<T>(arr: T[]): T {
  return arr[getSecureRandomInt(arr.length)]
}

// Luhn algorithm to generate valid check digit
function calculateLuhnCheckDigit(partialNumber: string): number {
  const digits = partialNumber.split('').map(Number).reverse()
  let sum = 0

  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i]
    if (i % 2 === 0) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }

  return (10 - (sum % 10)) % 10
}

function generateCardNumber(type: CardType): string {
  const config = CARD_CONFIGS[type]
  const prefix = getRandomElement(config.prefixes)

  // Generate random middle digits
  let number = prefix
  const middleLength = config.length - prefix.length - 1 // -1 for check digit

  for (let i = 0; i < middleLength; i++) {
    number += getRandomDigit()
  }

  // Add Luhn check digit
  number += calculateLuhnCheckDigit(number)

  return number
}

function formatCardNumber(number: string, type: CardType): string {
  if (type === 'amex') {
    // Amex format: XXXX XXXXXX XXXXX
    return `${number.slice(0, 4)} ${number.slice(4, 10)} ${number.slice(10)}`
  }
  // Standard format: XXXX XXXX XXXX XXXX
  return number.match(/.{1,4}/g)?.join(' ') || number
}

function generateExpiry(): string {
  const month = String(1 + getSecureRandomInt(12)).padStart(2, '0')
  const currentYear = new Date().getFullYear()
  const year = currentYear + 1 + getSecureRandomInt(5)
  return `${month}/${String(year).slice(-2)}`
}

function generateCVV(type: CardType): string {
  const length = type === 'amex' ? 4 : 3
  let cvv = ''
  for (let i = 0; i < length; i++) {
    cvv += getRandomDigit()
  }
  return cvv
}

interface GeneratedCard {
  type: CardType
  number: string
  expiry: string
  cvv: string
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Developer Generators', url: '/developer' },
  { name: 'Test Credit Card Generator', url: '/credit-card-generator' },
]

const OFFICIAL_TEST_CARDS: Array<{
  provider: string
  note: string
  rows: Array<{ label: string; number: string }>
}> = [
  {
    provider: 'Stripe Test Cards',
    note: 'Use any future expiry and any 3-digit CVV',
    rows: [
      { label: 'Visa (success)', number: '4242 4242 4242 4242' },
      { label: 'Visa (decline)', number: '4000 0000 0000 0002' },
      { label: 'Mastercard', number: '5555 5555 5555 4444' },
      { label: 'Amex', number: '3782 822463 10005' },
      { label: '3D Secure', number: '4000 0025 0000 3155' },
    ],
  },
  {
    provider: 'PayPal Sandbox',
    note: 'Expiry: Any future date, CVV: Any 3-4 digits',
    rows: [
      { label: 'Visa', number: '4032 0350 0109 5217' },
      { label: 'Mastercard', number: '5425 2334 3010 9903' },
      { label: 'Amex', number: '3434 343434 34343' },
    ],
  },
]

const CARD_FORMAT_ROWS: Array<{ type: string; prefixes: string; length: string; cvv: string }> = [
  { type: 'Visa', prefixes: '4', length: '16 digits', cvv: '3 digits' },
  { type: 'Mastercard', prefixes: '51-55', length: '16 digits', cvv: '3 digits' },
  { type: 'American Express', prefixes: '34, 37', length: '15 digits', cvv: '4 digits' },
  { type: 'Discover', prefixes: '6011, 65', length: '16 digits', cvv: '3 digits' },
]

export default function CreditCardGeneratorPageClient() {
  const [cardType, setCardType] = useState<CardType>('visa')
  const [cards, setCards] = useState<GeneratedCard[]>(() =>
    Array.from({ length: 5 }, () => ({ number: '', expiry: '', cvv: '', type: 'visa' as CardType }))
  )
  const [copied, setCopied] = useState<number | null>(null)
  const [toastMessage, flash] = useToast()
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const generateCard = useCallback((): GeneratedCard => {
    return {
      type: cardType,
      number: generateCardNumber(cardType),
      expiry: generateExpiry(),
      cvv: generateCVV(cardType),
    }
  }, [cardType])

  const generateAll = useCallback(() => {
    setCards(Array.from({ length: 5 }, () => generateCard()))
  }, [generateCard])

  const regenerateCard = useCallback((index: number) => {
    setCards((current) => {
      const next = [...current]
      next[index] = generateCard()
      return next
    })
  }, [generateCard])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new test cards')
  }, [generateAll, flash])

  useRegenerateHotkey(handleGenerate)

  const copyCard = async (index: number) => {
    const card = cards[index]
    await navigator.clipboard.writeText(card.number)
    clearTimeout(copyTimer.current)
    setCopied(index)
    copyTimer.current = setTimeout(() => setCopied(null), 1400)
  }

  return (
    <GeneratorLayout
      title="Test Credit Card Generator"
      description="Generate valid test credit card numbers for development and testing purposes. These cards pass Luhn validation but are not real and cannot be used for purchases."
      breadcrumbItems={breadcrumbItems}
    >
      {/* Warning — kept prominent, above the tool */}
      <section className="mb-6">
        <SecurityNotice type="warning" title="For Testing Only">
          <p>
            These are <strong>fake test card numbers</strong> for software development and testing.
            They are not connected to real accounts and cannot be used for actual purchases.
            Using fake card numbers for fraud is illegal.
          </p>
        </SecurityNotice>
      </section>

      {/* Controls */}
      <GeneratorControls onGenerate={handleGenerate} generateLabel="Generate test cards">
        <ControlField
          label="Card Type"
          htmlFor="card-type"
          type="select"
          value={cardType}
          onChange={(value) => setCardType(value as CardType)}
          options={[
            { value: 'visa', label: 'Visa' },
            { value: 'mastercard', label: 'Mastercard' },
            { value: 'amex', label: 'American Express' },
            { value: 'discover', label: 'Discover' },
          ]}
        />
        <p className="w-full text-14 leading-[1.6] text-[var(--muted)]">
          Numbers are Luhn-valid ({CARD_CONFIGS[cardType].name}: {CARD_CONFIGS[cardType].length} digits,
          prefix {CARD_CONFIGS[cardType].prefixes.join('/')}) — the check digit catches typos, it does not
          make a card real. Press <kbd className="rounded border border-[var(--border-strong)] bg-[var(--band)] px-1 font-mono text-12">R</kbd> to regenerate.
        </p>
      </GeneratorControls>

      {/* Generated cards */}
      <section className="mb-6 overflow-hidden card shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between gap-2.5 border-b border-[var(--hairline)] px-[18px] py-[13px]">
          <h2 className="text-15 font-semibold">Generated test cards</h2>
          <button
            onClick={handleGenerate}
            className="min-h-10 rounded-[9px] border border-[var(--border-strong)] bg-[var(--background)] px-[15px] text-14 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
          >
            ↻ Regenerate all
          </button>
        </div>
        <div>
          {cards.map((card, i) => (
            <div key={i} className="flex items-center gap-1.5 border-b border-[var(--hairline)] py-2.5 pl-[18px] pr-3 last:border-0">
              <div className="min-w-0 flex-1">
                <div className="overflow-x-auto whitespace-nowrap pb-0.5 font-mono text-16 tracking-wider text-[var(--foreground)]">
                  {formatCardNumber(card.number, card.type)}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-13 text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--muted)]">{CARD_CONFIGS[card.type].name}</span>
                  <span>Expires <span className="font-mono text-[var(--foreground)]">{card.expiry}</span></span>
                  <span>CVV <span className="font-mono text-[var(--foreground)]">{card.cvv}</span></span>
                </div>
              </div>
              <button
                onClick={() => regenerateCard(i)}
                aria-label="Regenerate this test card"
                className="grid min-h-10 min-w-10 place-items-center rounded-lg text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              >
                ↻
              </button>
              <button
                onClick={() => copyCard(i)}
                aria-label="Copy this card number"
                className={`grid min-h-10 min-w-16 place-items-center rounded-lg text-13 font-semibold tracking-[0.04em] transition-colors hover:text-[var(--accent)] ${
                  copied === i ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                }`}
              >
                {copied === i ? '✓ Copied' : 'COPY'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Official Test Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Official Test Card Numbers</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Payment processors provide official test cards. Use these for integration testing:
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {OFFICIAL_TEST_CARDS.map((provider) => (
            <div key={provider.provider} className="overflow-hidden card">
              <div className="border-b border-[var(--hairline)] bg-[var(--band)] px-4 py-2.5">
                <h3 className="text-15 font-semibold">{provider.provider}</h3>
              </div>
              <div>
                {provider.rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 border-b border-[var(--hairline)] px-4 py-2 last:border-0">
                    <span className="text-sm text-[var(--muted)]">{row.label}</span>
                    <span className="whitespace-nowrap font-mono text-sm text-[var(--foreground)]">{row.number}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--hairline)] px-4 py-2 text-xs text-[var(--muted-foreground)]">
                {provider.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Luhn Algorithm */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">How Card Validation Works</h2>
        <div className="card p-4">
          <p className="mb-4 text-[var(--muted)]">
            Credit card numbers use the <strong>Luhn algorithm</strong> (mod 10) for basic validation.
            The last digit is a check digit that makes the number pass the algorithm.
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-[var(--muted)]">
            <li>Starting from the right, double every second digit</li>
            <li>If doubling results in a number &gt; 9, subtract 9</li>
            <li>Sum all the digits</li>
            <li>If the sum is divisible by 10, the number is valid</li>
          </ol>
          <p className="mt-4 text-xs text-[var(--muted-foreground)]">
            Note: Luhn only catches typos - it doesn&apos;t verify if a card actually exists.
          </p>
        </div>
      </section>

      {/* Card Prefixes */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Card Number Formats</h2>
        <div className="overflow-hidden card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--hairline)] bg-[var(--band)] text-left">
                  <th className="p-3 font-semibold">Card Type</th>
                  <th className="p-3 font-semibold">Prefix(es)</th>
                  <th className="p-3 font-semibold">Length</th>
                  <th className="p-3 font-semibold">CVV</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                {CARD_FORMAT_ROWS.map((row) => (
                  <tr key={row.type} className="border-b border-[var(--hairline)] last:border-0">
                    <td className="p-3 text-[var(--foreground)]">{row.type}</td>
                    <td className="p-3 font-mono">{row.prefixes}</td>
                    <td className="p-3">{row.length}</td>
                    <td className="p-3">{row.cvv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
