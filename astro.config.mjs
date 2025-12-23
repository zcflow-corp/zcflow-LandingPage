import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  site: isProd ? 'https://zcflow-corp.github.io' : 'http://localhost:4321',
  base: isProd ? '/zcflow-LandingPage/' : '/',

  server: {
    allowedHosts: ['porky-nonpossessively-kimberlie.ngrok-free.dev', 'localhost'],
  },

  trailingSlash: 'ignore',

  integrations: [react(), tailwind()],

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
