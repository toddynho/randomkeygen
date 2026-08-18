import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DetailSubnav } from './DetailSubnav'
import { getCategory } from '../lib/tool-directory'

export function CategoryIndexPage({ slug }: { slug: string }) {
  const category = getCategory(slug)
  if (!category) notFound()

  return (
    <>
      <DetailSubnav
        items={[
          { name: 'Home', url: '/' },
          { name: category.title, url: category.href },
        ]}
      />
      <div className="page-container pb-12">
        <section className="pt-8 pb-2">
          <div className="eyebrow mb-2.5 text-12 tracking-[0.1em]">Free · Private · Client-side</div>
          <h1 className="mb-2.5 text-2xl font-bold tracking-[-0.01em] sm:text-31">{category.title}</h1>
          <p className="max-w-[68ch] text-16 leading-relaxed text-[var(--muted)]">{category.description}</p>
        </section>
        {category.sections.map((section) => (
          <section key={section.title} className="pt-8">
            <h2 className="section-label mb-4 text-13 text-[var(--muted)]">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {section.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="card-link"
                >
                  <span className="card-title mb-0.5">{tool.name}</span>
                  <span className="card-desc">{tool.blurb}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
