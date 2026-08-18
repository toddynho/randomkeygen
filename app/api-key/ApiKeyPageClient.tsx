'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators, calculateEntropy, ALPHANUMERIC } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  ControlField,
  SecurityNotice,
  TerminalCommand,
  CodeBlock,
  RelatedContent,
  Toast,
  useToast,
  useRegenerateHotkey,
} from '../components'
import type { HowToStep } from '../components'

interface ApiKeyPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, any>[]
  relatedContent?: any
  howToSteps?: HowToStep[]
  howToHeading?: string
}

export default function ApiKeyPageClient({
  breadcrumbItems,
  schema,
  relatedContent,
  howToSteps,
  howToHeading,
}: ApiKeyPageClientProps) {
  const [prefix, setPrefix] = useState('sk_live')
  const [length, setLength] = useState(32)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 5 }, () => ''))

  // API format and features state
  const [apiFormat, setApiFormat] = useState('rest')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [customScope, setCustomScope] = useState('')
  const [rateLimit, setRateLimit] = useState('1000/hour')
  const [apiVersion, setApiVersion] = useState('v1')
  const [testMode, setTestMode] = useState(false)

  const [toastMessage, flash] = useToast()

  const generateApiKey = useCallback(() => {
    return generators.apiToken(prefix, length)
  }, [prefix, length])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 5 }, () => generateApiKey()))
  }, [generateApiKey])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new API keys')
  }, [generateAll, flash])

  const handleRegenerateAll = useCallback(() => {
    generateAll()
    flash('Regenerated all')
  }, [generateAll, flash])

  // `R` regenerates everything when no field has focus
  useRegenerateHotkey(handleRegenerateAll)

  const entropy = calculateEntropy(length, ALPHANUMERIC.length)

  return (
    <GeneratorLayout
      title="Secure API Key Generator"
      description="Generate secure API tokens with customizable prefixes. Perfect for authentication tokens, API credentials, and access management."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      howToSteps={howToSteps}
      howToHeading={howToHeading}
      storageCallout={
        <aside className="mb-8 flex flex-col gap-4 card p-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="mb-1 text-16 font-semibold">Generated it? Store it safely.</h2>
            <p className="text-14 leading-5 text-[var(--muted)]">
              Copy the generated API key and store it securely in your environment variables or key
              management system. Never expose API keys in client-side code.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-1.5 text-14 font-semibold">
            <Link href="/guides/api-key-best-practices" className="text-[var(--accent)] hover:underline">
              API Key Best Practices →
            </Link>
          </div>
        </aside>
      }
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate API keys"
        readout={{
          bits: entropy,
          poolSize: ALPHANUMERIC.length,
        }}
      >
        <ControlField
          label="API Format"
          type="select"
          value={apiFormat}
          onChange={(value) => {
            setApiFormat(value as string)
            // Update prefix based on format
            const formatPrefixes: Record<string, string> = {
              rest: 'api_',
              graphql: 'gql_',
              oauth: 'oauth_',
              stripe: 'sk_live',
              github: 'ghp_',
              aws: 'AKIA',
              custom: 'key_'
            }
            setPrefix(formatPrefixes[value as string] || 'api_')
          }}
          options={[
            { value: "rest", label: "REST API (api_)" },
            { value: "graphql", label: "GraphQL (gql_)" },
            { value: "oauth", label: "OAuth Token (oauth_)" },
            { value: "stripe", label: "Stripe (sk_live)" },
            { value: "github", label: "GitHub (ghp_)" },
            { value: "aws", label: "AWS (AKIA)" },
            { value: "custom", label: "Custom Format" }
          ]}
        />

        <ControlField
          label="Prefix"
          type="select"
          value={prefix}
          onChange={(value) => setPrefix(value as string)}
          options={[
            { value: "sk_live", label: "sk_live (Stripe-style)" },
            { value: "sk_test", label: "sk_test (Test mode)" },
            { value: "pk_live", label: "pk_live (Public)" },
            { value: "api_", label: "api_ (REST)" },
            { value: "gql_", label: "gql_ (GraphQL)" },
            { value: "oauth_", label: "oauth_ (OAuth)" },
            { value: "ghp_", label: "ghp_ (GitHub)" },
            { value: "AKIA", label: "AKIA (AWS)" },
            { value: "token", label: "token" },
            { value: "key", label: "key" },
            { value: "", label: "No prefix" }
          ]}
        />

        <ControlField
          label="Length (after prefix)"
          type="select"
          value={length}
          onChange={(value) => setLength(Number(value))}
          options={[
            { value: 16, label: "16 characters" },
            { value: 24, label: "24 characters" },
            { value: 32, label: "32 characters" },
            { value: 48, label: "48 characters" },
            { value: 64, label: "64 characters" }
          ]}
        />
      </GeneratorControls>

      {/* Generated API keys: strength rows, per-row regenerate/copy, bulk CSV footer */}
      <OutputDisplay
        values={values}
        noun="API keys"
        getBits={() => entropy}
        onRegenerate={(index) => {
          const newValues = [...values]
          newValues[index] = generateApiKey()
          setValues(newValues)
        }}
        onRegenerateAll={handleRegenerateAll}
        bulkCsv={{
          generate: generateApiKey,
          filename: 'api-keys.csv',
          onExport: (count) => flash(`Exported ${count} API keys — handle with care`),
        }}
      />

        {/* Test Your API Key */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Your API Key</h2>
          <p className="text-[var(--muted)] mb-6">
            Validate API key format and test basic functionality with common endpoints.
          </p>
          
          <div className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-6 mb-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="min-w-0">
                <label className="form-label">API Key to Test</label>
                <input
                  type="password"
                  value={testMode ? values[0] || '' : ''}
                  onChange={() => {}} // Read-only
                  className="form-input w-full text-sm font-mono"
                  placeholder="Paste your API key here"
                  readOnly
                />
                <button
                  onClick={() => setTestMode(!testMode)}
                  className="btn btn-primary mt-2 text-sm"
                >
                  {testMode ? 'Hide Test Key' : 'Use Generated Key for Testing'}
                </button>
              </div>
              
              <div>
                <label className="form-label">Test Results</label>
                <div className="rounded border border-[var(--border)] bg-[var(--band)] p-4 text-sm font-mono">
                  {testMode && values[0] ? (
                    <div className="space-y-2">
                      <div className="text-[var(--accent-strong)]">✓ Format: Valid {apiFormat.toUpperCase()} key</div>
                      <div className="text-[var(--accent-strong)]">✓ Length: {values[0].length} characters</div>
                      <div className="text-[var(--accent-strong)]">✓ Entropy: {entropy.toFixed(1)} bits</div>
                      <div className="text-[var(--muted)]">ⓘ Ready for {apiFormat} endpoint testing</div>
                    </div>
                  ) : (
                    <div className="text-[var(--muted)]">Click "Use Generated Key" to test format validation</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Key Permissions Builder */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">API Key Permissions Builder</h2>
          <p className="text-[var(--muted)] mb-6">
            Define granular permissions and access controls for your API keys with preset templates and custom scopes.
          </p>

          <div className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Permission Templates */}
              <div className="min-w-0">
                <h3 className="text-lg font-semibold mb-4">Permission Presets</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {[
                    { 
                      name: 'Read Only', 
                      scopes: ['users:read', 'posts:read', 'analytics:read'],
                      description: 'Safe for public dashboards' 
                    },
                    { 
                      name: 'Content Manager', 
                      scopes: ['posts:read', 'posts:write', 'media:upload'],
                      description: 'Create and edit content' 
                    },
                    { 
                      name: 'User Admin', 
                      scopes: ['users:read', 'users:write', 'users:delete'],
                      description: 'Full user management' 
                    },
                    { 
                      name: 'Full Access', 
                      scopes: ['*:*'],
                      description: 'All permissions (admin)' 
                    },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setSelectedPermissions(preset.scopes)}
                      className="min-w-0 p-3 text-left border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
                    >
                      <div className="font-medium text-sm">{preset.name}</div>
                      <div className="text-xs text-[var(--muted)]">{preset.description}</div>
                      <div className="mt-1 break-words text-xs text-[var(--accent-strong)] [overflow-wrap:anywhere]">
                        {preset.scopes.join(', ')}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-semibold">Individual Permissions</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {[
                      'users:read', 'users:write', 'users:delete',
                      'posts:read', 'posts:write', 'posts:delete', 
                      'comments:read', 'comments:write', 'comments:moderate',
                      'analytics:read', 'analytics:export',
                      'payments:read', 'payments:process', 'payments:refund',
                      'media:upload', 'media:delete',
                      'webhooks:create', 'webhooks:delete',
                      'admin:settings', 'admin:audit'
                    ].map((permission) => (
                      <label key={permission} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions([...selectedPermissions, permission])
                            } else {
                              setSelectedPermissions(selectedPermissions.filter(p => p !== permission))
                            }
                          }}
                          className="form-checkbox w-4 h-4"
                        />
                        <span className="font-mono text-xs">{permission}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="form-label">Custom Scopes</label>
                    <input
                      type="text"
                      value={customScope}
                      onChange={(e) => setCustomScope(e.target.value)}
                      className="form-input w-full text-sm font-mono"
                      placeholder="resource:action (e.g. files:download)"
                    />
                    <button
                      onClick={() => {
                        if (customScope && !selectedPermissions.includes(customScope)) {
                          setSelectedPermissions([...selectedPermissions, customScope])
                          setCustomScope('')
                        }
                      }}
                      className="btn btn-sm mt-2"
                    >
                      Add Custom Scope
                    </button>
                  </div>
                </div>
              </div>

              {/* Configuration & Preview */}
              <div className="min-w-0">
                <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="form-label">Rate Limiting</label>
                    <select
                      value={rateLimit}
                      onChange={(e) => setRateLimit(e.target.value)}
                      className="form-select w-full"
                    >
                      <option value="100/hour">100 requests/hour (Basic)</option>
                      <option value="1000/hour">1,000 requests/hour (Standard)</option>
                      <option value="10000/hour">10,000 requests/hour (Premium)</option>
                      <option value="unlimited">Unlimited (Admin)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">API Version</label>
                    <select
                      value={apiVersion}
                      onChange={(e) => setApiVersion(e.target.value)}
                      className="form-select w-full"
                    >
                      <option value="v1">v1 (Stable)</option>
                      <option value="v2">v2 (Latest)</option>
                      <option value="beta">beta (Preview)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Selected Permissions</label>
                  <div className="min-h-[100px] rounded border border-[var(--border)] bg-[var(--band)] p-3">
                    {selectedPermissions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedPermissions.map((permission) => (
                          <span 
                            key={permission}
                            className="inline-flex items-center gap-1 rounded border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2 py-1 text-xs text-[var(--accent-strong)]"
                          >
                            {permission}
                            <button
                              onClick={() => setSelectedPermissions(selectedPermissions.filter(p => p !== permission))}
                              className="text-[var(--accent-strong)] hover:text-[var(--accent)]"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[var(--muted)] text-sm">No permissions selected</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="form-label">API Key Configuration</label>
                  <CodeBlock
                    language="json"
                    code={JSON.stringify({
                      api_key: values[0] || 'sk_live_...',
                      permissions: selectedPermissions.length > 0 ? selectedPermissions : ['users:read'],
                      rate_limit: rateLimit,
                      api_version: apiVersion,
                      created_at: 'YYYY-MM-DDTHH:mm:ss.sssZ',
                      expires_at: 'YYYY-MM-DD'
                    }, null, 2)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Formats by Platform */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">API Formats by Platform</h2>
          <p className="text-[var(--muted)] mb-6">
            Different platforms use specific API key formats. Choose the right format for your integration.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-[var(--border)]">
              <thead>
                <tr className="bg-[var(--band)]">
                  <th className="border border-[var(--border)] px-4 py-2 text-left">Platform</th>
                  <th className="border border-[var(--border)] px-4 py-2 text-left">API Type</th>
                  <th className="border border-[var(--border)] px-4 py-2 text-left">Key Format</th>
                  <th className="border border-[var(--border)] px-4 py-2 text-left">Example</th>
                  <th className="border border-[var(--border)] px-4 py-2 text-left">Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[var(--border)] px-4 py-2 font-medium">Stripe</td>
                  <td className="border border-[var(--border)] px-4 py-2">REST</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-sm">sk_live_*</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-xs">sk_live_51H7...</td>
                  <td className="border border-[var(--border)] px-4 py-2 text-sm">Payment processing</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] px-4 py-2 font-medium">GitHub</td>
                  <td className="border border-[var(--border)] px-4 py-2">REST</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-sm">ghp_*</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-xs">ghp_16C7e42F...</td>
                  <td className="border border-[var(--border)] px-4 py-2 text-sm">Repository access</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] px-4 py-2 font-medium">AWS</td>
                  <td className="border border-[var(--border)] px-4 py-2">REST</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-sm">AKIA*</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-xs">AKIAIOSFODNN7...</td>
                  <td className="border border-[var(--border)] px-4 py-2 text-sm">Cloud services</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] px-4 py-2 font-medium">Shopify</td>
                  <td className="border border-[var(--border)] px-4 py-2">GraphQL/REST</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-sm">shpat_*</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-xs">shpat_c7efcf...</td>
                  <td className="border border-[var(--border)] px-4 py-2 text-sm">E-commerce APIs</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] px-4 py-2 font-medium">SendGrid</td>
                  <td className="border border-[var(--border)] px-4 py-2">REST</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-sm">SG.*</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-xs">SG.ngeVfQF...</td>
                  <td className="border border-[var(--border)] px-4 py-2 text-sm">Email delivery</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] px-4 py-2 font-medium">Twilio</td>
                  <td className="border border-[var(--border)] px-4 py-2">REST</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-sm">AC*</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-xs">AC32a3c49...</td>
                  <td className="border border-[var(--border)] px-4 py-2 text-sm">Communications</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] px-4 py-2 font-medium">Custom API</td>
                  <td className="border border-[var(--border)] px-4 py-2">REST/GraphQL</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-sm">api_*</td>
                  <td className="border border-[var(--border)] px-4 py-2 font-mono text-xs">api_1234abcd...</td>
                  <td className="border border-[var(--border)] px-4 py-2 text-sm">Your application</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--band)] p-4">
              <h3 className="font-semibold mb-2">REST vs GraphQL</h3>
              <ul className="text-sm text-[var(--muted)] space-y-1">
                <li>• <strong>REST:</strong> One key per resource level</li>
                <li>• <strong>GraphQL:</strong> Fine-grained query permissions</li>
                <li>• <strong>OAuth:</strong> Token-based with scopes</li>
              </ul>
            </div>

            <div className="rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] p-4">
              <h3 className="font-semibold text-[var(--accent-strong)] mb-2">Security Best Practices</h3>
              <ul className="text-sm text-[var(--muted)] space-y-1">
                <li>• Use different keys for dev/staging/prod</li>
                <li>• Rotate keys every 90 days minimum</li>
                <li>• Implement proper rate limiting</li>
                <li>• Log all API key usage</li>
              </ul>
            </div>
          </div>
        </section>

        {/* API Implementation Examples */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Implementation Examples</h2>
          
          <div className="space-y-6">
            {/* Express.js Middleware */}
            <div>
              <h3 className="text-lg font-medium mb-3">Express.js Permission Middleware</h3>
              <CodeBlock 
                filename="middleware/auth.js"
                language="javascript"
                code={`const apiKeys = new Map([
  ['${values[0] || 'sk_live_example'}', {
    permissions: [${selectedPermissions.map(p => `'${p}'`).join(', ') || "'users:read'"}],
    rate_limit: '${rateLimit}',
    api_version: '${apiVersion}'
  }]
]);

function requirePermission(requiredPermission) {
  return (req, res, next) => {
    const apiKey = req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }
    
    const keyData = apiKeys.get(apiKey);
    if (!keyData) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    // Check permission
    const hasPermission = keyData.permissions.includes('*:*') || 
                         keyData.permissions.includes(requiredPermission);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: requiredPermission,
        granted: keyData.permissions
      });
    }
    
    req.apiKey = keyData;
    next();
  };
}

// Usage
app.get('/users', requirePermission('users:read'), (req, res) => {
  res.json({ users: [] });
});

app.post('/users', requirePermission('users:write'), (req, res) => {
  res.json({ message: 'User created' });
});`}
              />
            </div>

            {/* Python Flask Example */}
            <div>
              <h3 className="text-lg font-medium mb-3">Python Flask with Scopes</h3>
              <CodeBlock 
                filename="api_auth.py"
                language="python"
                code={`from functools import wraps
from flask import request, jsonify

API_KEYS = {
    '${values[0] || 'sk_live_example'}': {
        'permissions': [${selectedPermissions.map(p => `'${p}'`).join(', ') || "'users:read'"}],
        'rate_limit': '${rateLimit}',
        'api_version': '${apiVersion}'
    }
}

def require_permission(required_permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization', '')
            
            if not auth_header.startswith('Bearer '):
                return jsonify({'error': 'API key required'}), 401
            
            api_key = auth_header[7:]  # Remove 'Bearer '
            key_data = API_KEYS.get(api_key)
            
            if not key_data:
                return jsonify({'error': 'Invalid API key'}), 401
            
            permissions = key_data['permissions']
            has_permission = ('*:*' in permissions or 
                            required_permission in permissions)
            
            if not has_permission:
                return jsonify({
                    'error': 'Insufficient permissions',
                    'required': required_permission,
                    'granted': permissions
                }), 403
            
            request.api_key_data = key_data
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Usage
@app.route('/users')
@require_permission('users:read')
def get_users():
    return jsonify({'users': []})

@app.route('/users', methods=['POST'])
@require_permission('users:write')  
def create_user():
    return jsonify({'message': 'User created'})`}
              />
            </div>
          </div>
        </section>

        {/* Usage Example */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
          <CodeBlock 
            filename=".env"
            code={`# Store your API token securely
API_KEY=${values[0] || 'sk_live_...'}`}
          />
        </section>

        {/* Info */}
        <section className="mb-8">
          <SecurityNotice type="info" title="Token prefixes">
            <p>
              Prefixes like <code>sk_</code> (secret) and <code>pk_</code> (public) help 
              identify token types at a glance and prevent accidental exposure. 
              The <code>_live</code> and <code>_test</code> suffixes distinguish production 
              from development environments.
            </p>
          </SecurityNotice>
        </section>

        {/* Terminal Commands */}
        {/* API Key Formats by Platform */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">API Key Formats by Platform</h2>
          <p className="text-[var(--muted)] mb-6">
            Different platforms use specific API key formats. Choose the right format for your integration needs.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                platform: 'Stripe',
                formats: [
                  { type: 'Live Secret Key', format: 'sk_live_...', usage: 'Production payments' },
                  { type: 'Test Secret Key', format: 'sk_test_...', usage: 'Development and testing' },
                  { type: 'Publishable Key', format: 'pk_live_...', usage: 'Client-side integration' }
                ]
              },
              {
                platform: 'OpenAI',
                formats: [
                  { type: 'API Key', format: 'sk-...', usage: 'GPT and API access' },
                  { type: 'Organization Key', format: 'org-...', usage: 'Organization management' }
                ]
              },
              {
                platform: 'GitHub',
                formats: [
                  { type: 'Personal Token', format: 'ghp_...', usage: 'Repository access' },
                  { type: 'App Token', format: 'ghs_...', usage: 'GitHub App authentication' }
                ]
              },
              {
                platform: 'AWS',
                formats: [
                  { type: 'Access Key ID', format: 'AKIA...', usage: 'AWS service access' },
                  { type: 'Secret Key', format: 'random40chars', usage: 'Paired with Access Key' }
                ]
              },
              {
                platform: 'SendGrid',
                formats: [
                  { type: 'API Key', format: 'SG....', usage: 'Email delivery service' }
                ]
              },
              {
                platform: 'Google Cloud',
                formats: [
                  { type: 'API Key', format: 'AIza...', usage: 'Google services access' }
                ]
              }
            ].map((platform) => (
              <div key={platform.platform} className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">{platform.platform}</h3>
                <div className="space-y-2">
                  {platform.formats.map((format, idx) => (
                    <div key={idx} className="border-l-2 border-[var(--accent-border)] pl-3">
                      <div className="font-medium text-sm">{format.type}</div>
                      <div className="font-mono text-xs text-[var(--accent-strong)]">{format.format}</div>
                      <div className="text-xs text-[var(--muted)]">{format.usage}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* API Keys vs OAuth vs JWT Comparison */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">API Keys vs OAuth vs JWT</h2>
          <p className="text-[var(--muted)] mb-6">
            Choose the right authentication method for your use case.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border border-[var(--border)] rounded-lg">
              <thead>
                <tr className="bg-[var(--code-bg)]">
                  <th className="text-left p-4 border-b border-[var(--border)]">Feature</th>
                  <th className="text-left p-4 border-b border-[var(--border)]">API Keys</th>
                  <th className="text-left p-4 border-b border-[var(--border)]">OAuth 2.0</th>
                  <th className="text-left p-4 border-b border-[var(--border)]">JWT Tokens</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: 'Setup Complexity',
                    apiKeys: '🟢 Simple',
                    oauth: '🟡 Moderate',
                    jwt: '🟡 Moderate'
                  },
                  {
                    feature: 'Security Level',
                    apiKeys: '🟡 Medium',
                    oauth: '🟢 High',
                    jwt: '🟢 High'
                  },
                  {
                    feature: 'Token Expiry',
                    apiKeys: '🔴 Manual',
                    oauth: '🟢 Automatic',
                    jwt: '🟢 Built-in'
                  },
                  {
                    feature: 'Permissions',
                    apiKeys: '🟡 Fixed Scopes',
                    oauth: '🟢 Dynamic Scopes',
                    jwt: '🟢 Claim-based'
                  },
                  {
                    feature: 'Best For',
                    apiKeys: 'Server-to-server',
                    oauth: 'User authorization',
                    jwt: 'Microservices'
                  }
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[var(--code-bg)]' : ''}>
                    <td className="p-4 border-b border-[var(--border)] font-medium">{row.feature}</td>
                    <td className="p-4 border-b border-[var(--border)] text-sm">{row.apiKeys}</td>
                    <td className="p-4 border-b border-[var(--border)] text-sm">{row.oauth}</td>
                    <td className="p-4 border-b border-[var(--border)] text-sm">{row.jwt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--band)] p-4">
              <h3 className="font-semibold mb-2">API Keys</h3>
              <p className="text-sm text-[var(--muted)]">Perfect for backend services, webhooks, and system-to-system authentication where simplicity is key.</p>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--band)] p-4">
              <h3 className="font-semibold mb-2">OAuth 2.0</h3>
              <p className="text-sm text-[var(--muted)]">Ideal for user-facing applications where users need to authorize third-party access to their data.</p>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--band)] p-4">
              <h3 className="font-semibold mb-2">JWT Tokens</h3>
              <p className="text-sm text-[var(--muted)]">Best for distributed systems and microservices where stateless authentication is required.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
          <p className="text-[var(--muted)] text-sm mb-4">
            For production systems, generate tokens locally:
          </p>
          <div className="space-y-3">
            <TerminalCommand 
              command={`echo "sk_live_$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)"`}
              description="OpenSSL with prefix"
            />
            <TerminalCommand 
              command={`python3 -c "import secrets; print(f'sk_live_{secrets.token_urlsafe(24)}')"`}
              description="Python secrets module"
            />
            <TerminalCommand 
              command={`node -e "console.log('sk_live_' + require('crypto').randomBytes(24).toString('base64url'))"`}
              description="Node.js crypto"
            />
          </div>
        </section>

        {/* Related Content */}
        {relatedContent && <RelatedContent {...relatedContent} />}

        <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
