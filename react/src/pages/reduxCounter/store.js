import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'

// Step 2: the store. The key "counter" is why components read state.counter.count
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})
