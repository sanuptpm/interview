export function calculateNetSalary(gross, taxRate) {
  if (gross < 0) throw new Error('Gross salary cannot be negative')
  return Math.round(gross * (1 - taxRate))
}
