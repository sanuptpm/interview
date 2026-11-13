import { useSelector, useDispatch } from 'react-redux'

import { increment, decrement, reset, incrementByAmount } from './counterSlice'

// Step 3: the component reads state with useSelector and sends actions with useDispatch.
function Counter() {
  // Read state from Redux store
  const count = useSelector((state) => state.counter.count)

  // Dispatch actions
  const dispatch = useDispatch()

  return (
    <div>
      <h2>Count: {count}</h2>

      <button onClick={() => dispatch(increment())}>Increment</button>

      <button onClick={() => dispatch(decrement())}>Decrement</button>

      <button onClick={() => dispatch(reset())}>Reset</button>

      <button onClick={() => dispatch(incrementByAmount(5))}>Increment By 5</button>
    </div>
  )
}

export default Counter
