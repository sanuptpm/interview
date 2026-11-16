import { it, expect } from 'vitest'
import { first } from './first'
import type { Post } from './api'   // interface Post { id: number; title: string }

const posts = [
  { id: 1, title: 'Hello' },
  { id: 2, titel: 'World' },   // typo
] satisfies Post[]

it('returns the first item', () => {
  expect(first(posts)?.id).toBe(1)
  expect(first([])).toBeUndefined()
})
