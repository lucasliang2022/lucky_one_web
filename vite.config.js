import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [
    vue(),
    // Vant 按需自动引入(仅在模板中用到的 van-* 组件才会进包)。
    // web 端不使用 Vant 组件,因此不会污染 web 产物。
    Components({
      resolvers: [VantResolver()],
      // 只扫描 h5 目录,避免对 web 组件做无谓解析
      dirs: [],
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@web': path.resolve(__dirname, 'src/web'),
      '@h5': path.resolve(__dirname, 'src/h5'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@lottery': path.resolve(__dirname, 'src/shared/lottery'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        web: path.resolve(__dirname, 'web.html'),
        h5: path.resolve(__dirname, 'h5.html'),
      },
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
