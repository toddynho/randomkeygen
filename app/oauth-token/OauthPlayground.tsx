'use client'

import { useState } from 'react'
import { generators } from '../lib/crypto'
import { CodeBlock, SecurityNotice } from '../components'
import { TokenType } from './oauth-utils'

interface OauthPlaygroundProps {
  values: string[]
  tokenType: TokenType
  clientId: string
  setClientId: (value: string) => void
  redirectUri: string
  setRedirectUri: (value: string) => void
  scope: string
  setScope: (value: string) => void
  state: string
  setState: (value: string) => void
}

/** Interactive OAuth 2.0 Playground — step through a full authorization flow with generated tokens. */
export function OauthPlayground({
  values,
  tokenType,
  clientId,
  setClientId,
  redirectUri,
  setRedirectUri,
  scope,
  setScope,
  state,
  setState,
}: OauthPlaygroundProps) {
  const [playgroundStep, setPlaygroundStep] = useState(1)

  return (
    <section className="mb-8">
      <h2 className="mb-2 text-20 font-bold tracking-[-0.01em]">Interactive OAuth 2.0 Playground</h2>
      <p className="mb-5 text-15 leading-[1.6] text-[var(--muted)]">
        Step through a complete OAuth authorization flow with live examples and generated tokens.
      </p>

      <div className="overflow-hidden card shadow-[var(--shadow-sm)]">
        {/* Step Navigation */}
        <div className="flex flex-col border-b border-[var(--border)] sm:flex-row">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              onClick={() => setPlaygroundStep(step)}
              aria-pressed={playgroundStep === step}
              className={`flex-1 border-b border-[var(--hairline)] px-4 py-3 text-sm font-medium transition-colors last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${
                playgroundStep === step
                  ? 'bg-[var(--accent-soft)] text-[var(--accent-strong)]'
                  : 'text-[var(--muted)] hover:bg-[var(--band)]'
              }`}
            >
              Step {step}:{' '}
              {step === 1 ? 'Authorization' : step === 2 ? 'Exchange Code' : step === 3 ? 'Access API' : 'Refresh Token'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Step 1: Authorization URL */}
          {playgroundStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-16 font-semibold">Step 1: Authorization Request</h3>
              <p className="text-sm text-[var(--muted)]">
                Build the authorization URL to redirect users to the OAuth provider.
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="form-label">Client ID</label>
                  <input
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="form-input w-full font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="form-label">Redirect URI</label>
                  <input
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                    className="form-input w-full font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="form-label">Scopes (space-separated)</label>
                  <input
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="form-input w-full font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="form-label">State (CSRF protection)</label>
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="form-input w-full font-mono text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="form-label">Generated Authorization URL</label>
                <div className="break-all rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3 font-mono text-sm">
                  {`https://oauth.provider.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Code Exchange */}
          {playgroundStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-16 font-semibold">Step 2: Exchange Authorization Code</h3>
              <p className="text-sm text-[var(--muted)]">
                Exchange the authorization code for an access token and refresh token.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Authorization Code (from callback)</label>
                  <div className="break-all rounded-[10px] border border-[var(--hairline)] bg-[var(--band)] p-3 font-mono text-sm">
                    {values[3] || 'ac_authorization_code_here'}
                  </div>
                </div>

                <CodeBlock
                  filename="Token Exchange Request"
                  language="bash"
                  code={`curl -X POST https://oauth.provider.com/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=authorization_code&code=${values[3] || 'ac_authorization_code_here'}&client_id=${clientId}&client_secret=${tokenType === 'client_secret' ? values[0] : 'cs_client_secret_here'}&redirect_uri=${encodeURIComponent(redirectUri)}"`}
                />

                <div>
                  <label className="form-label">Expected Response</label>
                  <CodeBlock
                    language="json"
                    code={`{
  "access_token": "${tokenType === 'access_token' ? values[0] : 'ya29_access_token_here'}",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "${tokenType === 'refresh_token' ? values[0] : '1//04_refresh_token_here'}",
  "scope": "${scope}"
}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: API Access */}
          {playgroundStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-16 font-semibold">Step 3: Access Protected Resources</h3>
              <p className="text-sm text-[var(--muted)]">
                Use the access token to make authenticated API requests.
              </p>

              <CodeBlock
                filename="API Request with Bearer Token"
                language="bash"
                code={`curl -X GET https://api.provider.com/user/profile \\
  -H "Authorization: Bearer ${tokenType === 'access_token' ? values[0] : 'ya29_access_token_here'}" \\
  -H "Accept: application/json"`}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CodeBlock
                  filename="JavaScript/Node.js"
                  language="javascript"
                  code={`const response = await fetch('https://api.provider.com/user/profile', {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`,
    'Accept': 'application/json'
  }
});

const userData = await response.json();`}
                />

                <CodeBlock
                  filename="Python requests"
                  language="python"
                  code={`import requests

headers = {
    'Authorization': f'Bearer {access_token}',
    'Accept': 'application/json'
}

response = requests.get(
    'https://api.provider.com/user/profile',
    headers=headers
)

user_data = response.json()`}
                />
              </div>
            </div>
          )}

          {/* Step 4: Token Refresh */}
          {playgroundStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-16 font-semibold">Step 4: Refresh Access Token</h3>
              <p className="text-sm text-[var(--muted)]">
                Use the refresh token to get a new access token when it expires.
              </p>

              <CodeBlock
                filename="Refresh Token Request"
                language="bash"
                code={`curl -X POST https://oauth.provider.com/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=refresh_token&refresh_token=${tokenType === 'refresh_token' ? values[0] : '1//04_refresh_token_here'}&client_id=${clientId}&client_secret=${tokenType === 'client_secret' ? values[0] : 'cs_client_secret_here'}"`}
              />

              <div>
                <label className="form-label">Expected Response</label>
                <CodeBlock
                  language="json"
                  code={`{
  "access_token": "${generators.base64(32)}",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "${scope}"
}`}
                />
              </div>

              <SecurityNotice type="warning" title="Refresh Token Security">
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>Store refresh tokens securely (encrypted, secure storage)</li>
                  <li>Implement token rotation - issue new refresh tokens with each use</li>
                  <li>Set reasonable expiry (90 days to 1 year)</li>
                  <li>Revoke refresh tokens on logout or suspicious activity</li>
                </ul>
              </SecurityNotice>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
