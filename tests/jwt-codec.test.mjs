import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  generateRsaKeyPair,
  inspectJwt,
  signJwt,
  verifyJwt,
} from '../app/jwt-generator/jwt-codec.ts'

const HEADER = JSON.stringify({ alg: 'HS256', typ: 'JWT' })
const PAYLOAD = JSON.stringify({ sub: '1234567890', name: 'John Doe', iat: 1516239022 })
const SECRET = 'your-256-bit-secret'
const KNOWN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

test('HS256 matches the well-known jwt.io vector', async () => {
  const token = await signJwt(HEADER, PAYLOAD, 'HS256', SECRET)
  assert.equal(token, KNOWN_TOKEN)
  assert.deepEqual((await verifyJwt(token, SECRET)).status, 'valid')
  assert.deepEqual((await verifyJwt(token, 'wrong-secret')).status, 'invalid')
})

test('inspect reads header and payload without a key', () => {
  const inspected = inspectJwt(KNOWN_TOKEN)
  assert.equal(inspected.algorithm, 'HS256')
  assert.equal(inspected.payload.sub, '1234567890')
  assert.equal(inspected.signature.length > 10, true)
})

test('none and tampered tokens are rejected', async () => {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
  const payload = KNOWN_TOKEN.split('.')[1]
  const unsigned = `${header}.${payload}.e30`
  const noneResult = await verifyJwt(unsigned, SECRET)
  assert.equal(noneResult.status, 'invalid')
  assert.match(noneResult.message, /none/)

  const [h, p, sig] = KNOWN_TOKEN.split('.')
  const flipped = `${h}.${p}.${sig[0] === 'A' ? 'B' : 'A'}${sig.slice(1)}`
  assert.equal((await verifyJwt(flipped, SECRET)).status, 'invalid')
  assert.equal((await verifyJwt(KNOWN_TOKEN, '')).status, 'unchecked')
})

test('RS256 signs with a local key pair and verifies with the public key', async () => {
  const { privateKeyPem, publicKeyPem } = await generateRsaKeyPair()
  const token = await signJwt(HEADER, PAYLOAD, 'RS256', privateKeyPem)
  const inspected = inspectJwt(token)
  assert.equal(inspected.header.alg, 'RS256')
  assert.equal((await verifyJwt(token, publicKeyPem)).status, 'valid')
  assert.equal((await verifyJwt(token, privateKeyPem)).status, 'invalid')

  const other = await generateRsaKeyPair()
  assert.equal((await verifyJwt(token, other.publicKeyPem)).status, 'invalid')
})
