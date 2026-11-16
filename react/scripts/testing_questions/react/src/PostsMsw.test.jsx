import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import Posts from './Posts'

const server = setupServer(
  http.get('https://jsonplaceholder.typicode.com/posts', () =>
    HttpResponse.json([{ id: 1, title: 'From MSW' }]),
  ),
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('shows posts returned by the mock server', async () => {
  render(<Posts />)
  expect(await screen.findByText('From MSW')).toBeInTheDocument()
})
