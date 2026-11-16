import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'

test('types an email and submits the form', async () => {
  const user = userEvent.setup()
  render(<LoginForm />)
  await user.type(screen.getByLabelText('Email'), 'asha@test.com')
  await user.click(screen.getByRole('button', { name: 'Log in' }))
  expect(screen.getByText('Welcome asha@test.com')).toBeInTheDocument()
})
