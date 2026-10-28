export const totpFaqs = [
  {
    q: 'What is a TOTP generator?',
    a: 'A TOTP generator turns a shared Base32 secret and the current time into a 6-digit code, using the HMAC-SHA1 construction in RFC 6238. The code changes every 30 seconds. Your authenticator app and this page both compute it locally from the same secret, so the code does not have to be fetched from a server.',
  },
  {
    q: 'Does this TOTP generator work with Google Authenticator?',
    a: 'Yes. Google Authenticator accepts the otpauth URI and the QR code on this page, or the Base32 secret entered by hand. Use 6 digits and a 30-second period, which are the defaults this page writes into the URI. The code shown here should match the app for the same secret while both clocks are in sync.',
  },
  {
    q: 'Does this work with Authy?',
    a: 'Yes. Authy, Microsoft Authenticator, 1Password, Bitwarden, and any other app that implements RFC 6238 can enroll this secret. In Authy, add an account, choose manual entry, and paste the Base32 secret, or scan the QR code. Authy backups are a separate feature of that app — they do not change the secret this page generated.',
  },
  {
    q: 'How should I back up the TOTP secret?',
    a: 'Save the Base32 secret, or the otpauth URI, in a password manager or other offline store before you depend on the account. The QR code is just that same secret drawn as an image, so a photo of it is also a copy of the key. Also generate one-time backup codes for the account and store them separately. If the only copy of the secret is a single phone, losing the phone locks you out.',
  },
  {
    q: 'Why is the code rejected when the clocks are slightly off?',
    a: 'TOTP divides Unix time by 30 seconds and HMACs that counter. If the phone or the server is ahead or behind by more than one window, the codes will not match. Allow about 30 seconds of skew (one step either side) when you verify, and turn on automatic time sync. A code that is off by several minutes is a clock problem, not a bad secret.',
  },
  {
    q: 'Does the secret leave my browser?',
    a: 'No. The secret, the 6-digit code, the otpauth URI, and the QR code are computed in your browser with the Web Crypto API. This page does not send them to RandomKeygen or to an external QR service. Treat the page like any other place you paste a secret: use a device you trust, and do not leave the secret on a shared screen.',
  },
] as const
