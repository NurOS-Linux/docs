import { defineConfig } from 'astro/config';
import { rehypeCallouts } from './src/lib/remark-callouts.mjs';

export default defineConfig({
  output: 'static',
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
  markdown: {
    rehypePlugins: [rehypeCallouts],
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
