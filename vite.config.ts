import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { checker } from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL ?? '/',
  plugins: [
    svgr(),
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
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
