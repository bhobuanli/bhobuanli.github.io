<script setup lang="ts">
const route = useRoute()
const articleRef = ref<HTMLElement | null>(null)

// GitHub Pages 会重定向到带尾斜杠的地址，而预渲染抓取的是无尾斜杠路径，
// 需要统一路径，否则 payload 键匹配不上会导致刷新后内容为空。
const contentPath = computed(() => {
  const path = route.path.replace(/\/+$/, '')

  return path.length ? path : '/'
})

let revealObserver: IntersectionObserver | null = null
let revealTimer = 0
let bodyTimer = 0
let bodyWatcher: MutationObserver | null = null

const { data: page } = await useAsyncData('page-' + contentPath.value, () => {
  return queryCollection('content').path(contentPath.value).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const articleDate = computed(() => {
  const value = page.value as { meta?: { date?: unknown }, date?: unknown } | null
  const raw = value?.meta?.date ?? value?.date

  if (typeof raw !== 'string' && typeof raw !== 'number') return ''

  const date = new Date(raw)

  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
})

const HEADING_SELECTOR = 'h1, h2, h3, h4'
const BLOCK_SELECTOR = 'blockquote'

// 把内容包进内联容器，遮罩宽度跟文字一致，而不是整行宽度
const wrapTextContent = (element: HTMLElement) => {
  const first = element.firstElementChild

  if (first instanceof HTMLElement && first.classList.contains('article-reveal-text')) {
    return first
  }

  const span = document.createElement('span')
  span.className = 'article-reveal-text'

  while (element.firstChild) {
    span.appendChild(element.firstChild)
  }

  element.appendChild(span)

  return span
}

const collectTargets = (article: HTMLElement) => {
  const targets: HTMLElement[] = []

  article.querySelectorAll<HTMLElement>(HEADING_SELECTOR).forEach((heading) => {
    if (heading.closest('pre, table')) return

    targets.push(wrapTextContent(heading))
  })

  const date = article.querySelector<HTMLElement>('.article-date')
  if (date) targets.push(wrapTextContent(date))

  article.querySelectorAll<HTMLElement>('p').forEach((paragraph) => {
    if (paragraph.closest('pre, table, header')) return

    targets.push(wrapTextContent(paragraph))
  })

  // 列表按每一条单独揭幕：只包文字内容，序号与圆点不参与遮罩
  article.querySelectorAll<HTMLElement>('li').forEach((item) => {
    if (item.closest('pre, table')) return

    // 含块级子元素时交给内部元素处理，避免嵌套遮罩
    if (item.querySelector('ul, ol, p, div, pre, blockquote')) return

    targets.push(wrapTextContent(item))
  })

  // 引用块内部没有段落时，直接对引用块文字揭幕
  article.querySelectorAll<HTMLElement>('blockquote').forEach((quote) => {
    if (quote.closest('pre, table')) return
    if (quote.querySelector('p, li')) return

    targets.push(wrapTextContent(quote))
  })

  return targets.sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  )
}

const revealTarget = (target: HTMLElement, step: number) => {
  if (target.classList.contains('is-visible')) return

  target.style.setProperty('--reveal-delay', `${Math.min(step, 6) * 0.07}s`)
  target.classList.add('is-visible')
  revealObserver?.unobserve(target)
}

const startReveal = (article: HTMLElement, targets: HTMLElement[]) => {
  article.classList.add('article-reveal-ready')
  targets.forEach((target) => target.classList.add('article-reveal-block'))

  if (!('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'))
    return
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      let step = 0

      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        revealTarget(entry.target as HTMLElement, step)
        step += 1
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  )

  // 页面切换期间整个面板被位移到视口外，观察器判定不稳定，
  // 首屏内容等滑入结束后按垂直位置直接揭幕。
  revealTimer = window.setTimeout(() => {
    const firstScreen = targets.filter((target) => {
      if (target.classList.contains('is-visible')) return false

      return target.getBoundingClientRect().top < window.innerHeight * 0.95
    })

    firstScreen.forEach((target, index) => revealTarget(target, index))

    targets
      .filter((target) => !target.classList.contains('is-visible'))
      .forEach((target) => revealObserver?.observe(target))
  }, 520)
}

onMounted(async () => {
  const article = articleRef.value

  if (!article || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  await nextTick()

  // 客户端跳转时 ContentRenderer 的正文可能晚于组件挂载出现，
  // 需要等正文真正插入后再收集一次。
  const bodyReady = () =>
    Array.from(article.children).some((child) => !child.classList.contains('article-header'))

  let applied = false

  const apply = () => {
    if (applied || !bodyReady()) return applied

    const targets = collectTargets(article)

    if (!targets.length) return false

    applied = true
    bodyWatcher?.disconnect()
    bodyWatcher = null
    window.clearTimeout(bodyTimer)

    startReveal(article, targets)

    return true
  }

  if (apply()) return

  bodyWatcher = new MutationObserver(() => {
    apply()
  })

  bodyWatcher.observe(article, { childList: true, subtree: true })

  bodyTimer = window.setTimeout(() => {
    if (!applied) {
      apply()
      bodyWatcher?.disconnect()
      bodyWatcher = null
    }
  }, 2500)
})

onBeforeUnmount(() => {
  window.clearTimeout(revealTimer)
  window.clearTimeout(bodyTimer)
  bodyWatcher?.disconnect()
  revealObserver?.disconnect()
})
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
    <ContentRenderer :value="page" />
  </article>
</template>
