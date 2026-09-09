<script setup lang="ts">
const props = defineProps<{ text: string }>()
</script>

<template>
  <span class="brand-reveal" aria-label="BHOBUANLI">
    <span v-for="(letter, index) in props.text.split('')" :key="`${letter}-${index}`" class="brand-letter">
      <span data-brand-strip class="brand-strip"><span>{{ letter }}</span><span aria-hidden="true">{{ letter }}</span></span>
    </span>
  </span>
</template>
