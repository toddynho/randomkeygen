declare module 'qrcode' {
  interface QrBitMatrix {
    size: number
    get(row: number, col: number): boolean | number
  }

  interface CreatedQr {
    modules: QrBitMatrix
  }

  interface QRCodeStatic {
    create(text: string, options?: { errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' }): CreatedQr
  }

  const QRCode: QRCodeStatic
  export default QRCode
}
