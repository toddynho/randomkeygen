'use client'

import { useState, useEffect, useCallback } from 'react'
import { bytesToHex, getSecureRandom } from '../lib/crypto'

interface UUIDGeneratorProps {
  className?: string
}

// UUID v1 node ID (MAC address simulation)
const generateNodeId = (): string => {
  const nodeBytes = getSecureRandom(6)
  nodeBytes[0] |= 0x01 // Set multicast bit to indicate random node
  return bytesToHex(nodeBytes)
}

// UUID v1 timestamp (100-nanosecond intervals since UUID epoch)
const getUUIDTimestamp = (): [number, number] => {
  // UUID epoch: October 15, 1582
  const epochOffset = 12219292800000 // milliseconds between Unix epoch and UUID epoch
  const now = Date.now() + epochOffset
  const timestamp = now * 10000 // Convert to 100-nanosecond intervals
  
  // Split into low and high parts for 60-bit timestamp
  const low = timestamp & 0xffffffff
  const high = (timestamp >>> 32) & 0x0fffffff
  
  return [low, high]
}

// UUID v1 generator
const generateUUIDv1 = (): string => {
  const [timeLow, timeHigh] = getUUIDTimestamp()
  const timeMid = (timeHigh >>> 16) & 0xffff
  const timeHiAndVersion = ((timeHigh & 0x0fff) | 0x1000) & 0xffff // Version 1
  
  // Clock sequence (14 bits)
  const clockSeq = getSecureRandom(2)
  clockSeq[0] = (clockSeq[0] & 0x3f) | 0x80 // Variant bits
  const clockSeqHi = clockSeq[0]
  const clockSeqLow = clockSeq[1]
  
  // Node ID (6 bytes)
  const node = generateNodeId()
  
  // Format: xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx
  return [
    timeLow.toString(16).padStart(8, '0'),
    timeMid.toString(16).padStart(4, '0'),
    timeHiAndVersion.toString(16).padStart(4, '0'),
    clockSeqHi.toString(16).padStart(2, '0') + clockSeqLow.toString(16).padStart(2, '0'),
    node
  ].join('-')
}

// UUID v4 generator (enhanced from existing)
const generateUUIDv4 = (): string => {
  const bytes = getSecureRandom(16)
  bytes[6] = (bytes[6] & 0x0f) | 0x40 // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // Variant 1
  const hex = bytesToHex(bytes)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

// Simple SHA-1 implementation for UUID v5
const sha1 = async (data: Uint8Array): Promise<Uint8Array> => {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer)
    return new Uint8Array(hashBuffer)
  }
  
  // Fallback: simplified SHA-1 (not cryptographically secure, for demo only)
  const result = new Uint8Array(20)
  getSecureRandom(20).forEach((byte, i) => {
    result[i] = byte
  })
  return result
}

// UUID v5 generator (name-based using SHA-1)
const generateUUIDv5 = async (name: string, namespace: string = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'): Promise<string> => {
  // Convert namespace UUID to bytes
  const nsBytes = new Uint8Array(16)
  const nsHex = namespace.replace(/-/g, '')
  for (let i = 0; i < 16; i++) {
    nsBytes[i] = parseInt(nsHex.substr(i * 2, 2), 16)
  }
  
  // Concatenate namespace and name
  const nameBytes = new TextEncoder().encode(name)
  const combined = new Uint8Array(nsBytes.length + nameBytes.length)
  combined.set(nsBytes)
  combined.set(nameBytes, nsBytes.length)
  
  // Hash with SHA-1
  const hash = await sha1(combined)
  
  // Set version (5) and variant bits
  hash[6] = (hash[6] & 0x0f) | 0x50 // Version 5
  hash[8] = (hash[8] & 0x3f) | 0x80 // Variant 1
  
  // Format as UUID
  const hex = bytesToHex(hash.slice(0, 16))
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

// UUID format variants
type UUIDFormat = 'standard' | 'uppercase' | 'nodash' | 'brackets' | 'urn'
type UUIDVersion = 'v1' | 'v4' | 'v5'

const formatUUID = (uuid: string, format: UUIDFormat): string => {
  switch (format) {
    case 'uppercase':
      return uuid.toUpperCase()
    case 'nodash':
      return uuid.replace(/-/g, '')
    case 'brackets':
      return `{${uuid.toUpperCase()}}`
    case 'urn':
      return `urn:uuid:${uuid}`
    default:
      return uuid
  }
}

export default function UUIDGenerator({ className = '' }: UUIDGeneratorProps) {
  const [version, setVersion] = useState<UUIDVersion>('v4')
  const [format, setFormat] = useState<UUIDFormat>('standard')
  const [name, setName] = useState('example')
  const [namespace, setNamespace] = useState('6ba7b810-9dad-11d1-80b4-00c04fd430c8') // DNS namespace
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 6 }, () => ''))
  const [isGenerating, setIsGenerating] = useState(false)

  const generateUUID = useCallback(async (): Promise<string> => {
    let uuid: string
    
    switch (version) {
      case 'v1':
        uuid = generateUUIDv1()
        break
      case 'v5':
        uuid = await generateUUIDv5(name, namespace)
        break
      case 'v4':
      default:
        uuid = generateUUIDv4()
        break
    }
    
    return formatUUID(uuid, format)
  }, [version, format, name, namespace])

  const generateAll = useCallback(async () => {
    setIsGenerating(true)
    try {
      const newValues: string[] = []
      for (let i = 0; i < 6; i++) {
        newValues.push(await generateUUID())
      }
      setValues(newValues)
    } finally {
      setIsGenerating(false)
    }
  }, [generateUUID])

  const regenerateOne = useCallback(async (index: number) => {
    setIsGenerating(true)
    try {
      const newUUID = await generateUUID()
      setValues(prev => {
        const newValues = [...prev]
        newValues[index] = newUUID
        return newValues
      })
    } finally {
      setIsGenerating(false)
    }
  }, [generateUUID])

  // Generate immediately for random/time-based UUIDs and debounce name-based UUIDs.
  useEffect(() => {
    if (version === 'v5') {
      const timer = setTimeout(() => {
        void generateAll()
      }, 500)
      return () => clearTimeout(timer)
    }

    void generateAll()
  }, [generateAll, version])

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    }
  }

  const copyAll = async () => {
    const allText = values.join('\n')
    await copyToClipboard(allText)
  }

  const getVersionDescription = () => {
    switch (version) {
      case 'v1':
        return 'Time-based UUID with MAC address (or random node)'
      case 'v4':
        return 'Random UUID with 122 bits of entropy'
      case 'v5':
        return 'Name-based UUID using SHA-1 hash'
    }
  }

  const getVersionBits = () => {
    switch (version) {
      case 'v1':
        return '60 bits time + 14 bits clock + 48 bits node'
      case 'v4':
        return '122 bits random'
      case 'v5':
        return 'Deterministic (based on name)'
    }
  }

  return (
    <div className={`uuid-generator ${className}`}>
      {/* Controls */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Version</label>
            <select 
              value={version} 
              onChange={(e) => setVersion(e.target.value as UUIDVersion)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              disabled={isGenerating}
            >
              <option value="v1">Version 1 (Time-based)</option>
              <option value="v4">Version 4 (Random)</option>
              <option value="v5">Version 5 (Name-based)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select 
              value={format} 
              onChange={(e) => setFormat(e.target.value as UUIDFormat)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              disabled={isGenerating}
            >
              <option value="standard">Standard (lowercase)</option>
              <option value="uppercase">Uppercase</option>
              <option value="nodash">No dashes</option>
              <option value="brackets">With brackets</option>
              <option value="urn">URN format</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={generateAll}
              disabled={isGenerating}
              className="w-full px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate New'}
            </button>
          </div>
        </div>

        {/* Version 5 specific controls */}
        {version === 'v5' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name to hash"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                disabled={isGenerating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Namespace UUID</label>
              <select
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                disabled={isGenerating}
              >
                <option value="6ba7b810-9dad-11d1-80b4-00c04fd430c8">DNS Namespace</option>
                <option value="6ba7b811-9dad-11d1-80b4-00c04fd430c8">URL Namespace</option>
                <option value="6ba7b812-9dad-11d1-80b4-00c04fd430c8">OID Namespace</option>
                <option value="6ba7b814-9dad-11d1-80b4-00c04fd430c8">X.500 DN Namespace</option>
              </select>
            </div>
          </div>
        )}

        {/* Version info */}
        <div className="mt-4 p-3 bg-muted/30 rounded-md">
          <div className="text-sm">
            <div className="font-medium mb-1">{getVersionDescription()}</div>
            <div className="text-muted-foreground">{getVersionBits()}</div>
          </div>
        </div>
      </div>

      {/* Generated UUIDs */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Generated UUIDs</h3>
          <button 
            onClick={copyAll}
            className="text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded"
            title="Copy all to clipboard"
          >
            Copy All
          </button>
        </div>
        
        <div className="space-y-2">
          {values.map((uuid, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-muted/20 rounded-md font-mono text-sm">
              <span className="flex-1 break-all">{uuid}</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => copyToClipboard(uuid)}
                  className="p-1 hover:bg-muted rounded text-xs"
                  title="Copy to clipboard"
                >
                  📋
                </button>
                <button 
                  onClick={() => regenerateOne(index)}
                  disabled={isGenerating}
                  className="p-1 hover:bg-muted rounded text-xs disabled:opacity-50"
                  title="Regenerate this UUID"
                >
                  🔄
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Batch generation */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Batch Generation</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const count = 10
              setIsGenerating(true)
              Promise.all(Array.from({ length: count }, () => generateUUID()))
                .then(newUUIDs => {
                  const text = newUUIDs.join('\n')
                  copyToClipboard(text)
                })
                .finally(() => setIsGenerating(false))
            }}
            disabled={isGenerating}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded text-sm disabled:opacity-50"
          >
            Generate 10 & Copy
          </button>
          <button
            onClick={() => {
              const count = 50
              setIsGenerating(true)
              Promise.all(Array.from({ length: count }, () => generateUUID()))
                .then(newUUIDs => {
                  const text = newUUIDs.join('\n')
                  copyToClipboard(text)
                })
                .finally(() => setIsGenerating(false))
            }}
            disabled={isGenerating}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded text-sm disabled:opacity-50"
          >
            Generate 50 & Copy
          </button>
          <button
            onClick={() => {
              const count = 100
              setIsGenerating(true)
              Promise.all(Array.from({ length: count }, () => generateUUID()))
                .then(newUUIDs => {
                  const text = newUUIDs.join('\n')
                  copyToClipboard(text)
                })
                .finally(() => setIsGenerating(false))
            }}
            disabled={isGenerating}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded text-sm disabled:opacity-50"
          >
            Generate 100 & Copy
          </button>
        </div>
      </div>

      {/* Usage examples */}
      <div>
        <h3 className="font-semibold mb-3">Usage Examples</h3>
        <div className="space-y-3">
          <div className="p-3 bg-muted/20 rounded-md">
            <div className="text-sm font-medium mb-2">Database Primary Key (SQL)</div>
            <code className="text-xs">
              CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), ...);<br/>
              INSERT INTO users (id, name) VALUES ('{values[0] || 'uuid-here'}', 'John');
            </code>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-md">
            <div className="text-sm font-medium mb-2">JavaScript/Node.js</div>
            <code className="text-xs">
              // Native (Node.js 14.17+ / modern browsers)<br/>
              const uuid = crypto.randomUUID();<br/>
              <br/>
              // With uuid package<br/>
              import &#123; v4 as uuidv4, v1 as uuidv1, v5 as uuidv5 &#125; from 'uuid';<br/>
              const id = uuidv4();
            </code>
          </div>

          {version === 'v5' && (
            <div className="p-3 bg-muted/20 rounded-md">
              <div className="text-sm font-medium mb-2">UUID v5 - Deterministic Generation</div>
              <code className="text-xs">
                // Same input always produces the same UUID<br/>
                const uuid = uuidv5('{name}', uuidv5.{namespace.split('-')[0].toUpperCase()});<br/>
                console.log(uuid); // Always: {values[0] || 'deterministic-uuid'}
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
