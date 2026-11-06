import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4399',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://127.0.0.1:4399',
        ws: true,
      },
    },
  },
});
