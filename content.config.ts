import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  renderer: {
    alias: {
      'x-post': 'ContentXPost',
      'x-embed': 'ContentXEmbed',
    },
  },
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
    }),
  },
})
