import { it, expect } from 'vitest'
import { applyDiscount } from './discount'

it('takes 10% off', () => {
  expect(applyDiscount(100, 0.1)).toBe(90)
})
