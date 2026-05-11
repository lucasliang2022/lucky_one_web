import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@lottery': path.resolve(__dirname, 'src/lottery'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://api.df-game.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
