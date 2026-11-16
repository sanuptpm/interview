import { render, screen } from '@testing-library/react'
import Posts from './Posts'

test('shows posts from the API', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    json: async () => [{ id: 1, title: 'Hello world' }],
  })
  render(<Posts />)
  expect(screen.getByText('Loading...')).toBeInTheDocument()
  expect(await screen.findByText('Hello world')).toBeInTheDocument()
  expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
})
