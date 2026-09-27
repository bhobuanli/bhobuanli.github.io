import { fileURLToPath } from 'node:url'
import rehypeLocalImageDimensions from './build/rehype-local-image-dimensions.mjs'

const publicDir = fileURLToPath(new URL('./public', import.meta.url))
const imageDimensionsPlugin = fileURLToPath(new URL('./build/rehype-local-image-dimensions.mjs', import.meta.url)).split('\\').join('/')

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/font.css', '~/assets/css/main.css'],
  app: {
    head: {
      title: 'BHOBUANLI',
      meta: [
        { name: 'description', content: 'BHOBUANLI 的个人博客，记录学习、创作与日常观察。' },
        { name: 'referrer', content: 'no-referrer' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },
  content: {
    build: {
      markdown: {
        rehypePlugins: {
          'local-image-dimensions': {
            instance: rehypeLocalImageDimensions,
            src: imageDimensionsPlugin,
            options: { publicDir },
          },
        },
      },
    },
  },
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  compatibilityDate: '2024-04-03',
  nitro: { preset: 'github-pages' },
})
