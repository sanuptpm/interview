import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { python } from '@codemirror/lang-python'
import { sql } from '@codemirror/lang-sql'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

// Same colors as the Sandpack (React) editor and the read-only examples.
const sandpackLight = HighlightStyle.define([
  { tag: t.comment, color: '#999', fontStyle: 'italic' },
  { tag: [t.keyword, t.modifier, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.moduleKeyword, t.self, t.atom, t.bool, t.null], color: '#7C5AE3' },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.definition(t.function(t.variableName)), t.className, t.typeName, t.standard(t.variableName)], color: '#85A600' },
  { tag: [t.string, t.special(t.string), t.regexp, t.url, t.attributeValue], color: '#2E6BD0' },
  { tag: [t.tagName, t.angleBracket], color: '#0971F1' },
  { tag: [t.propertyName, t.attributeName, t.number, t.punctuation, t.operator, t.bracket], color: '#3B3B3B' },
  { tag: t.variableName, color: '#151515' },
])

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
          extensions={[extension, syntaxHighlighting(sandpackLight)]}
          minHeight={minHeight}
          maxHeight="480px"
          basicSetup={{ foldGutter: false, highlightActiveLine: true }}
        />
      </div>
    </div>
  )
}

export default CodeEditor
