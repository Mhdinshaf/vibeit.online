import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Target modern browsers for better compression
    target: 'es2020',
    // Warn if a single chunk exceeds 500kB
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Split vendor libraries into separate cacheable chunks
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-ui': ['lucide-react', 'react-hot-toast', 'react-helmet-async'],
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
})
