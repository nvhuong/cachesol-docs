import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const isServe = process.env.NODE_ENV !== 'production' || process.argv.includes('serve');

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // SPA mode for dev (`vite` command) so the page renders standalone.
  // Lib mode for build (`vite build` command) so web-shell can consume it.
  ...(command === 'serve'
    ? {
        server: { port: 5174 },
      }
    : {
        build: {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'CachesolLanding',
            fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
            formats: ['es', 'cjs'],
          },
          rollupOptions: {
            external: [
              'react',
              'react-dom',
              'react-router-dom',
              '@cachesol/design-system',
              '@cachesol/shared-types',
            ],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
              },
            },
          },
          sourcemap: true,
          emptyOutDir: true,
        },
      }),
}));

// Reference to silence unused warning in strict mode tools
void isServe;