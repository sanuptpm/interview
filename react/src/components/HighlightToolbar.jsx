import { useEffect, useState } from 'react'
import { addHighlight, removeHighlight } from '../lib/highlights.js'

// Character offset of (node, offset) inside root's text
function offsetIn(root, node, offset) {
  const range = document.createRange()
  range.selectNodeContents(root)
  range.setEnd(node, offset)
  return range.toString().length
}

const rootOf = (node) => (node?.nodeType === 1 ? node : node?.parentElement)?.closest('[data-hl-id]')

// Floating toolbar, mounted once: select answer text to highlight it, click a highlight to remove it.
function HighlightToolbar() {
  const [tool, setTool] = useState(null) // { x, y, id, start, end } or { x, y, id, index }

  useEffect(() => {
    let timer
    const fromSelection = () => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || !selection.rangeCount) return setTool(null)
      const range = selection.getRangeAt(0)
      const root = rootOf(range.startContainer)
      if (!root || root !== rootOf(range.endContainer)) return setTool(null)
      const start = offsetIn(root, range.startContainer, range.startOffset)
      const end = offsetIn(root, range.endContainer, range.endOffset)
      if (end <= start) return setTool(null)
      const rect = range.getBoundingClientRect()
      setTool({ x: rect.left + rect.width / 2, y: rect.top, id: root.dataset.hlId, start, end })
    }
    const onSelectionChange = () => {
      clearTimeout(timer)
      timer = setTimeout(fromSelection, 250)
    }
    const onClick = (e) => {
      const mark = e.target.closest?.('mark[data-hl-index]')
      if (!mark || !window.getSelection()?.isCollapsed) return
      const rect = mark.getBoundingClientRect()
      setTool({ x: rect.left + rect.width / 2, y: rect.top, id: rootOf(mark).dataset.hlId, index: Number(mark.dataset.hlIndex) })
    }
    const hide = () => setTool(null)

    document.addEventListener('selectionchange', onSelectionChange)
    document.addEventListener('click', onClick)
    window.addEventListener('scroll', hide, true)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('selectionchange', onSelectionChange)
      document.removeEventListener('click', onClick)
      window.removeEventListener('scroll', hide, true)
    }
  }, [])

  if (!tool) return null

  const add = (color) => {
    addHighlight(tool.id, tool.start, tool.end, color)
    window.getSelection()?.removeAllRanges()
    setTool(null)
  }
  const remove = () => {
    removeHighlight(tool.id, tool.index)
    setTool(null)
  }
  const button = 'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium hover:bg-slate-700'

  return (
    <div
      role="toolbar"
      aria-label="Highlight"
      // Keep the text selection when a button is pressed
      onMouseDown={(e) => e.preventDefault()}
      className="fixed z-50 flex -translate-x-1/2 -translate-y-full gap-1 rounded-lg bg-slate-900 p-1 text-white shadow-lg"
      style={{ left: tool.x, top: Math.max(tool.y - 8, 44) }}
    >
      {tool.index === undefined ? (
        <>
          <button type="button" className={button} onClick={() => add('yellow')}>
            <span className="h-3 w-3 rounded-sm bg-yellow-300" /> Highlight
          </button>
          <button type="button" className={button} onClick={() => add('important')}>
            <span className="h-3 w-3 rounded-sm bg-rose-400" /> Important
          </button>
        </>
      ) : (
        <button type="button" className={button} onClick={remove}>
          ✕ Remove highlight
        </button>
      )}
    </div>
  )
}

export default HighlightToolbar
