'use client'

import Link from 'next/link'
import type { RelatedContentProps } from './related-content-data'

export type { RelatedContentProps, RelatedTool, RelatedGuide } from './related-content-data'
export {
  passwordRelated,
  encryptionRelated,
  developerRelated,
  popularGenerators,
} from './related-content-data'

export function RelatedContent({ tools, guides, tips }: RelatedContentProps) {
  return (
    <aside className="mt-12 pt-8 border-t border-[var(--border)]">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Related Tools */}
        {tools && tools.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
              Related Tools
            </h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="block p-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
                  >
                    <div className="font-medium text-sm">{tool.label}</div>
                    <div className="text-xs text-[var(--muted)]">{tool.description}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Security Tips */}
        {tips && tips.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
              Security Tips
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[var(--accent)]">*</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Guides */}
        {guides && guides.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
              Learn More
            </h3>
            <ul className="space-y-2">
              {guides.map((guide) => (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1"
                  >
                    {guide.title}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </aside>
  )
}
