import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import node from "@astrojs/node";

export default defineConfig({
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: "server", access: "secret"})
    }
  },

  vite: {
    plugins: [tailwindcss()]
  },

  output: "server",
  adapter: node({ mode: "standalone" }),
});