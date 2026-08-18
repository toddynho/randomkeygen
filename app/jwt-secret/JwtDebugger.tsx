'use client'

import { DecodedJwt } from './jwt-utils'

interface JwtDebuggerProps {
  jwtInput: string
  decodedJWT: DecodedJwt | null
  onDecode: (token: string) => void
}

/** JWT Debugger & Validator — structure checks and security-issue analysis. */
export function JwtDebugger({ jwtInput, decodedJWT, onDecode }: JwtDebuggerProps) {
  const issues: string[] = []
  const warnings: string[] = []

  if (decodedJWT) {
    if (decodedJWT.header.alg === 'none') {
      issues.push('Unsigned token (none algorithm)')
    }
    if (!decodedJWT.payload.exp) {
      warnings.push('No expiration time set')
    }
    if (decodedJWT.payload.exp && decodedJWT.payload.exp * 1000 < Date.now()) {
      issues.push('Token is expired')
    }
    if (!decodedJWT.payload.iat) {
      warnings.push('No issued-at time')
    }
    if (
      decodedJWT.payload.exp &&
      decodedJWT.payload.iat &&
      decodedJWT.payload.exp - decodedJWT.payload.iat > 365 * 24 * 60 * 60
    ) {
      warnings.push('Very long expiration (>1 year)')
    }
  }

  return (
    <section className="mb-8">
      <h2 className="mb-2 text-20 font-bold tracking-[-0.01em]">JWT Debugger &amp; Validator</h2>
      <p className="mb-5 text-15 leading-[1.6] text-[var(--muted)]">
        Debug JWT tokens, validate structure, and analyze potential security issues.
      </p>

      <div className="card p-6 shadow-[var(--shadow-sm)]">
        <div className="space-y-4">
          <div>
            <label className="form-label">JWT Token to Debug</label>
            <textarea
              value={jwtInput}
              onChange={(e) => onDecode(e.target.value)}
              className="form-textarea h-24 w-full font-mono text-sm"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            />
          </div>

          {decodedJWT && (
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="mb-2 text-15 font-semibold">Header Analysis</h4>
                <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3 text-sm">
                  <div>
                    <strong>Algorithm:</strong> {decodedJWT.header.alg || 'Not specified'}
                  </div>
                  <div>
                    <strong>Type:</strong> {decodedJWT.header.typ || 'Not specified'}
                  </div>
                  {decodedJWT.header.kid && (
                    <div>
                      <strong>Key ID:</strong> {decodedJWT.header.kid}
                    </div>
                  )}

                  {decodedJWT.header.alg === 'none' && (
                    <div className="mt-2 rounded border border-[var(--danger-border)] bg-[var(--danger-bg)] p-2 text-xs text-[var(--danger-text)]">
                      Warning: &apos;none&apos; algorithm is insecure
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-15 font-semibold">Payload Analysis</h4>
                <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3 text-sm">
                  {decodedJWT.payload.exp && (
                    <div>
                      <strong>Expires:</strong> {new Date(decodedJWT.payload.exp * 1000).toLocaleString()}
                      {decodedJWT.payload.exp * 1000 < Date.now() && (
                        <span className="ml-2 text-xs font-semibold text-[var(--danger-text)]">EXPIRED</span>
                      )}
                    </div>
                  )}
                  {decodedJWT.payload.iat && (
                    <div>
                      <strong>Issued:</strong> {new Date(decodedJWT.payload.iat * 1000).toLocaleString()}
                    </div>
                  )}
                  {decodedJWT.payload.sub && (
                    <div>
                      <strong>Subject:</strong> {decodedJWT.payload.sub}
                    </div>
                  )}
                  {decodedJWT.payload.iss && (
                    <div>
                      <strong>Issuer:</strong> {decodedJWT.payload.iss}
                    </div>
                  )}
                  {decodedJWT.payload.aud && (
                    <div>
                      <strong>Audience:</strong> {decodedJWT.payload.aud}
                    </div>
                  )}

                  <div className="mt-2 text-xs text-[var(--muted)]">
                    Custom claims:{' '}
                    {
                      Object.keys(decodedJWT.payload).filter(
                        (key) => !['exp', 'iat', 'sub', 'iss', 'aud', 'nbf', 'jti'].includes(key),
                      ).length
                    }
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-15 font-semibold">Security Assessment</h4>
                <div className="space-y-2 rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3 text-sm">
                  {issues.length > 0 && (
                    <div className="space-y-1">
                      <div className="font-medium text-[var(--danger-text)]">Issues:</div>
                      {issues.map((issue, i) => (
                        <div key={i} className="text-xs text-[var(--danger-text)]">
                          • {issue}
                        </div>
                      ))}
                    </div>
                  )}
                  {warnings.length > 0 && (
                    <div className="space-y-1">
                      <div className="font-medium text-[var(--warn-text)]">Warnings:</div>
                      {warnings.map((warning, i) => (
                        <div key={i} className="text-xs text-[var(--warn-text)]">
                          • {warning}
                        </div>
                      ))}
                    </div>
                  )}
                  {issues.length === 0 && warnings.length === 0 && (
                    <div className="text-xs text-[var(--accent-strong)]">No obvious issues detected</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
