<script setup lang="ts">
const props = defineProps<{ text: string }>()
const isActive = ref(false)
let resetFrame = 0

const replay = () => {
  isActive.value = false
  cancelAnimationFrame(resetFrame)
  resetFrame = requestAnimationFrame(() => {
    isActive.value = true
  })
}
</script>

<template>
  <span class="brand-reveal" :class="{ 'is-active': isActive }" aria-label="BHOBUANLI" @click.prevent.stop="replay">
    <span v-for="(letter, index) in props.text.split('')" :key="`${letter}-${index}`" class="brand-letter">
      <span data-brand-strip class="brand-strip"><span>{{ letter }}</span><span aria-hidden="true">{{ letter }}</span></span>
    </span>
  </span>
</template>
