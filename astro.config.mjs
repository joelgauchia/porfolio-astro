import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import netlify from "@astrojs/netlify";

export default defineConfig({
  env: {
    schema: {
      API_KEY_RESEND: envField.string({ context: "server", access: "secret"})
    }
  },

  vite: {
    plugins: [tailwindcss()]
  },

  output: "server",
  adapter: netlify()
});