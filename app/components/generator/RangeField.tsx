'use client'

import { useId } from 'react'

interface RangeFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
}

export function RangeField({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1 
}: RangeFieldProps) {
  const id = useId()

  return (
    <div>
      <label className="form-label flex items-center justify-between" htmlFor={id}>
        {label}
        <input
          aria-label={`${label} numeric value`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="form-input !w-[66px] bg-[var(--background)] text-center font-mono"
        />
      </label>
      <div className="flex items-center gap-3 pt-1">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="min-h-7 flex-1"
        />
      </div>
      <div className="mt-1 flex justify-between text-12 text-[var(--muted-foreground)]">
        <span>{min}</span><span>{Math.round((min + max) / 2)}</span><span>{max}</span>
      </div>
    </div>
  )
}
