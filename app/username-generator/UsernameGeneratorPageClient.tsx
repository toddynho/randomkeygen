'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSecureRandomInt } from '../lib/crypto'
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
  BulkGenerator,
} from '../components'

type UsernameStyle = 'random' | 'gaming' | 'professional' | 'anonymous' | 'memorable'

// Word lists for username generation
const ADJECTIVES = [
  'swift', 'bright', 'dark', 'wild', 'calm', 'bold', 'cool', 'epic', 'fast', 'keen',
  'lucky', 'mighty', 'noble', 'quick', 'rare', 'sharp', 'silent', 'smart', 'stark', 'wise',
  'cosmic', 'cyber', 'digital', 'electric', 'frozen', 'golden', 'hidden', 'iron', 'jade', 'lunar',
  'mystic', 'neon', 'phantom', 'primal', 'quantum', 'rapid', 'shadow', 'solar', 'stellar', 'thunder',
  'ultra', 'vapor', 'vivid', 'winter', 'zero', 'alpha', 'beta', 'gamma', 'delta', 'omega'
]

const NOUNS = [
  'wolf', 'hawk', 'fox', 'bear', 'lion', 'tiger', 'eagle', 'raven', 'dragon', 'phoenix',
  'knight', 'ninja', 'wizard', 'ranger', 'hunter', 'warrior', 'ghost', 'spirit', 'storm', 'blade',
  'comet', 'nova', 'pulse', 'spark', 'flash', 'volt', 'byte', 'pixel', 'cipher', 'vector',
  'nexus', 'zenith', 'apex', 'core', 'node', 'orbit', 'prism', 'echo', 'flux', 'matrix',
  'sage', 'scout', 'pilot', 'chief', 'captain', 'legend', 'hero', 'ace', 'maverick', 'viper'
]

const PROFESSIONAL_PREFIXES = ['pro', 'dev', 'tech', 'data', 'code', 'net', 'sys', 'app', 'web', 'cloud']
const PROFESSIONAL_SUFFIXES = ['dev', 'ops', 'eng', 'tech', 'pro', 'hub', 'lab', 'works', 'io', 'hq']

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'Username Generator', url: '/username-generator' },
]

function getRandomElement<T>(arr: T[]): T {
  return arr[getSecureRandomInt(arr.length)]
}

function getRandomNumber(min: number, max: number): number {
  return min + getSecureRandomInt(max - min + 1)
}

function generateUsername(style: UsernameStyle, includeNumbers: boolean): string {
  let username = ''

  switch (style) {
    case 'gaming':
      // Gaming style: AdjectiveNoun or AdjectiveNoun123
      username = getRandomElement(ADJECTIVES) + getRandomElement(NOUNS)
      username = username.charAt(0).toUpperCase() + username.slice(1)
      // Capitalize the noun too
      const nounStart = ADJECTIVES.find(a => username.toLowerCase().startsWith(a))?.length || 0
      if (nounStart > 0) {
        username = username.slice(0, nounStart) + username.charAt(nounStart).toUpperCase() + username.slice(nounStart + 1)
      }
      if (includeNumbers) {
        username += getRandomNumber(1, 999)
      }
      break

    case 'professional':
      // Professional style: prefix_name or name_suffix
      if (getSecureRandomInt(2) === 1) {
        username = getRandomElement(PROFESSIONAL_PREFIXES) + '_' + getRandomElement(NOUNS)
      } else {
        username = getRandomElement(ADJECTIVES) + '_' + getRandomElement(PROFESSIONAL_SUFFIXES)
      }
      break

    case 'anonymous':
      // Anonymous style: anon_randomchars or user_randomchars
      const prefixes = ['anon', 'user', 'guest', 'temp', 'random']
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let suffix = ''
      for (let i = 0; i < 8; i++) {
        suffix += chars[getRandomNumber(0, chars.length - 1)]
      }
      username = getRandomElement(prefixes) + '_' + suffix
      break

    case 'memorable':
      // Memorable style: word-word-number
      username = getRandomElement(ADJECTIVES) + '-' + getRandomElement(NOUNS)
      if (includeNumbers) {
        username += '-' + getRandomNumber(10, 99)
      }
      break

    case 'random':
    default:
      // Random alphanumeric
      const charset = 'abcdefghijklmnopqrstuvwxyz'
      const length = getRandomNumber(8, 12)
      for (let i = 0; i < length; i++) {
        username += charset[getRandomNumber(0, charset.length - 1)]
      }
      if (includeNumbers) {
        username += getRandomNumber(1, 9999)
      }
      break
  }

  return username
}

// Size of the name space for each style — usernames are public, so we show
// variety (possible combinations) instead of crack-time entropy.
function styleCombinations(style: UsernameStyle, includeNumbers: boolean): number {
  switch (style) {
    case 'gaming':
      return ADJECTIVES.length * NOUNS.length * (includeNumbers ? 999 : 1)
    case 'professional':
      return PROFESSIONAL_PREFIXES.length * NOUNS.length + ADJECTIVES.length * PROFESSIONAL_SUFFIXES.length
    case 'anonymous':
      return 5 * Math.pow(36, 8)
    case 'memorable':
      return ADJECTIVES.length * NOUNS.length * (includeNumbers ? 90 : 1)
    case 'random':
    default: {
      let total = 0
      for (let l = 8; l <= 12; l++) total += Math.pow(26, l)
      return includeNumbers ? total * 9999 : total
    }
  }
}

function formatCombinations(count: number): string {
  if (count >= 1e15) return `${(count / 1e15).toFixed(1)} quadrillion`
  if (count >= 1e12) return `${(count / 1e12).toFixed(1)} trillion`
  if (count >= 1e9) return `${(count / 1e9).toFixed(1)} billion`
  if (count >= 1e6) return `${(count / 1e6).toFixed(1)} million`
  return count.toLocaleString('en-US')
}

export default function UsernameGeneratorPage() {
  const [style, setStyle] = useState<UsernameStyle>('gaming')
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 10 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generate = useCallback(() => {
    return generateUsername(style, includeNumbers)
  }, [style, includeNumbers])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 10 }, () => generate()))
  }, [generate])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new usernames')
  }, [generateAll, flash])

  useRegenerateHotkey(handleGenerate)

  const combinations = styleCombinations(style, includeNumbers)

  return (
    <GeneratorLayout
      title="Username Generator"
      description="Generate unique, random usernames for gaming, social media, email accounts, and online services. Multiple styles to match your needs."
      breadcrumbItems={breadcrumbItems}
    >
      <GeneratorControls onGenerate={handleGenerate} generateLabel="Generate usernames">
        <ControlField
          label="Style"
          type="select"
          value={style}
          onChange={(value) => setStyle(value as UsernameStyle)}
          options={[
            { value: 'gaming', label: 'Gaming (SwiftWolf, DarkPhoenix)' },
            { value: 'professional', label: 'Professional (tech_sage, code_hub)' },
            { value: 'memorable', label: 'Memorable (cosmic-eagle-42)' },
            { value: 'anonymous', label: 'Anonymous (anon_x7k9m2p4)' },
            { value: 'random', label: 'Random (xkqmwpzt)' },
          ]}
        />
        <div className="flex items-end">
          <CheckboxField label="Include numbers" checked={includeNumbers} onChange={setIncludeNumbers} />
        </div>
        {/* Usernames are public identifiers, not secrets — show variety instead of crack-time entropy */}
        <div className="w-full border-t border-[var(--hairline)] pt-3.5 text-14">
          <span className="font-semibold text-[var(--foreground)]">
            Possible combinations:{' '}
            <span className="font-mono text-[var(--accent-strong)]">~{formatCombinations(combinations)}</span>
          </span>
          <span className="text-[var(--muted)]"> · usernames are public identifiers, not secrets</span>
        </div>
      </GeneratorControls>

      <OutputDisplay
        values={values}
        onRegenerate={(index) => {
          setValues((current) => {
            const next = [...current]
            next[index] = generate()
            return next
          })
        }}
      />

      {/* Style Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Username Styles Explained</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="font-medium mb-2">Gaming</h3>
            <p className="text-sm text-[var(--muted)] mb-2">
              Bold, memorable names perfect for games and streaming.
            </p>
            <div className="text-xs font-mono text-[var(--accent-strong)]">
              ShadowNinja, CosmicDragon42, NeonPhantom
            </div>
          </div>
          <div className="card p-4">
            <h3 className="font-medium mb-2">Professional</h3>
            <p className="text-sm text-[var(--muted)] mb-2">
              Clean, work-appropriate usernames for business accounts.
            </p>
            <div className="text-xs font-mono text-[var(--accent-strong)]">
              dev_phoenix, tech_sage, data_ops
            </div>
          </div>
          <div className="card p-4">
            <h3 className="font-medium mb-2">Memorable</h3>
            <p className="text-sm text-[var(--muted)] mb-2">
              Easy to remember and type, with word-based patterns.
            </p>
            <div className="text-xs font-mono text-[var(--accent-strong)]">
              swift-hawk-77, cosmic-blade-33
            </div>
          </div>
          <div className="card p-4">
            <h3 className="font-medium mb-2">Anonymous</h3>
            <p className="text-sm text-[var(--muted)] mb-2">
              Random strings for privacy-focused accounts.
            </p>
            <div className="text-xs font-mono text-[var(--accent-strong)]">
              anon_8k3m7x9p, user_q2w4e6r8
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="mb-8">
        <SecurityNotice type="info" title="Username Tips">
          <ul className="list-disc list-inside space-y-1">
            <li>Check availability on your target platform before committing</li>
            <li>Avoid using personal information (real name, birthdate)</li>
            <li>Keep it easy to spell if others need to find you</li>
            <li>Consider using different usernames for different purposes</li>
            <li>Add numbers if your preferred username is taken</li>
          </ul>
        </SecurityNotice>
      </section>

      {/* Bulk Generation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generate}
          label="usernames"
        />
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
