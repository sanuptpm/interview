import { test, expect, vi, afterEach } from 'vitest'
import { getPostTitle } from './posts.js'

afterEach(() => vi.unstubAllGlobals())

test('returns the post title', async () => {
  const fakeFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ id: 1, title: 'Hello' }),
  })
  vi.stubGlobal('fetch', fakeFetch)

  expect(await getPostTitle(1)).toBe('Hello')
  expect(fakeFetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1')
})

test('throws when the post is missing', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
  await expect(getPostTitle(999)).rejects.toThrow('Post not found')
})
