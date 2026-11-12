import { useState } from 'react'
import CodeEditor from './CodeEditor.jsx'
import { RunBar } from './ui.jsx'

// Edit HTML and CSS; the preview updates as you type.
function CssRunner({ html, css }) {
  const [markup, setMarkup] = useState(html)
  const [styles, setStyles] = useState(css)

  const doc = `<style>body{margin:12px;font-family:system-ui,sans-serif;font-size:14px}${styles}</style>${markup}`

  return (
    <div className="space-y-3">
      <RunBar
        onReset={() => {
          setMarkup(html)
          setStyles(css)
        }}
        hint="The preview updates as you type"
      />
      <div className="grid gap-3 lg:grid-cols-3">
        <CodeEditor value={markup} onChange={setMarkup} language="html" label="HTML" />
        <CodeEditor value={styles} onChange={setStyles} language="css" label="CSS" />
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold text-slate-400 uppercase">Preview</p>
          <iframe
            title="CSS preview"
            srcDoc={doc}
            className="h-[260px] w-full rounded-lg border border-slate-300 bg-white"
          />
        </div>
      </div>
    </div>
  )
}

export default CssRunner
