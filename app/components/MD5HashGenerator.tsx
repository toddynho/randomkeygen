'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface MD5HashGeneratorProps {
  className?: string
}

// MD5 implementation (RFC 1321)
// Note: MD5 is cryptographically broken and should not be used for security purposes
class MD5 {
  private static readonly S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ]

  private static readonly K = new Uint32Array([
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ])

  private static leftRotate(value: number, shift: number): number {
    return ((value << shift) | (value >>> (32 - shift))) >>> 0
  }

  private static toBytes(str: string): Uint8Array {
    const bytes = new Uint8Array(str.length)
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i) & 0xff
    }
    return bytes
  }

  private static toHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  private static fromFile(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer
        resolve(new Uint8Array(arrayBuffer))
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(file)
    })
  }

  static hash(input: string | Uint8Array): string {
    let bytes: Uint8Array
    
    if (typeof input === 'string') {
      bytes = this.toBytes(input)
    } else {
      bytes = input
    }

    // Initial hash values
    let h0 = 0x67452301
    let h1 = 0xefcdab89
    let h2 = 0x98badcfe
    let h3 = 0x10325476

    // Pre-processing: adding padding bits
    const msgLength = bytes.length
    const msgBitLength = msgLength * 8

    // Create padded message
    const paddedLength = Math.ceil((msgLength + 9) / 64) * 64
    const paddedMsg = new Uint8Array(paddedLength)
    paddedMsg.set(bytes)
    paddedMsg[msgLength] = 0x80

    // Append original length as 64-bit little-endian
    const lengthBytes = new Uint8Array(8)
    const dv = new DataView(lengthBytes.buffer)
    dv.setUint32(0, msgBitLength, true)
    dv.setUint32(4, Math.floor(msgBitLength / 0x100000000), true)
    paddedMsg.set(lengthBytes, paddedLength - 8)

    // Process message in 512-bit chunks
    for (let chunkStart = 0; chunkStart < paddedLength; chunkStart += 64) {
      const chunk = paddedMsg.slice(chunkStart, chunkStart + 64)
      const w = new Uint32Array(16)
      
      // Break chunk into sixteen 32-bit little-endian words
      for (let i = 0; i < 16; i++) {
        w[i] = chunk[i * 4] | 
               (chunk[i * 4 + 1] << 8) | 
               (chunk[i * 4 + 2] << 16) | 
               (chunk[i * 4 + 3] << 24)
      }

      // Initialize hash value for this chunk
      let a = h0, b = h1, c = h2, d = h3

      // Main loop
      for (let i = 0; i < 64; i++) {
        let f: number, g: number

        if (i < 16) {
          f = (b & c) | ((~b) & d)
          g = i
        } else if (i < 32) {
          f = (d & b) | ((~d) & c)
          g = (5 * i + 1) % 16
        } else if (i < 48) {
          f = b ^ c ^ d
          g = (3 * i + 5) % 16
        } else {
          f = c ^ (b | (~d))
          g = (7 * i) % 16
        }

        f = (f + a + this.K[i] + w[g]) >>> 0
        a = d
        d = c
        c = b
        b = (b + this.leftRotate(f, this.S[i])) >>> 0
      }

      // Add this chunk's hash to result so far
      h0 = (h0 + a) >>> 0
      h1 = (h1 + b) >>> 0
      h2 = (h2 + c) >>> 0
      h3 = (h3 + d) >>> 0
    }

    // Produce the final hash value as a 128-bit number (little-endian)
    const result = new Uint8Array(16)
    const view = new DataView(result.buffer)
    view.setUint32(0, h0, true)
    view.setUint32(4, h1, true)
    view.setUint32(8, h2, true)
    view.setUint32(12, h3, true)

    return this.toHex(result)
  }

  static async hashFile(file: File): Promise<string> {
    const bytes = await this.fromFile(file)
    return this.hash(bytes)
  }
}

type HashFormat = 'lowercase' | 'uppercase'
type InputMode = 'text' | 'file'

export default function MD5HashGenerator({ className = '' }: MD5HashGeneratorProps) {
  const [inputMode, setInputMode] = useState<InputMode>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [hash, setHash] = useState('')
  const [format, setFormat] = useState<HashFormat>('lowercase')
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const computeHash = useCallback(async () => {
    setIsProcessing(true)
    try {
      let result = ''
      
      if (inputMode === 'text') {
        result = MD5.hash(text)
      } else if (file) {
        result = await MD5.hashFile(file)
      }
      
      setHash(format === 'uppercase' ? result.toUpperCase() : result)
    } catch (error) {
      console.error('Error computing MD5 hash:', error)
      setHash('Error: Unable to compute hash')
    } finally {
      setIsProcessing(false)
    }
  }, [text, file, inputMode, format])

  // Compute hash when inputs change
  useEffect(() => {
    if (inputMode === 'text' && text) {
      computeHash()
    } else if (inputMode === 'file' && file) {
      computeHash()
    } else {
      setHash('')
    }
  }, [text, file, inputMode, format, computeHash])

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileChange(files[0])
    }
  }

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      clearTimeout(copyTimer.current)
      setCopied(true)
      copyTimer.current = setTimeout(() => setCopied(false), 1400)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  return (
    <div className={`md5-hash-generator ${className}`}>
      {/* Security Warning */}
      <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-start">
          <span className="text-orange-500 mr-3 text-lg">⚠️</span>
          <div>
            <h3 className="font-semibold text-orange-800 mb-1">Security Warning</h3>
            <p className="text-sm text-orange-700">
              MD5 is cryptographically broken and should not be used for security purposes. 
              Use SHA-256 or higher for security applications. This tool is provided for legacy compatibility and file verification only.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <section className="control-panel mb-6 p-5 md:p-6">
      {/* Input Mode Toggle */}
      <div className="mb-6">
        <div className="flex overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface)]">
          <button
            onClick={() => setInputMode('text')}
            aria-pressed={inputMode === 'text'}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              inputMode === 'text'
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            Text Input
          </button>
          <button
            onClick={() => setInputMode('file')}
            aria-pressed={inputMode === 'file'}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              inputMode === 'file'
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            File Upload
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        {inputMode === 'text' ? (
          <div>
            <label className="block text-sm font-medium mb-2">Text to Hash</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to generate MD5 hash..."
              className="form-input h-32 w-full resize-y"
              disabled={isProcessing}
            />
            <div className="mt-2 text-xs text-[var(--muted)]">
              {text.length} characters, {new Blob([text]).size} bytes
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">File to Hash</label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                  : 'border-[var(--border-strong)] hover:border-[var(--accent)]'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div>
                  <div className="text-sm font-medium mb-1">{file.name}</div>
                  <div className="text-xs text-[var(--muted)] mb-3">
                    {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                  </div>
                  <button
                    onClick={() => handleFileChange(null)}
                    className="rounded border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1 text-xs transition-colors hover:border-[var(--accent)]"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-[var(--muted)] mb-3">
                    📁 Drop a file here or click to select
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-input"
                    disabled={isProcessing}
                  />
                  <label
                    htmlFor="file-input"
                    className="btn btn-primary inline-block cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Format Options */}
      <div>
        <label className="block text-sm font-medium mb-2">Output Format</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as HashFormat)}
          className="form-select"
          disabled={isProcessing}
        >
          <option value="lowercase">Lowercase (standard)</option>
          <option value="uppercase">Uppercase</option>
        </select>
      </div>
      </section>

      {/* Output Section */}
      {hash && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">MD5 Hash</label>
          <div className="relative">
            <div className="rounded-md border border-[var(--border)] bg-[var(--band)] p-3 pr-20 font-mono text-sm break-all">
              {isProcessing ? (
                <div className="text-[var(--muted)]">Computing hash...</div>
              ) : (
                hash
              )}
            </div>
            {!isProcessing && hash && (
              <button
                onClick={() => copyToClipboard(hash)}
                className={`absolute top-2 right-2 rounded px-2 py-1 text-13 font-semibold tracking-[0.04em] transition-colors hover:text-[var(--accent)] ${
                  copied ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                }`}
                title="Copy to clipboard"
              >
                {copied ? '✓ Copied' : 'COPY'}
              </button>
            )}
          </div>
          
          {!isProcessing && hash && (
            <div className="mt-2 text-xs text-[var(--muted)]">
              128-bit hash • {hash.length} characters • Copy-ready format
            </div>
          )}
        </div>
      )}

      {/* Quick Examples */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Quick Examples</h3>
        <div className="space-y-2">
          <button
            onClick={() => {
              setInputMode('text')
              setText('Hello World')
            }}
            className="block w-full rounded border border-[var(--border)] bg-[var(--band)] p-3 text-left text-sm transition-colors hover:border-[var(--accent)]"
            disabled={isProcessing}
          >
            <div className="font-mono">Hello World</div>
            <div className="text-xs text-[var(--muted)] mt-1">
              MD5: b10a8db164e0754105b7a99be72e3fe5
            </div>
          </button>
          
          <button
            onClick={() => {
              setInputMode('text')
              setText('')
            }}
            className="block w-full rounded border border-[var(--border)] bg-[var(--band)] p-3 text-left text-sm transition-colors hover:border-[var(--accent)]"
            disabled={isProcessing}
          >
            <div className="font-mono">(empty string)</div>
            <div className="text-xs text-[var(--muted)] mt-1">
              MD5: d41d8cd98f00b204e9800998ecf8427e
            </div>
          </button>
          
          <button
            onClick={() => {
              setInputMode('text')
              setText('The quick brown fox jumps over the lazy dog')
            }}
            className="block w-full rounded border border-[var(--border)] bg-[var(--band)] p-3 text-left text-sm transition-colors hover:border-[var(--accent)]"
            disabled={isProcessing}
          >
            <div className="font-mono">The quick brown fox jumps over the lazy dog</div>
            <div className="text-xs text-[var(--muted)] mt-1">
              MD5: 9e107d9d372bb6826bd81d3542a419d6
            </div>
          </button>
        </div>
      </div>

      {/* Common Use Cases */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Common Use Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border border-[var(--border)] rounded">
            <h4 className="font-medium mb-2">File Verification</h4>
            <p className="text-sm text-[var(--muted)]">
              Verify file integrity by comparing MD5 checksums. Still used for non-security file verification.
            </p>
          </div>
          <div className="p-3 border border-[var(--border)] rounded">
            <h4 className="font-medium mb-2">Legacy Systems</h4>
            <p className="text-sm text-[var(--muted)]">
              Interface with older systems that still require MD5 hashes for compatibility.
            </p>
          </div>
          <div className="p-3 border border-[var(--border)] rounded">
            <h4 className="font-medium mb-2">Database Optimization</h4>
            <p className="text-sm text-[var(--muted)]">
              Fast hash function for non-security purposes like database sharding or caching keys.
            </p>
          </div>
          <div className="p-3 border border-[var(--border)] rounded">
            <h4 className="font-medium mb-2">Data Deduplication</h4>
            <p className="text-sm text-[var(--muted)]">
              Quick duplicate detection in non-security contexts where speed matters more than collision resistance.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Information */}
      <div>
        <h3 className="font-semibold mb-3">Technical Information</h3>
        <div className="prose text-sm text-[var(--muted)]">
          <ul className="space-y-2">
            <li><strong>Algorithm:</strong> MD5 (Message-Digest Algorithm 5)</li>
            <li><strong>Output:</strong> 128-bit (16 bytes) hash value</li>
            <li><strong>Security:</strong> Cryptographically broken - vulnerable to collision attacks</li>
            <li><strong>Speed:</strong> Fast computation, suitable for non-security applications</li>
            <li><strong>Alternative:</strong> Use SHA-256 or higher for security-critical applications</li>
          </ul>
        </div>
      </div>
    </div>
  )
}