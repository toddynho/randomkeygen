'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

const PALETTE_KEY = 'rkg-palette'

const PALETTES = [
  {
    id: 'randomkeygen',
    name: 'RandomKeygen',
    colors: ['#047857', '#c2410c', '#faf9f7', '#1c1917'],
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    colors: ['#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8'],
  },
  {
    id: 'forest-walk',
    name: 'Forest Walk',
    colors: ['#2D5016', '#588157', '#A3B18A', '#DAD7CD'],
  },
  {
    id: 'berry-smoothie',
    name: 'Berry Smoothie',
    colors: ['#7B2869', '#A62349', '#DB4A6B', '#F3C5C5'],
  },
  {
    id: 'lavender-fields',
    name: 'Lavender Fields',
    colors: ['#E0AAFF', '#C77DFF', '#9D4EDD', '#7B2CBF'],
  },
  {
    id: 'midnight-sky',
    name: 'Midnight Sky',
    colors: ['#0D1B2A', '#1B263B', '#415A77', '#778DA9'],
  },
] as const

type PaletteId = (typeof PALETTES)[number]['id']

const VALID_PALETTES = new Set<PaletteId>(PALETTES.map((palette) => palette.id))

function isPaletteId(value: string | null): value is PaletteId {
  return value !== null && VALID_PALETTES.has(value as PaletteId)
}

function previewStyle(colors: readonly string[]): CSSProperties {
  return {
    background: `conic-gradient(${colors[0]} 0 25%, ${colors[1]} 25% 50%, ${colors[2]} 50% 75%, ${colors[3]} 75% 100%)`,
  }
}

function applyPalette(palette: PaletteId) {
  const root = document.documentElement

  try {
    if (palette === 'randomkeygen') {
      root.removeAttribute('data-palette')
      localStorage.removeItem(PALETTE_KEY)
    } else {
      root.setAttribute('data-palette', palette)
      localStorage.setItem(PALETTE_KEY, palette)
    }
  } catch {
    // The visual change still works when storage is unavailable.
    if (palette === 'randomkeygen') root.removeAttribute('data-palette')
    else root.setAttribute('data-palette', palette)
  }
}

export function PalettePicker() {
  const [palette, setPalette] = useState<PaletteId>('randomkeygen')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const current = PALETTES.find((option) => option.id === palette) ?? PALETTES[0]

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PALETTE_KEY)
      if (isPaletteId(stored)) setPalette(stored)
    } catch {
      // Ignore storage failures.
    }
  }, [])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const choosePalette = (next: PaletteId) => {
    setPalette(next)
    applyPalette(next)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Color theme: ${current.name}. Open palette picker.`}
        aria-expanded={open}
        aria-controls="site-palette-picker"
        title={`Color theme: ${current.name}`}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform hover:scale-105 focus-visible:outline-offset-2"
      >
        <span
          aria-hidden="true"
          className="h-[18px] w-[18px] rounded-full border-2 border-[var(--surface)] shadow-[0_0_0_1px_var(--border-strong)]"
          style={previewStyle(current.colors)}
        />
      </button>

      {open && (
        <div
          id="site-palette-picker"
          role="dialog"
          aria-label="Choose a website color theme"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[320px] max-w-[calc(100vw-2rem)] rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)]"
        >
          <div className="mb-3 flex items-start justify-between gap-4 px-1 pt-0.5">
            <div>
              <div className="text-13 font-semibold text-[var(--foreground)]">Color theme</div>
              <div className="mt-0.5 text-11 text-[var(--muted)]">Applied across this device</div>
            </div>
            <a
              href="https://colors.to/palettes?utm_source=randomkeygen&utm_medium=referral&utm_campaign=theme_picker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-11 font-semibold text-[var(--accent-strong)] hover:underline"
            >
              Powered by colors.to ↗
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PALETTES.map((option) => {
              const selected = option.id === palette
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => choosePalette(option.id)}
                  aria-pressed={selected}
                  className={`min-w-0 rounded-[10px] border p-2 text-left transition-colors ${
                    selected
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                      : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <span className="mb-2 flex h-5 overflow-hidden rounded-[6px]" aria-hidden="true">
                    {option.colors.map((color) => (
                      <span key={color} className="flex-1" style={{ backgroundColor: color }} />
                    ))}
                  </span>
                  <span className="flex items-center justify-between gap-2 text-11 font-semibold text-[var(--foreground)]">
                    <span className="truncate">{option.name}</span>
                    {selected && <span className="text-[var(--accent-strong)]" aria-hidden="true">✓</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
