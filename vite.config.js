import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/link': path.resolve(__dirname, './src/lib/next-link-shim.tsx'),
      'next/navigation': path.resolve(__dirname, './src/lib/next-navigation-shim.ts'),
      'next/server': path.resolve(__dirname, './src/lib/next-server-shim.ts'),
      'next': path.resolve(__dirname, './src/lib/next-shim.ts')
    }
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true
  }
})
