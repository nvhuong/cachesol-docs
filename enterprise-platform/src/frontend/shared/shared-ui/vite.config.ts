import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Source is consumed directly (main/module/types → src/index.ts).
    // We don't emit a bundle — vite build is kept only as a future hook
    // (e.g. for CSS extraction, ESM minification, etc.).
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: () => 'index.mjs',
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
