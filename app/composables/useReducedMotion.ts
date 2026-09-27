const reducedMotionState = ref(false)
let mediaQuery: MediaQueryList | null = null
let subscribers = 0

const updateReducedMotion = () => {
  reducedMotionState.value = mediaQuery?.matches ?? false
}

export const useReducedMotion = () => {
  onMounted(() => {
    subscribers += 1
    if (subscribers !== 1) return

    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    updateReducedMotion()
    mediaQuery.addEventListener?.('change', updateReducedMotion)
  })

  onBeforeUnmount(() => {
    subscribers = Math.max(0, subscribers - 1)
    if (subscribers !== 0) return

    mediaQuery?.removeEventListener?.('change', updateReducedMotion)
    mediaQuery = null
  })

  return reducedMotionState
}
