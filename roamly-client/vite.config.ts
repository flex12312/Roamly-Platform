import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/identity': {
        target: 'http://localhost:7098',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/identity/, '/api'),
      },
      '/api/housing': {
        target: 'http://localhost:7099',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/housing/, '/api'),
      },
      '/api/search': {
        target: 'http://localhost:7100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/search/, '/api'),
      },
      '/api/booking': {
        target: 'http://localhost:7101',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/booking/, '/api'),
      },
    },
  },
})
