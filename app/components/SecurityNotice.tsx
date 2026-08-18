interface SecurityNoticeProps {
  type: 'info' | 'warning' | 'danger'
  title?: string
  children: React.ReactNode
}

export function SecurityNotice({ type, title, children }: SecurityNoticeProps) {
  return (
    <div className={`security-notice ${type}`}>
      <div className="flex-shrink-0 mt-0.5">
        {type === 'info' && <InfoIcon />}
        {type === 'warning' && <WarningIcon />}
        {type === 'danger' && <DangerIcon />}
      </div>
      <div>
        {title && <p className="font-medium mb-1">{title}</p>}
        <div className="text-[var(--muted)]">{children}</div>
      </div>
    </div>
  )
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg className="w-5 h-5 text-[var(--warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

function DangerIcon() {
  return (
    <svg className="w-5 h-5 text-[var(--destructive)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
