import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { checker } from 'vite-plugin-checker';
import tailwindcss from '@tailwindcss/vite';

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
      eslint: {
        lintCommand: 'lint',
        useFlatConfig: true
      },
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
