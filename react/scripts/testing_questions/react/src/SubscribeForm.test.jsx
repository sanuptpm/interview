import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { track } from './analytics'
import SubscribeForm from './SubscribeForm'

vi.mock('./analytics') // every export becomes a vi.fn()

test('calls onSubmit and tracks the event', async () => {
  const onSubmit = vi.fn()
  render(<SubscribeForm onSubmit={onSubmit} />)
  await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
  expect(onSubmit).toHaveBeenCalledWith({ plan: 'pro' })
  expect(onSubmit).toHaveBeenCalledTimes(1)
  expect(track).toHaveBeenCalledWith('subscribe')
})
