'use client'

import { ReactNode } from 'react'
import { CodeBlock, SecurityNotice, TerminalCommand } from '../components'
import { Algorithm, algorithmInfo } from './jwt-utils'

/** Template-style section heading (19px / 700) with optional lede. */
export function SectionHeading({ title, lede }: { title: string; lede?: string }) {
  return (
    <>
      <h2 className={`text-20 font-bold tracking-[-0.01em] ${lede ? 'mb-2' : 'mb-4'}`}>{title}</h2>
      {lede && <p className="mb-5 text-15 leading-[1.6] text-[var(--muted)]">{lede}</p>}
    </>
  )
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`card p-5 ${className}`}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Algorithm comparison                                                */
/* ------------------------------------------------------------------ */

export function AlgorithmComparison({ algorithm }: { algorithm: Algorithm }) {
  const rows: Array<{
    alg: Algorithm
    type: string
    keyLength: string
    security: string
    performance: string
    useCases: string
    divider?: boolean
  }> = [
    { alg: 'HS256', type: 'HMAC-SHA256', keyLength: '256 bits (32 bytes)', security: 'Good', performance: 'Fastest', useCases: 'Most common, good for web apps' },
    { alg: 'HS384', type: 'HMAC-SHA384', keyLength: '384 bits (48 bytes)', security: 'Better', performance: 'Medium', useCases: 'Higher security requirements' },
    { alg: 'HS512', type: 'HMAC-SHA512', keyLength: '512 bits (64 bytes)', security: 'Best', performance: 'Slower', useCases: 'Maximum security, critical systems' },
    { alg: 'RS256', type: 'RSA-SHA256', keyLength: '2048+ bits', security: 'High', performance: 'Slow', useCases: 'Public key verification', divider: true },
    { alg: 'ES256', type: 'ECDSA-SHA256', keyLength: '256 bits', security: 'High', performance: 'Fast', useCases: 'Modern alternative to RSA' },
  ]

  const perfColor = (perf: string) =>
    perf === 'Fastest' || perf === 'Fast' ? 'text-[var(--accent-strong)]' : perf === 'Slow' ? 'text-[var(--danger-text)]' : 'text-[var(--warn-text)]'

  return (
    <section className="mb-8">
      <SectionHeading title="JWT Algorithm Comparison" />
      <div className="overflow-x-auto card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--band)]">
              <th className="border-b border-[var(--border)] px-4 py-3 text-left">Algorithm</th>
              <th className="border-b border-[var(--border)] px-4 py-3 text-left">Type</th>
              <th className="border-b border-[var(--border)] px-4 py-3 text-left">Key Length</th>
              <th className="border-b border-[var(--border)] px-4 py-3 text-left">Security</th>
              <th className="border-b border-[var(--border)] px-4 py-3 text-left">Performance</th>
              <th className="border-b border-[var(--border)] px-4 py-3 text-left">Use Cases</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.alg}
                className={`${row.divider ? 'border-t-2 border-[var(--border)]' : ''} ${
                  algorithm === row.alg ? 'bg-[var(--accent-soft)]' : ''
                }`}
              >
                <td className="px-4 py-3 font-mono font-semibold">{row.alg}</td>
                <td className="px-4 py-3">{row.type}</td>
                <td className="px-4 py-3">{row.keyLength}</td>
                <td className="px-4 py-3 text-[var(--accent-strong)]">{row.security}</td>
                <td className={`px-4 py-3 ${perfColor(row.performance)}`}>{row.performance}</td>
                <td className="px-4 py-3">{row.useCases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <SecurityNotice type="info" title="Current selection">
          <p className="text-sm">
            {algorithm} offers {algorithmInfo[algorithm].description.toLowerCase()} with {algorithmInfo[algorithm].bits}{' '}
            bits of security.
            {algorithm === 'HS256' && ' Perfect for most web applications.'}
            {algorithm === 'HS384' && ' Good balance of security and performance.'}
            {algorithm === 'HS512' && ' Maximum security for sensitive applications.'}
            {algorithm === 'RS256' && ' Ideal for distributed systems with public key verification.'}
            {algorithm === 'ES256' && ' Modern choice with excellent performance and security.'}
          </p>
        </SecurityNotice>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Usage examples (.env + Node quickstart)                             */
/* ------------------------------------------------------------------ */

export function UsageExamples({ algorithm, secret }: { algorithm: Algorithm; secret: string }) {
  return (
    <section className="mb-8">
      <SectionHeading title="Usage Examples" />
      <div className="space-y-4">
        <CodeBlock filename=".env" code={`JWT_SECRET=${secret || 'your-secret-here'}`} />
        <CodeBlock
          filename="Node.js (jsonwebtoken)"
          language="javascript"
          code={`const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: '123', role: 'admin' },
  process.env.JWT_SECRET,
  { algorithm: '${algorithm}', expiresIn: '24h' }
);`}
        />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Security best practices                                             */
/* ------------------------------------------------------------------ */

export function SecurityBestPractices() {
  return (
    <section className="mb-8">
      <SectionHeading title="JWT Secret Security Best Practices" />

      <div className="space-y-6">
        {/* Secret Storage */}
        <div>
          <h3 className="mb-3 text-16 font-semibold">Secure Secret Storage</h3>
          <Card>
            <ul className="list-inside list-disc space-y-2 text-sm">
              <li>
                <strong>Environment Variables:</strong> Store secrets in environment variables, never in source code
              </li>
              <li>
                <strong>Secret Management:</strong> Use dedicated services like AWS Secrets Manager, Azure Key Vault, or
                HashiCorp Vault
              </li>
              <li>
                <strong>File Permissions:</strong> If storing in files, use strict permissions (600 or 640)
              </li>
              <li>
                <strong>Version Control:</strong> Never commit secrets to Git repositories
              </li>
              <li>
                <strong>Container Security:</strong> Use Docker secrets or Kubernetes secrets in containerized
                environments
              </li>
            </ul>
          </Card>
        </div>

        {/* Secret Rotation */}
        <div>
          <h3 className="mb-3 text-16 font-semibold">Secret Rotation Strategy</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <h4 className="mb-2 text-15 font-semibold text-[var(--accent-strong)]">✓ Do</h4>
              <ul className="space-y-1 text-sm">
                <li>Rotate secrets regularly (every 90 days minimum)</li>
                <li>Support multiple active secrets during rotation</li>
                <li>Use automated rotation tools when possible</li>
                <li>Log secret usage for audit trails</li>
                <li>Test rotation procedures regularly</li>
              </ul>
            </Card>
            <Card>
              <h4 className="mb-2 text-15 font-semibold text-[var(--danger-text)]">✗ Don&apos;t</h4>
              <ul className="space-y-1 text-sm">
                <li>Wait for security incidents to rotate</li>
                <li>Use the same secret across environments</li>
                <li>Forget to update all services simultaneously</li>
                <li>Leave old secrets active indefinitely</li>
                <li>Skip testing after rotation</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Algorithm Choice */}
        <div>
          <h3 className="mb-3 text-16 font-semibold">Choosing the Right Algorithm</h3>
          <div className="overflow-x-auto card p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="py-2 pr-4 text-left">Algorithm</th>
                  <th className="py-2 pr-4 text-left">Security Level</th>
                  <th className="py-2 pr-4 text-left">Performance</th>
                  <th className="py-2 text-left">Recommendation</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-b border-[var(--hairline)]">
                  <td className="py-2 pr-4 font-mono">HS256</td>
                  <td className="py-2 pr-4 text-[var(--accent-strong)]">Good</td>
                  <td className="py-2 pr-4 text-[var(--accent-strong)]">Fast</td>
                  <td className="py-2">Default choice for most applications</td>
                </tr>
                <tr className="border-b border-[var(--hairline)]">
                  <td className="py-2 pr-4 font-mono">HS384</td>
                  <td className="py-2 pr-4 text-[var(--accent-strong)]">Better</td>
                  <td className="py-2 pr-4 text-[var(--warn-text)]">Medium</td>
                  <td className="py-2">Use for higher security requirements</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono">HS512</td>
                  <td className="py-2 pr-4 text-[var(--accent-strong)]">Best</td>
                  <td className="py-2 pr-4 text-[var(--warn-text)]">Slower</td>
                  <td className="py-2">Maximum security, slight performance cost</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Production Checklist */}
        <div>
          <h3 className="mb-3 text-16 font-semibold">Production Deployment Checklist</h3>
          <Card>
            <ul className="space-y-2 text-sm">
              {[
                'Generate unique secrets for each environment (dev, staging, prod)',
                'Implement proper secret storage (environment variables or secret manager)',
                'Set up monitoring for failed JWT validation attempts',
                'Configure appropriate token expiration times',
                'Test secret rotation procedure',
                'Audit code for hardcoded secrets',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 h-4 w-4" disabled />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Advanced implementation examples (Express + Flask classes)          */
/* ------------------------------------------------------------------ */

export function AdvancedImplementationExamples({ algorithm }: { algorithm: Algorithm }) {
  return (
    <section className="mb-8">
      <SectionHeading title="Complete Implementation Examples" />

      {/* Express Middleware */}
      <div className="mb-6">
        <h3 className="mb-3 text-16 font-semibold">Express.js Middleware with Security</h3>
        <CodeBlock
          filename="middleware/auth.js"
          language="javascript"
          code={`const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Rate limiting for token endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many authentication attempts'
});

class JWTService {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.algorithm = '${algorithm}';

    if (!this.secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
  }

  generateToken(payload) {
    return jwt.sign({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      jti: require('crypto').randomBytes(16).toString('hex')
    }, this.secret, {
      algorithm: this.algorithm,
      expiresIn: '24h',
      issuer: 'your-app',
      audience: 'your-users'
    });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret, {
        algorithms: [this.algorithm],
        issuer: 'your-app',
        audience: 'your-users'
      });
    } catch (error) {
      throw new Error('Invalid token: ' + error.message);
    }
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const jwtService = new JWTService();
    req.user = jwtService.verifyToken(token);
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken, authLimiter };`}
        />
      </div>

      {/* Python Flask Example */}
      <div className="mb-6">
        <h3 className="mb-3 text-16 font-semibold">Python Flask with Error Handling</h3>
        <CodeBlock
          filename="jwt_auth.py"
          language="python"
          code={`import jwt
import os
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify

class JWTAuth:
    def __init__(self):
        self.secret = os.getenv('JWT_SECRET')
        self.algorithm = '${algorithm}'

        if not self.secret:
            raise ValueError('JWT_SECRET environment variable required')

    def generate_token(self, user_data):
        payload = {
            'user_id': user_data['id'],
            'email': user_data['email'],
            'role': user_data.get('role', 'user'),
            'exp': datetime.now(timezone.utc) + timedelta(hours=24),
            'iat': datetime.now(timezone.utc),
            'iss': 'your-app',
            'aud': 'your-users'
        }
        return jwt.encode(payload, self.secret, algorithm=self.algorithm)

    def verify_token(self, token):
        try:
            return jwt.decode(
                token, self.secret,
                algorithms=[self.algorithm],
                options={"verify_aud": True, "verify_iss": True}
            )
        except jwt.ExpiredSignatureError:
            raise ValueError('Token has expired')
        except jwt.InvalidTokenError:
            raise ValueError('Invalid token')

# Decorator for protected routes
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return jsonify({'error': 'Token missing'}), 401

        try:
            token = auth_header.split(' ')[1]
            jwt_auth = JWTAuth()
            payload = jwt_auth.verify_token(token)
            request.current_user = payload
        except (IndexError, ValueError) as e:
            return jsonify({'error': str(e)}), 401

        return f(*args, **kwargs)
    return decorated`}
        />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Security audit checklist                                            */
/* ------------------------------------------------------------------ */

export function SecurityAuditChecklist({ algorithm }: { algorithm: Algorithm }) {
  return (
    <section className="mb-8">
      <SectionHeading title="JWT Security Audit Checklist" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-16 font-semibold">Secret &amp; Configuration</h3>
          <div className="space-y-3 text-sm">
            {[
              `Secret meets minimum length (${algorithmInfo[algorithm].bytes}+ bytes for ${algorithm})`,
              'Algorithm explicitly specified in verification',
              'Issuer (iss) and audience (aud) claims validated',
              'Appropriate expiration times set (15min-1hr)',
              'Secret stored securely (env vars, not code)',
            ].map((item) => (
              <label key={item} className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 h-4 w-4" disabled />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-16 font-semibold">Implementation Security</h3>
          <div className="space-y-3 text-sm">
            {[
              'HTTPS enforced in production',
              'Rate limiting on auth endpoints',
              'Proper error handling (no info leakage)',
              'Token blacklist/revocation mechanism',
              'Minimal payload data (no sensitive info)',
            ].map((item) => (
              <label key={item} className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 h-4 w-4" disabled />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <SecurityNotice type="warning" title="Quick Security Test">
          <p className="mb-3 text-sm">Test your JWT implementation:</p>
          <ul className="space-y-1 text-sm">
            <li>• Try using &apos;none&apos; algorithm → should be rejected</li>
            <li>• Send expired token → should return 401</li>
            <li>• Modify token signature → should be invalid</li>
            <li>• Test with wrong audience/issuer → should be rejected</li>
          </ul>
        </SecurityNotice>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Framework implementation examples (Node, Python, Java, Go, C#, PHP) */
/* ------------------------------------------------------------------ */

export function ImplementationExamples({ algorithm, secret }: { algorithm: Algorithm; secret: string }) {
  return (
    <section className="mb-8">
      <SectionHeading title="Implementation Examples" />
      <div className="space-y-6">
        {/* Node.js Express */}
        <div>
          <h3 className="mb-3 text-16 font-semibold">Node.js with Express.js</h3>
          <CodeBlock
            filename="auth-middleware.js"
            language="javascript"
            code={`const jwt = require('jsonwebtoken');

// Generate token (login)
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: '${algorithm}',
    expiresIn: '24h',
    issuer: 'your-app-name',
    audience: 'your-app-users'
  });
}

// Verify token (middleware)
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['${algorithm}']
    });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}`}
          />
        </div>

        {/* Python Flask */}
        <div>
          <h3 className="mb-3 text-16 font-semibold">Python with Flask</h3>
          <CodeBlock
            filename="jwt_utils.py"
            language="python"
            code={`import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify

JWT_SECRET = os.getenv('JWT_SECRET')
JWT_ALGORITHM = '${algorithm}'

def generate_token(user_data):
    payload = {
        'user_id': user_data['id'],
        'email': user_data['email'],
        'exp': datetime.utcnow() + timedelta(hours=24),
        'iat': datetime.utcnow(),
        'iss': 'your-app-name'
    }

    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token missing'}), 401

        try:
            token = token.split(' ')[1]  # Remove 'Bearer '
            decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            request.user = decoded
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated`}
          />
        </div>

        {/* Java Spring */}
        <div>
          <h3 className="mb-3 text-16 font-semibold">Java with Spring Boot</h3>
          <CodeBlock
            filename="JwtUtil.java"
            language="java"
            code={`import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    @Value("\${jwt.secret}")
    private String jwtSecret;

    private final int jwtExpirationMs = 86400000; // 24 hours

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), SignatureAlgorithm.${algorithm.replace('HS', 'HS')})
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}`}
          />
        </div>

        {/* Go with Gin */}
        <div>
          <h3 className="mb-3 text-16 font-semibold">Go with Gin Framework</h3>
          <CodeBlock
            filename="jwt_middleware.go"
            language="go"
            code={`package middleware

import (
    "net/http"
    "strings"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v4"
)

var jwtSecret = []byte("${secret || 'your-secret-here'}")

type Claims struct {
    UserID string \`json:"user_id"\`
    Role   string \`json:"role"\`
    jwt.RegisteredClaims
}

func GenerateToken(userID, role string) (string, error) {
    claims := Claims{
        UserID: userID,
        Role:   role,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
            Issuer:    "your-app",
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtSecret)
}

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")

        claims := &Claims{}
        token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
            return jwtSecret, nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        c.Set("userID", claims.UserID)
        c.Set("role", claims.Role)
        c.Next()
    }
}`}
          />
        </div>

        {/* C# .NET Core */}
        <div>
          <h3 className="mb-3 text-16 font-semibold">C# with .NET Core</h3>
          <CodeBlock
            filename="JwtService.cs"
            language="csharp"
            code={`using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class JwtService
{
    private readonly string _secret = "${secret || 'your-secret-here'}";
    private readonly string _issuer = "your-app";

    public string GenerateToken(string userId, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat,
                DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _issuer,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal ValidateToken(string token)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
        var tokenHandler = new JwtSecurityTokenHandler();

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = true,
            ValidIssuer = _issuer,
            ValidateAudience = true,
            ValidAudience = _issuer,
            ClockSkew = TimeSpan.Zero
        };

        return tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
    }
}`}
          />
        </div>

        {/* PHP Laravel */}
        <div>
          <h3 className="mb-3 text-16 font-semibold">PHP with Laravel</h3>
          <CodeBlock
            filename="JwtHelper.php"
            language="php"
            code={`<?php

namespace App\\Helpers;

use Firebase\\JWT\\JWT;
use Firebase\\JWT\\Key;
use Exception;

class JwtHelper
{
    private static $secret = '${secret || 'your-secret-here'}';
    private static $issuer = 'your-app';
    private static $algorithm = 'HS256';

    public static function generateToken($userId, $role)
    {
        $payload = [
            'iss' => self::$issuer,
            'sub' => $userId,
            'role' => $role,
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ];

        return JWT::encode($payload, self::$secret, self::$algorithm);
    }

    public static function validateToken($token)
    {
        try {
            $decoded = JWT::decode($token, new Key(self::$secret, self::$algorithm));
            return (array) $decoded;
        } catch (Exception $e) {
            throw new Exception('Invalid token: ' . $e->getMessage());
        }
    }

    public static function refreshToken($token)
    {
        try {
            $decoded = self::validateToken($token);

            // Check if token expires in next hour
            if ($decoded['exp'] - time() < 3600) {
                return self::generateToken($decoded['sub'], $decoded['role']);
            }

            return $token; // No refresh needed
        } catch (Exception $e) {
            throw new Exception('Cannot refresh token: ' . $e->getMessage());
        }
    }
}

// Laravel Middleware
class JwtMiddleware
{
    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Token not provided'], 401);
        }

        try {
            $decoded = JwtHelper::validateToken($token);
            $request->merge(['user' => $decoded]);
            return $next($request);
        } catch (Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }
}`}
          />
        </div>

        {/* Security Tips */}
        <SecurityNotice type="warning" title="Implementation Security Tips">
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>
              Always validate the algorithm to prevent <strong>algorithm confusion attacks</strong>
            </li>
            <li>Set appropriate expiration times - shorter is more secure but less convenient</li>
            <li>Include audience and issuer claims for additional validation</li>
            <li>Use HTTPS only in production to prevent token interception</li>
            <li>Implement proper error handling without exposing sensitive information</li>
            <li>Consider implementing token blacklisting for logout functionality</li>
          </ul>
        </SecurityNotice>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Terminal commands                                                   */
/* ------------------------------------------------------------------ */

export function JwtTerminalCommands({ bytes, bits }: { bytes: number; bits: number }) {
  return (
    <section className="mb-8">
      <SectionHeading title="Generate in Terminal" lede="For production systems, generate secrets locally:" />
      <div className="space-y-3">
        <TerminalCommand command={`openssl rand -base64 ${bytes}`} description={`OpenSSL (${bits}-bit, base64)`} />
        <TerminalCommand command={`openssl rand -hex ${bytes}`} description={`OpenSSL (${bits}-bit, hex)`} />
        <TerminalCommand
          command={`python3 -c "import secrets; print(secrets.token_urlsafe(${bytes}))"`}
          description="Python secrets module"
        />
        <TerminalCommand
          command={`node -e "console.log(require('crypto').randomBytes(${bytes}).toString('base64'))"`}
          description="Node.js crypto"
        />
      </div>
    </section>
  )
}
