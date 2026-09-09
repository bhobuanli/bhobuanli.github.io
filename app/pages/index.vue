<script setup lang="ts">
const portrait = ref(false)
const revealScope = ref<HTMLElement | null>(null)
let revealObserver: IntersectionObserver | null = null

onMounted(() => {
  const targets = revealScope.value?.querySelectorAll<HTMLElement>('.reveal-target') ?? []

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"))
    return
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      entry.target.classList.add("is-visible")
      revealObserver?.unobserve(entry.target)
    })
  }, { threshold: 0.35 })

  targets.forEach((target) => revealObserver?.observe(target))
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
const blogs = [
  { title: '从零开始的个人博客', date: 'MAY 2026' },
  { title: '关于持续创作这件事', date: 'APR 2026' },
  { title: '练习、观察与表达', date: 'MAR 2026' },
  { title: '我的数字工作台', date: 'FEB 2026' },
  { title: '保持好奇，慢慢前进', date: 'JAN 2026' }
]
</script>
<template>
  <div ref="revealScope" class="home-page">
    <section class="intro-card">
      <div class="intro-content">
        <div class="intro-text-reveal reveal-target">
          <p class="intro-copy">一个色魔，一个喜欢大胸大屁股的俗人。</p><span class="blog-reveal-block" aria-hidden="true" />
        </div>
        <div class="social-links"><a href="https://x.com/bhobuanli" target="_blank" rel="noreferrer"
            aria-label="Twitter / X"><img src="/icons/twitter.svg" alt="Twitter / X"></a><a
            href="https://www.pixiv.net/users/14344706" target="_blank" rel="noreferrer" aria-label="Pixiv"><img
              src="/icons/pixiv.svg" alt="Pixiv"></a><a href="https://weibo.com/u/6037536393" target="_blank" rel="noreferrer"
            aria-label="微博"><img src="/icons/weibo.svg" alt="微博"></a></div>
      </div>
      <button class="portrait-switch" type="button" @click="portrait = !portrait">
        <img :src="portrait ? '/images/portrait-02.png' : '/images/portrait-01.png'" alt="zy" />
      </button>
    </section>
    <section class="section blogs-section">
      <h2 class="blogs-heading">BLOGS</h2>
      <div class="blog-list">
        <div v-for="(blog, index) in blogs" :key="blog.title" class="blog-reveal reveal-target">
          <NuxtLink to="/posts" class="blog-row">
            <span class="blog-text-reveal">
              <span class="blog-row-content">{{ blog.title }}</span>
              <span class="blog-reveal-block" :style="{ '--reveal-delay': index * 0.08 + 's' }" aria-hidden="true" />
            </span>
            <span class="blog-text-reveal blog-date-reveal">
              <time class="blog-row-content">{{ blog.date }}</time>
              <span class="blog-reveal-block" :style="{ '--reveal-delay': index * 0.08 + 0.08 + 's' }"
                aria-hidden="true" />
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
