import { test, expect } from 'vitest'
import { grade } from './grade.js'

test('grades a score', () => {
  expect(grade(95)).toBe('A')
  expect(grade(60)).toBe('Pass')
})
// No test for 'Fail' or for an invalid score yet
