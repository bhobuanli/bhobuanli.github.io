<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'

const route = useRoute()
const router = useRouter()
const direction = ref(1)
const isArticle = computed(() => route.path.startsWith('/posts/'))

router.beforeEach((to, from) => {
  if (to.path !== from.path) {
    direction.value = to.path === '/' ? -1 : 1
  }
})

const slide = { duration: 0.52, ease: [0.4, 0, 0.2, 1] }

const viewEnter = computed(() => ({
  x: direction.value > 0 ? '100%' : '-100%',
  opacity: 0,
}))

const viewCenter = {
  x: '0%',
  opacity: 1,
  transition: {
    x: slide,
    opacity: { duration: 0.24, ease: [0.4, 0, 0.2, 1] },
  },
}

const viewExit = computed(() => ({
  x: direction.value > 0 ? '-100%' : '100%',
  opacity: 0,
  transition: {
    x: slide,
    opacity: { duration: 0.18, delay: 0.34, ease: 'linear' },
  },
}))
</script>

<template>
  <div class="site-shell" :class="{ 'is-article': isArticle }">
    <header class="site-header">
      <NuxtLink to="/" class="brand"><BrandReveal text="BHOBUANLI" /></NuxtLink>
    </header>
    <main class="page-viewport">
      <NuxtPage v-slot="{ Component }">
        <AnimatePresence mode="sync">
          <motion.div
            v-if="Component"
            :key="route.fullPath"
            class="page-panel"
            :initial="viewEnter"
            :animate="viewCenter"
            :exit="viewExit"
          >
            <component :is="Component" />
          </motion.div>
        </AnimatePresence>
      </NuxtPage>
    </main>
    <footer />
  </div>
</template>

<style scoped>
.page-viewport {
  position: relative;
  display: grid;
  align-items: start;
  overflow: visible;
}

.page-panel {
  grid-area: 1 / 1;
  width: 100%;
  min-width: 0;
  background: #fcfcfc;
}
</style>
