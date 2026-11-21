// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { guides } from './src/data/guides.ts';

const updatedByPath = new Map(guides.filter((g) => g.updated).map((g) => [g.path, g.updated]));

// https://astro.build/config
export default defineConfig({
  site: 'https://irfani.me',
  integrations: [
    react(),
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname;
        const updated = updatedByPath.get(path);
        if (updated) item.lastmod = new Date(updated);
        return item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});