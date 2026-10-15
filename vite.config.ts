import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        'firebase-messaging-sw': resolve(import.meta.dirname, 'src/firebase-messaging-sw.ts'),
      },
      output: {
        entryFileNames: (chunk) => chunk.name === 'firebase-messaging-sw'
          ? 'firebase-messaging-sw.js'
          : 'assets/[name]-[hash].js',
      },
    },
  },
});
