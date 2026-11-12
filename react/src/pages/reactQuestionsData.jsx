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
/* ---------------------------- Questions ---------------------------- */

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
]
