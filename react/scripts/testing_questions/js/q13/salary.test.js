import { describe, it, expect } from 'vitest'
import { calculateNetSalary } from './salary.js'

describe('calculateNetSalary', () => {
  it('deducts tax from the gross salary', () => {
    expect(calculateNetSalary(50000, 0.2)).toBe(40000)
  })
  it('returns the full amount when there is no tax', () => {
    expect(calculateNetSalary(30000, 0)).toBe(30000)
  })
  it('throws for a negative salary', () => {
    expect(() => calculateNetSalary(-100, 0.2)).toThrow('cannot be negative')
  })
})
