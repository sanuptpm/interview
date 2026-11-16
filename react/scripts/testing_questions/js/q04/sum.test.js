// Jest: no import needed, describe/it/expect/jest.fn are globals
// Vitest: import them (or set globals: true in the config)
import { describe, it, expect, vi } from 'vitest'

const sum = (a, b) => a + b

describe('sum', () => {
  it('adds numbers', () => {
    const add = vi.fn(sum)          // jest.fn(sum) in Jest
    expect(add(1, 2)).toBe(3)
    expect(add).toHaveBeenCalledTimes(1)
  })
})
