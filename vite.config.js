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
        // Vite 8 (Rolldown) requires manualChunks as a function, not an object
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-query';
          }
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts';
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/react-hot-toast') || id.includes('node_modules/react-helmet-async')) {
            return 'vendor-ui';
          }
        },
      },
    },
  },
})
