import { test, expect } from 'vitest'

test('common matchers', () => {
  expect(2 + 2).toBe(4)                            // same value (Object.is)
  expect({ a: 1 }).not.toBe({ a: 1 })              // different objects
  expect({ a: 1 }).toEqual({ a: 1, b: undefined }) // deep, ignores undefined
  expect({ a: 1 }).not.toStrictEqual({ a: 1, b: undefined })
  expect(['apple', 'mango']).toContain('mango')
  expect('hello').toBeTruthy()
  expect(() => JSON.parse('{bad')).toThrow()
})
