// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://meow.science.fail',
  base: '/pebkac',
  integrations: [preact({ compat: true })]
});