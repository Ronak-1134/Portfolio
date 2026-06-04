/* ============================================================
   vite.config.js — Ronak Vaghela Portfolio
   No backend proxy — purely static frontend.
   ============================================================ */

import { defineConfig } from 'vite';
import react            from '@vitejs/plugin-react';
import path             from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },

  server: {
    port: 5173,
    open: false,
  },

  build: {
    outDir:            'dist',
    sourcemap:         false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          react:    ['react', 'react-dom'],
          gsap:     ['gsap'],
          firebase: ['firebase/app', 'firebase/storage', 'firebase/analytics'],
        },
      },
    },
  },

  preview: { port: 4173 },
});