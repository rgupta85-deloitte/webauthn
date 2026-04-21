import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/user': 'http://127.0.0.1:3001',
      '/register': 'http://127.0.0.1:3001',
      '/login': 'http://127.0.0.1:3001',
    },
  },
})
