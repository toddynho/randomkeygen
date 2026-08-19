import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RandomKeygen - Secure Password & Key Generator',
    short_name: 'RandomKeygen',
    description: 'Professional keygen toolkit: generate cryptographically secure passwords, API keys, UUIDs, JWT secrets, encryption keys, and more. Free, open-source, runs entirely in your browser.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf9f7',
    theme_color: '#047857',
    categories: ['developer-tools', 'security', 'utilities'],
    icons: [
      {
        src: '/randomkeygen-icon.svg?v=2',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/randomkeygen-icon-192.png?v=2',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/randomkeygen-icon-512.png?v=2',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
    shortcuts: [
      {
        name: 'Password Generator',
        short_name: 'Password',
        description: 'Generate secure passwords',
        url: '/password',
        icons: [{ src: '/randomkeygen-icon-192.png?v=2', sizes: '192x192', type: 'image/png' }]
      },
      {
        name: 'API Key Generator',
        short_name: 'API Key',
        description: 'Generate API keys',
        url: '/api-key',
        icons: [{ src: '/randomkeygen-icon-192.png?v=2', sizes: '192x192', type: 'image/png' }]
      },
      {
        name: 'JWT Secret',
        short_name: 'JWT',
        description: 'Generate JWT secrets',
        url: '/jwt-secret',
        icons: [{ src: '/randomkeygen-icon-192.png?v=2', sizes: '192x192', type: 'image/png' }]
      },
      {
        name: 'UUID Generator',
        short_name: 'UUID',
        description: 'Generate UUIDs',
        url: '/uuid',
        icons: [{ src: '/randomkeygen-icon-192.png?v=2', sizes: '192x192', type: 'image/png' }]
      }
    ]
  }
}
