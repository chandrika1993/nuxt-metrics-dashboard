export interface Debounced<Args extends unknown[]> {
  (...args: Args): void
  cancel: () => void
}

/** Runs `fn` once input has been quiet for `waitMs`. Only the last call wins. */
export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, waitMs: number): Debounced<Args> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const debounced = (...args: Args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = undefined
      fn(...args)
    }, waitMs)
  }
  debounced.cancel = () => {
    if (timer) clearTimeout(timer)
    timer = undefined
  }
  return debounced
}
