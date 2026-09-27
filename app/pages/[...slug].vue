<script setup lang="ts">
import ArticleImage from '~/components/content/ArticleImage.vue'
const route = useRoute()
const articleRef = ref<HTMLElement | null>(null)
const contentComponents = { img: ArticleImage }

const contentPath = computed(() => {
  const path = route.path.replace(/\/+$/, '')
  return path.length ? path : '/'
})

const { data: page } = await useAsyncData('page-' + contentPath.value, () => {
  return queryCollection('content').path(contentPath.value).first()
})

if (!page.value) setResponseStatus(404)

const articleDate = computed(() => {
  return page.value ? formatPostDate(getPostDateValue(page.value)) : ''
})

const articleTitle = computed(() => page.value?.title ? `${page.value.title} | BHOBUANLI` : 'BHOBUANLI')
const articleDescription = computed(() => {
  const description = page.value?.description
  return typeof description === 'string' && description.trim()
    ? description
    : 'BHOBUANLI 的个人博客，记录学习、创作与日常观察。'
})

useHead(() => ({
  title: articleTitle.value,
  meta: [
    { name: 'description', content: articleDescription.value },
    { property: 'og:title', content: articleTitle.value },
    { property: 'og:description', content: articleDescription.value },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `https://bhobuanli.github.io${route.path}` },
  ],
  link: [
    { rel: 'canonical', href: `https://bhobuanli.github.io${route.path}` },
  ],
}))

useArticleReveal(articleRef)
</script>

<template>
  <article
    v-if="page"
    ref="articleRef"
    class="article prose prose-base mx-auto max-w-[900px] prose-pre:!bg-zinc-900 prose-pre:!text-zinc-100 prose-pre:!border-0 [&_pre_code_span]:!text-zinc-100"
  >
    <header class="article-header">
      <h1 class="article-title">{{ page.title }}</h1>
      <time v-if="articleDate" class="article-date">{{ articleDate }}</time>
    </header>
    <ContentRenderer :value="page" :components="contentComponents" />
  </article>

  <section v-else class="article-missing">
    <p class="article-missing-code">404</p>
    <h1>这篇文章不存在</h1>
    <p>它可能已经被删除，或者链接地址有误。</p>
    <NuxtLink to="/" class="article-missing-link">返回首页</NuxtLink>
  </section>
</template>
