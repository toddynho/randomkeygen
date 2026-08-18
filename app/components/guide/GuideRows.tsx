/**
 * Bordered white reference card: hairline-divided rows with a mono term
 * column and a description (styling in the .guide-rows rules in globals.css).
 */
export function GuideRows({ items, compact = false }: { items: Array<[string, string]>; compact?: boolean }) {
  return (
    <div className={`guide-rows${compact ? ' guide-rows-compact' : ''}`}>
      {items.map(([term, detail]) => (
        <div className="guide-row" key={term}>
          <code>{term}</code>
          <span>{detail}</span>
        </div>
      ))}
    </div>
  )
}
