import { AbstractControl, ValidationErrors } from '@angular/forms'

export function salaryValidator(control: AbstractControl): ValidationErrors | null {
  const value = Number(control.value)
  return value > 0 && value <= 500000 ? null : { salary: 'Salary must be between 1 and 500000' }
}
