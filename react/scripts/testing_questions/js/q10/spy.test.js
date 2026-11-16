import { test, expect, vi, afterEach } from 'vitest'

const math = {
  random: () => Math.random(),
  rollDice() { return Math.floor(this.random() * 6) + 1 },
}

afterEach(() => vi.restoreAllMocks())   // put the real functions back

test('spy controls the random number', () => {
  const spy = vi.spyOn(math, 'random').mockReturnValue(0.99)
  expect(math.rollDice()).toBe(6)
  expect(spy).toHaveBeenCalledOnce()
})

test('real function is back after restore', () => {
  expect(vi.isMockFunction(math.random)).toBe(false)
})
