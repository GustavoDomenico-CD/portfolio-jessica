import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      input: 'index.html',
      output: {
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
        manualChunks: undefined,
      },
    },
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },

  css: {
    devSourcemap: false,
  },

  server: {
    port: 5173,
    open: true,
  },
});
