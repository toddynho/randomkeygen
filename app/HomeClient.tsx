'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { generators, calculateEntropy, calculatePassphraseEntropy, ALPHANUMERIC, ALL_CHARS } from '@/app/lib/crypto'

type BadgeTone = 'emerald' | 'gray' | 'orange'
type ModuleCategory = 'Passwords' | 'Developer' | 'Encryption'

interface ModuleDef {
  id: string
  name: string
  bits: number
  badge: string
  tone: BadgeTone
  cat: ModuleCategory
  href: string
  gen: () => string
}

const MODULE_DEFS: ModuleDef[] = [
  {
    id: 'strong',
    name: 'Strong (16 char)',
    bits: calculateEntropy(16, ALL_CHARS.length),
    badge: 'Strong',
    tone: 'emerald',
    cat: 'Passwords',
    href: '/password',
    gen: () => generators.password(16, true),
  },
  {
    id: 'memorable',
    name: 'Memorable',
    bits: Math.floor(calculatePassphraseEntropy(3)),
    badge: 'Weak',
    tone: 'orange',
    cat: 'Passwords',
    href: '/passphrase',
    gen: () => generators.passphrase(3, '-'),
  },
  {
    id: 'fortress',
    name: 'Fort Knox (32 char)',
    bits: calculateEntropy(32, ALL_CHARS.length),
    badge: 'Overkill',
    tone: 'emerald',
    cat: 'Passwords',
    href: '/password',
    gen: () => generators.password(32, true),
  },
  {
    id: 'apiKey',
    name: 'API Keys',
    bits: calculateEntropy(32, ALPHANUMERIC.length),
    badge: 'Excellent',
    tone: 'emerald',
    cat: 'Developer',
    href: '/api-key',
    gen: () => generators.apiToken('sk_live', 32),
  },
  {
    id: 'uuid',
    name: 'UUID v4',
    bits: 122,
    badge: 'Identifier',
    tone: 'gray',
    cat: 'Developer',
    href: '/uuid',
    gen: generators.uuid,
  },
  {
    id: 'jwt',
    name: 'JWT Secrets',
    bits: 256,
    badge: 'Overkill',
    tone: 'emerald',
    cat: 'Developer',
    href: '/jwt-secret',
    gen: () => generators.jwtSecret('HS256'),
  },
  {
    id: 'hex256',
    name: '256-bit Hex',
    bits: 256,
    badge: 'Encryption',
    tone: 'gray',
    cat: 'Encryption',
    href: '/encryption-key',
    gen: () => generators.hex(32),
  },
  {
    id: 'wpa',
    name: 'WiFi / WPA',
    bits: calculateEntropy(20, 72),
    badge: 'Strong',
    tone: 'emerald',
    cat: 'Encryption',
    href: '/wifi-password',
    gen: () => generators.wpaPassword(20),
  },
  {
    id: 'alphanumeric',
    name: 'Alphanumeric',
    bits: calculateEntropy(24, ALPHANUMERIC.length),
    badge: 'Excellent',
    tone: 'emerald',
    cat: 'Passwords',
    href: '/password',
    gen: () => generators.alphanumeric(24),
  },
  {
    id: 'hex128',
    name: '128-bit Hex',
    bits: 128,
    badge: 'Encryption',
    tone: 'gray',
    cat: 'Encryption',
    href: '/encryption-key',
    gen: () => generators.hex(16),
  },
  {
    id: 'django',
    name: 'Django Secret',
    bits: 282,
    badge: 'Overkill',
    tone: 'emerald',
    cat: 'Developer',
    href: '/django-secret-key',
    gen: generators.djangoSecret,
  },
  {
    id: 'mongoId',
    name: 'MongoDB ObjectId',
    bits: 96,
    badge: 'Identifier',
    tone: 'gray',
    cat: 'Developer',
    href: '/uuid',
    gen: generators.objectId,
  },
]

const DEFAULT_ORDER = ['strong', 'memorable', 'fortress', 'apiKey', 'uuid', 'jwt', 'hex256', 'wpa']
const STORAGE_KEY = 'rkg-board-order'
const ROWS_KEY = 'rkg-board-rows'
const DEFAULT_ROWS = 4
const MIN_ROWS = 1
const MAX_ROWS = 8
const VALID_IDS = new Set(MODULE_DEFS.map(def => def.id))
const ADD_CATEGORIES = ['All', 'Passwords', 'Developer', 'Encryption'] as const

const BADGE_STYLES: Record<BadgeTone, string> = {
  emerald: 'chip-emerald',
  gray: 'chip-gray',
  orange: 'chip-orange',
}

const defById = (id: string): ModuleDef => MODULE_DEFS.find(def => def.id === id)!

const GENERATOR_DIRECTORY = [
  {
    title: 'Passwords',
    links: [
      ['/password', 'Password generator'],
      ['/passphrase', 'Passphrase'],
      ['/pronounceable-password', 'Pronounceable'],
      ['/master-password', 'Master password'],
      ['/bulk-password-generator', 'Bulk generator'],
      ['/password-strength', 'Strength checker'],
    ],
  },
  {
    title: 'Developer',
    links: [
      ['/api-key', 'API keys'],
      ['/jwt-secret', 'JWT secrets'],
      ['/uuid', 'UUID'],
      ['/random-string', 'Random string'],
      ['/totp-secret', 'TOTP / 2FA'],
      ['/django-secret-key', 'Django secret'],
    ],
  },
  {
    title: 'Encryption',
    links: [
      ['/encryption-key', 'Encryption keys'],
      ['/aes-key', 'AES keys'],
      ['/rsa-key', 'RSA keys'],
      ['/hash-generator', 'Hash generator'],
      ['/hmac-key', 'HMAC keys'],
      ['/salt', 'Salt'],
    ],
  },
  {
    title: 'Keys & more',
    links: [
      ['/ssh-key', 'SSH keys'],
      ['/pgp-key', 'PGP / GPG keys'],
      ['/laravel-key', 'Laravel key'],
      ['/wordpress-salts', 'WordPress salts'],
      ['/wireguard-key', 'WireGuard keys'],
      ['/recovery-key', 'Recovery keys'],
    ],
  },
] as const

const POPULAR_GENERATORS = [
  ['/password', 'Password generator', 'Strong random passwords'],
  ['/password/8-character', '8-character password', 'Legacy system compatible'],
  ['/jwt-secret', 'JWT secret', '256-bit signing keys'],
  ['/uuid', 'UUID generator', 'Unique identifiers'],
  ['/api-key', 'API key generator', 'Secure API tokens'],
  ['/pin-generator', 'PIN generator', 'Banking & device PINs'],
  ['/aes-key', 'AES key generator', 'Encryption keys'],
  ['/rsa-key', 'RSA key generator', 'Public/private pairs'],
] as const

interface Toast {
  msg: string
  undo?: () => void
}

export default function HomeClient() {
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER)
  const [rows, setRows] = useState(DEFAULT_ROWS)
  const rowsRef = useRef(DEFAULT_ROWS)
  const [keysById, setKeysById] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(MODULE_DEFS.map(def => [def.id, Array.from({ length: DEFAULT_ROWS }, () => '')]))
  )
  const [dragId, setDragId] = useState<string | null>(null)
  const [copied, setCopied] = useState<{ id: string; i: number } | null>(null)
  const [armed, setArmed] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [addQuery, setAddQuery] = useState('')
  const [addCat, setAddCat] = useState<(typeof ADD_CATEGORIES)[number]>('All')
  const [quickId, setQuickId] = useState('strong')
  const [quickKeys, setQuickKeys] = useState<string[]>(() => Array.from({ length: 3 }, () => ''))

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const armTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flash = useCallback((msg: string, undo?: () => void) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg, undo })
    toastTimer.current = setTimeout(() => setToast(null), undo ? 5000 : 1500)
  }, [])

  const saveOrder = (next: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Ignore storage failures (private mode, quota).
    }
  }

  const applyOrder = useCallback((next: string[]) => {
    setOrder(next)
    saveOrder(next)
  }, [])

  const regenModules = useCallback((ids: string[], count?: number) => {
    setKeysById(prev => {
      const n = count ?? rowsRef.current
      const next = { ...prev }
      for (const id of ids) {
        const def = defById(id)
        next[id] = Array.from({ length: n }, () => def.gen())
      }
      return next
    })
  }, [])

  // Grow keeps the values already on screen and appends fresh ones; shrink trims.
  const changeRows = (delta: 1 | -1) => {
    const next = Math.min(MAX_ROWS, Math.max(MIN_ROWS, rows + delta))
    if (next === rows) return
    setRows(next)
    rowsRef.current = next
    try {
      localStorage.setItem(ROWS_KEY, String(next))
    } catch {
      // Ignore storage failures (private mode, quota).
    }
    setKeysById(prev => {
      const out: Record<string, string[]> = {}
      for (const [id, values] of Object.entries(prev)) {
        const def = defById(id)
        out[id] =
          next <= values.length
            ? values.slice(0, next)
            : [...values, ...Array.from({ length: next - values.length }, () => def.gen())]
      }
      return out
    })
  }

  const genQuick = (id: string) => {
    const def = defById(id)
    return Array.from({ length: 3 }, () => def.gen())
  }

  // Load persisted board order and generate initial values after mount
  // (localStorage cannot be read during SSR/hydration).
  useEffect(() => {
    let saved: string[] | null = null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every((id): id is string => typeof id === 'string' && VALID_IDS.has(id))
        ) {
          saved = parsed
        }
      }
    } catch {
      // Invalid JSON or storage unavailable — fall back to the default order.
    }
    if (saved) setOrder(saved)
    let savedRows = DEFAULT_ROWS
    try {
      const rawRows = Number.parseInt(localStorage.getItem(ROWS_KEY) ?? '', 10)
      if (Number.isInteger(rawRows) && rawRows >= MIN_ROWS && rawRows <= MAX_ROWS) savedRows = rawRows
    } catch {
      // Storage unavailable — keep the default.
    }
    setRows(savedRows)
    rowsRef.current = savedRows
    regenModules(MODULE_DEFS.map(def => def.id), savedRows)
    setQuickKeys(genQuick('strong'))
  }, [regenModules])

  const doRegenAll = useCallback(() => {
    if (armTimer.current) clearTimeout(armTimer.current)
    setArmed(false)
    regenModules(order)
    setQuickKeys(genQuick(quickId))
    flash('Regenerated all values')
  }, [order, quickId, regenModules, flash])

  const handleRegenAll = () => {
    if (!armed) {
      setArmed(true)
      if (armTimer.current) clearTimeout(armTimer.current)
      armTimer.current = setTimeout(() => setArmed(false), 3500)
      return
    }
    doRegenAll()
  }

  // R hotkey: direct regenerate, only when nothing has focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.key === 'r' || e.key === 'R') &&
        !e.metaKey &&
        !e.ctrlKey &&
        document.activeElement === document.body
      ) {
        doRegenAll()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doRegenAll])

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
      if (armTimer.current) clearTimeout(armTimer.current)
      if (copyTimer.current) clearTimeout(copyTimer.current)
    }
  }, [])

  const copyValue = async (id: string, i: number, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch (err) {
      console.error('Failed to copy:', err)
      return
    }
    if (copyTimer.current) clearTimeout(copyTimer.current)
    setCopied({ id, i })
    copyTimer.current = setTimeout(() => setCopied(null), 1400)
  }

  const copyAllKeys = async () => {
    const all = order.flatMap(id => keysById[id] || [])
    try {
      await navigator.clipboard.writeText(all.join('\n'))
      flash(`Copied ${all.length} values`)
    } catch (err) {
      console.error('Failed to copy all keys:', err)
    }
  }

  const moveModule = (id: string, dir: -1 | 1) => {
    const i = order.indexOf(id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= order.length) return
    const next = [...order]
    next.splice(i, 1)
    next.splice(j, 0, id)
    applyOrder(next)
  }

  const removeModule = (id: string) => {
    const def = defById(id)
    const at = order.indexOf(id)
    applyOrder(order.filter(x => x !== id))
    flash(`Removed ${def.name}`, () => {
      setOrder(prev => {
        const next = [...prev]
        next.splice(Math.min(at, next.length), 0, id)
        saveOrder(next)
        return next
      })
      flash(`Restored ${def.name}`)
    })
  }

  const addModule = (id: string) => {
    const def = defById(id)
    regenModules([id])
    applyOrder([...order, id])
    flash(`Added ${def.name}`)
  }

  const handleDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault()
    if (!dragId || dragId === overId) return
    const from = order.indexOf(dragId)
    const to = order.indexOf(overId)
    if (from < 0 || to < 0 || from === to) return
    const next = [...order]
    next.splice(from, 1)
    next.splice(to, 0, dragId)
    applyOrder(next)
  }

  const hiddenAll = MODULE_DEFS.filter(def => !order.includes(def.id))
  const query = addQuery.trim().toLowerCase()
  const hidden = hiddenAll.filter(
    def => (addCat === 'All' || def.cat === addCat) && (!query || def.name.toLowerCase().includes(query))
  )

  const quickDef = defById(quickId)
  const quickBits = Math.round(quickDef.bits)
  const quickFill = quickBits >= 100 ? 3 : quickBits >= 70 ? 2 : 1
  const quickColor = quickBits >= 70 ? 'var(--success)' : 'var(--warn-bar)'
  const quickFg = quickBits >= 70 ? 'var(--accent-strong)' : 'var(--warn-text)'

  return (
    <div className="page-container pb-10">
      <div>
        {/* Hero */}
        <section className="grid items-center gap-6 py-8 md:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-11">
          <div>
            <h1 className="max-w-[620px] text-2xl font-bold leading-[1.15] tracking-[-0.01em] sm:text-29">
              Secure Password &amp; Key Generator
            </h1>
            <p className="mt-2 max-w-[60ch] text-16 leading-6 text-[var(--muted)]">
              Generate passwords, API credentials, identifiers, and encryption keys entirely in your browser — locally, with nothing sent to a server.
            </p>
            <Link
              href="/guides/how-randomkeygen-works"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1.5 text-14 font-semibold text-[var(--accent-strong)] transition-colors hover:border-[var(--accent)]"
            >
              <span className="h-[7px] w-[7px] rounded-full bg-[var(--success)]" />
              Generated values never leave this device.
            </Link>
          </div>

          {/* Quick keygen */}
          <div className="overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-2 border-b border-[var(--hairline)] py-2 pl-4 pr-2.5">
              <h2 className="flex-none text-15 font-semibold">Quick keygen</h2>
              <select
                aria-label="Quick keygen type"
                value={quickId}
                onChange={e => {
                  const id = e.target.value
                  setQuickId(id)
                  setQuickKeys(genQuick(id))
                }}
                className="form-select ml-auto max-w-[180px] min-h-[38px] py-2 text-xs"
              >
                {MODULE_DEFS.map(def => (
                  <option key={def.id} value={def.id}>
                    {def.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setQuickKeys(genQuick(quickId))}
                aria-label="Regenerate quick keygen"
                className="grid min-h-[38px] min-w-[38px] place-items-center rounded-[9px] border border-[var(--border-strong)] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              >
                <RefreshIcon />
              </button>
            </div>

            <div>
              {quickKeys.map((value, i) => {
                const isCopied = copied?.id === 'quick' && copied.i === i
                return (
                  <button
                    key={`quick-${i}`}
                    onClick={() => copyValue('quick', i, value)}
                    aria-label="Copy value"
                    className="flex min-h-[42px] w-full items-center justify-between gap-3 border-b border-[var(--surface-muted)] px-4 py-2.5 text-left transition-colors hover:bg-[var(--tint-hover)]"
                  >
                    <code className="min-w-0 flex-1 truncate text-14 text-[var(--body)]">{value}</code>
                    <span
                      className={`shrink-0 text-12 font-semibold tracking-[0.05em] ${isCopied ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'}`}
                    >
                      {isCopied ? '✓ Copied' : 'COPY'}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-[9px] bg-[var(--band)] px-4 py-[11px]">
              <span className="flex items-center gap-1">
                <span className="h-[5px] w-[26px] rounded-full" style={{ background: quickColor }} />
                <span
                  className="h-[5px] w-4 rounded-full"
                  style={{ background: quickFill >= 2 ? quickColor : 'var(--meter-off)' }}
                />
                <span
                  className="h-[5px] w-4 rounded-full"
                  style={{ background: quickFill >= 3 ? quickColor : 'var(--meter-off)' }}
                />
              </span>
              <span className="text-xs font-semibold" style={{ color: quickFg }}>
                {quickDef.badge} · {quickBits} bits
              </span>
            </div>
          </div>
        </section>

        {/* Board header */}
        <div className="mb-4 pt-1">
          <h2 className="text-xl font-bold tracking-[-0.025em]">Your generators</h2>
          <p className="mt-1 text-14 text-[var(--muted)]">
            Drag to rearrange, choose how many values each card shows — your layout is saved on this device. Press{' '}
            <kbd className="rounded border border-[var(--border-strong)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-12">R</kbd>{' '}
            to regenerate everything.
          </p>
          {/* Control bar: full-width row so the actions never wrap against the text */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div
              role="group"
              aria-label="Values per card"
              className="flex h-11 items-stretch self-start overflow-hidden rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)]"
            >
              <button
                onClick={() => changeRows(-1)}
                disabled={rows <= MIN_ROWS}
                aria-label="Show one fewer value per card"
                className="grid w-11 place-items-center text-16 text-[var(--body)] transition-colors hover:bg-[var(--band)] disabled:cursor-default disabled:text-[var(--border-strong)] disabled:hover:bg-transparent"
              >
                −
              </button>
              <span className="flex min-w-[96px] items-center justify-center border-x border-[var(--border)] px-3 text-13 font-semibold text-[var(--muted)]">
                <span className="mr-1 font-mono text-14 text-[var(--foreground)]">{rows}</span> per card
              </span>
              <button
                onClick={() => changeRows(1)}
                disabled={rows >= MAX_ROWS}
                aria-label="Show one more value per card"
                className="grid w-11 place-items-center text-16 text-[var(--body)] transition-colors hover:bg-[var(--band)] disabled:cursor-default disabled:text-[var(--border-strong)] disabled:hover:bg-transparent"
              >
                +
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 min-[440px]:grid-cols-3 sm:flex">
              <button
                onClick={handleRegenAll}
                className="btn btn-primary min-h-11"
                style={armed ? { background: 'var(--accent)' } : undefined}
              >
                {armed ? 'Replace all values?' : 'Regenerate all'}
              </button>
              <button onClick={copyAllKeys} className="btn btn-secondary min-h-11">
                Copy all keys
              </button>
              <button
                onClick={() => setAddOpen(open => !open)}
                className="btn btn-secondary min-h-11"
                aria-expanded={addOpen}
              >
                + Add generator
              </button>
            </div>
          </div>
        </div>

        {/* Add-generator panel */}
        {addOpen && (
          <div className="mb-4 rounded-[14px] border border-dashed border-[var(--border-dashed)] bg-[var(--surface)] px-[18px] py-4">
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              <input
                value={addQuery}
                onChange={e => setAddQuery(e.target.value)}
                placeholder="Search generators"
                aria-label="Search generators"
                className="min-w-[160px] flex-1 rounded-[10px] border border-[var(--border-strong)] bg-[var(--background)] px-3.5 py-2.5 text-15 text-[var(--foreground)]"
              />
              <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
                {ADD_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setAddCat(cat)}
                    aria-pressed={addCat === cat}
                    className={`min-h-9 rounded-full border px-3.5 text-14 font-semibold transition-colors ${
                      addCat === cat
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]'
                        : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--body)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hidden.map(def => (
                <button
                  key={def.id}
                  onClick={() => addModule(def.id)}
                  className="min-h-10 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-[15px] text-14 font-semibold transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  + {def.name}
                </button>
              ))}
              {hidden.length === 0 && (
                <span className="text-14 text-[var(--muted)]">
                  {hiddenAll.length === 0
                    ? "Everything's already on your board."
                    : 'No generators match your search.'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Generator board */}
        <section className="grid grid-cols-1 items-start gap-3.5 md:grid-cols-2">
          {order.map((id, index) => {
            const def = defById(id)
            const keys = keysById[id] || []
            const isDragging = dragId === id
            return (
              <div
                key={id}
                onDragOver={e => handleDragOver(e, id)}
                onDrop={e => e.preventDefault()}
                className={`overflow-hidden rounded-[14px] bg-[var(--surface)] shadow-[var(--shadow-sm)] border ${
                  isDragging ? 'border-[var(--accent)] opacity-35' : 'border-[var(--border)]'
                }`}
              >
                {/* Compact module header */}
                <div className="flex items-center gap-1.5 border-b border-[var(--hairline)] py-1.5 pl-1.5 pr-2">
                  <button
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.effectAllowed = 'move'
                      setDragId(id)
                    }}
                    onDragEnd={() => setDragId(null)}
                    onKeyDown={e => {
                      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                        e.preventDefault()
                        moveModule(id, -1)
                      }
                      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                        e.preventDefault()
                        moveModule(id, 1)
                      }
                    }}
                    aria-label={`Reorder ${def.name}. Use arrow keys to move.`}
                    className="hidden min-h-10 min-w-10 cursor-grab place-items-center rounded-lg text-sm tracking-[-1px] text-[var(--muted-foreground)] md:grid"
                  >
                    ⠿
                  </button>
                  <Link
                    href={def.href}
                    className="min-w-0 truncate pl-2.5 text-15 font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--accent-strong)] md:pl-0"
                  >
                    {def.name}
                  </Link>
                  <span
                    className={`whitespace-nowrap rounded-full px-[9px] py-0.5 text-12 font-semibold ${BADGE_STYLES[def.tone]}`}
                  >
                    {def.badge} · {Math.round(def.bits)}b
                  </span>
                  <span className="ml-auto flex shrink-0 gap-0.5">
                    <button
                      onClick={() => moveModule(id, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${def.name} up`}
                      className={`grid min-h-10 min-w-10 place-items-center rounded-lg text-sm md:hidden ${
                        index === 0 ? 'text-[var(--disabled)]' : 'text-[var(--muted)]'
                      }`}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveModule(id, 1)}
                      disabled={index === order.length - 1}
                      aria-label={`Move ${def.name} down`}
                      className={`grid min-h-10 min-w-10 place-items-center rounded-lg text-sm md:hidden ${
                        index === order.length - 1 ? 'text-[var(--disabled)]' : 'text-[var(--muted)]'
                      }`}
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => {
                        regenModules([id])
                        flash(`Regenerated ${def.name}`)
                      }}
                      aria-label={`Regenerate ${def.name}`}
                      className="grid min-h-10 min-w-10 place-items-center rounded-lg text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                    >
                      <RefreshIcon />
                    </button>
                    <button
                      onClick={() => removeModule(id)}
                      aria-label={`Remove ${def.name}`}
                      className="grid min-h-10 min-w-10 place-items-center rounded-lg text-16 text-[var(--muted)] transition-colors hover:text-[var(--link)]"
                    >
                      ×
                    </button>
                  </span>
                </div>

                {/* Values */}
                <div>
                  {keys.map((value, i) => {
                    const isCopied = copied?.id === id && copied.i === i
                    return (
                      <button
                        key={`${id}-${i}`}
                        onClick={() => copyValue(id, i, value)}
                        aria-label={`Copy ${def.name} value`}
                        className="flex min-h-[42px] w-full items-center justify-between gap-3 border-b border-[var(--surface-muted)] px-4 py-2.5 text-left transition-colors last:border-0 hover:bg-[var(--tint-hover)]"
                      >
                        <code className="min-w-0 flex-1 truncate text-14 text-[var(--body)]">{value}</code>
                        <span
                          className={`shrink-0 text-12 font-semibold tracking-[0.05em] ${
                            isCopied ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                          }`}
                        >
                          {isCopied ? '✓ Copied' : 'COPY'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>

        {/* Browse all generators */}
        <section className="mt-12 border-t border-[var(--border)] pt-10">
          <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-[-0.025em]">Browse all 50+ generators</h2>
              <p className="mt-1 text-14 text-[var(--muted)]">Every tool has its own page with options, examples, and security guidance.</p>
            </div>
            <Link href="/keygen-hub" className="text-14 font-semibold text-[var(--link)] hover:underline">View complete directory →</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-7 md:grid-cols-4">
            {GENERATOR_DIRECTORY.map(group => (
              <div key={group.title}>
                <h3 className="section-label mb-3">{group.title}</h3>
                <div className="flex flex-col gap-2">
                  {group.links.map(([href, label]) => (
                    <Link key={href} href={href} className="text-14 text-[var(--muted)] transition-colors hover:text-[var(--link)]">{label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Keep them safe */}
        <section className="mt-12 border-t border-[var(--border)] pt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-[-0.025em]">Keep them safe</h2>
            <Link href="/guides" className="text-14 font-semibold text-[var(--link)] hover:underline">All security guides →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/guides/choosing-a-password-manager" className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--border-strong)]">
              <span className="eyebrow">Guide</span>
              <h3 className="mt-3 text-16 font-semibold">Choose a password manager</h3>
              <p className="mt-2 text-14 leading-5 text-[var(--muted)]">A strong password only helps when it stays unique. Choose a safe place for the values you generate here.</p>
            </Link>
            <Link href="/guides/api-key-best-practices" className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--border-strong)]">
              <span className="eyebrow">Guide</span>
              <h3 className="mt-3 text-16 font-semibold">API key best practices</h3>
              <p className="mt-2 text-14 leading-5 text-[var(--muted)]">Rotation, scoping, and storage—what to do with a key after you copy it out of this page.</p>
            </Link>
            <Link href="/guides/how-randomkeygen-works" className="rounded-[14px] bg-[#1c1917] p-5 text-[#faf9f7] shadow-[inset_0_0_0_1px_var(--elevated-outline)]">
              <span className="text-13 font-bold uppercase tracking-[0.08em] text-[#ff8a4d]">CLI</span>
              <h3 className="mt-3 text-16 font-semibold">Prefer the terminal?</h3>
              <p className="mt-2 break-all font-mono text-13 leading-[1.7] text-[#c7c2bd]">
                <span className="text-[#ff8a4d]">$</span>
                {" openssl rand -base64 12 | tr -dc 'a-zA-Z0-9!@#$%^&*' | head -c 16"}
              </p>
              <p className="mt-2.5 text-14 font-semibold text-[#ff8a4d]">Every generator&apos;s CLI equivalent →</p>
            </Link>
          </div>
        </section>

        {/* Popular generators */}
        <section className="mt-12 border-t border-[var(--border)] pt-10">
          <h2 className="mb-[18px] text-xl font-bold tracking-[-0.025em]">Popular generators</h2>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            {POPULAR_GENERATORS.map(([href, name, description]) => (
              <Link key={href} href={href} className="card-link">
                <span className="card-title">{name}</span>
                <span className="card-desc mt-0.5">{description}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* How browser-based generation works */}
        <section className="mt-12 border-t border-[var(--border)] pt-10">
          <h2 className="text-xl font-bold tracking-[-0.025em]">How browser-based generation works</h2>
          <div className="mt-3.5 max-w-[74ch] text-sm leading-7 text-[var(--body)]">
            <p>
              Every value on this page is produced by the Web Crypto API —{' '}
              <code className="rounded-md bg-[var(--tint-neutral)] px-[7px] py-0.5 text-14">crypto.getRandomValues()</code>{' '}
              — a cryptographically secure random number generator built into your browser. Generation happens on your device: open your network tab and regenerate to verify that nothing is transmitted.
            </p>
            <p className="mt-2.5">
              RandomKeygen creates passwords, passphrases, API credentials, identifiers like UUIDs, and encryption keys. After you copy a secret, store it somewhere safe — a password manager for personal credentials, a secrets manager for production keys — and rotate anything that may have been exposed.
            </p>
          </div>
        </section>

        {/* Why RandomKeygen / What this site doesn't replace */}
        <section className="mt-12 grid gap-8 border-t border-[var(--border)] pt-10 md:grid-cols-2 md:gap-x-12">
          <div>
            <h2 className="mb-4 text-xl font-bold tracking-[-0.025em]">Why RandomKeygen</h2>
            <div className="flex flex-col gap-2.5 text-15 text-[var(--body)]">
              <div className="flex gap-2.5"><span className="font-bold text-[var(--accent)]">✓</span>100% client-side — generated values are never transmitted</div>
              <div className="flex gap-2.5"><span className="font-bold text-[var(--accent)]">✓</span>No signup, no premium tier, no generated-value history</div>
              <div className="flex gap-2.5"><span className="font-bold text-[var(--accent)]">✓</span>50+ specialized generators for passwords, credentials and keys</div>
              <div className="flex gap-2.5"><span className="font-bold text-[var(--accent)]">✓</span>Your board layout stays on this device</div>
            </div>
          </div>
          <div>
            <p className="mb-4 text-15 font-semibold md:pt-[9px]">What this site doesn&apos;t replace</p>
            <div className="flex flex-col gap-2.5 text-15 text-[var(--muted)]">
              <div>A password manager for saving credentials</div>
              <div>Encrypted vault storage and device sync</div>
              <div>Secret rotation or access management</div>
              <div>Account recovery or emergency access</div>
              <div>Automatic login and form filling</div>
              <div className="pt-1.5 text-[var(--body)]">Copy only what you need, store production credentials in a secrets manager, and rotate anything exposed.</div>
            </div>
          </div>
        </section>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-7 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3.5 whitespace-nowrap rounded-full bg-[#1c1917] px-[22px] py-3 text-14 font-medium text-white shadow-[inset_0_0_0_1px_var(--elevated-outline),0_6px_20px_rgba(28,25,23,0.25)]"
        >
          <span>{toast.msg}</span>
          {toast.undo && (
            <button
              onClick={toast.undo}
              className="px-0.5 py-1 text-14 font-bold text-[#5eead4]"
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function RefreshIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}
