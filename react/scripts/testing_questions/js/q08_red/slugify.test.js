import { test, expect } from 'vitest'
import { slugify } from './slugify.js'

test('turns a title into a slug', () => {
  expect(slugify('  Hello World  ')).toBe('hello-world')
})
