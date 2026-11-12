import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { python } from '@codemirror/lang-python'
import { sql } from '@codemirror/lang-sql'

const languages = {
  javascript: () => javascript(),
  jsx: () => javascript({ jsx: true }),
  css: () => css(),
  html: () => html(),
  python: () => python(),
  sql: () => sql(),
}

// A code editor with line numbers and syntax highlighting.
// language: 'javascript' | 'jsx' | 'css' | 'html' | 'python' | 'sql'
function CodeEditor({ value, onChange, language = 'javascript', label, minHeight = '160px' }) {
  const extension = (languages[language] || languages.javascript)()

  return (
    <div className="min-w-0">
      {label && <p className="mb-1 text-xs font-semibold text-slate-400 uppercase">{label}</p>}
      <div className="overflow-hidden rounded-lg border border-slate-300 text-[13px]">
        <CodeMirror
          value={value}
          onChange={onChange}
          extensions={[extension]}
          minHeight={minHeight}
          maxHeight="480px"
          basicSetup={{ foldGutter: false, highlightActiveLine: true }}
        />
      </div>
    </div>
  )
}

export default CodeEditor
