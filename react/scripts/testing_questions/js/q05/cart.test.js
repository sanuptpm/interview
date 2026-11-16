import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest'

let prices
let cart

beforeAll(() => { prices = { apple: 2, mango: 5 } })  // once, before all tests
beforeEach(() => { cart = [] })                       // fresh cart before each test
afterEach(() => { cart = null })                      // clean up after each test

describe('cart', () => {
  it('adds an item', () => {
    cart.push('apple')
    expect(cart).toEqual(['apple'])
  })

  it('starts empty again', () => {
    expect(cart).toHaveLength(0)
    expect(prices.mango).toBe(5)
  })
})
