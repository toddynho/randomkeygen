export const jwtFaqs = [
  {
    q: 'What does this JWT token generator sign?',
    a: 'It signs the compact JSON of the header and payload you edit. HS256, HS384, and HS512 use the HMAC secret as UTF-8 text, the same default as jsonwebtoken when the secret is a string. RS256 signs with a PKCS#8 RSA private key generated in the browser or one you paste. The alg field in the signed token is taken from the algorithm control.',
  },
  {
    q: 'Can I verify an existing token?',
    a: 'Yes. Paste a token to inspect the header and payload without a key. Add the HMAC secret, or the RS256 public key (a PUBLIC KEY PEM), to check the signature. The none algorithm is rejected. ES256 and other algorithms are shown but not verified.',
  },
  {
    q: 'Do secrets leave the browser?',
    a: 'No. Signing, key generation, decoding, and verification use the Web Crypto API on this page. The HMAC secret and RSA private key are not uploaded. This is a development and testing tool: do not paste a production private key into a machine you do not trust.',
  },
  {
    q: 'Why is ES256 missing?',
    a: 'HS256 and RS256 cover the two algorithms most local tests need, and both run entirely in Web Crypto. ES256 (ECDSA P-256) is not signed or verified on this page. Generate an HMAC secret on the JWT secret generator if you only need key material for your own library.',
  },
] as const

export const jwtRelated = {
  tools: [
    { href: '/jwt-secret', label: 'JWT secret generator', description: 'HMAC signing keys for HS256, HS384, and HS512' },
    { href: '/hmac-key', label: 'HMAC key generator', description: 'Secrets for HMAC-SHA256 and longer hashes' },
    { href: '/api-key', label: 'API key generator', description: 'Prefixed tokens for services that are not JWTs' },
    { href: '/rsa-key', label: 'RSA key pairs', description: 'Public and private keys for other RSA uses' },
  ],
  guides: [
    { href: '/guides/jwt-token-generator-guide', title: 'JWT token generator guide' },
    { href: '/guides/jwt-security', title: 'JWT security best practices' },
    { href: '/guides/jwt-token-validation', title: 'JWT token validation' },
    { href: '/guides/common-jwt-mistakes', title: 'Common JWT mistakes' },
  ],
  tips: [
    'Pin the algorithm you verify. Do not trust the alg header by itself.',
    'Keep access tokens short-lived and store the signing key outside the repo.',
    'A JWT is signed, not encrypted. Do not put secrets in the payload.',
  ],
}
