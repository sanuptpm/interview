import { configureStore, createSlice } from '@reduxjs/toolkit'

const counter = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: { increment: (n) => n + 1 },
})

// Middleware sits between dispatch and the reducer
const logger = (store) => (next) => (action) => {
  console.log('before:', store.getState(), 'action:', action.type)
  const result = next(action) // pass the action on to the reducer
  console.log('after: ', store.getState())
  return result
}

const store = configureStore({
  reducer: counter.reducer,
  middleware: (getDefault) => getDefault().concat(logger),
})
store.dispatch(counter.actions.increment())
