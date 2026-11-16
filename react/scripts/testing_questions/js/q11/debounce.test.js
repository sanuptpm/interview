import { test, expect, vi, beforeEach, afterEach } from 'vitest'

function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

test('runs only once after the user stops typing', () => {
  const search = vi.fn()
  const debounced = debounce(search, 300)
  debounced('r'); debounced('re'); debounced('rea')

  vi.advanceTimersByTime(299)
  expect(search).not.toHaveBeenCalled()
  vi.advanceTimersByTime(1)
  expect(search).toHaveBeenCalledTimes(1)
  expect(search).toHaveBeenCalledWith('rea')
})
