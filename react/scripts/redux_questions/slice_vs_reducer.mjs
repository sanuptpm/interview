import { createSlice, createReducer, createAction } from '@reduxjs/toolkit'

// createSlice: reducers + action creators in one place
const counter = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: { add: (state, action) => state + action.payload },
})
console.log(counter.actions.add(5))                  // action is generated
console.log(counter.reducer(0, counter.actions.add(5)))

// createReducer: only the reducer, actions are created separately
const add = createAction('counter/add')
const reducer = createReducer(0, (builder) => builder.addCase(add, (state, action) => state + action.payload))
console.log(reducer(0, add(5)))
