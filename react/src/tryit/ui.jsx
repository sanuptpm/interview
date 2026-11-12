// Small shared pieces used by every runner, so they all look the same.
// RunBar: leave out onRun to hide the Run button (e.g. for live previews).

export function RunBar({ onRun, onReset, running, runLabel = 'Run', hint }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onRun && (
        <button
          type="button"
          onClick={onRun}
          disabled={running}
          className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {running ? 'Running...' : '▶ ' + runLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onReset}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        Reset
      </button>
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </div>
  )
}

export function OutputBox({ children, error }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold text-slate-400 uppercase">Output</p>
      <pre
        className={`max-h-[480px] min-h-[160px] overflow-auto rounded-lg p-3 font-mono text-sm whitespace-pre-wrap ${
          error ? 'bg-rose-50 text-rose-800' : 'bg-slate-900 text-slate-100'
        }`}
      >
        {children}
      </pre>
    </div>
  )
}
