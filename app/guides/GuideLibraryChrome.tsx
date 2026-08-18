'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DetailSubnav } from '@/app/components/DetailSubnav'
import { GuideProgress } from '@/app/components/guide/GuideProgress'

import { GUIDE_META, GUIDE_ORDER } from './guide-meta'

interface TocItem {
  id: string
  label: string
}

/** Sections whose h2s are navigation/CTA furniture, not article content. */
const TOC_EXCLUDED =
  '.guide-related, .guide-pagination, .guide-toc-cta, section[aria-label="Related tools"]'

export function GuideLibraryChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const contentRef = useRef<HTMLDivElement>(null)
  const [toc, setToc] = useState<TocItem[]>([])
  const slug = pathname.split('/').filter(Boolean)[1]
  const meta = slug ? GUIDE_META[slug] : undefined

  useEffect(() => {
    if (!meta || !contentRef.current) {
      setToc([])
      return
    }

    const headings = Array.from(contentRef.current.querySelectorAll<HTMLHeadingElement>('h2'))
      .filter((heading) => heading.textContent?.trim())
      .filter((heading) => !heading.closest(TOC_EXCLUDED))
      .slice(0, 12)

    setToc(headings.map((heading, index) => {
      if (!heading.id) heading.id = `guide-section-${index + 1}`
      const label = (heading.textContent ?? '').trim().replace(/^[^\w]*/, '').trim()
      return { id: heading.id, label: label || `Section ${index + 1}` }
    }))
  }, [meta, pathname])

  if (!meta) return children

  const orderIndex = slug ? GUIDE_ORDER.indexOf(slug) : -1
  const prevSlug = orderIndex > 0 ? GUIDE_ORDER[orderIndex - 1] : undefined
  const nextSlug = orderIndex >= 0 && orderIndex < GUIDE_ORDER.length - 1 ? GUIDE_ORDER[orderIndex + 1] : undefined
  const prev = prevSlug ? GUIDE_META[prevSlug] : undefined
  const next = nextSlug ? GUIDE_META[nextSlug] : undefined

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides' },
    { name: meta.title, url: pathname },
  ]

  return (
    <>
      <GuideProgress />
      <DetailSubnav items={breadcrumbItems} trailing={meta.readTime} />

      <div className="page-container guide-library-frame">
        <div ref={contentRef} className="guide-library-content">
          {children}
          {(prev || next) && (
            <nav className="guide-pagination" aria-label="Guide pagination">
              {prev && prevSlug ? (
                <Link href={`/guides/${prevSlug}`}>
                  <small>← Previous guide</small>
                  <strong>{prev.title}</strong>
                </Link>
              ) : <span aria-hidden="true" />}
              {next && nextSlug ? (
                <Link href={`/guides/${nextSlug}`}>
                  <small>Next guide →</small>
                  <strong>{next.title}</strong>
                </Link>
              ) : <span aria-hidden="true" />}
            </nav>
          )}
        </div>
        <aside className="guide-toc guide-library-toc" aria-label="On this page">
          <p>On this page</p>
          <nav>
            {toc.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
          </nav>
          <div className="guide-toc-cta">
            <strong>Need a secure key?</strong>
            <span>Generate one locally in your browser. Nothing is transmitted.</span>
            <Link href="/keygen-hub">Explore generators →</Link>
          </div>
        </aside>
      </div>
    </>
  )
}
