import { useSyncExternalStore } from 'react'

// "Download PDF": the page is laid out for paper (see @media print in index.css) and the
// browser's print dialog saves it as a PDF, with real text and the reader's highlights.
// mode: 'all' = every question, 'marked' = only questions with highlights.
let mode = null
const listeners = new Set()
const setMode = (next) => {
  mode = next
  listeners.forEach((listener) => listener())
}
const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export const usePrintMode = () => useSyncExternalStore(subscribe, () => mode)

export function downloadPdf(next) {
  const oldTitle = document.title
  const heading = document.querySelector('h1')?.textContent?.trim() || oldTitle
  // The PDF file name comes from the page title
  document.title = heading + (next === 'marked' ? ' - my highlights' : '')
  setMode(next)

  let done = false
  const reset = () => {
    if (done) return
    done = true
    document.title = oldTitle
    setMode(null)
  }
  window.addEventListener('afterprint', reset, { once: true })
  // Wait for React to render the print layout (all questions, or only highlighted ones)
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      window.print()
      // Some browsers don't fire afterprint; print() returns when the dialog closes
      setTimeout(reset, 500)
    })
  )
}
