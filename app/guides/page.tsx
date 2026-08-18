import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDE_META, GUIDE_ORDER } from './guide-meta'

export const metadata: Metadata = {
  title: 'Security Guides - Password & Encryption Best Practices | RandomKeygen',
  description: 'Learn about password security, encryption, API key management, and more. Expert guides to help you protect your accounts and data.',
  keywords: ['password security guide', 'encryption guide', 'cybersecurity best practices', 'password manager guide', 'api key security'],
  openGraph: {
    title: 'Security Guides - Password & Encryption Best Practices',
    description: 'Learn about password security, encryption, API key management, and more.',
    url: 'https://randomkeygen.com/guides',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides',
  },
}

const CATEGORY_ORDER = ['Security & privacy', 'Passwords', 'Developer security', 'Encryption']

export default function GuidesPage() {
  const slugs = [
    ...GUIDE_ORDER.filter((slug) => GUIDE_META[slug]),
    ...Object.keys(GUIDE_META).filter((slug) => !GUIDE_ORDER.includes(slug)),
  ]

  const byCategory = CATEGORY_ORDER.map((category) => ({
    category,
    slugs: slugs.filter((slug) => GUIDE_META[slug].category === category),
  })).filter((group) => group.slugs.length > 0)

  return (
    <div className="page-container pb-12">
      <section className="pt-8 pb-2">
        <div className="eyebrow mb-2.5 text-12 tracking-[0.1em]">Guides</div>
        <h1 className="mb-2.5 text-2xl font-bold tracking-[-0.01em] sm:text-31">Security Guides</h1>
        <p className="max-w-[68ch] text-16 leading-relaxed text-[var(--muted)]">
          Best practices for the passwords, keys, and credentials you generate here — how to store them, rotate them,
          and avoid the mistakes that get accounts compromised.
        </p>
      </section>
      {byCategory.map((group) => (
        <section key={group.category} className="pt-8">
          <h2 className="section-label mb-4 text-13 text-[var(--muted)]">
            {group.category}
          </h2>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {group.slugs.map((slug) => {
              const guide = GUIDE_META[slug]
              return (
                <Link
                  key={slug}
                  href={`/guides/${slug}`}
                  className="block card p-[22px] shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--border-strong)]"
                >
                  <span className="mb-2.5 block text-13 font-bold uppercase tracking-[0.08em] text-[var(--accent-strong)]">
                    Guide
                  </span>
                  <span className="mb-1.5 block text-16 font-semibold leading-snug text-[var(--foreground)]">
                    {guide.title}
                  </span>
                  <span className="mb-2.5 block text-14 leading-[1.55] text-[var(--muted)]">{guide.deck}</span>
                  <span className="block text-xs text-[var(--muted-foreground)]">{guide.readTime}</span>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
