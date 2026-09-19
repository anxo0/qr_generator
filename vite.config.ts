import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Iconos Solar (Iconify) compilados a componentes React en build: `~icons/solar/<nombre>`
    Icons({ compiler: 'jsx', jsx: 'react', scale: 1, defaultClass: 'icon' }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          qr: ['qrcode'],
          decoder: ['jsqr'],
        },
      },
    },
  },
});
