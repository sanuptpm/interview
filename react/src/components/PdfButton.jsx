import { useEffect, useRef, useState } from 'react'
import { useAllHighlights } from '../lib/highlights.js'
import { downloadPdf } from '../lib/printPdf.js'

// "Download PDF" menu: the whole page, or only the questions I highlighted.
// The highlights (yellow and "important") are kept in the PDF.
function PdfButton() {
  const [open, setOpen] = useState(false)
  const menu = useRef(null)
  const all = useAllHighlights()
  const prefix = window.location.pathname + '|'
  const marked = Object.keys(all).filter((id) => id.startsWith(prefix)).length

  // Close when clicking anywhere else
  useEffect(() => {
    if (!open) return
    const close = (e) => menu.current?.contains(e.target) || setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const pick = (mode) => {
    setOpen(false)
    downloadPdf(mode)
  }
  const item = 'block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-white'

  return (
    <div ref={menu} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
          <path d="M10 2a1 1 0 0 1 1 1v8.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L9 11.6V3a1 1 0 0 1 1-1ZM4 15a1 1 0 0 1 1 1v1h10v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
        </svg>
        Download PDF
      </button>
      {open && (
        <div role="menu" className="absolute left-0 z-20 mt-1 w-60 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <button type="button" role="menuitem" className={item} onClick={() => pick('all')}>
            All questions on this page
          </button>
          <button type="button" role="menuitem" className={item} disabled={!marked} onClick={() => pick('marked')}>
            Only highlighted questions ({marked})
          </button>
          <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-400">
            In the print window choose “Save as PDF”. Highlights are included.
          </p>
        </div>
      )}
    </div>
  )
}

export default PdfButton
