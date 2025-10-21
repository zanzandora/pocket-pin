import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

import env from './server/libs/env'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@vee-validate/nuxt',
    'nuxt-csurf',
    'nuxt-maplibre',
  ],

  css: ['~/app/assets/css/main.css'],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    resolve: {
      alias: {
        '#server': resolve(__dirname, 'server'),
        '@': resolve(__dirname, '.'),
        '~': resolve(__dirname, '.'),
      },
    },
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['typesense-instantsearch-adapter', 'maplibre-gl'],
    },
  },

  build: {
    transpile: ['nuxt-maplibre'],
  },

  auth: {
    isEnabled: true,
    baseURL: env.AUTH_ORIGIN || 'http://localhost:3000',
    originEnvKey: 'AUTH_ORIGIN',
    provider: {
      authjs: {},
    },
    pages: {
      error: '/error',
    },
  },

  csurf: {
    addCsrfTokenToEventCtx: true,
  },

  routeRules: {
    '/api/auth/**': {
      csurf: false,
    },
  },
})
