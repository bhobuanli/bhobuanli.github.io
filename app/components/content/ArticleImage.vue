<script setup lang="ts">
const props = defineProps<{
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
}>()

const runtimeConfig = useRuntimeConfig()
const resolvedSrc = computed(() => {
  const source = props.src ?? ''
  const baseURL = runtimeConfig.app.baseURL

  if (!source.startsWith('/') || source.startsWith('//') || !baseURL || baseURL === '/') return source
  if (source.startsWith(baseURL)) return source

  return `${baseURL.replace(/\/$/, '')}${source}`
})
</script>

<template>
  <img
    :src="resolvedSrc"
    :alt="props.alt ?? ''"
    :width="props.width"
    :height="props.height"
    loading="lazy"
    decoding="async"
  >
</template>
