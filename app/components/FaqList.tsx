import Link from 'next/link'

interface FaqLink {
  text: string
  href: string
}

interface FaqItem {
  q: string
  a: string
  links?: readonly FaqLink[]
}

function renderAnswer(answer: string, links?: readonly FaqLink[]) {
  if (!links || links.length === 0) return answer
  const [link, ...rest] = links
  const index = answer.indexOf(link.text)
  if (index === -1) return renderAnswer(answer, rest)
  return (
    <>
      {answer.slice(0, index)}
      <Link href={link.href} className="font-semibold text-[var(--accent)] hover:underline">
        {link.text}
      </Link>
      {renderAnswer(answer.slice(index + link.text.length), rest)}
    </>
  )
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
          <p className="ml-6 text-sm leading-6 text-[var(--muted)]">{renderAnswer(item.a, item.links)}</p>
        </details>
      ))}
    </div>
  )
}
