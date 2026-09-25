import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const isServe = process.env.NODE_ENV !== 'production' || process.argv.includes('serve');

/** Backend base URL for Platform Registry. Override via VITE_PLATFORM_REGISTRY_BASE_URL.
 *  Default points to the docker-compose.mvp.yml host port (8087 → container 8081). */
const platformRegistryBaseUrl =
  process.env.VITE_PLATFORM_REGISTRY_BASE_URL ?? 'http://localhost:8087';

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
        server: {
          port: 5174,
          proxy: {
            // Public endpoints (no auth) — proxy to Platform Registry in dev.
            // Landing page calls these directly from the browser.
            // NOTE: in docker-compose.mvp.yml, platform-registry maps host 8087 -> container 8081.
            '/public-api': {
              target: platformRegistryBaseUrl,
              changeOrigin: true,
              // Backend already serves at /public-api/* — keep path as-is.
            },
          },
        },
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
