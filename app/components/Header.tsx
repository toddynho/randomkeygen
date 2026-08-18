'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { categoryHrefs } from '../lib/tool-directory'

type ThemeSetting = 'light' | 'dark' | 'system'

const THEME_KEY = 'rkg-theme'
const THEME_LABEL: Record<ThemeSetting, string> = {
  light: 'Theme: light. Switch to dark theme.',
  dark: 'Theme: dark. Switch to system theme.',
  system: 'Theme: system. Switch to light theme.',
}

function applyTheme(theme: ThemeSetting) {
  const root = document.documentElement
  try {
    if (theme === 'system') {
      root.removeAttribute('data-theme')
      localStorage.removeItem(THEME_KEY)
    } else {
      root.setAttribute('data-theme', theme)
      localStorage.setItem(THEME_KEY, theme)
    }
  } catch {
    // Ignore storage failures (private mode, quota).
  }
}

function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeSetting>('system')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'light' || stored === 'dark') setTheme(stored)
    } catch {
      // Ignore storage failures.
    }
  }, [])

  const cycle = () => {
    const next: ThemeSetting = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(next)
    applyTheme(next)
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={THEME_LABEL[theme]}
      title={`Theme: ${theme}`}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
    >
      {theme === 'light' && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.25" />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
        </svg>
      )}
      {theme === 'dark' && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
      {theme === 'system' && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2.5" y="4" width="19" height="13" rx="2" />
          <path d="M9 20.5h6M12 17v3.5" />
        </svg>
      )}
    </button>
  )
}

const NAV_ITEMS = [
  { href: '/passwords', label: 'Passwords', matches: categoryHrefs('passwords') },
  { href: '/developer', label: 'Developer', matches: [...categoryHrefs('developer'), '/keygen-hub'] },
  { href: '/encryption', label: 'Encryption', matches: categoryHrefs('encryption') },
  { href: '/guides', label: 'Guides', matches: ['/guides'] },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="relative z-40 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="page-container">
        <div className="flex h-[65px] items-center justify-between gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center text-17 font-bold tracking-[-0.02em] transition-opacity hover:opacity-75"
          >
            RandomKeygen
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.matches.some((route) => pathname === route || pathname.startsWith(`${route}/`)) ? 'page' : undefined}
                className={`border-b-2 py-2 text-15 font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)] ${
                  item.matches.some((route) => pathname === route || pathname.startsWith(`${route}/`))
                    ? 'border-[var(--accent)] text-[var(--foreground)]'
                    : 'border-transparent text-[var(--muted)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href="https://github.com/toddynho/randomkeygen"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star RandomKeygen on GitHub"
              title="Star RandomKeygen on GitHub"
              className="hidden h-8 items-center gap-1.5 rounded-[9px] border border-[var(--border-strong)] bg-[var(--surface)] px-2.5 text-xs font-semibold text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] lg:inline-flex"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m12 2.75 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 16.94l-5.56 2.93 1.06-6.2L3 9.28l6.22-.9L12 2.75Z" />
              </svg>
              Star
            </a>

            <Link
              href="/guides/how-randomkeygen-works"
              className="hidden items-center gap-2 text-xs font-semibold text-[var(--accent-strong)] transition-colors hover:text-[var(--accent)] sm:flex"
              title="How local generation works"
            >
              <span className="h-[7px] w-[7px] rounded-full bg-[var(--success)]" />
              Local-only
            </Link>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid min-h-11 min-w-11 place-items-center rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? '×' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="mb-3 overflow-hidden card md:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={item.matches.some((route) => pathname === route || pathname.startsWith(`${route}/`)) ? 'page' : undefined}
                className={`block border-b border-[var(--border)] px-[18px] py-3.5 text-16 font-semibold last:border-0 ${
                  item.matches.some((route) => pathname === route || pathname.startsWith(`${route}/`))
                    ? 'bg-[var(--accent-soft)] text-[var(--accent-strong)]'
                    : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/guides/how-randomkeygen-works"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 border-t border-[var(--border)] px-[18px] py-3.5 text-xs font-semibold text-[var(--accent-strong)]"
            >
              <span className="h-[7px] w-[7px] rounded-full bg-[var(--success)]" />
              Local-only · generated values stay on this device
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
