<script setup lang="ts">
const portrait = ref(false)
const { data: posts } = await usePosts('home-posts')
const revealScope = ref<HTMLElement | null>(null)
const tapFeedback = useTapFeedback()

useScrollReveal(revealScope, { threshold: 0.35 })

const formatDate = (post: { meta?: { date?: unknown }, date?: unknown }) => {
  return formatPostDate(getPostDateValue(post))
}
</script>
<template>
  <div ref="revealScope" class="home-page">
    <section class="intro-card">
      <div class="intro-content">
        <div class="intro-text-reveal reveal-target">
          <p class="intro-copy">不擅长数字，不爱动脑，喜欢熟女，社交平台通常发一些充满个人癖好的画。</p><span class="blog-reveal-block" aria-hidden="true" />
        </div>
        <div class="social-links"><a href="https://x.com/bhobuanli" target="_blank" rel="noreferrer"
            aria-label="Twitter / X" @click="tapFeedback"><img src="/icons/twitter.svg" alt="Twitter / X" draggable="false"></a><a
            href="https://www.pixiv.net/users/14344706" target="_blank" rel="noreferrer" aria-label="Pixiv" @click="tapFeedback"><img
              src="/icons/pixiv.svg" alt="Pixiv" draggable="false"></a><a href="https://weibo.com/u/6037536393" target="_blank"
            rel="noreferrer" aria-label="微博" @click="tapFeedback"><img src="/icons/weibo.svg" alt="微博" draggable="false"></a></div>
      </div>
      <button class="portrait-switch" type="button" @click="portrait = !portrait">
        <img :src="portrait ? '/images/portrait-02.png' : '/images/portrait-01.png'" alt="zy" draggable="false" />
      </button>
    </section>
    <section class="section blogs-section">
      <h2 class="blogs-heading">BLOGS</h2>
      <div class="blog-list">
        <div v-for="(blog, index) in posts || []" :key="blog.path" class="blog-reveal reveal-target">
          <NuxtLink :to="blog.path" class="blog-row" @click="tapFeedback">
            <span class="blog-text-reveal">
              <span class="blog-row-content">{{ blog.title }}</span>
              <span class="blog-reveal-block" :style="{ '--reveal-delay': index * 0.08 + 's' }" aria-hidden="true" />
            </span>
            <span class="blog-date-line">
            <span class="blog-text-reveal blog-date-reveal">
              <time class="blog-row-content">{{ formatDate(blog) }}</time>
              <span class="blog-reveal-block" :style="{ '--reveal-delay': index * 0.08 + 0.08 + 's' }" aria-hidden="true" />
            </span>
            </span>
          </NuxtLink>
        </div>
        <p v-if="!posts?.length" class="empty-list">跑路了</p>
      </div>
    </section>
  </div>
</template>
