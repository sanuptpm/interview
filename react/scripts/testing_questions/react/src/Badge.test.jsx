import { render } from '@testing-library/react'
import Badge from './Badge'

test('matches the snapshot', () => {
  const { container } = render(<Badge status="active" />)
  expect(container.firstChild).toMatchSnapshot()
})
