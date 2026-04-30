import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Fix for CustomEvent error in Node environments during Vite build
if (typeof global !== 'undefined') {
  if (typeof global.Event === 'undefined') {
    global.Event = class Event {};
  }
  if (typeof global.CustomEvent === 'undefined') {
    global.CustomEvent = class CustomEvent extends global.Event {};
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
