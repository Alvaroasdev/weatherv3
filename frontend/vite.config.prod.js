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
  
  // Configuración de build para producción
  build: {
    // Optimizaciones de rendimiento
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Agrupar react y react-dom en vendor chunk
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            // Otros módulos de node_modules van al chunk vendor
            return 'vendor';
          }
        },
      },
      onwarn(warning, warn) {
        // Ignorar warnings no críticos
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      },
    },
    // Configuración de assets
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    // Configuración de target
    target: 'es2015',
  },
  
  // Configuración de optimización
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['axios'], // Excluir axios explícitamente
  },
  
  // Configuración de test
  test: {
    environment: 'jsdom',
  },
}); 