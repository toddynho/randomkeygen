'use client'

import { useState } from 'react'
import { CodeBlock, SecurityNotice } from '../components'

/** JWT Expiration Calculator — expiry presets, previews in multiple formats, sample payload. */
export function JwtExpiryCalculator() {
  const [expiryHours, setExpiryHours] = useState(24)
  const [customExpiry, setCustomExpiry] = useState('')

  const now = Date.now()
  const expiryTime = customExpiry ? new Date(customExpiry).getTime() : now + expiryHours * 60 * 60 * 1000
  const expiryDate = new Date(expiryTime)
  const unixTimestamp = Math.floor(expiryTime / 1000)

  return (
    <section className="mb-8">
      <h2 className="mb-2 text-20 font-bold tracking-[-0.01em]">JWT Expiration Calculator</h2>
      <p className="mb-5 text-15 leading-[1.6] text-[var(--muted)]">
        Calculate precise expiration times for your JWT tokens with various time formats and validation.
      </p>

      <div className="card p-6 shadow-[var(--shadow-sm)]">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Expiration Settings */}
          <div className="space-y-4">
            <h3 className="text-16 font-semibold">Expiration Settings</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Hours from now</label>
                <input
                  type="number"
                  value={expiryHours}
                  onChange={(e) => setExpiryHours(parseInt(e.target.value) || 0)}
                  className="form-input w-full text-sm"
                  placeholder="24"
                  min="0"
                  max="8760"
                />
              </div>
              <div>
                <label className="form-label">Custom date/time</label>
                <input
                  type="datetime-local"
                  value={customExpiry}
                  onChange={(e) => setCustomExpiry(e.target.value)}
                  className="form-input w-full text-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-15 font-semibold">Quick Presets</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '15 min', hours: 0.25 },
                  { label: '1 hour', hours: 1 },
                  { label: '24 hours', hours: 24 },
                  { label: '7 days', hours: 168 },
                  { label: '30 days', hours: 720 },
                  { label: '1 year', hours: 8760 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setExpiryHours(preset.hours)}
                    className="min-h-10 rounded-[9px] border border-[var(--border-strong)] bg-[var(--background)] px-3 text-14 font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expiration Preview */}
          <div>
            <h3 className="mb-4 text-16 font-semibold">Expiration Preview</h3>
            <div className="space-y-3">
              <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3">
                <div className="mb-1 text-sm font-medium text-[var(--muted)]">Unix Timestamp (exp claim)</div>
                <div className="font-mono text-lg">{unixTimestamp}</div>
              </div>

              <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3">
                <div className="mb-1 text-sm font-medium text-[var(--muted)]">Human Readable</div>
                <div className="font-mono">{expiryDate.toLocaleString()}</div>
              </div>

              <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3">
                <div className="mb-1 text-sm font-medium text-[var(--muted)]">ISO 8601</div>
                <div className="font-mono text-sm">{expiryDate.toISOString()}</div>
              </div>

              <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3">
                <div className="mb-1 text-sm font-medium text-[var(--muted)]">Time Until Expiry</div>
                <div className="font-mono">
                  {expiryTime > now
                    ? `${Math.floor((expiryTime - now) / (1000 * 60 * 60 * 24))}d ${Math.floor(((expiryTime - now) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h ${Math.floor(((expiryTime - now) % (1000 * 60 * 60)) / (1000 * 60))}m`
                    : 'EXPIRED'}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="form-label">JWT Payload with Expiration</label>
              <CodeBlock
                language="json"
                code={JSON.stringify(
                  {
                    sub: '1234567890',
                    name: 'John Doe',
                    iat: Math.floor(Date.now() / 1000),
                    exp: unixTimestamp,
                  },
                  null,
                  2,
                )}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <SecurityNotice type="warning" title="Expiration Best Practices">
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>
                <strong>Short-lived tokens:</strong> Use 15-30 minutes for sensitive operations
              </li>
              <li>
                <strong>Session tokens:</strong> 1-24 hours for user sessions
              </li>
              <li>
                <strong>API tokens:</strong> Consider 1-7 days for automated systems
              </li>
              <li>
                <strong>Refresh strategy:</strong> Implement token refresh for better UX
              </li>
              <li>
                <strong>Clock skew:</strong> Account for time differences between servers
              </li>
            </ul>
          </SecurityNotice>
        </div>
      </div>
    </section>
  )
}
