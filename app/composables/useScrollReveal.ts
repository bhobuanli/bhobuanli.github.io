type ScrollRevealOptions = {
  selector?: string
  threshold?: number
  rootMargin?: string
}

export const useScrollReveal = (
  scope: Readonly<Ref<HTMLElement | null>>,
  options: ScrollRevealOptions = {},
) => {
  const reducedMotion = useReducedMotion()
  let observer: IntersectionObserver | null = null

  onMounted(async () => {
    await nextTick()

    const targets = scope.value?.querySelectorAll<HTMLElement>(options.selector ?? '.reveal-target') ?? []
    if (reducedMotion.value || !('IntersectionObserver' in window)) {
      targets.forEach(target => target.classList.add('is-visible'))
      return
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        entry.target.classList.add('is-visible')
        observer?.unobserve(entry.target)
      })
    }, {
      threshold: options.threshold ?? 0.35,
      rootMargin: options.rootMargin ?? '0px',
    })

    targets.forEach(target => observer?.observe(target))
  })

  onBeforeUnmount(() => observer?.disconnect())
}
