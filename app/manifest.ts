import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'cdown - Smart Contract Downloader',
    short_name: 'cdown',
    description: 'Download smart contract source code from multiple blockchain networks. Extract contract metadata, ABI, and source code with ease.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#8b5cf6',
    icons: [
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
    categories: ['developer', 'utilities', 'productivity'],
    lang: 'en',
    orientation: 'portrait',
    scope: '/',
  }
}
