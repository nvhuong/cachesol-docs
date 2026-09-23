import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CachesolTenantManagerAdmin',
      fileName: (f) => `index.${f === 'es' ? 'mjs' : 'js'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react', 'react-dom', 'react-router-dom',
        '@cachesol/design-system',
        '@cachesol/shared-api',
        '@cachesol/shared-types',
        '@cachesol/shared-ui',
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  server: { port: 5176 },
});
