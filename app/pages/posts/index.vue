<script setup lang="ts">
const { data: posts } = await usePosts('posts')
</script>

<template>
  <section class="page-intro">
    <p class="eyebrow">WRITING</p>
    <h1>文章</h1>
    <p class="lead">记录正在学习的事，也记录还没有答案的问题。</p>
  </section>
  <div v-if="posts?.length" class="post-list">
    <NuxtLink v-for="post in posts" :key="post.path" :to="post.path" class="post-card">
      <span>{{ formatPostDate(getPostDateValue(post)) }}</span>
      <h2>{{ post.title }}</h2>
      <p>{{ post.description }}</p>
    </NuxtLink>
  </div>
  <p v-else class="empty-list">还没有文章。</p>
</template>
