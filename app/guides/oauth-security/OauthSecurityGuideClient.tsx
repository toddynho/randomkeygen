'use client'

import { useState } from 'react'
import { SecurityNotice, TerminalCommand, CodeBlock } from '../../components'

interface OauthSecurityGuideClientProps {
  breadcrumbItems?: Array<{ name: string; url: string }>
}

export default function OauthSecurityGuideClient(_props: OauthSecurityGuideClientProps) {
  const [selectedFlow, setSelectedFlow] = useState<'authorization_code' | 'implicit' | 'client_credentials' | 'device'>('authorization_code')

  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Developer security</p>
        <h1>OAuth Security Best Practices</h1>
        <p className="guide-deck">
          Comprehensive OAuth 2.0 security guide with best practices, vulnerability prevention, and secure implementation patterns for developers and security teams.
        </p>
      </header>
      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Understanding OAuth 2.0 Security</h2>
        <div className="prose max-w-none">
          <p className="mb-4">
            OAuth 2.0 is a powerful authorization framework that enables applications to obtain limited 
            access to user accounts. However, improper implementation can lead to serious security vulnerabilities. 
            This guide covers essential security practices for developers implementing OAuth 2.0.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🔐 Authorization vs Authentication</h3>
              <p className="text-sm text-blue-700">
                OAuth 2.0 is for authorization (what can you do), not authentication (who are you). 
                Don't confuse it with authentication protocols like OIDC.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🛡️ Common Attack Vectors</h3>
              <p className="text-sm text-green-700">
                CSRF, authorization code interception, token injection, and redirect URI manipulation 
                are the most common OAuth vulnerabilities to protect against.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">✅ Defense in Depth</h3>
              <p className="text-sm text-purple-700">
                Use PKCE, validate all parameters, implement proper state handling, 
                and secure token storage for comprehensive protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OAuth 2.0 vs OAuth 1.0 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">OAuth 2.0 vs OAuth 1.0</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
                <th className="border border-gray-300 px-4 py-2 text-left">OAuth 1.0</th>
                <th className="border border-gray-300 px-4 py-2 text-left">OAuth 2.0</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Transport Security</td>
                <td className="border border-gray-300 px-4 py-2">Built-in encryption</td>
                <td className="border border-gray-300 px-4 py-2">Requires HTTPS</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Complexity</td>
                <td className="border border-gray-300 px-4 py-2">High (crypto signatures)</td>
                <td className="border border-gray-300 px-4 py-2">Lower (bearer tokens)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Token Types</td>
                <td className="border border-gray-300 px-4 py-2">Single token type</td>
                <td className="border border-gray-300 px-4 py-2">Access + Refresh tokens</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Mobile Support</td>
                <td className="border border-gray-300 px-4 py-2">Limited</td>
                <td className="border border-gray-300 px-4 py-2">Excellent</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Status</td>
                <td className="border border-gray-300 px-4 py-2">Legacy (don't use for new projects)</td>
                <td className="border border-gray-300 px-4 py-2">Current standard</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>🎯 Recommendation:</strong> Always use OAuth 2.0 for new projects. OAuth 1.0 is deprecated 
            and should only be used when interacting with legacy systems that don't support OAuth 2.0.
          </p>
        </div>
      </section>

      {/* OAuth Flow Selection */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibent mb-4">Choosing the Right OAuth Flow</h2>
        
        <div className="mb-4">
          <label className="form-label">Select OAuth Flow</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {[
              { value: 'authorization_code', label: 'Authorization Code', desc: 'Server-side apps' },
              { value: 'implicit', label: 'Implicit', desc: 'Legacy SPAs' },
              { value: 'client_credentials', label: 'Client Credentials', desc: 'Service-to-service' },
              { value: 'device', label: 'Device Code', desc: 'IoT/TV devices' }
            ].map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setSelectedFlow(value as any)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  selectedFlow === value 
                    ? 'bg-blue-50 border-blue-200 text-blue-800' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-gray-500 mt-1">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Flow-specific guidance */}
        <div className="mt-6">
          {selectedFlow === 'authorization_code' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">✅ Authorization Code Flow (Recommended)</h3>
              <p className="text-sm text-green-700 mb-2">
                Most secure flow for web applications with a backend. Always use with PKCE for additional security.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-green-600">
                <li>Tokens never exposed to browser/user</li>
                <li>Supports refresh tokens for long-lived access</li>
                <li>Required for confidential clients</li>
                <li>Use with PKCE even for confidential clients</li>
              </ul>
            </div>
          )}

          {selectedFlow === 'implicit' && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">⚠️ Implicit Flow (Deprecated)</h3>
              <p className="text-sm text-red-700 mb-2">
                This flow is deprecated and should not be used. Use Authorization Code + PKCE instead.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-red-600">
                <li>Tokens exposed in URL fragment</li>
                <li>No refresh tokens</li>
                <li>Vulnerable to token leakage</li>
                <li>Migrate to Authorization Code + PKCE</li>
              </ul>
            </div>
          )}

          {selectedFlow === 'client_credentials' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🔧 Client Credentials Flow</h3>
              <p className="text-sm text-blue-700 mb-2">
                For service-to-service authentication where no user is involved.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-blue-600">
                <li>No user authorization required</li>
                <li>Client authenticates directly</li>
                <li>Use strong client authentication (mutual TLS, JWT assertion)</li>
                <li>Scope access appropriately</li>
              </ul>
            </div>
          )}

          {selectedFlow === 'device' && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">📺 Device Code Flow</h3>
              <p className="text-sm text-purple-700 mb-2">
                For devices without browsers or limited input capabilities (smart TVs, IoT devices).
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-purple-600">
                <li>User authorizes on separate device</li>
                <li>Polling-based token retrieval</li>
                <li>Implement reasonable polling intervals</li>
                <li>Handle timeout and error cases gracefully</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Common Security Vulnerabilities */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Common OAuth Security Vulnerabilities</h2>
        
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">🎯 Authorization Code Interception</h3>
            <p className="text-sm text-red-700 mb-2">
              <strong>Attack:</strong> Malicious apps intercept authorization codes through custom URL schemes or compromised redirect URIs.
            </p>
            <div className="bg-white p-3 rounded border text-sm">
              <strong>Prevention:</strong>
              <ul className="list-disc list-inside space-y-1 text-red-600 mt-1">
                <li>Always use PKCE (Proof Key for Code Exchange)</li>
                <li>Validate redirect URIs strictly</li>
                <li>Use https:// redirect URIs, never custom schemes</li>
                <li>Implement short-lived authorization codes (10 minutes max)</li>
              </ul>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">🔄 CSRF Attacks</h3>
            <p className="text-sm text-orange-700 mb-2">
              <strong>Attack:</strong> Attackers trick users into completing OAuth flows with attacker-controlled accounts.
            </p>
            <div className="bg-white p-3 rounded border text-sm">
              <strong>Prevention:</strong>
              <ul className="list-disc list-inside space-y-1 text-orange-600 mt-1">
                <li>Always use and validate the state parameter</li>
                <li>Make state unguessable (cryptographically random)</li>
                <li>Bind state to user session</li>
                <li>Implement CSRF tokens in addition to state</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">🔓 Token Injection</h3>
            <p className="text-sm text-yellow-700 mb-2">
              <strong>Attack:</strong> Attackers inject stolen access tokens into victim's application session.
            </p>
            <div className="bg-white p-3 rounded border text-sm">
              <strong>Prevention:</strong>
              <ul className="list-disc list-inside space-y-1 text-yellow-600 mt-1">
                <li>Bind tokens to client identity (token binding)</li>
                <li>Use sender-constrained tokens (mTLS, DPoP)</li>
                <li>Validate token audience and issuer</li>
                <li>Implement proper session management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Secure Implementation Patterns */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibent mb-4">Secure Implementation Examples</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Secure Authorization Code Flow with PKCE</h3>
            <CodeBlock
              filename="oauth-pkce.js"
              code={`class SecureOAuth {
  constructor(config) {
    this.clientId = config.clientId;
    this.redirectUri = config.redirectUri;
    this.authEndpoint = config.authEndpoint;
    this.tokenEndpoint = config.tokenEndpoint;
  }

  // Generate PKCE challenge
  async generatePKCE() {
    // Generate code verifier (43-128 characters)
    const codeVerifier = this.base64URLEncode(
      crypto.getRandomValues(new Uint8Array(32))
    );
    
    // Generate code challenge
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const codeChallenge = this.base64URLEncode(new Uint8Array(digest));
    
    return { codeVerifier, codeChallenge };
  }

  // Start authorization flow
  async startAuthorization(scopes) {
    // Generate PKCE and state
    const { codeVerifier, codeChallenge } = await this.generatePKCE();
    const state = this.base64URLEncode(crypto.getRandomValues(new Uint8Array(16)));
    
    // Store for later verification
    sessionStorage.setItem('oauth_code_verifier', codeVerifier);
    sessionStorage.setItem('oauth_state', state);
    
    // Build authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: scopes.join(' '),
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });
    
    // Redirect to authorization server
    window.location.href = \`\${this.authEndpoint}?\${params.toString()}\`;
  }

  // Handle authorization callback
  async handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    // Check for errors
    if (error) {
      throw new Error(\`OAuth error: \${error}\`);
    }
    
    // Validate state parameter (CSRF protection)
    const storedState = sessionStorage.getItem('oauth_state');
    if (!state || state !== storedState) {
      throw new Error('Invalid state parameter - possible CSRF attack');
    }
    
    // Get stored code verifier
    const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
    if (!codeVerifier) {
      throw new Error('Missing code verifier');
    }
    
    // Exchange code for tokens
    const tokens = await this.exchangeCodeForTokens(code, codeVerifier);
    
    // Clean up storage
    sessionStorage.removeItem('oauth_code_verifier');
    sessionStorage.removeItem('oauth_state');
    
    return tokens;
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code, codeVerifier) {
    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        code: code,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier
      })
    });
    
    if (!response.ok) {
      throw new Error('Token exchange failed');
    }
    
    const tokens = await response.json();
    
    // Validate token response
    if (!tokens.access_token) {
      throw new Error('Invalid token response');
    }
    
    return tokens;
  }

  base64URLEncode(buffer) {
    const bytes = new Uint8Array(buffer);
    const base64 = btoa(String.fromCharCode.apply(null, bytes));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}

// Usage
const oauth = new SecureOAuth({
  clientId: 'your-client-id',
  redirectUri: 'https://yourapp.com/callback',
  authEndpoint: 'https://auth.provider.com/oauth/authorize',
  tokenEndpoint: 'https://auth.provider.com/oauth/token'
});

// Start authorization
oauth.startAuthorization(['read', 'write']);

// Handle callback (call this on redirect page)
oauth.handleCallback().then(tokens => {
  console.log('Access token:', tokens.access_token);
}).catch(error => {
  console.error('OAuth error:', error);
});`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibent mb-3">Secure Token Storage</h3>
            <CodeBlock
              filename="token-storage.js"
              code={`class SecureTokenStorage {
  constructor() {
    this.storageKey = 'oauth_tokens';
  }

  // Store tokens securely
  storeTokens(tokens) {
    // For web apps - use httpOnly cookies when possible
    // This example shows secure client-side storage
    
    const tokenData = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
      tokenType: tokens.token_type || 'Bearer'
    };
    
    // Store in secure httpOnly cookie (server-side)
    this.setSecureCookie('access_token', tokens.access_token, tokens.expires_in);
    
    // Or use sessionStorage for temporary storage (less secure)
    sessionStorage.setItem(this.storageKey, JSON.stringify(tokenData));
  }

  // Get valid access token
  async getAccessToken() {
    // Try to get from cookie first
    let token = this.getCookie('access_token');
    
    if (!token) {
      // Fallback to sessionStorage
      const stored = sessionStorage.getItem(this.storageKey);
      if (!stored) return null;
      
      const tokenData = JSON.parse(stored);
      
      // Check if token is expired
      if (Date.now() >= tokenData.expiresAt) {
        // Try to refresh token
        const refreshed = await this.refreshAccessToken(tokenData.refreshToken);
        if (refreshed) {
          this.storeTokens(refreshed);
          return refreshed.access_token;
        }
        return null;
      }
      
      token = tokenData.accessToken;
    }
    
    return token;
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) return null;
    
    try {
      const response = await fetch('/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: 'your-client-id'
        })
      });
      
      if (!response.ok) {
        this.clearTokens();
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return null;
    }
  }

  // Make authenticated API request
  async apiRequest(url, options = {}) {
    const token = await this.getAccessToken();
    
    if (!token) {
      throw new Error('No valid access token available');
    }
    
    const headers = {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Handle token expiration
    if (response.status === 401) {
      this.clearTokens();
      throw new Error('Token expired, please re-authenticate');
    }
    
    return response;
  }

  // Clear all stored tokens
  clearTokens() {
    sessionStorage.removeItem(this.storageKey);
    this.deleteCookie('access_token');
  }

  // Helper methods for cookie management
  setSecureCookie(name, value, maxAge) {
    // This should be done server-side for httpOnly cookies
    const cookie = \`\${name}=\${value}; Max-Age=\${maxAge}; Secure; SameSite=Strict; Path=/\`;
    document.cookie = cookie;
  }

  getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  deleteCookie(name) {
    document.cookie = \`\${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;\`;
  }
}

// Usage
const tokenStorage = new SecureTokenStorage();

// Store tokens after OAuth flow
tokenStorage.storeTokens(oauthTokens);

// Make authenticated requests
tokenStorage.apiRequest('/api/user/profile').then(response => {
  return response.json();
}).then(profile => {
  console.log('User profile:', profile);
}).catch(error => {
  console.error('API request failed:', error);
});`}
            />
          </div>
        </div>
      </section>

      {/* Token Storage Strategies */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibent mb-4">Token Storage Security</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Storage Method</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Security</th>
                <th className="border border-gray-300 px-4 py-2 text-left">XSS Vulnerable</th>
                <th className="border border-gray-300 px-4 py-2 text-left">CSRF Vulnerable</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-green-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">httpOnly Cookie</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600">High</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600">No</td>
                <td className="border border-gray-300 px-4 py-2 text-yellow-600">Yes*</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600">✅ Recommended</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Memory (JS variable)</td>
                <td className="border border-gray-300 px-4 py-2 text-yellow-600">Medium</td>
                <td className="border border-gray-300 px-4 py-2 text-red-600">Yes</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600">No</td>
                <td className="border border-gray-300 px-4 py-2 text-yellow-600">⚠️ Short-lived only</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">sessionStorage</td>
                <td className="border border-gray-300 px-4 py-2 text-yellow-600">Medium</td>
                <td className="border border-gray-300 px-4 py-2 text-red-600">Yes</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600">No</td>
                <td className="border border-gray-300 px-4 py-2 text-yellow-600">⚠️ Temporary use</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">localStorage</td>
                <td className="border border-gray-300 px-4 py-2 text-red-600">Low</td>
                <td className="border border-gray-300 px-4 py-2 text-red-600">Yes</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600">No</td>
                <td className="border border-gray-300 px-4 py-2 text-red-600">❌ Avoid</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>* CSRF Protection:</strong> Use SameSite=Strict cookies and implement additional 
            CSRF tokens for state-changing operations. httpOnly cookies with proper CSRF protection 
            provide the best security for most applications.
          </p>
        </div>
      </section>

      {/* Real-World Examples */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibent mb-4">Real-World OAuth Implementations</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibent mb-3 flex items-center">
              <span className="mr-2">🐙</span> GitHub OAuth
            </h3>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="mb-2"><strong>Flow:</strong> Authorization Code + PKCE</p>
              <p className="mb-2"><strong>Scopes:</strong> Granular (repo, user, gist)</p>
              <p className="mb-2"><strong>Security:</strong> Required app review for public apps</p>
              <p className="text-xs text-gray-600">Best for: Developer tools, CI/CD systems</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibent mb-3 flex items-center">
              <span className="mr-2">🔗</span> Google OAuth
            </h3>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="mb-2"><strong>Flow:</strong> Authorization Code + PKCE</p>
              <p className="mb-2"><strong>Scopes:</strong> Very granular per-API</p>
              <p className="mb-2"><strong>Security:</strong> Advanced protection program</p>
              <p className="text-xs text-gray-600">Best for: Consumer apps, GSuite integration</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibent mb-3 flex items-center">
              <span className="mr-2">💼</span> Microsoft OAuth
            </h3>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="mb-2"><strong>Flow:</strong> Authorization Code + PKCE</p>
              <p className="mb-2"><strong>Scopes:</strong> Microsoft Graph API</p>
              <p className="mb-2"><strong>Security:</strong> Conditional access policies</p>
              <p className="text-xs text-gray-600">Best for: Enterprise apps, Office 365</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibent mb-3 flex items-center">
              <span className="mr-2">🎵</span> Spotify OAuth
            </h3>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="mb-2"><strong>Flow:</strong> Authorization Code + PKCE</p>
              <p className="mb-2"><strong>Scopes:</strong> User data, playlist modification</p>
              <p className="mb-2"><strong>Security:</strong> Rate limiting, quota management</p>
              <p className="text-xs text-gray-600">Best for: Music apps, analytics tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Checklist */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibent mb-4">OAuth Security Checklist</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibent mb-3">✅ Client-Side Security</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>✓ Always use HTTPS for OAuth endpoints</li>
              <li>✓ Implement PKCE for all OAuth flows</li>
              <li>✓ Validate state parameter to prevent CSRF</li>
              <li>✓ Use short-lived access tokens (1 hour max)</li>
              <li>✓ Store tokens in httpOnly cookies when possible</li>
              <li>✓ Implement proper error handling</li>
              <li>✓ Use Content Security Policy (CSP)</li>
              <li>✓ Validate redirect URIs strictly</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibent mb-3">🔧 Server-Side Security</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>✓ Validate all OAuth parameters</li>
              <li>✓ Implement rate limiting on OAuth endpoints</li>
              <li>✓ Use refresh token rotation</li>
              <li>✓ Log all OAuth events for monitoring</li>
              <li>✓ Implement token introspection</li>
              <li>✓ Use mTLS for sensitive applications</li>
              <li>✓ Set appropriate token scopes</li>
              <li>✓ Implement token binding where possible</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibent mb-4">Related Security Tools</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="/oauth-token" className="block p-4 bg-white border rounded-lg hover:border-blue-300 transition-colors">
            <h3 className="font-semibent text-blue-600">OAuth Token Generator</h3>
            <p className="text-sm text-gray-600 mt-1">Generate and test OAuth tokens</p>
          </a>
          <a href="/jwt-secret" className="block p-4 bg-white border rounded-lg hover:border-blue-300 transition-colors">
            <h3 className="font-semibent text-blue-600">JWT Secret Generator</h3>
            <p className="text-sm text-gray-600 mt-1">Create secure JWT signing secrets</p>
          </a>
          <a href="/api-key" className="block p-4 bg-white border rounded-lg hover:border-blue-300 transition-colors">
            <h3 className="font-semibent text-blue-600">API Key Generator</h3>
            <p className="text-sm text-gray-600 mt-1">Generate API keys with permissions</p>
          </a>
        </div>
      </section>

      <SecurityNotice type="warning">
        <strong>Security Reminder:</strong> OAuth security is critical for protecting user data and preventing 
        unauthorized access. Always use the latest OAuth 2.1 recommendations, implement PKCE, validate all 
        parameters, and consider using OpenID Connect for authentication. Regular security audits and 
        penetration testing are essential for OAuth implementations in production.
      </SecurityNotice>
    </article>
  )
}
