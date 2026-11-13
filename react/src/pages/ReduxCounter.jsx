import { Provider, useSelector } from 'react-redux'
import { store } from './reduxCounter/store'
import Counter from './reduxCounter/Counter'

// Shows the data inside the Redux store, so you can watch it change.
function StoreState() {
  const counter = useSelector((state) => state.counter)
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-slate-500">Store state (state.counter)</h3>
      <pre className="mt-1 rounded-lg bg-slate-900 p-3 font-mono text-sm text-emerald-300">
        {JSON.stringify(counter, null, 2)}
      </pre>
    </div>
  )
}

// Step 4: Provider makes the store available to every component inside it.
function ReduxCounter() {
  return (
    <Provider store={store}>
      <div className="p-6 [&_button]:mr-2 [&_button]:mb-2 [&_button]:rounded-lg [&_button]:bg-indigo-600 [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-white [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold">
        <Counter />
        <StoreState />
      </div>
    </Provider>
  )
}

export default ReduxCounter
