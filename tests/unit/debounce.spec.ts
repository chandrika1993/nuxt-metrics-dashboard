import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce } from '../../app/utils/debounce'

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('calls the function once with the last arguments after the wait', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced('p')
    debounced('pa')
    debounced('pay')
    vi.advanceTimersByTime(299)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('pay')
  })

  it('can be cancelled', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)
    debounced('x')
    debounced.cancel()
    vi.advanceTimersByTime(1000)
    expect(fn).not.toHaveBeenCalled()
  })
})
