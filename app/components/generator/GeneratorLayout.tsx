import { ReactNode } from 'react'
import Link from 'next/link'
import { DetailSubnav } from '../DetailSubnav'
import { HowToSteps, HowToStep } from './HowToSteps'

interface GeneratorLayoutProps {
  title: string
  description: string
  children: ReactNode
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, unknown>[]
  /** Optional 3-step "How to use" cards, rendered below children. */
  howToSteps?: HowToStep[]
  howToHeading?: string
  /** Optional storage-advice callout (e.g. <PasswordManagerNextStep />), rendered last. */
  storageCallout?: ReactNode
}

export function GeneratorLayout({
  title,
  description,
  children,
  breadcrumbItems,
  schema = [],
  howToSteps,
  howToHeading,
  storageCallout,
}: GeneratorLayoutProps) {
  return (
    <>
      {schema.map((schemaItem, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItem) }}
        />
      ))}
      <DetailSubnav items={breadcrumbItems} />

      <div className="page-container tool-shell pb-12">
        <section className="tool-title-card">
          <p className="eyebrow mb-2.5">Free · Private · Client-side</p>
          <h1 className="mb-2.5 max-w-4xl text-2xl font-bold leading-[1.15] tracking-[-0.01em] md:text-31">
            {title}
          </h1>
          <p className="mb-3 max-w-[68ch] text-16 leading-[1.6] text-[var(--muted)]">
            {description}
          </p>
          <Link
            href="/guides/how-randomkeygen-works"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-[13px] py-[5px] text-14 font-semibold text-[var(--accent-strong)] transition-colors hover:border-[var(--accent)]"
          >
            <span className="h-[7px] w-[7px] rounded-full bg-[var(--success)]" />
            Generated values never leave this device.
          </Link>
        </section>

        <div className="pt-6">{children}</div>

        {howToSteps && howToSteps.length > 0 && <HowToSteps steps={howToSteps} heading={howToHeading} />}

        {storageCallout && <div className="mt-6">{storageCallout}</div>}
      </div>
    </>
  )
}
