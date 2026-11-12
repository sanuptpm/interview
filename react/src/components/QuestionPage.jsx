import { useState } from 'react'
import LevelSections from './LevelSections.jsx'
import TryIt from '../tryit/TryIt.jsx'
import TryItButton from '../tryit/TryItButton.jsx'

// Shared layout for interview question pages.
// Each question: { q, a, code, output } where output is either
// a string (shown as text) or a React element (a live demo).

// tryKind: which "Try it" editor to offer for this question (or nothing).
export function QuestionCard({ number, q, a, code, output, tryKind }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-indigo-600">
            Q{number}. {q}
          </h3>
          {tryKind && <TryItButton open={open} onClick={() => setOpen(!open)} />}
        </div>

        <p className="mt-3 text-xs font-semibold text-slate-400 uppercase">Answer</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">{a}</p>

        <p className="mt-3 text-xs font-semibold text-slate-400 uppercase">Example</p>
        <pre className="mt-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-800">
          {code}
        </pre>
      </div>

      <div className="flex min-w-0 flex-col">
        <p className="text-xs font-semibold text-slate-400 uppercase">Output</p>
        {typeof output === 'string' ? (
          <pre className="mt-1 flex-1 overflow-x-auto rounded-lg bg-emerald-50 p-3 font-mono text-sm text-emerald-800">
            {output}
          </pre>
        ) : (
          <div className="mt-1 flex-1 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-800">
            {output}
          </div>
        )}
      </div>

      {open && (
        <div className="min-w-0 md:col-span-2">
          <TryIt kind={tryKind} code={code} output={typeof output === 'string' ? output : undefined} />
        </div>
      )}
    </div>
  )
}

// tryKind(item) returns the editor kind for a question ('js', 'python', ...) or null.
function QuestionPage({ title, intro, questions, tryKind }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {questions.length} questions{intro ? ' · ' + intro : ''}
      </p>

      <LevelSections
        questions={questions}
        renderItem={(item, number) => (
          <QuestionCard
            key={item.q}
            number={number}
            {...item}
            tryKind={tryKind ? tryKind(item) : null}
          />
        )}
      />
    </div>
  )
}

export default QuestionPage
