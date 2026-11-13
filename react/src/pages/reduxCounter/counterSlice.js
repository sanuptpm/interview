import { createSlice } from '@reduxjs/toolkit'

// Step 1: the slice holds the initial state and the reducers.
// createSlice also generates one action creator per reducer.
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1 // Immer lets us "mutate" safely
    },
    decrement: (state) => {
      state.count -= 1
    },
    reset: (state) => {
      state.count = 0
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload // e.g. 5
    },
  },
})

export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer
