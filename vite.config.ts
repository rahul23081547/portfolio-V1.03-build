import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          spline: ['@splinetool/react-spline'],
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          motion: ['framer-motion'],
          emailjs: ['@emailjs/browser'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },
    sourcemap: false, // Disable sourcemaps for production
    reportCompressedSize: false, // Faster builds
  },
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
  // Performance optimizations
  esbuild: {
    drop: ['console', 'debugger'],
  },
});