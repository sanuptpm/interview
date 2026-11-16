import { configureStore } from '@reduxjs/toolkit'

// Reducer: (state, action) => new state
function counterReducer(state = { count: 0 }, action) {
  if (action.type === 'counter/increment') {
    console.log('2. reducer runs:', action.type)
    return { count: state.count + 1 }
  }
  return state
}

const store = configureStore({ reducer: counterReducer })
store.subscribe(() => console.log('3. store updated, UI re-renders:', store.getState()))

console.log('1. UI dispatches an action')
store.dispatch({ type: 'counter/increment' })
