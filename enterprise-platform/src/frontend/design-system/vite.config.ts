import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cachesol-design-system:css',
      // Emit styles.css as a separate file during library build
      closeBundle() {
        // no-op: handled by assets option
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CachesolDesignSystem',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'antd',
        '@ant-design/icons',
        /\.css$/,
      ],
      output: {
        // Force named exports only — avoids `CachesolDesignSystem.default` warning.
        exports: 'named',
        // Emit CSS as separate files (not inline)
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});
