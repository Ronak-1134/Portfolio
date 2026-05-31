/* ============================================================
   vite.config.js
   Ronak Vaghela Portfolio — Vite Configuration

   — React plugin with Fast Refresh
   — Path alias: @ → src/
   — Dev server proxy: /api → Express on :4000
     Avoids CORS in development — both frontend and backend
     appear to be on the same origin (localhost:5173)
   — Build output to dist/
   ============================================================ */

import { defineConfig } from 'vite';
import react            from '@vitejs/plugin-react';
import path             from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      /* Fast Refresh is on by default.
         babel config here if custom transforms needed later. */
    }),
  ],

  /* ----------------------------------------------------------
     PATH ALIASES
     Import from '@/components/...' instead of '../../components/...'
     ---------------------------------------------------------- */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  /* ----------------------------------------------------------
     DEV SERVER
     ---------------------------------------------------------- */
  server: {
    port: 5173,
    open: false,   /* Don't auto-open browser — often annoying */

    /* Proxy /api requests to the Express backend during dev.
       This means Contact.jsx can fetch('/api/contact') without
       CORS headers needed — same-origin from the browser's POV. */
    proxy: {
      '/api': {
        target:       'http://localhost:4000',
        changeOrigin: true,
        secure:       false,
        /* Optional rewrite if backend doesn't have /api prefix:
           rewrite: (path) => path.replace(/^\/api/, ''), */
      },
    },
  },

  /* ----------------------------------------------------------
     BUILD
     ---------------------------------------------------------- */
  build: {
    outDir:           'dist',
    sourcemap:        false,   /* Disable in production for security */
    assetsInlineLimit: 4096,   /* Inline assets < 4kb as base64     */

    rollupOptions: {
      output: {
        /* Split vendor chunk to improve cache efficiency */
        manualChunks: {
          react:  ['react', 'react-dom'],
          gsap:   ['gsap'],
          firebase: ['firebase/app', 'firebase/storage', 'firebase/analytics'],
        },
      },
    },
  },

  /* ----------------------------------------------------------
     PREVIEW (vite preview)
     Used to test the production build locally.
     ---------------------------------------------------------- */
  preview: {
    port: 4173,
  },
});