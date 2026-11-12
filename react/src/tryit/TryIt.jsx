import { lazy, Suspense } from 'react'

// Each runner is loaded only when someone opens "Try it" for that kind of code.
const runners = {
  js: lazy(() => import('./JsRunner.jsx')),
  css: lazy(() => import('./CssRunner.jsx')),
  react: lazy(() => import('./ReactRunner.jsx')),
  python: lazy(() => import('./PythonRunner.jsx')),
  sql: lazy(() => import('./SqlRunner.jsx')),
  fastapi: lazy(() => import('./FastApiRunner.jsx')),
}

// kind: 'js' | 'css' | 'react' | 'python' | 'sql' | 'fastapi'
// The runner gets the example: { code } or { html, css } for CSS.
function TryIt({ kind, ...example }) {
  const Runner = runners[kind]
  if (!Runner) return null

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4">
      <Suspense fallback={<p className="text-sm text-slate-500">Loading editor...</p>}>
        <Runner {...example} />
      </Suspense>
    </div>
  )
}

export default TryIt
