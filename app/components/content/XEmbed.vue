<script setup lang="ts">
const props = withDefaults(defineProps<{
  url: string
  hideConversation?: boolean | string
}>(), {
  hideConversation: true,
})

const root = ref<HTMLElement | null>(null)

declare global {
  interface Window {
    twttr?: { widgets?: { load: (element?: HTMLElement) => void } }
  }
}

const loadWidget = () => new Promise<void>((resolve) => {
  const existing = document.querySelector<HTMLScriptElement>('script[src="https://platform.x.com/widgets.js"]')
  if (existing) {
    if (window.twttr?.widgets) window.twttr.widgets.load(root.value ?? undefined)
    else existing.addEventListener('load', () => window.twttr?.widgets?.load(root.value ?? undefined), { once: true })
    resolve()
    return
  }

  const script = document.createElement('script')
  script.src = 'https://platform.x.com/widgets.js'
  script.async = true
  script.charset = 'utf-8'
  script.addEventListener('load', () => {
    window.twttr?.widgets?.load(root.value ?? undefined)
    resolve()
  }, { once: true })
  document.head.appendChild(script)
})

onMounted(loadWidget)
</script>

<template>
  <div ref="root" class="x-embed" data-reveal-skip>
    <blockquote class="twitter-tweet" :data-conversation="hideConversation ? 'none' : undefined">
      <a :href="url">在 X 查看原帖</a>
    </blockquote>
  </div>
</template>
