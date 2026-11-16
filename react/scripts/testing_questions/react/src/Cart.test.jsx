import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import cartReducer from './cartSlice'
import Cart from './Cart'

function renderWithStore(ui, preloadedState) {
  const store = configureStore({ reducer: { cart: cartReducer }, preloadedState })
  render(<Provider store={store}>{ui}</Provider>)
  return store
}

test('adds an item to the real store', async () => {
  const store = renderWithStore(<Cart />, { cart: { items: ['Pen'] } })
  expect(screen.getByText('Items: 1')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Add book' }))
  expect(screen.getByText('Items: 2')).toBeInTheDocument()
  expect(store.getState().cart.items).toEqual(['Pen', 'Book'])
})
