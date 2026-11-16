import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

test('increments and resets the count', () => {
  const { result } = renderHook(() => useCounter(5))
  expect(result.current.count).toBe(5)
  act(() => result.current.increment())
  expect(result.current.count).toBe(6)
  act(() => result.current.reset())
  expect(result.current.count).toBe(5)
})
