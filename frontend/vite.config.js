import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // Your Flask backend URL
        changeOrigin: true, // Needed for virtual hosted sites
        // If your Flask backend endpoints are like '/github-activity' (without /api prefix),
        // you might need to rewrite the path:
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
})