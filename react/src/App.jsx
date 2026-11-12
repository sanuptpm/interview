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
    <div style={{ padding: '20px' }}>
      <h1>Programs</h1>
      <ul>
        {programs.map((program) => (
          <li key={program.path} style={{ marginBottom: '8px' }}>
            <Link to={program.path}>{program.title}</Link>
            <div style={{ color: '#666', fontSize: '14px' }}>{program.description}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {programs.map(({ path, title, component: Page, source }) => (
        <Route
          key={path}
          path={path}
          element={
            <div className="program-page">
              <div className="program-header">
                <Link to="/">← Back to programs</Link>
                <strong>{title}</strong>
              </div>
              <div className="split">
                <section className="pane code-pane">
                  <div className="pane-label">Program</div>
                  <pre>
                    <code>{source}</code>
                  </pre>
                </section>
                <section className="pane output-pane">
                  <div className="pane-label">Output</div>
                  <Page />
                </section>
              </div>
            </div>
          }
        />
      ))}
    </Routes>
  )
}

export default App
