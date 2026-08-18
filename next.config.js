/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure trailing slashes for cleaner URLs
  trailingSlash: false,
  async redirects() {
    return [
      // Consolidate retired and renamed generators on their canonical tools.
      { source: '/base32-encoder', destination: '/base32-encode', statusCode: 301 },
      { source: '/hmac-generator', destination: '/hmac-key', statusCode: 301 },
      { source: '/md5-generator', destination: '/md5-hash', statusCode: 301 },
      { source: '/uuid-generator', destination: '/uuid', statusCode: 301 },
      { source: '/jwt-token', destination: '/jwt-secret', statusCode: 301 },

      // Preserve external links to older navigation and guide URLs.
      { source: '/all-tools', destination: '/keygen-hub', statusCode: 301 },
      { source: '/guides/storing-secrets-securely', destination: '/guides/api-key-best-practices', statusCode: 301 },
      // NOTE: legacy '/Encryption' and '/Developer' redirects were removed —
      // Next matches redirect sources case-insensitively, so they would
      // swallow the lowercase /encryption and /developer category routes.
    ]
  },
}

module.exports = nextConfig
