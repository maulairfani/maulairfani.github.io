import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://irfani.me',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
