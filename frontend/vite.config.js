import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false, // Allow Vite to use another port if 5173 is in use
    open: true, // Automatically open the browser
  },
}) 