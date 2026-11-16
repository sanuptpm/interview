// SalaryForm.test.jsx
import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SalaryForm from './SalaryForm'

test('shows an error for a negative salary', async () => {
  const user = userEvent.setup()
  render(<SalaryForm />)
  await user.type(screen.getByLabelText('Salary'), '-500')
  await user.click(screen.getByRole('button', { name: 'Save' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Salary must be greater than 0')
})
