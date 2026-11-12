// Syntax highlighting for the read-only example code blocks (highlight.js).
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import bash from 'highlight.js/lib/languages/bash'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import yaml from 'highlight.js/lib/languages/yaml'
import json from 'highlight.js/lib/languages/json'
import './codeTheme.css'

// Only the languages used on the site are registered, to keep the bundle small.
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('css', css)
// JSX inside JavaScript is highlighted with the 'xml' grammar, so register it under that name too.
hljs.registerLanguage('xml', xml)
hljs.registerAliases(['html'], { languageName: 'xml' })
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('dockerfile', dockerfile)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('json', json)

// Returns highlighted HTML for the code. `language` can be one language name,
// or a list of candidates (e.g. ['dockerfile', 'yaml', 'bash']) to pick the best match.
export function highlight(code, language) {
  try {
    if (Array.isArray(language)) return hljs.highlightAuto(code, language).value
    return hljs.highlight(code, { language, ignoreIllegals: true }).value
  } catch {
    return hljs.highlightAuto(code).value
  }
}

// Highlight the whole file at once (so multi-line JSX and comments are understood),
// then split into lines, closing and reopening any color spans that cross a line break.
export function highlightLines(code, language) {
  const lines = []
  let open = []
  for (const raw of highlight(code, language).split('\n')) {
    let line = open.join('') + raw
    for (const tag of raw.match(/<span[^>]*>|<\/span>/g) || []) {
      if (tag === '</span>') open.pop()
      else open.push(tag)
    }
    line += '</span>'.repeat(open.length)
    lines.push(line)
  }
  return lines
}
