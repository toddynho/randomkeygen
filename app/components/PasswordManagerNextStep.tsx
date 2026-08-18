import Link from 'next/link'

interface PasswordManagerNextStepProps {
  title?: string
  description?: string
}

export function PasswordManagerNextStep({
  title = 'Generated it? Store it safely.',
  description = 'A strong password only helps when it stays unique. Save it in a password manager instead of reusing it, emailing it, or leaving it in an unencrypted note.',
}: PasswordManagerNextStepProps) {
  return (
    <aside className="mb-8 flex flex-col gap-4 card p-5 md:flex-row md:items-center md:justify-between">
      <div className="max-w-2xl">
        <h2 className="mb-1 text-16 font-semibold">{title}</h2>
        <p className="text-14 leading-5 text-[var(--muted)]">{description}</p>
      </div>
      <div className="flex shrink-0 flex-col gap-1.5 text-14 font-semibold">
        <Link href="/guides/choosing-a-password-manager" className="text-[var(--accent)] hover:underline">
          Choosing a password manager →
        </Link>
        <Link href="/guides/password-manager-vs-browser" className="text-[var(--accent)] hover:underline">
          Browser vs dedicated manager →
        </Link>
        <Link href="/guides/password-security-best-practices" className="text-[var(--accent)] hover:underline">
          Password security best practices →
        </Link>
      </div>
    </aside>
  )
}
