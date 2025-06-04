import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    exclude: [],
    esbuildOptions: {
      target: 'es2022'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-slot', 'lucide-react', 'framer-motion'],
          'date-vendor': ['date-fns'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'pdf-vendor': ['pdfjs-dist']
        }
      }
    }
  }
});