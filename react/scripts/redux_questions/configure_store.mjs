import { configureStore, createSlice } from '@reduxjs/toolkit'

const counter = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: { increment: (state) => { state.count += 1 } },
})

// One call: combines reducers, adds thunk + dev checks, enables DevTools
const store = configureStore({ reducer: { counter: counter.reducer } })

store.dispatch(counter.actions.increment())
console.log(store.getState())
