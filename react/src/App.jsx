import { Routes, Route, Link } from 'react-router-dom'
import PostSearch from './pages/PostSearch.jsx'
import postSearchSource from './pages/PostSearch.jsx?raw'
import BubbleSort from './pages/BubbleSort.jsx'
import bubbleSortSource from './pages/BubbleSort.jsx?raw'
import StringReverse from './pages/StringReverse.jsx'
import stringReverseSource from './pages/StringReverse.jsx?raw'
import Palindrome from './pages/Palindrome.jsx'
import palindromeSource from './pages/Palindrome.jsx?raw'

// Add each new program here: it shows up in the list and gets its own page.
// Import the file a second time with `?raw` to show its code beside the output.
const programs = [
  {
    path: '/post-search',
    title: 'Post Search',
    description: 'Fetch posts from an API and filter them with a debounced search.',
    component: PostSearch,
    source: postSearchSource,
  },
  {
    path: '/bubble-sort',
    title: 'Bubble Sort',
    description: 'Sort an array of numbers with bubble sort.',
    component: BubbleSort,
    source: bubbleSortSource,
  },
  {
    path: '/string-reverse',
    title: 'String Reverse',
    description: 'Reverse a string with a loop.',
    component: StringReverse,
    source: stringReverseSource,
  },
  {
    path: '/palindrome',
    title: 'Palindrome',
    description: 'Check whether words read the same forwards and backwards.',
    component: Palindrome,
    source: palindromeSource,
  },
]

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium tracking-wide text-indigo-400 uppercase">Interview prep</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Programs</h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Small JavaScript and React programs. Open one to see its code beside the live output.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {programs.map((program, index) => (
            <Link
              key={program.path}
              to={program.path}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:-translate-y-0.5 hover:border-indigo-500/60 hover:bg-slate-900"
            >
              <span className="font-mono text-xs text-slate-500">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-2 flex items-center justify-between text-lg font-semibold">
                {program.title}
                <span className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-indigo-400">
                  →
                </span>
              </h2>
              <p className="mt-1 text-sm text-slate-400">{program.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function CodeView({ source }) {
  const lines = source.trimEnd().split('\n')

  return (
    <pre className="p-4 font-mono text-[13px] leading-6">
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="w-10 shrink-0 pr-4 text-right text-slate-600 select-none">{i + 1}</span>
          <code className="whitespace-pre text-slate-200">{line}</code>
        </div>
      ))}
    </pre>
  )
}

function PaneLabel({ children, dark }) {
  return (
    <div
      className={`sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-2 text-xs font-semibold tracking-wider uppercase backdrop-blur ${
        dark
          ? 'border-slate-800 bg-slate-950/90 text-slate-400'
          : 'border-slate-200 bg-white/90 text-slate-500'
      }`}
    >
      {children}
    </div>
  )
}

function ProgramPage({ title, source, Page }) {
  return (
    <div className="flex h-screen flex-col bg-slate-950 max-md:h-auto">
      <header className="flex items-center gap-4 border-b border-slate-800 px-4 py-3 text-slate-100 sm:px-6">
        <Link
          to="/"
          className="rounded-lg px-2 py-1 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          ← Programs
        </Link>
        <span className="text-slate-700">/</span>
        <h1 className="font-semibold">{title}</h1>
      </header>

      <div className="grid min-h-0 flex-1 md:grid-cols-2">
        <section className="min-w-0 overflow-auto bg-slate-950 max-md:max-h-[70vh]">
          <PaneLabel dark>
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-amber-400/80" />
              <span className="size-2.5 rounded-full bg-emerald-400/80" />
            </span>
            Program
          </PaneLabel>
          <CodeView source={source} />
        </section>

        <section className="min-w-0 overflow-auto bg-slate-50 max-md:min-h-[50vh]">
          <PaneLabel>
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            Output
          </PaneLabel>
          <Page />
        </section>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {programs.map(({ path, title, component, source }) => (
        <Route
          key={path}
          path={path}
          element={<ProgramPage title={title} source={source} Page={component} />}
        />
      ))}
    </Routes>
  )
}

export default App
