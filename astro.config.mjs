import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import node from "@astrojs/node";

export default defineConfig({
  site: 'https://joelgauchia.netlify.app',

  env: {
    schema: {
      // Optional so a missing key only breaks the contact action instead of
      // failing the whole page render; the action reports it cleanly.
      RESEND_API_KEY: envField.string({ context: "server", access: "secret", optional: true })
    }
  },

  vite: {
    plugins: [tailwindcss()]
  },

  output: "server",
  adapter: node({ mode: "standalone" }),
});