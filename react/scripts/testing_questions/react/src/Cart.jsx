import { useDispatch, useSelector } from 'react-redux'
import { addItem } from './cartSlice'

export default function Cart() {
  const items = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()
  return (
    <div>
      <p>Items: {items.length}</p>
      <button onClick={() => dispatch(addItem('Book'))}>Add book</button>
    </div>
  )
}
