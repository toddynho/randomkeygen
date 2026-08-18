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
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png', 
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
        icons: [{ src: '/favicon.ico', sizes: '96x96' }]
      },
      {
        name: 'API Key Generator',
        short_name: 'API Key',
        description: 'Generate API keys',
        url: '/api-key',
        icons: [{ src: '/favicon.ico', sizes: '96x96' }]
      },
      {
        name: 'JWT Secret',
        short_name: 'JWT',
        description: 'Generate JWT secrets',
        url: '/jwt-secret',
        icons: [{ src: '/favicon.ico', sizes: '96x96' }]
      },
      {
        name: 'UUID Generator',
        short_name: 'UUID',
        description: 'Generate UUIDs',
        url: '/uuid',
        icons: [{ src: '/favicon.ico', sizes: '96x96' }]
      }
    ]
  }
}