import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ command }) => {
  return {
    root: 'src',
    base: '/goit-js-hw-12/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)), // правильний alias @ → src
      },
    },
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    build: {
      outDir: '../docs',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        input: glob.sync('./src/*.html'),
      },
    },
    plugins: [
      injectHTML(),
      FullReload(['./src/**/**.html']),
      SortCss({ sort: 'mobile-first' }),
    ],
  };
});
