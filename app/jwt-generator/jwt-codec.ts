export type JwtAlg = 'HS256' | 'HS384' | 'HS512' | 'RS256'

const HMAC_HASH: Record<Exclude<JwtAlg, 'RS256'>, 'SHA-256' | 'SHA-384' | 'SHA-512'> = {
  HS256: 'SHA-256',
  HS384: 'SHA-384',
  HS512: 'SHA-512',
}

export interface InspectedJwt {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  signingInput: string
  algorithm: string | null
}

export type VerifyResult =
  | { status: 'valid' }
  | { status: 'invalid'; message: string }
  | { status: 'unchecked'; message: string }
  | { status: 'unsupported'; message: string }
  | { status: 'malformed'; message: string }

export function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export function base64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function encodeJson(value: unknown): string {
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(value)))
}

function decodeJsonPart(part: string): unknown {
  const json = new TextDecoder().decode(base64UrlToBytes(part))
  return JSON.parse(json)
}

function asObject(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be a JSON object.`)
  }
  return value as Record<string, unknown>
}

function pemToDer(pem: string): ArrayBuffer {
  const body = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s+/g, '')
  if (!body) throw new Error('Key PEM is empty.')
  const binary = atob(body)
  const copy = new ArrayBuffer(binary.length)
  const bytes = new Uint8Array(copy)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return copy
}

function derToPem(der: ArrayBuffer, label: 'PRIVATE KEY' | 'PUBLIC KEY'): string {
  const bytes = new Uint8Array(der)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const lines = (btoa(binary).match(/.{1,64}/g) ?? []).join('\n')
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----\n`
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

async function hmacKey(secret: string, alg: Exclude<JwtAlg, 'RS256'>, usage: 'sign' | 'verify') {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: HMAC_HASH[alg] },
    false,
    [usage],
  )
}

async function signInput(signingInput: string, alg: JwtAlg, keyMaterial: string): Promise<Uint8Array> {
  const data = new TextEncoder().encode(signingInput)
  if (alg === 'RS256') {
    const key = await crypto.subtle.importKey(
      'pkcs8',
      pemToDer(keyMaterial),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign'],
    )
    return new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, data))
  }
  const key = await hmacKey(keyMaterial, alg, 'sign')
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, data))
}

export function randomHmacSecret(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return bytesToBase64Url(bytes)
}

export async function generateRsaKeyPair(): Promise<{ privateKeyPem: string; publicKeyPem: string }> {
  const pair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  )
  const privateKey = await crypto.subtle.exportKey('pkcs8', pair.privateKey)
  const publicKey = await crypto.subtle.exportKey('spki', pair.publicKey)
  return {
    privateKeyPem: derToPem(privateKey, 'PRIVATE KEY'),
    publicKeyPem: derToPem(publicKey, 'PUBLIC KEY'),
  }
}

export async function signJwt(headerJson: string, payloadJson: string, alg: JwtAlg, keyMaterial: string): Promise<string> {
  if (!keyMaterial.trim()) {
    throw new Error(alg === 'RS256' ? 'Paste or generate an RSA private key.' : 'Enter an HMAC secret.')
  }
  let header: Record<string, unknown>
  let payload: Record<string, unknown>
  try {
    header = asObject(JSON.parse(headerJson), 'Header')
    payload = asObject(JSON.parse(payloadJson), 'Payload')
  } catch (error) {
    if (error instanceof Error && /JSON object/.test(error.message)) throw error
    throw new Error('Header and payload must be valid JSON.')
  }
  const signedHeader = { ...header, alg, typ: typeof header.typ === 'string' ? header.typ : 'JWT' }
  const signingInput = `${encodeJson(signedHeader)}.${encodeJson(payload)}`
  const signature = bytesToBase64Url(await signInput(signingInput, alg, keyMaterial))
  return `${signingInput}.${signature}`
}

export function inspectJwt(token: string): InspectedJwt {
  const parts = token.trim().split('.')
  if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
    throw new Error('A JWT has three base64url parts separated by dots.')
  }
  let header: Record<string, unknown>
  let payload: Record<string, unknown>
  try {
    header = asObject(decodeJsonPart(parts[0]), 'Header')
    payload = asObject(decodeJsonPart(parts[1]), 'Payload')
  } catch {
    throw new Error('Header or payload is not base64url-encoded JSON.')
  }
  const algorithm = typeof header.alg === 'string' ? header.alg : null
  return {
    header,
    payload,
    signature: parts[2],
    signingInput: `${parts[0]}.${parts[1]}`,
    algorithm,
  }
}

const HMAC_ALGS = new Set<JwtAlg>(['HS256', 'HS384', 'HS512'])

export async function verifyJwt(token: string, keyMaterial: string): Promise<VerifyResult> {
  let inspected: InspectedJwt
  try {
    inspected = inspectJwt(token)
  } catch (error) {
    return { status: 'malformed', message: error instanceof Error ? error.message : 'Invalid JWT.' }
  }

  const alg = inspected.algorithm
  if (alg === 'none') {
    return { status: 'invalid', message: 'The none algorithm is rejected. A token with alg "none" is not signed.' }
  }
  if (alg !== 'HS256' && alg !== 'HS384' && alg !== 'HS512' && alg !== 'RS256') {
    return {
      status: 'unsupported',
      message: alg
        ? `${alg} is not verified here. This tool checks HS256, HS384, HS512, and RS256.`
        : 'The header has no alg, so the signature was not checked.',
    }
  }
  if (!keyMaterial.trim()) {
    return {
      status: 'unchecked',
      message: alg === 'RS256'
        ? 'Paste the RS256 public key (a PUBLIC KEY PEM) to verify the signature.'
        : 'Enter the HMAC secret to verify the signature.',
    }
  }

  try {
    const data = new TextEncoder().encode(inspected.signingInput)
    const rawSignature = base64UrlToBytes(inspected.signature)
    const signature = new ArrayBuffer(rawSignature.byteLength)
    new Uint8Array(signature).set(rawSignature)
    if (alg === 'RS256') {
      const key = await crypto.subtle.importKey(
        'spki',
        pemToDer(keyMaterial),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify'],
      )
      const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data)
      return valid
        ? { status: 'valid' }
        : { status: 'invalid', message: 'The signature does not match this public key.' }
    }
    const key = await hmacKey(keyMaterial, alg, 'sign')
    const expected = new Uint8Array(await crypto.subtle.sign('HMAC', key, data))
    return timingSafeEqual(expected, rawSignature)
      ? { status: 'valid' }
      : { status: 'invalid', message: 'The signature does not match this secret.' }
  } catch {
    return {
      status: 'invalid',
      message: HMAC_ALGS.has(alg)
        ? 'Could not check the HMAC signature with that secret.'
        : 'Could not read the public key. RS256 verification expects a PUBLIC KEY PEM (SPKI), not the private key.',
    }
  }
}
