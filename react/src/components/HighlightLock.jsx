import { setHighlightsLocked, useHighlightsLocked } from '../lib/highlights.js'

// Locks highlights in this browser: they stay visible, but selecting text or clicking a
// highlight no longer changes them. Unlock to add or remove highlights again.
function HighlightLock() {
  const locked = useHighlightsLocked()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={locked}
      aria-label="Lock highlights"
      onClick={() => setHighlightsLocked(!locked)}
      title={locked ? 'Unlock to add or remove highlights' : 'Lock so highlights cannot be changed by mistake'}
      className={
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm ' +
        (locked
          ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
          : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100')
      }
    >
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
        {locked ? (
          <path d="M10 2a4 4 0 0 0-4 4v2H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-1V6a4 4 0 0 0-4-4Zm-2 6V6a2 2 0 1 1 4 0v2H8Z" />
        ) : (
          <path d="M10 2a4 4 0 0 0-4 4v2H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H8V6a2 2 0 0 1 3.73-1 1 1 0 1 0 1.73-1A4 4 0 0 0 10 2Z" />
        )}
      </svg>
      {locked ? 'Highlights locked' : 'Lock highlights'}
    </button>
  )
}

export default HighlightLock
