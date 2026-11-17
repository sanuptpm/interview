import { useEffect, useRef } from 'react'

// Search input for question pages. Press "/" anywhere to jump to it, Esc to clear.
function SearchBox({ value, onChange, matches, total, placeholder = 'Search questions, answers or code…' }) {
  const input = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable
      if (e.key === '/' && !typing) {
        e.preventDefault()
        input.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div data-print-hide className="sticky top-0 z-10 -mx-1 bg-white/90 px-1 py-2 backdrop-blur">
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          ref={input}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && onChange('')}
          placeholder={placeholder}
          aria-label="Search questions"
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-24 pl-9 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400">
          {value ? `${matches} of ${total}` : <kbd className="rounded border border-slate-300 px-1.5">/</kbd>}
        </span>
      </div>
    </div>
  )
}

export default SearchBox
