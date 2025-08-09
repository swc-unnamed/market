import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: [vitePreprocess(), mdsvex()],
  kit: { 
    adapter: adapter(),
    experimental: {
      remoteFunctions: true,
    }
  },
  compilerOptions: {
    experimental: {
      async: true
    }
  },
  extensions: ['.svelte', '.svx']
};

export default config;
