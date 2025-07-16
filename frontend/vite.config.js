import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Configuración de resolución de módulos
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  // Configuración del servidor de desarrollo
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  
  // Configuración de build para desarrollo
  build: {
    // Optimizaciones básicas
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    // Configuración de assets
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
  },
  
  // Configuración de optimización
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  
  // Configuración de test
  test: {
    environment: 'jsdom', // ✅ esto habilita el DOM para los tests
  },
});
