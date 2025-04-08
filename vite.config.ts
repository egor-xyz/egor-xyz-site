import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { checker } from 'vite-plugin-checker';
import dynamicImport from 'vite-plugin-dynamic-import';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL ?? '/',
  build: {
    target: 'esnext'
  },
  plugins: [
    dynamicImport({
      filter(id) {
        if (id.includes('/node_modules/clippyts')) {
          return true;
        }
      }
    }),
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
