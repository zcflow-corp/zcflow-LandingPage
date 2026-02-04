import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import node from '@astrojs/node' // 👈 ESTA LÍNEA FALTABA

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  site: isProd ? 'https://zcflow-corp.github.io' : 'http://localhost:4321',
  output: 'server',
  base: isProd ? '/zcflow-LandingPage/' : '/',
  adapter: node({
    mode: 'standalone',
  }),

  server: {
    allowedHosts: ['porky-nonpossessively-kimberlie.ngrok-free.dev', 'localhost'],
  },

  trailingSlash: 'ignore',

  integrations: [react(), tailwind()],

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
      fallbackType: 'rewrite',
    },
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
