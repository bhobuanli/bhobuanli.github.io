export const usePageTransition = (direction: Readonly<Ref<1 | -1>>) => {
  const reducedMotion = useReducedMotion()

  return computed(() => reducedMotion.value
    ? false
    : { name: direction.value > 0 ? 'page-forward' : 'page-back' })
}
