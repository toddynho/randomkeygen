'use client'

import { useState, useCallback } from 'react'
import { encodeJWTDemo, DecodedJwt } from './jwt-utils'

interface JwtDecoderProps {
  jwtInput: string
  decodedJWT: DecodedJwt | null
  onDecode: (token: string) => void
}

/** Interactive JWT Decoder & Encoder — inspect existing tokens or build unsigned ones. */
export function JwtDecoder({ jwtInput, decodedJWT, onDecode }: JwtDecoderProps) {
  const [encoderHeader, setEncoderHeader] = useState(JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2))
  const [encoderPayload, setEncoderPayload] = useState(
    JSON.stringify(
      {
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022,
        exp: 1516242622,
      },
      null,
      2,
    ),
  )
  const [encodedJWT, setEncodedJWT] = useState('')

  const handleJWTEncode = useCallback(() => {
    try {
      const header = JSON.parse(encoderHeader)
      const payload = JSON.parse(encoderPayload)
      const encoded = encodeJWTDemo(header, payload)
      setEncodedJWT(encoded || '')
    } catch {
      setEncodedJWT('Error: Invalid JSON in header or payload')
    }
  }, [encoderHeader, encoderPayload])

  return (
    <section className="mb-8">
      <h2 className="mb-2 text-20 font-bold tracking-[-0.01em]">Interactive JWT Decoder &amp; Encoder</h2>
      <p className="mb-5 text-15 leading-[1.6] text-[var(--muted)]">
        Decode existing JWTs to inspect their structure, or build new ones with custom claims.
      </p>

      <div className="overflow-hidden card shadow-[var(--shadow-sm)]">
        <div className="grid md:grid-cols-2">
          {/* JWT Decoder */}
          <div className="border-b border-[var(--hairline)] p-6 md:border-b-0 md:border-r">
            <h3 className="mb-4 text-16 font-semibold">JWT Decoder</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">JWT Token (paste here)</label>
                <textarea
                  value={jwtInput}
                  onChange={(e) => onDecode(e.target.value)}
                  className="form-textarea h-24 w-full font-mono text-sm"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                />
              </div>

              {decodedJWT && (
                <div className="space-y-3">
                  <div>
                    <label className="form-label">Header</label>
                    <pre className="overflow-x-auto rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3 text-sm">
                      {JSON.stringify(decodedJWT.header, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <label className="form-label">Payload</label>
                    <pre className="overflow-x-auto rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3 text-sm">
                      {JSON.stringify(decodedJWT.payload, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <label className="form-label">Signature (truncated)</label>
                    <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3 font-mono text-sm">
                      {decodedJWT.signature.substring(0, 20)}...
                    </div>
                  </div>
                </div>
              )}

              {jwtInput && !decodedJWT && (
                <div
                  role="alert"
                  className="rounded-[10px] border border-[var(--danger-border)] bg-[var(--danger-bg)] px-[13px] py-2.5 text-14 text-[var(--danger-text)]"
                >
                  Invalid JWT format. Make sure it has three parts separated by dots.
                </div>
              )}
            </div>
          </div>

          {/* JWT Encoder */}
          <div className="p-6">
            <h3 className="mb-4 text-16 font-semibold">JWT Builder</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">Header (JSON)</label>
                <textarea
                  value={encoderHeader}
                  onChange={(e) => setEncoderHeader(e.target.value)}
                  className="form-textarea h-20 w-full font-mono text-sm"
                />
              </div>

              <div>
                <label className="form-label">Payload (JSON)</label>
                <textarea
                  value={encoderPayload}
                  onChange={(e) => setEncoderPayload(e.target.value)}
                  className="form-textarea h-24 w-full font-mono text-sm"
                />
              </div>

              <button onClick={handleJWTEncode} className="btn btn-primary w-full">
                Build JWT (Header + Payload)
              </button>

              {encodedJWT && (
                <div>
                  <label className="form-label">Generated JWT (unsigned)</label>
                  <textarea
                    value={encodedJWT}
                    readOnly
                    className="form-textarea h-20 w-full bg-[var(--band)] font-mono text-sm"
                  />
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    Note: This is unsigned. Use your secret to sign it in production.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
