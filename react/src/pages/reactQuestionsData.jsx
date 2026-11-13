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
import { useForm } from 'react-hook-form'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { ApiProvider, createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

const btn = 'rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500 disabled:opacity-50'
const btnLight = 'rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-50'
const inputCls = 'rounded-lg border border-slate-300 px-3 py-1.5'
const errorCls = 'text-sm text-red-600'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Shows how many times a component has rendered (updated after each commit).
// The demos use it where the code uses console.log, so the effect is visible.
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
    <button className={btn} onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
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

const fruitList = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Mango' },
]

function ListKeysDemo() {
  return (
    <ul className="list-disc pl-5">
      {fruitList.map((fruit) => (
        <li key={fruit.id}>{fruit.name}</li>
      ))}
    </ul>
  )
}

function ConditionalDemo() {
  const [loggedIn, setLoggedIn] = useState(false)
  return (
    <div className="space-y-2">
      {loggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}
      {loggedIn && <p>You have 2 notifications</p>}
      <button className={btn} onClick={() => setLoggedIn(!loggedIn)}>
        {loggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  )
}

function EventsDemo() {
  const [message, setMessage] = useState('')
  const handleClick = () => setMessage('Button clicked!')
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={btn} onClick={handleClick}>
        Click me
      </button>
      <input className={inputCls} onChange={(e) => setMessage('Typed: ' + e.target.value)} placeholder="Type here" />
      <p className="w-full">{message}</p>
    </div>
  )
}

function ControlledDemo() {
  const [name, setName] = useState('')
  const inputRef = useRef(null)
  return (
    <div className="space-y-3">
      <div>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Controlled" />
        <p>Typed: {name}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input className={inputCls} ref={inputRef} defaultValue="hello" />
        <button className={btn} onClick={() => alert(inputRef.current.value)}>
          Read
        </button>
      </div>
    </div>
  )
}

function FormDemo() {
  const [email, setEmail] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Subscribed: ' + email)
    setEmail('')
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button className={btn}>Subscribe</button>
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
    </Card>
  )
}

function Term() {
  return (
    <>
      <dt className="font-semibold">React</dt>
      <dd className="pl-4">A UI library</dd>
    </>
  )
}

function FragmentDemo() {
  return (
    <dl>
      <Term />
    </dl>
  )
}

function TodoDemo() {
  const [todos, setTodos] = useState([])
  const add = () => setTodos([...todos, { id: Date.now(), text: 'Task ' + (todos.length + 1), done: false }])
  const remove = (id) => setTodos(todos.filter((t) => t.id !== id))
  const toggle = (id) => setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  return (
    <div className="space-y-2">
      <button className={btn} onClick={add}>
        Add
      </button>
      {todos.map((t) => (
        <p key={t.id} className="flex items-center gap-2">
          <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
          <span className={t.done ? 'line-through' : ''}>{t.text}</span>
          <button className={btnLight} onClick={() => remove(t.id)}>
            x
          </button>
        </p>
      ))}
    </div>
  )
}

function NestedStateDemo() {
  const [user, setUser] = useState({ name: 'Anu', address: { city: 'Kochi' } })
  const updateCity = (e) => setUser({ ...user, address: { ...user.address, city: e.target.value } })
  return (
    <div className="space-y-2">
      <input className={inputCls} value={user.address.city} onChange={updateCity} />
      <p>
        {user.name} lives in {user.address.city}
      </p>
    </div>
  )
}

function MultiInputDemo() {
  const [form, setForm] = useState({ firstName: '', lastName: '' })
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input className={inputCls} name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" />
        <input className={inputCls} name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" />
      </div>
      <p>
        Hello {form.firstName} {form.lastName}
      </p>
    </div>
  )
}

function ValidationDemo() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    setError(email.includes('@') ? '' : 'Enter a valid email')
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button className={btn}>Sign up</button>
      </div>
      {error && <p className={errorCls}>{error}</p>}
    </form>
  )
}

function ControlledOptionsDemo() {
  const [country, setCountry] = useState('india')
  const [plan, setPlan] = useState('free')
  const [agree, setAgree] = useState(false)
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <select className={inputCls} value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="india">India</option>
          <option value="usa">USA</option>
        </select>
        <label>
          <input type="radio" name="plan" checked={plan === 'free'} onChange={() => setPlan('free')} /> Free
        </label>
        <label>
          <input type="radio" name="plan" checked={plan === 'pro'} onChange={() => setPlan('pro')} /> Pro
        </label>
        <label>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> Agree
        </label>
      </div>
      <p className="text-sm text-slate-500">
        {country}, {plan}, {agree ? 'agreed' : 'not agreed'}
      </p>
    </div>
  )
}

function ColorPicker({ onSelect }) {
  return ['red', 'blue'].map((c) => (
    <button key={c} className={btnLight} onClick={() => onSelect(c)}>
      {c}
    </button>
  ))
}

function ChildToParentDemo() {
  const [color, setColor] = useState('none')
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <ColorPicker onSelect={setColor} />
      </div>
      <p>Parent received: {color}</p>
    </div>
  )
}

function ProfileCard({ name, role = 'Developer', isOnline = false }) {
  return (
    <p>
      {name} - {role} - {isOnline ? 'online' : 'offline'}
    </p>
  )
}

function DefaultPropsDemo() {
  return (
    <div>
      <ProfileCard name="Anu" role="Designer" isOnline />
      <ProfileCard name="Ravi" />
    </div>
  )
}

function ConditionalClassDemo() {
  const [active, setActive] = useState(false)
  return (
    <button
      className={active ? btn : btnLight}
      style={{ color: active ? 'white' : 'gray' }}
      onClick={() => setActive(!active)}
    >
      {active ? 'Active' : 'Inactive'}
    </button>
  )
}

function TreeHeader({ count }) {
  return <h3 className="font-semibold">Cart: {count} items</h3>
}

function BuyButton({ onBuy }) {
  return (
    <button className={btn} onClick={onBuy}>
      Buy
    </button>
  )
}

function ComponentTreeDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-2">
      <TreeHeader count={count} />
      <BuyButton onBuy={() => setCount(count + 1)} />
    </div>
  )
}

function HandlerArgsDemo() {
  const [log, setLog] = useState('')
  const buy = (name, price) => setLog('Bought ' + name + ' for Rs ' + price)
  const handleClick = (e, name) => setLog(name + ' clicked at x=' + e.clientX)
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button className={btn} onClick={() => buy('Pen', 10)}>
          Buy Pen
        </button>
        <button className={btn} onClick={() => buy('Book', 50)}>
          Buy Book
        </button>
        <button className={btnLight} onClick={(e) => handleClick(e, 'Info')}>
          Info
        </button>
      </div>
      <p>{log}</p>
    </div>
  )
}

function SyntheticEventDemo() {
  const [log, setLog] = useState('')
  const openCard = (e) => setLog(`opened: target=${e.target.tagName} currentTarget=${e.currentTarget.tagName}`)
  const remove = (e) => {
    e.stopPropagation()
    setLog('delete only')
  }
  return (
    <div className="space-y-2">
      <div className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-300 p-3 hover:bg-slate-50" onClick={openCard}>
        <span>Card text</span>
        <button className={btnLight} onClick={remove}>
          Delete
        </button>
      </div>
      <p className="font-mono text-sm">{log}</p>
    </div>
  )
}

function Banner({ show }) {
  if (!show) return null
  return <p className="font-semibold text-emerald-700">You have new messages!</p>
}

function RenderNothingDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-2">
      <Banner show={count > 0} />
      <button className={btn} onClick={() => setCount(count + 1)}>
        New message
      </button>
      <p>Wrong: {count && <b>{count} new</b>}</p>
      <p>Right: {count > 0 && <b>{count} new</b>}</p>
    </div>
  )
}

function useSwitch() {
  const [isOn, setIsOn] = useState(false)
  return [isOn, () => setIsOn(!isOn)]
}

function HooksIntroDemo() {
  const [count, setCount] = useState(0)
  const [isOn, toggle] = useSwitch()
  return (
    <div className="flex gap-2">
      <button className={btn} onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <button className={btnLight} onClick={toggle}>
        {isOn ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}

function useToggle(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  const toggle = () => setIsOpen(!isOpen)
  return [isOpen, toggle]
}

function ToggleOpenDemo() {
  const [isOpen, toggle] = useToggle()
  return (
    <div>
      <button className={btn} onClick={toggle}>
        {isOpen ? 'Close' : 'Open'} menu
      </button>
      {isOpen && (
        <ul className="mt-1 w-40 rounded-lg border border-slate-300 bg-white p-2 shadow">
          <li>Profile</li>
          <li>Logout</li>
        </ul>
      )}
    </div>
  )
}

/* ---------------------------- Intermediate ---------------------------- */

function FunctionalUpdateDemo() {
  const [count, setCount] = useState(0)
  const addTwoWrong = () => {
    setCount(count + 1)
    setCount(count + 1)
  }
  const addTwoRight = () => {
    setCount((c) => c + 1)
    setCount((c) => c + 1)
  }
  return (
    <div className="space-y-2">
      <p className="text-lg">Count: {count}</p>
      <div className="flex flex-wrap gap-2">
        <button className={btnLight} onClick={addTwoWrong}>
          addTwoWrong (+1)
        </button>
        <button className={btn} onClick={addTwoRight}>
          addTwoRight (+2)
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
      <p>
        Primes up to {limit}: {primes}
      </p>
      <button className={btn} onClick={() => setDark(!dark)}>
        Toggle theme (no recalculation)
      </button>
    </div>
  )
}

const CallbackChild = memo(function CallbackChild({ onClick }) {
  const badge = useRenderBadge()
  return (
    <p className="flex items-center gap-2">
      <button className={btn} onClick={onClick}>
        Child button
      </button>
      <RenderBadge badgeRef={badge} label="Child" />
    </p>
  )
})

function CallbackDemo() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const handleClick = useCallback(() => setCount((c) => c + 1), [])
  return (
    <div className="space-y-2">
      <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type: child does not re-render" />
      <CallbackChild onClick={handleClick} />
      <p>Count: {count}</p>
    </div>
  )
}

const ThemeContext = createContext('light')

function ThemedButton() {
  const theme = useContext(ThemeContext)
  return <button className={theme === 'dark' ? 'rounded-lg bg-slate-800 px-3 py-1.5 text-white' : btnLight}>I am {theme}</button>
}

function ContextDemo() {
  const [theme, setTheme] = useState('light')
  return (
    <div className="flex flex-wrap gap-2">
      <ThemeContext.Provider value={theme}>
        <ThemedButton />
      </ThemeContext.Provider>
      <button className={btn} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Switch
      </button>
    </div>
  )
}

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'reset':
      return { count: 0 }
    default:
      return state
  }
}

function ReducerDemo() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 })
  return (
    <div className="flex items-center gap-2">
      <p className="text-lg">Count: {state.count}</p>
      <button className={btn} onClick={() => dispatch({ type: 'increment' })}>
        +
      </button>
      <button className={btnLight} onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
    </div>
  )
}

function CustomHookDemo() {
  const [isOpen, toggleOpen] = useToggle()
  const [isDark, toggleDark] = useToggle(true)
  return (
    <div className="flex flex-wrap gap-2">
      <button className={btn} onClick={toggleOpen}>
        Menu: {isOpen ? 'Open' : 'Closed'}
      </button>
      <button className={btnLight} onClick={toggleDark}>
        Dark: {isDark ? 'On' : 'Off'}
      </button>
    </div>
  )
}

function readSavedNote() {
  try {
    return localStorage.getItem('note') ?? ''
  } catch {
    return ''
  }
}

function LazyInitDemo() {
  const [note, setNote] = useState(readSavedNote)
  return <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
}

function DerivedStateDemo() {
  const [items, setItems] = useState([
    { name: 'Pen', price: 10 },
    { name: 'Book', price: 150 },
  ])
  const total = items.reduce((sum, item) => sum + item.price, 0)
  return (
    <div className="space-y-2">
      <p>Total: Rs {total}</p>
      <button className={btn} onClick={() => setItems([...items, { name: 'Bag', price: 500 }])}>
        Add bag
      </button>
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
  const items = bigList.filter((item) => item.includes(query))
  return (
    <ul className="max-h-40 overflow-auto text-sm">
      {items.slice(0, 20).map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  )
})

function DeferredDemo() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  return (
    <div className="space-y-2">
      <input className={inputCls} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a number" />
      <SlowList query={deferredQuery} />
    </div>
  )
}

function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />
}

function RefAsPropDemo() {
  const inputRef = useRef(null)
  return (
    <div className="flex flex-wrap gap-2">
      <MyInput className={inputCls} ref={inputRef} placeholder="Search" />
      <button className={btn} onClick={() => inputRef.current.focus()}>
        Focus input
      </button>
    </div>
  )
}

function FancyInput({ ref }) {
  const inputRef = useRef(null)
  useImperativeHandle(ref, () => ({
    clear: () => {
      inputRef.current.value = ''
    },
  }))
  return <input className={inputCls} ref={inputRef} defaultValue="Hello" />
}

function ImperativeDemo() {
  const fancyRef = useRef(null)
  return (
    <div className="flex flex-wrap gap-2">
      <FancyInput ref={fancyRef} />
      <button className={btn} onClick={() => fancyRef.current.clear()}>
        Clear
      </button>
    </div>
  )
}

function AbortFetchDemo() {
  const [id, setId] = useState(1)
  const [post, setPost] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    fetch('https://jsonplaceholder.typicode.com/posts/' + id, { signal: controller.signal })
      .then((res) => res.json())
      .then(setPost)
      .catch((err) => {
        if (err.name !== 'AbortError') alert(err.message)
      })
    return () => controller.abort()
  }, [id])
  return (
    <div className="space-y-2">
      <button className={btn} onClick={() => setId(id + 1)}>
        Next post
      </button>
      <p>{post?.title}</p>
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
      // storage blocked: keep the value in memory only
    }
  }, [key, value])
  return [value, setValue]
}

function LocalStorageHookDemo() {
  const [name, setName] = useLocalStorage('name', '')
  return <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (then reload)" />
}

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current.contains(e.target)) handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

function ClickOutsideDemo() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setOpen(false))
  return (
    <div ref={ref} className="inline-block">
      <button className={btn} onClick={() => setOpen(!open)}>
        Menu
      </button>
      {open && <p className="mt-1 rounded-lg border border-slate-300 bg-white p-2 shadow">Profile · Logout</p>}
    </div>
  )
}

function CharCounterDemo() {
  const [text, setText] = useState('')
  const left = 100 - text.length
  return (
    <div className="space-y-1">
      <textarea className={inputCls + ' w-full'} rows={3} value={text} maxLength={100} onChange={(e) => setText(e.target.value)} />
      <p style={{ color: left < 10 ? 'red' : 'gray' }}>{left} characters left</p>
    </div>
  )
}

const CITIES = { India: ['Kochi', 'Mumbai'], USA: ['New York', 'Austin'] }

function DependentSelectDemo() {
  const [country, setCountry] = useState('India')
  const [city, setCity] = useState('Kochi')
  const changeCountry = (e) => {
    setCountry(e.target.value)
    setCity(CITIES[e.target.value][0])
  }
  return (
    <div className="flex flex-wrap gap-2">
      <select className={inputCls} value={country} onChange={changeCountry}>
        {Object.keys(CITIES).map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <select className={inputCls} value={city} onChange={(e) => setCity(e.target.value)}>
        {CITIES[country].map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>
  )
}

const PAGE_ITEMS = Array.from({ length: 23 }, (_, i) => 'Item ' + (i + 1))
const PAGE_SIZE = 5

function PaginationDemo() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(PAGE_ITEMS.length / PAGE_SIZE)
  const visible = PAGE_ITEMS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  return (
    <div className="space-y-2">
      <ul className="list-disc pl-5">
        {visible.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="flex items-center gap-2">
        <button className={btnLight} disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button className={btnLight} disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}

const PRODUCTS = [
  { name: 'Laptop', price: 900 },
  { name: 'Desk', price: 200 },
  { name: 'Lamp', price: 40 },
]

function SearchFilterSortDemo() {
  const [query, setQuery] = useState('')
  const [byPrice, setByPrice] = useState(false)
  const visible = PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) =>
    byPrice ? a.price - b.price : a.name.localeCompare(b.name)
  )
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input className={inputCls} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
        <button className={btnLight} onClick={() => setByPrice(!byPrice)}>
          Sort by {byPrice ? 'name' : 'price'}
        </button>
      </div>
      <ul className="list-disc pl-5">
        {visible.map((p) => (
          <li key={p.name}>
            {p.name} - Rs {p.price}
          </li>
        ))}
      </ul>
    </div>
  )
}

function AccessibleModalDemo() {
  const ref = useRef(null)
  return (
    <div>
      <button className={btn} onClick={() => ref.current.showModal()}>
        Delete file
      </button>
      <dialog ref={ref} aria-labelledby="dlg-title" className="m-auto rounded-xl p-5 shadow-xl backdrop:bg-black/40">
        <h2 id="dlg-title" className="mb-3 text-lg font-semibold">
          Delete file?
        </h2>
        <button className={btnLight} onClick={() => ref.current.close()}>
          Cancel
        </button>
      </dialog>
    </div>
  )
}

function StopwatchDemo() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])
  const reset = () => {
    setRunning(false)
    setSeconds(0)
  }
  return (
    <div className="space-y-2">
      <p className="font-mono text-2xl">{seconds}s</p>
      <div className="flex gap-2">
        <button className={btn} onClick={() => setRunning(!running)}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button className={btnLight} onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  )
}

const CartContext = createContext(null)

function cartReducer(items, action) {
  return action.type === 'add' ? [...items, action.item] : items
}

function AddPen() {
  const { items, dispatch } = useContext(CartContext)
  const add = () => dispatch({ type: 'add', item: 'Pen' })
  return (
    <button className={btn} onClick={add}>
      Add pen ({items.length} in cart)
    </button>
  )
}

function GlobalStoreDemo() {
  const [items, dispatch] = useReducer(cartReducer, [])
  return (
    <CartContext.Provider value={{ items, dispatch }}>
      <AddPen />
    </CartContext.Provider>
  )
}

function qtyReducer(qty, action) {
  switch (action.type) {
    case 'add':
      return Math.min(qty + 1, 5)
    case 'remove':
      return Math.max(qty - 1, 1)
    default:
      return qty
  }
}

function StateVsReducerDemo() {
  const [qty, dispatch] = useReducer(qtyReducer, 1)
  return (
    <div className="flex items-center gap-2">
      <button className={btnLight} onClick={() => dispatch({ type: 'remove' })}>
        -
      </button>
      <span className="w-6 text-center">{qty}</span>
      <button className={btnLight} onClick={() => dispatch({ type: 'add' })}>
        +
      </button>
      <span className="text-xs text-slate-500">(1 to 5)</span>
    </div>
  )
}

function CallbackEffectDemo() {
  const [query, setQuery] = useState('react')
  const [dark, setDark] = useState(false)
  const runs = useRef(0)
  const out = useRef(null)
  // The code uses console.log; the demo writes to the screen instead.
  const search = useCallback(() => {
    if (out.current) out.current.textContent = 'search("' + query + '")'
  }, [query])
  useEffect(() => {
    runs.current += 1
    search()
    if (out.current) out.current.textContent += ' - effect ran ' + runs.current + ' times'
  }, [search])
  return (
    <div className={'space-y-2 rounded-lg p-3 ' + (dark ? 'bg-slate-800 text-white' : 'bg-slate-50')}>
      <div className="flex flex-wrap gap-2">
        <input className={inputCls + ' text-slate-900'} value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className={btnLight + ' bg-white'} onClick={() => setDark(!dark)}>
          Toggle theme
        </button>
      </div>
      <p ref={out} className="font-mono text-sm" />
    </div>
  )
}

function ValidationTimingDemo() {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const error = email.includes('@') ? '' : 'Enter a valid email'
  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(true)} placeholder="Email" />
        <button className={btn}>Sign up</button>
      </div>
      {touched && error && <p className={errorCls}>{error}</p>}
    </form>
  )
}

function HookFormDemo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [submitted, setSubmitted] = useState(null)
  const onSubmit = (data) => setSubmitted(data)
  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <input className={inputCls} placeholder="Email" {...register('email', { required: 'Email is required' })} />
          <button className={btn}>Sign up</button>
        </div>
        {errors.email && <p className={errorCls}>{errors.email.message}</p>}
      </form>
      {submitted && <pre className="rounded bg-slate-100 p-2 text-xs">{JSON.stringify(submitted)}</pre>}
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

function ReactMemoDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-2">
      <button className={btn} onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <MemoUser name="Anu" />
    </div>
  )
}

class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    return this.state.hasError ? <p className="text-red-600">Something went wrong.</p> : this.props.children
  }
}

function BuggyCounter() {
  const [count, setCount] = useState(0)
  if (count === 3) throw new Error('Crashed at 3!')
  return (
    <button className={btn} onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}

function ErrorBoundaryDemo() {
  const [run, setRun] = useState(0)
  return (
    <div className="space-y-2">
      <ErrorBoundary key={run}>
        <BuggyCounter />
      </ErrorBoundary>
      <button className={btnLight} onClick={() => setRun(run + 1)}>
        Reset demo
      </button>
    </div>
  )
}

function Modal({ onClose }) {
  return createPortal(
    <div className="fixed inset-x-0 top-6 z-50 mx-auto flex w-fit items-center gap-3 rounded-xl bg-white p-4 shadow-xl ring-1 ring-slate-200">
      Rendered in document.body
      <button className={btn} onClick={onClose}>
        Close
      </button>
    </div>,
    document.body
  )
}

function PortalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div>
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
  return (
    <div className="space-y-2">
      <button className={btn} onClick={handleClick}>
        handleClick
      </button>
      <p>
        count: {count}, flag: {String(flag)}
      </p>
      <RenderBadge badgeRef={badge} label="Component" />
    </div>
  )
}

function NameInput() {
  const [text, setText] = useState('')
  return <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} />
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
      <p>Note for {user}:</p>
      <NameInput key={user} />
    </div>
  )
}

function withCounter(Wrapped) {
  return function WithCounter() {
    const [count, setCount] = useState(0)
    return <Wrapped count={count} onAdd={() => setCount(count + 1)} />
  }
}

const HocButton = withCounter(({ count, onAdd }) => (
  <button className={btn} onClick={onAdd}>
    HOC: {count}
  </button>
))

function useCounter() {
  const [count, setCount] = useState(0)
  return { count, onAdd: () => setCount(count + 1) }
}

function HocVsHookDemo() {
  const { count, onAdd } = useCounter()
  return (
    <div className="flex gap-2">
      <HocButton />
      <button className={btnLight} onClick={onAdd}>
        Hook: {count}
      </button>
    </div>
  )
}

function fakeFetchUser(id) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (id === 4) reject(new Error('User not found'))
      else resolve({ id, name: 'User ' + id })
    }, 800)
  )
}

function FetchDemo() {
  const [userId, setUserId] = useState(1)
  const [result, setResult] = useState({ id: null })
  useEffect(() => {
    let ignore = false
    fakeFetchUser(userId)
      .then((data) => {
        if (!ignore) setResult({ id: userId, data })
      })
      .catch((err) => {
        if (!ignore) setResult({ id: userId, error: err.message })
      })
    return () => {
      ignore = true
    }
  }, [userId])
  const loading = result.id !== userId
  return (
    <div className="space-y-2">
      <button className={btn} onClick={() => setUserId(userId + 1)}>
        Next user ({userId})
      </button>
      <p>{loading ? 'Loading...' : result.error || result.data.name}</p>
    </div>
  )
}

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
  return (
    <div className="space-y-2">
      <input className={inputCls} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type fast" />
      <p>Searching for: {debouncedQuery}</p>
    </div>
  )
}

function ReorderKeysDemo() {
  const [items, setItems] = useState(['Apple', 'Banana', 'Cherry'])
  return (
    <div className="space-y-2">
      <button className={btn} onClick={() => setItems([...items].reverse())}>
        Reverse
      </button>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-red-600">key = index</p>
          {items.map((item, index) => (
            <p key={index}>
              {item} <input className={inputCls + ' w-28'} defaultValue={item} />
            </p>
          ))}
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-700">key = item</p>
          {items.map((item) => (
            <p key={item}>
              {item} <input className={inputCls + ' w-28'} defaultValue={item} />
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

async function addToCart(prevCount, formData) {
  await wait(800)
  return prevCount + Number(formData.get('qty'))
}

function ActionStateDemo() {
  const [count, formAction, isPending] = useActionState(addToCart, 0)
  return (
    <form action={formAction} className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input className={inputCls + ' w-20'} name="qty" type="number" defaultValue="1" />
        <button className={btn} disabled={isPending}>
          {isPending ? 'Adding...' : 'Add to cart'}
        </button>
      </div>
      <p>Items in cart: {count}</p>
    </form>
  )
}

function OptimisticDemo() {
  const [likes, setLikes] = useState(0)
  const [optimisticLikes, addOptimistic] = useOptimistic(likes, (n) => n + 1)
  const likeAction = async () => {
    addOptimistic()
    await wait(1500)
    startTransition(() => setLikes((n) => n + 1))
  }
  return (
    <form action={likeAction} className="flex items-center gap-2">
      <button className={btn}>♥ {optimisticLikes}</button>
      <span className="text-xs text-slate-500">saved: {likes}</span>
    </form>
  )
}

const TabsContext = createContext(null)

function Tabs({ children }) {
  const [active, setActive] = useState('profile')
  return <TabsContext value={{ active, setActive }}>{children}</TabsContext>
}

function Tab({ id }) {
  const { active, setActive } = useContext(TabsContext)
  return (
    <button className={active === id ? btn : btnLight} onClick={() => setActive(id)}>
      {id}
    </button>
  )
}

function Panel({ id, children }) {
  const { active } = useContext(TabsContext)
  return active === id ? <p className="w-full">{children}</p> : null
}

function CompoundDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Tabs>
        <Tab id="profile" /> <Tab id="settings" />
        <Panel id="profile">Name: Anu</Panel>
        <Panel id="settings">Theme: Dark</Panel>
      </Tabs>
    </div>
  )
}

function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  return (
    <div className="rounded-lg bg-slate-100 p-6" onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  )
}

function RenderPropsDemo() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <p>
          Mouse at ({x}, {y})
        </p>
      )}
    />
  )
}

function Quote({ promise }) {
  const text = use(promise)
  return <p className="italic">{text}</p>
}

function UsePromiseDemo() {
  const [promise, setPromise] = useState(null)
  const load = () => setPromise(wait(1000).then(() => 'Keep it simple.'))
  return (
    <div className="space-y-2">
      <button className={btn} onClick={load}>
        Load quote
      </button>
      <Suspense fallback={<p>Loading...</p>}>{promise && <Quote promise={promise} />}</Suspense>
    </div>
  )
}

const MemoPitfallChild = memo(function MemoPitfallChild({ label, style }) {
  const badge = useRenderBadge()
  return (
    <p style={style}>
      {label} <RenderBadge badgeRef={badge} label={label} />
    </p>
  )
})

const BLUE = { color: 'blue' }

function MemoPitfallDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-2">
      <button className={btn} onClick={() => setCount(count + 1)}>
        Re-render parent ({count})
      </button>
      <MemoPitfallChild label="Inline style" style={{ color: 'blue' }} />
      <MemoPitfallChild label="Stable style" style={BLUE} />
    </div>
  )
}

function A11yDemo() {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="space-y-2">
      <button className={btnLight} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        What is your refund policy?
      </button>
      <p id={id} hidden={!open}>
        30 days, no questions asked.
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor={id + '-email'}>Email</label>
        <input className={inputCls} id={id + '-email'} type="email" />
      </div>
    </div>
  )
}

const xssText = '<img src=x onerror="alert(1)"> Hello'

function XssDemo() {
  return <p className="font-mono text-sm">{xssText}</p>
}

function UndoRedoDemo() {
  const [history, setHistory] = useState({ past: [], present: 0, future: [] })
  const { past, present, future } = history
  const add = () => setHistory({ past: [...past, present], present: present + 1, future: [] })
  const undo = () => setHistory({ past: past.slice(0, -1), present: past.at(-1), future: [present, ...future] })
  const redo = () => setHistory({ past: [...past, present], present: future[0], future: future.slice(1) })
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{present}</h2>
      <div className="flex gap-2">
        <button className={btn} onClick={add}>
          +1
        </button>
        <button className={btnLight} onClick={undo} disabled={!past.length}>
          Undo
        </button>
        <button className={btnLight} onClick={redo} disabled={!future.length}>
          Redo
        </button>
      </div>
    </div>
  )
}

const FILTERS = { all: () => true, active: (t) => !t.done, completed: (t) => t.done }

function FilteredTodoDemo() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', done: true },
    { id: 2, text: 'Practice hooks', done: false },
  ])
  const [filter, setFilter] = useState('all')
  const toggle = (id) => setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {Object.keys(FILTERS).map((f) => (
          <button key={f} className={f === filter ? btn : btnLight} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      {todos.filter(FILTERS[filter]).map((t) => (
        <label key={t.id} className="flex items-center gap-2">
          <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} /> {t.text}
        </label>
      ))}
    </div>
  )
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return [1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      aria-label={star + ' stars'}
      className="text-3xl text-amber-400"
      onMouseEnter={() => setHover(star)}
      onMouseLeave={() => setHover(0)}
      onClick={() => onChange(star)}
    >
      {star <= (hover || value) ? '★' : '☆'}
    </button>
  ))
}

function StarRatingDemo() {
  const [rating, setRating] = useState(3)
  return (
    <div>
      <StarRating value={rating} onChange={setRating} />
      <p>You rated {rating} / 5</p>
    </div>
  )
}

function OtpDemo() {
  const [digits, setDigits] = useState(['', '', '', ''])
  const inputs = useRef([])
  const handleChange = (i, value) => {
    setDigits(digits.map((d, j) => (j === i ? value.slice(-1) : d)))
    if (value && i < 3) inputs.current[i + 1].focus()
  }
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text')
    setDigits(digits.map((_, i) => pasted[i] || ''))
  }
  return (
    <div className="flex gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          value={d}
          inputMode="numeric"
          aria-label={'Digit ' + (i + 1)}
          className={inputCls + ' w-12 text-center text-xl'}
          onPaste={handlePaste}
          ref={(el) => {
            inputs.current[i] = el
          }}
          onChange={(e) => handleChange(i, e.target.value)}
        />
      ))}
    </div>
  )
}

/* ------------------- Redux & data fetching libraries ------------------- */
// Every demo has its own store / api / QueryClient, so they never share state.

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: { increment: (n) => n + 1 },
})
const counterStore = configureStore({ reducer: { counter: counterSlice.reducer } })

function ReduxCounter() {
  const count = useSelector((s) => s.counter)
  const dispatch = useDispatch()
  return (
    <button className={btn} onClick={() => dispatch(counterSlice.actions.increment())}>
      Count: {count}
    </button>
  )
}

function ReduxCounterDemo() {
  return (
    <Provider store={counterStore}>
      <ReduxCounter />
    </Provider>
  )
}

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    getUser: build.query({ queryFn: () => wait(800).then(() => ({ data: 'Asha' })) }),
  }),
})

function RtkUser() {
  const { data, isLoading } = userApi.useGetUserQuery()
  return <p>{isLoading ? 'Loading...' : 'Hello ' + data}</p>
}

function RtkQueryDemo() {
  return (
    <ApiProvider api={userApi}>
      <RtkUser />
    </ApiProvider>
  )
}

const rtkTodos = ['Learn Redux'] // fake in-memory DB
const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Todo'],
  endpoints: (build) => ({
    getTodos: build.query({ queryFn: () => ({ data: [...rtkTodos] }), providesTags: ['Todo'] }),
    addTodo: build.mutation({ queryFn: (t) => ({ data: rtkTodos.push(t) }), invalidatesTags: ['Todo'] }),
  }),
})

function RtkTodos() {
  const { data = [] } = todoApi.useGetTodosQuery()
  const [addTodo] = todoApi.useAddTodoMutation()
  return (
    <div className="space-y-2">
      <button className={btn} onClick={() => addTodo('Task ' + data.length)}>
        Add
      </button>
      <p>{data.join(', ')}</p>
    </div>
  )
}

function RtkTagsDemo() {
  return (
    <ApiProvider api={todoApi}>
      <RtkTodos />
    </ApiProvider>
  )
}

const fetchRqUser = () => wait(800).then(() => ({ name: 'Asha' })) // fake API
const userClient = new QueryClient()

function RqUser() {
  const { data, isPending, error } = useQuery({ queryKey: ['user'], queryFn: fetchRqUser })
  if (isPending) return <p>Loading...</p>
  if (error) return <p className={errorCls}>Error: {error.message}</p>
  return <p>Hello {data.name}</p>
}

function UseQueryDemo() {
  return (
    <QueryClientProvider client={userClient}>
      <RqUser />
    </QueryClientProvider>
  )
}

const rqTodos = ['Learn React Query'] // fake in-memory DB
const getRqTodos = () => wait(300).then(() => [...rqTodos])
const addRqTodo = (text) => wait(300).then(() => rqTodos.push(text))
const todoClient = new QueryClient()

function RqTodos() {
  const queryClient = useQueryClient()
  const { data = [] } = useQuery({ queryKey: ['todos'], queryFn: getRqTodos })
  const add = useMutation({
    mutationFn: addRqTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })
  return (
    <div className="space-y-2">
      <button className={btn} disabled={add.isPending} onClick={() => add.mutate('Task ' + data.length)}>
        {add.isPending ? 'Saving...' : 'Add'}
      </button>
      <p>{data.join(', ')}</p>
    </div>
  )
}

function MutationDemo() {
  return (
    <QueryClientProvider client={todoClient}>
      <RqTodos />
    </QueryClientProvider>
  )
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
  render() { return <p>Hello {this.props.name} (class)</p> }
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

<Greeting name="Anu" age={22} />
<Greeting name="Ravi" age={30} />`,
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
    code: `// value is a prop: read-only here
function Display({ value }) {
  return <p>Count: {value}</p>
}

// count is state: owned by the parent
const [count, setCount] = useState(0)
<Display value={count} />
<button onClick={() => setCount(count + 1)}>+1</button>`,
    output: <PropsVsStateDemo />,
  },
  {
    q: 'How do you render lists, and why do keys matter?',
    level: 'Basics',
    a: 'I use map to turn an array into JSX elements, and I give each item a unique key. React uses the key to know which item is which between renders. I avoid using the array index as a key when items can be added, removed or reordered, because the index changes and React may mix up item state. A stable id from the data is the best key.',
    code: `const fruits = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Mango' },
]

<ul>
  {fruits.map((fruit) => (
    <li key={fruit.id}>{fruit.name}</li>
  ))}
</ul>`,
    output: <ListKeysDemo />,
  },
  {
    q: 'How do you do conditional rendering?',
    level: 'Basics',
    a: 'I use normal JavaScript inside JSX: the ternary operator when I have two options, and && when I want to show something or nothing. For bigger logic I use an if statement before the return. One tip: be careful with && and numbers, because {0 && <p/>} renders 0 on the screen, so I write count > 0 && instead.',
    code: `const [loggedIn, setLoggedIn] = useState(false)

{loggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}
{loggedIn && <p>You have 2 notifications</p>}
<button onClick={() => setLoggedIn(!loggedIn)}>
  {loggedIn ? 'Logout' : 'Login'}
</button>`,
    output: <ConditionalDemo />,
  },
  {
    q: 'How do you handle events in React?',
    level: 'Basics',
    a: 'I pass a function to props like onClick or onChange, written in camelCase. React gives the handler an event object, so I can read e.target.value for inputs. A common mistake is writing onClick={handleClick()} which calls the function immediately; I pass the function itself or wrap it in an arrow function.',
    code: `const [message, setMessage] = useState('')
const handleClick = () => setMessage('Button clicked!')

<button onClick={handleClick}>Click me</button>
<input onChange={(e) => setMessage('Typed: ' + e.target.value)} />
<p>{message}</p>`,
    output: <EventsDemo />,
  },
  {
    q: 'Controlled vs uncontrolled inputs?',
    level: 'Basics',
    a: 'In a controlled input, React state holds the value and I update it on every change, so React is the single source of truth. In an uncontrolled input, the DOM keeps the value and I read it with a ref when I need it. I prefer controlled inputs for validation and live feedback, and uncontrolled ones for simple forms or file inputs.',
    code: `// Controlled: React state holds the value
const [name, setName] = useState('')
<input value={name} onChange={(e) => setName(e.target.value)} />
<p>Typed: {name}</p>

// Uncontrolled: the DOM holds the value, read it with a ref
const inputRef = useRef(null)
<input ref={inputRef} defaultValue="hello" />
<button onClick={() => alert(inputRef.current.value)}>Read</button>`,
    output: <ControlledDemo />,
  },
  {
    q: 'How do you handle forms?',
    level: 'Basics',
    a: 'I keep each field in state as a controlled input and handle the onSubmit event on the form. Inside the handler I call e.preventDefault() so the browser does not reload the page. Then I validate, send the data, and reset the fields if needed.',
    code: `const [email, setEmail] = useState('')
const handleSubmit = (e) => {
  e.preventDefault() // stop the page reload
  alert('Subscribed: ' + email)
  setEmail('')
}

<form onSubmit={handleSubmit}>
  <input value={email} onChange={(e) => setEmail(e.target.value)} />
  <button>Subscribe</button>
</form>`,
    output: <FormDemo />,
  },
  {
    q: 'What is lifting state up?',
    level: 'Basics',
    a: 'When two sibling components need the same data, I move that state up to their closest common parent. The parent passes the value down as a prop and passes a function down so the child can ask for changes. This keeps one source of truth so the siblings never go out of sync.',
    code: `const CountButton = ({ onAdd }) => <button onClick={onAdd}>Add</button>
const CountLabel = ({ count }) => <p>Total: {count}</p>

// The shared state lives in the closest common parent
const [count, setCount] = useState(0)
<CountButton onAdd={() => setCount(count + 1)} />
<CountLabel count={count} />`,
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
</Card>`,
    output: <ChildrenDemo />,
  },
  {
    q: 'What are Fragments?',
    level: 'Basics',
    a: 'A component must return a single parent element, and Fragments let me group elements without adding an extra div to the DOM. I write them as <>...</>, or <Fragment key={id}> when I need a key inside a list. They are useful for tables and definition lists where an extra div would break the HTML structure.',
    code: `function Term() {
  return (
    <>
      <dt>React</dt>
      <dd>A UI library</dd>
    </>
  )
}

<dl><Term /></dl>`,
    output: <FragmentDemo />,
  },
  {
    q: 'How do you add, remove, update and toggle items in array state? (todo list)',
    level: 'Basics',
    a: 'I never mutate the array; I always pass a new array to the setter. I use spread to add, filter to remove, and map to update or toggle one item while copying the rest. I always find the item by a stable id, not by its index.',
    code: `const [todos, setTodos] = useState([])
const add = () =>
  setTodos([...todos, { id: Date.now(), text: 'Task ' + (todos.length + 1), done: false }])
const remove = (id) => setTodos(todos.filter((t) => t.id !== id))
const toggle = (id) =>
  setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

<button onClick={add}>Add</button>
{todos.map((t) => (
  <p key={t.id}>
    <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
    {t.text} <button onClick={() => remove(t.id)}>x</button>
  </p>
))}`,
    output: <TodoDemo />,
  },
  {
    q: 'How do you update nested object state?',
    level: 'Basics',
    a: 'I have to copy every level I change, because spread only makes a shallow copy. So I spread the outer object, then spread the nested object and override the one field. If my state gets deeply nested, I try to flatten it or use a reducer or a library like Immer to keep the updates readable.',
    code: `const [user, setUser] = useState({ name: 'Anu', address: { city: 'Kochi' } })

// Copy every level you change
const updateCity = (e) =>
  setUser({ ...user, address: { ...user.address, city: e.target.value } })

<input value={user.address.city} onChange={updateCity} />
<p>{user.name} lives in {user.address.city}</p>`,
    output: <NestedStateDemo />,
  },
  {
    q: 'How do you handle multiple inputs with one onChange handler?',
    level: 'Basics',
    a: 'I keep all fields in one state object and give each input a name attribute that matches a key in that object. In one handleChange I read name and value from e.target and use a computed property key, [name]: value, to update just that field. This saves me from writing a separate handler for every input.',
    code: `const [form, setForm] = useState({ firstName: '', lastName: '' })

const handleChange = (e) => {
  const { name, value } = e.target
  setForm({ ...form, [name]: value })
}

<input name="firstName" value={form.firstName} onChange={handleChange} />
<input name="lastName" value={form.lastName} onChange={handleChange} />
<p>Hello {form.firstName} {form.lastName}</p>`,
    output: <MultiInputDemo />,
  },
  {
    q: 'How do you do form validation with error messages?',
    level: 'Basics',
    a: 'On submit I call e.preventDefault(), check the values and store an error message in state, and I only send the data when there are no errors. I show each message right below its input. With many fields I write a validate function that returns an errors object with one message per field, and for bigger forms I use a library like React Hook Form with Zod.',
    code: `const [email, setEmail] = useState('')
const [error, setError] = useState('')
const handleSubmit = (e) => {
  e.preventDefault()
  setError(email.includes('@') ? '' : 'Enter a valid email')
}

<form onSubmit={handleSubmit}>
  <input value={email} onChange={(e) => setEmail(e.target.value)} />
  <button>Sign up</button>
  {error && <p className="error">{error}</p>}
</form>`,
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
<input type="radio" name="plan" checked={plan === 'free'} onChange={() => setPlan('free')} /> Free
<input type="radio" name="plan" checked={plan === 'pro'} onChange={() => setPlan('pro')} /> Pro
<input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> Agree`,
    output: <ControlledOptionsDemo />,
  },
  {
    q: 'How does a child send data to its parent?',
    level: 'Basics',
    a: 'Data only flows down in React, so the parent passes a function as a prop and the child calls it with the data. The parent then decides what to do, usually set its own state. I name these props like events, such as onSelect or onChange, so it is clear the child is reporting something up.',
    code: `function ColorPicker({ onSelect }) {
  return ['red', 'blue'].map((c) => (
    <button key={c} onClick={() => onSelect(c)}>{c}</button>
  ))
}

const [color, setColor] = useState('none')
<ColorPicker onSelect={setColor} />
<p>Parent received: {color}</p>`,
    output: <ChildToParentDemo />,
  },
  {
    q: 'How do you destructure props and set default values?',
    level: 'Basics',
    a: "I destructure props right in the function parameters and use JavaScript default values for optional ones. defaultProps is deprecated for function components, so default parameters are the modern way. One tip: a default like role = 'Developer' only applies when the prop is undefined, not when someone passes null.",
    code: `function ProfileCard({ name, role = 'Developer', isOnline = false }) {
  return <p>{name} - {role} - {isOnline ? 'online' : 'offline'}</p>
}

<ProfileCard name="Anu" role="Designer" isOnline />
<ProfileCard name="Ravi" />`,
    output: <DefaultPropsDemo />,
  },
  {
    q: 'How do you add conditional classes and styles?',
    level: 'Basics',
    a: 'Since className is just a string, I build it with a ternary or a template string based on state. When there are many conditions I use a small helper like clsx to keep it readable. For truly dynamic values like a calculated width or color, I use the style prop, which takes an object with camelCase keys.',
    code: `const [active, setActive] = useState(false)

<button
  className={active ? 'btn active' : 'btn'}
  style={{ color: active ? 'white' : 'gray' }}
  onClick={() => setActive(!active)}>
  {active ? 'Active' : 'Inactive'}
</button>`,
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
Greeting.propTypes = { name: PropTypes.string.isRequired }

// Modern way: TypeScript
type GreetingProps = { name: string; age?: number }

function Greeting({ name, age = 18 }: GreetingProps) {
  return <p>{name} is {age}</p>
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
    a: 'My app is a tree of components: App at the root renders children like Header and BuyButton, and those can render their own children. Data flows one way, from parent to child through props, so when I want to know where a value comes from I just walk up the tree. A child never changes its parent data directly; it calls a function the parent passed down, like onBuy here, which keeps bugs easy to trace.',
    code: `// Tree: App -> Header + BuyButton
function Header({ count }) {
  return <h3>Cart: {count} items</h3>
}

function BuyButton({ onBuy }) {
  return <button onClick={onBuy}>Buy</button>
}

const [count, setCount] = useState(0)
<Header count={count} />
<BuyButton onBuy={() => setCount(count + 1)} />`,
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

  return <button onClick={() => setCount(count + 1)}>{count}</button>
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
    code: `// Wrong: two roots, class, unclosed <img>
return <h2 class="title">Anu</h2><img src="/anu.png">

// Right
return (
  <>
    <h2 className="title">Anu</h2>
    <img src="/anu.png" alt="Anu" />
  </>
)`,
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
    code: `const [log, setLog] = useState('')
const buy = (name, price) => setLog('Bought ' + name + ' for Rs ' + price)
const handleClick = (e, name) => setLog(name + ' clicked at x=' + e.clientX)

<button onClick={() => buy('Pen', 10)}>Buy Pen</button>
<button onClick={() => buy('Book', 50)}>Buy Book</button>
<button onClick={(e) => handleClick(e, 'Info')}>Info</button>
<p>{log}</p>`,
    output: <HandlerArgsDemo />,
  },
  {
    q: 'What is a SyntheticEvent? e.target vs e.currentTarget and stopPropagation',
    level: 'Basics',
    a: 'React wraps the browser event in a SyntheticEvent, which works the same in every browser and has target, currentTarget, preventDefault and stopPropagation. e.target is the element that was actually clicked, while e.currentTarget is the element the handler is attached to. I use e.stopPropagation() when a click inside a child should not trigger the parent, like a delete button inside a clickable card.',
    code: `const [log, setLog] = useState('')
const openCard = (e) =>
  setLog(\`opened: target=\${e.target.tagName} currentTarget=\${e.currentTarget.tagName}\`)
const remove = (e) => {
  e.stopPropagation() // the card does not open
  setLog('delete only')
}

<div className="card" onClick={openCard}>
  <span>Card text</span> <button onClick={remove}>Delete</button>
</div>
<p>{log}</p>`,
    output: <SyntheticEventDemo />,
  },
  {
    q: 'How do you render nothing, and why does {count && ...} show a 0?',
    level: 'Basics',
    a: 'A component can return null to render nothing, which I use for things like a hidden banner, and false, null and undefined inside JSX also render nothing. But 0 is a number, so React prints it: {count && <b>new</b>} shows a 0 when count is 0. I fix it by making the condition a real boolean, like count > 0 && ..., or by using a ternary.',
    code: `function Banner({ show }) {
  if (!show) return null // renders nothing
  return <p>You have new messages!</p>
}

const [count, setCount] = useState(0)
<Banner show={count > 0} />
<button onClick={() => setCount(count + 1)}>New message</button>
<p>Wrong: {count && <b>{count} new</b>}</p>
<p>Right: {count > 0 && <b>{count} new</b>}</p>`,
    output: <RenderNothingDemo />,
  },
  {
    q: 'How do you import images and other static assets in a Vite React app?',
    level: 'Basics',
    a: 'For files inside src, I import them like modules: import logo from \'./assets/logo.png\' gives me the final URL, and Vite adds a hash to the file name so browsers can cache it forever. Files in the public folder are copied as they are and I use an absolute path like /hero.jpg, which is good for files that need a fixed name, like robots.txt. I always give images a meaningful alt text.',
    code: `import logo from './assets/logo.png' // becomes a URL string

function Header() {
  return (
    <>
      <img src={logo} alt="Company logo" />
      <img src="/hero.jpg" alt="Hero banner" /> {/* public/hero.jpg */}
    </>
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
  main.jsx          // createRoot + providers
  App.jsx           // routes and layout
  components/       // shared UI: Button, Modal
  hooks/            // useDebounce, useLocalStorage
  pages/            // route-level components
  utils/            // helpers, constants
  features/
    auth/           // LoginForm.jsx, useAuth.js, authApi.js
    cart/           // CartPage.jsx, cartStore.js, CartPage.test.jsx`,
    output: `Small app   -> group by type (components, hooks, pages)
Growing app -> group by feature (auth, cart, profile)
Rule of thumb: files that change together live together.`,
  },
  {
    q: 'What are hooks in React, and what types of hooks are there?',
    level: 'Basics',
    a: "Hooks are special functions whose names start with \"use\" that let function components use React features like state, side effects, context and refs, without writing a class. There are two types: built-in hooks that React gives us, like useState and useEffect, and custom hooks that I write myself by combining built-in hooks so I can reuse logic. I follow the rules of hooks: call them only at the top level of a component or custom hook, never inside loops or conditions.",
    code: `// Built-in hook: provided by React
const [count, setCount] = useState(0)

// Custom hook: my own function built from built-in hooks
function useSwitch() {
  const [isOn, setIsOn] = useState(false)
  return [isOn, () => setIsOn(!isOn)]
}
const [isOn, toggle] = useSwitch()

<button onClick={() => setCount(count + 1)}>Count: {count}</button>
<button onClick={toggle}>{isOn ? 'ON' : 'OFF'}</button>`,
    output: <HooksIntroDemo />,
  },
  {
    q: 'What built-in hooks does React have?',
    level: 'Basics',
    a: 'I group them by job. useState and useReducer hold state, useContext reads context, useRef and useImperativeHandle work with refs, and useEffect, useLayoutEffect and useInsertionEffect run effects. For performance there are useMemo, useCallback, useTransition and useDeferredValue, and there are helpers like useId, useDebugValue and useSyncExternalStore. React 19 added useActionState, useOptimistic, the use() API, and useFormStatus in react-dom, and 19.2 added useEffectEvent.',
    code: `const [count, setCount] = useState(0)                // state
const [state, dispatch] = useReducer(reducer, init)
const theme = useContext(ThemeContext)               // context
const inputRef = useRef(null)                        // refs
useEffect(() => { /* after paint */ }, [deps])       // effects
useLayoutEffect(() => { /* before paint */ }, [deps])
const total = useMemo(() => calc(items), [items])    // performance
const onSave = useCallback(() => save(id), [id])
const [isPending, startTransition] = useTransition()
const id = useId()                                   // other
const [result, formAction, pending] = useActionState(action, init) // React 19
const user = use(userPromise)`,
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

const [isOpen, toggle] = useToggle()
<button onClick={toggle}>{isOpen ? 'Close' : 'Open'} menu</button>
{isOpen && <ul><li>Profile</li><li>Logout</li></ul>}`,
    output: <ToggleOpenDemo />,
  },

  // ---------- Hooks ----------
  {
    q: 'useState and functional updates',
    level: 'Intermediate',
    a: 'useState returns the current value and a setter. The setter does not change the value immediately; the new value shows up on the next render. So if I update based on the previous value, I pass a function like setCount(c => c + 1). In this demo, the "wrong" button adds only 1 because both calls read the same old count.',
    code: `const [count, setCount] = useState(0)

const addTwoWrong = () => {
  setCount(count + 1)
  setCount(count + 1) // same old count -> only +1
}

const addTwoRight = () => {
  setCount((c) => c + 1)
  setCount((c) => c + 1) // latest value -> +2
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
  console.log('Child rendered') // not when you type
  return <button onClick={onClick}>Child button</button>
})

const [count, setCount] = useState(0)
const [text, setText] = useState('')
const handleClick = useCallback(() => setCount((c) => c + 1), [])

<input value={text} onChange={(e) => setText(e.target.value)} />
<Child onClick={handleClick} />
<p>Count: {count}</p>`,
    output: <CallbackDemo />,
  },
  {
    q: 'What is the Context API / useContext?',
    level: 'Intermediate',
    a: 'Context lets me share data like the theme, the logged-in user or the language with many components without passing props through every level. That passing through many levels is called prop drilling. I create a context, wrap the tree in a Provider, and read the value with useContext anywhere below. I avoid putting fast-changing data in context because every consumer re-renders when it changes.',
    code: `const ThemeContext = createContext('light')

function ThemedButton() {
  const theme = useContext(ThemeContext) // no theme prop needed
  return <button>I am {theme}</button>
}

const [theme, setTheme] = useState('light')
<ThemeContext.Provider value={theme}>
  <ThemedButton />
</ThemeContext.Provider>
<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Switch</button>`,
    output: <ContextDemo />,
  },
  {
    q: 'What is useReducer?',
    level: 'Intermediate',
    a: 'useReducer is an alternative to useState for more complex state. I write a reducer function that takes the current state and an action and returns the new state, and I call dispatch with an action. I reach for it when many pieces of state change together or the update logic has many cases, because all the logic lives in one place.',
    code: `function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 }
    case 'reset': return { count: 0 }
    default: return state
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 })
<p>Count: {state.count}</p>
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
  const toggle = () => setOn(!on)
  return [on, toggle]
}

// each call gets its own separate state
const [isOpen, toggleOpen] = useToggle()
const [isDark, toggleDark] = useToggle(true)
<button onClick={toggleOpen}>Menu: {isOpen ? 'Open' : 'Closed'}</button>
<button onClick={toggleDark}>Dark: {isDark ? 'On' : 'Off'}</button>`,
    output: <CustomHookDemo />,
  },
  {
    q: 'What are the rules of hooks?',
    level: 'Intermediate',
    a: 'There are two rules. First, I only call hooks at the top level of a component or custom hook, never inside loops, conditions or nested functions, because React relies on the call order to match state with each hook. Second, I only call hooks from React function components or custom hooks, not from normal JavaScript functions. The ESLint or oxlint rules-of-hooks rule catches these mistakes for me.',
    code: `// Wrong: hook inside a condition
if (isAdmin) {
  const [perms, setPerms] = useState([])
}

// Right: call the hook every render, check the condition after it
const [perms, setPerms] = useState([])
if (!isAdmin) return null`,
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
    a: 'If the initial value is expensive to compute, like reading localStorage or building a big list, I pass a function to useState instead of the value. React calls that function only on the first render, while useState(readSavedNote()) would run the read on every render and throw the result away. The tip is to pass the function itself, useState(readSavedNote), not the result of calling it.',
    code: `function readSavedNote() {
  return localStorage.getItem('note') ?? ''
}

// Wrong: runs on EVERY render
const [note, setNote] = useState(readSavedNote())

// Right: runs only on the FIRST render
const [note, setNote] = useState(readSavedNote)

<input value={note} onChange={(e) => setNote(e.target.value)} />`,
    output: <LazyInitDemo />,
  },
  {
    q: 'Derived state vs duplicated state',
    level: 'Intermediate',
    a: 'If a value can be calculated from existing props or state, I calculate it during render instead of storing it in another useState. Keeping a copy, like a separate total state, means I have to keep it in sync, usually with an effect, and it easily goes out of date. Deriving it keeps one source of truth; if the calculation is expensive I wrap it in useMemo.',
    code: `const [items, setItems] = useState([
  { name: 'Pen', price: 10 },
  { name: 'Book', price: 150 },
])

// Bad: a second total state kept in sync by an effect
// Good: derive it during render
const total = items.reduce((sum, item) => sum + item.price, 0)

<p>Total: Rs {total}</p>
<button onClick={() => setItems([...items, { name: 'Bag', price: 500 }])}>Add bag</button>`,
    output: <DerivedStateDemo />,
  },
  {
    q: 'What are common useEffect mistakes?',
    level: 'Intermediate',
    a: 'The most common ones I watch for are missing dependencies, which give stale values, and setting state that is also a dependency, which creates an infinite loop. Another one is putting an object or array created during render in the dependency array: it is a new reference every render, so the effect runs every time. I fix that by depending on primitive values, moving the object inside the effect, or using useMemo, and I always ask whether I need an effect at all.',
    code: `// 1. Missing dependency -> stale userId (fix: [userId])
useEffect(() => { fetchUser(userId) }, [])

// 2. Infinite loop: the effect updates its own dependency
useEffect(() => { setCount(count + 1) }, [count])

// 3. Object dependency: a new object every render (fix: use primitives)
useEffect(() => { load(options) }, [options])

// 4. No cleanup: listeners pile up
useEffect(() => { window.addEventListener('resize', onResize) }, [])`,
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
    code: `function Tooltip({ text }) {
  const ref = useRef(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    setHeight(ref.current.offsetHeight) // measure before the paint
  }, [])

  return <div ref={ref} style={{ position: 'absolute', top: -height }}>{text}</div>
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
    a: 'Both mark some updates as low priority, so typing stays smooth while a slow part of the UI catches up. useTransition gives me startTransition to wrap a state update I control, plus an isPending flag. useDeferredValue gives me a lagging copy of a value; I pass that copy to the slow, memoized component, so the input updates right away and the big list follows a moment later, like in this demo.',
    code: `const SlowList = memo(function SlowList({ query }) {
  const items = bigList.filter((item) => item.includes(query))
  return <ul>{items.slice(0, 20).map((i) => <li key={i}>{i}</li>)}</ul>
})

const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query) // lags behind while busy

<input value={query} onChange={(e) => setQuery(e.target.value)} />
<SlowList query={deferredQuery} />`,
    output: <DeferredDemo />,
  },
  {
    q: 'How do you pass a ref to a child? forwardRef vs ref as a prop (React 19)',
    level: 'Intermediate',
    a: 'Before React 19, a function component could not receive ref as a normal prop, so I had to wrap it in forwardRef. In React 19, ref is just a prop: I destructure it and attach it to the inner DOM element. I use this for reusable inputs or buttons where the parent needs to focus or measure the real DOM node.',
    code: `// Before React 19: forwardRef
const MyInput = forwardRef((props, ref) => <input ref={ref} {...props} />)

// React 19: ref is a normal prop
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />
}

const inputRef = useRef(null)
<MyInput ref={inputRef} placeholder="Search" />
<button onClick={() => inputRef.current.focus()}>Focus input</button>`,
    output: <RefAsPropDemo />,
  },
  {
    q: 'What is useImperativeHandle?',
    level: 'Intermediate',
    a: 'useImperativeHandle lets a child decide exactly what the parent gets through its ref, instead of exposing the whole DOM node. I return an object with only the methods I want, like clear here, or focus. I use it rarely, for things like inputs, modals or video players; for most cases passing props is the better React way.',
    code: `function FancyInput({ ref }) {
  const inputRef = useRef(null)
  useImperativeHandle(ref, () => ({
    clear: () => { inputRef.current.value = '' },
  }))
  return <input ref={inputRef} defaultValue="Hello" />
}

const fancyRef = useRef(null)
<FancyInput ref={fancyRef} />
<button onClick={() => fancyRef.current.clear()}>Clear</button>`,
    output: <ImperativeDemo />,
  },
  {
    q: 'How do you cancel a fetch in useEffect with AbortController?',
    level: 'Intermediate',
    a: 'I create an AbortController inside the effect, pass controller.signal to fetch, and call controller.abort() in the cleanup. When the id changes or the component unmounts, the old request is really cancelled, not just ignored, so it cannot overwrite newer data. In the catch I check err.name === \'AbortError\' so a cancelled request is not shown to the user as an error.',
    code: `const [id, setId] = useState(1)
const [post, setPost] = useState(null)

useEffect(() => {
  const controller = new AbortController()
  fetch('https://jsonplaceholder.typicode.com/posts/' + id, { signal: controller.signal })
    .then((res) => res.json())
    .then(setPost)
    .catch((err) => { if (err.name !== 'AbortError') alert(err.message) })
  return () => controller.abort() // cancel on id change or unmount
}, [id])

<button onClick={() => setId(id + 1)}>Next post</button>
<p>{post?.title}</p>`,
    output: <AbortFetchDemo />,
  },
  {
    q: 'How do you write a useLocalStorage custom hook?',
    level: 'Intermediate',
    a: 'The hook works like useState but also saves the value to localStorage. I read the saved value once with a lazy initializer and JSON.parse, and write it back with JSON.stringify in an effect whenever the key or value changes. In production code I also wrap the storage calls in try/catch, because storage can be full or blocked in private mode, and the hook should then just work in memory.',
    code: `function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved !== null ? JSON.parse(saved) : initialValue
  })
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value])
  return [value, setValue]
}

const [name, setName] = useLocalStorage('name', '')
<input value={name} onChange={(e) => setName(e.target.value)} />`,
    output: <LocalStorageHookDemo />,
  },
  {
    q: 'How do you close a dropdown when the user clicks outside? (useOnClickOutside)',
    level: 'Intermediate',
    a: 'I put a ref on the dropdown wrapper and add a mousedown listener on the document inside an effect. If the click target is not inside ref.current, I call the close handler, and the cleanup removes the listener. If the handler is a new function every render, the effect re-subscribes each time; that works, but I can wrap it in useCallback to avoid it. I usually close on the Escape key too.',
    code: `function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (!ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

const [open, setOpen] = useState(false)
const ref = useRef(null)
useOnClickOutside(ref, () => setOpen(false))

<div ref={ref}>
  <button onClick={() => setOpen(!open)}>Menu</button>
  {open && <p>Profile · Logout</p>}
</div>`,
    output: <ClickOutsideDemo />,
  },
  {
    q: 'How do you build a textarea with a character counter?',
    level: 'Intermediate',
    a: 'In React a textarea is controlled just like an input: I pass value and onChange instead of putting text between the tags. The remaining count is derived from text.length during render, so I do not need a second state for it. I also set maxLength so the browser blocks extra typing, and change the color when the user gets close to the limit.',
    code: `const [text, setText] = useState('')
const left = 100 - text.length // derived, not stored

<textarea value={text} maxLength={100} onChange={(e) => setText(e.target.value)} />
<p style={{ color: left < 10 ? 'red' : 'gray' }}>{left} characters left</p>`,
    output: <CharCounterDemo />,
  },
  {
    q: 'How do you build dependent dropdowns (country and city)?',
    level: 'Intermediate',
    a: 'I keep only the selected country and city in state, and derive the list of city options from the country during render. When the country changes, I reset the city in the same change handler, not in a useEffect, so there is no extra render and no invalid city left behind.',
    code: `const CITIES = { India: ['Kochi', 'Mumbai'], USA: ['New York', 'Austin'] }

const [country, setCountry] = useState('India')
const [city, setCity] = useState('Kochi')
const changeCountry = (e) => {
  setCountry(e.target.value)
  setCity(CITIES[e.target.value][0]) // reset the city in the same event
}

<select value={country} onChange={changeCountry}>
  {Object.keys(CITIES).map((c) => <option key={c}>{c}</option>)}
</select>
<select value={city} onChange={(e) => setCity(e.target.value)}>
  {CITIES[country].map((c) => <option key={c}>{c}</option>)}
</select>`,
    output: <DependentSelectDemo />,
  },
  {
    q: 'How do you paginate a list?',
    level: 'Intermediate',
    a: 'I keep only the current page number in state and derive the rest: the total pages with Math.ceil and the visible items with slice. Prev and Next are disabled at the edges so the page can never go out of range. With a real API I send page and limit to the server instead of slicing, and I often keep the page in the URL so refresh and the back button work.',
    code: `const ITEMS = Array.from({ length: 23 }, (_, i) => 'Item ' + (i + 1))
const PAGE_SIZE = 5

const [page, setPage] = useState(1)
const totalPages = Math.ceil(ITEMS.length / PAGE_SIZE)
const visible = ITEMS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

<ul>{visible.map((item) => <li key={item}>{item}</li>)}</ul>
<button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
<span> Page {page} of {totalPages} </span>
<button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>`,
    output: <PaginationDemo />,
  },
  {
    q: 'How do you build a list with search, filter and sort?',
    level: 'Intermediate',
    a: 'I keep only the inputs in state, here the search query and the sort order, and derive the visible list in one chain: filter, then sort. I never store the filtered list in state, because it would get out of sync with the source data. filter returns a new array, so sorting it does not mutate the original; a category filter is just one more .filter in the chain. For big lists I wrap the chain in useMemo, and with an API I send these values as query params.',
    code: `const PRODUCTS = [
  { name: 'Laptop', price: 900 },
  { name: 'Desk', price: 200 },
  { name: 'Lamp', price: 40 },
]

const [query, setQuery] = useState('')
const [byPrice, setByPrice] = useState(false)
const visible = PRODUCTS
  .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
  .sort((a, b) => (byPrice ? a.price - b.price : a.name.localeCompare(b.name)))

<input value={query} onChange={(e) => setQuery(e.target.value)} />
<button onClick={() => setByPrice(!byPrice)}>Sort by {byPrice ? 'name' : 'price'}</button>
<ul>{visible.map((p) => <li key={p.name}>{p.name} - Rs {p.price}</li>)}</ul>`,
    output: <SearchFilterSortDemo />,
  },
  {
    q: 'How do you build an accessible modal that closes on Escape and manages focus?',
    level: 'Intermediate',
    a: 'The simplest way is the native <dialog> element: showModal() opens it as a real modal, moves focus inside, closes it on Escape, and gives focus back to the button that opened it when it closes. I connect the title with aria-labelledby. If I build a custom modal instead, I have to do those parts myself: move focus in on open, listen for Escape in an effect with a cleanup, restore focus on close, add role="dialog" and aria-modal, and render it in a portal.',
    code: `const ref = useRef(null)

<button onClick={() => ref.current.showModal()}>Delete file</button>
<dialog ref={ref} aria-labelledby="dlg-title">
  <h2 id="dlg-title">Delete file?</h2>
  <button onClick={() => ref.current.close()}>Cancel</button>
</dialog>`,
    output: <AccessibleModalDemo />,
  },
  {
    q: 'How do you build a stopwatch with start, stop and reset?',
    level: 'Intermediate',
    a: 'I keep the seconds and a running flag in state, and start a setInterval in an effect only while running is true; the cleanup clears it on stop or unmount. I use a functional update, setSeconds(s => s + 1), so the interval never reads a stale value. Reset simply stops the timer and sets the time back to 0. For a precise stopwatch I would keep the start time in a ref and show Date.now() minus it, because intervals are not exact and can drift.',
    code: `const [seconds, setSeconds] = useState(0)
const [running, setRunning] = useState(false)

useEffect(() => {
  if (!running) return
  const id = setInterval(() => setSeconds((s) => s + 1), 1000)
  return () => clearInterval(id) // stop or unmount
}, [running])

<p>{seconds}s</p>
<button onClick={() => setRunning(!running)}>{running ? 'Stop' : 'Start'}</button>
<button onClick={() => { setRunning(false); setSeconds(0) }}>Reset</button>`,
    output: <StopwatchDemo />,
  },
  {
    q: 'How do you build a global store with Context and useReducer?',
    level: 'Intermediate',
    a: 'I put useReducer at the top and share both the state and dispatch through a context provider. Any component below can read the state or dispatch an action with useContext, often wrapped in a small custom hook like useCart, without prop drilling. It is basically a tiny Redux built into React; for larger apps with frequent updates I split the context or move to Zustand or Redux Toolkit to avoid extra re-renders.',
    code: `const CartContext = createContext(null)
function cartReducer(items, action) {
  return action.type === 'add' ? [...items, action.item] : items
}

function AddPen() {
  const { items, dispatch } = useContext(CartContext)
  const add = () => dispatch({ type: 'add', item: 'Pen' })
  return <button onClick={add}>Add pen ({items.length} in cart)</button>
}

const [items, dispatch] = useReducer(cartReducer, [])
<CartContext.Provider value={{ items, dispatch }}>
  <AddPen />
</CartContext.Provider>`,
    output: <GlobalStoreDemo />,
  },
  {
    q: 'If useState can do everything, why do we need useReducer?',
    level: 'Intermediate',
    a: 'Both manage state, and anything I can do with one I can do with the other, so I choose by how complex the update logic is, not by capability. useReducer moves all the state transitions into one pure reducer function, and components only dispatch actions like add or remove, which is easier to read, test and keep consistent when several values change together under business rules. dispatch is also stable between renders, so I can pass it down to children without useCallback. For one or two independent values, useState stays simpler.',
    code: `// useState: every handler repeats the rules
// const add = () => setQty(Math.min(qty + 1, 5))

// useReducer: all the rules in one pure, testable function
function qtyReducer(qty, action) {
  switch (action.type) {
    case 'add': return Math.min(qty + 1, 5)
    case 'remove': return Math.max(qty - 1, 1)
    default: return qty
  }
}
const [qty, dispatch] = useReducer(qtyReducer, 1)

<button onClick={() => dispatch({ type: 'remove' })}>-</button> {qty}
<button onClick={() => dispatch({ type: 'add' })}>+</button>`,
    output: <StateVsReducerDemo />,
  },
  {
    q: 'When should you use useCallback (and when not)?',
    level: 'Intermediate',
    a: 'I use useCallback in three cases: when I pass a function to a child wrapped in React.memo, when a function is a dependency of a useEffect so the effect does not re-run after every render or loop, and when a custom hook returns functions that its users may put in their own dependencies. In the demo, the effect runs only when query changes, not when I toggle the theme; without useCallback, search would be a new function every render and the effect would run every time. I do not wrap every handler, because useCallback itself costs memory and comparisons and gives nothing when the child is cheap or not memoized.',
    code: `const [query, setQuery] = useState('react')
const [dark, setDark] = useState(false)

// the same function until query changes
const search = useCallback(() => console.log('search', query), [query])

useEffect(() => {
  search() // runs when query changes, not when the theme changes
}, [search])

<input value={query} onChange={(e) => setQuery(e.target.value)} />
<button onClick={() => setDark(!dark)}>Toggle theme</button>`,
    output: <CallbackEffectDemo />,
  },
  {
    q: 'useEffect vs useCallback: what is the difference?',
    level: 'Intermediate',
    a: 'They solve different problems. useEffect runs code after the render is committed, for side effects like fetching, subscriptions or timers, and it can return a cleanup. useCallback runs nothing by itself; it only returns the same function reference between renders until its dependencies change. They are often used together: I wrap a function in useCallback so I can safely list it as a useEffect dependency.',
    code: `// useCallback: remembers the function, does NOT call it
const loadUser = useCallback(() => fetchUser(userId), [userId])

// useEffect: actually runs the side effect after render
useEffect(() => {
  loadUser().then(setUser)
}, [loadUser]) // re-runs only when userId changes`,
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
    code: `const [email, setEmail] = useState('')
const [touched, setTouched] = useState(false)
const error = email.includes('@') ? '' : 'Enter a valid email' // real-time
const handleSubmit = (e) => {
  e.preventDefault()
  setTouched(true) // on submit: show all errors
}

<form onSubmit={handleSubmit}>
  <input value={email} onChange={(e) => setEmail(e.target.value)}
    onBlur={() => setTouched(true)} />
  {touched && error && <p className="error">{error}</p>}
  <button>Sign up</button>
</form>`,
    output: <ValidationTimingDemo />,
  },
  {
    q: 'What is React Hook Form and why use it?',
    level: 'Intermediate',
    a: "React Hook Form is a small library for forms. I register each input with register(), and handleSubmit runs validation before calling my submit function, with errors available in formState.errors. It keeps inputs uncontrolled, so typing doesn't re-render the whole form, which makes big forms fast. For complex rules I pair it with a schema library like Zod through a resolver.",
    code: `import { useForm } from 'react-hook-form'

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const onSubmit = (data) => alert(JSON.stringify(data))

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: 'Email is required' })} />
      {errors.email && <p>{errors.email.message}</p>}
      <button>Sign up</button>
    </form>
  )
}`,
    output: <HookFormDemo />,
  },

  // ---------- Advanced ----------
  {
    q: 'When does a component re-render?',
    level: 'Advanced',
    a: 'A component re-renders when its own state changes, when its parent re-renders, or when a context it uses changes. Note that a child re-renders when the parent does, even if its props did not change. Re-rendering is usually cheap; I only optimize with React.memo when it actually causes slowness.',
    code: `function Child() {
  console.log('Child rendered') // on every parent render
  return <p>Child</p>
}

const [count, setCount] = useState(0)
<button onClick={() => setCount(count + 1)}>Parent count: {count}</button>
<Child />`,
    output: <RerenderDemo />,
  },
  {
    q: 'What is React.memo?',
    level: 'Advanced',
    a: 'React.memo wraps a component and skips re-rendering it when its props are the same as last time (it does a shallow comparison). It is useful for components that render often with the same props or are expensive to render. If I pass objects or functions as props, I also need useMemo or useCallback, otherwise the props look new every time.',
    code: `const MemoUser = memo(function MemoUser({ name }) {
  console.log('MemoUser rendered') // only when name changes
  return <p>User: {name}</p>
})

const [count, setCount] = useState(0)
<button onClick={() => setCount(count + 1)}>Count: {count}</button>
<MemoUser name="Anu" />`,
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
    a: 'An error boundary is a component that catches JavaScript errors in its child tree during rendering and shows a fallback UI instead of a blank screen. They still have to be class components using getDerivedStateFromError, plus componentDidCatch if I want to log the error. They do not catch errors in event handlers or async code, so I use try/catch there. In the demo, the counter throws at 3 and the boundary shows a fallback.',
    code: `class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    return this.state.hasError ? <p>Something went wrong.</p> : this.props.children
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
    <div className="modal">
      Rendered in document.body <button onClick={onClose}>Close</button>
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
  // two updates -> only ONE re-render (also inside timeouts and promises)
}`,
    output: <BatchingDemo />,
  },
  {
    q: 'What is reconciliation and how does the key prop affect it?',
    level: 'Advanced',
    a: 'Reconciliation is the process where React compares the new element tree with the old one to decide what to update. If the type and key of an element stay the same, React keeps the component and its state; if the key changes, React throws the old one away and creates a fresh one. I use this on purpose to reset a form: giving it key={userId} resets its state when the user changes.',
    code: `function NameInput() {
  const [text, setText] = useState('')
  return <input value={text} onChange={(e) => setText(e.target.value)} />
}

const [user, setUser] = useState('Anu')
<button onClick={() => setUser('Anu')}>Anu</button>
<button onClick={() => setUser('Ravi')}>Ravi</button>
<p>Note for {user}:</p>
<NameInput key={user} /> {/* new key = new component = fresh state */}`,
    output: <KeyResetDemo />,
  },
  {
    q: 'HOCs vs custom hooks?',
    level: 'Advanced',
    a: 'A Higher-Order Component is a function that takes a component and returns a new component with extra props or behavior. A custom hook shares the same logic but just returns values, without wrapping anything. Today I prefer custom hooks because they are simpler, avoid "wrapper hell" in the component tree, and make it clear where each value comes from.',
    code: `// HOC: takes a component, returns a wrapped one with extra props
function withCounter(Wrapped) {
  return function WithCounter() {
    const [count, setCount] = useState(0)
    return <Wrapped count={count} onAdd={() => setCount(count + 1)} />
  }
}
const HocButton = withCounter(({ count, onAdd }) => <button onClick={onAdd}>HOC: {count}</button>)

// Custom hook: returns the values, no wrapper component
function useCounter() {
  const [count, setCount] = useState(0)
  return { count, onAdd: () => setCount(count + 1) }
}
const { count, onAdd } = useCounter()

<HocButton />
<button onClick={onAdd}>Hook: {count}</button>`,
    output: <HocVsHookDemo />,
  },
  {
    q: 'React Router basics',
    level: 'Advanced',
    a: 'React Router lets me map URLs to components in a single-page app without reloading the page. I wrap the app in BrowserRouter, define Routes with a path and an element, and use Link instead of <a> so navigation stays on the client. For dynamic parts like /users/5 I use a route param and read it with useParams.',
    code: `function User() {
  const { id } = useParams()
  return <p>User id: {id}</p>
}

<BrowserRouter>
  <Link to="/users/5">User 5</Link>
  <Routes>
    <Route path="/" element={<p>Home page</p>} />
    <Route path="/users/:id" element={<User />} />
  </Routes>
</BrowserRouter>`,
    output: `URL /          -> "Home page"
URL /users/5   -> "User id: 5"

Clicking a Link changes the URL without a full page reload.`,
  },
  {
    q: 'How do you fetch data in useEffect with loading and error states?',
    level: 'Advanced',
    a: 'I run the request inside useEffect with the id in the dependency array, and store the result or the error in state when it finishes. I use an ignore flag in the cleanup so a slow old response cannot overwrite a newer one (a race condition). Here I derive loading from whether the stored result matches the current id. In real projects I often use a library like TanStack Query, which handles caching and retries for me.',
    code: `const [userId, setUserId] = useState(1)
const [result, setResult] = useState({ id: null })
useEffect(() => {
  let ignore = false // ignore late, stale responses
  fakeFetchUser(userId) // fails for id 4
    .then((data) => { if (!ignore) setResult({ id: userId, data }) })
    .catch((err) => { if (!ignore) setResult({ id: userId, error: err.message }) })
  return () => { ignore = true }
}, [userId])

const loading = result.id !== userId
<button onClick={() => setUserId(userId + 1)}>Next user</button>
<p>{loading ? 'Loading...' : result.error || result.data.name}</p>`,
    output: <FetchDemo />,
  },
  {
    q: 'How do you build a debounced search input?',
    level: 'Advanced',
    a: 'Debouncing means waiting until the user stops typing for a short time before running the search, so I do not filter or call an API on every keystroke. I write a useDebounce hook that starts a timer in useEffect and clears it in the cleanup whenever the value changes. Only when the user pauses for the delay does the debounced value update, and that is the value I search with.',
    code: `function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

const [query, setQuery] = useState('')
const debouncedQuery = useDebounce(query, 500)
<input value={query} onChange={(e) => setQuery(e.target.value)} />
<p>Searching for: {debouncedQuery}</p>`,
    output: <DebounceDemo />,
  },
  {
    q: 'Why is using the index as a key a problem when reordering a list?',
    level: 'Advanced',
    a: 'With key={index}, React matches items by position, so after reordering it reuses the same component and DOM node for a different item. Anything kept inside that item, like input text, focus or local state, stays in the old position and ends up next to the wrong data. In the demo, after reversing, the index-keyed inputs no longer match their labels, while the id-keyed ones move correctly.',
    code: `const [items, setItems] = useState(['Apple', 'Banana', 'Cherry'])
<button onClick={() => setItems([...items].reverse())}>Reverse</button>

// Wrong: key = index, the typed text stays in the old position
{items.map((item, index) => (
  <p key={index}>{item} <input defaultValue={item} /></p>
))}

// Right: key = a stable id (here the unique name)
{items.map((item) => (
  <p key={item}>{item} <input defaultValue={item} /></p>
))}`,
    output: <ReorderKeysDemo />,
  },
  {
    q: 'What are Actions and useActionState in React 19?',
    level: 'Advanced',
    a: 'In React 19 I can pass an async function directly to a form action prop, and React handles the pending state and errors for me. useActionState wraps that function: it gives me the latest returned state, a formAction to pass to the form, and an isPending flag. The action receives the previous state and the FormData, so I do not need a useState for every field or manual loading flags.',
    code: `async function addToCart(prevCount, formData) {
  await wait(800) // pretend server call
  return prevCount + Number(formData.get('qty'))
}

const [count, formAction, isPending] = useActionState(addToCart, 0)

<form action={formAction}>
  <input name="qty" type="number" defaultValue="1" />
  <button disabled={isPending}>{isPending ? 'Adding...' : 'Add to cart'}</button>
  <p>Items in cart: {count}</p>
</form>`,
    output: <ActionStateDemo />,
  },
  {
    q: 'What is useOptimistic?',
    level: 'Advanced',
    a: 'useOptimistic lets me show the expected result immediately while the real request is still running, like showing a sent message or a liked heart right away. I give it the real state and an update function, and call addOptimistic inside an action. When the action finishes, React drops the optimistic value and shows the real state, so if the request fails the UI goes back automatically.',
    code: `const [likes, setLikes] = useState(0)
const [optimisticLikes, addOptimistic] = useOptimistic(likes, (n) => n + 1)

const likeAction = async () => {
  addOptimistic()   // shows instantly
  await wait(1500)  // pretend server call
  startTransition(() => setLikes((n) => n + 1))
}

<form action={likeAction}>
  <button>♥ {optimisticLikes}</button>
</form>`,
    output: <OptimisticDemo />,
  },
  {
    q: 'Server Components vs Client Components?',
    level: 'Advanced',
    a: 'Server Components run only on the server, so they can read the database or files directly and send zero JavaScript for themselves to the browser. Client Components are marked with "use client" and are the ones that can use state, effects and event handlers. My rule is to keep components on the server by default and push "use client" down to the small interactive leaves, like a like button. They need a framework such as Next.js; a plain Vite app like this one only has client components.',
    code: `// PostsPage.jsx: Server Component (the default)
export default async function PostsPage() {
  const posts = await db.post.findMany() // direct DB access
  return posts.map((post) => <LikeButton key={post.id} title={post.title} />)
}

// LikeButton.jsx: Client Component
'use client'
export default function LikeButton({ title }) {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>{title} {liked ? '♥' : '♡'}</button>
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
    a: 'Compound components are a group of components that work together and share state through a context, like Tabs, Tab and Panel. The parent owns the state, and the children read it with useContext, so the user of the component controls the layout with simple JSX instead of passing a big config object. Libraries like Radix UI and Headless UI use this pattern a lot.',
    code: `const TabsContext = createContext(null)
function Tabs({ children }) {
  const [active, setActive] = useState('profile')
  return <TabsContext value={{ active, setActive }}>{children}</TabsContext>
}
function Tab({ id }) {
  const { setActive } = useContext(TabsContext)
  return <button onClick={() => setActive(id)}>{id}</button>
}
function Panel({ id, children }) {
  const { active } = useContext(TabsContext)
  return active === id ? <p>{children}</p> : null
}

<Tabs>
  <Tab id="profile" /> <Tab id="settings" />
  <Panel id="profile">Name: Anu</Panel>
  <Panel id="settings">Theme: Dark</Panel>
</Tabs>`,
    output: <CompoundDemo />,
  },
  {
    q: 'What is the render props pattern?',
    level: 'Advanced',
    a: 'A render prop is a prop whose value is a function that returns JSX. The component handles the logic, like tracking the mouse, and calls that function with its data, so the parent decides what to render. Custom hooks have replaced most render props today, but I still see the pattern in libraries, for example in form and list components.',
    code: `function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  return (
    <div onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  )
}

<MouseTracker render={({ x, y }) => <p>Mouse at ({x}, {y})</p>} />`,
    output: <RenderPropsDemo />,
  },
  {
    q: 'Context vs Redux vs Zustand: how do you choose state management?',
    level: 'Advanced',
    a: 'I start with local useState and lifting state up, and use Context for values that change rarely, like the theme, the user or the language. For large shared client state with many updates I pick a store: Redux Toolkit when the team wants strict patterns and great DevTools, or Zustand when I want something tiny with almost no boilerplate. For server data I do not use any of these; I use TanStack Query, which handles caching, refetching and loading states.',
    code: `// Context: simple, but every consumer re-renders on change
const user = useContext(UserContext)

// Redux Toolkit: slices, actions, DevTools
const value = useSelector((s) => s.counter.value)

// Zustand: a tiny store, no provider needed
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
    q: 'What is Redux and what are store, actions and reducers?',
    level: 'Basics',
    a: 'Redux is a library that keeps global state in one place, outside my components. The store holds the state, an action is a plain object like { type: "add" } that describes what happened, and a reducer is a pure function that takes the current state and an action and returns the new state. Components never change state directly; they dispatch actions, which makes every change predictable and easy to trace in Redux DevTools.',
    code: `import { configureStore } from '@reduxjs/toolkit'

// Reducer: (state, action) => new state
function counter(state = 0, action) {
  return action.type === 'add' ? state + 1 : state
}
const store = configureStore({ reducer: counter })

store.subscribe(() => console.log(store.getState()))
store.dispatch({ type: 'add' }) // action
store.dispatch({ type: 'add' })`,
    output: `1
2`,
  },
  {
    q: 'What is Redux Toolkit and why use it instead of plain Redux?',
    level: 'Basics',
    a: 'Redux Toolkit is the official, recommended way to write Redux today. I use it because createSlice generates the reducer and the action creators in one place, so there are no separate action type constants or long switch statements. It uses Immer, so I can write simple "mutating" code safely, and configureStore sets up Redux DevTools and the thunk middleware for me.',
    code: `import { configureStore, createSlice } from '@reduxjs/toolkit'

// Plain Redux: action type, action creator, reducer, manual copies
const addTodo = (text) => ({ type: 'todos/add', payload: text })
function todos(state = [], action) {
  return action.type === 'todos/add' ? [...state, action.payload] : state
}

// Redux Toolkit: one slice gives the reducer and the actions
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: { add: (state, action) => { state.push(action.payload) } },
})
console.log(todosSlice.actions.add('Milk'))`,
    output: `{ type: 'todos/add', payload: 'Milk' }
// same action as plain Redux, with far less code`,
  },
  {
    q: 'How do you use createSlice, configureStore, useSelector and useDispatch?',
    level: 'Intermediate',
    a: 'I create a slice with a name, initial state and reducers, then add its reducer to configureStore and wrap the app in a Provider. In components I read data with useSelector and send actions with useDispatch. I keep selectors small, like (s) => s.counter, because the component re-renders only when the selected value changes.',
    code: `import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: { increment: (n) => n + 1 },
})
const store = configureStore({ reducer: { counter: counterSlice.reducer } })

function Counter() {
  const count = useSelector((s) => s.counter)
  const dispatch = useDispatch()
  return <button onClick={() => dispatch(counterSlice.actions.increment())}>Count: {count}</button>
}

<Provider store={store}><Counter /></Provider>`,
    output: <ReduxCounterDemo />,
  },
  {
    q: 'How does Redux Toolkit let you "mutate" state in reducers?',
    level: 'Intermediate',
    a: 'Redux Toolkit runs reducers through Immer. Immer gives me a draft copy of the state, records my changes like push or obj.done = true, and then builds a new immutable state for me. So the code looks like a mutation, but the old state is never changed. The one rule I follow is: either change the draft or return a new value, never both.',
    code: `import { configureStore, createSlice } from '@reduxjs/toolkit'

const todos = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    add: (state, action) => { state.push(action.payload) }, // Immer draft
    clear: () => [], // or return a new value
  },
})
const store = configureStore({ reducer: todos.reducer })
const before = store.getState()
store.dispatch(todos.actions.add('Milk'))
console.log(before, store.getState())`,
    output: `[] ['Milk']
// the old state is untouched; a new array was created`,
  },
  {
    q: 'How do you handle async logic with createAsyncThunk?',
    level: 'Intermediate',
    a: 'createAsyncThunk takes an action name and an async function, and dispatches pending, fulfilled or rejected actions for me as the promise runs. I handle those three in extraReducers to set a status like loading, done or error, and store the data. For plain data fetching I now usually prefer RTK Query, and keep thunks for async logic that is not just a request.',
    code: `import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const fetchUser = createAsyncThunk('user/fetch', () => wait(500).then(() => 'Asha'))
const user = createSlice({
  name: 'user',
  initialState: { name: '', status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchUser.pending, (s) => { s.status = 'loading' })
    b.addCase(fetchUser.fulfilled, (s, a) => { s.status = 'done'; s.name = a.payload })
    b.addCase(fetchUser.rejected, (s) => { s.status = 'error' })
  },
})
const store = configureStore({ reducer: user.reducer })
store.dispatch(fetchUser()).then(() => console.log(store.getState()))`,
    output: `user/fetch/pending   -> { name: '', status: 'loading' }
user/fetch/fulfilled -> { name: 'Asha', status: 'done' }
(if the promise fails: user/fetch/rejected -> status: 'error')`,
  },
  {
    q: 'What is the difference between client state and server state?',
    level: 'Basics',
    a: 'Client state belongs to the browser, like a modal being open, a selected tab or a form draft; it is synchronous and only my app changes it. Server state lives in a database and I only hold a copy of it, so it is async, can be changed by other users and can go stale. I keep client state in useState, Context or Redux, and manage server state with React Query or RTK Query, which handle caching, refetching and loading for me.',
    code: `// Client state: owned by the UI, always up to date
const [isOpen, setIsOpen] = useState(false)

// Server state: a cached copy of data on the server
const { data, isPending } = useQuery({ queryKey: ['todos'], queryFn: getTodos })`,
    output: `Client state -> isOpen, theme, selected tab, form input
               sync, owned by the app, never stale
Server state -> todos, users, orders from an API
               async, shared, can go stale -> needs caching and refetching`,
  },
  {
    q: 'What is RTK Query and how do you define an API with createApi?',
    level: 'Intermediate',
    a: 'RTK Query is the data fetching and caching tool built into Redux Toolkit. I describe my endpoints once with createApi, and it generates hooks like useGetUserQuery that give me data, isLoading and error, with caching and request de-duplication built in. In a real app I use fetchBaseQuery with a baseUrl and add api.reducer and api.middleware to my store; here fakeBaseQuery with a queryFn fakes the server.',
    code: `import { ApiProvider, createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

const api = createApi({
  baseQuery: fakeBaseQuery(), // real app: fetchBaseQuery({ baseUrl: '/api' })
  endpoints: (build) => ({
    getUser: build.query({ queryFn: () => wait(800).then(() => ({ data: 'Asha' })) }),
  }),
})

function User() {
  const { data, isLoading } = api.useGetUserQuery() // generated hook
  return <p>{isLoading ? 'Loading...' : 'Hello ' + data}</p>
}

<ApiProvider api={api}><User /></ApiProvider>`,
    output: <RtkQueryDemo />,
  },
  {
    q: 'How does RTK Query caching and invalidation work (providesTags / invalidatesTags)?',
    level: 'Advanced',
    a: 'RTK Query caches each query result, and components asking for the same data share one request. A query marks its data with providesTags, like Todo, and a mutation lists invalidatesTags; after the mutation succeeds, every query with that tag refetches automatically. This keeps the list up to date without me manually updating the cache or calling refetch.',
    code: `import { ApiProvider, createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

const todos = ['Learn Redux'] // fake in-memory DB
const api = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Todo'],
  endpoints: (build) => ({
    getTodos: build.query({ queryFn: () => ({ data: [...todos] }), providesTags: ['Todo'] }),
    addTodo: build.mutation({ queryFn: (t) => ({ data: todos.push(t) }), invalidatesTags: ['Todo'] }),
  }),
})

function Todos() {
  const { data = [] } = api.useGetTodosQuery()
  const [addTodo] = api.useAddTodoMutation()
  return <button onClick={() => addTodo('Task ' + data.length)}>Add: {data.join(', ')}</button>
}

<ApiProvider api={api}><Todos /></ApiProvider>`,
    output: <RtkTagsDemo />,
  },
  {
    q: 'What is React Query (TanStack Query) and how does useQuery work?',
    level: 'Intermediate',
    a: 'React Query is a library for server state: it fetches, caches and refetches data so I do not write useEffect plus loading and error state by hand. I wrap the app in a QueryClientProvider, then call useQuery with a queryKey, which is the cache key, and a queryFn that returns a promise. It gives me isPending, error and data, and every component using the same key shares one cached result.',
    code: `import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const fetchUser = () => wait(800).then(() => ({ name: 'Asha' })) // fake API
const client = new QueryClient()

function User() {
  const { data, isPending, error } = useQuery({ queryKey: ['user'], queryFn: fetchUser })
  if (isPending) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  return <p>Hello {data.name}</p>
}

<QueryClientProvider client={client}><User /></QueryClientProvider>`,
    output: <UseQueryDemo />,
  },
  {
    q: 'How do you update data with useMutation and invalidateQueries in React Query?',
    level: 'Intermediate',
    a: 'For creating, updating or deleting data I use useMutation with a mutationFn, and call mutate from an event handler. In onSuccess I call queryClient.invalidateQueries with the same key, so React Query marks the list as stale and refetches it. I also use isPending to disable the button while the request is running.',
    code: `import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const todos = ['Learn React Query'] // fake in-memory DB
const getTodos = () => wait(300).then(() => [...todos])
const addTodo = (text) => wait(300).then(() => todos.push(text))
const client = new QueryClient()

function Todos() {
  const queryClient = useQueryClient()
  const { data = [] } = useQuery({ queryKey: ['todos'], queryFn: getTodos })
  const add = useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })
  return <button onClick={() => add.mutate('Task ' + data.length)}>Add: {data.join(', ')}</button>
}

<QueryClientProvider client={client}><Todos /></QueryClientProvider>`,
    output: <MutationDemo />,
  },
  {
    q: 'What are staleTime and gcTime (cacheTime) in React Query?',
    level: 'Advanced',
    a: 'staleTime is how long data counts as fresh; while it is fresh React Query uses the cache and does not refetch. The default is 0, so data is stale at once and refetches in the background on mount or window focus. gcTime, called cacheTime before v5, is how long unused data stays in memory after the last component using it unmounts; the default is 5 minutes. I raise staleTime for data that rarely changes, like a country list, to avoid extra requests.',
    code: `useQuery({
  queryKey: ['todos'],
  queryFn: getTodos,
  staleTime: 60_000, // fresh for 1 minute: no refetch
  gcTime: 5 * 60_000, // unused data removed after 5 minutes
})`,
    output: `0s    first mount      -> fetch, data is fresh
30s   mount again      -> cached data, no request (still fresh)
90s   mount again      -> cached data shown at once + background refetch (stale)
unused for 5 minutes   -> cache entry removed (gcTime)`,
  },
  {
    q: 'React Query vs RTK Query vs Redux: when do you use which?',
    level: 'Advanced',
    a: 'I first split client state from server state. For server data I use React Query when the app has no Redux, and RTK Query when the app already uses Redux Toolkit, so everything lives in one store and one DevTools. I use plain Redux Toolkit slices only for shared client state, like a cart, filters or a multi-step form, and I avoid copying API data into slices by hand.',
    code: `// Server data, no Redux in the app -> React Query
const { data } = useQuery({ queryKey: ['todos'], queryFn: getTodos })

// Server data, app already uses Redux -> RTK Query
const { data } = api.useGetTodosQuery()

// Shared client state (cart, filters) -> Redux Toolkit slice
const items = useSelector((s) => s.cart.items)`,
    output: `React Query -> server state, any app, tiny setup, great caching
RTK Query   -> server state inside a Redux Toolkit app (one store, one DevTools)
Redux (RTK) -> complex shared client state: cart, filters, wizard steps
useState / Context -> local or rarely changing state (theme, user)`,
  },
  {
    q: 'How do you optimize performance in a React app?',
    level: 'Advanced',
    a: 'I always measure first with the React DevTools Profiler, so I fix the real slow part instead of guessing. Then I keep state close to where it is used, use React.memo, useMemo and useCallback only where re-renders are expensive, and split code with lazy and Suspense so the first load is smaller. For very long lists I use virtualization with a library like react-window or TanStack Virtual, which renders only the rows visible on screen.',
    code: `// 1. Code splitting per route
const Reports = lazy(() => import('./Reports'))

// 2. Skip re-renders of expensive children
const MemoRow = memo(Row)
const handleSelect = useCallback((id) => setSelected(id), [])

// 3. Cache expensive calculations
const sorted = useMemo(() => sortBig(items), [items])

// 4. Virtualize long lists: render only the visible rows
<FixedSizeList height={400} itemCount={10000} itemSize={35}>{Row}</FixedSizeList>`,
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
  render(<Counter />)
  await userEvent.click(screen.getByRole('button'))
  expect(screen.getByText('Clicked 1 times')).toBeInTheDocument()
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
    code: `function Quote({ promise }) {
  const text = use(promise) // suspends until the promise resolves
  return <p>{text}</p>
}

// the promise is created in an event handler, not during render
const [promise, setPromise] = useState(null)
const load = () => setPromise(wait(1000).then(() => 'Keep it simple.'))
<button onClick={load}>Load quote</button>
<Suspense fallback={<p>Loading...</p>}>
  {promise && <Quote promise={promise} />}
</Suspense>`,
    output: <UsePromiseDemo />,
  },
  {
    q: 'What are Server Actions (Server Functions)?',
    level: 'Advanced',
    a: 'A Server Action is an async function marked with \'use server\' that runs only on the server, but I can call it from the client, for example as a form action. The framework, like Next.js, turns the call into a POST request for me, so I do not write an API route or fetch code. Because it is still a public endpoint, I always validate the input and check auth inside the action, and on the client I use useActionState or useFormStatus to show pending state and errors.',
    code: `// actions.js
'use server'
export async function addComment(formData) {
  await db.comment.create({ data: { text: formData.get('text') } })
  revalidatePath('/post')
}

// page.jsx: the form calls the server function directly
<form action={addComment}>
  <input name="text" />
  <button>Comment</button>
</form>`,
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
    code: `// CSR (Vite): the browser builds the whole UI
createRoot(document.getElementById('root')).render(<App />)

// SSR: the server sends HTML, the browser hydrates it
const html = renderToString(<App />)                   // on the server
hydrateRoot(document.getElementById('root'), <App />)  // in the browser

// Hydration mismatch: server and client render different text
<p>{new Date().toLocaleTimeString()}</p>`,
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
<Route path="/posts/:id" element={<Post />} />

// Next.js: routes are folders, e.g. app/posts/[id]/page.jsx -> /posts/5
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
    code: `const [text, setText] = useState('')
const [query, setQuery] = useState('')
const [isPending, startTransition] = useTransition()

const handleChange = (e) => {
  setText(e.target.value)                          // urgent: the input updates now
  startTransition(() => setQuery(e.target.value))  // low priority, can be interrupted
}

<input value={text} onChange={handleChange} />
{isPending && <p>Updating...</p>}
<HugeList query={query} />`,
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
    code: `const Child = memo(function Child({ label, style }) {
  console.log(label + ' rendered')
  return <p style={style}>{label}</p>
})
const BLUE = { color: 'blue' } // created once, outside the component

const [count, setCount] = useState(0)
<button onClick={() => setCount(count + 1)}>Re-render parent ({count})</button>
<Child label="Inline style" style={{ color: 'blue' }} /> {/* new object: re-renders */}
<Child label="Stable style" style={BLUE} /> {/* same object: skipped */}`,
    output: <MemoPitfallDemo />,
  },
  {
    q: 'How do you make React components accessible?',
    level: 'Advanced',
    a: 'I start with semantic HTML: real buttons instead of clickable divs, labels connected to inputs with htmlFor and useId, and headings in order, which gives keyboard and screen reader support for free. For custom widgets I add ARIA attributes like aria-expanded, aria-invalid and aria-describedby, and role="alert" for error messages. I test with the keyboard only, a screen reader, and tools like axe or the jsx-a11y lint rules.',
    code: `const [open, setOpen] = useState(false)
const id = useId()

<button aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
  What is your refund policy?
</button>
<p id={id} hidden={!open}>30 days, no questions asked.</p>

<label htmlFor={id + '-email'}>Email</label>
<input id={id + '-email'} type="email" />`,
    output: <A11yDemo />,
  },
  {
    q: 'How does React protect against XSS, and when is dangerouslySetInnerHTML risky?',
    level: 'Advanced',
    a: 'React escapes every value I render with curly braces, so a string like <img onerror=...> shows up as plain text and never runs. The risk is dangerouslySetInnerHTML, which inserts raw HTML, so I only use it with HTML I trust or after sanitizing it with a library like DOMPurify. I also watch out for javascript: URLs in href built from user input, and never pass user input to eval.',
    code: `const text = '<img src=x onerror="alert(1)"> Hello'

// Safe: React escapes it, the tags show as plain text
<p>{text}</p>

// Dangerous: inserts raw HTML, the onerror script would run
// <p dangerouslySetInnerHTML={{ __html: text }} />

// If you must, sanitize first
// <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />`,
    output: <XssDemo />,
  },
  {
    q: 'How do environment variables work in Vite?',
    level: 'Advanced',
    a: 'Vite loads variables from .env files but exposes only the ones starting with VITE_ to my code, through import.meta.env instead of process.env. They are replaced at build time, so they end up inside the JavaScript bundle where anyone can read them; I never put secrets like private API keys there, those stay on a server. I use .env.development and .env.production for per-mode values, and .env.local for my own machine, which is git-ignored.',
    code: `# .env
VITE_API_URL=https://api.example.com
DB_PASSWORD=secret123   # not exposed: no VITE_ prefix

# .env.development
VITE_API_URL=http://localhost:3000

// src/api.js
const API_URL = import.meta.env.VITE_API_URL
console.log(import.meta.env.MODE)        // 'development' or 'production'
console.log(import.meta.env.DB_PASSWORD) // undefined`,
    output: `npm run dev    -> VITE_API_URL = http://localhost:3000, MODE = development
npm run build  -> VITE_API_URL = https://api.example.com, MODE = production
DB_PASSWORD    -> undefined (only VITE_ variables reach the browser)

VITE_ values are baked into the bundle: never put secrets there.`,
  },
  {
    q: 'Coding task: build a counter with undo and redo',
    level: 'Advanced',
    a: 'I store three things together: the past values, the present value and the future values. A new change pushes the present into past and clears future; undo moves the present into future and takes the last item from past; redo does the opposite. Keeping them in one state object (or a reducer) means they always update together, and I disable the buttons when there is nothing to undo or redo.',
    code: `const [history, setHistory] = useState({ past: [], present: 0, future: [] })
const { past, present, future } = history

const add = () =>
  setHistory({ past: [...past, present], present: present + 1, future: [] })
const undo = () =>
  setHistory({ past: past.slice(0, -1), present: past.at(-1), future: [present, ...future] })
const redo = () =>
  setHistory({ past: [...past, present], present: future[0], future: future.slice(1) })

<h2>{present}</h2>
<button onClick={add}>+1</button>
<button onClick={undo} disabled={!past.length}>Undo</button>
<button onClick={redo} disabled={!future.length}>Redo</button>`,
    output: <UndoRedoDemo />,
  },
  {
    q: 'Coding task: todo list with All / Active / Completed filters',
    level: 'Advanced',
    a: 'I store the todos and the current filter name in state, but never a separate filtered list; the visible todos are derived with todos.filter(FILTERS[filter]). Keeping the filter functions in an object makes adding a new filter a one-line change, and I can build the filter buttons from its keys. Counts like items left are derived the same way, so everything stays in sync automatically.',
    code: `const FILTERS = { all: () => true, active: (t) => !t.done, completed: (t) => t.done }
const [todos, setTodos] = useState([
  { id: 1, text: 'Learn React', done: true },
  { id: 2, text: 'Practice hooks', done: false },
])
const [filter, setFilter] = useState('all')
const toggle = (id) => setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

{Object.keys(FILTERS).map((f) => <button key={f} onClick={() => setFilter(f)}>{f}</button>)}
{todos.filter(FILTERS[filter]).map((t) => (
  <label key={t.id}>
    <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} /> {t.text}
  </label>
))}`,
    output: <FilteredTodoDemo />,
  },
  {
    q: 'Coding task: build a star rating component',
    level: 'Advanced',
    a: 'I make the component controlled: the parent owns the rating and passes value and onChange, while the hover preview is local state inside the stars. A star is filled when its number is less than or equal to the hovered star, or to the saved value when nothing is hovered. I use real buttons with an aria-label for each star, so it also works with the keyboard and screen readers.',
    code: `function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return [1, 2, 3, 4, 5].map((star) => (
    <button key={star} aria-label={star + ' stars'}
      onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
      onClick={() => onChange(star)}>
      {star <= (hover || value) ? '★' : '☆'}
    </button>
  ))
}

const [rating, setRating] = useState(3)
<StarRating value={rating} onChange={setRating} />
<p>You rated {rating} / 5</p>`,
    output: <StarRatingDemo />,
  },
  {
    q: 'Coding task: build an OTP input with auto-focus and paste',
    level: 'Advanced',
    a: 'I keep the digits in an array state and store a ref to every input in a refs array. On change I keep only the last typed character and move focus to the next box. I also handle paste, so pasting a full code fills all boxes at once, and I use inputMode="numeric" so phones show the number keyboard. In a real app I would also move focus back on Backspace and allow only digits.',
    code: `const [digits, setDigits] = useState(['', '', '', ''])
const inputs = useRef([])
const handleChange = (i, value) => {
  setDigits(digits.map((d, j) => (j === i ? value.slice(-1) : d)))
  if (value && i < 3) inputs.current[i + 1].focus() // auto-focus the next box
}
const handlePaste = (e) => {
  e.preventDefault()
  const pasted = e.clipboardData.getData('text')
  setDigits(digits.map((_, i) => pasted[i] || '')) // fill every box
}

{digits.map((d, i) => (
  <input key={i} value={d} inputMode="numeric" onPaste={handlePaste}
    ref={(el) => { inputs.current[i] = el }}
    onChange={(e) => handleChange(i, e.target.value)} />
))}`,
    output: <OtpDemo />,
  },
]
