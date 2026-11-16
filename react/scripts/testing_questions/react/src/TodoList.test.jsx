import { render, screen } from '@testing-library/react'
import TodoList from './TodoList'

test('getBy, queryBy, findBy and getAllBy', async () => {
  render(<TodoList />)
  expect(screen.getByRole('list')).toBeInTheDocument()       // must exist now
  expect(screen.queryByText('Learn RTL')).not.toBeInTheDocument() // may be absent
  expect(await screen.findByText('Learn RTL')).toBeInTheDocument() // waits (up to 1s)
  expect(screen.getAllByRole('listitem')).toHaveLength(2)    // many matches
})
