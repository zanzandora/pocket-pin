import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

import './server/libs/env'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],
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
  },
})
