'use client'

import { useState, useEffect, useCallback } from 'react'
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
} from '../components'

interface AiKeyGeneratorPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, any>[]
  relatedContent?: any
}

export default function AiKeyGeneratorPageClient({ 
  breadcrumbItems, 
  schema, 
  relatedContent 
}: AiKeyGeneratorPageClientProps) {
  const [provider, setProvider] = useState('openai')
  const [keyType, setKeyType] = useState('api')
  const [length, setLength] = useState(48)
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 5 }, () => ''))

  // AI-specific features
  const [usageLimit, setUsageLimit] = useState('100k-tokens')
  const [costEstimate, setCostEstimate] = useState(true)
  const [modelAccess, setModelAccess] = useState<string[]>(['gpt-4', 'gpt-3.5-turbo'])

  const aiProviders = {
    openai: {
      name: 'OpenAI',
      prefix: 'sk-',
      description: 'GPT, DALL-E, Whisper, and other OpenAI models',
      keyTypes: [
        { value: 'api', label: 'API Key', format: 'sk-...', length: 48 },
        { value: 'org', label: 'Organization Key', format: 'org-...', length: 32 }
      ],
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'dall-e-3', 'whisper-1', 'tts-1']
    },
    anthropic: {
      name: 'Anthropic',
      prefix: 'sk-ant-api03-',
      description: 'Claude models and AI safety research tools',
      keyTypes: [
        { value: 'api', label: 'API Key', format: 'sk-ant-api03-...', length: 80 }
      ],
      models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-instant']
    },
    google: {
      name: 'Google AI',
      prefix: 'AIza',
      description: 'Gemini, PaLM, and Google Cloud AI services',
      keyTypes: [
        { value: 'api', label: 'API Key', format: 'AIza...', length: 35 },
        { value: 'service', label: 'Service Account', format: 'gcp-...', length: 64 }
      ],
      models: ['gemini-pro', 'gemini-pro-vision', 'palm-2', 'text-bison']
    },
    azure: {
      name: 'Azure OpenAI',
      prefix: '',
      description: 'Enterprise-grade OpenAI models through Azure',
      keyTypes: [
        { value: 'api', label: 'Subscription Key', format: '32-char-hex', length: 32 },
        { value: 'endpoint', label: 'Endpoint Key', format: 'resource-key', length: 64 }
      ],
      models: ['gpt-4', 'gpt-35-turbo', 'dall-e-3', 'whisper']
    },
    custom: {
      name: 'Custom AI Provider',
      prefix: 'ai-',
      description: 'Custom format for your AI service',
      keyTypes: [
        { value: 'api', label: 'API Key', format: 'ai-...', length: 48 },
        { value: 'bearer', label: 'Bearer Token', format: 'bearer-...', length: 64 }
      ],
      models: ['custom-model']
    }
  }

  const generateAiKey = useCallback(() => {
    const currentProvider = aiProviders[provider as keyof typeof aiProviders]
    const currentKeyType = currentProvider.keyTypes.find(kt => kt.value === keyType) || currentProvider.keyTypes[0]
    
    if (provider === 'azure' && keyType === 'api') {
      // Azure uses 32-character hex keys (16 cryptographically random bytes)
      return generators.hex(16)
    }
    
    return generators.apiToken(currentProvider.prefix, currentKeyType.length)
  }, [provider, keyType])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 5 }, () => generateAiKey()))
  }, [generateAiKey])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  // Update length when provider/keyType changes
  useEffect(() => {
    const currentProvider = aiProviders[provider as keyof typeof aiProviders]
    const currentKeyType = currentProvider.keyTypes.find(kt => kt.value === keyType) || currentProvider.keyTypes[0]
    setLength(currentKeyType.length)
    setModelAccess(currentProvider.models.slice(0, 2))
  }, [provider, keyType])

  // Azure API keys are hex (16-character pool); everything else is alphanumeric
  const poolSize = provider === 'azure' && keyType === 'api' ? 16 : ALPHANUMERIC.length
  const entropy = calculateEntropy(length, poolSize)
  const currentProvider = aiProviders[provider as keyof typeof aiProviders]

  return (
    <GeneratorLayout
      title="AI Key Generator"
      description="Generate secure API keys specifically for AI providers like OpenAI, Anthropic, Google AI. Features provider-specific formats and AI security best practices."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={generateAll}
        generateLabel="Generate AI keys"
        readout={{
          bits: entropy,
          poolSize,
          poolLabel: `${currentProvider.name} format · ${poolSize}-character pool`,
        }}
      >
        <ControlField
          label="AI Provider"
          type="select"
          value={provider}
          onChange={(value) => setProvider(value as string)}
          options={Object.entries(aiProviders).map(([key, provider]) => ({
            value: key,
            label: `${provider.name} - ${provider.description}`
          }))}
        />

        <ControlField
          label="Key Type"
          type="select"
          value={keyType}
          onChange={(value) => setKeyType(value as string)}
          options={currentProvider.keyTypes.map(kt => ({
            value: kt.value,
            label: `${kt.label} (${kt.format})`
          }))}
        />

        <ControlField
          label="Usage Limit"
          type="select"
          value={usageLimit}
          onChange={(value) => setUsageLimit(value as string)}
          options={[
            { value: '10k-tokens', label: '10K tokens/month ($2-5)' },
            { value: '100k-tokens', label: '100K tokens/month ($20-50)' },
            { value: '1m-tokens', label: '1M tokens/month ($200-500)' },
            { value: 'unlimited', label: 'Unlimited (Pay-as-you-go)' }
          ]}
        />
      </GeneratorControls>

      {/* Generated AI keys: strength rows, per-row regenerate/copy, bulk CSV footer */}
      <OutputDisplay
        values={values}
        noun="AI keys"
        getBits={() => entropy}
        onRegenerate={(index) => {
          const newValues = [...values]
          newValues[index] = generateAiKey()
          setValues(newValues)
        }}
        onRegenerateAll={generateAll}
        bulkCsv={{
          generate: generateAiKey,
          filename: 'ai-keys.csv',
        }}
      />

      {/* AI Provider Comparison Table */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🤖 OpenAI vs Anthropic vs Google AI - Key Format Guide</h2>
        <p className="text-[var(--muted)] mb-6">
          Each AI provider uses different key formats and authentication methods. Choose the right format for your AI integration.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border border-[var(--border)] rounded-lg">
            <thead>
              <tr className="bg-[var(--code-bg)]">
                <th className="text-left p-4 border-b border-[var(--border)]">Provider</th>
                <th className="text-left p-4 border-b border-[var(--border)]">Key Format</th>
                <th className="text-left p-4 border-b border-[var(--border)]">Models</th>
                <th className="text-left p-4 border-b border-[var(--border)]">Pricing</th>
                <th className="text-left p-4 border-b border-[var(--border)]">Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  provider: 'OpenAI',
                  format: 'sk-...',
                  models: 'GPT-4, GPT-3.5, DALL-E, Whisper',
                  pricing: '$0.01-$0.06/1K tokens',
                  bestFor: 'General AI applications'
                },
                {
                  provider: 'Anthropic',
                  format: 'sk-ant-api03-...',
                  models: 'Claude 3 (Opus, Sonnet, Haiku)',
                  pricing: '$0.25-$15/1M tokens',
                  bestFor: 'Safety-focused AI, long context'
                },
                {
                  provider: 'Google AI',
                  format: 'AIza...',
                  models: 'Gemini Pro, PaLM 2, Text Bison',
                  pricing: '$0.0005-$0.002/1K chars',
                  bestFor: 'Multimodal AI, cost optimization'
                },
                {
                  provider: 'Azure OpenAI',
                  format: '32-char hex',
                  models: 'GPT-4, GPT-3.5 (Enterprise)',
                  pricing: 'Custom enterprise rates',
                  bestFor: 'Enterprise, compliance'
                }
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-[var(--code-bg)]' : ''}>
                  <td className="p-4 border-b border-[var(--border)] font-medium">{row.provider}</td>
                  <td className="p-4 border-b border-[var(--border)] font-mono text-sm text-blue-400">{row.format}</td>
                  <td className="p-4 border-b border-[var(--border)] text-sm">{row.models}</td>
                  <td className="p-4 border-b border-[var(--border)] text-sm">{row.pricing}</td>
                  <td className="p-4 border-b border-[var(--border)] text-sm">{row.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI Rate Limiting and Key Security Guide */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🔐 AI Rate Limiting and Key Security Guide</h2>
        <p className="text-[var(--muted)] mb-6">
          AI APIs require special security considerations due to high costs and potential for abuse.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Rate Limiting Best Practices */}
          <div className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">🚦 Rate Limiting Best Practices</h3>
            
            <div className="space-y-4">
              <div className="border-l-2 border-blue-400 pl-4">
                <h4 className="font-medium">Token-based Limits</h4>
                <p className="text-sm text-[var(--muted)]">Set monthly token limits to prevent unexpected costs</p>
                <div className="font-mono text-xs text-blue-400 mt-1">100K tokens/month = ~$20-50</div>
              </div>
              
              <div className="border-l-2 border-green-400 pl-4">
                <h4 className="font-medium">Request Rate Limits</h4>
                <p className="text-sm text-[var(--muted)]">Prevent spam and abuse with per-minute limits</p>
                <div className="font-mono text-xs text-green-400 mt-1">60 requests/minute</div>
              </div>
              
              <div className="border-l-2 border-orange-400 pl-4">
                <h4 className="font-medium">Cost Monitoring</h4>
                <p className="text-sm text-[var(--muted)]">Monitor spending and set alerts</p>
                <div className="font-mono text-xs text-orange-400 mt-1">Alert at 80% of budget</div>
              </div>
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">🛡️ Security Recommendations</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-green-500 mt-1">✓</div>
                <div>
                  <h4 className="font-medium text-sm">Environment Variables</h4>
                  <p className="text-xs text-[var(--muted)]">Never hardcode AI keys in source code</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-green-500 mt-1">✓</div>
                <div>
                  <h4 className="font-medium text-sm">Key Rotation</h4>
                  <p className="text-xs text-[var(--muted)]">Rotate AI keys every 30-90 days</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-green-500 mt-1">✓</div>
                <div>
                  <h4 className="font-medium text-sm">Scope Restrictions</h4>
                  <p className="text-xs text-[var(--muted)]">Limit key access to required models only</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-green-500 mt-1">✓</div>
                <div>
                  <h4 className="font-medium text-sm">Usage Monitoring</h4>
                  <p className="text-xs text-[var(--muted)]">Track usage patterns for anomaly detection</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Examples */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Implementation Example</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Node.js Implementation */}
            <div>
              <h4 className="text-md font-medium mb-3">Node.js with Rate Limiting</h4>
              <CodeBlock 
                filename="ai-client.js"
                language="javascript"
                code={`const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');

// Rate limiting for AI endpoints
const aiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many AI requests, try again later',
  standardHeaders: true
});

const openai = new OpenAI({
  apiKey: '${values[0] || 'sk-your-openai-key'}',
});

// Track usage and costs
let monthlyTokens = 0;
const TOKEN_LIMIT = 100000;

app.post('/ai/chat', aiRateLimit, async (req, res) => {
  try {
    // Check token limit
    if (monthlyTokens >= TOKEN_LIMIT) {
      return res.status(429).json({ 
        error: 'Monthly token limit reached' 
      });
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: req.body.messages,
      max_tokens: 150
    });
    
    // Track usage
    monthlyTokens += response.usage.total_tokens;
    
    res.json({
      response: response.choices[0].message,
      tokens_used: response.usage.total_tokens,
      tokens_remaining: TOKEN_LIMIT - monthlyTokens
    });
    
  } catch (error) {
    res.status(500).json({ error: 'AI request failed' });
  }
});`}
              />
            </div>

            {/* Python Implementation */}
            <div>
              <h4 className="text-md font-medium mb-3">Python with Cost Monitoring</h4>
              <CodeBlock 
                filename="ai_security.py"
                language="python"
                code={`import openai
import time
from functools import wraps

openai.api_key = '${values[0] || 'sk-your-openai-key'}'

class AIUsageTracker:
    def __init__(self, monthly_limit=100000):
        self.monthly_tokens = 0
        self.monthly_limit = monthly_limit
        self.requests = []
    
    def check_rate_limit(self, max_per_minute=10):
        now = time.time()
        # Remove requests older than 1 minute
        self.requests = [req for req in self.requests 
                        if now - req < 60]
        
        if len(self.requests) >= max_per_minute:
            raise Exception("Rate limit exceeded")
        
        self.requests.append(now)
    
    def check_token_limit(self, tokens):
        if self.monthly_tokens + tokens > self.monthly_limit:
            raise Exception("Monthly token limit exceeded")

tracker = AIUsageTracker()

def ai_security_wrapper(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Check rate limits
        tracker.check_rate_limit()
        
        # Make AI request
        response = func(*args, **kwargs)
        
        # Track usage
        tokens_used = response.usage.total_tokens
        tracker.check_token_limit(tokens_used)
        tracker.monthly_tokens += tokens_used
        
        return response
    return wrapper

@ai_security_wrapper
def generate_ai_response(messages, max_tokens=150):
    return openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=max_tokens
    )`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Generate in Terminal */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
        <p className="text-[var(--muted)] text-sm mb-4">
          For production AI systems, generate keys locally:
        </p>
        <div className="space-y-3">
          <TerminalCommand 
            command={`echo "sk-$(openssl rand -base64 36 | tr -dc 'a-zA-Z0-9' | head -c 48)"`}
            description="OpenAI format key"
          />
          <TerminalCommand 
            command={`echo "sk-ant-api03-$(openssl rand -base64 60 | tr -dc 'a-zA-Z0-9' | head -c 72)"`}
            description="Anthropic format key"
          />
          <TerminalCommand 
            command={`echo "AIza$(openssl rand -base64 30 | tr -dc 'a-zA-Z0-9' | head -c 35)"`}
            description="Google AI format key"
          />
          <TerminalCommand 
            command={`python3 -c "import secrets; print(f'sk-{secrets.token_urlsafe(36)[:48]}')"`}
            description="Python AI key generation"
          />
        </div>
      </section>

      {/* Security Notice */}
      <SecurityNotice type="warning" title="AI Key Security">
        <ul className="space-y-2">
          <li>• AI keys can incur significant costs - always set usage limits</li>
          <li>• Monitor token consumption and set billing alerts</li>
          <li>• Rotate keys regularly, especially after team changes</li>
          <li>• Use separate keys for development and production</li>
          <li>• Never expose keys in client-side code or repositories</li>
          <li>• Consider using proxy services for additional security layers</li>
        </ul>
      </SecurityNotice>

      {/* Related Content */}
      {relatedContent && <RelatedContent {...relatedContent} />}
    </GeneratorLayout>
  )
}
