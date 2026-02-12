import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname),
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      // Убираем @syntjs/core и @syntjs/jsx
      // Напрямую указываем на файлы в packages
      '@syntjs/core': resolve(__dirname, '../../packages/core/src'),
      '@syntjs/jsx': resolve(__dirname, '../../packages/jsx/src'),
      'syntjs': resolve(__dirname, '../../dist/index.js')
    }
  },
  optimizeDeps: {
    include: ['@syntjs/core', '@syntjs/jsx']
  }
});