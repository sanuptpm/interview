// Sub-topic order for the react page: related questions are shown together.
// Each question title appears in exactly one topic, in the order shown on the page.
export default [
  {
    topic: 'React fundamentals',
    questions: [
      "What is React?",
      "What is the Virtual DOM?",
      "What is a component tree, and what does one-way data flow mean?",
      "How do you organise the folder structure of a React project?",
    ],
  },
  {
    topic: 'Components & JSX',
    questions: [
      "What is JSX?",
      "What are the rules of JSX?",
      "Function components vs class components?",
      "What are Fragments?",
      "What is the children prop?",
    ],
  },
  {
    topic: 'Props & state',
    questions: [
      "What are props?",
      "How do you destructure props and set default values?",
      "What is state?",
      "What is the difference between props and state?",
      "What is lifting state up?",
      "How does a child send data to its parent?",
      "How do you type-check props? PropTypes vs TypeScript",
    ],
  },
  {
    topic: 'Updating state',
    questions: [
      "How do you add, remove, update and toggle items in array state? (todo list)",
      "How do you update nested object state?",
      "Derived state vs duplicated state",
      "Why should state be immutable? How do you update arrays and objects?",
    ],
  },
  {
    topic: 'Events',
    questions: [
      "How do you handle events in React?",
      "How do you pass arguments to an event handler?",
      "What is a SyntheticEvent? e.target vs e.currentTarget and stopPropagation",
    ],
  },
  {
    topic: 'Lists & conditional rendering',
    questions: [
      "How do you do conditional rendering?",
      "How do you render nothing, and why does {count && ...} show a 0?",
      "How do you render lists, and why do keys matter?",
      "Why is using the index as a key a problem when reordering a list?",
    ],
  },
  {
    topic: 'Forms & inputs',
    questions: [
      "Controlled vs uncontrolled inputs?",
      "How do you handle forms?",
      "How do you handle multiple inputs with one onChange handler?",
      "How do you control a select, checkbox and radio buttons?",
      "How do you do form validation with error messages?",
      "How do you validate inputs: real-time, on blur, or on submit?",
      "How do you build a textarea with a character counter?",
      "How do you build dependent dropdowns (country and city)?",
    ],
  },
  {
    topic: 'Styling & assets',
    questions: [
      "How do you add conditional classes and styles?",
      "Inline styles vs CSS Modules vs Tailwind: which do you use?",
      "How do you import images and other static assets in a Vite React app?",
    ],
  },
  {
    topic: 'Hooks: overview & rules',
    questions: [
      "What are hooks in React, and what types of hooks are there?",
      "What built-in hooks does React have?",
      "What are the rules of hooks?",
      "What is useId?",
    ],
  },
  {
    topic: 'Hooks: useState & useReducer',
    questions: [
      "useState and functional updates",
      "What is a lazy initializer in useState?",
      "What is useReducer?",
      "If useState can do everything, why do we need useReducer?",
    ],
  },
  {
    topic: 'Hooks: effects',
    questions: [
      "useEffect: dependency array and cleanup",
      "What are common useEffect mistakes?",
      "How do you cancel a fetch in useEffect with AbortController?",
      "What is the stale closure problem with setInterval?",
      "useLayoutEffect vs useEffect?",
      "useEffect vs useCallback: what is the difference?",
      "How do you fetch data in useEffect with loading and error states?",
      "Why do effects run twice in StrictMode?",
      "How do lifecycle methods map to hooks?",
    ],
  },
  {
    topic: 'Hooks: refs',
    questions: [
      "What is useRef used for?",
      "How do you pass a ref to a child? forwardRef vs ref as a prop (React 19)",
      "What is useImperativeHandle?",
    ],
  },
  {
    topic: 'Hooks: memo & performance hooks',
    questions: [
      "What is useMemo?",
      "What is useCallback?",
      "When should you use useCallback (and when not)?",
      "What are useTransition and useDeferredValue?",
    ],
  },
  {
    topic: 'Custom hooks',
    questions: [
      "How do you create a simple custom hook to toggle open and close?",
      "What is a custom hook?",
      "How do you write a useLocalStorage custom hook?",
      "How do you close a dropdown when the user clicks outside? (useOnClickOutside)",
      "HOCs vs custom hooks?",
    ],
  },
  {
    topic: 'Context & state management',
    questions: [
      "What is the Context API / useContext?",
      "How do you build a global store with Context and useReducer?",
      "Context vs Redux vs Zustand: how do you choose state management?",
    ],
  },
  {
    topic: 'Rendering & reconciliation',
    questions: [
      "How does React render? Render phase vs commit phase",
      "When does a component re-render?",
      "What is batching in React?",
      "What is reconciliation and how does the key prop affect it?",
      "What is concurrent rendering (and React Fiber)?",
    ],
  },
  {
    topic: 'Performance',
    questions: [
      "What is React.memo?",
      "Why does React.memo sometimes not help? (inline objects and functions)",
      "How do you optimize performance in a React app?",
      "What is lazy loading with React.lazy and Suspense?",
      "How do you build a debounced search input?",
    ],
  },
  {
    topic: 'Component patterns',
    questions: [
      "What is the compound components pattern?",
      "What is the render props pattern?",
      "What are error boundaries?",
      "What are portals?",
    ],
  },
  {
    topic: 'Accessibility & security',
    questions: [
      "How do you build an accessible modal that closes on Escape and manages focus?",
      "How do you make React components accessible?",
      "How does React protect against XSS, and when is dangerouslySetInnerHTML risky?",
    ],
  },
  {
    topic: 'React 19 & server',
    questions: [
      "What are Actions and useActionState in React 19?",
      "What is useOptimistic?",
      "What is the use() API in React 19, and how does Suspense work for data?",
      "What are Server Actions (Server Functions)?",
      "Server Components vs Client Components?",
      "CSR vs SSR vs SSG: what is hydration?",
      "Next.js vs Vite: when would you choose each?",
    ],
  },
  {
    topic: 'Routing, testing & tooling',
    questions: [
      "React Router basics",
      "How do you test React components with React Testing Library?",
      "How do environment variables work in Vite?",
    ],
  },
  {
    topic: 'Coding tasks',
    questions: [
      "How do you build a stopwatch with start, stop and reset?",
      "How do you paginate a list?",
      "How do you build a list with search, filter and sort?",
      "Coding task: build a counter with undo and redo",
      "Coding task: todo list with All / Active / Completed filters",
      "Coding task: build a star rating component",
      "Coding task: build an OTP input with auto-focus and paste",
    ],
  },
]
