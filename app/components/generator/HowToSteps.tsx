export interface HowToStep {
  title: string
  body: string
}

interface HowToStepsProps {
  steps: HowToStep[]
  heading?: string
}

export function HowToSteps({ steps, heading = 'How to use this generator' }: HowToStepsProps) {
  return (
    <section className="mt-11 border-t border-[var(--border)] pb-2 pt-10">
      <h2 className="mb-[18px] text-20 font-bold tracking-[-0.01em]">{heading}</h2>
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="card p-5">
            <div className="mb-2 font-mono text-xs text-[var(--accent-strong)]">{String(index + 1).padStart(2, '0')}</div>
            <div className="mb-[5px] text-16 font-semibold">{step.title}</div>
            <div className="text-14 leading-[1.55] text-[var(--muted)]">{step.body}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
