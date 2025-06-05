import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Configuración para despliegue en Plesk
  base: './', // Asegura que las rutas sean relativas
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    // Optimizaciones para producción
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});