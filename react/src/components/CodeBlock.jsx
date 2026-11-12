import { highlightLines } from '../lib/highlight.js'

// A read-only code block styled like the "Try it" editors: line numbers in a
// gutter, white background and the same syntax colors. highlight.js escapes the
// code, so rendering its HTML is safe.
function CodeBlock({ code, language = 'javascript', className = '' }) {
  const lines = highlightLines(code.replace(/\s+$/, ''), language)

  return (
    <div
      className={`code-theme overflow-x-auto rounded-lg border border-slate-200 bg-white py-2 font-mono text-[13px] leading-6 ${className}`}
    >
      <div className="min-w-max">
        {lines.map((html, i) => (
          <div key={i} className="flex">
            <span className="w-10 shrink-0 pr-3 text-right text-xs leading-6 text-slate-400 select-none">
              {i + 1}
            </span>
            <code
              className="pr-4 whitespace-pre"
              dangerouslySetInnerHTML={{ __html: html || ' ' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CodeBlock
