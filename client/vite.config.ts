import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@views', replacement: resolve(__dirname, 'src/views') },
      { find: '@store', replacement: resolve(__dirname, 'src/store') },
      {
        find: '@components',
        replacement: resolve(__dirname, 'src/components'),
      },
      { find: '@template', replacement: resolve(__dirname, 'src/components/template') },
      { find: '@atom', replacement: resolve(__dirname, 'src/components/atom') },
      { find: '@app', replacement: resolve(__dirname, 'src/app') },
      { find: '@core', replacement: resolve(__dirname, 'src/app/core') },
      { find: '@game', replacement: resolve(__dirname, 'src/app/game') },
      { find: '@card', replacement: resolve(__dirname, 'src/app/game/card') },
    ],
  },
  plugins: [vue(), viteTsConfigPaths()],
});
