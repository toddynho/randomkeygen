export type Algorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'ES256'

export const algorithmInfo: Record<Algorithm, { bits: number; bytes: number; description: string; type: string }> = {
  HS256: { bits: 256, bytes: 32, description: 'HMAC with SHA-256 (most common)', type: 'HMAC' },
  HS384: { bits: 384, bytes: 48, description: 'HMAC with SHA-384', type: 'HMAC' },
  HS512: { bits: 512, bytes: 64, description: 'HMAC with SHA-512 (strongest)', type: 'HMAC' },
  RS256: { bits: 256, bytes: 256, description: 'RSA with SHA-256 (public key)', type: 'RSA' },
  ES256: { bits: 256, bytes: 32, description: 'ECDSA with SHA-256 (modern)', type: 'ECDSA' },
}

export interface DecodedJwt {
  header: Record<string, any>
  payload: Record<string, any>
  signature: string
}

// Decode a JWT without verification (for inspection/demo purposes)
export function decodeJWT(token: string): DecodedJwt | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('Invalid JWT format')

    const header = JSON.parse(atob(parts[0]))
    const payload = JSON.parse(atob(parts[1]))

    return { header, payload, signature: parts[2] }
  } catch {
    return null
  }
}

// Encode a JWT header and payload (no signing — demo only)
export function encodeJWTDemo(header: any, payload: any): string | null {
  try {
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '')
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '')
    return `${encodedHeader}.${encodedPayload}.signature_placeholder`
  } catch {
    return null
  }
}

export const DEMO_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
