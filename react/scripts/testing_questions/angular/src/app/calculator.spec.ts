import { CalculatorService } from './calculator'

describe('CalculatorService', () => {
  it('adds two numbers', () => {
    const calc = new CalculatorService()
    expect(calc.add(2, 3)).toBe(5)
  })
})
