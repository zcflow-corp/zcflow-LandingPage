import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

const env = process.env.DEPLOY_ENV || 'dev'

const siteUrls = {
  dev: 'https://dev-landing.zcflow.com',
  uat: 'https://uat-landing.zcflow.com',
  prd: 'https://zcflow.com',
}

export default defineConfig({
  output: 'static',
  site: siteUrls[env] || 'http://localhost:4321',
  base: '/',
  server: {
    allowedHosts: ['localhost'],
  },
  trailingSlash: 'ignore',
  integrations: [react(), tailwind()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
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