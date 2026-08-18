'use client'

import { CodeBlock, TerminalCommand } from '../components'
import { generators } from '../lib/crypto'
import { TokenType, tokenTypes } from './oauth-utils'

/** Template-style section heading (19px / 700) with optional lede. */
export function SectionHeading({ title, lede }: { title: string; lede?: string }) {
  return (
    <>
      <h2 className={`text-20 font-bold tracking-[-0.01em] ${lede ? 'mb-2' : 'mb-4'}`}>{title}</h2>
      {lede && <p className="mb-5 text-15 leading-[1.6] text-[var(--muted)]">{lede}</p>}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* OAuth flow comparison                                               */
/* ------------------------------------------------------------------ */

export function OauthFlowComparison() {
  const rows = [
    { flow: 'Authorization Code', useCase: 'Web applications', client: 'Confidential', tokens: 'Auth Code + Access + Refresh', security: 'High' },
    { flow: 'PKCE', useCase: 'SPAs, Mobile apps', client: 'Public', tokens: 'Auth Code + Access', security: 'High' },
    { flow: 'Implicit', useCase: 'Legacy SPAs', client: 'Public', tokens: 'Access (fragment)', security: 'Medium' },
    { flow: 'Client Credentials', useCase: 'API to API', client: 'Confidential', tokens: 'Client Secret + Access', security: 'High' },
  ]

  return (
    <section className="mb-8">
      <SectionHeading title="OAuth 2.0 Flow Comparison" />
      <div className="overflow-x-auto card p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="py-3 pr-4 text-left">Flow Type</th>
              <th className="py-3 pr-4 text-left">Use Case</th>
              <th className="py-3 pr-4 text-left">Client Type</th>
              <th className="py-3 pr-4 text-left">Tokens Used</th>
              <th className="py-3 text-left">Security Level</th>
            </tr>
          </thead>
          <tbody className="text-[var(--muted)]">
            {rows.map((row, index) => (
              <tr key={row.flow} className={index < rows.length - 1 ? 'border-b border-[var(--hairline)]' : ''}>
                <td className="py-3 pr-4 font-mono">{row.flow}</td>
                <td className="py-3 pr-4">{row.useCase}</td>
                <td className="py-3 pr-4">{row.client}</td>
                <td className="py-3 pr-4">{row.tokens}</td>
                <td className={`py-3 ${row.security === 'High' ? 'text-[var(--accent-strong)]' : 'text-[var(--warn-text)]'}`}>
                  {row.security}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Implementation examples                                             */
/* ------------------------------------------------------------------ */

interface OauthImplementationExamplesProps {
  clientId: string
  redirectUri: string
  scope: string
  tokenType: TokenType
  values: string[]
}

export function OauthImplementationExamples({
  clientId,
  redirectUri,
  scope,
  tokenType,
  values,
}: OauthImplementationExamplesProps) {
  return (
    <section className="mb-8">
      <SectionHeading title="Complete Implementation Examples" />

      {/* Express.js OAuth Server */}
      <div className="mb-6">
        <h3 className="mb-3 text-16 font-semibold">Express.js OAuth Server</h3>
        <CodeBlock
          filename="oauth-server.js"
          language="javascript"
          code={`const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class OAuthServer {
  constructor() {
    this.clients = new Map();
    this.authCodes = new Map();
    this.accessTokens = new Map();
    this.refreshTokens = new Map();
  }

  registerClient(clientId, clientSecret, redirectUris) {
    this.clients.set(clientId, {
      secret: clientSecret,
      redirectUris: new Set(redirectUris)
    });
  }

  generateAuthCode(clientId, userId, scopes) {
    const code = crypto.randomBytes(24).toString('base64url');
    this.authCodes.set(code, {
      clientId,
      userId,
      scopes,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });
    return code;
  }

  generateTokens(userId, clientId, scopes) {
    const accessToken = crypto.randomBytes(32).toString('base64url');
    const refreshToken = crypto.randomBytes(64).toString('base64url');

    this.accessTokens.set(accessToken, {
      userId,
      clientId,
      scopes,
      expiresAt: Date.now() + 3600 * 1000 // 1 hour
    });

    this.refreshTokens.set(refreshToken, {
      userId,
      clientId,
      scopes,
      expiresAt: Date.now() + 90 * 24 * 3600 * 1000 // 90 days
    });

    return { accessToken, refreshToken, expiresIn: 3600 };
  }

  validateAccessToken(token) {
    const tokenData = this.accessTokens.get(token);
    return tokenData && tokenData.expiresAt > Date.now() ? tokenData : null;
  }
}

const oauthServer = new OAuthServer();

// Register a client
oauthServer.registerClient(
  '${clientId}',
  '${tokenType === 'client_secret' ? values[0] : 'cs_client_secret_here'}',
  ['${redirectUri}']
);

// Authorization endpoint
app.get('/oauth/authorize', (req, res) => {
  const { client_id, redirect_uri, scope, state } = req.query;

  // Validate client and redirect URI
  const client = oauthServer.clients.get(client_id);
  if (!client || !client.redirectUris.has(redirect_uri)) {
    return res.status(400).json({ error: 'invalid_client' });
  }

  // In real implementation, show user consent form
  // For demo, auto-approve
  const authCode = oauthServer.generateAuthCode(client_id, 'user123', scope);

  res.redirect(\`\${redirect_uri}?code=\${authCode}&state=\${state}\`);
});

// Token endpoint
app.post('/oauth/token', (req, res) => {
  const { grant_type, code, client_id, client_secret, refresh_token } = req.body;

  if (grant_type === 'authorization_code') {
    const codeData = oauthServer.authCodes.get(code);
    if (!codeData || codeData.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'invalid_grant' });
    }

    const tokens = oauthServer.generateTokens(codeData.userId, client_id, codeData.scopes);
    oauthServer.authCodes.delete(code); // One-time use

    res.json({
      access_token: tokens.accessToken,
      token_type: 'Bearer',
      expires_in: tokens.expiresIn,
      refresh_token: tokens.refreshToken,
      scope: codeData.scopes
    });
  }

  // Handle refresh_token grant type...
});`}
        />
      </div>

      {/* Python Flask OAuth Client */}
      <div className="mb-6">
        <h3 className="mb-3 text-16 font-semibold">Python Flask OAuth Client</h3>
        <CodeBlock
          filename="oauth_client.py"
          language="python"
          code={`from flask import Flask, request, session, redirect, url_for
import requests
import secrets
from urllib.parse import urlencode

app = Flask(__name__)
app.secret_key = '${generators.base64(32)}'

# OAuth configuration
OAUTH_CONFIG = {
    'client_id': '${clientId}',
    'client_secret': '${tokenType === 'client_secret' ? values[0] : 'cs_client_secret_here'}',
    'auth_url': 'https://oauth.provider.com/authorize',
    'token_url': 'https://oauth.provider.com/token',
    'redirect_uri': '${redirectUri}',
    'scope': '${scope}'
}

@app.route('/login')
def login():
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    session['oauth_state'] = state

    # Build authorization URL
    params = {
        'response_type': 'code',
        'client_id': OAUTH_CONFIG['client_id'],
        'redirect_uri': OAUTH_CONFIG['redirect_uri'],
        'scope': OAUTH_CONFIG['scope'],
        'state': state
    }

    auth_url = f"{OAUTH_CONFIG['auth_url']}?{urlencode(params)}"
    return redirect(auth_url)

@app.route('/callback')
def callback():
    # Verify state parameter
    if request.args.get('state') != session.get('oauth_state'):
        return 'Invalid state parameter', 400

    # Get authorization code
    auth_code = request.args.get('code')
    if not auth_code:
        return 'Missing authorization code', 400

    # Exchange code for tokens
    token_data = {
        'grant_type': 'authorization_code',
        'code': auth_code,
        'client_id': OAUTH_CONFIG['client_id'],
        'client_secret': OAUTH_CONFIG['client_secret'],
        'redirect_uri': OAUTH_CONFIG['redirect_uri']
    }

    response = requests.post(OAUTH_CONFIG['token_url'], data=token_data)

    if response.status_code == 200:
        tokens = response.json()
        session['access_token'] = tokens['access_token']
        session['refresh_token'] = tokens.get('refresh_token')
        return redirect(url_for('profile'))
    else:
        return 'Token exchange failed', 400

@app.route('/profile')
def profile():
    access_token = session.get('access_token')
    if not access_token:
        return redirect(url_for('login'))

    # Make API request with access token
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get('https://api.provider.com/user/profile', headers=headers)

    if response.status_code == 200:
        user_data = response.json()
        return f"Welcome, {user_data.get('name', 'User')}!"
    else:
        # Token might be expired, try refresh
        return refresh_and_retry()

def refresh_and_retry():
    refresh_token = session.get('refresh_token')
    if not refresh_token:
        return redirect(url_for('login'))

    # Refresh access token
    token_data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': OAUTH_CONFIG['client_id'],
        'client_secret': OAUTH_CONFIG['client_secret']
    }

    response = requests.post(OAUTH_CONFIG['token_url'], data=token_data)

    if response.status_code == 200:
        tokens = response.json()
        session['access_token'] = tokens['access_token']
        return redirect(url_for('profile'))
    else:
        return redirect(url_for('login'))`}
        />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Security best practices                                             */
/* ------------------------------------------------------------------ */

export function OauthSecurityBestPractices() {
  return (
    <section className="mb-8">
      <SectionHeading title="OAuth 2.0 Security Best Practices" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-3 text-16 font-semibold text-[var(--accent-strong)]">✓ Security Recommendations</h3>
          <ul className="list-inside list-disc space-y-2 text-sm text-[var(--muted)]">
            <li>Always use HTTPS for all OAuth endpoints</li>
            <li>Implement state parameter for CSRF protection</li>
            <li>Use PKCE for public clients (SPAs, mobile)</li>
            <li>Validate redirect URIs against whitelist</li>
            <li>Set short expiry for authorization codes (10 min)</li>
            <li>Implement proper token storage (secure, httpOnly cookies)</li>
            <li>Use refresh token rotation</li>
            <li>Implement token revocation endpoints</li>
          </ul>
        </div>

        <div className="card p-5">
          <h3 className="mb-3 text-16 font-semibold text-[var(--danger-text)]">✗ Common Vulnerabilities</h3>
          <ul className="list-inside list-disc space-y-2 text-sm text-[var(--muted)]">
            <li>Missing or weak state validation (CSRF)</li>
            <li>Authorization code replay attacks</li>
            <li>Redirect URI manipulation</li>
            <li>Token leakage in logs or URLs</li>
            <li>Insufficient client authentication</li>
            <li>Long-lived access tokens without refresh</li>
            <li>Implicit flow without proper validation</li>
            <li>Missing token revocation on logout</li>
          </ul>
        </div>
      </div>

      {/* OAuth Security Checklist */}
      <div className="mt-6 card p-5">
        <h3 className="mb-4 text-16 font-semibold">OAuth Security Checklist</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            {[
              'HTTPS enforced on all endpoints',
              'State parameter validated (CSRF protection)',
              'Redirect URIs strictly validated',
              'Authorization codes expire quickly (≤10min)',
              'PKCE implemented for public clients',
            ].map((item) => (
              <label key={item} className="flex items-start gap-3 text-sm">
                <input type="checkbox" className="mt-1 h-4 w-4" disabled />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <div className="space-y-2">
            {[
              'Access tokens have reasonable expiry (1-2h)',
              'Refresh token rotation implemented',
              'Token revocation endpoint available',
              'Client credentials securely stored',
              'Scope validation enforced',
            ].map((item) => (
              <label key={item} className="flex items-start gap-3 text-sm">
                <input type="checkbox" className="mt-1 h-4 w-4" disabled />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Terminal commands                                                   */
/* ------------------------------------------------------------------ */

export function OauthTerminalCommands({ tokenType, customLength }: { tokenType: TokenType; customLength: number }) {
  const config = tokenTypes[tokenType]
  const length = customLength || config.length

  return (
    <section className="mb-8">
      <SectionHeading title="Generate Tokens in Terminal" />
      <div className="space-y-3">
        <TerminalCommand
          command={`openssl rand -base64 ${length}`}
          description={`OpenSSL (${length} bytes, base64)`}
        />
        <TerminalCommand
          command={`python3 -c "import secrets; print('${config.prefix}_' + secrets.token_urlsafe(${length}))"`}
          description="Python with prefix"
        />
        <TerminalCommand
          command={`node -e "console.log('${config.prefix}_' + require('crypto').randomBytes(${length}).toString('base64url'))"`}
          description="Node.js with prefix"
        />
        <TerminalCommand command={`uuidgen`} description="UUID (for client IDs)" />
      </div>
    </section>
  )
}
