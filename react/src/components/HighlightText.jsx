import { highlightId, useHighlights } from '../lib/highlights.js'

const markClass = {
  yellow: 'rounded-sm bg-yellow-200 px-0.5 text-slate-900',
  important: 'rounded-sm bg-rose-200 px-0.5 font-semibold text-rose-900',
}

// Answer text the reader can highlight. Select text to get the highlight toolbar
// (see HighlightToolbar); click a highlight to remove it.
function HighlightText({ title, text, className }) {
  const id = highlightId(title)
  const ranges = useHighlights(id)

  if (typeof text !== 'string') return <p className={className}>{text}</p>

  const parts = []
  let at = 0
  ranges.forEach((range, index) => {
    if (range.start > at) parts.push(text.slice(at, range.start))
    parts.push(
      <mark
        key={index}
        data-hl-index={index}
        title="Click to remove highlight"
        className={'cursor-pointer ' + (markClass[range.color] || markClass.yellow)}
      >
        {text.slice(range.start, range.end)}
      </mark>
    )
    at = range.end
  })
  if (at < text.length) parts.push(text.slice(at))

  return (
    <p className={className} data-hl-id={id}>
      {parts}
    </p>
  )
}

export default HighlightText
