import { Link } from 'react-router-dom'
import { slug } from '../lib/levels.js'
import cssTopics from './topics/cssTopics.js'
import jsBasicsTopics from './topics/jsBasicsTopics.js'
import javascriptTopics from './topics/javascriptTopics.js'
import typescriptTopics from './topics/typescriptTopics.js'
import reactTopics from './topics/reactTopics.js'
import pythonTopics from './topics/pythonTopics.js'
import aiMlTopics from './topics/aiMlTopics.js'
import fastapiTopics from './topics/fastapiTopics.js'
import databaseTopics from './topics/databaseTopics.js'
import gitTopics from './topics/gitTopics.js'
import dockerTopics from './topics/dockerTopics.js'
import awsTopics from './topics/awsTopics.js'

// Every question page and its sub-topic lists. `prefix` matches the idPrefix the
// page uses for its anchors (the JavaScript page has two lists).
const pages = [
  { title: 'CSS', path: '/css-questions', lists: [{ prefix: '', topics: cssTopics }] },
  {
    title: 'JavaScript',
    path: '/javascript',
    lists: [
      { label: 'Basics', prefix: 'b-', topics: jsBasicsTopics },
      { label: 'Interview questions', prefix: 'q-', topics: javascriptTopics },
    ],
  },
  { title: 'TypeScript', path: '/typescript-questions', lists: [{ prefix: '', topics: typescriptTopics }] },
  { title: 'React', path: '/react-questions', lists: [{ prefix: '', topics: reactTopics }] },
  { title: 'Python', path: '/python-questions', lists: [{ prefix: '', topics: pythonTopics }] },
  { title: 'AI/ML', path: '/ai-ml-questions', lists: [{ prefix: '', topics: aiMlTopics }] },
  { title: 'FastAPI', path: '/fastapi-questions', lists: [{ prefix: '', topics: fastapiTopics }] },
  { title: 'Database', path: '/database-questions', lists: [{ prefix: '', topics: databaseTopics }] },
  { title: 'Git', path: '/git-questions', lists: [{ prefix: '', topics: gitTopics }] },
  { title: 'Docker', path: '/docker-questions', lists: [{ prefix: '', topics: dockerTopics }] },
  { title: 'AWS', path: '/aws-questions', lists: [{ prefix: '', topics: awsTopics }] },
]

const countOf = (lists) =>
  lists.reduce((sum, list) => sum + list.topics.reduce((n, t) => n + t.questions.length, 0), 0)

// One page that lists every topic and its sub-topics, linking straight to each section,
// plus the coding programs. `programs` is the program list from App.jsx (group: 'program').
function TopicsIndex({ programs = [] }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← Home
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Index</h1>
        <p className="mt-2 text-slate-500">
          Every topic and sub-topic. Click one to jump straight to it.
        </p>

        {/* Quick links to each topic below */}
        <div className="mt-6 flex flex-wrap gap-2">
          {pages.map((page) => (
            <a
              key={page.path}
              href={'#' + slug(page.title)}
              className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-100"
            >
              {page.title}
            </a>
          ))}
          <a
            href="#coding-programs"
            className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 hover:bg-amber-100"
          >
            Coding Programs
          </a>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {pages.map((page) => (
            <section
              key={page.path}
              id={slug(page.title)}
              className="scroll-mt-4 rounded-2xl border border-slate-200 p-5 shadow-sm"
            >
              <h2 className="flex items-baseline justify-between">
                <Link to={page.path} className="text-lg font-semibold hover:text-indigo-600">
                  {page.title}
                </Link>
                <span className="text-sm text-slate-400">{countOf(page.lists)} questions</span>
              </h2>

              {page.lists.map((list) => (
                <div key={list.prefix} className="mt-3">
                  {list.label && (
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                      {list.label}
                    </p>
                  )}
                  <ul className="mt-1 grid gap-x-4 sm:grid-cols-2">
                    {list.topics.map(({ topic, questions }) => (
                      <li key={topic}>
                        <Link
                          to={{ pathname: page.path, hash: '#' + list.prefix + slug(topic) }}
                          className="flex justify-between gap-2 rounded px-1 py-1 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                        >
                          <span>{topic}</span>
                          <span className="text-slate-400">{questions.length}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}

          <section
            id="coding-programs"
            className="scroll-mt-4 rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <h2 className="flex items-baseline justify-between">
              <span className="text-lg font-semibold">Coding Programs</span>
              <span className="text-sm text-slate-400">{programs.length} programs</span>
            </h2>
            <ul className="mt-3 space-y-1">
              {programs.map((program) => (
                <li key={program.path}>
                  <Link
                    to={program.path}
                    className="block rounded px-1 py-1 text-sm hover:bg-slate-50"
                  >
                    <span className="font-medium text-slate-700 hover:text-indigo-600">
                      {program.title}
                    </span>
                    <span className="block text-xs text-slate-400">{program.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TopicsIndex
