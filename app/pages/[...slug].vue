<script setup lang="ts">
const route = useRoute()
const articleRef = ref<HTMLElement | null>(null)

// GitHub Pages 会重定向到带尾斜杠的地址，而预渲染抓取的是无尾斜杠路径，
// 需要统一路径，否则 payload 键匹配不上会导致刷新后内容为空。
const contentPath = computed(() => {
  const path = route.path.replace(/\/+$/, '')

  return path.length ? path : '/'
})

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

type RevealLine = { top: number, left: number, width: number, height: number }
type RevealHost = { target: HTMLElement, content: HTMLElement, blocks: HTMLElement[] }

const HEADING_SELECTOR = 'h1, h2, h3, h4'

let revealObserver: IntersectionObserver | null = null
let layoutObserver: ResizeObserver | null = null
let layoutFrame = 0
let bodyTimer = 0
let bodyWatcher: MutationObserver | null = null

const hosts: RevealHost[] = []
const cleanupTimers = new Set<number>()

const collectTargets = (article: HTMLElement) => {
  const targets: HTMLElement[] = []

  article.querySelectorAll<HTMLElement>(HEADING_SELECTOR).forEach((heading) => {
    if (heading.closest('pre, table')) return

    targets.push(heading)
  })

  const date = article.querySelector<HTMLElement>('.article-date')
  if (date) targets.push(date)

  article.querySelectorAll<HTMLElement>('p').forEach((paragraph) => {
    if (paragraph.closest('pre, table, header')) return

    // 图片段落没有可测的文本行，跳过
    if (paragraph.querySelector('img')) return

    targets.push(paragraph)
  })

  article.querySelectorAll<HTMLElement>('li').forEach((item) => {
    if (item.closest('pre, table')) return

    // 含块级子元素的条目交给内部元素处理，避免嵌套遮罩
    if (item.querySelector('ul, ol, p, div, pre, blockquote')) return

    targets.push(item)
  })

  article.querySelectorAll<HTMLElement>('blockquote').forEach((quote) => {
    if (quote.closest('pre, table')) return
    if (quote.querySelector('p, li')) return

    targets.push(quote)
  })

  return targets.sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  )
}

// 目标内容包一层无语义容器：测量时不会把遮罩本身算进去，也不影响排版
const prepareHost = (target: HTMLElement): RevealHost => {
  const content = document.createElement('span')

  while (target.firstChild) content.appendChild(target.firstChild)

  target.appendChild(content)
  target.classList.add('article-reveal-host')

  return { target, content, blocks: [] }
}

// 把同一行的内联片段合并成一个矩形，得到「每行一块」
const measureLines = (content: HTMLElement): RevealLine[] => {
  const range = document.createRange()
  range.selectNodeContents(content)

  const fragments = Array.from(range.getClientRects())
    .filter((rect) => rect.width > 1 && rect.height > 1)
    .sort((a, b) => (a.top - b.top) || (a.left - b.left))

  const lines: Array<{ top: number, bottom: number, left: number, right: number }> = []

  fragments.forEach((fragment) => {
    const line = lines[lines.length - 1]

    if (line && fragment.top < line.bottom - 2) {
      line.top = Math.min(line.top, fragment.top)
      line.bottom = Math.max(line.bottom, fragment.bottom)
      line.left = Math.min(line.left, fragment.left)
      line.right = Math.max(line.right, fragment.right)
      return
    }

    lines.push({
      top: fragment.top,
      bottom: fragment.bottom,
      left: fragment.left,
      right: fragment.right,
    })
  })

  return lines.map((line) => ({
    top: line.top,
    left: line.left,
    width: line.right - line.left,
    height: line.bottom - line.top,
  }))
}

// 把遮罩块对齐到当前排版；行数变化时同步增删
const layoutHost = (host: RevealHost) => {
  const lines = measureLines(host.content)

  if (!lines.length) return

  const targetRect = host.target.getBoundingClientRect()
  const styles = getComputedStyle(host.target)
  const baseLeft = targetRect.left + (parseFloat(styles.borderLeftWidth) || 0)
  const baseTop = targetRect.top + (parseFloat(styles.borderTopWidth) || 0)

  while (host.blocks.length < lines.length) {
    const block = document.createElement('span')

    block.className = 'article-line-block'
    block.setAttribute('aria-hidden', 'true')
    host.target.appendChild(block)
    host.blocks.push(block)
  }

  while (host.blocks.length > lines.length) {
    host.blocks.pop()?.remove()
  }

  lines.forEach((line, index) => {
    const block = host.blocks[index]

    // 分别向外取整四条边，避免左上取整后右下少覆盖一个像素。
    const top = Math.floor(line.top - baseTop)
    const left = Math.floor(line.left - baseLeft)
    block.style.top = `${top}px`
    block.style.left = `${left}px`
    block.style.width = `${Math.ceil(line.left + line.width - baseLeft) - left}px`
    block.style.height = `${Math.ceil(line.top + line.height - baseTop) - top}px`
    block.style.setProperty('--line-index', String(Math.min(index, 5)))
  })
}

// 每行独立清理，首行不必等到最后一行结束才移除遮罩。
const clearBlocksAfterReveal = (host: RevealHost) => {
  const blocks = [...host.blocks]
  blocks.forEach((block) => {
    const clear = () => {
      block.remove()
      host.blocks = host.blocks.filter(item => item !== block)
      window.clearTimeout(timer)
      cleanupTimers.delete(timer)
    }
    const timer = window.setTimeout(clear, 2200)
    cleanupTimers.add(timer)
    block.addEventListener('animationend', clear, { once: true })
    block.addEventListener('animationcancel', clear, { once: true })
  })
}

const revealHost = (host: RevealHost, step: number) => {
  if (host.target.classList.contains('is-visible')) return

  // 动画开始前再对齐一次，避免过渡中的布局变化留下错位
  layoutHost(host)

  host.target.style.setProperty('--reveal-delay', `${Math.min(step, 6) * 0.07}s`)
  host.target.classList.add('is-visible')
  revealObserver?.unobserve(host.target)

  clearBlocksAfterReveal(host)
}

const startReveal = () => {
  if (!('IntersectionObserver' in window)) {
    hosts.forEach((host, step) => revealHost(host, step))
    return
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      let step = 0

      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        const host = hosts.find((item) => item.target === entry.target)

        if (host) {
          revealHost(host, step)
          step += 1
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  )

  // 调用前已等到面板和宽度稳定，不再猜测固定的转场延时。
  let step = 0

  hosts.forEach((host) => {
    if (host.target.classList.contains('is-visible')) return
    if (host.target.getBoundingClientRect().top >= window.innerHeight * 0.95) return

    revealHost(host, step)
    step += 1
  })

  hosts
    .filter((host) => !host.target.classList.contains('is-visible'))
    .forEach((host) => revealObserver?.observe(host.target))
}

// 内容和逐行色块一起滑入；这里只安排揭幕时机，不隐藏内容。
// 宽度过渡期间 ResizeObserver 会持续更新已有遮罩的行位置。
const waitForLayout = (article: HTMLElement) => {
  const ancestors: Element[] = []
  for (let node: Element | null = article; node; node = node.parentElement) ancestors.push(node)
  let previous = ''
  let stableFrames = 0
  const started = performance.now()

  const check = () => {
    const rect = article.getBoundingClientRect()
    const geometry = [rect.left, rect.top, rect.width, rect.height].join(',')
    const transitioning = ancestors.some(node =>
      node.getAnimations().some(animation => animation.playState === 'running'),
    )
    stableFrames = geometry === previous && !transitioning ? stableFrames + 1 : 0
    previous = geometry

    if (stableFrames >= 3 || performance.now() - started > 2500) {
      startReveal()
      return
    }
    layoutFrame = requestAnimationFrame(check)
  }
  layoutFrame = requestAnimationFrame(check)
}

onMounted(async () => {
  const article = articleRef.value

  if (!article || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  await nextTick()

  // 客户端跳转时 ContentRenderer 的正文可能晚于组件挂载出现，
  // 需要等正文真正插入后再收集。
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

    // 同一帧内包裹文字并创建遮罩，转场中不会出现只有分隔线的空白阶段。
    targets.forEach((target) => {
      const host = prepareHost(target)
      layoutHost(host)
      hosts.push(host)
    })

    layoutObserver = new ResizeObserver(() => {
      hosts.forEach((host) => {
        if (!host.target.classList.contains('is-visible')) layoutHost(host)
      })
    })
    layoutObserver.observe(article)
    waitForLayout(article)

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
  window.cancelAnimationFrame(layoutFrame)
  cleanupTimers.forEach(timer => window.clearTimeout(timer))
  cleanupTimers.clear()
  window.clearTimeout(bodyTimer)
  bodyWatcher?.disconnect()
  revealObserver?.disconnect()
  layoutObserver?.disconnect()
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
