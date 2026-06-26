import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'alobidan.png'],
      manifest: {
        name: 'AloBidan',
        short_name: 'AloBidan',
        description: 'Layanan Kesehatan Ibu dan Anak',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/alobidan.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/alobidan.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
