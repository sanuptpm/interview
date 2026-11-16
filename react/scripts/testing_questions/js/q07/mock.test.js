import { test, expect, vi } from 'vitest'

function checkout(total, pay) {
  return pay(total) ? 'paid' : 'failed'
}

test('calls the payment function with the total', () => {
  const pay = vi.fn().mockReturnValue(true)   // fake function
  expect(checkout(100, pay)).toBe('paid')
  expect(pay).toHaveBeenCalledTimes(1)
  expect(pay).toHaveBeenCalledWith(100)
})

test('handles a failed payment', () => {
  const pay = vi.fn(() => false)
  expect(checkout(50, pay)).toBe('failed')
})
