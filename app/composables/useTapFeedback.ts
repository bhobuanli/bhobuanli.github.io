export const useTapFeedback = (duration = 420, className = 'is-tapped') => {
  const timers = new Map<HTMLElement, number>()

  const trigger = (event: Event) => {
    const element = event.currentTarget as HTMLElement | null
    if (!element) return

    const previousTimer = timers.get(element)
    if (previousTimer) window.clearTimeout(previousTimer)

    element.classList.remove(className)
    // Restart the feedback when the same control is tapped repeatedly.
    void element.offsetWidth
    element.classList.add(className)

    const timer = window.setTimeout(() => {
      element.classList.remove(className)
      timers.delete(element)
    }, duration)
    timers.set(element, timer)
  }

  onBeforeUnmount(() => {
    timers.forEach((timer, element) => {
      window.clearTimeout(timer)
      element.classList.remove(className)
    })
    timers.clear()
  })

  return trigger
}
