// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://meow.science.fail',
  base: '/pebkac/',
  trailingSlash: 'always',
  integrations: [react()],
});