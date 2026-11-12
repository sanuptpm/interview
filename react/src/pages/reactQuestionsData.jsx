// React interview questions used on the React page.
// Each item: { q, a, code, output }. `output` is either a live demo
// component (defined below, same logic as `code`) or a plain string.
// This data file intentionally keeps the small demo components next to the
// questions they illustrate, so the fast-refresh export rule is turned off here.
/* oxlint-disable react/only-export-components */

import {
  Component,
  createContext,
  memo,
  startTransition,
  Suspense,
  use,
  useActionState,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

const btn = 'rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500'
const btnLight = 'rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100'
const inputCls = 'rounded-lg border border-slate-300 px-3 py-1.5'

// Shows how many times a component has rendered (updated after each commit),
// used instead of console.log so the effect is visible on screen.
function useRenderBadge() {
  const count = useRef(0)
  const badge = useRef(null)
  useEffect(() => {
    count.current += 1
    if (badge.current) badge.current.textContent = String(count.current)
  })
  return badge
}

function RenderBadge({ badgeRef, label }) {
  return (
    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
      {label} renders: <span ref={badgeRef}>0</span>
    </span>
  )
}

/* ---------------------------- Basics ---------------------------- */

function HelloDemo() {
  return <h1 className="text-xl font-bold">Hello, React!</h1>
}

function JsxDemo() {
  const name = 'Sanu'
  const items = 3
  return (
    <div>
      <h2 className="text-lg font-semibold">Hi {name.toUpperCase()}</h2>
      <p>You have {items * 2} new messages</p>
    </div>
  )
}

function WelcomeFn({ name }) {
  return <p>Hello {name} (function)</p>
}

class WelcomeClass extends Component {
  render() {
    return <p>Hello {this.props.name} (class)</p>
  }
}

function FnVsClassDemo() {
  return (
    <div>
      <WelcomeFn name="Anu" />
      <WelcomeClass name="Ravi" />
    </div>
  )
}

function Greeting({ name, age }) {
  return (
    <p>
      {name} is {age} years old
    </p>
  )
}

function PropsDemo() {
  return (
    <div>
      <Greeting name="Anu" age={22} />
      <Greeting name="Ravi" age={30} />
    </div>
  )
}

function CounterDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="flex items-center gap-3">
      <button className={btn} onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
    </div>
  )
}

function Display({ value }) {
  return <p className="text-lg">Count: {value}</p>
}

function PropsVsStateDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-2">
      <Display value={count} />
      <button className={btn} onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  )
}

function ListKeysDemo() {
  const [fruits, setFruits] = useState([
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Mango' },
  ])
  const addFirst = () => {
    const id = Date.now()
    setFruits([{ id, name: 'Banana ' + (fruits.length + 1) }, ...fruits])
  }
  return (
    <div className="space-y-2">
      <button className={btn} onClick={addFirst}>
        Add to top
      </button>
      <ul className="list-disc pl-5">
        {fruits.map((fruit) => (
          <li key={fruit.id}>{fruit.name}</li>
        ))}
      </ul>
    </div>
  )
}

function ConditionalDemo() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [count] = useState(2)
  return (
    <div className="space-y-2">
      {loggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}
      {loggedIn && count > 0 && <p>You have {count} notifications</p>}
      <button className={btn} onClick={() => setLoggedIn(!loggedIn)}>
        {loggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  )
}

function EventsDemo() {
  const [message, setMessage] = useState('')
  const handleClick = () => setMessage('Button clicked!')
  const handleChange = (e) => setMessage('Typed: ' + e.target.value)
  return (
    <div className="space-y-2">
      <button className={btn} onClick={handleClick}>
        Click me
      </button>
      <div>
        <input className={inputCls} onChange={handleChange} placeholder="Type here" />
      </div>
      <p>{message}</p>
    </div>
  )
}

function ControlledDemo() {
  const [name, setName] = useState('')
  const inputRef = useRef(null)
  const [uncontrolled, setUncontrolled] = useState('')
  return (
    <div className="space-y-3">
      <div>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Controlled" />
        <p>Controlled value: {name}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input className={inputCls} ref={inputRef} defaultValue="hello" />
        <button className={btn} onClick={() => setUncontrolled(inputRef.current.value)}>
          Read
        </button>
      </div>
      <p>Uncontrolled value: {uncontrolled}</p>
    </div>
  )
}

function FormDemo() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(email)
    setEmail('')
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button className={btn} type="submit">
          Subscribe
        </button>
      </div>
      {submitted && <p>Subscribed: {submitted}</p>}
    </form>
  )
}

function CountButton({ onAdd }) {
  return (
    <button className={btn} onClick={onAdd}>
      Add
    </button>
  )
}

function CountLabel({ count }) {
  return <p>Total: {count}</p>
}

function LiftingStateDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-2">
      <CountButton onAdd={() => setCount(count + 1)} />
      <CountLabel count={count} />
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="rounded-lg border border-slate-300 p-3">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  )
}

function ChildrenDemo() {
  return (
    <Card title="Profile">
      <p>Name: Anu</p>
      <p>Role: Developer</p>
    </Card>
  )
}

function FragmentInfo() {
  return (
    <>
      <dt className="font-semibold">React</dt>
      <dd className="mb-2 pl-4">A UI library</dd>
    </>
  )
}

function FragmentDemo() {
  return (
    <dl>
      <FragmentInfo />
      <FragmentInfo />
    </dl>
  )
}

/* ---------------------------- Hooks ---------------------------- */

function FunctionalUpdateDemo() {
  const [count, setCount] = useState(0)
  const addThreeWrong = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }
  const addThreeRight = () => {
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setCount((c) => c + 1)
  }
  return (
    <div className="space-y-2">
      <p className="text-lg">Count: {count}</p>
      <div className="flex flex-wrap gap-2">
        <button className={btnLight} onClick={addThreeWrong}>
          +3 (wrong)
        </button>
        <button className={btn} onClick={addThreeRight}>
          +3 (functional)
        </button>
        <button className={btnLight} onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
    </div>
  )
}

function Timer() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return <p className="text-lg">Seconds: {seconds}</p>
}

function EffectDemo() {
  const [show, setShow] = useState(true)
  return (
    <div className="space-y-2">
      <button className={btn} onClick={() => setShow(!show)}>
        {show ? 'Unmount timer' : 'Mount timer'}
      </button>
      {show && <Timer />}
    </div>
  )
}

function RefDemo() {
  const inputRef = useRef(null)
  const clicks = useRef(0)
  const [shown, setShown] = useState(0)
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <input className={inputCls} ref={inputRef} placeholder="Focus me" />
        <button className={btn} onClick={() => inputRef.current.focus()}>
          Focus
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={btnLight} onClick={() => (clicks.current += 1)}>
          Click (ref only)
        </button>
        <button className={btn} onClick={() => setShown(clicks.current)}>
          Show clicks
        </button>
      </div>
      <p>Clicks shown: {shown}</p>
    </div>
  )
}

function countPrimes(limit) {
  let total = 0
  for (let n = 2; n <= limit; n++) {
    let isPrime = true
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        isPrime = false
        break
      }
    }
    if (isPrime) total++
  }
  return total
}

function MemoDemo() {
  const [limit, setLimit] = useState(10000)
  const [dark, setDark] = useState(false)
  const primes = useMemo(() => countPrimes(limit), [limit])
  return (
    <div className={'space-y-2 rounded-lg p-3 ' + (dark ? 'bg-slate-800 text-white' : 'bg-slate-50')}>
      <input className={inputCls + ' text-slate-900'} type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
      <p>Primes up to {limit}: {primes}</p>
      <button className={btn} onClick={() => setDark(!dark)}>
        Toggle theme (no recalculation)
      </button>
    </div>
  )
}

const CallbackChild = memo(function CallbackChild({ onClick }) {
  const badge = useRenderBadge()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={btn} onClick={onClick}>
        Child button
      </button>
      <RenderBadge badgeRef={badge} label="Child" />
    </div>
  )
})

function CallbackDemo() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const handleClick = useCallback(() => {
    setCount((c) => c + 1)
  }, [])
  return (
    <div className="space-y-2">
      <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type (child won't re-render)" />
      <p>Count: {count}</p>
      <CallbackChild onClick={handleClick} />
    </div>
  )
}

const ThemeContext = createContext('light')

function ThemedButton() {
  const theme = useContext(ThemeContext)
  const dark = theme === 'dark'
  return (
    <button className={'rounded-lg px-3 py-1.5 ' + (dark ? 'bg-slate-800 text-white' : 'border border-slate-300 bg-white')}>
      I am {theme}
    </button>
  )
}

function Toolbar() {
  return <ThemedButton />
}

function ContextDemo() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={theme}>
      <div className="space-y-2">
        <Toolbar />
        <div>
          <button className={btn} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Switch theme
          </button>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return { count: 0 }
    default:
      return state
  }
}

function ReducerDemo() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 })
  return (
    <div className="space-y-2">
      <p className="text-lg">Count: {state.count}</p>
      <div className="flex gap-2">
        <button className={btn} onClick={() => dispatch({ type: 'decrement' })}>
          -
        </button>
        <button className={btn} onClick={() => dispatch({ type: 'increment' })}>
          +
        </button>
        <button className={btnLight} onClick={() => dispatch({ type: 'reset' })}>
          Reset
        </button>
      </div>
    </div>
  )
}

function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn((v) => !v), [])
  return [on, toggle]
}

function CustomHookDemo() {
  const [isOpen, toggleOpen] = useToggle()
  const [isDark, toggleDark] = useToggle(true)
  return (
    <div className="space-y-2">
      <button className={btn} onClick={toggleOpen}>
        Menu: {isOpen ? 'Open' : 'Closed'}
      </button>
      <div>
        <button className={btnLight} onClick={toggleDark}>
          Dark mode: {isDark ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  )
}

/* ---------------------------- Advanced ---------------------------- */

function RerenderChild() {
  const badge = useRenderBadge()
  return (
    <p>
      Child <RenderBadge badgeRef={badge} label="Child" />
    </p>
  )
}

function RerenderDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-2">
      <button className={btn} onClick={() => setCount(count + 1)}>
        Parent count: {count}
      </button>
      <RerenderChild />
    </div>
  )
}

const MemoUser = memo(function MemoUser({ name }) {
  const badge = useRenderBadge()
  return (
    <p>
      User: {name} <RenderBadge badgeRef={badge} label="MemoUser" />
    </p>
  )
})

function PlainUser({ name }) {
  const badge = useRenderBadge()
  return (
    <p>
      User: {name} <RenderBadge badgeRef={badge} label="PlainUser" />
    </p>
  )
}

function ReactMemoDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-2">
      <button className={btn} onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <MemoUser name="Anu" />
      <PlainUser name="Anu" />
    </div>
  )
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error, info) {
    console.log('Logged error:', error.message, info.componentStack ? '(with stack)' : '')
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="space-y-2">
          <p className="text-red-600">Something went wrong.</p>
          <button className={btnLight} onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function BuggyCounter() {
  const [count, setCount] = useState(0)
  if (count === 3) {
    throw new Error('Crashed at 3!')
  }
  return (
    <button className={btn} onClick={() => setCount(count + 1)}>
      Count: {count} (crashes at 3)
    </button>
  )
}

function ErrorBoundaryDemo() {
  return (
    <ErrorBoundary>
      <BuggyCounter />
    </ErrorBoundary>
  )
}

function Modal({ onClose }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="rounded-xl bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <p className="mb-3">I am rendered inside document.body</p>
        <button className={btn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body,
  )
}

function PortalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden">
      <button className={btn} onClick={() => setOpen(true)}>
        Open modal
      </button>
      {open && <Modal onClose={() => setOpen(false)} />}
    </div>
  )
}

function ImmutabilityDemo() {
  const [todos, setTodos] = useState(['Learn React'])
  const [user, setUser] = useState({ name: 'Anu', age: 22 })
  const addTodo = () => setTodos([...todos, 'Task ' + (todos.length + 1)])
  const removeFirst = () => setTodos(todos.filter((_, i) => i !== 0))
  const birthday = () => setUser({ ...user, age: user.age + 1 })
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button className={btn} onClick={addTodo}>
          Add todo
        </button>
        <button className={btnLight} onClick={removeFirst}>
          Remove first
        </button>
        <button className={btn} onClick={birthday}>
          Birthday
        </button>
      </div>
      <p>Todos: {todos.join(', ') || '(none)'}</p>
      <p>
        {user.name} is {user.age}
      </p>
    </div>
  )
}

function BatchingDemo() {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)
  const badge = useRenderBadge()
  const handleClick = () => {
    setCount((c) => c + 1)
    setFlag((f) => !f)
  }
  const handleLater = () => {
    setTimeout(() => {
      setCount((c) => c + 1)
      setFlag((f) => !f)
    }, 300)
  }
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button className={btn} onClick={handleClick}>
          Update both
        </button>
        <button className={btnLight} onClick={handleLater}>
          Update both in timeout
        </button>
      </div>
      <p>
        count: {count}, flag: {String(flag)}
      </p>
      <RenderBadge badgeRef={badge} label="Component" />
      <p className="text-xs text-slate-500">Each click adds only one render.</p>
    </div>
  )
}

function NameInput({ label }) {
  const [text, setText] = useState('')
  return (
    <div>
      <p className="mb-1">{label}</p>
      <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type something" />
    </div>
  )
}

function KeyResetDemo() {
  const [user, setUser] = useState('Anu')
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button className={user === 'Anu' ? btn : btnLight} onClick={() => setUser('Anu')}>
          Anu
        </button>
        <button className={user === 'Ravi' ? btn : btnLight} onClick={() => setUser('Ravi')}>
          Ravi
        </button>
      </div>
      <NameInput key={user} label={'Note for ' + user} />
      <p className="text-xs text-slate-500">Switching user resets the input because the key changes.</p>
    </div>
  )
}

// HOC version
function withCounter(WrappedComponent) {
  return function WithCounter(props) {
    const [count, setCount] = useState(0)
    return <WrappedComponent {...props} count={count} increment={() => setCount(count + 1)} />
  }
}

function ClickButton({ count, increment }) {
  return (
    <button className={btnLight} onClick={increment}>
      HOC clicks: {count}
    </button>
  )
}

const ClickButtonWithCounter = withCounter(ClickButton)

// Custom hook version
function useCounter() {
  const [count, setCount] = useState(0)
  return { count, increment: () => setCount(count + 1) }
}

function HookButton() {
  const { count, increment } = useCounter()
  return (
    <button className={btn} onClick={increment}>
      Hook clicks: {count}
    </button>
  )
}

function HocVsHookDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <ClickButtonWithCounter />
      <HookButton />
    </div>
  )
}

const fakeUsers = { 1: 'Anu', 2: 'Ravi', 3: 'Meera' }

function fakeFetchUser(id) {
  let timer
  const promise = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      if (fakeUsers[id]) resolve({ id, name: fakeUsers[id] })
      else reject(new Error('User ' + id + ' not found'))
    }, 800)
  })
  return { promise, cancel: () => clearTimeout(timer) }
}

function FetchDemo() {
  const [userId, setUserId] = useState(1)
  const [result, setResult] = useState({ id: null, data: null, error: null })

  useEffect(() => {
    let ignore = false
    const request = fakeFetchUser(userId)
    request.promise
      .then((data) => {
        if (!ignore) setResult({ id: userId, data, error: null })
      })
      .catch((err) => {
        if (!ignore) setResult({ id: userId, data: null, error: err.message })
      })
    return () => {
      ignore = true
      request.cancel()
    }
  }, [userId])

  const loading = result.id !== userId

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((id) => (
          <button key={id} className={id === userId ? btn : btnLight} onClick={() => setUserId(id)}>
            User {id}
          </button>
        ))}
      </div>
      {loading && <p className="text-slate-500">Loading...</p>}
      {!loading && result.error && <p className="text-red-600">Error: {result.error}</p>}
      {!loading && result.data && <p>Name: {result.data.name}</p>}
    </div>
  )
}

const allFruits = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Papaya']

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

function DebounceDemo() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const results = allFruits.filter((f) => f.toLowerCase().includes(debouncedQuery.toLowerCase()))
  return (
    <div className="space-y-2">
      <input className={inputCls} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fruits" />
      <p className="text-xs text-slate-500">Searching for: "{debouncedQuery}"</p>
      <ul className="list-disc pl-5">
        {results.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------- More basics demos ------------------------- */

function TodoDemo() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn hooks', done: true },
    { id: 2, text: 'Build a todo app', done: false },
  ])
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const addTodo = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setTodos([...todos, { id: Date.now(), text: text.trim(), done: false }])
    setText('')
  }
  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id))
  const toggleTodo = (id) => setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }
  const saveEdit = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: editText } : t)))
    setEditingId(null)
  }

  return (
    <div className="space-y-3">
      <form onSubmit={addTodo} className="flex flex-wrap gap-2">
        <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} placeholder="New todo" />
        <button className={btn} type="submit">
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex flex-wrap items-center gap-2">
            <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
            {editingId === todo.id ? (
              <>
                <input className={inputCls} value={editText} onChange={(e) => setEditText(e.target.value)} />
                <button className={btn} onClick={() => saveEdit(todo.id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span className={todo.done ? 'text-slate-400 line-through' : ''}>{todo.text}</span>
                <button className={btnLight} onClick={() => startEdit(todo)}>
                  Edit
                </button>
              </>
            )}
            <button className={btnLight} onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-500">
        {todos.filter((t) => !t.done).length} of {todos.length} left
      </p>
    </div>
  )
}

function NestedStateDemo() {
  const [user, setUser] = useState({
    name: 'Anu',
    address: { city: 'Kochi', pin: '682001' },
  })
  const updateCity = (e) => {
    setUser({ ...user, address: { ...user.address, city: e.target.value } })
  }
  return (
    <div className="space-y-2">
      <input className={inputCls} value={user.address.city} onChange={updateCity} placeholder="City" />
      <pre className="rounded bg-slate-50 p-2 text-xs">{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}

function MultiInputDemo() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2">
        <input className={inputCls} name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" />
        <input className={inputCls} name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" />
        <input className={inputCls} name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      </div>
      <pre className="rounded bg-slate-50 p-2 text-xs">{JSON.stringify(form, null, 2)}</pre>
    </div>
  )
}

function validateSignup(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Name is required'
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email'
  if (values.password.length < 6) errors.password = 'Password must be at least 6 characters'
  return errors
}

function ValidationDemo() {
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setSuccess(false)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validateSignup(values)
    setErrors(found)
    setSuccess(Object.keys(found).length === 0)
  }
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-2">
      <div>
        <input className={inputCls} name="name" value={values.name} onChange={handleChange} placeholder="Name" />
        {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
      </div>
      <div>
        <input className={inputCls} name="email" value={values.email} onChange={handleChange} placeholder="Email" />
        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
      </div>
      <div>
        <input className={inputCls} name="password" type="password" value={values.password} onChange={handleChange} placeholder="Password" />
        {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
      </div>
      <button className={btn} type="submit">
        Sign up
      </button>
      {success && <p className="text-emerald-700">Signed up successfully!</p>}
    </form>
  )
}

function ControlledOptionsDemo() {
  const [country, setCountry] = useState('india')
  const [plan, setPlan] = useState('free')
  const [agree, setAgree] = useState(false)
  return (
    <div className="space-y-3">
      <select className={inputCls} value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="india">India</option>
        <option value="usa">USA</option>
        <option value="uk">UK</option>
      </select>
      <div className="flex gap-4">
        {['free', 'pro'].map((p) => (
          <label key={p} className="flex items-center gap-1">
            <input type="radio" name="plan" value={p} checked={plan === p} onChange={(e) => setPlan(e.target.value)} />
            {p}
          </label>
        ))}
      </div>
      <label className="flex items-center gap-1">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />I agree to the terms
      </label>
      <p>
        Country: {country}, Plan: {plan}, Agreed: {String(agree)}
      </p>
    </div>
  )
}

function ColorPicker({ onSelect }) {
  return (
    <div className="flex gap-2">
      {['red', 'green', 'blue'].map((color) => (
        <button key={color} className={btnLight} onClick={() => onSelect(color)}>
          {color}
        </button>
      ))}
    </div>
  )
}

function ChildToParentDemo() {
  const [selected, setSelected] = useState('none')
  return (
    <div className="space-y-2">
      <ColorPicker onSelect={(color) => setSelected(color)} />
      <p>Parent received: {selected}</p>
    </div>
  )
}

function ProfileCard({ name, role = 'Developer', skills = [], isOnline = false }) {
  return (
    <p>
      {name} - {role} - {skills.length} skills - {isOnline ? 'online' : 'offline'}
    </p>
  )
}

function DefaultPropsDemo() {
  return (
    <div className="space-y-1">
      <ProfileCard name="Anu" role="Designer" skills={['Figma', 'CSS']} isOnline />
      <ProfileCard name="Ravi" />
    </div>
  )
}

function ConditionalClassDemo() {
  const [active, setActive] = useState('home')
  const [error, setError] = useState(false)
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {['home', 'about', 'contact'].map((tab) => (
          <button key={tab} className={tab === active ? btn : btnLight} onClick={() => setActive(tab)}>
            {tab}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          className={'rounded-lg border px-3 py-1.5 ' + (error ? 'border-red-500 bg-red-50' : 'border-slate-300')}
          placeholder="Input"
        />
        <button className={btnLight} onClick={() => setError(!error)}>
          Toggle error
        </button>
      </div>
      <p style={{ color: error ? 'crimson' : 'green' }}>Inline style: {error ? 'error' : 'ok'}</p>
    </div>
  )
}

/* ------------------------- More hooks demos ------------------------- */

function readSavedNote() {
  try {
    return localStorage.getItem('demo-note') ?? ''
  } catch {
    return ''
  }
}

function LazyInitDemo() {
  // The function runs only on the first render
  const [note, setNote] = useState(() => readSavedNote())
  const handleChange = (e) => {
    setNote(e.target.value)
    try {
      localStorage.setItem('demo-note', e.target.value)
    } catch {
      // storage may be blocked; the demo still works in memory
    }
  }
  return (
    <div className="space-y-2">
      <input className={inputCls} value={note} onChange={handleChange} placeholder="Type, then reload the page" />
      <p className="text-xs text-slate-500">Saved to localStorage; read once with a lazy initializer.</p>
    </div>
  )
}

function DerivedStateDemo() {
  const [items, setItems] = useState([
    { id: 1, name: 'Pen', price: 10, qty: 2 },
    { id: 2, name: 'Book', price: 150, qty: 1 },
  ])
  // Derived: calculated during render, not stored in state
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const addOne = (id) => setItems(items.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)))
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <span>
            {item.name} x {item.qty}
          </span>
          <button className={btnLight} onClick={() => addOne(item.id)}>
            +1
          </button>
        </div>
      ))}
      <p className="font-semibold">Total: Rs {total}</p>
    </div>
  )
}

function BuggyTimer() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    // Bug: count is always 0 inside this closure
    const id = setInterval(() => setCount(count + 1), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- count is left out on purpose to show the bug
  }, [])
  return <p className="text-red-600">Buggy: {count}</p>
}

function FixedTimer() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return <p className="text-emerald-700">Fixed: {count}</p>
}

function StaleClosureDemo() {
  const [run, setRun] = useState(0)
  return (
    <div className="space-y-2">
      <div key={run}>
        <BuggyTimer />
        <FixedTimer />
      </div>
      <button className={btnLight} onClick={() => setRun(run + 1)}>
        Restart
      </button>
    </div>
  )
}

function EmailField({ label }) {
  const id = useId()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor={id}>{label}</label>
      <input className={inputCls} id={id} type="email" />
      <code className="text-xs text-slate-500">id = {id}</code>
    </div>
  )
}

function UseIdDemo() {
  return (
    <div className="space-y-2">
      <EmailField label="Work email" />
      <EmailField label="Personal email" />
    </div>
  )
}

const bigList = Array.from({ length: 20000 }, (_, i) => 'Item ' + (i + 1))

const SlowList = memo(function SlowList({ query }) {
  // pretend rendering this list is slow
  let matches = []
  for (let round = 0; round < 40; round++) {
    matches = bigList.filter((item) => item.includes(query))
  }
  return (
    <div>
      <p className="text-xs text-slate-500">{matches.length} matches (showing 30)</p>
      <ul className="list-disc pl-5">
        {matches.slice(0, 30).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
})

function DeferredDemo() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery
  return (
    <div className="space-y-2">
      <input className={inputCls} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type numbers, e.g. 123" />
      <div style={{ opacity: isStale ? 0.5 : 1 }} className="max-h-60 overflow-y-auto">
        <SlowList query={deferredQuery} />
      </div>
    </div>
  )
}

function MyInput({ ref, label, ...props }) {
  return (
    <label className="flex flex-wrap items-center gap-2">
      {label}
      <input className={inputCls} ref={ref} {...props} />
    </label>
  )
}

function RefAsPropDemo() {
  const inputRef = useRef(null)
  return (
    <div className="space-y-2">
      <MyInput ref={inputRef} label="Search" placeholder="Focus me from the parent" />
      <button className={btn} onClick={() => inputRef.current.focus()}>
        Focus input
      </button>
    </div>
  )
}

function FancyInput({ ref }) {
  const inputRef = useRef(null)
  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current.focus(),
      clear: () => {
        inputRef.current.value = ''
      },
    }),
    [],
  )
  return <input className={inputCls} ref={inputRef} placeholder="Type something" />
}

function ImperativeDemo() {
  const fancyRef = useRef(null)
  return (
    <div className="space-y-2">
      <FancyInput ref={fancyRef} />
      <div className="flex gap-2">
        <button className={btn} onClick={() => fancyRef.current.focus()}>
          Focus
        </button>
        <button className={btnLight} onClick={() => fancyRef.current.clear()}>
          Clear
        </button>
      </div>
    </div>
  )
}

/* ------------------------- More advanced demos ------------------------- */

function ReorderList({ items, useIndexKey }) {
  return (
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={useIndexKey ? index : item.id} className="flex items-center gap-2">
          <span className="w-14">{item.name}</span>
          <input className={inputCls + ' w-28'} defaultValue={item.name} />
        </li>
      ))}
    </ul>
  )
}

function ReorderKeysDemo() {
  const [items, setItems] = useState([
    { id: 'a', name: 'Apple' },
    { id: 'b', name: 'Banana' },
    { id: 'c', name: 'Cherry' },
  ])
  return (
    <div className="space-y-3">
      <button className={btn} onClick={() => setItems([...items].reverse())}>
        Reverse list
      </button>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 font-semibold text-red-600">key = index</p>
          <ReorderList items={items} useIndexKey />
        </div>
        <div>
          <p className="mb-1 font-semibold text-emerald-700">key = item.id</p>
          <ReorderList items={items} useIndexKey={false} />
        </div>
      </div>
    </div>
  )
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function addToCart(prevState, formData) {
  await wait(800) // pretend server call
  const qty = Number(formData.get('qty'))
  if (!qty || qty < 1) {
    return { error: 'Quantity must be at least 1', count: prevState.count }
  }
  return { error: null, count: prevState.count + qty }
}

function ActionStateDemo() {
  const [state, formAction, isPending] = useActionState(addToCart, { error: null, count: 0 })
  return (
    <form action={formAction} className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input className={inputCls + ' w-24'} name="qty" type="number" defaultValue="1" />
        <button className={btn} type="submit" disabled={isPending}>
          {isPending ? 'Adding...' : 'Add to cart'}
        </button>
      </div>
      {state.error && <p className="text-red-600">{state.error}</p>}
      <p>Items in cart: {state.count}</p>
    </form>
  )
}

function OptimisticDemo() {
  const [messages, setMessages] = useState([{ id: 1, text: 'Hi there!' }])
  const [optimisticMessages, addOptimistic] = useOptimistic(messages, (state, text) => [
    ...state,
    { id: 'temp-' + state.length, text, sending: true },
  ])
  const sendAction = async (formData) => {
    const text = formData.get('text')
    if (!text) return
    addOptimistic(text)
    await wait(1500) // pretend server call
    startTransition(() => {
      setMessages((m) => [...m, { id: Date.now(), text }])
    })
  }
  return (
    <div className="space-y-2">
      <ul className="space-y-1">
        {optimisticMessages.map((m) => (
          <li key={m.id} className={m.sending ? 'text-slate-400' : ''}>
            {m.text} {m.sending && <small>(sending...)</small>}
          </li>
        ))}
      </ul>
      <form action={sendAction} className="flex flex-wrap gap-2">
        <input className={inputCls} name="text" placeholder="Message" />
        <button className={btn} type="submit">
          Send
        </button>
      </form>
    </div>
  )
}

const TabsContext = createContext(null)

function Tabs({ defaultTab, children }) {
  const [active, setActive] = useState(defaultTab)
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>
}

function TabList({ children }) {
  return <div className="flex gap-2">{children}</div>
}

function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsContext)
  return (
    <button className={active === id ? btn : btnLight} onClick={() => setActive(id)}>
      {children}
    </button>
  )
}

function TabPanel({ id, children }) {
  const { active } = useContext(TabsContext)
  return active === id ? <div className="mt-3">{children}</div> : null
}

Tabs.List = TabList
Tabs.Tab = Tab
Tabs.Panel = TabPanel

function CompoundDemo() {
  return (
    <Tabs defaultTab="profile">
      <Tabs.List>
        <Tabs.Tab id="profile">Profile</Tabs.Tab>
        <Tabs.Tab id="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="profile">Name: Anu</Tabs.Panel>
      <Tabs.Panel id="settings">Theme: Dark</Tabs.Panel>
    </Tabs>
  )
}

function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const handleMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    setPos({ x: Math.round(e.clientX - box.left), y: Math.round(e.clientY - box.top) })
  }
  return (
    <div onMouseMove={handleMove} className="h-28 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
      {render(pos)}
    </div>
  )
}

function RenderPropsDemo() {
  return (
    <div className="space-y-2">
      <MouseTracker render={({ x, y }) => <p>Mouse at ({x}, {y})</p>} />
      <MouseTracker render={({ x }) => <p>{x > 150 ? 'Right side' : 'Left side'}</p>} />
    </div>
  )
}
/* ------------------------- Extra basics demos ------------------------- */

function TreeHeader({ user }) {
  return <h3 className="font-semibold">Welcome, {user}</h3>
}

function TreeProductItem({ name, onBuy }) {
  return (
    <li className="flex items-center gap-2">
      {name}
      <button className={btnLight} onClick={() => onBuy(name)}>
        Buy
      </button>
    </li>
  )
}

function TreeProductList({ products, onBuy }) {
  return (
    <ul className="space-y-1">
      {products.map((p) => (
        <TreeProductItem key={p} name={p} onBuy={onBuy} />
      ))}
    </ul>
  )
}

const treeProducts = ['Pen', 'Book', 'Bag']

function ComponentTreeDemo() {
  const [cart, setCart] = useState([])
  return (
    <div className="space-y-2">
      <TreeHeader user="Anu" />
      <TreeProductList products={treeProducts} onBuy={(name) => setCart([...cart, name])} />
      <p>Cart: {cart.join(', ') || 'empty'}</p>
    </div>
  )
}

function HandlerArgsDemo() {
  const [log, setLog] = useState('')
  const items = ['Pen', 'Book', 'Bag']
  const buy = (name, price) => setLog('Bought ' + name + ' for Rs ' + price)
  const handleClick = (e, name) => setLog(name + ' clicked at x=' + Math.round(e.clientX))
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {items.map((name, i) => (
          <button key={name} className={btn} onClick={() => buy(name, (i + 1) * 10)}>
            Buy {name}
          </button>
        ))}
        <button className={btnLight} onClick={(e) => handleClick(e, 'Info')}>
          Info
        </button>
      </div>
      <p>{log}</p>
    </div>
  )
}

function SyntheticEventDemo() {
  const [log, setLog] = useState([])
  const add = (msg) => setLog((l) => [...l, msg].slice(-4))
  const openCard = (e) => {
    add('card opened (target: ' + e.target.tagName + ', currentTarget: ' + e.currentTarget.tagName + ')')
  }
  const remove = (e) => {
    e.stopPropagation()
    add('delete clicked only')
  }
  return (
    <div className="space-y-2">
      <div onClick={openCard} className="flex cursor-pointer flex-wrap items-center gap-3 rounded-lg border border-slate-300 p-3">
        <span>Click the card text</span>
        <button className={btnLight} onClick={remove}>
          Delete
        </button>
      </div>
      <ul className="list-disc pl-5 text-sm">
        {log.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  )
}

function PromoBanner({ show }) {
  if (!show) return null
  return <p className="rounded bg-amber-100 px-2 py-1 text-amber-800">Sale ends today!</p>
}

function RenderNothingDemo() {
  const [count, setCount] = useState(0)
  const [show, setShow] = useState(true)
  return (
    <div className="space-y-2">
      <PromoBanner show={show} />
      <div className="flex flex-wrap gap-2">
        <button className={btnLight} onClick={() => setShow(!show)}>
          Toggle banner
        </button>
        <button className={btn} onClick={() => setCount(count + 1)}>
          New message
        </button>
        <button className={btnLight} onClick={() => setCount(0)}>
          Read all
        </button>
      </div>
      <p>
        <span className="text-red-600">Wrong:</span> {count && <b>{count} new</b>}
      </p>
      <p>
        <span className="text-emerald-700">Right:</span> {count > 0 && <b>{count} new</b>}
      </p>
    </div>
  )
}

/* ----------------------- Extra intermediate demos ----------------------- */

function fakeFetchPost(id, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve({ id, title: 'Post #' + id }), 1000)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

function AbortFetchDemo() {
  const [postId, setPostId] = useState(1)
  const [result, setResult] = useState({ id: null, post: null })
  const [log, setLog] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    fakeFetchPost(postId, controller.signal)
      .then((post) => setResult({ id: postId, post }))
      .catch((err) => {
        if (err.name === 'AbortError') setLog((l) => [...l, 'cancelled request ' + postId].slice(-3))
      })
    return () => controller.abort()
  }, [postId])

  const loading = result.id !== postId
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((id) => (
          <button key={id} className={id === postId ? btn : btnLight} onClick={() => setPostId(id)}>
            Post {id}
          </button>
        ))}
      </div>
      <p>{loading ? 'Loading...' : result.post.title}</p>
      <p className="text-xs text-slate-500">Click quickly between posts: {log.join(', ') || 'no cancelled requests yet'}</p>
    </div>
  )
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or blocked
    }
  }, [key, value])
  return [value, setValue]
}

function LocalStorageHookDemo() {
  const [name, setName] = useLocalStorage('demo-name', '')
  const [dark, setDark] = useLocalStorage('demo-dark', false)
  return (
    <div className="space-y-2">
      <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <label className="flex items-center gap-1">
        <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
        Dark mode
      </label>
      <p>
        Hello {name || 'guest'}, dark mode is {dark ? 'on' : 'off'}. Reload the page: it stays.
      </p>
    </div>
  )
}

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

function ClickOutsideDemo() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useOnClickOutside(ref, close)
  return (
    <div className="h-40">
      <div ref={ref} className="inline-block">
        <button className={btn} onClick={() => setOpen(!open)}>
          Menu {open ? '▲' : '▼'}
        </button>
        {open && (
          <ul className="mt-1 w-40 rounded-lg border border-slate-300 bg-white p-2 shadow">
            <li>Profile</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-500">Open the menu, then click anywhere outside it.</p>
    </div>
  )
}

const BIO_MAX = 100

function CharCounterDemo() {
  const [text, setText] = useState('')
  const left = BIO_MAX - text.length
  return (
    <div className="space-y-2">
      <textarea
        className={inputCls + ' w-full max-w-md'}
        value={text}
        maxLength={BIO_MAX}
        rows={4}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a short bio"
      />
      <p style={{ color: left < 10 ? 'crimson' : 'gray' }}>{left} characters left</p>
      <button className={btn + ' disabled:opacity-50'} disabled={!text.trim()}>
        Save
      </button>
    </div>
  )
}

const demoCities = {
  India: ['Kochi', 'Bengaluru', 'Mumbai'],
  USA: ['New York', 'Austin'],
  UK: ['London', 'Leeds'],
}

function DependentSelectDemo() {
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const changeCountry = (e) => {
    setCountry(e.target.value)
    setCity('')
  }
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <select className={inputCls} value={country} onChange={changeCountry}>
          <option value="">Select country</option>
          {Object.keys(demoCities).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} disabled={!country}>
          <option value="">Select city</option>
          {(demoCities[country] || []).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <p>{city ? city + ', ' + country : 'Nothing selected'}</p>
    </div>
  )
}

const pageItems = Array.from({ length: 23 }, (_, i) => 'Item ' + (i + 1))
const PAGE_SIZE = 5

function PaginationDemo() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(pageItems.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const visible = pageItems.slice(start, start + PAGE_SIZE)
  return (
    <div className="space-y-2">
      <ul className="list-disc pl-5">
        {visible.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1">
        <button className={btnLight + ' disabled:opacity-50'} disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button key={n} className={n === page ? btn : btnLight} onClick={() => setPage(n)}>
            {n}
          </button>
        ))}
        <button className={btnLight + ' disabled:opacity-50'} disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
      <p className="text-xs text-slate-500">
        Page {page} of {totalPages}
      </p>
    </div>
  )
}

const demoProducts = [
  { id: 1, name: 'Laptop', category: 'tech', price: 900 },
  { id: 2, name: 'Phone', category: 'tech', price: 600 },
  { id: 3, name: 'Desk', category: 'home', price: 200 },
  { id: 4, name: 'Lamp', category: 'home', price: 40 },
  { id: 5, name: 'Headphones', category: 'tech', price: 150 },
]

function SearchFilterSortDemo() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('name')
  const visible = demoProducts
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter((p) => category === 'all' || p.category === category)
    .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : a.price - b.price))
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input className={inputCls} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
        <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="tech">Tech</option>
          <option value="home">Home</option>
        </select>
        <select className={inputCls} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name">Sort by name</option>
          <option value="price">Sort by price</option>
        </select>
      </div>
      <ul className="list-disc pl-5">
        {visible.map((p) => (
          <li key={p.id}>
            {p.name} - Rs {p.price}
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="text-slate-500">No products found</p>}
    </div>
  )
}

function AccessibleDialog({ onClose }) {
  const cancelRef = useRef(null)
  useEffect(() => {
    const previous = document.activeElement
    cancelRef.current.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [onClose])
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-dlg-title"
        className="space-y-3 rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="demo-dlg-title" className="text-lg font-semibold">
          Delete file?
        </h2>
        <p>This cannot be undone. Press Escape to close.</p>
        <div className="flex gap-2">
          <button ref={cancelRef} className={btnLight} onClick={onClose}>
            Cancel
          </button>
          <button className={btn} onClick={onClose}>
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function AccessibleModalDemo() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <div>
      <button className={btn} onClick={() => setOpen(true)}>
        Delete file
      </button>
      {open && <AccessibleDialog onClose={close} />}
    </div>
  )
}

function StopwatchDemo() {
  const [ms, setMs] = useState(0)
  const [running, setRunning] = useState(false)
  const startRef = useRef(0)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setMs(Date.now() - startRef.current), 50)
    return () => clearInterval(id)
  }, [running])
  const start = () => {
    startRef.current = Date.now() - ms
    setRunning(true)
  }
  const stop = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    setMs(0)
  }
  return (
    <div className="space-y-2">
      <p className="font-mono text-2xl">{(ms / 1000).toFixed(2)}s</p>
      <div className="flex gap-2">
        {running ? (
          <button className={btn} onClick={stop}>
            Stop
          </button>
        ) : (
          <button className={btn} onClick={start}>
            Start
          </button>
        )}
        <button className={btnLight} onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  )
}

const CartStoreContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.item]
    case 'clear':
      return []
    default:
      return state
  }
}

function CartStoreProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  return <CartStoreContext.Provider value={{ items, dispatch }}>{children}</CartStoreContext.Provider>
}

function useCartStore() {
  return useContext(CartStoreContext)
}

function CartProductButton({ name }) {
  const { dispatch } = useCartStore()
  return (
    <button className={btn} onClick={() => dispatch({ type: 'add', item: name })}>
      Add {name}
    </button>
  )
}

function CartSummary() {
  const { items, dispatch } = useCartStore()
  return (
    <p className="flex flex-wrap items-center gap-2">
      Cart ({items.length}): {items.join(', ') || 'empty'}
      <button className={btnLight} onClick={() => dispatch({ type: 'clear' })}>
        Clear
      </button>
    </p>
  )
}

function GlobalStoreDemo() {
  return (
    <CartStoreProvider>
      <div className="space-y-2">
        <CartSummary />
        <div className="flex gap-2">
          <CartProductButton name="Pen" />
          <CartProductButton name="Book" />
        </div>
      </div>
    </CartStoreProvider>
  )
}

/* ------------------------- Extra advanced demos ------------------------- */

function fetchQuote(id) {
  return new Promise((resolve) => setTimeout(() => resolve('Quote #' + id + ': Keep it simple.'), 1000))
}

function QuoteText({ quotePromise }) {
  const text = use(quotePromise)
  return <p className="italic">{text}</p>
}

function UsePromiseDemo() {
  const [id, setId] = useState(1)
  const [quotePromise, setQuotePromise] = useState(() => fetchQuote(1))
  const next = () => {
    setId(id + 1)
    setQuotePromise(fetchQuote(id + 1))
  }
  return (
    <div className="space-y-2">
      <button className={btn} onClick={next}>
        Next quote
      </button>
      <Suspense fallback={<p className="text-slate-500">Loading quote...</p>}>
        <QuoteText quotePromise={quotePromise} />
      </Suspense>
    </div>
  )
}

const MemoPitfallChild = memo(function MemoPitfallChild({ label, style, onClick }) {
  const badge = useRenderBadge()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={btnLight} style={style} onClick={onClick}>
        {label}
      </button>
      <RenderBadge badgeRef={badge} label={label} />
    </div>
  )
})

const blueStyle = { color: '#2563eb' }

function MemoPitfallDemo() {
  const [count, setCount] = useState(0)
  const handleClick = useCallback(() => console.log('clicked'), [])
  return (
    <div className="space-y-2">
      <button className={btn} onClick={() => setCount(count + 1)}>
        Re-render parent ({count})
      </button>
      <MemoPitfallChild label="Inline props" style={{ color: '#2563eb' }} onClick={() => console.log('clicked')} />
      <MemoPitfallChild label="Stable props" style={blueStyle} onClick={handleClick} />
    </div>
  )
}

function A11yDemo() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const id = useId()
  const error = email && !email.includes('@') ? 'Email must contain @' : ''
  return (
    <div className="space-y-3">
      <div>
        <button className={btnLight} aria-expanded={open} aria-controls={id + '-panel'} onClick={() => setOpen(!open)}>
          What is your refund policy? {open ? '▲' : '▼'}
        </button>
        <p id={id + '-panel'} hidden={!open} className="mt-1">
          30 days, no questions asked.
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={id + '-email'}>Email</label>
        <input
          id={id + '-email'}
          className={inputCls + ' max-w-xs'}
          type="email"
          value={email}
          aria-invalid={!!error}
          aria-describedby={id + '-error'}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p id={id + '-error'} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      </div>
    </div>
  )
}

function escapeHtml(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function XssDemo() {
  const [text, setText] = useState('<img src=x onerror="alert(1)"> Hello')
  return (
    <div className="space-y-2">
      <input className={inputCls + ' w-full max-w-md'} value={text} onChange={(e) => setText(e.target.value)} />
      <p>
        <span className="text-xs text-slate-500">Rendered with {'{text}'}: </span>
        {text}
      </p>
      <p className="text-xs text-slate-500">HTML React wrote into the page:</p>
      <code className="block rounded bg-slate-50 p-2 text-xs">{escapeHtml(text)}</code>
    </div>
  )
}

function UndoRedoDemo() {
  const [history, setHistory] = useState({ past: [], present: 0, future: [] })
  const { past, present, future } = history
  const change = (delta) => setHistory({ past: [...past, present], present: present + delta, future: [] })
  const undo = () =>
    setHistory({ past: past.slice(0, -1), present: past[past.length - 1], future: [present, ...future] })
  const redo = () => setHistory({ past: [...past, present], present: future[0], future: future.slice(1) })
  return (
    <div className="space-y-2">
      <p className="text-2xl font-semibold">{present}</p>
      <div className="flex flex-wrap gap-2">
        <button className={btn} onClick={() => change(-1)}>
          -1
        </button>
        <button className={btn} onClick={() => change(1)}>
          +1
        </button>
        <button className={btnLight + ' disabled:opacity-50'} onClick={undo} disabled={!past.length}>
          Undo
        </button>
        <button className={btnLight + ' disabled:opacity-50'} onClick={redo} disabled={!future.length}>
          Redo
        </button>
      </div>
      <p className="text-xs text-slate-500">History: {past.join(' -> ') || 'none'}</p>
    </div>
  )
}

const todoFilters = {
  all: () => true,
  active: (t) => !t.done,
  completed: (t) => t.done,
}

function FilteredTodoDemo() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', done: true },
    { id: 2, text: 'Practice hooks', done: false },
    { id: 3, text: 'Build a project', done: false },
  ])
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')
  const add = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setTodos([...todos, { id: Date.now(), text: text.trim(), done: false }])
    setText('')
  }
  const toggle = (id) => setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const clearCompleted = () => setTodos(todos.filter((t) => !t.done))
  const visible = todos.filter(todoFilters[filter])
  const left = todos.filter((t) => !t.done).length
  return (
    <div className="space-y-2">
      <form onSubmit={add} className="flex flex-wrap gap-2">
        <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} placeholder="New todo" />
        <button className={btn} type="submit">
          Add
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {Object.keys(todoFilters).map((f) => (
          <button key={f} className={f === filter ? btn : btnLight} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      <ul className="space-y-1">
        {visible.map((t) => (
          <li key={t.id} className="flex items-center gap-1">
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span className={t.done ? 'text-slate-400 line-through' : ''}>{t.text}</span>
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap items-center gap-2 text-sm">
        {left} items left
        <button className={btnLight} onClick={clearCompleted}>
          Clear completed
        </button>
      </p>
    </div>
  )
}

function StarRating({ max = 5, value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div onMouseLeave={() => setHover(0)}>
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1
        const filled = star <= (hover || value)
        return (
          <button
            key={star}
            aria-label={star + ' stars'}
            className="cursor-pointer px-0.5 text-3xl"
            style={{ color: filled ? 'gold' : 'lightgray' }}
            onMouseEnter={() => setHover(star)}
            onClick={() => onChange(star)}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}

function StarRatingDemo() {
  const [rating, setRating] = useState(3)
  return (
    <div className="space-y-1">
      <StarRating value={rating} onChange={setRating} />
      <p>You rated {rating} / 5</p>
    </div>
  )
}

const OTP_LENGTH = 4

function OtpDemo() {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const inputs = useRef([])
  const handleChange = (i, e) => {
    const value = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = value
    setDigits(next)
    if (value && i < OTP_LENGTH - 1) inputs.current[i + 1].focus()
  }
  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1].focus()
  }
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    e.preventDefault()
    setDigits(Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] || ''))
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)].focus()
  }
  const code = digits.join('')
  return (
    <div className="space-y-2">
      <div className="flex gap-2" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el
            }}
            className="h-12 w-12 rounded-lg border border-slate-300 text-center text-xl"
            value={d}
            inputMode="numeric"
            aria-label={'Digit ' + (i + 1)}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>
      <p>{code.length === OTP_LENGTH ? 'Verifying ' + code : 'Enter the ' + OTP_LENGTH + '-digit code'}</p>
    </div>
  )
}

/* ------------------------ Extra hooks demos (2) ------------------------ */

function QtyWithState() {
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const add = () => {
    if (qty >= 5) {
      setError('Max 5 per order')
      return
    }
    setQty(qty + 1)
    setError('')
  }
  const remove = () => {
    if (qty <= 1) {
      setError('At least 1 item')
      return
    }
    setQty(qty - 1)
    setError('')
  }
  return (
    <div className="space-y-2 rounded-lg border border-slate-300 p-3">
      <p className="font-semibold">useState</p>
      <div className="flex items-center gap-2">
        <button className={btnLight} onClick={remove}>
          -
        </button>
        <span>Qty: {qty}</span>
        <button className={btnLight} onClick={add}>
          +
        </button>
      </div>
      <p className="min-h-5 text-sm text-red-600">{error}</p>
    </div>
  )
}

function qtyReducer(state, action) {
  switch (action.type) {
    case 'add':
      return state.qty >= 5 ? { ...state, error: 'Max 5 per order' } : { qty: state.qty + 1, error: '' }
    case 'remove':
      return state.qty <= 1 ? { ...state, error: 'At least 1 item' } : { qty: state.qty - 1, error: '' }
    case 'reset':
      return { qty: 1, error: '' }
    default:
      return state
  }
}

function QtyWithReducer() {
  const [state, dispatch] = useReducer(qtyReducer, { qty: 1, error: '' })
  return (
    <div className="space-y-2 rounded-lg border border-slate-300 p-3">
      <p className="font-semibold">useReducer</p>
      <div className="flex items-center gap-2">
        <button className={btnLight} onClick={() => dispatch({ type: 'remove' })}>
          -
        </button>
        <span>Qty: {state.qty}</span>
        <button className={btnLight} onClick={() => dispatch({ type: 'add' })}>
          +
        </button>
        <button className={btnLight} onClick={() => dispatch({ type: 'reset' })}>
          Reset
        </button>
      </div>
      <p className="min-h-5 text-sm text-red-600">{state.error}</p>
    </div>
  )
}

function StateVsReducerDemo() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <QtyWithState />
      <QtyWithReducer />
    </div>
  )
}

function EffectRunCounter({ fetchResults, label }) {
  const runs = useRef(0)
  const out = useRef(null)
  useEffect(() => {
    runs.current += 1
    fetchResults()
    if (out.current) out.current.textContent = label + ': effect ran ' + runs.current + ' times'
  }, [fetchResults, label])
  return <p ref={out} className="rounded bg-amber-100 px-2 py-0.5 text-sm text-amber-800" />
}

function CallbackEffectDemo() {
  const [query, setQuery] = useState('react')
  const [theme, setTheme] = useState('light')
  // new function on every render -> the effect re-runs on every render
  const inlineFetch = () => query.length
  // same function until query changes
  const stableFetch = useCallback(() => query.length, [query])
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input className={inputCls} value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className={btnLight} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle theme ({theme})
        </button>
      </div>
      <EffectRunCounter label="Inline function" fetchResults={inlineFetch} />
      <EffectRunCounter label="useCallback" fetchResults={stableFetch} />
      <p className="text-xs text-slate-500">Toggle the theme: only the inline one re-runs. Type: both re-run.</p>
    </div>
  )
}

function validateAuthForm(values) {
  const errors = {}
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email'
  if (values.password.length < 8) errors.password = 'At least 8 characters'
  return errors
}

function ValidationTimingDemo() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const errors = validateAuthForm(values)
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setSubmitted(false)
  }
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true })
  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    setSubmitted(Object.keys(errors).length === 0)
  }
  const show = (name) => touched[name] && errors[name]
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-2">
      <div>
        <input className={inputCls} name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="Email" />
        {show('email') && <p className="text-xs text-red-600">{errors.email}</p>}
      </div>
      <div>
        <input
          className={inputCls}
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        <p className="text-xs text-slate-500">
          {values.password.length}/8 characters {values.password.length >= 8 ? '✓' : ''}
        </p>
        {show('password') && <p className="text-xs text-red-600">{errors.password}</p>}
      </div>
      <button className={btn} type="submit">
        Sign up
      </button>
      {submitted && <p className="text-emerald-700">Signed up!</p>}
    </form>
  )
}

function useOpenToggle(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  const toggle = () => setIsOpen(!isOpen)
  return [isOpen, toggle]
}

function ToggleOpenDemo() {
  const [isOpen, toggle] = useOpenToggle()
  return (
    <div>
      <button className={btn} onClick={toggle}>
        {isOpen ? 'Close' : 'Open'} menu
      </button>
      {isOpen && (
        <ul className="mt-1 w-40 rounded-lg border border-slate-300 bg-white p-2 shadow">
          <li>Profile</li>
          <li>Settings</li>
          <li>Logout</li>
        </ul>
      )}
    </div>
  )
}

/* ---------------------------- Questions ---------------------------- */

function HooksIntroDemo() {
  // Built-in hook
  const [count, setCount] = useState(0)
  // Custom hook (defined below) built from built-in hooks
  const [isOn, toggle] = useSwitch()

  return (
    <div className="space-y-2">
      <button
        onClick={() => setCount(count + 1)}
        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500"
      >
        useState count: {count}
      </button>
      <button
        onClick={toggle}
        className="ml-2 rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
      >
        useSwitch: {isOn ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}

function useSwitch(initial = false) {
  const [isOn, setIsOn] = useState(initial)
  return [isOn, () => setIsOn(!isOn)]
}

export const questions = [
  // ---------- Basics ----------
  {
    q: 'What is React?',
    level: 'Basics',
    a: 'React is a JavaScript library from Meta for building user interfaces. I build the UI out of small reusable components, and React updates the screen for me when the data changes. I like it because I describe what the UI should look like, not the step-by-step DOM changes.',
    code: `function App() {
  return <h1>Hello, React!</h1>
}

createRoot(document.getElementById('root'))
  .render(<App />)`,
    output: <HelloDemo />,
  },
  {
    q: 'What is the Virtual DOM?',
    level: 'Basics',
    a: 'The Virtual DOM is a lightweight JavaScript copy of the real DOM. When state changes, React creates a new virtual tree, compares it with the previous one (this is called diffing), and then updates only the parts of the real DOM that actually changed. This is faster than re-building the whole page because real DOM operations are expensive.',
    code: `// State changes: count 0 -> 1
<div>
  <h1>Counter</h1>
  <p>Count: {count}</p>
</div>

// React compares old and new virtual trees
// and only updates the text inside <p>`,
    output: `Old virtual DOM:  <p>Count: 0</p>
New virtual DOM:  <p>Count: 1</p>

Diff result: only the text node of <p> changed
Real DOM update: p.textContent = "Count: 1"
<h1> and <div> are untouched.`,
  },
  {
    q: 'What is JSX?',
    level: 'Basics',
    a: 'JSX is a syntax that lets me write HTML-like code inside JavaScript. It is not real HTML; it gets compiled to React.createElement calls. I can put any JavaScript expression inside curly braces. A small tip: I use className instead of class, and every tag must be closed.',
    code: `function Welcome() {
  const name = 'Sanu'
  const items = 3
  return (
    <div>
      <h2>Hi {name.toUpperCase()}</h2>
      <p>You have {items * 2} new messages</p>
    </div>
  )
}`,
    output: <JsxDemo />,
  },
  {
    q: 'Function components vs class components?',
    level: 'Basics',
    a: 'Both create components, but function components are just functions that return JSX, while class components extend React.Component and use a render method. Before hooks, only classes could have state and lifecycle methods. Today I write function components with hooks because they are shorter and easier to test; I only see classes in older code or for error boundaries.',
    code: `function WelcomeFn({ name }) {
  return <p>Hello {name} (function)</p>
}

class WelcomeClass extends Component {
  render() {
    return <p>Hello {this.props.name} (class)</p>
  }
}

<WelcomeFn name="Anu" />
<WelcomeClass name="Ravi" />`,
    output: <FnVsClassDemo />,
  },
  {
    q: 'What are props?',
    level: 'Basics',
    a: 'Props are the inputs I pass to a component, just like arguments to a function. They flow from parent to child and are read-only, so the child should never change them. I usually destructure props in the function signature to keep the code clean.',
    code: `function Greeting({ name, age }) {
  return <p>{name} is {age} years old</p>
}

function App() {
  return (
    <>
      <Greeting name="Anu" age={22} />
      <Greeting name="Ravi" age={30} />
    </>
  )
}`,
    output: <PropsDemo />,
  },
  {
    q: 'What is state?',
    level: 'Basics',
    a: 'State is data that belongs to a component and can change over time. When I update state with the setter function, React re-renders the component with the new value. I keep state as small as possible and calculate anything else from it.',
    code: `function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}`,
    output: <CounterDemo />,
  },
  {
    q: 'What is the difference between props and state?',
    level: 'Basics',
    a: 'Props come from the parent and are read-only inside the child. State is owned by the component itself and can be changed with its setter. A common pattern is that a parent keeps something in state and passes it down to a child as a prop, like in this example.',
    code: `function Display({ value }) {
  // value is a prop: read-only here
  return <p>Count: {value}</p>
}

function Parent() {
  // count is state: owned by Parent
  const [count, setCount] = useState(0)
  return (
    <>
      <Display value={count} />
      <button onClick={() => setCount(count + 1)}>+1</button>
    </>
  )
}`,
    output: <PropsVsStateDemo />,
  },
  {
    q: 'How do you render lists, and why do keys matter?',
    level: 'Basics',
    a: 'I use map to turn an array into JSX elements, and I give each item a unique key. React uses the key to know which item is which between renders. I avoid using the array index as a key when items can be added, removed or reordered, because the index changes and React may mix up item state. A stable id from the data is the best key.',
    code: `function FruitList() {
  const [fruits, setFruits] = useState([
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Mango' },
  ])
  const addFirst = () => {
    const id = Date.now()
    setFruits([{ id, name: 'Banana ' + (fruits.length + 1) }, ...fruits])
  }
  return (
    <>
      <button onClick={addFirst}>Add to top</button>
      <ul>
        {fruits.map((fruit) => (
          <li key={fruit.id}>{fruit.name}</li>
        ))}
      </ul>
    </>
  )
}`,
    output: <ListKeysDemo />,
  },
  {
    q: 'How do you do conditional rendering?',
    level: 'Basics',
    a: 'I use normal JavaScript inside JSX: the ternary operator when I have two options, and && when I want to show something or nothing. For bigger logic I use an if statement before the return. One tip: be careful with && and numbers, because {0 && <p/>} renders 0 on the screen, so I write count > 0 && instead.',
    code: `function Status() {
  const [loggedIn, setLoggedIn] = useState(false)
  const count = 2
  return (
    <>
      {loggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}
      {loggedIn && count > 0 && <p>You have {count} notifications</p>}
      <button onClick={() => setLoggedIn(!loggedIn)}>
        {loggedIn ? 'Logout' : 'Login'}
      </button>
    </>
  )
}`,
    output: <ConditionalDemo />,
  },
  {
    q: 'How do you handle events in React?',
    level: 'Basics',
    a: 'I pass a function to props like onClick or onChange, written in camelCase. React gives the handler an event object, so I can read e.target.value for inputs. A common mistake is writing onClick={handleClick()} which calls the function immediately; I pass the function itself or wrap it in an arrow function.',
    code: `function Events() {
  const [message, setMessage] = useState('')
  const handleClick = () => setMessage('Button clicked!')
  const handleChange = (e) => setMessage('Typed: ' + e.target.value)
  return (
    <>
      <button onClick={handleClick}>Click me</button>
      <input onChange={handleChange} />
      <p>{message}</p>
    </>
  )
}`,
    output: <EventsDemo />,
  },
  {
    q: 'Controlled vs uncontrolled inputs?',
    level: 'Basics',
    a: 'In a controlled input, React state holds the value and I update it on every change, so React is the single source of truth. In an uncontrolled input, the DOM keeps the value and I read it with a ref when I need it. I prefer controlled inputs for validation and live feedback, and uncontrolled ones for simple forms or file inputs.',
    code: `// Controlled
const [name, setName] = useState('')
<input value={name} onChange={(e) => setName(e.target.value)} />
<p>Controlled value: {name}</p>

// Uncontrolled
const inputRef = useRef(null)
const [uncontrolled, setUncontrolled] = useState('')
<input ref={inputRef} defaultValue="hello" />
<button onClick={() => setUncontrolled(inputRef.current.value)}>
  Read
</button>`,
    output: <ControlledDemo />,
  },
  {
    q: 'How do you handle forms?',
    level: 'Basics',
    a: 'I keep each field in state as a controlled input and handle the onSubmit event on the form. Inside the handler I call e.preventDefault() so the browser does not reload the page. Then I validate, send the data, and reset the fields if needed.',
    code: `function Subscribe() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(email)
    setEmail('')
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Subscribe</button>
      {submitted && <p>Subscribed: {submitted}</p>}
    </form>
  )
}`,
    output: <FormDemo />,
  },
  {
    q: 'What is lifting state up?',
    level: 'Basics',
    a: 'When two sibling components need the same data, I move that state up to their closest common parent. The parent passes the value down as a prop and passes a function down so the child can ask for changes. This keeps one source of truth so the siblings never go out of sync.',
    code: `function CountButton({ onAdd }) {
  return <button onClick={onAdd}>Add</button>
}

function CountLabel({ count }) {
  return <p>Total: {count}</p>
}

function Parent() {
  const [count, setCount] = useState(0)
  return (
    <>
      <CountButton onAdd={() => setCount(count + 1)} />
      <CountLabel count={count} />
    </>
  )
}`,
    output: <LiftingStateDemo />,
  },
  {
    q: 'What is the children prop?',
    level: 'Basics',
    a: 'children is a special prop that contains whatever I put between the opening and closing tags of a component. I use it to build wrapper components like cards, modals and layouts, so the wrapper does not need to know what is inside it. It makes components much more reusable.',
    code: `function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  )
}

<Card title="Profile">
  <p>Name: Anu</p>
  <p>Role: Developer</p>
</Card>`,
    output: <ChildrenDemo />,
  },
  {
    q: 'What are Fragments?',
    level: 'Basics',
    a: 'A component must return a single parent element, and Fragments let me group elements without adding an extra div to the DOM. I write them as <>...</>, or <Fragment key={id}> when I need a key inside a list. They are useful for tables and definition lists where an extra div would break the HTML structure.',
    code: `function FragmentInfo() {
  return (
    <>
      <dt>React</dt>
      <dd>A UI library</dd>
    </>
  )
}

<dl>
  <FragmentInfo />
  <FragmentInfo />
</dl>`,
    output: <FragmentDemo />,
  },
  {
    q: 'How do you add, remove, update and toggle items in array state? (todo list)',
    level: 'Basics',
    a: 'I never mutate the array; I always pass a new array to the setter. I use spread to add, filter to remove, and map to update or toggle one item while copying the rest. For edit mode I keep the id of the item being edited in state, and I always use a stable id, not the index, to find the item.',
    code: `const [todos, setTodos] = useState([])

// Add
setTodos([...todos, { id: Date.now(), text, done: false }])

// Remove
setTodos(todos.filter((t) => t.id !== id))

// Toggle
setTodos(todos.map((t) =>
  t.id === id ? { ...t, done: !t.done } : t))

// Edit
setTodos(todos.map((t) =>
  t.id === id ? { ...t, text: editText } : t))

<ul>
  {todos.map((todo) => (
    <li key={todo.id}>
      <input type="checkbox" checked={todo.done}
        onChange={() => toggleTodo(todo.id)} />
      {todo.text}
      <button onClick={() => startEdit(todo)}>Edit</button>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  ))}
</ul>`,
    output: <TodoDemo />,
  },
  {
    q: 'How do you update nested object state?',
    level: 'Basics',
    a: 'I have to copy every level I change, because spread only makes a shallow copy. So I spread the outer object, then spread the nested object and override the one field. If my state gets deeply nested, I try to flatten it or use a reducer or a library like Immer to keep the updates readable.',
    code: `const [user, setUser] = useState({
  name: 'Anu',
  address: { city: 'Kochi', pin: '682001' },
})

const updateCity = (e) => {
  setUser({
    ...user,
    address: { ...user.address, city: e.target.value },
  })
}

<input value={user.address.city} onChange={updateCity} />`,
    output: <NestedStateDemo />,
  },
  {
    q: 'How do you handle multiple inputs with one onChange handler?',
    level: 'Basics',
    a: 'I keep all fields in one state object and give each input a name attribute that matches a key in that object. In one handleChange I read name and value from e.target and use a computed property key, [name]: value, to update just that field. This saves me from writing a separate handler for every input.',
    code: `const [form, setForm] = useState({
  firstName: '', lastName: '', email: '',
})

const handleChange = (e) => {
  const { name, value } = e.target
  setForm({ ...form, [name]: value })
}

<input name="firstName" value={form.firstName} onChange={handleChange} />
<input name="lastName" value={form.lastName} onChange={handleChange} />
<input name="email" value={form.email} onChange={handleChange} />`,
    output: <MultiInputDemo />,
  },
  {
    q: 'How do you do form validation with error messages?',
    level: 'Basics',
    a: 'I write a small validate function that takes the values and returns an errors object, with one message per invalid field. On submit I run it, store the errors in state, and only send the data if the object is empty. I show each message right below its input, and for bigger forms I use a library like React Hook Form with Zod.',
    code: `function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Name is required'
  if (!/^\\S+@\\S+\\.\\S+$/.test(values.email)) errors.email = 'Enter a valid email'
  if (values.password.length < 6)
    errors.password = 'Password must be at least 6 characters'
  return errors
}

const handleSubmit = (e) => {
  e.preventDefault()
  const found = validate(values)
  setErrors(found)
  setSuccess(Object.keys(found).length === 0)
}

<input name="email" value={values.email} onChange={handleChange} />
{errors.email && <p className="error">{errors.email}</p>}`,
    output: <ValidationDemo />,
  },
  {
    q: 'How do you control a select, checkbox and radio buttons?',
    level: 'Basics',
    a: 'A select works like a text input: I pass value and update it in onChange. For a checkbox I use checked and read e.target.checked, not e.target.value. For radio buttons I give them the same name and set checked by comparing each option with the state value.',
    code: `const [country, setCountry] = useState('india')
const [plan, setPlan] = useState('free')
const [agree, setAgree] = useState(false)

<select value={country} onChange={(e) => setCountry(e.target.value)}>
  <option value="india">India</option>
  <option value="usa">USA</option>
</select>

{['free', 'pro'].map((p) => (
  <label key={p}>
    <input type="radio" name="plan" value={p}
      checked={plan === p}
      onChange={(e) => setPlan(e.target.value)} />
    {p}
  </label>
))}

<input type="checkbox" checked={agree}
  onChange={(e) => setAgree(e.target.checked)} />`,
    output: <ControlledOptionsDemo />,
  },
  {
    q: 'How does a child send data to its parent?',
    level: 'Basics',
    a: 'Data only flows down in React, so the parent passes a function as a prop and the child calls it with the data. The parent then decides what to do, usually set its own state. I name these props like events, such as onSelect or onChange, so it is clear the child is reporting something up.',
    code: `function ColorPicker({ onSelect }) {
  return ['red', 'green', 'blue'].map((color) => (
    <button key={color} onClick={() => onSelect(color)}>
      {color}
    </button>
  ))
}

function Parent() {
  const [selected, setSelected] = useState('none')
  return (
    <>
      <ColorPicker onSelect={(color) => setSelected(color)} />
      <p>Parent received: {selected}</p>
    </>
  )
}`,
    output: <ChildToParentDemo />,
  },
  {
    q: 'How do you destructure props and set default values?',
    level: 'Basics',
    a: 'I destructure props right in the function parameters and use JavaScript default values for optional ones. defaultProps is deprecated for function components, so default parameters are the modern way. One tip: a default like skills = [] only applies when the prop is undefined, not when someone passes null.',
    code: `function ProfileCard({
  name,
  role = 'Developer',
  skills = [],
  isOnline = false,
}) {
  return (
    <p>
      {name} - {role} - {skills.length} skills -
      {isOnline ? 'online' : 'offline'}
    </p>
  )
}

<ProfileCard name="Anu" role="Designer" skills={['Figma', 'CSS']} isOnline />
<ProfileCard name="Ravi" />`,
    output: <DefaultPropsDemo />,
  },
  {
    q: 'How do you add conditional classes and styles?',
    level: 'Basics',
    a: 'Since className is just a string, I build it with a ternary or a template string based on state. When there are many conditions I use a small helper like clsx to keep it readable. For truly dynamic values like a calculated width or color, I use the style prop, which takes an object with camelCase keys.',
    code: `const [active, setActive] = useState('home')
const [error, setError] = useState(false)

{['home', 'about', 'contact'].map((tab) => (
  <button key={tab}
    className={tab === active ? 'tab active' : 'tab'}
    onClick={() => setActive(tab)}>
    {tab}
  </button>
))}

<input className={'input ' + (error ? 'input-error' : '')} />

<p style={{ color: error ? 'crimson' : 'green' }}>
  Inline style
</p>`,
    output: <ConditionalClassDemo />,
  },
  {
    q: 'Inline styles vs CSS Modules vs Tailwind: which do you use?',
    level: 'Basics',
    a: 'Inline styles are fine for dynamic values but cannot do hover, media queries or pseudo-elements. CSS Modules give me normal CSS with class names scoped to the component, so there are no naming clashes. Tailwind lets me style with utility classes right in the JSX, which is fast and keeps the bundle small; it is what I use in this project, and I extract repeated class strings into constants or components.',
    code: `// 1. Inline style (object, camelCase)
<button style={{ backgroundColor: 'teal', padding: 8 }}>Save</button>

// 2. CSS Module: Button.module.css -> .primary { ... }
import styles from './Button.module.css'
<button className={styles.primary}>Save</button>

// 3. Tailwind utility classes
<button className="bg-teal-600 px-4 py-2 text-white hover:bg-teal-500">
  Save
</button>`,
    output: `Inline style   -> style="background-color: teal; padding: 8px"
                  no :hover, no media queries
CSS Module     -> class="_primary_x7k2a" (unique, scoped)
Tailwind       -> class="bg-teal-600 px-4 py-2 ..."
                  hover and responsive variants built in`,
  },
  {
    q: 'How do you type-check props? PropTypes vs TypeScript',
    level: 'Basics',
    a: 'PropTypes checked props at runtime and printed warnings in the console, but React 19 removed that check, so they no longer do anything. Today I use TypeScript: I describe the props with an interface or type, and mistakes show up in my editor before I even run the code. I mark optional props with a question mark and give them default values when destructuring.',
    code: `// Old way: PropTypes (ignored in React 19)
Greeting.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
}

// Modern way: TypeScript
type GreetingProps = {
  name: string
  age?: number
  onGreet?: (name: string) => void
}

function Greeting({ name, age = 18, onGreet }: GreetingProps) {
  return <p onClick={() => onGreet?.(name)}>{name} is {age}</p>
}

<Greeting name={42} />`,
    output: `TypeScript error at compile time:
  Type 'number' is not assignable to type 'string'.
  (on <Greeting name={42} />)

The mistake is caught in the editor, before the app runs.`,
  },
  {
    q: 'What is a component tree, and what does one-way data flow mean?',
    level: 'Basics',
    a: 'My app is a tree of components: App at the root renders children like Header and ProductList, and those render their own children. Data flows one way, from parent to child through props, so when I want to know where a value comes from I just walk up the tree. A child never changes its parent data directly; it calls a function the parent passed down, which keeps bugs easy to trace.',
    code: `function Header({ user }) {
  return <h3>Welcome, {user}</h3>
}

function ProductItem({ name, onBuy }) {
  return (
    <li>
      {name} <button onClick={() => onBuy(name)}>Buy</button>
    </li>
  )
}

function ProductList({ products, onBuy }) {
  return (
    <ul>
      {products.map((p) => (
        <ProductItem key={p} name={p} onBuy={onBuy} />
      ))}
    </ul>
  )
}

// Tree: App -> Header, ProductList -> ProductItem
function App() {
  const [cart, setCart] = useState([])
  const products = ['Pen', 'Book', 'Bag']
  return (
    <>
      <Header user="Anu" />
      <ProductList products={products}
        onBuy={(name) => setCart([...cart, name])} />
      <p>Cart: {cart.join(', ') || 'empty'}</p>
    </>
  )
}`,
    output: <ComponentTreeDemo />,
  },
  {
    q: 'How does React render? Render phase vs commit phase',
    level: 'Basics',
    a: 'Rendering happens in two steps. In the render phase React calls my component functions to get the new JSX and compares it with the previous tree; this must be pure, with no side effects, because React may run it more than once or throw the result away. In the commit phase React applies only the differences to the real DOM, then the browser paints and my effects run. So a re-render does not always mean the DOM changed; if nothing is different, the commit does nothing.',
    code: `function Counter() {
  const [count, setCount] = useState(0)
  console.log('render: count =', count)      // render phase

  useEffect(() => {
    console.log('effect: DOM shows', count)  // after commit + paint
  }, [count])

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}`,
    output: `1. Trigger:  click -> setCount(1)
2. Render:   React calls Counter()  -> "render: count = 1"
             diff with the old tree: only the button text changed
3. Commit:   React sets button.textContent = "1"
4. Paint:    the browser draws the new frame
5. Effects:  "effect: DOM shows 1"`,
  },
  {
    q: 'What are the rules of JSX?',
    level: 'Basics',
    a: 'A component must return one parent element, so I wrap siblings in a div or a Fragment. Every tag has to be closed, so I write <img /> and <input />, and attributes are camelCase: className instead of class, htmlFor instead of for, onClick instead of onclick. Inside curly braces I can only put expressions, not statements, so I use a ternary or map instead of if or for.',
    code: `// Wrong
function Profile() {
  return (
    <h2 class="title">Anu</h2>
    <img src="/anu.png">
    <label for="bio">Bio</label>
  )
}

// Right
function Profile() {
  const isAdmin = true
  return (
    <>
      <h2 className="title">Anu</h2>
      <img src="/anu.png" alt="Anu" />
      <label htmlFor="bio">Bio</label>
      <p style={{ fontSize: 14 }}>{isAdmin ? 'Admin' : 'User'}</p>
    </>
  )
}`,
    output: `Wrong version:
  Adjacent JSX elements must be wrapped in an enclosing tag
  Expected corresponding JSX closing tag for <img>
  Warning: Invalid DOM property 'class'. Did you mean 'className'?

Rules:
  1. One parent element (or a Fragment <>...</>)
  2. Close every tag: <img />, <br />, <input />
  3. camelCase attributes: className, htmlFor, onClick, tabIndex
  4. {} takes expressions only: ternary, &&, map (not if / for)
  5. style takes an object: style={{ fontSize: 14 }}`,
  },
  {
    q: 'How do you pass arguments to an event handler?',
    level: 'Basics',
    a: 'I wrap the call in an arrow function, like onClick={() => buy(name, price)}, so it runs on click and not during render. If I also need the event object, I pass it along: onClick={(e) => handleClick(e, name)}. Writing onClick={buy(name)} is a classic bug, because it calls the function immediately on every render.',
    code: `function Shop() {
  const [log, setLog] = useState('')
  const items = ['Pen', 'Book', 'Bag']

  const buy = (name, price) =>
    setLog('Bought ' + name + ' for Rs ' + price)
  const handleClick = (e, name) =>
    setLog(name + ' clicked at x=' + Math.round(e.clientX))

  return (
    <>
      {items.map((name, i) => (
        <button key={name} onClick={() => buy(name, (i + 1) * 10)}>
          Buy {name}
        </button>
      ))}
      <button onClick={(e) => handleClick(e, 'Info')}>Info</button>
      <p>{log}</p>
    </>
  )
}`,
    output: <HandlerArgsDemo />,
  },
  {
    q: 'What is a SyntheticEvent? e.target vs e.currentTarget and stopPropagation',
    level: 'Basics',
    a: 'React wraps the browser event in a SyntheticEvent, which works the same in every browser and has target, currentTarget, preventDefault and stopPropagation. e.target is the element that was actually clicked, while e.currentTarget is the element the handler is attached to. I use e.stopPropagation() when a click inside a child should not trigger the parent, like a delete button inside a clickable card.',
    code: `function CardList() {
  const [log, setLog] = useState([])
  const add = (msg) => setLog((l) => [...l, msg].slice(-4))

  const openCard = (e) => {
    add('card opened (target: ' + e.target.tagName +
      ', currentTarget: ' + e.currentTarget.tagName + ')')
  }
  const remove = (e) => {
    e.stopPropagation() // do not open the card
    add('delete clicked only')
  }

  return (
    <>
      <div className="card" onClick={openCard}>
        <span>Click the card text</span>
        <button onClick={remove}>Delete</button>
      </div>
      <ul>{log.map((m, i) => <li key={i}>{m}</li>)}</ul>
    </>
  )
}`,
    output: <SyntheticEventDemo />,
  },
  {
    q: 'How do you render nothing, and why does {count && ...} show a 0?',
    level: 'Basics',
    a: 'A component can return null to render nothing, which I use for things like a hidden banner, and false, null and undefined inside JSX also render nothing. But 0 is a number, so React prints it: {count && <b>new</b>} shows a 0 when count is 0. I fix it by making the condition a real boolean, like count > 0 && ..., or by using a ternary.',
    code: `function Banner({ show }) {
  if (!show) return null // renders nothing
  return <p>Sale ends today!</p>
}

function Inbox() {
  const [count, setCount] = useState(0)
  const [show, setShow] = useState(true)
  return (
    <>
      <Banner show={show} />
      <button onClick={() => setShow(!show)}>Toggle banner</button>
      <button onClick={() => setCount(count + 1)}>New message</button>
      <button onClick={() => setCount(0)}>Read all</button>

      <p>Wrong: {count && <b>{count} new</b>}</p>
      <p>Right: {count > 0 && <b>{count} new</b>}</p>
    </>
  )
}`,
    output: <RenderNothingDemo />,
  },
  {
    q: 'How do you import images and other static assets in a Vite React app?',
    level: 'Basics',
    a: 'For files inside src, I import them like modules: import logo from \'./assets/logo.png\' gives me the final URL, and Vite adds a hash to the file name so browsers can cache it forever. Files in the public folder are copied as they are and I use an absolute path like /hero.jpg, which is good for files that need a fixed name, like robots.txt. I always give images a meaningful alt text.',
    code: `import logo from './assets/logo.png'   // URL string
import data from './data.json'          // JSON becomes an object
import notes from './notes.txt?raw'     // file content as a string
import './App.css'                      // global CSS

function Header() {
  return (
    <header>
      <img src={logo} alt="Company logo" width={120} />
      {/* public/hero.jpg is served at /hero.jpg */}
      <img src="/hero.jpg" alt="Hero banner" />
      <p>{data.title}</p>
    </header>
  )
}`,
    output: `Dev:     logo -> "/src/assets/logo.png"
Build:   logo -> "/assets/logo-B3x9k2Qa.png"  (hashed, cached long)
         very small images are inlined as data: URLs
public/: hero.jpg is copied as-is to dist/hero.jpg (no hash)`,
  },
  {
    q: 'How do you organise the folder structure of a React project?',
    level: 'Basics',
    a: 'For small apps I keep it simple with components, pages, hooks and utils folders under src. As the app grows I move to a feature-based structure, where each feature like auth or cart keeps its components, hooks, API calls and tests together, so one change does not make me jump across the whole project. Shared UI pieces like Button and Modal stay in a common components folder, and I avoid deep nesting.',
    code: `src/
  main.jsx              // createRoot + providers
  App.jsx               // routes and layout
  components/           // shared UI: Button, Modal, Spinner
  hooks/                // useDebounce, useLocalStorage
  lib/                  // api client, helpers, constants
  pages/                // route-level components
  assets/               // images, fonts
  features/
    auth/
      LoginForm.jsx
      useAuth.js
      authApi.js
    cart/
      CartPage.jsx
      CartItem.jsx
      cartStore.js
      CartPage.test.jsx`,
    output: `Small app   -> group by type (components, hooks, pages)
Growing app -> group by feature (auth, cart, profile)
Rule of thumb: files that change together live together.`,
  },
  {
    q: 'What are hooks in React, and what types of hooks are there?',
    level: 'Basics',
    a: "Hooks are special functions whose names start with \"use\" that let function components use React features like state, side effects, context and refs, without writing a class. There are two types: built-in hooks that React gives us, like useState and useEffect, and custom hooks that I write myself by combining built-in hooks so I can reuse logic. I follow the rules of hooks: call them only at the top level of a component or custom hook, never inside loops or conditions.",
    code: `import { useState } from 'react'

// 1. Built-in hook: provided by React
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

// 2. Custom hook: my own function that uses built-in hooks
function useSwitch(initial = false) {
  const [isOn, setIsOn] = useState(initial)
  return [isOn, () => setIsOn(!isOn)]
}

function App() {
  const [isOn, toggle] = useSwitch()
  return <button onClick={toggle}>{isOn ? 'ON' : 'OFF'}</button>
}`,
    output: <HooksIntroDemo />,
  },
  {
    q: 'What built-in hooks does React have?',
    level: 'Basics',
    a: 'I group them by job. useState and useReducer hold state, useContext reads context, useRef and useImperativeHandle work with refs, and useEffect, useLayoutEffect and useInsertionEffect run effects. For performance there are useMemo, useCallback, useTransition and useDeferredValue, and there are helpers like useId, useDebugValue and useSyncExternalStore. React 19 added useActionState, useOptimistic, the use() API, and useFormStatus in react-dom, and 19.2 added useEffectEvent.',
    code: `// State
const [count, setCount] = useState(0)
const [state, dispatch] = useReducer(reducer, initialState)

// Context
const theme = useContext(ThemeContext)

// Refs
const inputRef = useRef(null)
useImperativeHandle(ref, () => ({ focus }), [])

// Effects
useEffect(() => { /* after paint */ }, [deps])
useLayoutEffect(() => { /* before paint */ }, [deps])
useInsertionEffect(() => { /* CSS-in-JS libraries */ }, [])

// Performance
const total = useMemo(() => calc(items), [items])
const onSave = useCallback(() => save(id), [id])
const [isPending, startTransition] = useTransition()
const deferredQuery = useDeferredValue(query)

// Other
const id = useId()
useDebugValue(isOnline ? 'Online' : 'Offline')
const width = useSyncExternalStore(subscribe, getSnapshot)

// React 19
const [result, formAction, pending] = useActionState(action, init)
const [optimistic, addOptimistic] = useOptimistic(list, update)
const user = use(userPromise)
const { pending: sending } = useFormStatus() // from 'react-dom'`,
    output: `STATE
useState
  Stores a value that, when changed, re-renders the component
useReducer
  Stores state updated by a reducer function (state, action)

CONTEXT
useContext
  Reads a value from a Context without passing props

REFS
useRef
  Keeps a mutable value or a DOM element that doesn't re-render
useImperativeHandle
  Chooses what a parent can call through a ref

EFFECTS
useEffect
  Runs side effects (fetch, timers, subscriptions) after render
useLayoutEffect
  Like useEffect, but runs before the browser paints
useInsertionEffect
  Inserts styles before layout effects (for CSS-in-JS libraries)
useEffectEvent
  Reads the latest props/state in an effect without re-running it (19.2)

PERFORMANCE
useMemo
  Caches the result of an expensive calculation
useCallback
  Caches a function so its reference stays the same
useTransition
  Marks an update as non-urgent and gives isPending
useDeferredValue
  Shows an older value while a newer one renders in the background

OTHER
useId
  Creates a unique ID that is stable on server and client
useDebugValue
  Shows a label for a custom hook in React DevTools
useSyncExternalStore
  Subscribes to a store outside React (browser APIs, libraries)

REACT 19
useActionState
  Runs a form action and tracks its result and pending state
useOptimistic
  Shows an optimistic value until the real update finishes
use()
  Reads a Promise or Context during render (works with Suspense)
useFormStatus
  Gives the pending state of the parent <form> (from react-dom)

CUSTOM HOOKS
useAnything
  My own function starting with "use" that combines these hooks`,
  },
  {
    q: 'How do you create a simple custom hook to toggle open and close?',
    level: 'Basics',
    a: 'I create a function whose name starts with "use", put the useState inside it, and return the value together with a function that flips it. Then any component can call useToggle() and get its own open or closed state without repeating that logic. I use it all the time for dropdowns, modals, accordions and sidebars.',
    code: `function useToggle(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  const toggle = () => setIsOpen(!isOpen)
  return [isOpen, toggle]
}

function Dropdown() {
  const [isOpen, toggle] = useToggle()

  return (
    <div>
      <button onClick={toggle}>{isOpen ? 'Close' : 'Open'} menu</button>
      {isOpen && (
        <ul>
          <li>Profile</li>
          <li>Settings</li>
          <li>Logout</li>
        </ul>
      )}
    </div>
  )
}`,
    output: <ToggleOpenDemo />,
  },

  // ---------- Hooks ----------
  {
    q: 'useState and functional updates',
    level: 'Intermediate',
    a: 'useState returns the current value and a setter. The setter does not change the value immediately; the new value shows up on the next render. So if I update based on the previous value, I pass a function like setCount(c => c + 1). In this demo, the "wrong" button adds only 1 because all three calls read the same old count.',
    code: `const [count, setCount] = useState(0)

const addThreeWrong = () => {
  setCount(count + 1)
  setCount(count + 1)
  setCount(count + 1)   // count is still 0 here -> result 1
}

const addThreeRight = () => {
  setCount((c) => c + 1)
  setCount((c) => c + 1)
  setCount((c) => c + 1) // uses latest value -> result 3
}`,
    output: <FunctionalUpdateDemo />,
  },
  {
    q: 'useEffect: dependency array and cleanup',
    level: 'Intermediate',
    a: 'useEffect runs side effects after the component renders, like timers, subscriptions or fetching data. The dependency array controls when it runs: no array means after every render, [] means only on mount, and [a, b] means when a or b changes. If I return a function, React calls it as cleanup before the effect runs again and when the component unmounts, which prevents memory leaks.',
    code: `function Timer() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(id) // cleanup
  }, []) // run once on mount
  return <p>Seconds: {seconds}</p>
}

{show && <Timer />}`,
    output: <EffectDemo />,
  },
  {
    q: 'What is useRef used for?',
    level: 'Intermediate',
    a: 'I use useRef for two things. First, to get direct access to a DOM element, like focusing an input. Second, to store a value that survives re-renders but does not cause a re-render when it changes, like a timer id or a click counter. In the demo, clicking "Click (ref only)" changes the ref but the screen updates only when state changes.',
    code: `const inputRef = useRef(null)
const clicks = useRef(0)
const [shown, setShown] = useState(0)

<input ref={inputRef} />
<button onClick={() => inputRef.current.focus()}>Focus</button>

<button onClick={() => (clicks.current += 1)}>Click (ref only)</button>
<button onClick={() => setShown(clicks.current)}>Show clicks</button>
<p>Clicks shown: {shown}</p>`,
    output: <RefDemo />,
  },
  {
    q: 'What is useMemo?',
    level: 'Intermediate',
    a: 'useMemo caches the result of a calculation and only recalculates it when its dependencies change. I use it for expensive work like filtering big lists or heavy math, so unrelated re-renders stay fast. I do not wrap everything in useMemo; I add it when I see a real performance problem.',
    code: `const [limit, setLimit] = useState(10000)
const [dark, setDark] = useState(false)

// Only recalculates when limit changes
const primes = useMemo(() => countPrimes(limit), [limit])

<input type="number" value={limit}
  onChange={(e) => setLimit(Number(e.target.value))} />
<p>Primes up to {limit}: {primes}</p>
<button onClick={() => setDark(!dark)}>Toggle theme</button>`,
    output: <MemoDemo />,
  },
  {
    q: 'What is useCallback?',
    level: 'Intermediate',
    a: 'useCallback returns the same function reference between renders unless its dependencies change. This matters when I pass a function to a child wrapped in React.memo, because a new function each render would make the child re-render anyway. In the demo, typing in the input re-renders the parent but the memoized child stays the same.',
    code: `const Child = memo(function Child({ onClick }) {
  console.log('Child rendered')
  return <button onClick={onClick}>Child button</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const handleClick = useCallback(() => {
    setCount((c) => c + 1)
  }, [])
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>Count: {count}</p>
      <Child onClick={handleClick} />
    </>
  )
}`,
    output: <CallbackDemo />,
  },
  {
    q: 'What is the Context API / useContext?',
    level: 'Intermediate',
    a: 'Context lets me share data like the theme, the logged-in user or the language with many components without passing props through every level. That passing through many levels is called prop drilling. I create a context, wrap the tree in a Provider, and read the value with useContext anywhere below. I avoid putting fast-changing data in context because every consumer re-renders when it changes.',
    code: `const ThemeContext = createContext('light')

function ThemedButton() {
  const theme = useContext(ThemeContext)
  return <button>I am {theme}</button>
}

function Toolbar() {
  return <ThemedButton /> // no theme prop needed
}

function App() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Switch theme
      </button>
    </ThemeContext.Provider>
  )
}`,
    output: <ContextDemo />,
  },
  {
    q: 'What is useReducer?',
    level: 'Intermediate',
    a: 'useReducer is an alternative to useState for more complex state. I write a reducer function that takes the current state and an action and returns the new state, and I call dispatch with an action. I reach for it when many pieces of state change together or the update logic has many cases, because all the logic lives in one place.',
    code: `function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 }
    case 'decrement': return { count: state.count - 1 }
    case 'reset': return { count: 0 }
    default: return state
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 })

<p>Count: {state.count}</p>
<button onClick={() => dispatch({ type: 'decrement' })}>-</button>
<button onClick={() => dispatch({ type: 'increment' })}>+</button>
<button onClick={() => dispatch({ type: 'reset' })}>Reset</button>`,
    output: <ReducerDemo />,
  },
  {
    q: 'What is a custom hook?',
    level: 'Intermediate',
    a: 'A custom hook is a normal function whose name starts with "use" and which calls other hooks. I create one when I see the same stateful logic in more than one component. Each component that uses the hook gets its own separate state, so in the demo the two toggles do not affect each other.',
    code: `function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn((v) => !v), [])
  return [on, toggle]
}

function Menu() {
  const [isOpen, toggleOpen] = useToggle()
  const [isDark, toggleDark] = useToggle(true)
  return (
    <>
      <button onClick={toggleOpen}>Menu: {isOpen ? 'Open' : 'Closed'}</button>
      <button onClick={toggleDark}>Dark mode: {isDark ? 'On' : 'Off'}</button>
    </>
  )
}`,
    output: <CustomHookDemo />,
  },
  {
    q: 'What are the rules of hooks?',
    level: 'Intermediate',
    a: 'There are two rules. First, I only call hooks at the top level of a component or custom hook, never inside loops, conditions or nested functions, because React relies on the call order to match state with each hook. Second, I only call hooks from React function components or custom hooks, not from normal JavaScript functions. The ESLint or oxlint rules-of-hooks rule catches these mistakes for me.',
    code: `// Wrong: hook inside a condition
function Profile({ isAdmin }) {
  if (isAdmin) {
    const [perms, setPerms] = useState([])
  }
}

// Right: call the hook always, use the condition inside
function Profile({ isAdmin }) {
  const [perms, setPerms] = useState([])
  if (!isAdmin) return null
  return <PermList perms={perms} />
}`,
    output: `Wrong version -> lint error:
  React Hook "useState" is called conditionally.
  React Hooks must be called in the exact same
  order in every component render.

Right version -> works: the hook is called on every
render, and the condition only decides what to show.`,
  },
  {
    q: 'What is a lazy initializer in useState?',
    level: 'Intermediate',
    a: 'If the initial value is expensive to compute, like reading localStorage or building a big list, I pass a function to useState instead of the value. React calls that function only on the first render, while useState(readSavedNote()) would run the read on every render and throw the result away. The tip is to pass the function itself, not the result of calling it.',
    code: `function readSavedNote() {
  return localStorage.getItem('demo-note') ?? ''
}

// Runs readSavedNote on EVERY render (wasted work)
const [note, setNote] = useState(readSavedNote())

// Runs it only on the FIRST render
const [note, setNote] = useState(() => readSavedNote())

const handleChange = (e) => {
  setNote(e.target.value)
  localStorage.setItem('demo-note', e.target.value)
}`,
    output: <LazyInitDemo />,
  },
  {
    q: 'Derived state vs duplicated state',
    level: 'Intermediate',
    a: 'If a value can be calculated from existing props or state, I calculate it during render instead of storing it in another useState. Keeping a copy, like a separate total state, means I have to keep it in sync, usually with an effect, and it easily goes out of date. Deriving it keeps one source of truth; if the calculation is expensive I wrap it in useMemo.',
    code: `const [items, setItems] = useState([
  { id: 1, name: 'Pen', price: 10, qty: 2 },
  { id: 2, name: 'Book', price: 150, qty: 1 },
])

// Bad: duplicated state kept in sync by an effect
// const [total, setTotal] = useState(0)
// useEffect(() => setTotal(calc(items)), [items])

// Good: derived during render
const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

const addOne = (id) => setItems(items.map((item) =>
  item.id === id ? { ...item, qty: item.qty + 1 } : item))`,
    output: <DerivedStateDemo />,
  },
  {
    q: 'What are common useEffect mistakes?',
    level: 'Intermediate',
    a: 'The most common ones I watch for are missing dependencies, which give stale values, and setting state that is also a dependency, which creates an infinite loop. Another one is putting an object or array created during render in the dependency array: it is a new reference every render, so the effect runs every time. I fix that by depending on primitive values, moving the object inside the effect, or using useMemo, and I always ask whether I need an effect at all.',
    code: `// 1. Missing dependency -> uses stale userId
useEffect(() => { fetchUser(userId) }, [])
// Fix: [userId]

// 2. Infinite loop: effect updates its own dependency
useEffect(() => { setCount(count + 1) }, [count])
// Fix: update in an event handler instead

// 3. Object dependency: new object every render
const options = { page, size: 10 }
useEffect(() => { load(options) }, [options])
// Fix: depend on primitives
useEffect(() => { load({ page, size: 10 }) }, [page])

// 4. No cleanup for timers or listeners
useEffect(() => {
  window.addEventListener('resize', onResize)
  return () => window.removeEventListener('resize', onResize)
}, [])`,
    output: `1. Missing dep   -> effect never re-runs when userId changes
2. Infinite loop -> render -> effect -> setCount -> render -> ...
                    "Maximum update depth exceeded"
3. Object dep    -> effect runs after EVERY render
4. No cleanup    -> listeners pile up, memory leak`,
  },
  {
    q: 'What is the stale closure problem with setInterval?',
    level: 'Intermediate',
    a: 'A function remembers the variables from the render where it was created. If I start setInterval in an effect with an empty dependency array and call setCount(count + 1), the callback always sees count as 0, so the counter gets stuck at 1. I fix it with a functional update, setCount(c => c + 1), so the callback does not need to read count at all; another option is keeping the latest value in a ref.',
    code: `// Buggy: count is frozen at 0 in this closure
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000)
  return () => clearInterval(id)
}, [])

// Fixed: functional update always gets the latest value
useEffect(() => {
  const id = setInterval(() => setCount((c) => c + 1), 1000)
  return () => clearInterval(id)
}, [])`,
    output: <StaleClosureDemo />,
  },
  {
    q: 'useLayoutEffect vs useEffect?',
    level: 'Intermediate',
    a: 'useEffect runs after the browser has painted the screen, so it does not block the UI, and it is right for most side effects. useLayoutEffect runs after React updates the DOM but before the browser paints, so I use it when I need to measure an element and adjust the layout without a visible flicker, like positioning a tooltip. Because it blocks painting, I use it only when I actually see that flicker.',
    code: `function Tooltip({ targetRect, text }) {
  const ref = useRef(null)
  const [top, setTop] = useState(0)

  useLayoutEffect(() => {
    const height = ref.current.getBoundingClientRect().height
    // place above the target if there is space
    setTop(targetRect.top - height > 0
      ? targetRect.top - height
      : targetRect.bottom)
  }, [targetRect])

  return <div ref={ref} style={{ position: 'absolute', top }}>{text}</div>
}`,
    output: `Order of work after a state change:

1. React renders and updates the DOM
2. useLayoutEffect runs   (measure + fix position)
3. Browser paints         (user sees the final position)
4. useEffect runs

With useEffect instead, the user may briefly see
the tooltip in the wrong place (a flicker).`,
  },
  {
    q: 'What is useId?',
    level: 'Intermediate',
    a: 'useId generates a unique id that stays the same between renders and matches between the server and the client. I use it to connect a label to an input with htmlFor, or for aria attributes, especially in reusable components that may appear many times on a page. I do not use it for list keys; keys should come from the data.',
    code: `function EmailField({ label }) {
  const id = useId()
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="email" />
    </>
  )
}

<EmailField label="Work email" />
<EmailField label="Personal email" /> {/* different id */}`,
    output: <UseIdDemo />,
  },
  {
    q: 'What are useTransition and useDeferredValue?',
    level: 'Intermediate',
    a: 'Both mark some updates as low priority, so typing stays smooth while a slow part of the UI catches up. useTransition gives me startTransition to wrap a state update I control, plus an isPending flag. useDeferredValue gives me a lagging copy of a value I receive; I pass that copy to the slow, memoized component and show a dimmed state while it is stale, like in this demo with a 20,000 item list.',
    code: `const SlowList = memo(function SlowList({ query }) {
  // pretend rendering this list is slow
  const matches = bigList.filter((item) => item.includes(query))
  return <ul>{matches.slice(0, 30).map((i) => <li key={i}>{i}</li>)}</ul>
})

function Search() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <SlowList query={deferredQuery} />
      </div>
    </>
  )
}

// useTransition version:
// const [isPending, startTransition] = useTransition()
// startTransition(() => setFilter(value))`,
    output: <DeferredDemo />,
  },
  {
    q: 'How do you pass a ref to a child? forwardRef vs ref as a prop (React 19)',
    level: 'Intermediate',
    a: 'Before React 19, a function component could not receive ref as a normal prop, so I had to wrap it in forwardRef. In React 19, ref is just a prop: I destructure it and attach it to the inner DOM element. I use this for reusable inputs or buttons where the parent needs to focus or measure the real DOM node.',
    code: `// Before React 19
const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} {...props} />
})

// React 19: ref is a normal prop
function MyInput({ ref, label, ...props }) {
  return (
    <label>
      {label}
      <input ref={ref} {...props} />
    </label>
  )
}

function Parent() {
  const inputRef = useRef(null)
  return (
    <>
      <MyInput ref={inputRef} label="Search" />
      <button onClick={() => inputRef.current.focus()}>Focus input</button>
    </>
  )
}`,
    output: <RefAsPropDemo />,
  },
  {
    q: 'What is useImperativeHandle?',
    level: 'Intermediate',
    a: 'useImperativeHandle lets a child decide exactly what the parent gets through its ref, instead of exposing the whole DOM node. I return an object with only the methods I want, like focus and clear. I use it rarely, for things like inputs, modals or video players; for most cases passing props is the better React way.',
    code: `function FancyInput({ ref }) {
  const inputRef = useRef(null)
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = '' },
  }), [])
  return <input ref={inputRef} />
}

function Parent() {
  const fancyRef = useRef(null)
  return (
    <>
      <FancyInput ref={fancyRef} />
      <button onClick={() => fancyRef.current.focus()}>Focus</button>
      <button onClick={() => fancyRef.current.clear()}>Clear</button>
    </>
  )
}`,
    output: <ImperativeDemo />,
  },
  {
    q: 'How do you cancel a fetch in useEffect with AbortController?',
    level: 'Intermediate',
    a: 'I create an AbortController inside the effect, pass controller.signal to fetch, and call controller.abort() in the cleanup. When the id changes or the component unmounts, the old request is really cancelled, not just ignored, so it cannot overwrite newer data. In the catch I check err.name === \'AbortError\' so a cancelled request is not shown to the user as an error.',
    code: `// Fake API that supports a signal, like fetch(url, { signal })
function fakeFetch(id, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve({ id, title: 'Post #' + id }), 1000)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

function Post() {
  const [postId, setPostId] = useState(1)
  const [result, setResult] = useState({ id: null, post: null })
  const [log, setLog] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    fakeFetch(postId, controller.signal)
      .then((post) => setResult({ id: postId, post }))
      .catch((err) => {
        if (err.name === 'AbortError')
          setLog((l) => [...l, 'cancelled request ' + postId].slice(-3))
      })
    return () => controller.abort() // cancel on change or unmount
  }, [postId])

  const loading = result.id !== postId
  return (
    <>
      {[1, 2, 3].map((id) => (
        <button key={id} onClick={() => setPostId(id)}>Post {id}</button>
      ))}
      <p>{loading ? 'Loading...' : result.post.title}</p>
      <p>{log.join(', ')}</p>
    </>
  )
}`,
    output: <AbortFetchDemo />,
  },
  {
    q: 'How do you write a useLocalStorage custom hook?',
    level: 'Intermediate',
    a: 'The hook works like useState but also saves the value to localStorage. I read the saved value once with a lazy initializer and JSON.parse, and write it back with JSON.stringify in an effect whenever the key or value changes. I wrap the storage calls in try/catch, because storage can be full or blocked in private mode, and the hook should then just work in memory.',
    code: `function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or blocked
    }
  }, [key, value])

  return [value, setValue]
}

function Settings() {
  const [name, setName] = useLocalStorage('demo-name', '')
  const [dark, setDark] = useLocalStorage('demo-dark', false)
  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <label>
        <input type="checkbox" checked={dark}
          onChange={(e) => setDark(e.target.checked)} />
        Dark mode
      </label>
      <p>Hello {name || 'guest'}, dark mode is {dark ? 'on' : 'off'}</p>
    </>
  )
}`,
    output: <LocalStorageHookDemo />,
  },
  {
    q: 'How do you close a dropdown when the user clicks outside? (useOnClickOutside)',
    level: 'Intermediate',
    a: 'I put a ref on the dropdown wrapper and add a mousedown listener on the document inside an effect. If the click target is not inside ref.current, I call the close handler, and the cleanup removes the listener. I wrap the handler in useCallback so the effect does not re-subscribe on every render, and I usually close on the Escape key too.',
    code: `function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

function Dropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useOnClickOutside(ref, close)

  return (
    <div ref={ref} style={{ display: 'inline-block' }}>
      <button onClick={() => setOpen(!open)}>Menu</button>
      {open && (
        <ul>
          <li>Profile</li>
          <li>Settings</li>
          <li>Logout</li>
        </ul>
      )}
    </div>
  )
}`,
    output: <ClickOutsideDemo />,
  },
  {
    q: 'How do you build a textarea with a character counter?',
    level: 'Intermediate',
    a: 'In React a textarea is controlled just like an input: I pass value and onChange instead of putting text between the tags. The remaining count is derived from text.length during render, so I do not need a second state for it. I also set maxLength so the browser blocks extra typing, and change the color when the user gets close to the limit.',
    code: `const MAX = 100

function Bio() {
  const [text, setText] = useState('')
  const left = MAX - text.length // derived, not stored
  return (
    <>
      <textarea value={text} maxLength={MAX} rows={4}
        onChange={(e) => setText(e.target.value)} />
      <p style={{ color: left < 10 ? 'crimson' : 'gray' }}>
        {left} characters left
      </p>
      <button disabled={!text.trim()}>Save</button>
    </>
  )
}`,
    output: <CharCounterDemo />,
  },
  {
    q: 'How do you build dependent dropdowns (country and city)?',
    level: 'Intermediate',
    a: 'I keep only the selected country and city in state, and derive the list of city options from the country during render. When the country changes, I reset the city in the same change handler, not in a useEffect, so there is no extra render and no invalid city left behind. I also disable the second select until the first one has a value.',
    code: `const CITIES = {
  India: ['Kochi', 'Bengaluru', 'Mumbai'],
  USA: ['New York', 'Austin'],
  UK: ['London', 'Leeds'],
}

function Location() {
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')

  const changeCountry = (e) => {
    setCountry(e.target.value)
    setCity('') // reset the child in the same event
  }

  return (
    <>
      <select value={country} onChange={changeCountry}>
        <option value="">Select country</option>
        {Object.keys(CITIES).map((c) => <option key={c}>{c}</option>)}
      </select>
      <select value={city} disabled={!country}
        onChange={(e) => setCity(e.target.value)}>
        <option value="">Select city</option>
        {(CITIES[country] || []).map((c) => <option key={c}>{c}</option>)}
      </select>
      <p>{city ? city + ', ' + country : 'Nothing selected'}</p>
    </>
  )
}`,
    output: <DependentSelectDemo />,
  },
  {
    q: 'How do you paginate a list?',
    level: 'Intermediate',
    a: 'I keep only the current page number in state and derive the rest: the total pages with Math.ceil and the visible items with slice. Prev and Next are disabled at the edges so the page can never go out of range. With a real API I send page and limit to the server instead of slicing, and I often keep the page in the URL so refresh and the back button work.',
    code: `const ITEMS = Array.from({ length: 23 }, (_, i) => 'Item ' + (i + 1))
const PAGE_SIZE = 5

function PagedList() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(ITEMS.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const visible = ITEMS.slice(start, start + PAGE_SIZE)

  return (
    <>
      <ul>{visible.map((item) => <li key={item}>{item}</li>)}</ul>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button key={n} onClick={() => setPage(n)}
          style={{ fontWeight: n === page ? 'bold' : 'normal' }}>
          {n}
        </button>
      ))}
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      <p>Page {page} of {totalPages}</p>
    </>
  )
}`,
    output: <PaginationDemo />,
  },
  {
    q: 'How do you build a list with search, filter and sort?',
    level: 'Intermediate',
    a: 'I keep only the inputs in state, the query, the category and the sort key, and derive the visible list in one chain: filter, filter, then sort. I never store the filtered list in state, because it would get out of sync with the source data. filter returns a new array, so sorting it does not mutate the original; for big lists I wrap the chain in useMemo, and with an API I send these values as query params.',
    code: `const PRODUCTS = [
  { id: 1, name: 'Laptop', category: 'tech', price: 900 },
  { id: 2, name: 'Phone', category: 'tech', price: 600 },
  { id: 3, name: 'Desk', category: 'home', price: 200 },
  { id: 4, name: 'Lamp', category: 'home', price: 40 },
  { id: 5, name: 'Headphones', category: 'tech', price: 150 },
]

function ProductList() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('name')

  const visible = PRODUCTS
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter((p) => category === 'all' || p.category === category)
    .sort((a, b) =>
      sort === 'name' ? a.name.localeCompare(b.name) : a.price - b.price)

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="tech">Tech</option>
        <option value="home">Home</option>
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="name">Sort by name</option>
        <option value="price">Sort by price</option>
      </select>
      <ul>
        {visible.map((p) => <li key={p.id}>{p.name} - Rs {p.price}</li>)}
      </ul>
      {visible.length === 0 && <p>No products found</p>}
    </>
  )
}`,
    output: <SearchFilterSortDemo />,
  },
  {
    q: 'How do you build an accessible modal that closes on Escape and manages focus?',
    level: 'Intermediate',
    a: 'When the modal opens I move focus into it, and when it closes I give focus back to the button that opened it, so keyboard users do not get lost. I listen for the Escape key on the document in an effect and remove the listener in the cleanup. I add role="dialog", aria-modal and aria-labelledby, and render it in a portal; the native <dialog> element with showModal() also gives me much of this for free.',
    code: `function Dialog({ onClose }) {
  const cancelRef = useRef(null)

  useEffect(() => {
    const previous = document.activeElement
    cancelRef.current.focus() // move focus into the dialog
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus() // give focus back to the opener
    }
  }, [onClose])

  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="box" role="dialog" aria-modal="true"
        aria-labelledby="dlg-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="dlg-title">Delete file?</h2>
        <p>This cannot be undone.</p>
        <button ref={cancelRef} onClick={onClose}>Cancel</button>
        <button onClick={onClose}>Delete</button>
      </div>
    </div>,
    document.body
  )
}

function App() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <button onClick={() => setOpen(true)}>Delete file</button>
      {open && <Dialog onClose={close} />}
    </>
  )
}`,
    output: <AccessibleModalDemo />,
  },
  {
    q: 'How do you build a stopwatch with start, stop and reset?',
    level: 'Intermediate',
    a: 'I keep the elapsed time and a running flag in state, and start a setInterval in an effect only while running is true; the cleanup clears it on stop or unmount. I calculate the time from Date.now() and a start time kept in a ref, instead of adding 50 ms per tick, because intervals are not exact and the time would drift. Reset simply stops the timer and sets the time back to 0.',
    code: `function Stopwatch() {
  const [ms, setMs] = useState(0)
  const [running, setRunning] = useState(false)
  const startRef = useRef(0)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setMs(Date.now() - startRef.current), 50)
    return () => clearInterval(id)
  }, [running])

  const start = () => {
    startRef.current = Date.now() - ms // continue from paused time
    setRunning(true)
  }
  const stop = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    setMs(0)
  }

  return (
    <>
      <h2>{(ms / 1000).toFixed(2)}s</h2>
      {running
        ? <button onClick={stop}>Stop</button>
        : <button onClick={start}>Start</button>}
      <button onClick={reset}>Reset</button>
    </>
  )
}`,
    output: <StopwatchDemo />,
  },
  {
    q: 'How do you build a global store with Context and useReducer?',
    level: 'Intermediate',
    a: 'I put useReducer in a Provider component and share both the state and dispatch through context. Any component below can read the state or dispatch an action with a small custom hook like useCart, without prop drilling. It is basically a tiny Redux built into React; for larger apps with frequent updates I split the context or move to Zustand or Redux Toolkit to avoid extra re-renders.',
    code: `const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': return [...state, action.item]
    case 'clear': return []
    default: return state
  }
}

function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  return (
    <CartContext.Provider value={{ items, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

function useCart() {
  return useContext(CartContext)
}

function ProductButton({ name }) {
  const { dispatch } = useCart()
  return (
    <button onClick={() => dispatch({ type: 'add', item: name })}>
      Add {name}
    </button>
  )
}

function CartSummary() {
  const { items, dispatch } = useCart()
  return (
    <p>
      Cart ({items.length}): {items.join(', ') || 'empty'}
      <button onClick={() => dispatch({ type: 'clear' })}>Clear</button>
    </p>
  )
}

function App() {
  return (
    <CartProvider>
      <CartSummary />
      <ProductButton name="Pen" />
      <ProductButton name="Book" />
    </CartProvider>
  )
}`,
    output: <GlobalStoreDemo />,
  },
  {
    q: 'If useState can do everything, why do we need useReducer?',
    level: 'Intermediate',
    a: 'Both manage state, and anything I can do with one I can do with the other, so I choose by how complex the update logic is, not by capability. useReducer moves all the state transitions into one pure reducer function, and components only dispatch actions like add or reset, which is easier to read, test and keep consistent when several values change together under business rules. dispatch is also stable between renders, so I can pass it down to children without useCallback. For one or two independent values, useState stays simpler.',
    code: `// useState: the rules live inside each handler
function QtyWithState() {
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const add = () => {
    if (qty >= 5) { setError('Max 5 per order'); return }
    setQty(qty + 1)
    setError('')
  }
  const remove = () => {
    if (qty <= 1) { setError('At least 1 item'); return }
    setQty(qty - 1)
    setError('')
  }
  return (
    <div>
      <button onClick={remove}>-</button> Qty: {qty}
      <button onClick={add}>+</button>
      <p className="error">{error}</p>
    </div>
  )
}

// useReducer: all transitions in one pure, testable function
function qtyReducer(state, action) {
  switch (action.type) {
    case 'add':
      return state.qty >= 5
        ? { ...state, error: 'Max 5 per order' }
        : { qty: state.qty + 1, error: '' }
    case 'remove':
      return state.qty <= 1
        ? { ...state, error: 'At least 1 item' }
        : { qty: state.qty - 1, error: '' }
    case 'reset':
      return { qty: 1, error: '' }
    default:
      return state
  }
}

function QtyWithReducer() {
  const [state, dispatch] = useReducer(qtyReducer, { qty: 1, error: '' })
  return (
    <div>
      <button onClick={() => dispatch({ type: 'remove' })}>-</button>
      Qty: {state.qty}
      <button onClick={() => dispatch({ type: 'add' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <p className="error">{state.error}</p>
    </div>
  )
}

function App() {
  return (
    <>
      <QtyWithState />
      <QtyWithReducer />
    </>
  )
}`,
    output: <StateVsReducerDemo />,
  },
  {
    q: 'When should you use useCallback (and when not)?',
    level: 'Intermediate',
    a: 'I use useCallback in three cases: when I pass a function to a child wrapped in React.memo, when a function is a dependency of a useEffect so the effect does not re-run after every render or loop, and when a custom hook returns functions that its users may put in their own dependencies. In the demo, the effect that depends on an inline function runs on every render, while the useCallback one runs only when query changes. I do not wrap every handler, because useCallback itself costs memory and comparisons and gives nothing when the child is cheap or not memoized.',
    code: `function Results({ fetchResults, label }) {
  const runs = useRef(0)
  const out = useRef(null)
  useEffect(() => {
    runs.current += 1
    fetchResults()
    out.current.textContent = label + ': effect ran ' + runs.current + ' times'
  }, [fetchResults, label])
  return <p ref={out} />
}

function App() {
  const [query, setQuery] = useState('react')
  const [theme, setTheme] = useState('light')

  // new function every render -> effect re-runs every render
  const inlineFetch = () => console.log('fetch', query)

  // same function until query changes
  const stableFetch = useCallback(() => console.log('fetch', query), [query])

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme ({theme})
      </button>
      <Results label="Inline function" fetchResults={inlineFetch} />
      <Results label="useCallback" fetchResults={stableFetch} />
    </>
  )
}`,
    output: <CallbackEffectDemo />,
  },
  {
    q: 'useEffect vs useCallback: what is the difference?',
    level: 'Intermediate',
    a: 'They solve different problems. useEffect runs code after the render is committed, for side effects like fetching, subscriptions or timers, and it can return a cleanup. useCallback runs nothing by itself; it only returns the same function reference between renders until its dependencies change. They are often used together: I wrap a function in useCallback so I can safely list it as a useEffect dependency.',
    code: `function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  // useCallback: remembers the function, does NOT call it
  const loadUser = useCallback(() => {
    return fetch('/api/users/' + userId).then((r) => r.json())
  }, [userId])

  // useEffect: actually runs the side effect after render
  useEffect(() => {
    let ignore = false
    loadUser().then((data) => {
      if (!ignore) setUser(data)
    })
    return () => { ignore = true }
  }, [loadUser]) // re-runs only when userId changes

  return <button onClick={loadUser}>Reload</button>
}`,
    output: `                 useEffect                    useCallback
Purpose          run a side effect            keep the same function
When it runs     after render (commit)        never runs your code itself
Returns          optional cleanup function    the memoized function
Typical use      fetch, timers, listeners     memo children, effect deps

Together: useCallback makes loadUser stable,
so useEffect([loadUser]) does not run after every render.`,
  },
  {
    q: 'How do you validate inputs: real-time, on blur, or on submit?',
    level: 'Intermediate',
    a: 'I mix the three. Real-time validation on every change is good for helpful hints like a password length counter, but showing red errors while someone is still typing their email is annoying. So I show a field error only after the field is touched, on blur, and once it is shown I let it update in real time so it disappears as soon as the value is fixed. On submit I always validate everything and mark all fields as touched, because the user may never have visited some fields.',
    code: `function validate(values) {
  const errors = {}
  if (!/^\\S+@\\S+\\.\\S+$/.test(values.email)) errors.email = 'Enter a valid email'
  if (values.password.length < 8) errors.password = 'At least 8 characters'
  return errors
}

function SignupForm() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const errors = validate(values) // derived on every render

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setSubmitted(false)
  }
  // On blur: the field counts as touched from now on
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true })
  // On submit: validate and show everything
  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    setSubmitted(Object.keys(errors).length === 0)
  }
  const show = (name) => touched[name] && errors[name]

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input name="email" value={values.email} placeholder="Email"
        onChange={handleChange} onBlur={handleBlur} />
      {show('email') && <p className="error">{errors.email}</p>}

      <input name="password" type="password" value={values.password}
        placeholder="Password" onChange={handleChange} onBlur={handleBlur} />
      {/* Real-time hint while typing */}
      <p>{values.password.length}/8 characters</p>
      {show('password') && <p className="error">{errors.password}</p>}

      <button type="submit">Sign up</button>
      {submitted && <p>Signed up!</p>}
    </form>
  )
}`,
    output: <ValidationTimingDemo />,
  },

  // ---------- Advanced ----------
  {
    q: 'When does a component re-render?',
    level: 'Advanced',
    a: 'A component re-renders when its own state changes, when its parent re-renders, or when a context it uses changes. Note that a child re-renders when the parent does, even if its props did not change. Re-rendering is usually cheap; I only optimize with React.memo when it actually causes slowness.',
    code: `function Child() {
  console.log('Child rendered')
  return <p>Child</p>
}

function Parent() {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Parent count: {count}
      </button>
      <Child /> {/* re-renders on every click */}
    </>
  )
}`,
    output: <RerenderDemo />,
  },
  {
    q: 'What is React.memo?',
    level: 'Advanced',
    a: 'React.memo wraps a component and skips re-rendering it when its props are the same as last time (it does a shallow comparison). It is useful for components that render often with the same props or are expensive to render. If I pass objects or functions as props, I also need useMemo or useCallback, otherwise the props look new every time.',
    code: `const MemoUser = memo(function MemoUser({ name }) {
  return <p>User: {name}</p>
})

function PlainUser({ name }) {
  return <p>User: {name}</p>
}

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <MemoUser name="Anu" />  {/* skips re-render */}
      <PlainUser name="Anu" /> {/* re-renders */}
    </>
  )
}`,
    output: <ReactMemoDemo />,
  },
  {
    q: 'How do lifecycle methods map to hooks?',
    level: 'Advanced',
    a: 'With hooks I think in terms of effects rather than lifecycle methods. useEffect with [] works like componentDidMount, an effect with dependencies works like componentDidUpdate for those values, and the cleanup function works like componentWillUnmount. This keeps related setup and cleanup code together in one place.',
    code: `function Profile({ userId }) {
  useEffect(() => {
    console.log('Mounted')            // componentDidMount
    return () => console.log('Unmounted') // componentWillUnmount
  }, [])

  useEffect(() => {
    console.log('userId changed:', userId) // componentDidUpdate
  }, [userId])

  return <p>User {userId}</p>
}`,
    output: `// <Profile userId={1} /> mounts
Mounted
userId changed: 1

// parent changes userId to 2
userId changed: 2

// <Profile /> is removed
Unmounted`,
  },
  {
    q: 'What are error boundaries?',
    level: 'Advanced',
    a: 'An error boundary is a component that catches JavaScript errors in its child tree during rendering and shows a fallback UI instead of a blank screen. They still have to be class components using getDerivedStateFromError and componentDidCatch. They do not catch errors in event handlers or async code, so I use try/catch there. In the demo, the counter throws at 3 and the boundary shows a fallback.',
    code: `class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error, info) {
    console.log('Logged error:', error.message)
  }
  render() {
    if (this.state.hasError) return <p>Something went wrong.</p>
    return this.props.children
  }
}

function BuggyCounter() {
  const [count, setCount] = useState(0)
  if (count === 3) throw new Error('Crashed at 3!')
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}

<ErrorBoundary><BuggyCounter /></ErrorBoundary>`,
    output: <ErrorBoundaryDemo />,
  },
  {
    q: 'What is lazy loading with React.lazy and Suspense?',
    level: 'Advanced',
    a: 'React.lazy lets me load a component only when it is first needed, which splits it into a separate JavaScript file and makes the first page load smaller. I wrap lazy components in Suspense and give it a fallback to show while the code is downloading. I mostly use it for routes and heavy components like charts or editors.',
    code: `import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./Dashboard'))

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Dashboard />
    </Suspense>
  )
}`,
    output: `First render:
  "Loading..."   (Dashboard chunk is downloading)

After the chunk loads:
  <Dashboard /> is shown

Network tab: a separate file like Dashboard-abc123.js
is fetched only when Dashboard is first rendered.`,
  },
  {
    q: 'What are portals?',
    level: 'Advanced',
    a: 'A portal renders a component into a different DOM node, usually document.body, while it still stays part of the same React tree. I use portals for modals, tooltips and dropdowns so they are not clipped by a parent with overflow: hidden or a z-index. Events still bubble through the React tree as if the portal was in its normal place.',
    code: `function Modal({ onClose }) {
  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="box" onClick={(e) => e.stopPropagation()}>
        <p>I am rendered inside document.body</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  )
}

const [open, setOpen] = useState(false)
<button onClick={() => setOpen(true)}>Open modal</button>
{open && <Modal onClose={() => setOpen(false)} />}`,
    output: <PortalDemo />,
  },
  {
    q: 'Why do effects run twice in StrictMode?',
    level: 'Advanced',
    a: 'In development, StrictMode mounts each component, unmounts it, and mounts it again, so effects run, clean up, and run again. React does this on purpose to help me find effects that are missing a cleanup. It only happens in development, not in production. If my effect breaks when it runs twice, the fix is to add a proper cleanup, not to remove StrictMode.',
    code: `<StrictMode>
  <App />
</StrictMode>

function Chat() {
  useEffect(() => {
    console.log('connect')
    return () => console.log('disconnect')
  }, [])
  return <p>Chat</p>
}`,
    output: `Development (StrictMode):
  connect
  disconnect
  connect

Production:
  connect`,
  },
  {
    q: 'Why should state be immutable? How do you update arrays and objects?',
    level: 'Advanced',
    a: 'React decides whether to re-render by checking if the state is a new reference. If I mutate an array with push or change an object property directly, the reference stays the same and React may not update the screen. So I always create a new copy: spread, map and filter for arrays, and spread for objects.',
    code: `const [todos, setTodos] = useState(['Learn React'])
const [user, setUser] = useState({ name: 'Anu', age: 22 })

// Wrong: todos.push('x'); user.age++

// Right: create new copies
const addTodo = () => setTodos([...todos, 'Task ' + (todos.length + 1)])
const removeFirst = () => setTodos(todos.filter((_, i) => i !== 0))
const birthday = () => setUser({ ...user, age: user.age + 1 })`,
    output: <ImmutabilityDemo />,
  },
  {
    q: 'What is batching in React?',
    level: 'Advanced',
    a: 'Batching means React groups several state updates into a single re-render instead of rendering after each one. Since React 18 this happens automatically everywhere, including inside setTimeout, promises and native event handlers. In the demo, each click updates two pieces of state but the render count goes up only by one.',
    code: `const [count, setCount] = useState(0)
const [flag, setFlag] = useState(false)

const handleClick = () => {
  setCount((c) => c + 1)
  setFlag((f) => !f)
  // only ONE re-render
}

const handleLater = () => {
  setTimeout(() => {
    setCount((c) => c + 1)
    setFlag((f) => !f)
    // also ONE re-render (React 18+)
  }, 300)
}`,
    output: <BatchingDemo />,
  },
  {
    q: 'What is reconciliation and how does the key prop affect it?',
    level: 'Advanced',
    a: 'Reconciliation is the process where React compares the new element tree with the old one to decide what to update. If the type and key of an element stay the same, React keeps the component and its state; if the key changes, React throws the old one away and creates a fresh one. I use this on purpose to reset a form: giving it key={userId} resets its state when the user changes.',
    code: `function NameInput({ label }) {
  const [text, setText] = useState('')
  return (
    <>
      <p>{label}</p>
      <input value={text} onChange={(e) => setText(e.target.value)} />
    </>
  )
}

const [user, setUser] = useState('Anu')
<button onClick={() => setUser('Anu')}>Anu</button>
<button onClick={() => setUser('Ravi')}>Ravi</button>

{/* new key = new component = fresh state */}
<NameInput key={user} label={'Note for ' + user} />`,
    output: <KeyResetDemo />,
  },
  {
    q: 'HOCs vs custom hooks?',
    level: 'Advanced',
    a: 'A Higher-Order Component is a function that takes a component and returns a new component with extra props or behavior. A custom hook shares the same logic but just returns values, without wrapping anything. Today I prefer custom hooks because they are simpler, avoid "wrapper hell" in the component tree, and make it clear where each value comes from.',
    code: `// HOC
function withCounter(Wrapped) {
  return function WithCounter(props) {
    const [count, setCount] = useState(0)
    return <Wrapped {...props} count={count}
      increment={() => setCount(count + 1)} />
  }
}
const ClickButton = withCounter(({ count, increment }) => (
  <button onClick={increment}>HOC clicks: {count}</button>
))

// Custom hook
function useCounter() {
  const [count, setCount] = useState(0)
  return { count, increment: () => setCount(count + 1) }
}
function HookButton() {
  const { count, increment } = useCounter()
  return <button onClick={increment}>Hook clicks: {count}</button>
}`,
    output: <HocVsHookDemo />,
  },
  {
    q: 'React Router basics',
    level: 'Advanced',
    a: 'React Router lets me map URLs to components in a single-page app without reloading the page. I wrap the app in BrowserRouter, define Routes with a path and an element, and use Link instead of <a> so navigation stays on the client. For dynamic parts like /users/5 I use a route param and read it with useParams.',
    code: `import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom'

function User() {
  const { id } = useParams()
  return <p>User id: {id}</p>
}

<BrowserRouter>
  <Link to="/">Home</Link> | <Link to="/users/5">User 5</Link>
  <Routes>
    <Route path="/" element={<p>Home page</p>} />
    <Route path="/users/:id" element={<User />} />
    <Route path="*" element={<p>Not found</p>} />
  </Routes>
</BrowserRouter>`,
    output: `URL /          -> "Home page"
URL /users/5   -> "User id: 5"
URL /abc       -> "Not found"

Clicking a Link changes the URL without a full page reload.`,
  },
  {
    q: 'How do you fetch data in useEffect with loading and error states?',
    level: 'Advanced',
    a: 'I run the request inside useEffect with the id in the dependency array, and store the result or the error in state when it finishes. I use an ignore flag in the cleanup so a slow old response cannot overwrite a newer one (a race condition). Here I derive loading from whether the stored result matches the current id. In real projects I often use a library like TanStack Query, which handles caching and retries for me.',
    code: `const [userId, setUserId] = useState(1)
const [result, setResult] = useState({ id: null, data: null, error: null })

useEffect(() => {
  let ignore = false
  fakeFetchUser(userId) // resolves after 800ms, fails for id 4
    .then((data) => {
      if (!ignore) setResult({ id: userId, data, error: null })
    })
    .catch((err) => {
      if (!ignore) setResult({ id: userId, data: null, error: err.message })
    })
  return () => { ignore = true }
}, [userId])

const loading = result.id !== userId

{loading && <p>Loading...</p>}
{!loading && result.error && <p>Error: {result.error}</p>}
{!loading && result.data && <p>Name: {result.data.name}</p>}`,
    output: <FetchDemo />,
  },
  {
    q: 'How do you build a debounced search input?',
    level: 'Advanced',
    a: 'Debouncing means waiting until the user stops typing for a short time before running the search, so I do not filter or call an API on every keystroke. I write a useDebounce hook that starts a timer in useEffect and clears it in the cleanup whenever the value changes. Only when the user pauses for the delay does the debounced value update.',
    code: `function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

function Search() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const results = fruits.filter((f) =>
    f.toLowerCase().includes(debouncedQuery.toLowerCase()))
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{results.map((f) => <li key={f}>{f}</li>)}</ul>
    </>
  )
}`,
    output: <DebounceDemo />,
  },
  {
    q: 'Why is using the index as a key a problem when reordering a list?',
    level: 'Advanced',
    a: 'With key={index}, React matches items by position, so after reordering it reuses the same component and DOM node for a different item. Anything kept inside that item, like input text, focus or local state, stays in the old position and ends up next to the wrong data. In the demo, after reversing, the index-keyed inputs no longer match their labels, while the id-keyed ones move correctly.',
    code: `const [items, setItems] = useState([
  { id: 'a', name: 'Apple' },
  { id: 'b', name: 'Banana' },
  { id: 'c', name: 'Cherry' },
])

<button onClick={() => setItems([...items].reverse())}>Reverse list</button>

// Wrong: key = index
{items.map((item, index) => (
  <li key={index}>
    {item.name} <input defaultValue={item.name} />
  </li>
))}

// Right: key = stable id
{items.map((item) => (
  <li key={item.id}>
    {item.name} <input defaultValue={item.name} />
  </li>
))}`,
    output: <ReorderKeysDemo />,
  },
  {
    q: 'What are Actions and useActionState in React 19?',
    level: 'Advanced',
    a: 'In React 19 I can pass an async function directly to a form action prop, and React handles the pending state and errors for me. useActionState wraps that function: it gives me the latest returned state, a formAction to pass to the form, and an isPending flag. The action receives the previous state and the FormData, so I do not need a useState for every field or manual loading flags.',
    code: `async function addToCart(prevState, formData) {
  await wait(800) // pretend server call
  const qty = Number(formData.get('qty'))
  if (!qty || qty < 1) {
    return { error: 'Quantity must be at least 1', count: prevState.count }
  }
  return { error: null, count: prevState.count + qty }
}

function Cart() {
  const [state, formAction, isPending] =
    useActionState(addToCart, { error: null, count: 0 })
  return (
    <form action={formAction}>
      <input name="qty" type="number" defaultValue="1" />
      <button disabled={isPending}>
        {isPending ? 'Adding...' : 'Add to cart'}
      </button>
      {state.error && <p>{state.error}</p>}
      <p>Items in cart: {state.count}</p>
    </form>
  )
}`,
    output: <ActionStateDemo />,
  },
  {
    q: 'What is useOptimistic?',
    level: 'Advanced',
    a: 'useOptimistic lets me show the expected result immediately while the real request is still running, like showing a sent message or a liked heart right away. I give it the real state and an update function, and call addOptimistic inside an action. When the action finishes, React drops the optimistic value and shows the real state, so if the request fails the UI goes back automatically.',
    code: `const [messages, setMessages] = useState([{ id: 1, text: 'Hi there!' }])
const [optimisticMessages, addOptimistic] = useOptimistic(
  messages,
  (state, text) => [...state, { id: 'temp', text, sending: true }]
)

const sendAction = async (formData) => {
  const text = formData.get('text')
  addOptimistic(text)          // shows instantly
  await wait(1500)             // pretend server call
  startTransition(() => {
    setMessages((m) => [...m, { id: Date.now(), text }])
  })
}

<ul>
  {optimisticMessages.map((m) => (
    <li key={m.id}>{m.text} {m.sending && <small>(sending...)</small>}</li>
  ))}
</ul>
<form action={sendAction}>
  <input name="text" />
  <button type="submit">Send</button>
</form>`,
    output: <OptimisticDemo />,
  },
  {
    q: 'Server Components vs Client Components?',
    level: 'Advanced',
    a: 'Server Components run only on the server, so they can read the database or files directly and send zero JavaScript for themselves to the browser. Client Components are marked with "use client" and are the ones that can use state, effects and event handlers. My rule is to keep components on the server by default and push "use client" down to the small interactive leaves, like a like button. They need a framework such as Next.js; a plain Vite app like this one only has client components.',
    code: `// app/posts/page.jsx  (Server Component, default)
import LikeButton from './LikeButton'

export default async function PostsPage() {
  const posts = await db.post.findMany() // direct DB access
  return posts.map((post) => (
    <article key={post.id}>
      <h2>{post.title}</h2>
      <LikeButton postId={post.id} />
    </article>
  ))
}

// app/posts/LikeButton.jsx  (Client Component)
'use client'
export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>{liked ? 'Liked' : 'Like'}</button>
}`,
    output: `Server Component (PostsPage):
  - runs on the server, can be async, can use db / secrets
  - no useState / useEffect / onClick
  - its code is NOT sent to the browser

Client Component (LikeButton):
  - "use client" at the top
  - hooks and event handlers work
  - its JavaScript is shipped and hydrated in the browser`,
  },
  {
    q: 'What is the compound components pattern?',
    level: 'Advanced',
    a: 'Compound components are a group of components that work together and share state through a context, like Tabs, Tabs.Tab and Tabs.Panel. The parent owns the state, and the children read it with useContext, so the user of the component controls the layout with simple JSX instead of passing a big config object. Libraries like Radix UI and Headless UI use this pattern a lot.',
    code: `const TabsContext = createContext(null)

function Tabs({ defaultTab, children }) {
  const [active, setActive] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  )
}

function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsContext)
  return <button className={active === id ? 'active' : ''}
    onClick={() => setActive(id)}>{children}</button>
}

function TabPanel({ id, children }) {
  const { active } = useContext(TabsContext)
  return active === id ? <div>{children}</div> : null
}

Tabs.Tab = Tab
Tabs.Panel = TabPanel

<Tabs defaultTab="profile">
  <Tabs.Tab id="profile">Profile</Tabs.Tab>
  <Tabs.Tab id="settings">Settings</Tabs.Tab>
  <Tabs.Panel id="profile">Name: Anu</Tabs.Panel>
  <Tabs.Panel id="settings">Theme: Dark</Tabs.Panel>
</Tabs>`,
    output: <CompoundDemo />,
  },
  {
    q: 'What is the render props pattern?',
    level: 'Advanced',
    a: 'A render prop is a prop whose value is a function that returns JSX. The component handles the logic, like tracking the mouse, and calls that function with its data, so the parent decides what to render. Custom hooks have replaced most render props today, but I still see the pattern in libraries, for example in form and list components.',
    code: `function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const handleMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    setPos({
      x: Math.round(e.clientX - box.left),
      y: Math.round(e.clientY - box.top),
    })
  }
  return <div onMouseMove={handleMove}>{render(pos)}</div>
}

<MouseTracker render={({ x, y }) => <p>Mouse at ({x}, {y})</p>} />
<MouseTracker render={({ x }) => <p>{x > 150 ? 'Right side' : 'Left side'}</p>} />`,
    output: <RenderPropsDemo />,
  },
  {
    q: 'Context vs Redux vs Zustand: how do you choose state management?',
    level: 'Advanced',
    a: 'I start with local useState and lifting state up, and use Context for values that change rarely, like the theme, the user or the language. For large shared client state with many updates I pick a store: Redux Toolkit when the team wants strict patterns and great DevTools, or Zustand when I want something tiny with almost no boilerplate. For server data I do not use any of these; I use TanStack Query, which handles caching, refetching and loading states.',
    code: `// Context: simple, but every consumer re-renders on change
const UserContext = createContext(null)
const user = useContext(UserContext)

// Redux Toolkit: slices, actions, DevTools
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: { increment: (state) => { state.value += 1 } },
})
const value = useSelector((s) => s.counter.value)
dispatch(increment())

// Zustand: tiny store, components subscribe to slices
const useStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}))
const count = useStore((s) => s.count)`,
    output: `Local state / lifting up -> state used by one component or a few siblings
Context                 -> theme, auth user, language (rarely changes)
Redux Toolkit           -> big app, many devs, complex updates, DevTools
Zustand                 -> shared state with minimal boilerplate
TanStack Query          -> server data: caching, refetch, loading/error`,
  },
  {
    q: 'How do you optimize performance in a React app?',
    level: 'Advanced',
    a: 'I always measure first with the React DevTools Profiler, so I fix the real slow part instead of guessing. Then I keep state close to where it is used, use React.memo, useMemo and useCallback only where re-renders are expensive, and split code with lazy and Suspense so the first load is smaller. For very long lists I use virtualization with a library like react-window or TanStack Virtual, which renders only the rows visible on screen.',
    code: `// 1. Code splitting per route
const Reports = lazy(() => import('./Reports'))

// 2. Skip re-renders of expensive children
const Row = memo(function Row({ item, onSelect }) { ... })
const handleSelect = useCallback((id) => setSelected(id), [])

// 3. Cache expensive calculations
const sorted = useMemo(() => sortBig(items), [items])

// 4. Virtualize long lists (react-window)
<FixedSizeList height={400} itemCount={10000} itemSize={35} width={300}>
  {({ index, style }) => <div style={style}>Row {index}</div>}
</FixedSizeList>

// 5. Keep urgent updates fast
const deferredQuery = useDeferredValue(query)`,
    output: `Checklist:
  [x] Profile first (React DevTools Profiler)
  [x] Keep state local; avoid big context values
  [x] memo / useMemo / useCallback for expensive parts
  [x] lazy() + Suspense for routes and heavy widgets
  [x] Virtualize long lists: 10,000 rows -> ~15 DOM nodes
  [x] Stable keys, optimize images, production build
  [x] React Compiler can auto-memoize in React 19 apps`,
  },
  {
    q: 'How do you test React components with React Testing Library?',
    level: 'Advanced',
    a: 'React Testing Library tests components the way a user uses them: I render the component, find elements by role, label or text, and fire events with user-event. I avoid testing internal state or implementation details, so refactoring does not break my tests. I run the tests with Vitest or Jest, and for async UI I use findBy queries, which wait for the element to appear.',
    code: `import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from './Counter'

test('increments the count when clicked', async () => {
  const user = userEvent.setup()
  render(<Counter />)

  const button = screen.getByRole('button', { name: /clicked 0 times/i })
  await user.click(button)

  expect(screen.getByRole('button', { name: /clicked 1 times/i }))
    .toBeInTheDocument()
})`,
    output: ` ✓ src/Counter.test.jsx (1)
   ✓ increments the count when clicked

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
  },
  {
    q: 'What is the use() API in React 19, and how does Suspense work for data?',
    level: 'Advanced',
    a: 'use() reads the value of a promise (or a context) during render. If the promise is still pending, the component suspends and the nearest Suspense boundary shows its fallback; when it resolves React renders again with the value, and if it rejects the nearest error boundary catches it. The key rule is that the promise must be created outside render, in an event handler, a router loader or a Server Component, otherwise every render makes a new promise. Unlike hooks, use() can even be called inside an if.',
    code: `// Fake API: resolves after 1 second
function fetchQuote(id) {
  return new Promise((resolve) =>
    setTimeout(() => resolve('Quote #' + id + ': Keep it simple.'), 1000))
}

function Quote({ quotePromise }) {
  const text = use(quotePromise) // suspends until resolved
  return <p>{text}</p>
}

function App() {
  const [id, setId] = useState(1)
  const [quotePromise, setQuotePromise] = useState(() => fetchQuote(1))

  const next = () => {
    setId(id + 1)
    setQuotePromise(fetchQuote(id + 1)) // created in an event, not in render
  }

  return (
    <>
      <button onClick={next}>Next quote</button>
      <Suspense fallback={<p>Loading quote...</p>}>
        <Quote quotePromise={quotePromise} />
      </Suspense>
    </>
  )
}`,
    output: <UsePromiseDemo />,
  },
  {
    q: 'What are Server Actions (Server Functions)?',
    level: 'Advanced',
    a: 'A Server Action is an async function marked with \'use server\' that runs only on the server, but I can call it from the client, for example as a form action. The framework, like Next.js, turns the call into a POST request for me, so I do not write an API route or fetch code. Because it is still a public endpoint, I always validate the input and check auth inside the action, and on the client I use useActionState or useFormStatus to show pending state and errors.',
    code: `// app/actions.js
'use server'

export async function addComment(formData) {
  const text = formData.get('text')
  if (!text) return { error: 'Comment is empty' }
  await db.comment.create({ data: { text } }) // runs on the server
  revalidatePath('/post')
}

// app/post/page.jsx (Server Component)
import { addComment } from '../actions'

export default function PostPage() {
  return (
    <form action={addComment}>
      <input name="text" />
      <button type="submit">Comment</button>
    </form>
  )
}`,
    output: `User submits the form
  -> browser sends a POST with the FormData (no API route written)
  -> addComment runs on the server and writes to the DB
  -> revalidatePath refreshes the page data
  -> the updated comments are sent back to the browser

The form works even before JavaScript has loaded
(progressive enhancement).`,
  },
  {
    q: 'CSR vs SSR vs SSG: what is hydration?',
    level: 'Advanced',
    a: 'With CSR the server sends an almost empty HTML page and JavaScript builds the UI in the browser; that is how this Vite app works, and it is simple but slower for the first paint and SEO. With SSR the server renders HTML on every request, and with SSG the HTML is built once at build time and served from a CDN. Hydration is when React in the browser attaches event handlers to that server HTML to make it interactive; if the server and client render different output I get a hydration mismatch, so I avoid things like Date.now() or window checks during render.',
    code: `// CSR (Vite): index.html only has <div id="root"></div>
createRoot(document.getElementById('root')).render(<App />)

// SSR: the server renders HTML for each request
const html = renderToString(<App />)
res.send('<div id="root">' + html + '</div>')

// Browser: reuse the server HTML and attach events
hydrateRoot(document.getElementById('root'), <App />)

// Causes a hydration mismatch: server and client differ
function Clock() {
  return <p>{new Date().toLocaleTimeString()}</p>
}`,
    output: `       First paint    SEO     Data is fresh      Good for
CSR    slower         weaker  in the browser     dashboards, admin apps
SSR    fast           good    every request      e-commerce, news
SSG    fastest (CDN)  good    at build time      blogs, docs, marketing
ISR    fast           good    rebuilt on a timer Next.js revalidate

Hydration: HTML is visible first, then React makes it interactive.`,
  },
  {
    q: 'Next.js vs Vite: when would you choose each?',
    level: 'Advanced',
    a: 'Vite is a build tool and dev server: it gives me a very fast client-side React app, and I add React Router and a data-fetching library myself. Next.js is a full framework with file-based routing, SSR, SSG, Server Components and Server Actions built in. I pick Vite for dashboards, internal tools and apps behind a login where SEO does not matter, and Next.js when I need SEO, a fast first load, or server-side data access.',
    code: `// Vite + React Router: routes are defined in code
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/posts/:id" element={<Post />} />
</Routes>

// Next.js App Router: routes are folders
// app/page.jsx            -> /
// app/posts/[id]/page.jsx -> /posts/5
export default async function Post({ params }) {
  const { id } = await params
  const post = await getPost(id) // runs on the server
  return <h1>{post.title}</h1>
}`,
    output: `               Vite (SPA)            Next.js
Rendering      CSR                   SSR, SSG, ISR, RSC, CSR
Routing        add React Router      file-based (app/ folder)
Backend code   separate API          Server Actions, route handlers
Dev speed      very fast HMR         fast (Turbopack)
Deploy         any static host       Node / edge server or static export
Best for       dashboards, SPAs      SEO sites, e-commerce, content`,
  },
  {
    q: 'What is concurrent rendering (and React Fiber)?',
    level: 'Advanced',
    a: 'Concurrent rendering means React can start a render, pause it, resume it later, or throw it away if newer input arrives, so an urgent update like typing is never blocked by a slow, non-urgent one. It is not parallel or multi-threaded: everything still runs on the single JavaScript main thread, React just works in small chunks and yields back to the browser between them. This is possible because of Fiber, the internal engine since React 16 that splits the tree into small units of work. It is enabled when I use createRoot (React 18+), and I opt updates into it with useTransition, useDeferredValue and Suspense.',
    code: `function Search() {
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleChange = (e) => {
    setText(e.target.value)        // urgent: the input updates now
    startTransition(() => {
      setQuery(e.target.value)     // low priority, can be interrupted
    })
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      {isPending && <p>Updating...</p>}
      <HugeList query={query} />
    </>
  )
}`,
    output: `Old stack reconciler: renders the whole tree in one go -> input freezes

Fiber + concurrent rendering:
  type "a"  -> urgent render: input shows "a"
            -> transition render of HugeList starts
  type "ab" -> React drops the unfinished work, input shows "ab"
            -> restarts HugeList with "ab"

Result: typing never waits for the slow list.`,
  },
  {
    q: 'Why does React.memo sometimes not help? (inline objects and functions)',
    level: 'Advanced',
    a: 'React.memo compares each prop with Object.is, so an object, array or function created during render is a new value every time, and the memoized child re-renders anyway. Passing style={{ color: \'blue\' }} or onClick={() => ...} to a memo child silently cancels the benefit. I fix it by moving constants outside the component, wrapping functions in useCallback and objects in useMemo, or passing primitive props; the React Compiler can now do this memoization for me.',
    code: `const Child = memo(function Child({ label, style, onClick }) {
  console.log(label + ' rendered')
  return <button style={style} onClick={onClick}>{label}</button>
})

const BLUE = { color: 'blue' } // created once, outside

function Parent() {
  const [count, setCount] = useState(0)
  const handleClick = useCallback(() => console.log('clicked'), [])
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Re-render parent ({count})
      </button>

      {/* new object + new function each render: memo is useless */}
      <Child label="Inline props" style={{ color: 'blue' }}
        onClick={() => console.log('clicked')} />

      {/* same references: re-render is skipped */}
      <Child label="Stable props" style={BLUE} onClick={handleClick} />
    </>
  )
}`,
    output: <MemoPitfallDemo />,
  },
  {
    q: 'How do you make React components accessible?',
    level: 'Advanced',
    a: 'I start with semantic HTML: real buttons instead of clickable divs, labels connected to inputs with htmlFor and useId, and headings in order, which gives keyboard and screen reader support for free. For custom widgets I add ARIA attributes like aria-expanded, aria-invalid and aria-describedby, and role="alert" for error messages. I test with the keyboard only, a screen reader, and tools like axe or the jsx-a11y lint rules.',
    code: `function Faq() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const id = useId()
  const error = email && !email.includes('@') ? 'Email must contain @' : ''

  return (
    <>
      <button aria-expanded={open} aria-controls={id + '-panel'}
        onClick={() => setOpen(!open)}>
        What is your refund policy?
      </button>
      <p id={id + '-panel'} hidden={!open}>30 days, no questions asked.</p>

      <label htmlFor={id + '-email'}>Email</label>
      <input id={id + '-email'} type="email" value={email}
        aria-invalid={!!error} aria-describedby={id + '-error'}
        onChange={(e) => setEmail(e.target.value)} />
      <p id={id + '-error'} role="alert">{error}</p>
    </>
  )
}`,
    output: <A11yDemo />,
  },
  {
    q: 'How does React protect against XSS, and when is dangerouslySetInnerHTML risky?',
    level: 'Advanced',
    a: 'React escapes every value I render with curly braces, so a string like <img onerror=...> shows up as plain text and never runs. The risk is dangerouslySetInnerHTML, which inserts raw HTML, so I only use it with HTML I trust or after sanitizing it with a library like DOMPurify. I also watch out for javascript: URLs in href built from user input, and never pass user input to eval.',
    code: `function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function Comment() {
  const [text, setText] = useState('<img src=x onerror="alert(1)"> Hello')
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />

      {/* Safe: React escapes it, the tags show as text */}
      <p>{text}</p>

      {/* The HTML React actually writes */}
      <code>{escapeHtml(text)}</code>

      {/* Dangerous: would run the onerror script */}
      {/* <p dangerouslySetInnerHTML={{ __html: text }} /> */}

      {/* If you must, sanitize first */}
      {/* <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} /> */}
    </>
  )
}`,
    output: <XssDemo />,
  },
  {
    q: 'How do environment variables work in Vite?',
    level: 'Advanced',
    a: 'Vite loads variables from .env files but exposes only the ones starting with VITE_ to my code, through import.meta.env instead of process.env. They are replaced at build time, so they end up inside the JavaScript bundle where anyone can read them; I never put secrets like private API keys there, those stay on a server. I use .env.development and .env.production for per-mode values, and .env.local for my own machine, which is git-ignored.',
    code: `# .env
VITE_API_URL=https://api.example.com
DB_PASSWORD=secret123          # not exposed: no VITE_ prefix

# .env.development
VITE_API_URL=http://localhost:3000

// src/api.js
const API_URL = import.meta.env.VITE_API_URL
console.log(import.meta.env.MODE)        // 'development' or 'production'
console.log(import.meta.env.DEV)         // true in dev
console.log(import.meta.env.DB_PASSWORD) // undefined

fetch(API_URL + '/users')`,
    output: `npm run dev    -> VITE_API_URL = http://localhost:3000, MODE = development
npm run build  -> VITE_API_URL = https://api.example.com, MODE = production
DB_PASSWORD    -> undefined (only VITE_ variables reach the browser)

VITE_ values are baked into the bundle: never put secrets there.`,
  },
  {
    q: 'Coding task: build a counter with undo and redo',
    level: 'Advanced',
    a: 'I store three things together: the past values, the present value and the future values. A new change pushes the present into past and clears future; undo moves the present into future and takes the last item from past; redo does the opposite. Keeping them in one state object (or a reducer) means they always update together, and I disable the buttons when there is nothing to undo or redo.',
    code: `function UndoCounter() {
  const [history, setHistory] = useState({ past: [], present: 0, future: [] })
  const { past, present, future } = history

  const change = (delta) => setHistory({
    past: [...past, present],
    present: present + delta,
    future: [], // a new change clears redo
  })

  const undo = () => setHistory({
    past: past.slice(0, -1),
    present: past[past.length - 1],
    future: [present, ...future],
  })

  const redo = () => setHistory({
    past: [...past, present],
    present: future[0],
    future: future.slice(1),
  })

  return (
    <>
      <h2>{present}</h2>
      <button onClick={() => change(-1)}>-1</button>
      <button onClick={() => change(1)}>+1</button>
      <button onClick={undo} disabled={!past.length}>Undo</button>
      <button onClick={redo} disabled={!future.length}>Redo</button>
      <p>History: {past.join(' -> ') || 'none'}</p>
    </>
  )
}`,
    output: <UndoRedoDemo />,
  },
  {
    q: 'Coding task: todo list with All / Active / Completed filters',
    level: 'Advanced',
    a: 'I store the todos and the current filter name in state, but never a separate filtered list; the visible todos are derived with todos.filter(FILTERS[filter]). Keeping the filter functions in an object makes adding a new filter a one-line change, and I can build the filter buttons from its keys. The items-left counter is derived the same way, so everything stays in sync automatically.',
    code: `const FILTERS = {
  all: () => true,
  active: (t) => !t.done,
  completed: (t) => t.done,
}

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', done: true },
    { id: 2, text: 'Practice hooks', done: false },
    { id: 3, text: 'Build a project', done: false },
  ])
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')

  const add = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setTodos([...todos, { id: Date.now(), text: text.trim(), done: false }])
    setText('')
  }
  const toggle = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const clearCompleted = () => setTodos(todos.filter((t) => !t.done))

  const visible = todos.filter(FILTERS[filter])
  const left = todos.filter((t) => !t.done).length

  return (
    <>
      <form onSubmit={add}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      {Object.keys(FILTERS).map((f) => (
        <button key={f} onClick={() => setFilter(f)}
          style={{ fontWeight: f === filter ? 'bold' : 'normal' }}>
          {f}
        </button>
      ))}
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            {t.text}
          </li>
        ))}
      </ul>
      <p>
        {left} items left
        <button onClick={clearCompleted}>Clear completed</button>
      </p>
    </>
  )
}`,
    output: <FilteredTodoDemo />,
  },
  {
    q: 'Coding task: build a star rating component',
    level: 'Advanced',
    a: 'I make the component controlled: the parent owns the rating and passes value and onChange, while the hover preview is local state inside the stars. A star is filled when its number is less than or equal to the hovered star, or to the saved value when nothing is hovered. I use real buttons with an aria-label for each star, so it also works with the keyboard and screen readers.',
    code: `function StarRating({ max = 5, value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div onMouseLeave={() => setHover(0)}>
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1
        const filled = star <= (hover || value)
        return (
          <button key={star} aria-label={star + ' stars'}
            onMouseEnter={() => setHover(star)}
            onClick={() => onChange(star)}
            style={{ fontSize: 28, border: 'none', background: 'none',
              color: filled ? 'gold' : 'lightgray' }}>
            ★
          </button>
        )
      })}
    </div>
  )
}

function App() {
  const [rating, setRating] = useState(3)
  return (
    <>
      <StarRating value={rating} onChange={setRating} />
      <p>You rated {rating} / 5</p>
    </>
  )
}`,
    output: <StarRatingDemo />,
  },
  {
    q: 'Coding task: build an OTP input with auto-focus and paste',
    level: 'Advanced',
    a: 'I keep the digits in an array state and store a ref to every input in a refs array. On change I keep only the last typed digit and move focus to the next box; on Backspace in an empty box I move focus back. I also handle paste on the wrapper, so pasting a full code fills all boxes at once, and I use inputMode="numeric" so phones show the number keyboard.',
    code: `const LENGTH = 4

function OtpInput() {
  const [digits, setDigits] = useState(Array(LENGTH).fill(''))
  const inputs = useRef([])

  const handleChange = (i, e) => {
    const value = e.target.value.replace(/\\D/g, '').slice(-1) // last digit only
    const next = [...digits]
    next[i] = value
    setDigits(next)
    if (value && i < LENGTH - 1) inputs.current[i + 1].focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\\D/g, '').slice(0, LENGTH)
    if (!pasted) return
    e.preventDefault()
    setDigits(Array.from({ length: LENGTH }, (_, i) => pasted[i] || ''))
    inputs.current[Math.min(pasted.length, LENGTH - 1)].focus()
  }

  const code = digits.join('')
  return (
    <>
      <div onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input key={i} value={d} inputMode="numeric"
            ref={(el) => { inputs.current[i] = el }}
            aria-label={'Digit ' + (i + 1)}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            style={{ width: 40, textAlign: 'center', fontSize: 20 }} />
        ))}
      </div>
      <p>{code.length === LENGTH ? 'Verifying ' + code : 'Enter the ' + LENGTH + '-digit code'}</p>
    </>
  )
}`,
    output: <OtpDemo />,
  },
]
