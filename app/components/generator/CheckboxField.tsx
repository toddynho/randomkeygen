'use client'

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

export function CheckboxField({ 
  label, 
  checked, 
  onChange, 
  description 
}: CheckboxFieldProps) {
  return (
    <label className="flex min-h-[38px] cursor-pointer items-center gap-2.5">
      <input 
        type="checkbox" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-[18px] w-[18px] rounded-md border-[var(--border-strong)] accent-[var(--accent)]"
      />
      <span className="text-sm">{label}</span>
      {description && <span className="text-xs text-[var(--muted)]">({description})</span>}
    </label>
  )
}
