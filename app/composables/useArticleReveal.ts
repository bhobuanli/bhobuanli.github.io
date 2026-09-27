type RevealLine = { top: number, left: number, width: number, height: number }
type RevealHost = { target: HTMLElement, content: HTMLElement, blocks: HTMLElement[] }

const HEADING_SELECTOR = 'h1, h2, h3, h4'

export const useArticleReveal = (articleRef: Ref<HTMLElement | null>) => {
  const reducedMotion = useReducedMotion()
  const hosts: RevealHost[] = []
  const cleanupTimers = new Set<number>()

  let revealObserver: IntersectionObserver | null = null
  let layoutObserver: ResizeObserver | null = null
  let layoutFrame = 0
  let relayoutFrame = 0
  let bodyTimer = 0
  let bodyWatcher: MutationObserver | null = null

  const collectTargets = (article: HTMLElement) => {
    const targets: HTMLElement[] = []

    article.querySelectorAll<HTMLElement>(HEADING_SELECTOR).forEach((heading) => {
      if (!heading.closest('pre, table')) targets.push(heading)
    })

    const date = article.querySelector<HTMLElement>('.article-date')
    if (date) targets.push(date)

    article.querySelectorAll<HTMLElement>('p').forEach((paragraph) => {
      if (paragraph.closest('pre, table, header, [data-reveal-skip]')) return
      if (paragraph.querySelector('img')) return
      targets.push(paragraph)
    })

    article.querySelectorAll<HTMLElement>('li').forEach((item) => {
      if (item.closest('pre, table, [data-reveal-skip]')) return
      if (item.querySelector('ul, ol, p, div, pre, blockquote')) return
      targets.push(item)
    })

    article.querySelectorAll<HTMLElement>('blockquote').forEach((quote) => {
      if (quote.closest('pre, table, [data-reveal-skip]')) return
      if (!quote.querySelector('p, li')) targets.push(quote)
    })

    return targets.sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    )
  }

  const prepareHost = (target: HTMLElement): RevealHost => {
    const content = document.createElement('span')

    while (target.firstChild) content.appendChild(target.firstChild)

    target.appendChild(content)
    target.classList.add('article-reveal-host')

    return { target, content, blocks: [] }
  }

  const measureLines = (content: HTMLElement): RevealLine[] => {
    const range = document.createRange()
    range.selectNodeContents(content)

    const fragments = Array.from(range.getClientRects())
      .filter(rect => rect.width > 1 && rect.height > 1)
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

    return lines.map(line => ({
      top: line.top,
      left: line.left,
      width: line.right - line.left,
      height: line.bottom - line.top,
    }))
  }

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

    while (host.blocks.length > lines.length) host.blocks.pop()?.remove()

    lines.forEach((line, index) => {
      const block = host.blocks[index]
      const top = Math.floor(line.top - baseTop)
      const left = Math.floor(line.left - baseLeft)

      block.style.top = `${top}px`
      block.style.left = `${left}px`
      block.style.width = `${Math.ceil(line.left + line.width - baseLeft) - left}px`
      block.style.height = `${Math.ceil(line.top + line.height - baseTop) - top}px`
      block.style.setProperty('--line-index', String(Math.min(index, 5)))
    })
  }

  const relayout = () => {
    relayoutFrame = 0
    hosts.forEach((host) => {
      if (!host.target.classList.contains('is-visible')) layoutHost(host)
    })
  }

  const scheduleRelayout = () => {
    if (!relayoutFrame) relayoutFrame = requestAnimationFrame(relayout)
  }

  const clearBlocksAfterReveal = (host: RevealHost) => {
    ;[...host.blocks].forEach((block) => {
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

    revealObserver = new IntersectionObserver((entries) => {
      let step = 0

      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const host = hosts.find(item => item.target === entry.target)
        if (!host) return
        revealHost(host, step)
        step += 1
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })

    let step = 0
    hosts.forEach((host) => {
      if (host.target.classList.contains('is-visible')) return
      if (host.target.getBoundingClientRect().top >= window.innerHeight * 0.95) return
      revealHost(host, step)
      step += 1
    })

    hosts
      .filter(host => !host.target.classList.contains('is-visible'))
      .forEach(host => revealObserver?.observe(host.target))
  }

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
    if (!article || reducedMotion.value) return

    await nextTick()
    try {
      await document.fonts?.ready
    } catch {
      // Continue with the fallback font if FontFaceSet is unavailable.
    }

    const bodyReady = () => Array.from(article.children)
      .some(child => !child.classList.contains('article-header'))

    let applied = false
    let applying = false

    const apply = async () => {
      if (applied || applying || !bodyReady()) return applied
      applying = true

      const targets = collectTargets(article)
      if (!targets.length) {
        applying = false
        return false
      }

      applied = true
      bodyWatcher?.disconnect()
      bodyWatcher = null
      window.clearTimeout(bodyTimer)

      targets.forEach((target) => {
        const host = prepareHost(target)
        layoutHost(host)
        hosts.push(host)
      })

      layoutObserver = new ResizeObserver(scheduleRelayout)
      layoutObserver.observe(article)
      waitForLayout(article)
      applying = false
      return true
    }

    if (await apply()) return

    bodyWatcher = new MutationObserver(() => {
      void apply()
    })
    bodyWatcher.observe(article, { childList: true, subtree: true })

    bodyTimer = window.setTimeout(() => {
      void apply().finally(() => {
        bodyWatcher?.disconnect()
        bodyWatcher = null
      })
    }, 2500)
  })

  onBeforeUnmount(() => {
    window.cancelAnimationFrame(layoutFrame)
    window.cancelAnimationFrame(relayoutFrame)
    cleanupTimers.forEach(timer => window.clearTimeout(timer))
    cleanupTimers.clear()
    window.clearTimeout(bodyTimer)
    bodyWatcher?.disconnect()
    revealObserver?.disconnect()
    layoutObserver?.disconnect()
  })
}
