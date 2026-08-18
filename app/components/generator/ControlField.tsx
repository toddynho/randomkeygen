'use client'

import { ReactNode } from 'react'

interface SelectOption {
  value: string | number
  label: string
}

interface ControlFieldProps {
  label: string
  htmlFor?: string
  type?: 'select'
  value?: string | number
  onChange?: (value: string | number) => void
  options?: SelectOption[]
  children?: ReactNode
}

export function ControlField({ 
  label, 
  htmlFor,
  type, 
  value, 
  onChange, 
  options,
  children 
}: ControlFieldProps) {
  // If type is select, render select dropdown
  if (type === 'select' && options && onChange && value !== undefined) {
    return (
      <div>
        <label className="form-label" htmlFor={htmlFor}>{label}</label>
        <select 
          id={htmlFor}
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="form-select"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  // Otherwise render as a generic container for custom inputs
  return (
    <div>
      <label className="form-label" htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  )
}