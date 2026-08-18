'use client'

/** JWT Claims Builder — standard-claim inputs with a live claims preview. */
export function JwtClaimsBuilder() {
  return (
    <section className="mb-8">
      <h2 className="mb-2 text-20 font-bold tracking-[-0.01em]">JWT Claims Builder</h2>
      <p className="mb-5 text-15 leading-[1.6] text-[var(--muted)]">
        Build standard JWT claims with validation and examples.
      </p>

      <div className="card p-6 shadow-[var(--shadow-sm)]">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-16 font-semibold">Standard Claims</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Issuer (iss)</label>
                <input type="text" className="form-input w-full text-sm" placeholder="your-app.com" />
              </div>
              <div>
                <label className="form-label">Subject (sub)</label>
                <input type="text" className="form-input w-full text-sm" placeholder="user-123" />
              </div>
              <div>
                <label className="form-label">Audience (aud)</label>
                <input type="text" className="form-input w-full text-sm" placeholder="api.example.com" />
              </div>
              <div>
                <label className="form-label">Expiry (hours)</label>
                <input type="number" className="form-input w-full text-sm" placeholder="24" defaultValue="24" />
              </div>
            </div>

            <div>
              <label className="form-label">Scopes (space-separated)</label>
              <input
                type="text"
                className="form-input w-full text-sm"
                placeholder="read:profile write:posts admin"
              />
            </div>

            <h4 className="mt-6 text-15 font-semibold">Custom Claims</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <input type="text" className="form-input text-sm" placeholder="Claim name" />
                <input type="text" className="form-input text-sm" placeholder="Value" />
                <button className="min-h-10 rounded-[9px] border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 text-14 font-semibold text-[var(--accent-strong)] transition-colors hover:border-[var(--accent)]">
                  Add
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-16 font-semibold">Generated Claims Preview</h3>
            <pre className="h-64 overflow-x-auto rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-4 text-sm">
              {JSON.stringify(
                {
                  iss: 'your-app.com',
                  sub: 'user-123',
                  aud: 'api.example.com',
                  iat: Math.floor(Date.now() / 1000),
                  exp: Math.floor(Date.now() / 1000) + 24 * 3600,
                  scope: 'read:profile write:posts',
                  role: 'user',
                  email: 'user@example.com',
                },
                null,
                2,
              )}
            </pre>
            <button className="btn btn-primary mt-3 w-full">Copy Claims JSON</button>
          </div>
        </div>
      </div>
    </section>
  )
}
