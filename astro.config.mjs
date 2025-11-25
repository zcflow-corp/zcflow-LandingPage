import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  // 👇 En dev usa localhost, en build usa el dominio de GitHub Pages
  site: isProd ? 'https://zcflow-corp.github.io' : 'http://localhost:4321',

  // 👇 En build el sitio vive bajo /zcflow-LandingPage/
  base: isProd ? '/zcflow-LandingPage/' : '/',

  server: {
    allowedHosts: ['porky-nonpossessively-kimberlie.ngrok-free.dev', 'localhost'],
  },

  trailingSlash: 'always', // como ya lo tenías
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
