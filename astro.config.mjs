import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import vercel from "@astrojs/vercel/serverless";
import react from '@astrojs/react'

export default defineConfig({
  site: 'http://localhost:4321',
  server: {
    allowedHosts: ['porky-nonpossessively-kimberlie.ngrok-free.dev', 'localhost'],
  },
  adapter: vercel(),
  trailingSlash: 'always', // importante para que /en funcione como /en/
  integrations: [react()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/styles/mixins" as *;
          
          `,
        },
      },
    },
  },
})
