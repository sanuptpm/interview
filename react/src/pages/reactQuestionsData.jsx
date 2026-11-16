// React interview questions used on the React page.
// Each item: { q, a, code, output }. `output` is either a live demo
// component (defined below, same logic as `code`) or a plain string.
// This data file intentionally keeps the small demo components next to the
// questions they illustrate, so the fast-refresh export rule is turned off here.
/* oxlint-disable react/only-export-components */

import {
  Children,
  cloneElement,
  Component,
  createContext,
  isValidElement,
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
  useSyncExternalStore,
} from 'react'
import { createPortal, flushSync, useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { ApiProvider, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { create } from 'zustand'
import axios, { AxiosError } from 'axios'
import {
  Link,
  MemoryRouter,
  Navigate,
  Route,
  Routes,
  UNSAFE_LocationContext as LocationContext,
  UNSAFE_RouteContext as RouteContext,
  useLocation,
  useNavigate,
} from 'react-router-dom'

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

function EmployeeChild({ sendData, sendEmployee }) {
  const employee = { id: 1, name: 'John', salary: 50000 }
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3">
      <h3 className="font-semibold">Child Component</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        <button className={btn} onClick={() => sendData('Hello from Child Component!')}>
          Send Data to Parent
        </button>
        <button className={btnLight} onClick={() => sendEmployee(employee)}>
          Send Employee
        </button>
      </div>
    </div>
  )
}

function ChildToParentDemo() {
  const [message, setMessage] = useState('')
  const [employee, setEmployee] = useState(null)
  const handleMessage = (data) => setMessage(data)
  return (
    <div className="space-y-2">
      <h2 className="font-bold">Parent Component</h2>
      <p>Message from child: {message}</p>
      <p>Employee from child: {employee ? employee.name + ' (salary ' + employee.salary + ')' : '-'}</p>
      <EmployeeChild sendData={handleMessage} sendEmployee={setEmployee} />
    </div>
  )
}

const useNotificationStore = create((set) => ({
  count: 0,
  notify: () => set((state) => ({ count: state.count + 1 })),
}))

function NotifyHeader() {
  const count = useNotificationStore((state) => state.count)
  return <p className="font-semibold">Header: {count} notifications</p>
}

function NotifyEmployee() {
  const notify = useNotificationStore((state) => state.notify)
  return (
    <button className={btn} onClick={notify}>
      Employee: send notification
    </button>
  )
}

function NotifyDashboard() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3">
      <p className="mb-2 text-slate-500">Dashboard</p>
      <NotifyEmployee />
    </div>
  )
}

function UnrelatedComponentsDemo() {
  return (
    <div className="space-y-2">
      <NotifyHeader />
      <NotifyDashboard />
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

// Fake REST API used by the data-fetching demos
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'
const fetchPosts = () =>
  fetch(POSTS_URL + '?_limit=3').then((res) => {
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return res.json()
  })
const createPost = (post) =>
  fetch(POSTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  }).then((res) => res.json())
const timeOf = (ms) => (ms ? new Date(ms).toLocaleTimeString() : '-')

function PostTitles({ posts }) {
  return (
    <ul className="ml-5 list-disc text-sm">
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  )
}

const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  endpoints: (build) => ({
    getPosts: build.query({ query: () => 'posts?_limit=3' }),
  }),
})

function RtkPosts() {
  const { data = [], isLoading, error } = postsApi.useGetPostsQuery()
  if (isLoading) return <p>Loading...</p>
  if (error) return <p className={errorCls}>Error: {error.status}</p>
  return <PostTitles posts={data} />
}

function RtkQueryDemo() {
  return (
    <ApiProvider api={postsApi}>
      <RtkPosts />
    </ApiProvider>
  )
}

const postTagsApi = createApi({
  reducerPath: 'postTagsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    getPosts: build.query({ query: () => 'posts?_limit=3', providesTags: ['Post'] }),
    addPost: build.mutation({
      query: (body) => ({ url: 'posts', method: 'POST', body }),
      invalidatesTags: ['Post'],
    }),
  }),
})

function RtkTagPosts() {
  const { data = [], fulfilledTimeStamp, isFetching } = postTagsApi.useGetPostsQuery()
  const [addPost, { data: saved, isLoading: saving }] = postTagsApi.useAddPostMutation()
  return (
    <div className="space-y-2">
      <button className={btn} disabled={saving} onClick={() => addPost({ title: 'New post', userId: 1 })}>
        {saving ? 'Saving...' : 'Add post'}
      </button>
      {saved && <p className="text-sm">Saved post id: {saved.id}</p>}
      <p className="text-sm text-slate-500">
        List {isFetching ? 'refetching...' : 'fetched at ' + timeOf(fulfilledTimeStamp)}
      </p>
      <PostTitles posts={data} />
    </div>
  )
}

function RtkTagsDemo() {
  return (
    <ApiProvider api={postTagsApi}>
      <RtkTagPosts />
    </ApiProvider>
  )
}

const postsClient = new QueryClient()

function RqPosts() {
  const { data, isPending, error } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts })
  if (isPending) return <p>Loading...</p>
  if (error) return <p className={errorCls}>Error: {error.message}</p>
  return <PostTitles posts={data} />
}

function UseQueryDemo() {
  return (
    <QueryClientProvider client={postsClient}>
      <RqPosts />
    </QueryClientProvider>
  )
}

const mutationClient = new QueryClient()

function RqTodos() {
  const queryClient = useQueryClient()
  const { data = [], dataUpdatedAt, isFetching } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts })
  const add = useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })
  return (
    <div className="space-y-2">
      <button
        className={btn}
        disabled={add.isPending}
        onClick={() => add.mutate({ title: 'New post', userId: 1 })}
      >
        {add.isPending ? 'Saving...' : 'Add post'}
      </button>
      {add.data && <p className="text-sm">Saved post id: {add.data.id}</p>}
      <p className="text-sm text-slate-500">
        List {isFetching ? 'refetching...' : 'fetched at ' + timeOf(dataUpdatedAt)}
      </p>
      <PostTitles posts={data} />
    </div>
  )
}

function MutationDemo() {
  return (
    <QueryClientProvider client={mutationClient}>
      <RqTodos />
    </QueryClientProvider>
  )
}

function DomUpdatesDemo() {
  const [count, setCount] = useState(0)
  const [log, setLog] = useState([])
  const box = useRef(null)

  // Watch the real DOM and log every change React makes to it
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const lines = mutations.map((m) => {
        if (m.type === 'characterData') return 'text node: "' + m.oldValue + '" -> "' + m.target.data + '"'
        if (m.type === 'attributes') return 'attribute: ' + m.attributeName + ' -> "' + m.target.getAttribute(m.attributeName) + '"'
        return 'nodes added: ' + m.addedNodes.length + ', removed: ' + m.removedNodes.length
      })
      setLog((old) => [...old, ...lines])
    })
    observer.observe(box.current, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
      characterDataOldValue: true,
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="space-y-2">
      <div ref={box}>
        <h3>Counter</h3>
        <p className={count % 2 ? 'odd' : 'even'}>Count: {count}</p>
      </div>
      <button className={btn} onClick={() => setCount(count + 1)}>
        +1
      </button>
      <pre className="text-xs">{log.length ? log.join('\n') : 'Click +1 to see the real DOM changes'}</pre>
    </div>
  )
}

function ClickCounter() {
  const [count, setCount] = useState(0)
  return (
    <button className={btnLight} onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}

function ReconcileDemo() {
  const [Wrapper, setWrapper] = useState('div')
  const [color, setColor] = useState('black')
  return (
    <div className="space-y-2">
      <p className="text-slate-500">Click the counter a few times first, then try both buttons.</p>
      <Wrapper style={{ color }}>
        <ClickCounter />
      </Wrapper>
      <div className="flex flex-wrap gap-2">
        <button className={btn} onClick={() => setColor(color === 'black' ? 'crimson' : 'black')}>
          Change color (same type)
        </button>
        <button className={btn} onClick={() => setWrapper(Wrapper === 'div' ? 'section' : 'div')}>
          Switch &lt;div&gt; / &lt;section&gt; (new type)
        </button>
      </div>
      <p className="text-sm">
        Wrapper: &lt;{Wrapper}&gt;, color: {color}
      </p>
    </div>
  )
}

// Add to the top of a list: the new item goes first in the new array
function AddToTopDemo() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Asha" },
    { id: 2, name: "Ravi" },
    { id: 3, name: "Meera" },
  ]);
  const [name, setName] = useState("Alex");
  const nextId = () => Math.max(0, ...employees.map((e) => e.id)) + 1;

  const addToTop = () => {
    if (!name.trim()) return;
    setEmployees((prev) => [{ id: nextId(), name: name.trim() }, ...prev]);
    setName("");
  };
  const addToBottom = () => {
    if (!name.trim()) return;
    setEmployees((prev) => [...prev, { id: nextId(), name: name.trim() }]);
    setName("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input
          className="rounded-lg border border-slate-300 px-2 py-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <button className={btn} onClick={addToTop}>
          Add to top
        </button>
        <button className={btnLight} onClick={addToBottom}>
          Add to bottom
        </button>
      </div>
      <ol className="list-decimal pl-6">
        {employees.map((e) => (
          <li key={e.id}>
            {e.name} <span className="text-xs text-slate-500">(id {e.id})</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------- Authentication, authorization & interceptors ---------------- */

// Authentication vs authorization: a fake "server" answers 401 (who are you?) or 403 (not allowed)
const AUTH_USERS = {
  guest: null,
  asha: { name: "Asha", role: "viewer" },
  ravi: { name: "Ravi", role: "admin" },
};

function checkRequest(user, action) {
  if (!user) return "401 Unauthorized: please log in"; // authentication failed
  if (action === "delete" && user.role !== "admin")
    return "403 Forbidden: admins only"; // authorization failed
  return action === "delete"
    ? "200 OK: post deleted"
    : "200 OK: here are the posts";
}

function AuthCheckDemo() {
  const [who, setWho] = useState("guest");
  const [log, setLog] = useState([]);
  const user = AUTH_USERS[who];
  const call = (action) =>
    setLog((prev) =>
      [
        `${user?.name ?? "Guest"} (${user?.role ?? "not logged in"}) -> ${action}: ${checkRequest(user, action)}`,
        ...prev,
      ].slice(0, 5),
    );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {Object.keys(AUTH_USERS).map((key) => (
          <button
            key={key}
            className={who === key ? btn : btnLight}
            onClick={() => setWho(key)}
          >
            {AUTH_USERS[key]
              ? `${AUTH_USERS[key].name} (${AUTH_USERS[key].role})`
              : "Guest"}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={btnLight} onClick={() => call("view")}>
          View posts
        </button>
        <button className={btnLight} onClick={() => call("delete")}>
          Delete post
        </button>
      </div>
      <ul className="space-y-1 font-mono text-xs">
        {log.map((line, i) => (
          <li key={log.length - i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

// Protected routes: AuthContext + a ProtectedRoute wrapper around the route element
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext value={{ user, login: setUser, logout: () => setUser(null) }}>
      {children}
    </AuthContext>
  );
}

function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();
  // Not logged in: go to /login and remember where the user wanted to go
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  // Logged in but wrong role
  if (roles && !roles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;
  return children;
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from || "/";
  const signIn = (user) => {
    login(user);
    navigate(from, { replace: true }); // back to the page they asked for
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span>Login page.</span>
      <button
        className={btnLight}
        onClick={() => signIn({ name: "Asha", role: "viewer" })}
      >
        Log in as Asha (viewer)
      </button>
      <button
        className={btnLight}
        onClick={() => signIn({ name: "Ravi", role: "admin" })}
      >
        Log in as Ravi (admin)
      </button>
    </div>
  );
}

function AuthNav() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  return (
    <nav className="flex flex-wrap items-center gap-3 text-sm">
      <Link className="text-indigo-600 underline" to="/">
        Home
      </Link>
      <Link className="text-indigo-600 underline" to="/dashboard">
        Dashboard
      </Link>
      <Link className="text-indigo-600 underline" to="/admin">
        Admin
      </Link>
      <span className="text-slate-500">URL: {pathname}</span>
      <span>{user ? `${user.name} (${user.role})` : "Guest"}</span>
      {user && (
        <button className={btnLight} onClick={logout}>
          Log out
        </button>
      )}
    </nav>
  );
}

function ProtectedRoutesDemo() {
  // This page already runs inside the site's router, and React Router doesn't allow a router
  // inside another one, so the demo resets the router context first (not needed in a real app).
  return (
    <LocationContext.Provider value={null}>
      <RouteContext.Provider
        value={{ outlet: null, matches: [], isDataRoute: false }}
      >
        <AuthProvider>
          <MemoryRouter>
            <div className="space-y-2">
              <AuthNav />
              <Routes>
                <Route path="/" element={<p>Home (public)</p>} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <p>Dashboard (any logged-in user)</p>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <p>Admin panel (admins only)</p>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/unauthorized"
                  element={<p>403: you don't have access to that page</p>}
                />
              </Routes>
            </div>
          </MemoryRouter>
        </AuthProvider>
      </RouteContext.Provider>
    </LocationContext.Provider>
  );
}

// Axios interceptors: add the token to every request, handle every error in one place
const postsHttp = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});
let httpToken = "abc123"; // set after login, kept in memory
let httpLog = () => {};

postsHttp.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer " + httpToken;
  config.startedAt = Date.now();
  httpLog(
    `request interceptor: ${config.method.toUpperCase()} ${config.url} + Authorization: Bearer ${httpToken}`,
  );
  return config;
});

postsHttp.interceptors.response.use(
  (response) => {
    httpLog(
      `response interceptor: ${response.status} in ${Date.now() - response.config.startedAt} ms`,
    );
    return response;
  },
  (error) => {
    const status = error.response?.status;
    httpLog(
      `error interceptor: ${status ?? "network error"}, handled in one place`,
    );
    if (status === 401) httpToken = null; // real app: log out and go to /login
    return Promise.reject(
      new Error(status === 404 ? "Post not found" : "Something went wrong"),
    );
  },
);

function InterceptorDemo() {
  const [lines, setLines] = useState([]);
  const load = async (id) => {
    httpLog = (line) => setLines((prev) => [...prev, line]);
    setLines([]);
    try {
      const { data } = await postsHttp.get("/posts/" + id);
      httpLog(`component: "${data.title}"`);
    } catch (err) {
      httpLog(`component: ${err.message}`);
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button className={btnLight} onClick={() => load(1)}>
          GET /posts/1
        </button>
        <button className={btnLight} onClick={() => load(9999)}>
          GET /posts/9999 (404)
        </button>
      </div>
      <ul className="space-y-1 font-mono text-xs">
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

// Refresh token on 401. jsonplaceholder has no auth, so a fake "server" (an axios adapter)
// checks the token first and then does the real request.
let serverTokenVersion = 1;
let refreshLog = () => {};
const fetchAdapter = axios.getAdapter("fetch");

async function fakeAuthServer(config) {
  await wait(300);
  if (config.url === "/refresh") {
    refreshLog(`server: POST /refresh -> new token-${serverTokenVersion}`);
    return {
      data: { accessToken: "token-" + serverTokenVersion },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  }
  const sent = config.headers.Authorization.replace("Bearer ", "");
  if (sent !== "token-" + serverTokenVersion) {
    refreshLog(`server: GET ${config.url} with ${sent} -> 401`);
    throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, null, {
      status: 401,
      data: {},
      headers: {},
      config,
    });
  }
  refreshLog(`server: GET ${config.url} with ${sent} -> 200`);
  return fetchAdapter(config);
}

const authHttp = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  adapter: fakeAuthServer,
});
let accessToken = "token-1"; // in memory; the refresh token would be an httpOnly cookie
let refreshing = null; // one shared refresh for all requests that fail at the same time
let refreshCount = 0;

authHttp.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer " + accessToken;
  return config;
});

authHttp.interceptors.response.use(undefined, async (error) => {
  const original = error.config;
  if (error.response?.status !== 401 || original._retry)
    return Promise.reject(error);
  original._retry = true; // retry only once, so we can't loop forever
  refreshing ??= authHttp
    .post("/refresh")
    .then((res) => {
      refreshCount++;
      accessToken = res.data.accessToken;
    })
    .finally(() => {
      refreshing = null;
    });
  await refreshing; // if refresh fails, this throws: real app logs out here
  refreshLog(`interceptor: retry ${original.url} with ${accessToken}`);
  return authHttp(original);
});

function RefreshTokenDemo() {
  const [lines, setLines] = useState([]);
  const [busy, setBusy] = useState(false);
  const loadThree = async () => {
    refreshLog = (line) => setLines((prev) => [...prev, line]);
    setLines([]);
    setBusy(true);
    try {
      const results = await Promise.all(
        [1, 2, 3].map((id) => authHttp.get("/posts/" + id)),
      );
      refreshLog(
        `component: loaded ${results.length} posts, refresh called ${refreshCount} time(s) so far`,
      );
    } catch (err) {
      refreshLog("component: " + err.message);
    }
    setBusy(false);
  };
  const expire = () => {
    serverTokenVersion++; // the server no longer accepts the old access token
    setLines([
      `server: token-${serverTokenVersion - 1} expired (the client still has ${accessToken})`,
    ]);
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button className={btn} disabled={busy} onClick={loadThree}>
          Load 3 posts at once
        </button>
        <button className={btnLight} disabled={busy} onClick={expire}>
          Expire access token
        </button>
      </div>
      <ul className="space-y-1 font-mono text-xs">
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

// useCallback with [] keeps the function from the first render, so it sees the first count forever
function EmptyDepsCallbackDemo() {
  const [count, setCount] = useState(0)
  const [log, setLog] = useState([])
  const show = (line) => setLog((prev) => [line, ...prev].slice(0, 4))

  // eslint-disable-next-line react-hooks/exhaustive-deps -- stale on purpose for the demo
  const readStale = useCallback(() => show(`[] deps reads count = ${count}`), [])
  const readFresh = useCallback(() => show(`[count] deps reads count = ${count}`), [count])
  // eslint-disable-next-line react-hooks/exhaustive-deps -- stale on purpose for the demo
  const addStale = useCallback(() => setCount(count + 1), []) // always 0 + 1
  const addSafe = useCallback(() => setCount((c) => c + 1), []) // updater: [] is fine

  return (
    <div className="space-y-2">
      <p>Count: {count}</p>
      <div className="flex flex-wrap gap-2">
        <button className={btn} onClick={addSafe}>+1 with updater ([] deps)</button>
        <button className={btnLight} onClick={addStale}>+1 with count + 1 ([] deps)</button>
        <button className={btnLight} onClick={readStale}>Read count ([] deps)</button>
        <button className={btnLight} onClick={readFresh}>Read count ([count] deps)</button>
      </div>
      <ul className="space-y-1 font-mono text-xs">
        {log.map((line, i) => (
          <li key={log.length - i}>{line}</li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------------- Coverage additions ---------------------- */

function DrillPage({ user }) {
  return <DrillHeader user={user} />
}

function DrillHeader({ user }) {
  return <DrillAvatar user={user} />
}

function DrillAvatar({ user }) {
  return <p>Hi, {user}</p>
}

function PropDrillingDemo() {
  const [user, setUser] = useState('Anu')
  return (
    <div className="space-y-2">
      <input className={inputCls} value={user} onChange={(e) => setUser(e.target.value)} />
      <DrillPage user={user} />
    </div>
  )
}

function DefaultValueDemo() {
  const nameRef = useRef(null)
  const termsRef = useRef(null)
  const [summary, setSummary] = useState('')
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <input className={inputCls} ref={nameRef} defaultValue="Anu" />
        <label className="flex items-center gap-1">
          <input ref={termsRef} type="checkbox" defaultChecked /> Accept terms
        </label>
        <button className={btn} onClick={() => setSummary(nameRef.current.value + ' / ' + termsRef.current.checked)}>
          Read
        </button>
      </div>
      <p>{summary}</p>
    </div>
  )
}

function RefCallbackDemo() {
  const [height, setHeight] = useState(0)
  const measureRef = useCallback((node) => {
    if (node) setHeight(Math.round(node.getBoundingClientRect().height))
  }, [])
  return (
    <div className="space-y-2">
      <p ref={measureRef} className="rounded bg-slate-100 p-3">
        Measure me
      </p>
      <p>Height: {height}px</p>
    </div>
  )
}

function subscribeResize(onChange) {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

function SyncExternalStoreDemo() {
  const width = useSyncExternalStore(subscribeResize, () => window.innerWidth, () => 0)
  return <p>Window width: {width}px (resize the window)</p>
}

function FlushSyncDemo() {
  const [items, setItems] = useState([1, 2, 3])
  const listRef = useRef(null)
  const add = () => {
    flushSync(() => setItems((s) => [...s, s.length + 1]))
    listRef.current.scrollTop = listRef.current.scrollHeight
  }
  return (
    <div className="space-y-2">
      <ul ref={listRef} className="rounded border border-slate-200 px-3" style={{ height: 80, overflow: 'auto' }}>
        {items.map((n) => (
          <li key={n}>Item {n}</li>
        ))}
      </ul>
      <button className={btn} onClick={add}>
        Add item
      </button>
    </div>
  )
}

function Steps({ children }) {
  const items = Children.toArray(children).filter(isValidElement)
  return items.map((child, i) => cloneElement(child, { children: 'Step ' + (i + 1) + ': ' + child.props.children }))
}

function ChildrenApiDemo() {
  return (
    <Steps>
      <p>Add to cart</p>
      plain text is skipped
      <p>Pay</p>
    </Steps>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button className={btn} disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  )
}

function FormStatusDemo() {
  return (
    <form action={() => wait(1000)} className="flex flex-wrap gap-2">
      <input className={inputCls} name="title" defaultValue="My note" />
      <SubmitButton />
    </form>
  )
}

/* ------------------------------- Zustand ------------------------------- */
const useDemoCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

function ZustandCounterDemo() {
  const count = useDemoCounterStore((state) => state.count)
  const increment = useDemoCounterStore((state) => state.increment)
  const decrement = useDemoCounterStore((state) => state.decrement)
  return (
    <div>
      <h2 className="text-2xl font-bold">{count}</h2>
      <div className="mt-2 flex gap-2">
        <button onClick={increment} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500">
          Increment
        </button>
        <button onClick={decrement} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50">
          Decrement
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">No Provider needed: the store is just a hook.</p>
    </div>
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
    q: 'What are defaultValue and defaultChecked?',
    level: 'Basics',
    a: 'defaultValue and defaultChecked set only the starting value of an uncontrolled input; after that the DOM owns the value and I read it with a ref or from FormData. If I set value without an onChange, React makes the input read-only and warns me, so for a simple prefilled field I use defaultValue instead. They work on select and textarea too.',
    code: `const nameRef = useRef(null)
const termsRef = useRef(null)
const [summary, setSummary] = useState('')

<input ref={nameRef} defaultValue="Anu" />
<label><input ref={termsRef} type="checkbox" defaultChecked /> Accept terms</label>
<button onClick={() => setSummary(nameRef.current.value + ' / ' + termsRef.current.checked)}>Read</button>
<p>{summary}</p>`,
    output: <DefaultValueDemo />,
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
    q: 'What is prop drilling and how do you avoid it?',
    level: 'Basics',
    a: 'Prop drilling is when I pass a prop through several components that do not use it, only so a deeply nested child can read it. It works, but every middle component has to change when the data changes. First I try composition, passing the finished child element down as children; for data that many parts need, like the user or theme, I use Context or a store.',
    code: `function App() {
  const [user, setUser] = useState('Anu')
  return <><input value={user} onChange={(e) => setUser(e.target.value)} /><Page user={user} /></>
}

// Page and Header never use user, they only pass it down
function Page({ user }) { return <Header user={user} /> }
function Header({ user }) { return <Avatar user={user} /> }
function Avatar({ user }) { return <p>Hi, {user}</p> }`,
    output: <PropDrillingDemo />,
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
    q: "Program: how do you add an element to the top of a list in React state?",
    level: "Basics",
    a: "I create a new array with the new item first and spread the old items after it: setEmployees([{ id: 4, name: 'Alex' }, ...employees]). Putting the spread last is what makes it go to the top; spreading first and adding after puts it at the bottom. I don't use unshift, because it changes the same array in place, and React compares the old and new array by reference, so it would see no change and not re-render. When the new value depends on the old list I use the functional form, setEmployees(prev => [newItem, ...prev]), so two quick clicks never lose an item. Each item gets a unique id and I use it as the key, so React keeps the existing rows and only inserts one new row at the top; with index keys every row would shift.",
    code: `const [employees, setEmployees] = useState([
  { id: 1, name: 'Asha' },
  { id: 2, name: 'Ravi' },
  { id: 3, name: 'Meera' },
])
const [name, setName] = useState('Alex')
const nextId = () => Math.max(0, ...employees.map((e) => e.id)) + 1

// New item first, then the old items: it goes to the top
const addToTop = () => {
  setEmployees((prev) => [{ id: nextId(), name }, ...prev])
  setName('')
}
// Old items first, then the new item: it goes to the bottom
const addToBottom = () => {
  setEmployees((prev) => [...prev, { id: nextId(), name }])
  setName('')
}

// Wrong: unshift mutates the same array, so React doesn't re-render
// employees.unshift({ id: 4, name: 'Alex' }); setEmployees(employees)

<input value={name} onChange={(e) => setName(e.target.value)} />
<button onClick={addToTop}>Add to top</button>
<button onClick={addToBottom}>Add to bottom</button>
<ol>
  {employees.map((e) => <li key={e.id}>{e.name} (id {e.id})</li>)}
</ol>`,
    output: <AddToTopDemo />,
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
    a: "React follows a unidirectional data flow, meaning data generally flows from parent to child through props. For child-to-parent communication, I pass a callback function from the parent to the child as a prop. The child invokes that callback with the required data, like a string, an object or several values, and the parent handles it, usually by updating its state, which re-renders the parent with the new data. I name these props like events, such as onSelect or sendData, so it's clear the child is reporting something up. If multiple unrelated components need to communicate, I would consider lifting state up, the Context API, or a global state management solution such as Zustand or Redux Toolkit.",
    code: `// Child: calls the callback it received through props
function Child({ sendData, sendEmployee }) {
  const employee = { id: 1, name: 'John', salary: 50000 }
  return (
    <div>
      <h3>Child Component</h3>
      <button onClick={() => sendData('Hello from Child Component!')}>Send Data to Parent</button>
      <button onClick={() => sendEmployee(employee)}>Send Employee</button>
    </div>
  )
}

// Parent: defines the callbacks and passes them down
function Parent() {
  const [message, setMessage] = useState('')
  const [employee, setEmployee] = useState(null)
  const handleMessage = (data) => setMessage(data)

  return (
    <div>
      <h2>Parent Component</h2>
      <p>Message from child: {message}</p>
      <p>Employee from child: {employee ? employee.name + ' (salary ' + employee.salary + ')' : '-'}</p>
      <Child sendData={handleMessage} sendEmployee={setEmployee} />
    </div>
  )
}

// Flow: Parent defines handleMessage -> passes it as sendData
//       -> Child calls sendData('Hello...') -> setMessage(data) -> Parent re-renders`,
    output: <ChildToParentDemo />,
  },
  {
    q: 'How do components that are not parent and child communicate?',
    level: 'Intermediate',
    a: "Callbacks only work between a direct parent and child. When two components are far apart, like an Employee inside a Dashboard that needs to update the Header, I pick the approach by how widely the data is shared. If they share a close common parent, I lift the state up to it and pass the value down and a callback to the other side. If many components in a subtree need it, I use the Context API to avoid prop drilling. For application-wide shared state I use Zustand or Redux Toolkit: here the Employee calls a store action and the Header reads the value, with no props or callbacks passed through Dashboard at all.",
    code: `//        App
//       /   \
//   Header  Dashboard
//              |
//           Employee   (Employee needs to update Header)

const useNotificationStore = create((set) => ({
  count: 0,
  notify: () => set((state) => ({ count: state.count + 1 })),
}))

function Header() {
  const count = useNotificationStore((state) => state.count)
  return <p>Header: {count} notifications</p>
}

function Employee() {
  const notify = useNotificationStore((state) => state.notify)
  return <button onClick={notify}>Employee: send notification</button>
}

function Dashboard() {
  return <div><p>Dashboard</p><Employee /></div> // no props passed through
}

function App() {
  return (
    <div>
      <Header />
      <Dashboard />
    </div>
  )
}

// Approach          When to use
// Callback props    Direct parent-child communication
// Lift state up     A few components with a close common parent share state
// Context API       Share state across a component tree (theme, user)
// Zustand / Redux   Application-wide shared state`,
    output: <UnrelatedComponentsDemo />,
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
    q: "How does React update the actual browser DOM?",
    level: 'Intermediate',
    a: "React never rebuilds the whole page. When state or props change, it first runs my components again to get a new virtual tree; this is the render phase and it doesn't touch the DOM. Then it reconciles: it compares the new tree with the previous one, element by element and by key, and works out the smallest list of changes, like 'change this text', 'update this class' or 'insert this list item'. In the commit phase, react-dom applies only those changes to the real DOM with normal DOM APIs, all in one batch so the user never sees a half-updated screen. After that React attaches refs, runs useLayoutEffect, the browser paints, and then useEffect runs. In this demo a MutationObserver shows that clicking +1 changes only one text node and one class attribute; the h3 and the 'Count: ' text are never touched.",
    code: `function DomUpdatesDemo() {
  const [count, setCount] = useState(0)
  const [log, setLog] = useState([])
  const box = useRef(null)

  // Watch the real DOM and log every change React makes to it
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const lines = mutations.map((m) => {
        if (m.type === 'characterData') return 'text node: "' + m.oldValue + '" -> "' + m.target.data + '"'
        if (m.type === 'attributes') return 'attribute: ' + m.attributeName + ' -> "' + m.target.getAttribute(m.attributeName) + '"'
        return 'nodes added: ' + m.addedNodes.length + ', removed: ' + m.removedNodes.length
      })
      setLog((old) => [...old, ...lines])
    })
    observer.observe(box.current, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
      characterDataOldValue: true,
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      <div ref={box}>
        <h3>Counter</h3>
        <p className={count % 2 ? 'odd' : 'even'}>Count: {count}</p>
      </div>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <pre>{log.length ? log.join('\\n') : 'Click +1 to see the real DOM changes'}</pre>
    </div>
  )
}

// Steps: setState -> render (new virtual tree) -> reconcile (diff)
//        -> commit (apply only the changes to the DOM) -> paint -> useEffect`,
    output: <DomUpdatesDemo />,
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
    q: "How would you structure a large React application?",
    level: 'Advanced',
    a: "I organise a large app into layers with clear jobs, and every business feature lives in its own module. app/ is the wiring that runs once: main.tsx and App.tsx, the router (it collects each module's routes.tsx, lazy-loads them and wraps private ones in ProtectedRoute), AppProviders with React Query and the theme, the layouts (MainLayout for logged-in pages, AuthLayout for login) and a global error boundary plus a 404 page. core/ holds the app-wide services there is exactly one of: the axios instance with interceptors and one error handler, auth (service, a Zustand store with the user and the in-memory token, and the useAuth hook), permissions with a <Can> component, constants, and config/env.ts, which reads and validates the VITE_ variables once. modules/ has dashboard, employees, attendance, payroll and recruitment, and each has the same shape: pages, components, services for API calls, React Query hooks, a store for UI state only like filters, Zod schemas, types, utils, tests and its own routes.tsx. shared/ is the UI kit and generic helpers with no business logic, one folder per component. The import rule keeps it maintainable: modules can use core and shared, but never another module's internals, and shared never imports app code. That way a team can work on payroll without touching employees, each module is lazy-loaded, and server data lives in React Query while Zustand only holds UI state.",
    code: `hr-payroll-app/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   │
│   │   ├── router/
│   │   │   ├── index.tsx
│   │   │   ├── routeConfig.ts
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── providers/
│   │   │   ├── AppProviders.tsx
│   │   │   ├── QueryProvider.tsx
│   │   │   └── ThemeProvider.tsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   └── components/
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── Footer.tsx
│   │   │
│   │   └── error/
│   │       ├── GlobalErrorBoundary.tsx
│   │       └── NotFound.tsx
│   │
│   ├── core/
│   │   ├── api/
│   │   │   ├── axiosInstance.ts
│   │   │   ├── apiEndpoints.ts
│   │   │   └── apiErrorHandler.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── authService.ts
│   │   │   ├── authStore.ts
│   │   │   ├── useAuth.ts
│   │   │   └── authTypes.ts
│   │   │
│   │   ├── permissions/
│   │   │   ├── permissions.ts
│   │   │   ├── permissionService.ts
│   │   │   └── Can.tsx
│   │   │
│   │   ├── constants/
│   │   │   └── appConstants.ts
│   │   │
│   │   ├── hooks/
│   │   │   └── useDebounce.ts
│   │   │
│   │   └── config/
│   │       └── env.ts
│   │
│   ├── modules/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── routes.tsx
│   │   │
│   │   ├── employees/
│   │   │   ├── pages/
│   │   │   │   ├── EmployeeList.tsx
│   │   │   │   ├── EmployeeDetails.tsx
│   │   │   │   └── AddEmployee.tsx
│   │   │   ├── components/
│   │   │   │   ├── EmployeeTable.tsx
│   │   │   │   ├── EmployeeForm.tsx
│   │   │   │   └── EmployeeFilters.tsx
│   │   │   ├── services/
│   │   │   │   └── employeeService.ts
│   │   │   ├── hooks/
│   │   │   │   └── useEmployees.ts
│   │   │   ├── store/
│   │   │   │   └── employeeFilterStore.ts
│   │   │   ├── schemas/
│   │   │   │   └── employeeSchema.ts
│   │   │   ├── types/
│   │   │   │   └── employeeTypes.ts
│   │   │   ├── utils/
│   │   │   ├── tests/
│   │   │   └── routes.tsx
│   │   │
│   │   ├── attendance/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   ├── store/
│   │   │   ├── types/
│   │   │   └── routes.tsx
│   │   │
│   │   ├── payroll/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   ├── store/
│   │   │   ├── schemas/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── routes.tsx
│   │   │
│   │   └── recruitment/
│   │       ├── pages/
│   │       ├── components/
│   │       ├── services/
│   │       ├── hooks/
│   │       ├── store/
│   │       ├── types/
│   │       └── routes.tsx
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── DataTable/
│   │   │   ├── Loader/
│   │   │   └── ErrorMessage/
│   │   │
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── constants/
│   │   └── validators/
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       ├── globals.css
│   │       └── variables.css
│   │
│   └── test/
│       ├── setup.ts
│       └── testUtils.tsx
│
├── .env.development
├── .env.production
├── .env.example
├── .gitignore
├── eslint.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md`,
    output: `FOLDER BY FOLDER

public/                    Copied to the build as-is, served from "/": favicon, images
                           that are never imported in code (email logos, og images).

src/app/  (wiring: runs once, imports from everywhere, nothing imports it)
  main.tsx                 Entry point: createRoot(...).render(<App />)
  App.tsx                  <AppProviders> + <RouterProvider router={router} />
  router/index.tsx         createBrowserRouter: collects every module's routes.tsx,
                           lazy-loads them, puts them under the right layout
  router/routeConfig.ts    Path constants (ROUTES.EMPLOYEES = '/employees'), so
                           links never hard-code strings
  router/ProtectedRoute    Not logged in -> <Navigate to="/login" />
  providers/AppProviders   One component that nests QueryProvider, ThemeProvider...
  providers/QueryProvider  new QueryClient() + defaults (staleTime, retry)
  providers/ThemeProvider  Light/dark theme context
  layouts/MainLayout       Header + Sidebar + <Outlet /> + Footer for logged-in pages
  layouts/AuthLayout       Plain centred card for login / forgot password
  error/GlobalErrorBoundary  Catches render crashes: "Something went wrong" + retry
  error/NotFound           The "*" route (404 page)

src/core/  (app-wide services: exactly one of each, no UI pages)
  api/axiosInstance.ts     axios.create({ baseURL: env.apiUrl }) + interceptors:
                           add Bearer token, refresh on 401, retry once
  api/apiEndpoints.ts      All URLs in one place: EMPLOYEES: '/employees'
  api/apiErrorHandler.ts   Turns any error into one shape { status, message } for toasts
  auth/authService.ts      login(), logout(), refresh(): the API calls
  auth/authStore.ts        Zustand store: user, accessToken (in memory), isLoggedIn
  auth/useAuth.ts          The hook components use: const { user, login } = useAuth()
  auth/authTypes.ts        User, Role, LoginRequest, LoginResponse types
  permissions/permissions.ts       Role -> permissions map
                                   (hr: ['employee.view', 'payroll.run'])
  permissions/permissionService.ts hasPermission(user, 'payroll.run')
  permissions/Can.tsx      <Can perform="payroll.run"><RunButton /></Can>
                           (hides buttons; the backend still checks)
  constants/appConstants   PAGE_SIZE, DATE_FORMAT, ROLES
  hooks/useDebounce        App-wide hooks the core layer itself needs
  config/env.ts            Reads import.meta.env.VITE_* once, validates it, exports
                           a typed object; the app fails fast if a variable is missing

src/modules/  (one folder per business feature; same shape every time)
  pages/        Route-level screens: EmployeeList, EmployeeDetails, AddEmployee
  components/   Used only inside this module: EmployeeTable, EmployeeForm, EmployeeFilters
  services/     API calls for this feature: employeeService.getAll(params)
                using core's axiosInstance + apiEndpoints
  hooks/        React Query hooks: useEmployees(filters) -> { data, isLoading }
  store/        Client/UI state only (Zustand): employeeFilterStore = search,
                department, page. Server data stays in React Query, never here
  schemas/      Zod schemas for forms and API data: employeeSchema
                (also gives the TS type with z.infer)
  types/        Employee, EmployeeFilters
  utils/        Feature helpers: calculateNetSalary() in payroll
  tests/        Tests for this module
  routes.tsx    The module's own routes; app/router just collects them

  dashboard, employees, attendance, payroll, recruitment: each one can be built,
  tested, lazy-loaded or removed on its own.

src/shared/  (reusable, no business logic: could be copied to another project)
  components/Button/   One folder per component: Button.tsx, Button.test.tsx, index.ts
  DataTable, Modal, Input, Loader, ErrorMessage: the app's UI kit
  hooks/ utils/ types/ constants/ validators/   Generic helpers: formatDate,
                       usePagination, email/phone validators

src/assets/    Imported files: images, icons, styles/globals.css, variables.css
src/test/      setup.ts (jest-dom matchers, MSW server) and testUtils.tsx
               (renderWithProviders wraps QueryClient + Router for every test)

Root files
  .env.development / .env.production   VITE_API_URL per mode (no secrets: they ship
                                        in the bundle)
  .env.example        Committed list of required variables, without real values
  eslint.config.js, tsconfig.json (path alias @/ -> src/), vite.config.ts,
  package.json, README.md (how to run, env setup, folder rules)

IMPORT RULES (what keeps it clean)
  app      -> can import anything
  modules  -> core, shared      (never another module's internals)
  core     -> shared
  shared   -> nothing app-specific

ONE REQUEST THROUGH THE LAYERS
  /employees -> router/index.tsx -> ProtectedRoute -> MainLayout -> EmployeeList
    -> useEmployees(filters from employeeFilterStore)        React Query cache
    -> employeeService.getAll() -> axiosInstance             token added by interceptor
    -> EmployeeTable renders shared <DataTable>, <Loader>, <ErrorMessage>
    -> <Can perform="employee.create"> shows "Add employee" only to HR`,
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
    q: 'What is a ref callback?',
    level: 'Intermediate',
    a: 'Instead of a ref object, I can pass a function to the ref prop. React calls it with the DOM node when the element is added, and with null when it is removed (in React 19 it can also return a cleanup function). I use it to measure an element as soon as it appears or to keep refs for every item in a list; I wrap it in useCallback so React does not call it again on every render.',
    code: `const [height, setHeight] = useState(0)

// React calls this with the DOM node after it is added
const measureRef = useCallback((node) => {
  if (node) setHeight(Math.round(node.getBoundingClientRect().height))
}, [])

<p ref={measureRef}>Measure me</p>
<p>Height: {height}px</p>`,
    output: <RefCallbackDemo />,
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
    q: 'What is useEffectEvent?',
    level: 'Advanced',
    a: 'useEffectEvent (stable in React 19.2) wraps a function that an effect calls, so it always sees the latest props and state without being a dependency. That lets me keep the effect reacting only to what should restart it: below, changing roomId reconnects, but changing theme does not. I only call these functions from inside effects, never during render.',
    code: `function Room({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    console.log('Connected to ' + roomId + ' (' + theme + ')') // latest theme
  })

  useEffect(() => {
    const id = setTimeout(onConnected, 500) // pretend to connect
    return () => clearTimeout(id)
  }, [roomId]) // theme is not a dependency
}`,
    output: `roomId 'general', theme 'light'  -> Connected to general (light)
theme changes to 'dark'          -> nothing (no reconnect)
roomId changes to 'travel'       -> Connected to travel (dark)`,
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
    q: 'What is useInsertionEffect?',
    level: 'Advanced',
    a: 'useInsertionEffect runs before useLayoutEffect, so a CSS-in-JS library can inject its style tags before any layout effect measures the DOM. It is meant for library authors: inside it I cannot update state, and refs are not attached yet. In app code I use useEffect, or useLayoutEffect when I need to measure before paint.',
    code: `// Inside a CSS-in-JS library
function useCss(rule) {
  useInsertionEffect(() => {
    const style = document.createElement('style')
    style.textContent = rule
    document.head.appendChild(style)
    return () => style.remove()
  }, [rule])
}`,
    output: `Order after each render:
useInsertionEffect  -> inject <style> tags
useLayoutEffect     -> measure the DOM (styles already there)
(browser paints)
useEffect           -> fetch, subscriptions, logging`,
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
    q: 'What is startTransition, and how is it different from useTransition?',
    level: 'Advanced',
    a: 'Both mark a state update as non-urgent, so React can interrupt it to keep typing and clicks responsive. useTransition is a hook, so it only works inside a component, and it also gives me an isPending flag for a spinner. startTransition is a plain function I can import and call anywhere, like in a router or a store, but it has no pending flag.',
    code: `import { startTransition, useTransition } from 'react'

// Inside a component: also gives isPending
const [isPending, startTx] = useTransition()
const selectTab = (tab) => startTx(() => setTab(tab))

// Outside components (a router, a store): no isPending
startTransition(() => store.setFilter('done'))`,
    output: `useTransition()    -> [isPending, startTransition], hook, inside components
startTransition()  -> same low-priority update, no pending flag, works anywhere`,
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
    q: 'What is useDebugValue?',
    level: 'Advanced',
    a: 'useDebugValue adds a label to a custom hook in the Components tab of React DevTools, so I can see its current value without adding console logs. It does nothing for users and only makes sense in custom hooks that are shared, like in a library. If the label is expensive to build, I pass a format function as the second argument so it only runs when DevTools is open.',
    code: `function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine) // listeners call setOnline
  useDebugValue(online ? 'Online' : 'Offline') // label in DevTools
  return online
}

function StatusBar() {
  const online = useOnlineStatus()
  return <p>{online ? 'Online' : 'Offline'}</p>
}`,
    output: `React DevTools > Components > StatusBar
  hooks
    OnlineStatus: "Online"
    State: true`,
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
    q: 'What happens if you provide an empty dependency array to useCallback?',
    level: 'Intermediate',
    a: "With an empty array, useCallback creates the function once on the first render and returns that same function on every later render, until the component unmounts. That gives a stable reference, which is good for a memo child or an effect dependency. The catch is the stale closure: the function remembers the props and state from the first render, so if it reads count it always sees 0, and setCount(count + 1) always sets 1. It's safe only when the function uses nothing that changes, or only uses things React keeps stable, like the setState function, a ref, or the updater form setCount(c => c + 1). Otherwise I list every value it uses in the array, and I keep the exhaustive-deps lint rule on so it warns me.",
    code: `const [count, setCount] = useState(0)

// Created once: always sees count from the first render (0)
const readStale = useCallback(() => console.log(count), [])
const addStale = useCallback(() => setCount(count + 1), []) // always sets 1

// Fixes
const readFresh = useCallback(() => console.log(count), [count]) // new function when count changes
const addSafe = useCallback(() => setCount((c) => c + 1), [])    // updater: [] is fine

<p>Count: {count}</p>
<button onClick={addSafe}>+1 with updater ([] deps)</button>
<button onClick={addStale}>+1 with count + 1 ([] deps)</button>
<button onClick={readStale}>Read count ([] deps)</button>
<button onClick={readFresh}>Read count ([count] deps)</button>`,
    output: <EmptyDepsCallbackDemo />,
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
    q: "What causes unnecessary re-renders?",
    level: 'Intermediate',
    a: "An unnecessary re-render is when a component renders again but its output doesn't change. The most common cause I see is a parent re-rendering, which re-renders every child, even if their props are the same. The next is passing a new object, array or inline function as a prop on every render, which breaks React.memo because the reference changes. Others are a Context value that is a new object each render, so every consumer re-renders; state kept too high in the tree, so typing in one input re-renders the whole page; Redux selectors that return a new object; and unstable keys like Math.random(). I fix them by moving state down, memoizing props with useMemo and useCallback, splitting contexts, and selecting small values, but only after the Profiler shows a real problem.",
    code: `const Child = memo(function Child({ style, onClick }) {
  console.log('Child render')
  return <button style={style} onClick={onClick}>Child</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {/* new object + new function every render -> memo can't help */}
      <Child style={{ color: 'red' }} onClick={() => {}} />
    </>
  )
}

// Fix: stable references
const style = useMemo(() => ({ color: 'red' }), [])
const handleClick = useCallback(() => {}, [])
<Child style={style} onClick={handleClick} />`,
    output: `Click "Count" 3 times:

Before fix:  Child render  x3   (new style/onClick each time)
After fix:   (no Child renders) (same references, memo skips)

Common causes:
- parent re-renders            -> move state down / React.memo
- new object/array/fn props    -> useMemo / useCallback
- Context value = new object   -> useMemo the value, split contexts
- state too high in the tree   -> keep state close to where it's used
- selector returns new object  -> select small values / createSelector
- unstable keys (random/index) -> use stable ids`,
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
    q: 'React.memo vs useMemo: what is the difference?',
    level: 'Intermediate',
    a: 'memo wraps a component and skips re-rendering it when its props are the same. useMemo is a hook inside a component that caches a calculated value until its dependencies change. They often work together: I use useMemo or useCallback to keep an object or function prop stable, so the memo child really can skip rendering.',
    code: `// memo: wraps a COMPONENT, skips its re-render if props are equal
const Row = memo(function Row({ name }) {
  return <li>{name}</li>
})

// useMemo: caches a VALUE inside a component
const sorted = useMemo(() => [...names].sort(), [names])

<ul>{sorted.map((n) => <Row key={n} name={n} />)}</ul>`,
    output: `memo(Component)    -> skips re-rendering the child when its props are equal
useMemo(fn, deps)  -> recomputes the value only when deps change`,
  },
  {
    q: "React.memo vs useMemo vs useCallback: when do you use each?",
    level: 'Intermediate',
    a: "All three are performance tools that skip work when inputs haven't changed. React.memo wraps a component, so it skips re-rendering when its props are the same. useMemo caches a calculated value, like a filtered or sorted list, until its dependencies change. useCallback caches a function, so I can pass the same function reference to a memoized child or use it as an effect dependency. They usually work together: React.memo on the child only helps if the object and function props I pass are stable, which is what useMemo and useCallback give me. I don't add them everywhere; I measure first, because each one has its own cost.",
    code: `// React.memo: skip re-render if props are the same
const EmployeeList = memo(function EmployeeList({ employees, onSelect }) {
  return employees.map((e) => <p key={e.id} onClick={() => onSelect(e.id)}>{e.name}</p>)
})

function Page({ all, search }) {
  // useMemo: cache an expensive value
  const filtered = useMemo(
    () => all.filter((e) => e.name.includes(search)),
    [all, search]
  )
  // useCallback: cache a function reference
  const handleSelect = useCallback((id) => console.log('selected', id), [])

  return <EmployeeList employees={filtered} onSelect={handleSelect} />
}`,
    output: `Tool         Wraps        Caches              Use it when
-----------  -----------  ------------------  ---------------------------------
React.memo   Component    Rendered output     child re-renders with same props
useMemo      Value        Result of a calc    expensive calc / stable object prop
useCallback  Function     Function reference  passing a function to a memo child
                                              or using it in effect dependencies

useCallback(fn, deps) === useMemo(() => fn, deps)`,
  },
  {
    q: 'What is a pure component? PureComponent vs React.memo',
    level: 'Intermediate',
    a: 'A pure component renders the same output for the same props and state and has no side effects during render. In class components, extending PureComponent adds a shallow comparison of props and state, so render is skipped when nothing changed. For function components I get the same effect with memo; I only reach for either when profiling shows wasted renders.',
    code: `import { PureComponent, memo } from 'react'

// Class: skips render() when props and state are shallowly equal
class Price extends PureComponent {
  render() {
    return <p>{this.props.value}</p>
  }
}

// Function component: memo does the same job
const PriceFn = memo(({ value }) => <p>{value}</p>)`,
    output: `Parent re-renders, value still 10  -> render skipped
Parent passes value 12             -> render runs`,
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
    q: 'What is flushSync?',
    level: 'Advanced',
    a: 'flushSync from react-dom forces React to apply a state update and update the DOM right away, instead of batching it for later. I need it when the very next line reads the DOM, like scrolling to an item I just added. It is slow if overused, so I keep it for these rare cases and never call it during render.',
    code: `import { flushSync } from 'react-dom'

const [items, setItems] = useState([1, 2, 3])
const listRef = useRef(null)
const add = () => {
  flushSync(() => setItems((s) => [...s, s.length + 1])) // DOM updated now
  listRef.current.scrollTop = listRef.current.scrollHeight // sees the new item
}

<ul ref={listRef} style={{ height: 80, overflow: 'auto' }}>{items.map((n) => <li key={n}>Item {n}</li>)}</ul>
<button onClick={add}>Add item</button>`,
    output: <FlushSyncDemo />,
  },
  {
    q: 'What is reconciliation in React, and how does the diffing algorithm work?',
    level: 'Intermediate',
    a: "Reconciliation is how React decides what to change in the DOM after a re-render. It compares the new element tree with the previous one, and a full tree comparison would be O(n³), so React uses an O(n) heuristic based on two rules. First, elements of a different type produce a different tree: if a div becomes a section, or one component becomes another, React destroys the old subtree, including all child state, and builds a new one. Second, for the same type React keeps the DOM node or component instance and only updates what changed, like attributes, styles or props, so child state is preserved. For lists, React matches children by key, so stable unique keys let it move, insert or remove only the right items; using the index as a key can attach state to the wrong row when items are reordered. The result is a list of changes that react-dom applies in the commit phase, and since React 16 this work is done by the Fiber reconciler.",
    code: `function ClickCounter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
}

function ReconcileDemo() {
  const [Wrapper, setWrapper] = useState('div')
  const [color, setColor] = useState('black')
  return (
    <div>
      <Wrapper style={{ color }}>
        <ClickCounter />
      </Wrapper>
      {/* same type: only the style is updated, the count is kept */}
      <button onClick={() => setColor(color === 'black' ? 'crimson' : 'black')}>
        Change color (same type)
      </button>
      {/* new type: the subtree is rebuilt, the count resets to 0 */}
      <button onClick={() => setWrapper(Wrapper === 'div' ? 'section' : 'div')}>
        Switch div / section (new type)
      </button>
    </div>
  )
}

// Rules React uses to diff (O(n) instead of O(n^3)):
// 1. Different type (div -> section, A -> B) -> destroy old subtree, build new, state lost
// 2. Same DOM type     -> keep the node, update only changed attributes/styles
// 3. Same component    -> keep the instance and its state, re-render with new props
// 4. Lists             -> match children by key (stable ids, not index)`,
    output: <ReconcileDemo />,
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
    q: "What is <Outlet> in React Router and how do nested routes work?",
    level: 'Intermediate',
    a: "Outlet is a placeholder inside a parent route's element where the matching child route renders. I use it for layouts: the parent route renders the header, sidebar or nav once, and only the Outlet area changes as the URL changes between child routes. Child routes are written inside the parent <Route>, an index route is the default child, and I can pass data down with <Outlet context={...} /> and read it with useOutletContext(). In a real app I use BrowserRouter; MemoryRouter here just lets the example run in the editor.",
    code: `import { MemoryRouter, Routes, Route, Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <nav><Link to="/">Home</Link> | <Link to="/employees">Employees</Link></nav>
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h2>Home</h2>} />
          <Route path="employees" element={<h2>Employees</h2>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}`,
    output: `URL /           -> <Layout> nav + <h2>Home</h2>        (index route)
URL /employees  -> <Layout> nav + <h2>Employees</h2>

The nav in <Layout> renders once and stays;
only the <Outlet /> part changes with the URL.`,
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
    q: 'What changed in React 18?',
    level: 'Intermediate',
    a: "React 18 introduced concurrent rendering, which is turned on when I create the app with createRoot instead of ReactDOM.render. With it I get automatic batching everywhere, so several setState calls in a timeout, promise or native event cause one re-render instead of many. It also added transitions (useTransition, startTransition) and useDeferredValue to keep the UI responsive, streaming SSR with Suspense and selective hydration, and new hooks like useId and useSyncExternalStore. In development, StrictMode started mounting, unmounting and remounting components to catch missing effect cleanups.",
    code: `// React 17
ReactDOM.render(<App />, document.getElementById('root'))

// React 18: createRoot enables concurrent features
const root = createRoot(document.getElementById('root'))
root.render(<App />)

// Automatic batching: one re-render, even inside setTimeout
setTimeout(() => {
  setCount((c) => c + 1)
  setFlag((f) => !f)
}, 1000)`,
    output: `React 17 (setTimeout)  -> 2 re-renders (no batching outside events)
React 18 (setTimeout)  -> 1 re-render  (automatic batching)

New in React 18: createRoot, automatic batching, useTransition,
startTransition, useDeferredValue, useId, useSyncExternalStore,
useInsertionEffect, streaming SSR + selective hydration`,
  },
  {
    q: 'What is the difference between React 18 and React 19?',
    level: 'Intermediate',
    a: "React 18 was about how React renders: it brought concurrent rendering, automatic batching and transitions. React 19 builds on that and is about how I write apps: Actions let me pass async functions to forms and transitions, and React handles pending state, errors and optimistic updates with useActionState, useFormStatus and useOptimistic. It also adds the use() API for reading promises and context, makes Server Components and Server Actions stable, lets me pass ref as a normal prop and use <Context> directly as a provider, and supports <title> and <meta> inside components. On the cleanup side, React 19 removes old APIs like ReactDOM.render, string refs, propTypes and defaultProps for function components.",
    code: `// React 18: forwardRef + manual pending state
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />)

const [isPending, setIsPending] = useState(false)
async function handleSubmit(e) {
  e.preventDefault()
  setIsPending(true)
  await savePost(new FormData(e.target))
  setIsPending(false)
}
<form onSubmit={handleSubmit}>...</form>

// React 19: ref is a prop, and Actions handle the pending state
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}

const [error, submitAction, isPending] = useActionState(async (prev, formData) => {
  await savePost(formData)
  return null
}, null)
<form action={submitAction}>...</form>`,
    output: `Feature              React 18                     React 19
-------------------  ---------------------------  -------------------------------
Main focus           Concurrent rendering         Actions, server features
Root API             createRoot (render legacy)   createRoot (render removed)
Forms / async        onSubmit + manual state      action={fn}, useActionState
Pending / optimistic Manual useState              useFormStatus, useOptimistic
Read promise         useEffect + state            use(promise) with Suspense
Refs                 forwardRef                   ref as a prop
Context provider     <Ctx.Provider value>         <Ctx value>
Document metadata    react-helmet                 <title>, <meta> in components
Server Components    Experimental                 Stable
Removed              -                            propTypes, defaultProps (fn),
                                                  string refs, ReactDOM.render`,
  },
  {
    q: 'What are the smaller React 19 improvements (ref as a prop, Context as provider, metadata)?',
    level: 'Intermediate',
    a: "Besides Actions, React 19 has several small changes I use every day. Function components receive ref as a normal prop, so I don't need forwardRef any more, and a ref callback can return a cleanup function. I can render <ThemeContext value=\"dark\"> directly instead of <ThemeContext.Provider>. I can put <title>, <meta> and <link> tags inside any component and React hoists them into the document head, so I don't need react-helmet. useDeferredValue also accepts an initial value now.",
    code: `// 1. ref as a prop (no forwardRef)
function MyInput({ ref, placeholder }) {
  return <input ref={ref} placeholder={placeholder} />
}

// 2. Context as a provider
<ThemeContext value="dark">
  <App />
</ThemeContext>

// 3. Document metadata from any component
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <h1>{post.title}</h1>
    </article>
  )
}`,
    output: `<head>
  <title>My first post</title>                       <- hoisted by React 19
  <meta name="description" content="Short summary">
</head>
<body>
  <article><h1>My first post</h1></article>
</body>`,
  },
  {
    q: 'How do you upgrade from React 18 to React 19 (breaking changes)?',
    level: 'Advanced',
    a: "First I upgrade to React 18.3, which adds warnings for everything React 19 removes, and fix those warnings. Then I update react, react-dom and @types/react together to 19 and run the official codemods, for example to replace ReactDOM.render with createRoot, string refs with ref callbacks, and propTypes with TypeScript. The main breaking changes are the removed legacy APIs (ReactDOM.render, hydrate, findDOMNode, string refs, legacy context, defaultProps on function components), errors during render no longer being re-thrown (I can handle them with onUncaughtError and onCaughtError on createRoot), and TypeScript changes like useRef requiring an argument. I run the test suite and check the console after each step.",
    code: `# 1. Fix the deprecation warnings first
npm install react@18.3 react-dom@18.3

# 2. Upgrade together
npm install react@19 react-dom@19 @types/react@19 @types/react-dom@19

# 3. Run the codemods
npx codemod@latest react/19/migration-recipe

// Before (removed in 19)
ReactDOM.render(<App />, rootEl)
Button.defaultProps = { size: 'md' }

// After
createRoot(rootEl).render(<App />)
function Button({ size = 'md' }) { /* ... */ }`,
    output: `Removed in React 19             Replace with
------------------------------  --------------------------------
ReactDOM.render / hydrate       createRoot / hydrateRoot
defaultProps (function comps)   default parameters
propTypes                       TypeScript
string refs (ref="input")       useRef / ref callback
findDOMNode                     a ref on the DOM element
legacy context (contextTypes)   createContext + useContext
react-test-renderer/shallow     React Testing Library`,
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
    q: 'What is useFormStatus?',
    level: 'Advanced',
    a: 'useFormStatus from react-dom tells a component whether the parent form is currently submitting, with pending, data and method. It only works in a component rendered inside the <form>, not in the component that renders the form. I use it for a reusable SubmitButton that disables itself and shows "Saving..." without passing any props.',
    code: `import { useFormStatus } from 'react-dom'

function SubmitButton() { // must be rendered inside a <form>
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>
}

<form action={() => wait(1000)}>
  <input name="title" defaultValue="My note" />
  <SubmitButton />
</form>`,
    output: <FormStatusDemo />,
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
    q: 'What do Children, cloneElement and isValidElement do?',
    level: 'Advanced',
    a: 'They let a component inspect and change the children it receives. Children.toArray or Children.map walk over the children, isValidElement tells me whether a child is a real element and not text, and cloneElement copies an element with extra props. They break easily when children are wrapped in other components, so in new code I prefer passing data as props, context or render props.',
    code: `import { Children, cloneElement, isValidElement } from 'react'

function Steps({ children }) {
  const items = Children.toArray(children).filter(isValidElement)
  return items.map((child, i) => cloneElement(child, { children: 'Step ' + (i + 1) + ': ' + child.props.children }))
}

<Steps>
  <p>Add to cart</p>
  plain text is skipped
  <p>Pay</p>
</Steps>`,
    output: <ChildrenApiDemo />,
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
    q: "What is the difference between Redux Toolkit and Context API?",
    level: 'Intermediate',
    a: "Context is a way to pass data down the tree without prop drilling; it isn't really a state manager, I combine it with useState or useReducer. Redux Toolkit is a full state management library with a central store, slices, middleware, DevTools with time-travel debugging, and RTK Query for API data. The big practical difference is re-renders: when a Context value changes, every component using that context re-renders, while with Redux each component subscribes with useSelector and re-renders only when its selected value changes. So I use Context for small, rarely changing data like the theme, language or logged-in user, and Redux Toolkit for large, frequently updated, shared state.",
    code: `// Context: pass a value down (re-renders all consumers on change)
const ThemeContext = createContext('light')
<ThemeContext value={theme}><App /></ThemeContext>
const theme = useContext(ThemeContext)

// Redux Toolkit: central store, components subscribe to a slice of it
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: { addItem: (state, action) => { state.items.push(action.payload) } },
})
const count = useSelector((state) => state.cart.items.length) // re-renders only when this changes
dispatch(cartSlice.actions.addItem({ id: 1 }))`,
    output: `Feature           Context API                  Redux Toolkit
----------------  ---------------------------  ------------------------------
What it is        Dependency injection (prop   State management library
                  drilling solution)
Setup             Built in, very little code   Package + store + slices
Re-renders        All consumers on any change  Only when the selected value changes
DevTools          No                           Yes, time-travel debugging
Middleware        No                           Yes (thunk, logger, RTK Query)
API caching       No                           RTK Query
Best for          Theme, locale, current user  Large, frequently updated shared state`,
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
    q: 'What is useSyncExternalStore?',
    level: 'Advanced',
    a: 'useSyncExternalStore subscribes a component to data that lives outside React, like a browser API or a store library. I give it a subscribe function and a getSnapshot function, plus an optional server snapshot for SSR, and React re-renders when the value changes. Libraries like Redux and Zustand use it under the hood; getSnapshot must return the same value when nothing changed, or it renders forever.',
    code: `import { useSyncExternalStore } from 'react'

function subscribe(onChange) {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

function WindowWidth() {
  const width = useSyncExternalStore(subscribe, () => window.innerWidth, () => 0)
  return <p>Window width: {width}px (resize the window)</p>
}`,
    output: <SyncExternalStoreDemo />,
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
    q: "Explain the Redux workflow (data flow).",
    level: 'Basics',
    a: "Redux has a one-way data flow. When something happens in the UI, the component dispatches an action, a plain object with a type and optional payload. The store passes the current state and that action to the reducer, a pure function that returns the new state without changing the old one. The store saves the new state and notifies its subscribers, so components reading that data re-render with the new values. Because every change goes through dispatch and a reducer, state changes are predictable and easy to trace in Redux DevTools.",
    code: `import { configureStore } from '@reduxjs/toolkit'

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
store.dispatch({ type: 'counter/increment' })`,
    output: `1. UI dispatches an action
2. reducer runs: counter/increment
3. store updated, UI re-renders: { count: 1 }

Flow: UI event -> dispatch(action) -> reducer(state, action) -> new state in store
      -> subscribers notified -> components re-render`,
  },
  {
    q: 'What is Redux Toolkit and why use it instead of plain Redux?',
    level: 'Basics',
    a: "Redux Toolkit is the official, recommended way to write Redux logic, and I use it to manage global client state that many components share: the logged-in user, roles and permissions, a shopping cart, app settings, theme preferences and shared UI state. createSlice gives me the reducer and action creators in one place, so there are no action type constants or long switch statements. It uses Immer, so I can write simple \"mutating\" code safely, and configureStore sets up DevTools and thunks for me.",
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
    q: 'Why can we directly mutate state inside Redux Toolkit reducers?',
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
    q: 'What is createAsyncThunk()?',
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
    q: "Explain Redux Toolkit flow using createSlice.",
    level: 'Intermediate',
    a: "First, I create a Redux slice using createSlice(), where I define the initial state and reducer functions. Redux Toolkit automatically generates action creators and action types for each reducer. Next, I configure the Redux store using configureStore() and register the slice reducers in the store. I wrap my React application with the Redux <Provider> component, passing the configured store so that all child components can access the Redux store. Inside components, I use useDispatch() to dispatch actions and useSelector() to access the required state from the store. When an action is dispatched, Redux invokes the corresponding reducer to calculate the next state. Redux Toolkit uses Immer internally, allowing us to write mutation-like code while ensuring immutable state updates. Finally, React-Redux detects changes to the selected state and re-renders the components whose selected values have changed.",
    code: `// 1. createSlice: state + reducers (actions generated)
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: { increment: (state) => { state.count += 1 } },
})
// 2. configureStore: register the slice reducer
const store = configureStore({ reducer: { counter: counterSlice.reducer } })
// 3. Provider: <Provider store={store}><App /></Provider>
// 4. Component: dispatch an action, read the new state
const dispatch = useDispatch()
const count = useSelector((state) => state.counter.count)
dispatch(counterSlice.actions.increment())`,
    output: `createSlice -> configureStore -> Provider -> useDispatch
  -> Reducer -> Store update -> useSelector -> Component re-render

Full working app: Coding Programs -> Redux Toolkit Counter`,
  },
  {
    q: "What is the purpose of configureStore()?",
    level: 'Basics',
    a: "configureStore creates the Redux store in one call. I pass it my slice reducers as an object, and it combines them, adds the thunk middleware for async logic, turns on development checks that catch accidental mutations, and connects Redux DevTools. Without it I'd have to wire all of that by hand with createStore, combineReducers and applyMiddleware.",
    code: `import { configureStore, createSlice } from '@reduxjs/toolkit'

const counter = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: { increment: (state) => { state.count += 1 } },
})

// One call: combines reducers, adds thunk + dev checks, enables DevTools
const store = configureStore({ reducer: { counter: counter.reducer } })

store.dispatch(counter.actions.increment())
console.log(store.getState())`,
    output: `{ counter: { count: 1 } }`,
  },
  {
    q: "What is the difference between useSelector() and useDispatch()?",
    level: 'Basics',
    a: "useSelector reads data from the store: I pass a selector function, and the component re-renders only when that selected value changes. useDispatch gives me the dispatch function, which I call to send an action and update the store. So useSelector is for reading and useDispatch is for writing, and I usually use both in the same component.",
    code: `import { useSelector, useDispatch } from 'react-redux'
import { increment } from './counterSlice'

function Counter() {
  // READ: re-renders when state.counter.count changes
  const count = useSelector((state) => state.counter.count)

  // WRITE: send actions to the store
  const dispatch = useDispatch()

  return <button onClick={() => dispatch(increment())}>Count: {count}</button>
}`,
    output: `useSelector -> reads state (subscribes, re-renders when the value changes)
useDispatch -> sends actions (dispatch(increment()) updates the store)`,
  },
  {
    q: "What is the difference between createSlice() and createReducer()?",
    level: 'Intermediate',
    a: "Both use Immer, but createSlice does more: from one object it creates the reducer AND the action creators, with action types like 'counter/add'. createReducer only builds the reducer, so I have to create the actions separately with createAction. I use createSlice almost always, and createReducer only when a reducer must respond to actions defined elsewhere.",
    code: `import { createSlice, createReducer, createAction } from '@reduxjs/toolkit'

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
console.log(reducer(0, add(5)))`,
    output: `{ type: 'counter/add', payload: 5 }
5
5`,
  },
  {
    q: "How do you manage API calls in Redux Toolkit?",
    level: 'Intermediate',
    a: "I have two options. For most CRUD APIs I use RTK Query: I define endpoints with createApi and get hooks with loading, error, caching and refetching built in. For one-off calls or custom logic I use createAsyncThunk and handle the pending, fulfilled and rejected actions in extraReducers to store the result in my slice.",
    code: `// Option 1: RTK Query (loading, caching and refetch built in)
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  endpoints: (build) => ({ getPosts: build.query({ query: () => 'posts' }) }),
})
const { data, isLoading } = api.useGetPostsQuery()

// Option 2: createAsyncThunk (I store the result in a slice myself)
const fetchPosts = createAsyncThunk('posts/fetch', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  return res.json()
})`,
    output: `RTK Query        -> most CRUD APIs: loading, error, caching, refetch built in
createAsyncThunk -> one-off or custom logic: I handle pending / fulfilled /
                    rejected in extraReducers myself`,
  },
  {
    q: "What is middleware in Redux?",
    level: 'Intermediate',
    a: "Middleware is a function that sits between dispatching an action and the reducer, so it can see every action, log it, change it, delay it or start side effects. Its shape is store => next => action, and it calls next(action) to pass the action on. Redux Toolkit already adds the thunk middleware, and I add my own with getDefaultMiddleware().concat(...), for example a logger or RTK Query's api.middleware.",
    code: `import { configureStore, createSlice } from '@reduxjs/toolkit'

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
store.dispatch(counter.actions.increment())`,
    output: `before: 0 action: counter/increment
after:  1`,
  },
  {
    q: "How do you avoid unnecessary re-renders when using Redux?",
    level: 'Advanced',
    a: "A component re-renders when the value its selector returns changes, so I select only the small piece I need instead of the whole state. I avoid selectors that build a new object or array each time, because a new reference counts as a change; for derived data I use createSelector so the result is memoized, and for several values I pass shallowEqual. I also keep components that use useSelector small, and wrap expensive children in React.memo.",
    code: `// 1. Select only what you need
const name = useSelector((state) => state.user.name)

// 2. Memoize derived data, so filter() doesn't create a new array each time
const selectDone = createSelector([(s) => s.todos], (todos) => todos.filter((t) => t.done))
const done = useSelector(selectDone)

// 3. Pick several values with shallowEqual
const { a, b } = useSelector((s) => ({ a: s.a, b: s.b }), shallowEqual)`,
    output: `Selector returns a new object/array every time -> re-renders on EVERY action
Select a small value / createSelector / shallowEqual -> re-renders only when
the data the component uses actually changes`,
  },
  {
    q: 'What is RTK Query and how do you define an API with createApi?',
    level: 'Intermediate',
    a: "RTK Query is the API data-fetching and caching solution built into Redux Toolkit, so I use it for server state in a Redux app. Instead of managing loading, success and error state, caching, refetching and cache invalidation by hand, I describe my endpoints once with createApi and it generates hooks like useGetPostsQuery that give me data, isLoading and error. I use fetchBaseQuery with a baseUrl, and in a full Redux app I add api.reducer and api.middleware to the store; ApiProvider does that for me when I only need RTK Query.",
    code: `import { ApiProvider, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  endpoints: (build) => ({
    getPosts: build.query({ query: () => 'posts?_limit=3' }),
  }),
})

function Posts() {
  const { data = [], isLoading } = api.useGetPostsQuery() // generated hook
  if (isLoading) return <p>Loading...</p>
  return <ul>{data.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
}

<ApiProvider api={api}><Posts /></ApiProvider>`,
    output: <RtkQueryDemo />,
  },
  {
    q: "Explain the RTK Query workflow.",
    level: 'Advanced',
    a: "First, I define an API slice with createApi, giving it a baseQuery like fetchBaseQuery and the endpoints, and RTK Query generates hooks such as useGetPostsQuery. I add api.reducer and api.middleware to the store. When a component calls the hook, RTK Query checks its cache, keyed by endpoint and arguments: if the data is there it returns it, otherwise it sends the request and gives me isLoading, data and error. Other components asking for the same data share that cache entry. When a mutation succeeds, its invalidatesTags marks matching providesTags queries as stale, so they refetch automatically and the components update.",
    code: `// 1. API slice: endpoints + tags
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    getPosts: build.query({ query: () => 'posts', providesTags: ['Post'] }),
    addPost: build.mutation({
      query: (body) => ({ url: 'posts', method: 'POST', body }),
      invalidatesTags: ['Post'],
    }),
  }),
})
// 2. Store: reducer: { [api.reducerPath]: api.reducer }, middleware: api.middleware
// 3. Component: const { data, isLoading } = api.useGetPostsQuery()`,
    output: `Flow: createApi(endpoints) -> add api.reducer + api.middleware to the store
      -> component calls useGetPostsQuery() -> cache hit? return data : fetch
      -> isLoading -> data / error -> shared by every component using it
      -> useAddPostMutation() succeeds -> invalidatesTags('Post')
      -> queries with providesTags('Post') refetch -> components re-render`,
  },
  {
    q: 'How does RTK Query caching and invalidation work (providesTags / invalidatesTags)?',
    level: 'Advanced',
    a: 'RTK Query caches each query result, and components asking for the same data share one request. A query marks its data with providesTags, like Post, and a mutation lists invalidatesTags; after the mutation succeeds, every query with that tag refetches automatically. This keeps the list up to date without me manually updating the cache or calling refetch.',
    code: `import { ApiProvider, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    getPosts: build.query({ query: () => 'posts?_limit=3', providesTags: ['Post'] }),
    addPost: build.mutation({
      query: (body) => ({ url: 'posts', method: 'POST', body }),
      invalidatesTags: ['Post'], // after saving, getPosts refetches
    }),
  }),
})

function Posts() {
  const { data = [] } = api.useGetPostsQuery()
  const [addPost] = api.useAddPostMutation()
  return (
    <div>
      <button onClick={() => addPost({ title: 'New post', userId: 1 })}>Add post</button>
      <ul>{data.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
    </div>
  )
}

<ApiProvider api={api}><Posts /></ApiProvider>`,
    output: <RtkTagsDemo />,
  },
  {
    q: 'What is React Query (TanStack Query) and how does useQuery work?',
    level: 'Intermediate',
    a: "TanStack Query, formerly React Query, is a standalone library for fetching, caching, synchronizing and updating server data, and it does not need Redux. I use it for things like fetching employee details or payroll records, search and filter screens, updating employee information, caching API responses and automatically refetching stale data. I wrap the app in a QueryClientProvider and call useQuery with a queryKey (the cache key) and a queryFn that returns a promise; it gives me isPending, error and data, shared by every component using the same key.",
    code: `import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const fetchPosts = () =>
  fetch('https://jsonplaceholder.typicode.com/posts?_limit=3').then((res) => res.json())
const client = new QueryClient()

function Posts() {
  const { data, isPending, error } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts })
  if (isPending) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  return <ul>{data.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
}

<QueryClientProvider client={client}><Posts /></QueryClientProvider>`,
    output: <UseQueryDemo />,
  },
  {
    q: "Explain the TanStack Query workflow.",
    level: 'Intermediate',
    a: "First, I create a QueryClient, which holds the cache, and wrap the app in QueryClientProvider. In a component I call useQuery with a queryKey and a queryFn. TanStack Query looks up the key in the cache: fresh data is returned right away, and missing or stale data is fetched, with isPending, data and error telling the component what to show. The result is cached under the key and shared by every component using it; it stays fresh for staleTime, refetches in the background on things like window focus, and is removed gcTime after nothing uses it. For changes I use useMutation, and in onSuccess I call invalidateQueries so the related queries refetch.",
    code: `// 1. Client + provider (holds the cache)
const queryClient = new QueryClient()
// <QueryClientProvider client={queryClient}><App /></QueryClientProvider>

// 2. Read: cached under the queryKey
const URL = 'https://jsonplaceholder.typicode.com/posts'
const { data, isPending, error } = useQuery({
  queryKey: ['posts'],
  queryFn: () => fetch(URL).then((res) => res.json()),
  staleTime: 60_000,
})

// 3. Write, then refresh the cached list
const add = useMutation({
  mutationFn: (post) => fetch(URL, { method: 'POST', body: JSON.stringify(post) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
})`,
    output: `Flow: QueryClient + QueryClientProvider -> useQuery({ queryKey, queryFn })
      -> cache lookup: fresh? return it : fetch (isPending -> data / error)
      -> cached under the key, shared by all components
      -> stale after staleTime -> background refetch (focus, reconnect)
      -> useMutation succeeds -> invalidateQueries(key) -> refetch -> re-render
      -> unused cache removed after gcTime`,
  },
  {
    q: 'How do you update data with useMutation and invalidateQueries in React Query?',
    level: 'Intermediate',
    a: 'For creating, updating or deleting data I use useMutation with a mutationFn, and call mutate from an event handler. In onSuccess I call queryClient.invalidateQueries with the same key, so React Query marks the list as stale and refetches it. I also use isPending to disable the button while the request is running.',
    code: `import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const URL = 'https://jsonplaceholder.typicode.com/posts'
const getPosts = () => fetch(URL + '?_limit=3').then((res) => res.json())
const addPost = (post) =>
  fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  }).then((res) => res.json())
const client = new QueryClient()

function Posts() {
  const queryClient = useQueryClient()
  const { data = [] } = useQuery({ queryKey: ['posts'], queryFn: getPosts })
  const add = useMutation({
    mutationFn: addPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })
  return (
    <div>
      <button disabled={add.isPending} onClick={() => add.mutate({ title: 'New post', userId: 1 })}>
        {add.isPending ? 'Saving...' : 'Add post'}
      </button>
      <ul>{data.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
    </div>
  )
}

<QueryClientProvider client={client}><Posts /></QueryClientProvider>`,
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
    q: 'What is the difference between Redux Toolkit, RTK Query and React Query?',
    level: 'Advanced',
    a: "Redux Toolkit is for global client-side state, like authentication info, user permissions, theme preferences and shared UI state. RTK Query is part of Redux Toolkit and is built for API data fetching, caching, loading and error handling, and it plugs straight into the Redux store. React Query, now TanStack Query, gives the same server-state features, like fetching, caching, mutations and automatic refetching, but works without Redux. So I use React Query in apps without Redux, RTK Query when the app already uses Redux Toolkit, and Redux Toolkit slices only for shared client state.",
    code: `// Server data, no Redux in the app -> React Query
const { data } = useQuery({ queryKey: ['todos'], queryFn: getTodos })

// Server data, app already uses Redux -> RTK Query
const { data } = api.useGetTodosQuery()

// Shared client state (cart, filters) -> Redux Toolkit slice
const items = useSelector((s) => s.cart.items)`,
    output: `Feature              Redux Toolkit        RTK Query          React Query
-------------------  -------------------  -----------------  -----------------
Main purpose         Global client state  API/server state   API/server state
Fetch API            Manual or thunk      Built in           Built in
Caching              Not automatic        Built in           Built in
Loading/error        Usually manual       Built in           Built in
Cache invalidation   Manual               Tag-based          Query-key based
Requires Redux       Yes                  Yes (Redux store)  No
Mutations            Reducers/thunks      Built in           Built in`,
  },
  {
    q: "What is Zustand and how do you create a store?",
    level: 'Intermediate',
    a: "Zustand is a small library for global client-side state, like the logged-in user, theme, shopping cart, sidebar visibility or selected filters. I create a store with create(), which gives me a hook; inside it, set() updates the state. Components read only what they need with a selector like useCounterStore((s) => s.count), and they re-render only when that selected value changes. Unlike Redux or Context, I don't need a Provider, and there's very little boilerplate.",
    code: `import { create } from 'zustand'

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

function Counter() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  return (
    <div>
      <h2>{count}</h2>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}`,
    output: <ZustandCounterDemo />,
  },
  {
    q: "Explain the Zustand workflow.",
    level: 'Intermediate',
    a: "First, I create a store with create(), where I define the state and the actions that change it; actions call set() to update the store. The store is itself a hook, so there's no Provider: any component can call it with a selector, like useStore((s) => s.count), to read only the value it needs. When an action runs, set() merges the new state and Zustand notifies its subscribers. Only the components whose selected value changed re-render, which keeps updates cheap without memoization.",
    code: `// 1. Create the store: state + actions (actions call set)
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}))

// 2. Read with a selector  3. Call an action
function Cart() {
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  return <button onClick={() => addItem('Pen')}>Items: {items.length}</button>
}`,
    output: `Flow: create(store) -> component reads with selector (no Provider)
      -> action calls set() -> store updates and notifies subscribers
      -> only components whose selected value changed re-render`,
  },
  {
    q: "What are the key TanStack Query concepts (queryKey, queryFn, refetch, invalidateQueries)?",
    level: 'Intermediate',
    a: "queryKey uniquely identifies cached data, so ['employees', dept] caches each department separately, and queryFn is the function that fetches it. useQuery reads data and useMutation creates, updates or deletes it. After a mutation I call invalidateQueries to mark the cached data stale so it refetches; refetch lets me fetch again manually. staleTime controls how long data counts as fresh, and gcTime how long unused cache is kept.",
    code: `const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ['employees', department], // cache key (one entry per department)
  queryFn: () => fetchEmployees(department), // how to fetch
  staleTime: 60_000, // fresh for 1 minute, no refetch
})

if (isLoading) return <p>Loading...</p>
if (isError) return <p>{error.message}</p>

<button onClick={() => refetch()}>Reload</button>`,
    output: `Concept            Purpose
-----------------  ------------------------------------------
useQuery           Fetch API data
useMutation        Create, update, delete API data
queryKey           Uniquely identifies cached data
queryFn            Function that fetches data
invalidateQueries  Marks cached data stale (it refetches)
refetch            Manually fetch data again
staleTime          How long data is considered fresh
gcTime             How long inactive cache remains`,
  },
  {
    q: "What is the difference between Zustand and TanStack Query?",
    level: 'Intermediate',
    a: "They solve different problems. Zustand manages client state, data that lives only in the browser like the theme, filters or the sidebar. TanStack Query manages server state, data that lives on the backend, and gives me fetching, caching, loading and error states, background refetching and mutations out of the box. With Zustand I would have to build all of that by hand, so I don't use it for API data.",
    code: `// Client state: Zustand
const useUiStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))

// Server state: TanStack Query
const { data: employees, isLoading } = useQuery({
  queryKey: ['employees'],
  queryFn: fetchEmployees,
})`,
    output: `Feature             Zustand                 TanStack Query
------------------  ----------------------  -----------------------
Main purpose        Client state            Server state
API fetching        Manual                  Built-in
Caching             Not built-in            Built-in
Loading state       Manage manually         Built-in
Error handling      Manage manually         Built-in
Background refetch  Manual                  Built-in
Global state        Yes                     Not its primary purpose
Mutations           Manual API integration  useMutation`,
  },
  {
    q: "Can you use Zustand and TanStack Query together?",
    level: 'Advanced',
    a: "Yes, and for large apps it's a good architecture. In an employee payroll app, Zustand holds client state like authentication, the theme, the selected department and the sidebar, while TanStack Query handles employees, payroll and attendance from the API. The selected department from Zustand goes into the queryKey, so changing the filter fetches and caches the right list, and after an update with useMutation I call invalidateQueries to refresh it.",
    code: `const useFilterStore = create((set) => ({
  userId: 1,
  setUserId: (userId) => set({ userId }),
}))

function PostList() {
  const userId = useFilterStore((s) => s.userId) // client state
  const { data } = useQuery({                     // server state
    queryKey: ['posts', userId],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/posts?userId=' + userId).then((r) => r.json()),
  })
  return <ul>{data?.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
}`,
    output: `React components  (Employee list · Payroll · Dashboard)
   |                              |
Zustand (client state)        TanStack Query (server state)
- Authentication              - Employee API
- Theme                       - Payroll API
- Selected filters            - Attendance API
- Sidebar state               - Caching, refetching
                                  |
                          Backend APIs (REST, database)

Update flow: useMutation -> PUT https://jsonplaceholder.typicode.com/posts/1
             -> onSuccess: invalidateQueries(['posts']) -> list refetches`,
  },
  {
    q: "What is the difference between Redux Toolkit, Zustand and TanStack Query?",
    level: 'Advanced',
    a: "Redux Toolkit and Zustand both manage client state: Redux Toolkit is more structured, with slices, middleware and great DevTools, while Zustand has much less boilerplate. TanStack Query is for server state, with API caching built in. Redux Toolkit can also handle server state through RTK Query, and Zustand can if I build it myself, but for API data I prefer a tool made for it.",
    code: `// Redux Toolkit: slice + store + Provider
const cartSlice = createSlice({ name: 'cart', initialState: [], reducers: { add: (s, a) => { s.push(a.payload) } } })

// Zustand: one hook, no Provider
const useCart = create((set) => ({ items: [], add: (i) => set((s) => ({ items: [...s.items, i] })) }))

// TanStack Query: server data with caching
const { data } = useQuery({ queryKey: ['products'], queryFn: fetchProducts })`,
    output: `Feature        Redux Toolkit     Zustand             TanStack Query
-------------  ----------------  ------------------  -----------------------
Client state   Yes               Yes                 No, not primary
Server state   Possible (RTKQ)   Possible            Yes
Boilerplate    Moderate          Low                 Low
API caching    Additional setup  Additional setup    Built-in
Middleware     Yes               Middleware support  Query lifecycle options`,
  },
  {
    q: "Why would you choose Zustand and TanStack Query instead of Redux Toolkit?",
    level: 'Advanced',
    a: "I would choose Zustand for lightweight global client-side state, because it needs less boilerplate and has a simple API. For server-side data I would use TanStack Query, because it gives me caching, background refetching, loading and error handling, and query invalidation out of the box. For example, in an employee payroll application, Zustand would manage authentication state, UI preferences and selected filters, while TanStack Query would handle employee records, payroll data and API mutations. This separation keeps client state and server state independent and makes the app easier to maintain.",
    code: `// Client state -> Zustand (small, no Provider)
const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
}))

// Server state -> TanStack Query (cache, refetch, mutations)
const { data: payroll } = useQuery({ queryKey: ['payroll'], queryFn: fetchPayroll })

// I'd still pick Redux Toolkit when the team already uses it, or for
// very complex client state that benefits from strict structure and DevTools.`,
    output: `Zustand        -> auth, theme, filters, sidebar (client state)
TanStack Query -> employees, payroll, attendance (server state)

Result: less boilerplate, no hand-written loading/caching code,
client and server state kept independent.`,
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
    q: 'How do you find slow components with React DevTools and the Profiler?',
    level: 'Intermediate',
    a: 'In the browser I use the React DevTools extension: the Components tab shows props, state and hooks, and the Profiler tab records an interaction and shows which components rendered, how long they took and why. I also turn on "Highlight updates when components render" to spot extra renders. In code, the <Profiler> component calls onRender with timings, which helps me measure one part of the tree before and after a fix.',
    code: `import { Profiler } from 'react'

function onRender(id, phase, actualDuration) {
  console.log(id, phase, actualDuration.toFixed(1) + 'ms')
}

<Profiler id="ProductList" onRender={onRender}>
  <ProductList />
</Profiler>`,
    output: `ProductList mount 12.4ms
ProductList update 3.1ms
(timings vary from run to run)`,
  },
  {
    q: "How do you write a simple unit test for a React component?",
    level: 'Basics',
    a: "The simplest test has three steps: render the component, find something the user would see, and check it. I use render from React Testing Library to put the component into a fake browser DOM (jsdom), screen.getByText to find the text, and expect(...).toBeInTheDocument() to check that it is there. getByText throws if the text is missing, so a broken component fails the test with a clear message. toBeInTheDocument comes from jest-dom, which I load once in a setup file, and I run the tests with npx vitest run.",
    code: `// Greeting.jsx
export default function Greeting({ name }) {
  return <p>Hello, {name}</p>
}

// Greeting.test.jsx
import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Greeting from './Greeting'

test('shows the name', () => {
  render(<Greeting name="Asha" />)
  expect(screen.getByText('Hello, Asha')).toBeInTheDocument()
})`,
    output: `$ npx vitest run --reporter=verbose

 ✓ src/Greeting.test.jsx > shows the name

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
  },
  {
    q: 'What should you test in a React component, and which testing tools do you use?',
    level: 'Basics',
    a: 'I test behavior, not implementation: what the user sees on the screen and what happens when they click or type, not internal state, hook calls or CSS class names. That way I can refactor the component and the tests still pass. My usual stack is Vitest (or Jest) as the test runner, jsdom as a fake browser DOM, React Testing Library to render and query, user-event to simulate real user actions, and jest-dom for readable matchers like toBeInTheDocument.',
    code: `// vitest.config.js
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./setup.js'] },
})
// setup.js
import '@testing-library/jest-dom/vitest'

// Greeting.jsx
export default function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>
}

// Greeting.test.jsx
test('greets the user by name', () => {
  render(<Greeting name="Asha" />)
  expect(screen.getByRole('heading')).toHaveTextContent('Hello, Asha!')
})`,
    output: ` ✓ src/Greeting.test.jsx > greets the user by name

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
  },
  {
    q: 'What is Vitest, and how do you set it up in a Vite + React project?',
    level: 'Basics',
    a: "Vitest is a test runner built on Vite, so it reuses my vite.config.js, plugins and aliases, understands JSX, TypeScript and ES modules without Babel, and has a Jest-compatible API (describe, it, expect, vi.fn). To set it up I install vitest, jsdom, React Testing Library and jest-dom as dev dependencies, then add a test block to vite.config.js with environment: 'jsdom', globals: true and a setup file that loads jest-dom. I add a \"test\": \"vitest\" script, which runs in watch mode and re-runs only the tests affected by my change, and in CI I use vitest run so it runs once and exits.",
    code: `# 1. Install
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom

// 2. vite.config.js
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',              // fake browser DOM
    globals: true,                     // describe / it / expect without imports
    setupFiles: './src/setupTests.js', // runs before every test file
  },
})

// 3. src/setupTests.js
import '@testing-library/jest-dom/vitest'

// 4. package.json
"scripts": { "test": "vitest" }

// 5. src/Greeting.test.jsx
import { render, screen } from '@testing-library/react'
import Greeting from './Greeting'

describe('Greeting', () => {
  it('shows the name', () => {
    render(<Greeting name="Asha" />)
    expect(screen.getByText('Hello, Asha')).toBeInTheDocument()
  })
})`,
    output: `$ npm test -- --run --reporter=verbose

 ✓ src/Greeting.test.jsx > Greeting > shows the name

 Test Files  1 passed (1)
      Tests  1 passed (1)

npm test          -> watch mode, re-runs tests when files change
npx vitest run    -> runs once and exits (use in CI)`,
  },
  {
    q: 'How do you test React components with React Testing Library?',
    level: 'Basics',
    a: 'React Testing Library tests components the way a user uses them: I render the component, find elements by role, label or text, and fire events with user-event. I avoid testing internal state or implementation details, so refactoring does not break my tests. I run the tests with Vitest or Jest, and for async UI I use findBy queries, which wait for the element to appear.',
    code: `// Counter.jsx
export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
}

// Counter.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from './Counter'

test('increments the count when clicked', async () => {
  render(<Counter />)
  await userEvent.click(screen.getByRole('button'))
  expect(screen.getByText('Clicked 1 times')).toBeInTheDocument()
})`,
    output: ` ✓ src/Counter.test.jsx > increments the count when clicked

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
  },
  {
    q: 'getBy vs queryBy vs findBy vs getAllBy: which query should you use?',
    level: 'Basics',
    a: 'I use getBy when the element must be there right now, because it throws if it is missing. I use queryBy only to check that something is NOT there, because it returns null instead of throwing. I use findBy for things that appear later, since it returns a promise and retries until the element shows up (1 second by default), and the AllBy versions when I expect several matches. For which query to pick, I go in this order: getByRole first, then getByLabelText, getByText, and getByTestId only as a last resort.',
    code: `// TodoList.jsx: loads two todos after 100ms
useEffect(() => {
  setTimeout(() => setTodos(['Learn RTL', 'Write tests']), 100)
}, [])
return <ul>{todos.map((t) => <li key={t}>{t}</li>)}</ul>

// TodoList.test.jsx
test('getBy, queryBy, findBy and getAllBy', async () => {
  render(<TodoList />)
  expect(screen.getByRole('list')).toBeInTheDocument()       // must exist now
  expect(screen.queryByText('Learn RTL')).not.toBeInTheDocument() // may be absent
  expect(await screen.findByText('Learn RTL')).toBeInTheDocument() // waits (up to 1s)
  expect(screen.getAllByRole('listitem')).toHaveLength(2)    // many matches
})`,
    output: ` ✓ src/TodoList.test.jsx > getBy, queryBy, findBy and getAllBy

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
  },
  {
    q: 'How do you test typing in an input and submitting a form with user-event?',
    level: 'Intermediate',
    a: 'I create a user with userEvent.setup(), then await user.type() and user.click(), because user-event fires the full chain of real browser events (focus, keydown, input, keyup) instead of a single fake event like fireEvent. I find the input by its label, which also checks that the form is accessible, and the button by role and name. Then I assert on what the user sees after submitting, not on the component state.',
    code: `// LoginForm.jsx
const [email, setEmail] = useState('')
const [message, setMessage] = useState('')
<form onSubmit={(e) => { e.preventDefault(); setMessage('Welcome ' + email) }}>
  <label>Email <input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
  <button type="submit">Log in</button>
  <p>{message}</p>
</form>

// LoginForm.test.jsx
test('types an email and submits the form', async () => {
  const user = userEvent.setup()
  render(<LoginForm />)
  await user.type(screen.getByLabelText('Email'), 'asha@test.com')
  await user.click(screen.getByRole('button', { name: 'Log in' }))
  expect(screen.getByText('Welcome asha@test.com')).toBeInTheDocument()
})`,
    output: ` ✓ src/LoginForm.test.jsx > types an email and submits the form

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
  },
  {
    q: 'How do you test a component that fetches data from an API?',
    level: 'Intermediate',
    a: 'I never call the real API in a unit test, because it is slow and flaky, so I mock fetch with vi.spyOn and return fake data. First I assert the loading state, then I await findByText, which waits until the data has rendered. I also check that fetch was called with the right URL. For bigger apps I prefer MSW, which mocks the network instead of the fetch function.',
    code: `// Posts.jsx
useEffect(() => {
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.json())
    .then(setPosts)
}, [])
if (!posts) return <p>Loading...</p>
return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>

// Posts.test.jsx
test('shows posts from the API', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    json: async () => [{ id: 1, title: 'Hello world' }],
  })
  render(<Posts />)
  expect(screen.getByText('Loading...')).toBeInTheDocument()
  expect(await screen.findByText('Hello world')).toBeInTheDocument()
  expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
})`,
    output: ` ✓ src/Posts.test.jsx > shows posts from the API

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
  },
  {
    q: 'How do you mock functions and modules with vi.fn and vi.mock?',
    level: 'Intermediate',
    a: 'vi.fn() creates a mock function that records every call, so I pass it as a callback prop like onSubmit and then assert with toHaveBeenCalledWith. vi.mock(\'./module\') replaces a whole imported module, so every export becomes a mock function; I use it for things like analytics, logging or API clients that I do not want to run in a test. Vitest hoists vi.mock to the top of the file, so it applies before the component is imported. In Jest the same functions are jest.fn and jest.mock.',
    code: `// SubscribeForm.jsx
import { track } from './analytics'
export default function SubscribeForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    track('subscribe')
    onSubmit({ plan: 'pro' })
  }
  return <form onSubmit={handleSubmit}><button>Subscribe</button></form>
}

// SubscribeForm.test.jsx
import { track } from './analytics'
vi.mock('./analytics') // every export becomes a vi.fn()

test('calls onSubmit and tracks the event', async () => {
  const onSubmit = vi.fn()
  render(<SubscribeForm onSubmit={onSubmit} />)
  await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
  expect(onSubmit).toHaveBeenCalledWith({ plan: 'pro' })
  expect(onSubmit).toHaveBeenCalledTimes(1)
  expect(track).toHaveBeenCalledWith('subscribe')
})`,
    output: ` ✓ src/SubscribeForm.test.jsx > calls onSubmit and tracks the event

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
  },
  {
    q: 'How do you test a custom hook with renderHook and act?',
    level: 'Intermediate',
    a: 'A hook can only run inside a component, so I use renderHook from React Testing Library, which renders a tiny test component for me. result.current always holds the latest return value of the hook. When I call something that updates state, I wrap it in act() so React finishes the update before I assert. If the hook is simple and only used in one component, I usually just test it through that component instead.',
    code: `// useCounter.js
export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial)
  const increment = () => setCount((c) => c + 1)
  const reset = () => setCount(initial)
  return { count, increment, reset }
}

// useCounter.test.js
test('increments and resets the count', () => {
  const { result } = renderHook(() => useCounter(5))
  expect(result.current.count).toBe(5)
  act(() => result.current.increment())
  expect(result.current.count).toBe(6)
  act(() => result.current.reset())
  expect(result.current.count).toBe(5)
})`,
    output: ` ✓ src/useCounter.test.js > increments and resets the count

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
  },
  {
    q: 'What is snapshot testing, and when should you avoid it?',
    level: 'Intermediate',
    a: 'A snapshot test saves the rendered output to a __snapshots__ file the first time it runs, and later runs fail if the output changes; I update it on purpose with vitest -u. I use it only for small, stable pieces like a badge or an icon, or for serialized data. I avoid big component snapshots, because they break on every small markup change, people just press update without reading the diff, and they do not say what behavior matters. For most components I prefer explicit assertions with getByRole and toHaveTextContent.',
    code: `// Badge.jsx
export default function Badge({ status }) {
  return <span className={'badge badge-' + status}>{status.toUpperCase()}</span>
}

// Badge.test.jsx
test('matches the snapshot', () => {
  const { container } = render(<Badge status="active" />)
  expect(container.firstChild).toMatchSnapshot()
})`,
    output: ` ✓ src/Badge.test.jsx > matches the snapshot

  Snapshots  1 written
 Test Files  1 passed (1)
      Tests  1 passed (1)

// __snapshots__/Badge.test.jsx.snap (generated)
// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports[\`matches the snapshot 1\`] = \`
<span
  class="badge badge-active"
>
  ACTIVE
</span>
\`;`,
  },
  {
    q: 'How do you test a component that uses Redux Toolkit or Context?',
    level: 'Advanced',
    a: 'A component that calls useSelector or useContext crashes without its Provider, so I write a small renderWithStore helper that creates a real store with configureStore and wraps the UI in <Provider>. I use the real reducers instead of mocking useSelector, so the test covers the component and the slice together, and preloadedState lets me start from any state. Then I click like a user and assert on the screen, and only check store.getState() when it adds value. For Context it is the same idea: I wrap the component in the real Provider with a test value.',
    code: `// Cart.jsx shows "Items: N" and a button that dispatches addItem('Book')

// Cart.test.jsx
function renderWithStore(ui, preloadedState) {
  const store = configureStore({ reducer: { cart: cartReducer }, preloadedState })
  render(<Provider store={store}>{ui}</Provider>)
  return store
}

test('adds an item to the real store', async () => {
  const store = renderWithStore(<Cart />, { cart: { items: ['Pen'] } })
  expect(screen.getByText('Items: 1')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Add book' }))
  expect(screen.getByText('Items: 2')).toBeInTheDocument()
  expect(store.getState().cart.items).toEqual(['Pen', 'Book'])
})`,
    output: ` ✓ src/Cart.test.jsx > adds an item to the real store

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
  },
  {
    q: 'Mock Service Worker (MSW) vs mocking fetch: which do you prefer?',
    level: 'Advanced',
    a: 'Mocking fetch with vi.spyOn is quick for one test, but it ties the test to how the code calls the network, so it breaks if I switch to axios or React Query. MSW intercepts the real HTTP request at the network level and returns my fake response, so the component code runs exactly as in production. I can also reuse the same handlers in tests, in Storybook and in the browser during development. So for a real app I prefer MSW, and I keep plain fetch mocks for tiny one-off cases.',
    code: `// Posts.test.jsx: same Posts component, no fetch mock
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('https://jsonplaceholder.typicode.com/posts', () =>
    HttpResponse.json([{ id: 1, title: 'From MSW' }]),
  ),
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('shows posts returned by the mock server', async () => {
  render(<Posts />)
  expect(await screen.findByText('From MSW')).toBeInTheDocument()
})`,
    output: ` ✓ src/PostsMsw.test.jsx > shows posts returned by the mock server

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
  },
  {
    q: "What unit testing have you done in your React projects?",
    level: 'Intermediate',
    a: "In my last project, an employee management and payroll app with a React and TypeScript front end, I wrote component tests with Vitest, React Testing Library and user-event. I mostly tested what the user sees and does: forms like the salary and leave forms showing validation errors, the employee table rendering the right rows, and the Save button being disabled while a request is in progress. I tested custom hooks like useEmployees with renderHook, and our Redux Toolkit slices as plain reducer functions. For API calls I used MSW, so the components made real fetch calls to fake handlers, and vi.mock for small modules like analytics. We aimed for about 80% coverage on the business logic rather than 100% everywhere, and GitHub Actions ran the tests on every pull request. When a bug was reported, I first wrote a failing test that reproduced it and then fixed it, so it could not come back.",
    code: `// SalaryForm.test.jsx
import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SalaryForm from './SalaryForm'

test('shows an error for a negative salary', async () => {
  const user = userEvent.setup()
  render(<SalaryForm />)
  await user.type(screen.getByLabelText('Salary'), '-500')
  await user.click(screen.getByRole('button', { name: 'Save' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Salary must be greater than 0')
})`,
    output: `$ npx vitest run --reporter=verbose

 ✓ src/SalaryForm.test.jsx > shows an error for a negative salary

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
    q: 'What do createRoot and hydrateRoot do?',
    level: 'Intermediate',
    a: 'createRoot is how a client-side app starts: it takes an empty DOM node, and render builds the whole UI inside it. hydrateRoot is for server-rendered HTML: it reuses the markup that is already there and only attaches event handlers and state. If the client renders something different from the server, I get a hydration mismatch, so I keep things like dates and Math.random out of the first render.',
    code: `import { createRoot, hydrateRoot } from 'react-dom/client'

// Client-side app (Vite): the div starts empty
createRoot(document.getElementById('root')).render(<App />)

// Server-rendered HTML (SSR): reuse the existing markup
hydrateRoot(document.getElementById('root'), <App />)`,
    output: `createRoot   -> builds the DOM from scratch in the browser
hydrateRoot  -> keeps the server HTML, attaches events and state`,
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
    q: "What is React Fiber, and what role does it play?",
    level: 'Advanced',
    a: "React Fiber is the reconciliation engine inside React since version 16. It turns every component and element into a fiber, a small JavaScript object that knows its type, props, state, its parent, child and sibling, and what needs to change. Its role is to decide what to update and when: it splits rendering into small units of work, so React can pause, give priority to urgent updates like typing over a big list update, resume later, or throw away work that is no longer needed. Rendering happens in two phases: the render phase builds a new fiber tree by comparing it with the current one and can be interrupted, and the commit phase applies the collected changes to the real DOM in one go. Fiber is also where React keeps hook state for each component, and it is what makes Suspense, error boundaries, transitions and automatic batching possible.",
    code: `// Each element becomes a fiber node (simplified)
const fiber = {
  type: 'li',            // component or DOM tag
  props: { children: 'Item' },
  child: null,           // first child fiber
  sibling: null,         // next sibling fiber
  return: parentFiber,   // parent fiber
  lanes: 'DefaultLane',  // priority of the pending update
  alternate: oldFiber,   // the fiber from the previous render
}

// Urgent update (typing) can interrupt a non-urgent one
startTransition(() => setList(bigList))`,
    output: `Old stack reconciler (React 15)   Fiber (React 16+)
--------------------------------  ---------------------------------
Recursive, one big task           Work split into small units (fibers)
Can't pause, blocks the UI        Can pause, resume, or discard work
No priorities                     Priorities (lanes): input > transition

Render phase  -> build new fiber tree (interruptible)
Commit phase  -> apply changes to the DOM (not interruptible)

Role of Fiber: schedule work by priority, pause/resume/abort rendering,
store hook state per component, enable Suspense, transitions,
error boundaries and automatic batching`,
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
    q: "How do you implement JWT authentication and authorization in React?",
    level: 'Advanced',
    a: "Authentication is checking who the user is, and authorization is checking what they are allowed to do. On login I send the credentials to the backend, which returns a short-lived access token (a JWT) and sets a refresh token in an httpOnly cookie. I keep the access token in memory, in an AuthContext or the Redux store, rather than localStorage, because localStorage can be read by an XSS attack. Every API call adds an Authorization: Bearer header, and when I get a 401 I call the refresh endpoint once and retry, otherwise I log the user out. For authorization I read the user's role from the login response and use a ProtectedRoute that redirects guests to /login and users without the right role to /unauthorized; I also hide buttons they can't use, but the backend always checks the token and role again, because anything in the browser can be bypassed.",
    code: `// 1. Login: keep the access token in memory (AuthContext)
async function login(email, password) {
  const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  const { accessToken, user } = await res.json() // refresh token: httpOnly cookie
  setAuth({ token: accessToken, user })           // user = { name: 'Asha', role: 'admin' }
}

// 2. Send the token with every request
fetch('/api/employees', { headers: { Authorization: 'Bearer ' + auth.token } })

// 3. Authorization: protect routes by role
function ProtectedRoute({ roles, children }) {
  const { auth } = useAuth()
  if (!auth.token) return <Navigate to="/login" replace />
  if (roles && !roles.includes(auth.user.role)) return <Navigate to="/unauthorized" replace />
  return children
}

<Route path="/payroll" element={<ProtectedRoute roles={['admin']}><Payroll /></ProtectedRoute>} />`,
    output: `Login -> POST /api/login -> { accessToken (JWT), user: { role } }
      + refresh token in an httpOnly cookie (JS can't read it)
Request -> Authorization: Bearer <accessToken>
401 expired -> POST /api/refresh -> new accessToken -> retry once
              (refresh fails -> logout -> /login)

Guest  opens /payroll -> redirected to /login
Viewer opens /payroll -> redirected to /unauthorized
Admin  opens /payroll -> Payroll page

Frontend checks = better UX; backend checks = real security`,
  },
  {
    q: "What is the difference between authentication and authorization?",
    level: "Basics",
    a: "Authentication answers 'who are you?': the user proves their identity with a password, Google login or OTP, and gets a token or session. Authorization answers 'what are you allowed to do?': with the identity known, the server checks the user's role or permissions for this action. Authentication always comes first. When it fails the server returns 401 Unauthorized (really meaning not authenticated), and when you are logged in but not allowed it returns 403 Forbidden. In React I do both for user experience, like redirecting guests to /login and hiding admin buttons, but the real checks always happen on the server.",
    code: `const USERS = { guest: null, asha: { name: 'Asha', role: 'viewer' }, ravi: { name: 'Ravi', role: 'admin' } }

// What the server does for every request
function checkRequest(user, action) {
  if (!user) return '401 Unauthorized: please log in'             // authentication failed
  if (action === 'delete' && user.role !== 'admin')
    return '403 Forbidden: admins only'                           // authorization failed
  return action === 'delete' ? '200 OK: post deleted' : '200 OK: here are the posts'
}

checkRequest(USERS.guest, 'view')    // who are you?
checkRequest(USERS.asha, 'delete')   // you're Asha, but not an admin
checkRequest(USERS.ravi, 'delete')   // admin: allowed`,
    output: <AuthCheckDemo />,
  },
  {
    q: "How do you create protected routes (route guards) with React Router?",
    level: "Intermediate",
    a: "I keep the logged-in user in an AuthContext and wrap private pages in a ProtectedRoute component. If there is no user it returns <Navigate to=\"/login\" replace />, and I pass the current path in state so after login I can send the user back to the page they asked for. If the route needs a role, like admin, and the user doesn't have it, I redirect to /unauthorized. I use replace so the blocked URL doesn't stay in the browser history. This is the React version of Angular's canActivate guard, and it only protects the UI: the API must still check the token and role.",
    code: `import { createContext, useContext, useState } from 'react'
import { MemoryRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)
const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  return <AuthContext value={{ user, login: setUser, logout: () => setUser(null) }}>{children}</AuthContext>
}

function ProtectedRoute({ roles, children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />
  return children
}

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const from = useLocation().state?.from || '/'
  const signIn = (user) => { login(user); navigate(from, { replace: true }) }
  return (
    <div>
      <button onClick={() => signIn({ name: 'Asha', role: 'viewer' })}>Log in as Asha (viewer)</button>
      <button onClick={() => signIn({ name: 'Ravi', role: 'admin' })}>Log in as Ravi (admin)</button>
    </div>
  )
}

function AuthNav() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/dashboard">Dashboard</Link> | <Link to="/admin">Admin</Link>
      {' '}URL: {pathname} | {user ? user.name + ' (' + user.role + ')' : 'Guest'}
      {user && <button onClick={logout}>Log out</button>}
    </nav>
  )
}

function App() {
  return (
    <AuthProvider>
      <MemoryRouter>
        <AuthNav />
        <Routes>
          <Route path="/" element={<p>Home (public)</p>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><p>Dashboard (any logged-in user)</p></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><p>Admin panel (admins only)</p></ProtectedRoute>} />
          <Route path="/unauthorized" element={<p>403: you don't have access to that page</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}`,
    output: <ProtectedRoutesDemo />,
  },
  {
    q: "What are HTTP interceptors, and how do you use axios interceptors in React?",
    level: "Intermediate",
    a: "An interceptor is a function that runs for every request before it is sent, or for every response before my component gets it. I create one axios instance for the app and add interceptors to it once. In the request interceptor I attach the Authorization: Bearer token, and I can add headers like a language or request id. In the response interceptor I handle errors in one place: a 401 logs the user out, other errors become a friendly message or a toast, and I can log timings. Components then just call api.get('/posts/1') and don't repeat this logic. Without axios I get the same effect with a small fetch wrapper function, and in Angular the same idea is an HttpInterceptor.",
    code: `import axios from 'axios'

const api = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com' })
let token = 'abc123' // set after login, kept in memory

// Runs before every request is sent
api.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer ' + token
  config.startedAt = Date.now()
  return config
})

// Runs for every response (first function) and every error (second function)
api.interceptors.response.use(
  (response) => {
    console.log(response.status, 'in', Date.now() - response.config.startedAt, 'ms')
    return response
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) token = null // log out and go to /login
    return Promise.reject(new Error(status === 404 ? 'Post not found' : 'Something went wrong'))
  }
)

// In a component: no token or error code here
try {
  const { data } = await api.get('/posts/1')
  setTitle(data.title)
} catch (err) {
  setError(err.message)
}`,
    output: <InterceptorDemo />,
  },
  {
    q: "How do you refresh an expired access token with an interceptor (401, refresh, retry)?",
    level: "Advanced",
    a: "The access token is short-lived and kept in memory, and the refresh token is in an httpOnly cookie. In the response interceptor, when a request fails with 401 I mark it with _retry so it is retried only once, call /refresh to get a new access token, and then send the original request again. The request interceptor adds the new token. The tricky part is several requests failing at the same time: I store the refresh promise in one variable, so they all wait for a single refresh instead of calling it three times. If the refresh itself fails, the session has really ended, so I clear the token and redirect to /login. In this demo a fake server (an axios adapter) does the token check, because jsonplaceholder has no auth; the posts themselves come from jsonplaceholder.",
    code: `const api = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com' })
let accessToken = 'token-1' // in memory; refresh token is an httpOnly cookie
let refreshing = null       // one shared refresh for all failing requests

api.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer ' + accessToken
  return config
})

api.interceptors.response.use(undefined, async (error) => {
  const original = error.config
  if (error.response?.status !== 401 || original._retry) return Promise.reject(error)
  original._retry = true // retry only once, never loop

  refreshing ??= api
    .post('/refresh') // the browser sends the httpOnly cookie
    .then((res) => { accessToken = res.data.accessToken })
    .finally(() => { refreshing = null })

  await refreshing // refresh failed? it throws: clear the token, go to /login
  return api(original) // retry with the new token
})

// Three requests at once with an expired token
await Promise.all([1, 2, 3].map((id) => api.get('/posts/' + id)))`,
    output: <RefreshTokenDemo />,
  },
  {
    q: 'How do environment variables work in Vite?',
    level: 'Advanced',
    a: 'Vite loads variables from .env files but exposes only the ones starting with VITE_ to my code, through import.meta.env instead of process.env. They are replaced at build time, so they end up inside the JavaScript bundle where anyone can read them; I never put secrets like private API keys there, those stay on a server. I use .env.development and .env.production for per-mode values, and .env.local for my own machine, which is git-ignored.',
    code: `# .env
VITE_API_URL=https://jsonplaceholder.typicode.com
DB_PASSWORD=secret123   # not exposed: no VITE_ prefix

# .env.development
VITE_API_URL=http://localhost:3000

// src/api.js
const API_URL = import.meta.env.VITE_API_URL
console.log(import.meta.env.MODE)        // 'development' or 'production'
console.log(import.meta.env.DB_PASSWORD) // undefined`,
    output: `npm run dev    -> VITE_API_URL = http://localhost:3000, MODE = development
npm run build  -> VITE_API_URL = https://jsonplaceholder.typicode.com, MODE = production
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
