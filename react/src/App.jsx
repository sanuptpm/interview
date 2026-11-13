import { lazy, Suspense, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { highlightLines } from './lib/highlight.js'
import TryIt from './tryit/TryIt.jsx'
import TryItButton from './tryit/TryItButton.jsx'
import postSearchSource from './pages/PostSearch.jsx?raw'
import bubbleSortSource from './pages/BubbleSort.jsx?raw'
import stringReverseSource from './pages/StringReverse.jsx?raw'
import palindromeSource from './pages/Palindrome.jsx?raw'
import reduxCounterSource from './pages/ReduxCounter.jsx?raw'
import reduxStoreSource from './pages/reduxCounter/store.js?raw'
import reduxSliceSource from './pages/reduxCounter/counterSlice.js?raw'
import reduxComponentSource from './pages/reduxCounter/Counter.jsx?raw'

// Each page is loaded only when it is opened, to keep the first load small.
const TopicsIndex = lazy(() => import('./pages/TopicsIndex.jsx'))
const PostSearch = lazy(() => import('./pages/PostSearch.jsx'))
const BubbleSort = lazy(() => import('./pages/BubbleSort.jsx'))
const StringReverse = lazy(() => import('./pages/StringReverse.jsx'))
const Palindrome = lazy(() => import('./pages/Palindrome.jsx'))
const ReduxCounter = lazy(() => import('./pages/ReduxCounter.jsx'))
const CssQuestions = lazy(() => import('./pages/CssQuestions.jsx'))
const JavaScript = lazy(() => import('./pages/JavaScript.jsx'))
const TypeScriptQuestions = lazy(() => import('./pages/TypeScriptQuestions.jsx'))
const ReactQuestions = lazy(() => import('./pages/ReactQuestions.jsx'))
const PythonQuestions = lazy(() => import('./pages/PythonQuestions.jsx'))
const FastApiQuestions = lazy(() => import('./pages/FastApiQuestions.jsx'))
const DatabaseQuestions = lazy(() => import('./pages/DatabaseQuestions.jsx'))
const GitQuestions = lazy(() => import('./pages/GitQuestions.jsx'))
const DockerQuestions = lazy(() => import('./pages/DockerQuestions.jsx'))
const AwsQuestions = lazy(() => import('./pages/AwsQuestions.jsx'))
const AiMlQuestions = lazy(() => import('./pages/AiMlQuestions.jsx'))

// Add each new page here: it shows up on the home page and gets its own route.
// group: 'questions' (interview Q&A) or 'program' (coding program with its code shown).
// Import the file a second time with `?raw` to show its code beside the output.
// Leave out `source` for question-and-answer pages: they show full width with no code pane.
// Multi-file programs use `files: [{ name, code, sandpack }]` instead of `source`.
const programs = [
  {
    path: '/post-search',
    group: 'program',
    badge: 'React',
    badgeColor: 'bg-sky-50 text-sky-700',
    title: 'Post Search',
    description: 'Fetch posts from an API and filter them with a debounced search.',
    component: PostSearch,
    source: postSearchSource,
  },
  {
    path: '/bubble-sort',
    group: 'program',
    badge: 'Algorithm',
    badgeColor: 'bg-amber-50 text-amber-700',
    title: 'Bubble Sort',
    description: 'Sort an array of numbers with bubble sort.',
    component: BubbleSort,
    source: bubbleSortSource,
  },
  {
    path: '/string-reverse',
    group: 'program',
    badge: 'String',
    badgeColor: 'bg-amber-50 text-amber-700',
    title: 'String Reverse',
    description: 'Reverse a string with a loop.',
    component: StringReverse,
    source: stringReverseSource,
  },
  {
    path: '/palindrome',
    group: 'program',
    badge: 'String',
    badgeColor: 'bg-amber-50 text-amber-700',
    title: 'Palindrome',
    description: 'Check whether words read the same forwards and backwards.',
    component: Palindrome,
    source: palindromeSource,
  },
  {
    path: '/redux-counter',
    group: 'program',
    badge: 'Redux',
    badgeColor: 'bg-violet-50 text-violet-700',
    title: 'Redux Toolkit Counter',
    description: 'Full Redux Toolkit flow: slice, store, Provider, useSelector and useDispatch.',
    component: ReduxCounter,
    // Multi-file program: shown in this order. `sandpack` is the file's path in the Try-it editor.
    files: [
      { name: 'reduxCounter/counterSlice.js', code: reduxSliceSource, sandpack: '/reduxCounter/counterSlice.js' },
      { name: 'reduxCounter/store.js', code: reduxStoreSource, sandpack: '/reduxCounter/store.js' },
      { name: 'reduxCounter/Counter.jsx', code: reduxComponentSource, sandpack: '/reduxCounter/Counter.js' },
      { name: 'ReduxCounter.jsx (App)', code: reduxCounterSource, sandpack: '/App.js' },
    ],
  },
  {
    path: '/css-questions',
    group: 'questions',
    badge: 'CSS',
    badgeColor: 'bg-pink-50 text-pink-700',
    title: 'CSS Interview Questions',
    description: 'Box model, flexbox, grid, position, specificity and more, with live examples.',
    component: CssQuestions,
  },
  {
    path: '/javascript',
    group: 'questions',
    badge: 'JS',
    badgeColor: 'bg-yellow-50 text-yellow-700',
    title: 'JavaScript Interview Questions',
    description: 'Basics (let/const, arrow functions, spread, map, filter...) and interview questions with live output.',
    component: JavaScript,
  },
  {
    path: '/typescript-questions',
    group: 'questions',
    badge: 'TypeScript',
    badgeColor: 'bg-blue-50 text-blue-800',
    title: 'TypeScript Interview Questions',
    description: 'Types, interfaces, generics, utility types, narrowing and TypeScript with React.',
    component: TypeScriptQuestions,
  },
  {
    path: '/react-questions',
    group: 'questions',
    badge: 'React',
    badgeColor: 'bg-sky-50 text-sky-700',
    title: 'React Interview Questions',
    description: 'From JSX and props to hooks, performance and patterns, with live demos.',
    component: ReactQuestions,
  },
  {
    path: '/python-questions',
    group: 'questions',
    badge: 'Python',
    badgeColor: 'bg-blue-50 text-blue-700',
    title: 'Python Interview Questions',
    description: 'From basics to decorators, generators, OOP and coding problems.',
    component: PythonQuestions,
  },
  {
    path: '/fastapi-questions',
    group: 'questions',
    badge: 'FastAPI',
    badgeColor: 'bg-emerald-50 text-emerald-700',
    title: 'FastAPI Interview Questions',
    description: 'Routes, Pydantic models, validation, dependencies, auth, async and testing.',
    component: FastApiQuestions,
  },
  {
    path: '/database-questions',
    group: 'questions',
    badge: 'Database',
    badgeColor: 'bg-orange-50 text-orange-700',
    title: 'Database Interview Questions',
    description: 'SQL queries, joins, indexes, normalization, transactions and NoSQL.',
    component: DatabaseQuestions,
  },
  {
    path: '/git-questions',
    group: 'questions',
    badge: 'Git',
    badgeColor: 'bg-red-50 text-red-700',
    title: 'Git Interview Questions',
    description: 'Commits, branches, merge vs rebase, resolving conflicts and undoing changes.',
    component: GitQuestions,
  },
  {
    path: '/docker-questions',
    group: 'questions',
    badge: 'Docker',
    badgeColor: 'bg-cyan-50 text-cyan-700',
    title: 'Docker Interview Questions',
    description: 'Images, containers, Dockerfile, volumes, networks and Docker Compose.',
    component: DockerQuestions,
  },
  {
    path: '/aws-questions',
    group: 'questions',
    badge: 'AWS',
    badgeColor: 'bg-amber-50 text-amber-700',
    title: 'AWS Interview Questions',
    description: 'EC2, S3, IAM, VPC, Lambda, RDS and deploying applications.',
    component: AwsQuestions,
  },
  {
    path: '/ai-ml-questions',
    group: 'questions',
    badge: 'AI/ML',
    badgeColor: 'bg-violet-50 text-violet-700',
    title: 'AI/ML Interview Questions',
    description: 'ML basics, model evaluation, common algorithms, deep learning and LLMs.',
    component: AiMlQuestions,
  },
]

function PageCard({ page, number }) {
  return (
    <Link
      to={page.path}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${page.badgeColor}`}>
          {page.badge}
        </span>
        <span className="font-mono text-xs text-slate-400">{String(number).padStart(2, '0')}</span>
      </div>
      <h3 className="mt-4 flex items-center justify-between text-lg font-semibold">
        {page.title}
        <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600">
          →
        </span>
      </h3>
      <p className="mt-1 text-sm text-slate-500">{page.description}</p>
    </Link>
  )
}

function Section({ title, subtitle, pages }) {
  return (
    <section className="mt-14">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page, index) => (
          <PageCard key={page.path} page={page} number={index + 1} />
        ))}
      </div>
    </section>
  )
}

function Home() {
  const questionPages = programs.filter((p) => p.group === 'questions')
  const programPages = programs.filter((p) => p.group === 'program')

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">Interview prep</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Crack your frontend &amp; backend interview
        </h1>
        <p className="mt-4 max-w-2xl text-slate-500">
          Interview questions with answers you can say out loud, plus working examples and their
          output. From the basics to advanced topics.
        </p>
        <Link
          to="/index"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Open the Index: every topic and sub-topic →
        </Link>
        <div className="mt-6 flex flex-wrap gap-2">
          {questionPages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className={`rounded-full px-3 py-1 text-sm font-medium transition hover:opacity-80 ${page.badgeColor}`}
            >
              {page.badge}
            </Link>
          ))}
        </div>

        <Section
          title="Interview Questions"
          subtitle="Question, interview-style answer, example and output for each topic."
          pages={questionPages}
        />

        <Section
          title="Coding Programs"
          subtitle="Small programs with the code on the left and the live output on the right."
          pages={programPages}
        />
      </div>
    </div>
  )
}

function CodeView({ source }) {
  const lines = highlightLines(source.trimEnd(), 'javascript')

  return (
    <pre className="code-theme p-4 font-mono text-[13px] leading-6">
      {lines.map((html, i) => (
        <div key={i} className="flex">
          <span className="w-10 shrink-0 pr-4 text-right text-slate-400 select-none">{i + 1}</span>
          <code
            className="whitespace-pre"
            dangerouslySetInnerHTML={{ __html: html || ' ' }}
          />
        </div>
      ))}
    </pre>
  )
}

function PaneLabel({ children }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-200 bg-white/90 px-4 py-2 text-xs font-semibold tracking-wider text-slate-500 uppercase backdrop-blur">
      {children}
    </div>
  )
}

function ProgramPage({ title, source, files, Page }) {
  // "Try it" swaps the code + output view for a live editor of the same program
  const [editing, setEditing] = useState(false)
  // A program is one `source` file or several `files` (shown in order)
  const sources = files || (source ? [{ name: null, code: source }] : null)
  const sandpackFiles = files
    ? Object.fromEntries(files.map((file) => [file.sandpack, file.code]))
    : undefined

  return (
    <div className="flex h-screen flex-col bg-white max-md:h-auto">
      <header className="flex items-center gap-4 border-b border-slate-200 px-4 py-3 text-slate-900 sm:px-6">
        <Link
          to="/"
          className="rounded-lg px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          ← Home
        </Link>
        <Link
          to="/index"
          className="rounded-lg px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Index
        </Link>
        <span className="text-slate-300">/</span>
        <h1 className="font-semibold">{title}</h1>
        {sources && (
          <div className="ml-auto">
            <TryItButton open={editing} onClick={() => setEditing(!editing)} />
          </div>
        )}
      </header>

      {editing && (
        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          <TryIt kind="react" code={source} files={sandpackFiles} tailwind height={560} />
        </div>
      )}

      <div className={`grid min-h-0 flex-1 ${sources ? 'md:grid-cols-2' : ''} ${editing ? 'hidden' : ''}`}>
        {sources && (
          <section className="min-w-0 overflow-auto border-r border-slate-200 bg-white max-md:max-h-[70vh] max-md:border-r-0 max-md:border-b">
            <PaneLabel>
              <span className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400/80" />
                <span className="size-2.5 rounded-full bg-amber-400/80" />
                <span className="size-2.5 rounded-full bg-emerald-400/80" />
              </span>
              Program
            </PaneLabel>
            {sources.map((file) => (
              <div key={file.name || 'main'}>
                {file.name && (
                  <p className="border-y border-slate-200 bg-slate-50 px-4 py-1.5 font-mono text-xs font-semibold text-slate-600">
                    {file.name}
                  </p>
                )}
                <CodeView source={file.code} />
              </div>
            ))}
          </section>
        )}

        <section className="min-w-0 overflow-auto bg-white max-md:min-h-[50vh]">
          {sources && (
            <PaneLabel>
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              Output
            </PaneLabel>
          )}
          <Suspense fallback={<p className="p-6 text-sm text-slate-500">Loading...</p>}>
            <Page />
          </Suspense>
        </section>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/index"
        element={
          <Suspense fallback={<p className="p-6 text-sm text-slate-500">Loading...</p>}>
            <TopicsIndex programs={programs.filter((p) => p.group === 'program')} />
          </Suspense>
        }
      />
      {programs.map(({ path, title, component, source, files }) => (
        <Route
          key={path}
          path={path}
          element={<ProgramPage title={title} source={source} files={files} Page={component} />}
        />
      ))}
    </Routes>
  )
}

export default App
