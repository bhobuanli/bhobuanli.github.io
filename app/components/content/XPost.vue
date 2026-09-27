<script setup lang="ts">
import snapshots from '~~/data/x-posts.json'

type Link = { url: string, expandedUrl: string, displayUrl?: string }
type Photo = { url: string, width: number, height: number, alt?: string }
type Video = {
  url: string
  contentType: string
  poster: string | null
  width: number
  height: number
  type: 'video' | 'gif'
  durationMs: number | null
}
type Snapshot = {
  id: string
  url: string
  author: { name: string, handle: string, avatarUrl: string | null }
  text: string
  createdAt: string
  links: Link[]
  photos: Photo[]
  video?: Video | null
}

const props = defineProps<{ url: string }>()
const tapFeedback = useTapFeedback()
const postId = computed(() => props.url.match(/status\/(\d+)/)?.[1] ?? '')
const post = computed(() => (snapshots as Record<string, Snapshot>)[postId.value])

const date = computed(() => {
  if (!post.value) return ''
  const value = new Date(post.value.createdAt)
  return Number.isNaN(value.getTime())
    ? ''
    : value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
})

const initials = computed(() => post.value?.author.name.slice(0, 2).toUpperCase() ?? 'X')

const tokenize = (text: string) => {
  const replacements = new Map(post.value!.links.map(link => [link.url, link]))
  return text.split(/(https?:\/\/[^\s]+|#[\p{L}\p{N}_]+)/gu).filter(Boolean).map((value) => {
    const link = replacements.get(value)
    if (link) return { text: link.displayUrl || link.expandedUrl, href: link.expandedUrl }
    if (value.startsWith('#')) return { text: value, href: `https://x.com/hashtag/${encodeURIComponent(value.slice(1))}` }
    return { text: value, href: '' }
  })
}

const textParagraphs = computed(() => {
  if (!post.value) return []
  return post.value.text.split(/\n{2,}/).map(tokenize)
})

</script>

<template>
  <section v-if="post" class="x-post" data-reveal-skip>
    <header class="x-post-header">
      <img
        v-if="post.author.avatarUrl"
        class="x-post-avatar"
        :src="post.author.avatarUrl"
        :alt="post.author.name"
        width="36"
        height="36"
        loading="lazy"
        referrerpolicy="no-referrer"
      >
      <span v-else class="x-post-avatar-fallback" aria-hidden="true">{{ initials }}</span>
      <span class="x-post-author">
        <strong class="x-post-author-name">{{ post.author.name }}</strong>
        <span class="x-post-author-handle">@{{ post.author.handle }}</span>
      </span>
      <time class="x-post-time">{{ date }}</time>
    </header>

    <div class="x-post-text">
      <p v-for="(paragraph, paragraphIndex) in textParagraphs" :key="paragraphIndex">
        <template v-for="(part, index) in paragraph" :key="index">
          <a v-if="part.href" :href="part.href" target="_blank" rel="noopener noreferrer">{{ part.text }}</a>
          <template v-else>{{ part.text }}</template>
        </template>
      </p>
    </div>

    <div
      v-if="post.video"
      class="x-post-video"
      :style="{ aspectRatio: `${post.video.width} / ${post.video.height}` }"
    >
      <video
        :controls="post.video.type !== 'gif'"
        playsinline
        preload="metadata"
        :poster="post.video.poster || undefined"
        :loop="post.video.type === 'gif'"
        :muted="post.video.type === 'gif'"
        :autoplay="post.video.type === 'gif'"
      >
        <source :src="post.video.url" :type="post.video.contentType">
      </video>
    </div>

    <div v-else-if="post.photos.length" class="x-post-media" :class="{ 'is-multiple': post.photos.length > 1 }">
      <a v-for="photo in post.photos" :key="photo.url" :href="post.url" target="_blank" rel="noopener noreferrer" :style="{ aspectRatio: `${photo.width} / ${photo.height}` }">
        <img
          :src="photo.url"
          :alt="photo.alt || ''"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
        >
      </a>
    </div>

    <footer class="x-post-footer">
      <a
        :href="post.url"
        target="_blank"
        rel="noopener noreferrer"
        @click="tapFeedback"
      >VIEW ON X</a>
    </footer>
  </section>

  <section v-else class="x-post x-post-unavailable" data-reveal-skip>
    <p>此 X 内容当前没有本地快照。<a :href="url" target="_blank" rel="noopener noreferrer">在 X 查看原帖</a></p>
  </section>
</template>
