import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideChecklist } from '@/app/components/guide/GuideChecklist'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'
import { GuideRows } from '@/app/components/guide/GuideRows'

const CHECKLIST_ITEMS = [
  'Use different keys for different environments (dev/staging/prod)',
  'Implement proper key rotation strategy',
  'Validate tokens in every service independently',
  'Use appropriate token lifetimes (short for access, longer for service tokens)',
  'Implement proper error handling without information leakage',
  'Add distributed tracing for auth flows',
  'Monitor for suspicious authentication patterns',
  'Use mTLS for service-to-service communication in production',
  'Implement token blacklist/revocation mechanism',
  'Cache validation results with appropriate TTL',
  'Use service mesh for automatic token propagation',
  'Implement proper audience validation per service',
  'Add circuit breakers for key service dependencies',
  'Test token validation under failure conditions',
  'Implement graceful degradation when auth services are down',
]

export const metadata: Metadata = {
  title: 'JWT Best Practices for Microservices Architecture | RandomKeygen',
  description: 'Complete guide to implementing JWT tokens in microservices: token propagation, validation strategies, key management, and security considerations.',
  keywords: ['JWT microservices', 'microservices authentication', 'JWT token propagation', 'distributed authentication', 'JWT security', 'service mesh auth'],
  openGraph: {
    title: 'JWT Best Practices for Microservices Architecture',
    description: 'Learn how to implement secure JWT authentication across microservices with proper token propagation and validation.',
    url: 'https://randomkeygen.com/guides/jwt-microservices',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/jwt-microservices',
  },
}

export default function JwtMicroservicesPage() {
  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Developer security</p>
        <h1>JWT Best Practices for Microservices</h1>
        <p className="guide-deck">
          Comprehensive guide to implementing secure and scalable JWT authentication in microservices
          architecture, covering token propagation, validation strategies, and distributed security.
        </p>
      </header>

      <h2 id="challenges">Microservices Authentication Challenges</h2>
      <p>
        Microservices introduce unique authentication challenges that traditional monolithic
        applications don't face. JWT tokens provide an elegant solution, but proper
        implementation is critical for security and scalability.
      </p>

      <h3>Common Microservices Auth Problems</h3>
      <ul>
        <li><strong>Token propagation:</strong> How to pass authentication context between services</li>
        <li><strong>Distributed validation:</strong> Each service validating tokens independently</li>
        <li><strong>Key management:</strong> Distributing signing keys securely across services</li>
        <li><strong>Token refresh:</strong> Handling expiration in service-to-service calls</li>
        <li><strong>Authorization decisions:</strong> Fine-grained permissions across services</li>
      </ul>

      <GuideCallout kind="success" label="Why JWT for Microservices:">
        JWTs are stateless, self-contained, and
        can be validated independently by each service without database lookups, making them
        ideal for distributed architectures.
      </GuideCallout>

      <h2 id="token-types">Token Types in Microservices</h2>

      <h3>User Access Tokens</h3>
      <GuideRows items={[
        ['Purpose', 'User authentication'],
        ['Lifetime', '15-60 minutes'],
        ['Contains', 'User ID, roles, permissions'],
        ['Propagated', 'Through request headers'],
      ]} />

      <h3>Service-to-Service Tokens</h3>
      <GuideRows items={[
        ['Purpose', 'Service authentication'],
        ['Lifetime', '5-15 minutes'],
        ['Contains', 'Service ID, scopes'],
        ['Propagated', 'Automatically by service mesh'],
      ]} />

      <h3>Token Structure for Microservices</h3>
      <GuideCodeBlock
        label="JSON"
        code={`// User Access Token Example
{
  "iss": "https://auth.company.com",
  "aud": ["api.company.com", "billing.company.com"],
  "sub": "user123",
  "iat": 1640995200,
  "exp": 1640998800,
  "scope": "read:profile write:orders",
  "roles": ["user", "premium"],
  "permissions": ["orders:create", "profile:update"],
  "tenant_id": "org456"
}

// Service Token Example
{
  "iss": "https://auth.company.com",
  "aud": "internal.company.com",
  "sub": "service:order-processor",
  "iat": 1640995200,
  "exp": 1640996100,
  "scope": "payments:charge inventory:reserve",
  "service_version": "v1.2.3"
}`}
      />

      <h2 id="token-propagation">Token Propagation Strategies</h2>

      <h3>1. Manual Header Propagation</h3>
      <p>Each service manually forwards the JWT to downstream services:</p>

      <GuideCodeBlock
        label="Node.js"
        code={`// Node.js/Express example
async function callDownstreamService(userToken, data) {
  const response = await fetch('https://billing-service/api/charge', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${userToken}\`,
      'Content-Type': 'application/json',
      'X-Service-Name': 'order-service',
      'X-Request-ID': generateRequestId()
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(\`Billing service error: \${response.status}\`);
  }

  return response.json();
}`}
      />

      <h3>2. Service Mesh Integration</h3>
      <p>Use a service mesh like Istio or Linkerd for automatic token propagation:</p>

      <GuideCodeBlock
        label="YAML"
        code={`# Istio AuthorizationPolicy
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: jwt-propagation
spec:
  rules:
  - when:
    - key: request.headers[authorization]
      values: ["Bearer *"]
    to:
    - operation:
        methods: ["*"]
  - action: CUSTOM
    provider:
      name: jwt-propagator
    rules:
    - to:
      - operation:
          methods: ["*"]`}
      />

      <h3>3. Gateway-Level Token Management</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`// API Gateway middleware
class JWTGatewayMiddleware {
  async handleRequest(req, res, next) {
    try {
      // 1. Validate incoming user token
      const userToken = this.extractToken(req);
      const userClaims = await this.validateUserToken(userToken);

      // 2. Generate service token for downstream calls
      const serviceToken = await this.generateServiceToken({
        user_id: userClaims.sub,
        user_roles: userClaims.roles,
        original_token: userToken,
        service_chain: req.headers['x-service-chain'] || []
      });

      // 3. Add tokens to request context
      req.user = userClaims;
      req.serviceToken = serviceToken;
      req.headers['x-service-token'] = serviceToken;

      next();
    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
}`}
      />

      <h2 id="distributed-validation">Distributed Validation Strategies</h2>

      <h3>1. Shared Secret Validation</h3>
      <p>All services share the same HMAC secret (suitable for small, trusted environments):</p>

      <GuideCodeBlock
        label="Node.js"
        code={`// Shared secret approach
const jwt = require('jsonwebtoken');

class SharedSecretValidator {
  constructor(secret) {
    this.secret = secret;
  }

  validateToken(token) {
    return jwt.verify(token, this.secret, {
      algorithms: ['HS256'],
      issuer: process.env.JWT_ISSUER,
      audience: process.env.SERVICE_NAME
    });
  }
}

// Use in microservice
const validator = new SharedSecretValidator(process.env.JWT_SECRET);

app.use('/api/*', (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    req.user = validator.validateToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});`}
      />

      <h3>2. Public Key Validation (JWKS)</h3>
      <p>Services fetch public keys from a centralized JWKS endpoint:</p>

      <GuideCodeBlock
        label="Node.js"
        code={`const jwksClient = require('jwks-rsa');

class JWKSValidator {
  constructor(jwksUri) {
    this.client = jwksClient({
      jwksUri,
      requestHeaders: {},
      timeout: 30000,
      jwksRequestsPerMinute: 5,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 600000 // 10 minutes
    });
  }

  async getSigningKey(kid) {
    const key = await this.client.getSigningKey(kid);
    return key.getPublicKey();
  }

  async validateToken(token) {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || !decoded.header.kid) {
      throw new Error('Invalid token format');
    }

    const publicKey = await this.getSigningKey(decoded.header.kid);

    return jwt.verify(token, publicKey, {
      algorithms: ['RS256', 'ES256'],
      issuer: process.env.JWT_ISSUER,
      audience: process.env.SERVICE_NAME
    });
  }
}

// Auto-refresh keys periodically
setInterval(async () => {
  try {
    await validator.client.getKeys();
  } catch (error) {
    console.error('Failed to refresh JWKS:', error);
  }
}, 300000); // 5 minutes`}
      />

      <h3>3. Cached Validation</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`const NodeCache = require('node-cache');

class CachedJWTValidator {
  constructor(jwksValidator) {
    this.jwksValidator = jwksValidator;
    this.cache = new NodeCache({
      stdTTL: 300, // 5 minutes
      checkperiod: 60 // Check for expired keys every minute
    });
  }

  async validateToken(token) {
    // Create a cache key from token signature
    const tokenParts = token.split('.');
    const signatureHash = crypto
      .createHash('sha256')
      .update(tokenParts[2])
      .digest('hex');

    const cacheKey = \`jwt:\${signatureHash}\`;

    // Check cache first
    let payload = this.cache.get(cacheKey);
    if (payload) {
      // Still need to check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        this.cache.del(cacheKey);
        throw new Error('Token expired');
      }
      return payload;
    }

    // Validate and cache
    payload = await this.jwksValidator.validateToken(token);
    this.cache.set(cacheKey, payload);

    return payload;
  }
}`}
      />

      <h2 id="key-management">Key Management in Microservices</h2>

      <h3>Centralized Key Management</h3>
      <p>Use a centralized key management service for rotating keys:</p>

      <GuideCodeBlock
        label="Node.js"
        code={`class KeyManagementService {
  constructor(keyServiceUrl, apiKey) {
    this.keyServiceUrl = keyServiceUrl;
    this.apiKey = apiKey;
    this.keyCache = new Map();
    this.refreshInterval = null;
  }

  async start() {
    await this.refreshKeys();

    // Refresh keys every 5 minutes
    this.refreshInterval = setInterval(() => {
      this.refreshKeys().catch(console.error);
    }, 300000);
  }

  async refreshKeys() {
    try {
      const response = await fetch(\`\${this.keyServiceUrl}/keys\`, {
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`,
          'X-Service-Name': process.env.SERVICE_NAME
        }
      });

      const keys = await response.json();

      // Update cache with new keys
      for (const key of keys) {
        this.keyCache.set(key.kid, {
          publicKey: key.x5c ? this.parseX5C(key.x5c[0]) : key.n,
          algorithm: key.alg,
          validFrom: new Date(key.nbf * 1000),
          validUntil: new Date(key.exp * 1000)
        });
      }

      // Remove expired keys
      for (const [kid, keyInfo] of this.keyCache) {
        if (keyInfo.validUntil < new Date()) {
          this.keyCache.delete(kid);
        }
      }

      console.log(\`Refreshed \${keys.length} keys\`);
    } catch (error) {
      console.error('Key refresh failed:', error);
    }
  }

  getKey(kid) {
    const keyInfo = this.keyCache.get(kid);
    if (!keyInfo || keyInfo.validUntil < new Date()) {
      return null;
    }
    return keyInfo;
  }
}`}
      />

      <h3>Environment-Specific Key Rotation</h3>
      <GuideCodeBlock
        label="Kubernetes"
        code={`# Kubernetes Secret with automatic rotation
apiVersion: v1
kind: Secret
metadata:
  name: jwt-keys
  annotations:
    vault.hashicorp.com/agent-inject: "true"
    vault.hashicorp.com/role: "jwt-key-reader"
    vault.hashicorp.com/agent-inject-secret-key: "jwt/current"
    vault.hashicorp.com/agent-inject-template-key: |
      {{- with secret "jwt/current" -}}
      {{ .Data.data.private_key }}
      {{- end -}}
type: Opaque
data:
  private-key: "{{ vault_secret }}"
  public-key: "{{ vault_public_key }}"

---
# CronJob for key rotation
apiVersion: batch/v1
kind: CronJob
metadata:
  name: rotate-jwt-keys
spec:
  schedule: "0 2 * * 0"  # Weekly on Sunday 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: key-rotator
            image: vault:latest
            command:
            - /bin/sh
            - -c
            - |
              # Generate new key pair
              vault write jwt/rotate

              # Update all services
              kubectl rollout restart deployment -l app.type=microservice`}
      />

      <h2 id="service-to-service">Service-to-Service Authentication</h2>

      <h3>OAuth2 Client Credentials Flow</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`class ServiceAuthenticator {
  constructor(clientId, clientSecret, tokenEndpoint) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.tokenEndpoint = tokenEndpoint;
    this.tokenCache = null;
    this.tokenExpiry = 0;
  }

  async getServiceToken(scopes = []) {
    // Check if cached token is still valid
    if (this.tokenCache && Date.now() < this.tokenExpiry) {
      return this.tokenCache;
    }

    // Request new token
    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': \`Basic \${Buffer.from(\`\${this.clientId}:\${this.clientSecret}\`).toString('base64')}\`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: scopes.join(' ')
      })
    });

    const tokenData = await response.json();

    // Cache token with safety margin
    this.tokenCache = tokenData.access_token;
    this.tokenExpiry = Date.now() + (tokenData.expires_in - 60) * 1000;

    return this.tokenCache;
  }

  async authenticatedFetch(url, options = {}, requiredScopes = []) {
    const token = await this.getServiceToken(requiredScopes);

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': \`Bearer \${token}\`,
        'X-Service-Name': process.env.SERVICE_NAME,
        'X-Service-Version': process.env.SERVICE_VERSION
      }
    });
  }
}

// Usage in service
const serviceAuth = new ServiceAuthenticator(
  process.env.SERVICE_CLIENT_ID,
  process.env.SERVICE_CLIENT_SECRET,
  process.env.AUTH_TOKEN_ENDPOINT
);

// Call another service
const billingResponse = await serviceAuth.authenticatedFetch(
  'https://billing-service/api/charge',
  {
    method: 'POST',
    body: JSON.stringify(chargeData)
  },
  ['billing:charge']
);`}
      />

      <h3>mTLS with JWT</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`const https = require('https');
const fs = require('fs');

class MTLSJWTClient {
  constructor(cert, key, ca) {
    this.httpsAgent = new https.Agent({
      cert: fs.readFileSync(cert),
      key: fs.readFileSync(key),
      ca: fs.readFileSync(ca),
      rejectUnauthorized: true
    });
  }

  async callService(url, token, data) {
    const response = await fetch(url, {
      method: 'POST',
      agent: this.httpsAgent,
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json',
        'X-Client-Cert-Subject': this.getCertSubject()
      },
      body: JSON.stringify(data)
    });

    return response.json();
  }

  getCertSubject() {
    // Extract subject from client certificate
    const cert = this.httpsAgent.options.cert;
    // Implementation depends on cert format
    return 'CN=order-service,O=Company,C=US';
  }
}`}
      />

      <h2 id="authorization">Authorization in Microservices</h2>

      <h3>Fine-Grained Permissions</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`class MicroserviceAuthorizer {
  constructor(serviceName) {
    this.serviceName = serviceName;
    this.permissionMap = {
      'orders:create': ['user', 'admin'],
      'orders:read': ['user', 'admin', 'support'],
      'orders:update': ['admin', 'order-service'],
      'orders:delete': ['admin'],
      'payments:charge': ['order-service', 'billing-service'],
      'inventory:reserve': ['order-service', 'inventory-service']
    };
  }

  authorize(token, requiredPermission) {
    const claims = jwt.verify(token, this.getValidationKey());

    // Check direct permission
    if (claims.permissions?.includes(requiredPermission)) {
      return true;
    }

    // Check role-based permission
    const allowedRoles = this.permissionMap[requiredPermission] || [];
    const userRoles = claims.roles || [];

    if (userRoles.some(role => allowedRoles.includes(role))) {
      return true;
    }

    // Check service-to-service permission
    if (claims.sub?.startsWith('service:')) {
      const serviceName = claims.sub.split(':')[1];
      return allowedRoles.includes(serviceName);
    }

    return false;
  }

  middleware(requiredPermission) {
    return (req, res, next) => {
      try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: 'No token provided' });
        }

        if (this.authorize(token, requiredPermission)) {
          next();
        } else {
          res.status(403).json({
            error: 'Insufficient permissions',
            required: requiredPermission
          });
        }
      } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
      }
    };
  }
}

// Usage
const authorizer = new MicroserviceAuthorizer('order-service');

app.post('/api/orders',
  authorizer.middleware('orders:create'),
  async (req, res) => {
    // Order creation logic
  }
);`}
      />

      <h3>Context-Aware Authorization</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`class ContextualAuthorizer extends MicroserviceAuthorizer {
  async authorizeWithContext(token, permission, context = {}) {
    const baseAuthorized = this.authorize(token, permission);
    if (!baseAuthorized) {
      return false;
    }

    const claims = jwt.verify(token, this.getValidationKey());

    // Tenant isolation
    if (context.tenantId && claims.tenant_id !== context.tenantId) {
      return false;
    }

    // Resource ownership
    if (context.resourceOwnerId &&
        claims.sub !== context.resourceOwnerId &&
        !claims.roles?.includes('admin')) {
      return false;
    }

    // Time-based restrictions
    if (context.businessHoursOnly && !this.isBusinessHours()) {
      return claims.roles?.includes('admin') || false;
    }

    // Location-based restrictions
    if (context.allowedRegions &&
        !context.allowedRegions.includes(claims.region)) {
      return false;
    }

    return true;
  }

  isBusinessHours() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Monday-Friday, 9 AM - 6 PM
    return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
  }
}`}
      />

      <h2 id="observability">Error Handling &amp; Observability</h2>

      <h3>Distributed Tracing with JWT</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`const opentelemetry = require('@opentelemetry/api');

class TracingJWTMiddleware {
  constructor(validator) {
    this.validator = validator;
    this.tracer = opentelemetry.trace.getTracer('jwt-auth');
  }

  middleware() {
    return async (req, res, next) => {
      const span = this.tracer.startSpan('jwt.validation');

      try {
        const token = req.headers.authorization?.split(' ')[1];

        // Add token info to span (without sensitive data)
        if (token) {
          const decoded = jwt.decode(token, { complete: true });
          span.setAttributes({
            'jwt.algorithm': decoded?.header.alg,
            'jwt.issuer': decoded?.payload.iss,
            'jwt.subject': decoded?.payload.sub?.substring(0, 8) + '...',
            'jwt.audience': Array.isArray(decoded?.payload.aud)
              ? decoded.payload.aud.join(',')
              : decoded?.payload.aud
          });
        }

        const payload = await this.validator.validateToken(token);

        span.setAttributes({
          'jwt.valid': true,
          'jwt.expires_at': payload.exp,
          'user.id': payload.sub,
          'user.roles': payload.roles?.join(',') || ''
        });

        req.user = payload;
        req.span = span;
        next();

      } catch (error) {
        span.recordException(error);
        span.setAttributes({
          'jwt.valid': false,
          'jwt.error': error.message
        });

        res.status(401).json({
          error: 'Authentication failed',
          trace_id: span.spanContext().traceId
        });
      } finally {
        span.end();
      }
    };
  }
}`}
      />

      <h3>Security Monitoring</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`class JWTSecurityMonitor {
  constructor(alertingService) {
    this.alertingService = alertingService;
    this.suspiciousPatterns = {
      rapid_failures: { threshold: 10, window: 60000 }, // 10 failures in 1 min
      algorithm_confusion: { threshold: 5, window: 300000 }, // 5 attempts in 5 min
      expired_token_reuse: { threshold: 3, window: 600000 } // 3 attempts in 10 min
    };
    this.eventCounts = new Map();
  }

  recordEvent(type, metadata = {}) {
    const key = \`\${type}:\${metadata.ip || 'unknown'}\`;
    const now = Date.now();

    if (!this.eventCounts.has(key)) {
      this.eventCounts.set(key, []);
    }

    const events = this.eventCounts.get(key);
    events.push({ timestamp: now, metadata });

    // Clean old events
    const pattern = this.suspiciousPatterns[type];
    if (pattern) {
      const cutoff = now - pattern.window;
      const recentEvents = events.filter(e => e.timestamp > cutoff);
      this.eventCounts.set(key, recentEvents);

      // Check threshold
      if (recentEvents.length >= pattern.threshold) {
        this.alertingService.sendAlert({
          type: 'jwt_security_incident',
          pattern: type,
          count: recentEvents.length,
          window: pattern.window,
          source_ip: metadata.ip,
          details: recentEvents
        });
      }
    }
  }

  monitorValidation(req, error = null) {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        this.recordEvent('expired_token_reuse', {
          ip: req.ip,
          user_agent: req.headers['user-agent']
        });
      } else if (error.message.includes('algorithm')) {
        this.recordEvent('algorithm_confusion', {
          ip: req.ip,
          algorithm: error.algorithm
        });
      } else {
        this.recordEvent('rapid_failures', { ip: req.ip });
      }
    }
  }
}`}
      />

      <h2 id="performance">Performance Optimization</h2>

      <h3>Connection Pooling &amp; Caching</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`class OptimizedJWTValidator {
  constructor() {
    this.jwksClient = jwksClient({
      jwksUri: process.env.JWKS_URI,
      cache: true,
      cacheMaxEntries: 50,
      cacheMaxAge: 600000, // 10 minutes
      rateLimit: true,
      jwksRequestsPerMinute: 10
    });

    // Redis for blacklist caching
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      connectTimeout: 1000,
      lazyConnect: true,
      maxRetriesPerRequest: 3
    });

    // Local LRU cache for validated tokens
    this.tokenCache = new LRU({
      max: 1000,
      maxAge: 300000 // 5 minutes
    });
  }

  async validateToken(token) {
    // 1. Check local cache first
    const cached = this.tokenCache.get(token);
    if (cached) {
      return cached;
    }

    // 2. Parse token
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) {
      throw new Error('Invalid token format');
    }

    // 3. Check blacklist (with fallback)
    try {
      const blacklisted = await this.redis.get(\`bl:\${decoded.payload.jti}\`);
      if (blacklisted) {
        throw new Error('Token has been revoked');
      }
    } catch (redisError) {
      console.warn('Redis blacklist check failed:', redisError.message);
      // Continue validation - don't fail on Redis errors
    }

    // 4. Verify signature
    const publicKey = await this.jwksClient.getSigningKey(decoded.header.kid);
    const payload = jwt.verify(token, publicKey.getPublicKey(), {
      algorithms: ['RS256', 'ES256'],
      issuer: process.env.JWT_ISSUER,
      audience: process.env.SERVICE_NAME
    });

    // 5. Cache result
    this.tokenCache.set(token, payload);

    return payload;
  }

  // Batch validate multiple tokens
  async validateTokens(tokens) {
    const results = await Promise.allSettled(
      tokens.map(token => this.validateToken(token))
    );

    return results.map((result, index) => ({
      token: tokens[index],
      valid: result.status === 'fulfilled',
      payload: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason.message : null
    }));
  }
}`}
      />

      <h3>Async Validation</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`class AsyncJWTProcessor {
  constructor(validator) {
    this.validator = validator;
    this.queue = new Queue('jwt-validation', {
      redis: process.env.REDIS_URL
    });

    this.setupWorker();
  }

  setupWorker() {
    this.queue.process('validate', async (job) => {
      const { token, requestId } = job.data;

      try {
        const payload = await this.validator.validateToken(token);

        // Store result for pickup
        await this.redis.setex(
          \`result:\${requestId}\`,
          60, // 1 minute TTL
          JSON.stringify({ valid: true, payload })
        );

      } catch (error) {
        await this.redis.setex(
          \`result:\${requestId}\`,
          60,
          JSON.stringify({ valid: false, error: error.message })
        );
      }
    });
  }

  // For non-critical paths
  async validateAsync(token) {
    const requestId = uuidv4();

    await this.queue.add('validate', { token, requestId });

    return requestId;
  }

  async getValidationResult(requestId) {
    const result = await this.redis.get(\`result:\${requestId}\`);
    return result ? JSON.parse(result) : null;
  }
}`}
      />

      <h2 id="deployment">Deployment &amp; DevOps</h2>

      <h3>Docker Configuration</h3>
      <GuideCodeBlock
        label="Dockerfile"
        code={`# Multi-stage build for security
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# JWT validation keys
COPY --chown=nextjs:nodejs keys/ ./keys/
RUN chmod 600 ./keys/*

USER nextjs

EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \\
  CMD node health-check.js || exit 1

CMD ["node", "server.js"]`}
      />

      <h3>Kubernetes JWT Secrets</h3>
      <GuideCodeBlock
        label="Kubernetes"
        code={`apiVersion: v1
kind: ConfigMap
metadata:
  name: jwt-config
data:
  issuer: "https://auth.company.com"
  audience: "api.company.com"
  algorithm: "RS256"

---
apiVersion: v1
kind: Secret
metadata:
  name: jwt-keys
type: kubernetes.io/tls
data:
  tls.crt: # Base64 encoded public key
  tls.key: # Base64 encoded private key (for signing services only)

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
    spec:
      containers:
      - name: order-service
        image: order-service:latest
        env:
        - name: JWT_ISSUER
          valueFrom:
            configMapKeyRef:
              name: jwt-config
              key: issuer
        - name: JWT_AUDIENCE
          valueFrom:
            configMapKeyRef:
              name: jwt-config
              key: audience
        - name: JWT_PUBLIC_KEY_PATH
          value: "/etc/jwt/tls.crt"
        volumeMounts:
        - name: jwt-keys
          mountPath: "/etc/jwt"
          readOnly: true
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: jwt-keys
        secret:
          secretName: jwt-keys`}
      />

      <h2 id="testing">Testing Strategies</h2>

      <h3>JWT Mock Testing</h3>
      <GuideCodeBlock
        label="Node.js"
        code={`// Test utilities
class JWTTestUtils {
  static createTestToken(claims = {}, options = {}) {
    const defaultClaims = {
      iss: 'test-issuer',
      aud: 'test-service',
      sub: 'test-user-123',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      roles: ['user'],
      permissions: ['read:profile']
    };

    return jwt.sign(
      { ...defaultClaims, ...claims },
      options.secret || 'test-secret',
      { algorithm: options.algorithm || 'HS256' }
    );
  }

  static createExpiredToken(claims = {}) {
    return this.createTestToken({
      ...claims,
      exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
    });
  }

  static createServiceToken(serviceName, scopes = []) {
    return this.createTestToken({
      sub: \`service:\${serviceName}\`,
      scope: scopes.join(' '),
      aud: 'internal.company.com'
    });
  }
}

// Integration tests
describe('Microservice JWT Authentication', () => {
  let app, request;

  beforeEach(() => {
    app = createTestApp();
    request = supertest(app);
  });

  it('should accept valid user token', async () => {
    const token = JWTTestUtils.createTestToken({
      sub: 'user123',
      roles: ['premium']
    });

    const response = await request
      .get('/api/orders')
      .set('Authorization', \`Bearer \${token}\`);

    expect(response.status).toBe(200);
  });

  it('should reject expired token', async () => {
    const token = JWTTestUtils.createExpiredToken();

    const response = await request
      .get('/api/orders')
      .set('Authorization', \`Bearer \${token}\`);

    expect(response.status).toBe(401);
    expect(response.body.error).toContain('expired');
  });

  it('should handle service-to-service calls', async () => {
    const serviceToken = JWTTestUtils.createServiceToken('billing-service', [
      'orders:read'
    ]);

    const response = await request
      .get('/api/orders/internal')
      .set('Authorization', \`Bearer \${serviceToken}\`);

    expect(response.status).toBe(200);
  });
});`}
      />

      <h2 id="security-checklist">Security Checklist</h2>
      <p>Microservices JWT security checklist:</p>
      <GuideChecklist items={CHECKLIST_ITEMS} storageKey="rk-jwt-microservices-checklist" />

      <section className="guide-related" aria-labelledby="related-tools-title">
        <h2 id="related-tools-title">Related tools</h2>
        <div className="guide-card-grid">
          <Link href="/jwt-secret"><strong>JWT Secret Generator →</strong><span>Generate secure keys for microservice JWT signing</span></Link>
          <Link href="/guides/jwt-security"><strong>JWT Security Best Practices →</strong><span>Comprehensive JWT security guide</span></Link>
          <Link href="/guides/jwt-token-validation"><strong>JWT Token Validation Guide →</strong><span>Step-by-step token validation implementation</span></Link>
          <Link href="/rsa-key"><strong>RSA Key Generator →</strong><span>Generate RSA key pairs for asymmetric JWT signing</span></Link>
        </div>
      </section>
    </article>
  )
}
