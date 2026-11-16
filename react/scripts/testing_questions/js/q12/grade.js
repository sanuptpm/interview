export function grade(score) {
  if (score < 0 || score > 100) throw new Error('Invalid score')
  if (score >= 90) return 'A'
  if (score >= 50) return 'Pass'
  return 'Fail'
}
