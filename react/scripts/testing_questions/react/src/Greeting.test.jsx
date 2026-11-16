import { render, screen } from '@testing-library/react'
import Greeting from './Greeting'

test('greets the user by name', () => {
  render(<Greeting name="Asha" />)
  expect(screen.getByRole('heading')).toHaveTextContent('Hello, Asha!')
})
