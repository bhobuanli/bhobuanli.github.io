<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const direction = ref<1 | -1>(1)
const isArticle = computed(() => route.path.startsWith('/posts/'))
const pageTransition = usePageTransition(direction)

router.beforeEach((to, from) => {
  if (to.path !== from.path) {
    direction.value = to.path === '/' ? -1 : 1
  }
})

</script>

<template>
  <div class="site-shell" :class="{ 'is-article': isArticle }">
    <header class="site-header">
      <NuxtLink to="/" class="brand"><BrandReveal text="BHOBUANLI" /></NuxtLink>
    </header>
    <main class="page-viewport">
      <NuxtPage :transition="pageTransition" />
    </main>
    <footer />
  </div>
</template>

<style>
.page-viewport {
  position: relative;
  display: grid;
  align-items: start;
  overflow: visible;
}

.page-forward-enter-active,
.page-forward-leave-active,
.page-back-enter-active,
.page-back-leave-active {
  grid-area: 1 / 1;
  width: 100%;
  min-width: 0;
  background: #fcfcfc;
  transition:
    transform .52s cubic-bezier(.4, 0, .2, 1),
    opacity .24s cubic-bezier(.4, 0, .2, 1);
}

.page-forward-enter-from { transform: translateX(100%); opacity: 0; }
.page-forward-leave-to { transform: translateX(-100%); opacity: 0; }
.page-back-enter-from { transform: translateX(-100%); opacity: 0; }
.page-back-leave-to { transform: translateX(100%); opacity: 0; }
</style>
