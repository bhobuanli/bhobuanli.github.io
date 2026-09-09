<script setup lang="ts">
import { motion } from 'motion-v'

const portrait = ref(false)
const blogs = [
  { title: '从零开始的个人博客', date: 'MAY 2026' },
  { title: '关于持续创作这件事', date: 'APR 2026' },
  { title: '练习、观察与表达', date: 'MAR 2026' },
  { title: '我的数字工作台', date: 'FEB 2026' },
  { title: '保持好奇，慢慢前进', date: 'JAN 2026' }
]
</script>
<template>
  <section class="intro-card">
    <div class="intro-content"><p class="intro-copy">欢迎来到我的部落格，我叫陈小春，是兄弟，就来砍我。欢迎来到我的部落格，我叫陈小春，是兄弟，就来砍我欢迎来到我的部落格，我叫陈小春，是兄弟，就来砍我欢迎来到我的部落格，我叫陈小春，是兄弟，就来砍我欢迎来到我的部落格，我叫陈小春，是兄弟，就来砍我。</p><div class="social-links"><a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="Twitter / X"><img src="/icons/twitter.svg" alt="Twitter / X"></a><a href="https://www.pixiv.net/" target="_blank" rel="noreferrer" aria-label="Pixiv"><img src="/icons/pixiv.svg" alt="Pixiv"></a><a href="https://weibo.com/" target="_blank" rel="noreferrer" aria-label="微博"><img src="/icons/weibo.svg" alt="微博"></a></div></div>
    <button class="portrait-switch" type="button" aria-label="切换个人形象图" @click="portrait = !portrait">
      <img :src="portrait ? '/images/portrait-02.png' : '/images/portrait-01.png'" alt="个人形象图" />
    </button>
  </section>
  <section class="section blogs-section">
    <h2 class="blogs-heading">BLOGS</h2>
    <div class="blog-list">
      <div v-for="(blog, index) in blogs" :key="blog.title" class="blog-reveal">
        <NuxtLink to="/posts" class="blog-row">
          <span class="blog-text-reveal">
            <span class="blog-row-content">{{ blog.title }}</span>
            <motion.span class="blog-reveal-block" :initial="{ x: '0%' }" :while-in-view="{ x: '101%' }" :viewport="{ once: true, amount: 0.35 }" :transition="{ duration: 0.72, delay: index * 0.08, ease: [0.65, 0.05, 0, 1] }" aria-hidden="true" />
          </span>
          <span class="blog-text-reveal blog-date-reveal">
            <time class="blog-row-content">{{ blog.date }}</time>
            <motion.span class="blog-reveal-block" :initial="{ x: '0%' }" :while-in-view="{ x: '101%' }" :viewport="{ once: true, amount: 0.35 }" :transition="{ duration: 0.72, delay: index * 0.08 + 0.08, ease: [0.65, 0.05, 0, 1] }" aria-hidden="true" />
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>


