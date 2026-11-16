import { it, expect, vi } from 'vitest'
import { fetchPosts } from './api'
import { getTitles } from './titles'

vi.mock('./api')   // auto-mock the module, no real network call

it('returns post titles', async () => {
  vi.mocked(fetchPosts).mockResolvedValue([{ id: 1, title: 'Hello' }])
  expect(await getTitles()).toEqual(['Hello'])
  expect(fetchPosts).toHaveBeenCalledOnce()
})

it('types a standalone mock', () => {
  const onSave = vi.fn<(id: number) => boolean>().mockReturnValue(true)
  expect(onSave(1)).toBe(true)
})
