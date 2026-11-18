import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In production, point VITE_API_URL at the Express API (see src/services/api.js).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
