'use client'

import { useState, useCallback } from 'react'
import { generators } from '../lib/crypto'
import { GeneratorLayout, GeneratorControls, ControlField, SecurityNotice, RelatedContent, CodeBlock, GeneratedValue } from '../components'

const webauthnRelated = {
  tools: [
    { href: '/totp-authenticator', label: 'TOTP Authenticator', description: 'Generate 2FA authenticator secrets with QR codes' },
    { href: '/backup-codes', label: 'Backup Codes', description: 'Generate 2FA recovery codes' },
    { href: '/api-key', label: 'API Key Generator', description: 'Generate secure API keys with permissions' },
  ],
  guides: [
    { href: '/guides/password-security-best-practices', title: 'WebAuthn Security Best Practices' },
    { href: '/guides/api-key-best-practices', title: 'Passwordless Authentication Guide' },
  ],
  tips: [
    'Use platform authenticators for better user experience',
    'Enable resident keys for true passwordless authentication',
    'Always verify user presence for security-sensitive operations',
    'Test credential generation across different browsers',
    'Consider cross-platform authenticators for shared accounts',
  ],
}

interface WebAuthnCredentialData {
  challenge: string
  rp: {
    id: string
    name: string
  }
  user: {
    id: string
    name: string
    displayName: string
  }
  pubKeyCredParams: Array<{ alg: number; type: string }>
  authenticatorSelection: {
    authenticatorAttachment: string
    residentKey: string
    userVerification: string
  }
  attestation: string
  timeout: number
  excludeCredentials: any[]
  credential: {
    id: string
    publicKey: {
      kty: string
      alg: string
      crv: string
      x: string
      y: string
    }
    authenticatorData: string
    clientDataJSON: string
  }
}

interface WebauthnCredentialPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
}

export default function WebauthnCredentialPageClient({ breadcrumbItems }: WebauthnCredentialPageClientProps) {
  const [rpId, setRpId] = useState('example.com')
  const [rpName, setRpName] = useState('Example Corp')
  const [userName, setUserName] = useState('user@example.com')
  const [userDisplayName, setUserDisplayName] = useState('Example User')
  const [authenticatorType, setAuthenticatorType] = useState<'platform' | 'cross-platform'>('platform')
  const [residentKey, setResidentKey] = useState<'discouraged' | 'preferred' | 'required'>('preferred')
  const [userVerification, setUserVerification] = useState<'discouraged' | 'preferred' | 'required'>('preferred')
  const [attestation, setAttestation] = useState<'none' | 'indirect' | 'direct' | 'enterprise'>('none')
  const [credential, setCredential] = useState<WebAuthnCredentialData | null>(null)

  const generateCredential = useCallback(() => {
    const newCredential = generators.webauthnCredential({
      rpId,
      rpName,
      userName,
      userDisplayName,
      authenticatorType,
      residentKey,
      userVerification,
      attestation,
    })
    setCredential(newCredential)
  }, [rpId, rpName, userName, userDisplayName, authenticatorType, residentKey, userVerification, attestation])

  const createCredentialOptions = credential ? `// WebAuthn Credential Creation Options
const createCredentialOptions = {
  publicKey: {
    challenge: new Uint8Array(atob("${credential.challenge}").split('').map(c => c.charCodeAt(0))),
    rp: {
      id: "${credential.rp.id}",
      name: "${credential.rp.name}"
    },
    user: {
      id: new Uint8Array(atob("${credential.user.id}").split('').map(c => c.charCodeAt(0))),
      name: "${credential.user.name}",
      displayName: "${credential.user.displayName}"
    },
    pubKeyCredParams: ${JSON.stringify(credential.pubKeyCredParams, null, 6)},
    authenticatorSelection: {
      authenticatorAttachment: "${credential.authenticatorSelection.authenticatorAttachment}",
      residentKey: "${credential.authenticatorSelection.residentKey}",
      userVerification: "${credential.authenticatorSelection.userVerification}"
    },
    attestation: "${credential.attestation}",
    timeout: ${credential.timeout}
  }
};

// Create the credential
const credential = await navigator.credentials.create(createCredentialOptions);` : ''

  const implementationExample = credential ? `// Complete WebAuthn Implementation Example

// 1. Registration Flow (Client-side)
async function registerWebAuthn() {
  try {
    const credential = await navigator.credentials.create(createCredentialOptions);
    
    // Send credential to server for verification and storage
    const response = await fetch('/api/webauthn/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credentialId: credential.id,
        publicKey: credential.response.publicKey,
        authenticatorData: credential.response.authenticatorData
      })
    });
    
    if (response.ok) {
      console.log('Registration successful');
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
}

// 2. Authentication Flow (Client-side)
async function authenticateWebAuthn() {
  const getCredentialOptions = {
    publicKey: {
      challenge: new Uint8Array(32), // Get from server
      allowCredentials: [{
        id: new Uint8Array(atob("${credential.credential.id}").split('').map(c => c.charCodeAt(0))),
        type: 'public-key'
      }],
      userVerification: '${credential.authenticatorSelection.userVerification}'
    }
  };
  
  const assertion = await navigator.credentials.get(getCredentialOptions);
  // Send assertion to server for verification
}` : ''

  return (
    <GeneratorLayout
      title="WebAuthn Credential Generator"
      description="Generate secure biometric keys and WebAuthn credentials for Touch ID, Face ID, fingerprint authentication, and passwordless login. Configure platform authenticators with FIDO2 passkeys and biometric verification settings."
      breadcrumbItems={breadcrumbItems}
    >
      <GeneratorControls onGenerate={generateCredential}>
        <div>
          <label className="form-label">Relying Party ID</label>
          <input
            id="rpId"
            type="text"
            value={rpId}
            onChange={(e) => setRpId(e.target.value)}
            className="form-input w-full"
            placeholder="example.com"
          />
          <p className="text-sm text-[var(--muted)] mt-1">Domain that will use this credential</p>
        </div>

        <div>
          <label className="form-label">Relying Party Name</label>
          <input
            id="rpName"
            type="text"
            value={rpName}
            onChange={(e) => setRpName(e.target.value)}
            className="form-input w-full"
            placeholder="Example Corp"
          />
          <p className="text-sm text-[var(--muted)] mt-1">Human-readable service name</p>
        </div>

        <div>
          <label className="form-label">User Name</label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="form-input w-full"
            placeholder="user@example.com"
          />
          <p className="text-sm text-[var(--muted)] mt-1">Unique user identifier (email or username)</p>
        </div>

        <div>
          <label className="form-label">User Display Name</label>
          <input
            id="userDisplayName"
            type="text"
            value={userDisplayName}
            onChange={(e) => setUserDisplayName(e.target.value)}
            className="form-input w-full"
            placeholder="Example User"
          />
          <p className="text-sm text-[var(--muted)] mt-1">Human-readable user name</p>
        </div>

        <ControlField 
          label="Authenticator Type"
          type="select"
          value={authenticatorType}
          onChange={(value) => setAuthenticatorType(value as 'platform' | 'cross-platform')}
          options={[
            { value: "platform", label: "Platform (TouchID, FaceID, Windows Hello)" },
            { value: "cross-platform", label: "Cross-Platform (YubiKey, USB tokens)" }
          ]}
        />
        <p className="text-sm text-[var(--muted)] mt-1">
          {authenticatorType === 'platform' 
            ? 'Built-in biometric authenticators like fingerprint or face recognition'
            : 'External security keys that can be used across devices'}
        </p>

        <ControlField 
          label="Resident Key"
          type="select"
          value={residentKey}
          onChange={(value) => setResidentKey(value as 'discouraged' | 'preferred' | 'required')}
          options={[
            { value: "discouraged", label: "Discouraged" },
            { value: "preferred", label: "Preferred" },
            { value: "required", label: "Required" }
          ]}
        />
        <p className="text-sm text-[var(--muted)] mt-1">
          {residentKey === 'required' && 'Enables true passwordless authentication (no username needed)'}
          {residentKey === 'preferred' && 'Authenticator will create resident key if supported'}
          {residentKey === 'discouraged' && 'Traditional authentication flow (username still required)'}
        </p>

        <ControlField 
          label="User Verification"
          type="select"
          value={userVerification}
          onChange={(value) => setUserVerification(value as 'discouraged' | 'preferred' | 'required')}
          options={[
            { value: "discouraged", label: "Discouraged" },
            { value: "preferred", label: "Preferred" },
            { value: "required", label: "Required" }
          ]}
        />
        <p className="text-sm text-[var(--muted)] mt-1">
          {userVerification === 'required' && 'Always require PIN, biometric, or gesture verification'}
          {userVerification === 'preferred' && 'Use verification if available, but allow without it'}
          {userVerification === 'discouraged' && 'Prefer not to use verification (faster but less secure)'}
        </p>

        <ControlField 
          label="Attestation"
          type="select"
          value={attestation}
          onChange={(value) => setAttestation(value as 'none' | 'indirect' | 'direct' | 'enterprise')}
          options={[
            { value: "none", label: "None" },
            { value: "indirect", label: "Indirect" },
            { value: "direct", label: "Direct" },
            { value: "enterprise", label: "Enterprise" }
          ]}
        />
        <p className="text-sm text-[var(--muted)] mt-1">
          {attestation === 'none' && 'No attestation (fastest, most private)'}
          {attestation === 'indirect' && 'Anonymized attestation statement'}
          {attestation === 'direct' && 'Full attestation with authenticator identity'}
          {attestation === 'enterprise' && 'Enterprise attestation (requires special permissions)'}
        </p>
      </GeneratorControls>

      {/* Generated Credential Configuration */}
      <section className="mb-8">
        {credential && (
          <div className="space-y-6">
            <GeneratedValue value={credential.challenge} label="Challenge (Base64URL)" />

            <GeneratedValue value={credential.user.id} label="User ID (Base64URL)" />

            <GeneratedValue value={credential.credential.id} label="Generated Credential ID" />

            <div>
              <h3 className="font-medium mb-2">Public Key (ES256)</h3>
              <div className="rounded border border-[var(--border)] bg-[var(--band)] p-3">
                <div className="font-mono text-sm space-y-1">
                  <div><span className="text-[var(--muted)]">Key Type:</span> {credential.credential.publicKey.kty}</div>
                  <div><span className="text-[var(--muted)]">Algorithm:</span> {credential.credential.publicKey.alg}</div>
                  <div><span className="text-[var(--muted)]">Curve:</span> {credential.credential.publicKey.crv}</div>
                  <div><span className="text-[var(--muted)]">X Coordinate:</span> <span className="break-all">{credential.credential.publicKey.x}</span></div>
                  <div><span className="text-[var(--muted)]">Y Coordinate:</span> <span className="break-all">{credential.credential.publicKey.y}</span></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Configuration Summary</h3>
              <div className="rounded border border-[var(--accent-border)] bg-[var(--accent-soft)] p-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div><strong>Authenticator:</strong> {authenticatorType === 'platform' ? 'Platform (Built-in)' : 'Cross-Platform (External)'}</div>
                  <div><strong>Resident Key:</strong> {residentKey}</div>
                  <div><strong>User Verification:</strong> {userVerification}</div>
                  <div><strong>Attestation:</strong> {attestation}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {credential && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">WebAuthn Creation Options</h3>
            <CodeBlock
              code={createCredentialOptions}
              language="javascript"
              filename="webauthn-credential.js"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Complete Implementation Example</h3>
            <CodeBlock
              code={implementationExample}
              language="javascript"
              filename="webauthn-implementation.js"
            />
          </div>
        </div>
      )}

      {/* WebAuthn vs Traditional Authentication */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">WebAuthn vs Traditional Authentication</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-[var(--border)] rounded-lg">
            <thead>
              <tr className="bg-[var(--band)]">
                <th className="border border-[var(--border)] px-4 py-2 text-left">Feature</th>
                <th className="border border-[var(--border)] px-4 py-2 text-left">Passwords</th>
                <th className="border border-[var(--border)] px-4 py-2 text-left">SMS 2FA</th>
                <th className="border border-[var(--border)] px-4 py-2 text-left">TOTP Apps</th>
                <th className="border border-[var(--border)] px-4 py-2 text-left">WebAuthn</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[var(--border)] px-4 py-2 font-semibold">Phishing Resistance</td>
                <td className="border border-[var(--border)] px-4 py-2 text-red-600">✗ Vulnerable</td>
                <td className="border border-[var(--border)] px-4 py-2 text-red-600">✗ Vulnerable</td>
                <td className="border border-[var(--border)] px-4 py-2 text-yellow-600">~ Partially</td>
                <td className="border border-[var(--border)] px-4 py-2 text-green-600">✓ Resistant</td>
              </tr>
              <tr className="bg-[var(--band)]">
                <td className="border border-[var(--border)] px-4 py-2 font-semibold">User Experience</td>
                <td className="border border-[var(--border)] px-4 py-2 text-red-600">Poor</td>
                <td className="border border-[var(--border)] px-4 py-2 text-red-600">Poor</td>
                <td className="border border-[var(--border)] px-4 py-2 text-yellow-600">Moderate</td>
                <td className="border border-[var(--border)] px-4 py-2 text-green-600">Excellent</td>
              </tr>
              <tr>
                <td className="border border-[var(--border)] px-4 py-2 font-semibold">Setup Complexity</td>
                <td className="border border-[var(--border)] px-4 py-2 text-green-600">Simple</td>
                <td className="border border-[var(--border)] px-4 py-2 text-green-600">Simple</td>
                <td className="border border-[var(--border)] px-4 py-2 text-yellow-600">Moderate</td>
                <td className="border border-[var(--border)] px-4 py-2 text-yellow-600">Moderate</td>
              </tr>
              <tr className="bg-[var(--band)]">
                <td className="border border-[var(--border)] px-4 py-2 font-semibold">Privacy</td>
                <td className="border border-[var(--border)] px-4 py-2 text-yellow-600">Moderate</td>
                <td className="border border-[var(--border)] px-4 py-2 text-red-600">Poor</td>
                <td className="border border-[var(--border)] px-4 py-2 text-green-600">Good</td>
                <td className="border border-[var(--border)] px-4 py-2 text-green-600">Excellent</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>🏆 Why WebAuthn Wins:</strong> WebAuthn provides the strongest security against phishing 
            and credential theft while offering the best user experience through biometric authentication.
          </p>
        </div>
      </section>

      {/* Real-World Implementation Guide */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Real-World Implementation Examples</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Express.js Server Integration</h3>
            <CodeBlock
              filename="webauthn-server.js"
              code={`const express = require('express');
const crypto = require('crypto');
const app = express();

// Store challenges and credentials (use database in production)
const challenges = new Map();
const credentials = new Map();

// Registration endpoint
app.post('/webauthn/register/begin', (req, res) => {
  const { username } = req.body;
  const challenge = crypto.randomBytes(32);
  
  challenges.set(username, challenge);
  
  res.json({
    challenge: challenge.toString('base64url'),
    rp: {
      id: 'example.com',
      name: 'Example Corp'
    },
    user: {
      id: crypto.randomBytes(32).toString('base64url'),
      name: username,
      displayName: username
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' },  // ES256
      { alg: -257, type: 'public-key' } // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'preferred'
    },
    attestation: 'none'
  });
});

// Registration completion
app.post('/webauthn/register/complete', (req, res) => {
  const { username, credential } = req.body;
  const challenge = challenges.get(username);
  
  if (!challenge) {
    return res.status(400).json({ error: 'Invalid challenge' });
  }
  
  // Verify credential (simplified - use proper WebAuthn library)
  // Store credential for user
  credentials.set(username, {
    credentialId: credential.id,
    publicKey: credential.response.publicKey
  });
  
  challenges.delete(username);
  res.json({ success: true });
});

app.listen(3000);`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Frontend Registration Flow</h3>
            <CodeBlock
              filename="webauthn-client.js"
              code={`class WebAuthnAuth {
  async register(username) {
    try {
      // Get registration options from server
      const response = await fetch('/webauthn/register/begin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      const options = await response.json();
      
      // Convert challenge and user ID from base64url
      options.challenge = this.base64urlToBuffer(options.challenge);
      options.user.id = this.base64urlToBuffer(options.user.id);
      
      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: options
      });
      
      // Send credential to server
      const registerResponse = await fetch('/webauthn/register/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          credential: {
            id: credential.id,
            rawId: this.bufferToBase64url(credential.rawId),
            response: {
              clientDataJSON: this.bufferToBase64url(credential.response.clientDataJSON),
              attestationObject: this.bufferToBase64url(credential.response.attestationObject)
            }
          }
        })
      });
      
      const result = await registerResponse.json();
      
      if (result.success) {
        console.log('Registration successful!');
        return true;
      } else {
        throw new Error('Registration failed');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }
  
  base64urlToBuffer(base64url) {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
  }
  
  bufferToBase64url(buffer) {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}

// Usage
const auth = new WebAuthnAuth();
document.getElementById('register-btn').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  auth.register(username);
});`}
            />
          </div>
        </div>
      </section>

      {/* Browser Support & Compatibility */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Browser Support & Device Compatibility</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Platform Authenticators</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🍎</span>
                <div>
                  <p className="font-semibold">Touch ID / Face ID</p>
                  <p className="text-sm text-[var(--muted)]">macOS Safari 14+, iOS Safari 14+</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🪟</span>
                <div>
                  <p className="font-semibold">Windows Hello</p>
                  <p className="text-sm text-[var(--muted)]">Edge 18+, Chrome 72+, Firefox 87+</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="font-semibold">Android Biometrics</p>
                  <p className="text-sm text-[var(--muted)]">Chrome 70+, Android 7.0+</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Cross-Platform Authenticators</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔑</span>
                <div>
                  <p className="font-semibold">YubiKey</p>
                  <p className="text-sm text-[var(--muted)]">USB-A, USB-C, NFC, Lightning</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="font-semibold">Google Titan</p>
                  <p className="text-sm text-[var(--muted)]">USB-A, USB-C, NFC, Bluetooth</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-semibold">Mobile as Authenticator</p>
                  <p className="text-sm text-[var(--muted)]">iOS 16+, Android 9+ with Google Play Services</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>📊 Current Adoption:</strong> WebAuthn is supported by 95%+ of browsers globally. 
            Major platforms include GitHub, Microsoft, Google, Adobe, PayPal, and many financial institutions.
          </p>
        </div>
      </section>

      {/* Business Benefits */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Business Benefits of WebAuthn</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">💰 Cost Reduction</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
              <li>Eliminate SMS costs (can be $0.05+ per message)</li>
              <li>Reduce password reset support tickets by 90%</li>
              <li>Lower security incident response costs</li>
              <li>Decrease compliance audit overhead</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">📈 User Experience</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
              <li>50%+ faster login times vs traditional 2FA</li>
              <li>Works offline (no connectivity required)</li>
              <li>No app installation needed</li>
              <li>Consistent across devices and browsers</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">🛡️ Security Improvements</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-purple-700">
              <li>99.9%+ reduction in account takeovers</li>
              <li>Complete phishing protection</li>
              <li>No shared secrets to compromise</li>
              <li>Cryptographic proof of user presence</li>
            </ul>
          </div>
        </div>
      </section>

      <SecurityNotice type="warning">
        <strong>WebAuthn Security Notes:</strong>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Always validate the origin in clientDataJSON on the server</li>
          <li>Store and verify the credential public key securely</li>
          <li>Use HTTPS for all WebAuthn operations</li>
          <li>Implement proper challenge verification to prevent replay attacks</li>
          <li>Consider user verification requirements based on your security needs</li>
          <li>Platform authenticators provide better UX but are device-specific</li>
          <li>Biometric data is processed locally and never transmitted</li>
        </ul>
      </SecurityNotice>

      <RelatedContent {...webauthnRelated} />
    </GeneratorLayout>
  )
}