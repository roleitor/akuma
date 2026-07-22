import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    https: {
      key: '/tmp/vite-key.pem',
      cert: '/tmp/vite-cert.pem',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
