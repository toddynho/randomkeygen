import assert from 'node:assert/strict'
import { test } from 'node:test'

import jsQR from 'jsqr'
import { PNG } from 'pngjs'
import QRCode from 'qrcode'

test('otpauth QR matrix decodes back to the same URI', () => {
  const text = 'otpauth://totp/MyApp:user@example.com?secret=JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP&issuer=MyApp&algorithm=SHA1&digits=6&period=30'
  const qr = QRCode.create(text, { errorCorrectionLevel: 'M' })
  const n = qr.modules.size
  const scale = 4
  const quiet = 4
  const size = (n + quiet * 2) * scale
  const png = new PNG({ width: size, height: size })

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const col = Math.floor(x / scale) - quiet
      const row = Math.floor(y / scale) - quiet
      const dark = col >= 0 && row >= 0 && col < n && row < n && qr.modules.get(row, col)
      const index = (y * size + x) * 4
      const value = dark ? 0 : 255
      png.data[index] = value
      png.data[index + 1] = value
      png.data[index + 2] = value
      png.data[index + 3] = 255
    }
  }

  const decoded = jsQR(new Uint8ClampedArray(png.data), size, size)
  assert.ok(decoded)
  assert.equal(decoded.data, text)
})
