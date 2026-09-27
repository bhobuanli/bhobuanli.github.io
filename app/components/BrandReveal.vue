<script setup lang="ts">
defineProps<{ text: string }>()
const isActive = ref(false)
const reducedMotion = useReducedMotion()
let resetFrame = 0

const replay = () => {
  if (reducedMotion.value) return

  isActive.value = false
  cancelAnimationFrame(resetFrame)
  resetFrame = requestAnimationFrame(() => {
    isActive.value = true
  })
}

onMounted(() => {
  nextTick(replay)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(resetFrame)
})
</script>

<template>
  <span
    class="brand-reveal"
    :class="{ 'is-active': isActive }"
    :aria-label="text"
    @click="replay"
  >
    <span v-for="(letter, index) in text.split('')" :key="`${letter}-${index}`" class="brand-letter" aria-hidden="true">
      <span data-brand-strip class="brand-strip"><span>{{ letter }}</span><span aria-hidden="true">{{ letter }}</span></span>
    </span>
  </span>
</template>
