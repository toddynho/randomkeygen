import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'

import {
  EFF_WORDLIST,
  calculatePassphraseEntropy,
  generateString,
  generators,
  getSecureRandom,
  getSecureRandomInt,
} from '../app/lib/crypto.ts'

const originalCryptoDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto')

afterEach(() => {
  if (originalCryptoDescriptor) {
    Object.defineProperty(globalThis, 'crypto', originalCryptoDescriptor)
  } else {
    delete globalThis.crypto
  }
})

test('getSecureRandom fails closed when Web Crypto is unavailable', () => {
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: undefined,
  })

  assert.throws(
    () => getSecureRandom(16),
    /requires the Web Crypto API/,
  )
})

test('getSecureRandomInt rejects the uneven uint32 tail', () => {
  let calls = 0

  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: {
      getRandomValues(array) {
        calls += 1
        if (calls === 1) {
          array.set([0xff, 0xff, 0xff, 0xff])
        } else {
          array.set([0x00, 0x00, 0x00, 0x07])
        }
        return array
      },
    },
  })

  assert.equal(getSecureRandomInt(10), 7)
  assert.equal(calls, 2)
})

test('character generation uses only the requested alphabet', () => {
  const result = generateString(512, 'abcde')

  assert.equal(result.length, 512)
  assert.match(result, /^[abcde]+$/)
})

test('passphrase entropy is derived from the bundled vocabulary', () => {
  assert.equal(EFF_WORDLIST.length, 768)
  assert.equal(calculatePassphraseEntropy(3), 3 * Math.log2(768))
  assert.ok(calculatePassphraseEntropy(3) > 28)
  assert.ok(calculatePassphraseEntropy(3) < 29)
  assert.equal(generators.passphrase(3, '-').split('-').length, 3)
})

test('Azure-compatible hex material is generated from complete random bytes', () => {
  assert.match(generators.hex(16), /^[0-9a-f]{32}$/)
})
