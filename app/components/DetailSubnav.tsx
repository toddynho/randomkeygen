import Link from 'next/link'
import { BreadcrumbSchema } from './BreadcrumbSchema'

interface DetailSubnavProps {
  items: Array<{ name: string; url: string }>
  trailing?: string
}

export function DetailSubnav({ items, trailing }: DetailSubnavProps) {
  return (
    <div className="detail-subnav">
      <BreadcrumbSchema items={items} />
      <div className="page-container flex min-h-11 items-center justify-between gap-4">
        <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-2.5 text-14 text-[var(--muted)]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <span key={`${item.url}-${item.name}`} className="flex min-w-0 items-center gap-2.5">
                {index > 0 && <span aria-hidden="true" className="text-12 text-[var(--separator)]">/</span>}
                {isLast ? (
                  <span className="truncate font-semibold text-[var(--foreground)]">{item.name}</span>
                ) : (
                  <Link href={item.url} className="whitespace-nowrap transition-colors hover:text-[var(--accent-strong)]">
                    {item.name}
                  </Link>
                )}
              </span>
            )
          })}
        </nav>
        {trailing && <span className="shrink-0 text-13 text-[var(--muted-foreground)]">{trailing}</span>}
      </div>
    </div>
  )
}
