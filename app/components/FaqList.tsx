interface FaqItem {
  q: string
  a: string
}

export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="mb-2 flex cursor-pointer items-center gap-2 font-medium text-[var(--foreground)]">
            <span aria-hidden="true" className="text-[var(--muted)] transition-transform group-open:rotate-90">▶</span>
            {item.q}
          </summary>
          <p className="ml-6 text-sm leading-6 text-[var(--muted)]">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
