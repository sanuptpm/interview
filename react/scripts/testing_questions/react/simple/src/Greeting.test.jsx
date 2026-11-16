import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Greeting from './Greeting'

test('shows the name', () => {
  render(<Greeting name="Asha" />)
  expect(screen.getByText('Hello, Asha')).toBeInTheDocument()
})
