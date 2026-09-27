import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Platform Registry (public + service + client APIs).
      // In docker-compose.mvp.yml: platform-registry maps host 8087 -> container 8081.
      '/public-api': {
        target: 'http://localhost:8087',
        changeOrigin: true,
      },
      '/client-api': {
        target: 'http://localhost:8087',
        changeOrigin: true,
      },
      '/service-api': {
        target: 'http://localhost:8087',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
        },
      },
    },
  },
});
