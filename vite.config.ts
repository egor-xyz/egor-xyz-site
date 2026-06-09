import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL ?? '/',
  build: {
    target: 'esnext'
  },
  plugins: [
    tailwindcss(),
    svgr(),
    react(),
    checker({
      typescript: true
    })
  ],
  resolve: {
    alias: [{ find: 'src', replacement: '/src' }]
  },
  server: {
    open: true
  }
});
