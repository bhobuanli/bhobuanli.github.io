<script setup lang="ts">
const podcasts = [
  { title: '从零开始的个人博客', date: 'MAY 2026' },
  { title: '关于持续创作这件事', date: 'APR 2026' },
  { title: '练习、观察与表达', date: 'MAR 2026' },
  { title: '我的数字工作台', date: 'FEB 2026' },
  { title: '保持好奇，慢慢前进', date: 'JAN 2026' }
]
</script>
<template>
  <section class="intro-card"><p>我是一个人。</p></section>
  <section class="section">
    <div class="podcast-list">
      <NuxtLink v-for="podcast in podcasts" :key="podcast.title" to="/posts" class="podcast-row">
        <span>{{ podcast.title }}</span><time>{{ podcast.date }}</time>
      </NuxtLink>
    </div>
  </section>
</template>
