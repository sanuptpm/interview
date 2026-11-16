import { FormControl } from '@angular/forms'
import { salaryValidator } from './salary.validator'

describe('salaryValidator', () => {
  it('accepts a valid salary', () => {
    expect(salaryValidator(new FormControl(45000))).toBeNull()
  })

  it('rejects zero and too large values', () => {
    expect(salaryValidator(new FormControl(0))).toEqual({ salary: 'Salary must be between 1 and 500000' })
    expect(new FormControl(900000, salaryValidator).valid).toBe(false)
  })
})
