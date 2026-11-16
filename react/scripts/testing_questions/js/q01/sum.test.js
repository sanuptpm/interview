import { test, expect } from 'vitest'
import { sum } from './sum.js'

// A unit test checks one small piece of code on its own
test('adds two numbers', () => {
  expect(sum(2, 3)).toBe(5)
})

test('works with negative numbers', () => {
  expect(sum(-2, -3)).toBe(-5)
})
