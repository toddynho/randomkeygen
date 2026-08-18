'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  ControlField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  TerminalCommand,
  BulkGenerator,
  CodeBlock,
} from '../components'

type KeySize = 128 | 192 | 256

interface AesKeyPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
}

export default function AesKeyPageClient({ breadcrumbItems }: AesKeyPageClientProps) {
  const [keySize, setKeySize] = useState<KeySize>(256)
  const [keys, setKeys] = useState<string[]>(() => Array.from({ length: 4 }, () => ''))
  const [ivs, setIvs] = useState<string[]>(() => Array.from({ length: 4 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generateKey = useCallback(() => generators.aesHex(keySize), [keySize])
  const generateIV = useCallback(() => generators.iv(), [])

  const generateAll = useCallback(() => {
    setKeys(Array.from({ length: 4 }, () => generateKey()))
    setIvs(Array.from({ length: 4 }, () => generateIV()))
  }, [generateKey, generateIV])

  const regenerateKey = useCallback((index: number) => {
    setKeys((current) => {
      const next = [...current]
      next[index] = generateKey()
      return next
    })
    setIvs((current) => {
      const next = [...current]
      next[index] = generateIV()
      return next
    })
  }, [generateKey, generateIV])

  const regenerateIv = useCallback((index: number) => {
    setIvs((current) => {
      const next = [...current]
      next[index] = generateIV()
      return next
    })
  }, [generateIV])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new keys')
  }, [generateAll, flash])

  const handleRegenerateAll = useCallback(() => {
    generateAll()
    flash('Regenerated all')
  }, [generateAll, flash])

  // `R` regenerates everything when no field has focus
  useRegenerateHotkey(handleRegenerateAll)

  // Hex-encoded raw random bytes: real entropy equals the key size.
  const getKeyBits = useCallback(() => keySize, [keySize])
  const getIvBits = useCallback(() => 128, [])

  return (
    <GeneratorLayout
      title="AES Encryption Keys"
      description="Generate keys for AES (Advanced Encryption Standard) symmetric encryption. Includes initialization vectors for CBC and GCM modes."
      breadcrumbItems={breadcrumbItems}
      storageCallout={
        <SecurityNotice type="warning" title="For demonstration only">
          <p>
            For production encryption, generate keys locally using the terminal commands below.
            Never transmit encryption keys over the network.
          </p>
          <p className="mt-2">
            <Link href="/guides/encryption-explained" className="font-semibold text-[var(--accent)] hover:underline">
              Encryption explained →
            </Link>
          </p>
        </SecurityNotice>
      }
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate keys"
        readout={{ bits: keySize, poolSize: 256, poolLabel: `${keySize / 8} random bytes` }}
      >
        <ControlField
          label="Key Size"
          htmlFor="aes-key-size"
          type="select"
          value={keySize}
          onChange={(value) => setKeySize(Number(value) as KeySize)}
          options={[
            { value: 128, label: 'AES-128 (16 bytes)' },
            { value: 192, label: 'AES-192 (24 bytes)' },
            { value: 256, label: 'AES-256 (32 bytes)' },
          ]}
        />
      </GeneratorControls>

      {/* Generated keys */}
      <OutputDisplay
        values={keys}
        noun="keys"
        getBits={getKeyBits}
        onRegenerate={regenerateKey}
        onRegenerateAll={handleRegenerateAll}
      />

      {/* Matching IVs (row N pairs with key N) */}
      <OutputDisplay
        values={ivs}
        noun="initialization vectors"
        getBits={getIvBits}
        onRegenerate={regenerateIv}
      />

      {/* Usage */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          filename="Python (cryptography)"
          language="python"
          code={`from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
import os

key = bytes.fromhex('${keys[0] || '...'}')
iv = bytes.fromhex('${ivs[0] || '...'}')

# Encrypt
cipher = Cipher(algorithms.AES(key), modes.GCM(iv))
encryptor = cipher.encryptor()
ciphertext = encryptor.update(b"Secret message") + encryptor.finalize()
tag = encryptor.tag

# Decrypt
cipher = Cipher(algorithms.AES(key), modes.GCM(iv, tag))
decryptor = cipher.decryptor()
plaintext = decryptor.update(ciphertext) + decryptor.finalize()`}
        />
      </section>

      {/* Bulk Generation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generateKey}
          getBits={getKeyBits}
          label="keys"
        />
      </section>

      {/* Terminal Commands */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
        <div className="space-y-3">
          <TerminalCommand
            command={`openssl rand -hex ${keySize / 8}`}
            description={`AES-${keySize} key`}
          />
          <TerminalCommand
            command="openssl rand -hex 16"
            description="IV (16 bytes)"
          />
          <TerminalCommand
            command={`python3 -c "import secrets; print(secrets.token_hex(${keySize / 8}))"`}
            description="Python"
          />
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
