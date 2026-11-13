// Turns a React interview snippet into a runnable /App.js for Sandpack.
//
// Snippets are written for reading, not running. They come in three shapes:
//   1. A complete component:      function Counter() { ... }
//   2. Components + loose JSX:    function Card() {...}   <Card title="x" />
//   3. Hook lines + loose JSX:    const [n, setN] = useState(0)   <p>{n}</p>
//
// The idea: split the snippet into top-level "chunks" (one statement or one
// JSX block each), sort every chunk into a bucket, then rebuild a file:
//
//   import { ...React APIs used... } from 'react'
//   ...stand-in helpers the snippet assumes exist (wait, fruits, ...)
//   ...declarations (functions, classes, Capitalized consts)   <- "module"
//   export default function App() {
//     ...hook lines and lowercase consts                      <- "body"
//     return <>...loose JSX...</>                               <- "jsx"
//   }
//
// When there is no loose code at all (shape 1) we just add
// `export default <RootComponent>` instead of generating an App.
// It is a heuristic (no real parser), tuned to the snippets on this site.

// React exports we auto-import when the snippet uses them.
const REACT_APIS = [
  'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useContext',
  'createContext', 'useReducer', 'memo', 'useId', 'useTransition',
  'useDeferredValue', 'useLayoutEffect', 'useImperativeHandle', 'forwardRef',
  'lazy', 'Suspense', 'Fragment', 'useActionState', 'useOptimistic',
  'Component', 'use', 'startTransition', 'StrictMode',
]

// Small stand-ins for helpers that snippets call but never define.
// Each one is added only if the snippet uses the name and does not define it.
const HELPERS = {
  wait: 'const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))',
  countPrimes: `function countPrimes(limit) {
  let count = 0
  for (let n = 2; n <= limit; n++) {
    let prime = true
    for (let d = 2; d * d <= n; d++) if (n % d === 0) { prime = false; break }
    if (prime) count++
  }
  return count
}`,
  bigList: "const bigList = Array.from({ length: 5000 }, (_, i) => 'Item ' + (i + 1))",
  fruits: "const fruits = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Papaya']",
  fakeFetchUser: `function fakeFetchUser(id) {
  return new Promise((resolve, reject) => setTimeout(() => {
    if (id === 4) reject(new Error('User not found'))
    else resolve({ id, name: 'User ' + id })
  }, 800))
}`,
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Remove // and /* */ comments (roughly) so words in comments are ignored.
const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"])\/\/.*$/gm, '$1')

// Is `name` declared anywhere in the code (function/class/const, incl. destructuring)?
function isDeclared(name, code) {
  const n = escapeRe(name)
  return new RegExp(
    `\\b(?:function|class)\\s+${n}\\b|\\b(?:const|let|var)\\s+(?:[[{][^\\]}=]*\\b)?${n}\\b`
  ).test(code)
}

// Names declared by one chunk: `function X`, `class X`, `const X`, `const [a, b]`, `const { a }`.
function declaredNames(text) {
  const first = text.trim()
  let m = first.match(/^(?:export\s+(?:default\s+)?)?(?:async\s+)?(?:function\*?|class)\s+(\w+)/)
  if (m) return [m[1]]
  m = first.match(/^(?:const|let|var)\s+(\w+)/)
  if (m) return [m[1]]
  m = first.match(/^(?:const|let|var)\s+[[{]([^\]}]*)[\]}]/)
  if (m) return m[1].split(',').map((s) => s.split(':').pop().split('=')[0].trim()).filter(Boolean)
  return []
}

// Track (), {}, [] depth line by line so multi-line statements stay together.
// Strings and comments are skipped; quotes are reset at each line end
// (a stray apostrophe in JSX text then can't break the rest of the file).
function depthChange(line, state) {
  let depth = 0
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (state.block) {
      if (c === '*' && line[i + 1] === '/') { state.block = false; i++ }
      continue
    }
    if (state.quote) {
      if (c === '\\') i++
      else if (c === state.quote) state.quote = null
      continue
    }
    if (c === '/' && line[i + 1] === '/') break
    if (c === '/' && line[i + 1] === '*') { state.block = true; i++; continue }
    if (c === '"' || c === "'" || c === '`') state.quote = c
    else if ('({['.includes(c)) depth++
    else if (')}]'.includes(c)) depth--
  }
  if (state.quote !== '`') state.quote = null
  return depth
}

// Split into top-level chunks. A new chunk starts on an unindented line at
// depth 0, unless that line obviously continues the previous one
// (closing bracket, closing tag, .method chain, operator).
function splitChunks(code) {
  const chunks = []
  const state = { quote: null, block: false }
  let depth = 0
  let current = null
  let gap = false // was there a blank line before this chunk?
  for (const line of code.split('\n')) {
    const startsNew =
      depth <= 0 && !state.block && state.quote !== '`' &&
      /^\S/.test(line) && !/^(?:[)}\]]|<\/|\.|\?|:|&&|\|\|)/.test(line)
    if (!line.trim() && depth <= 0) {
      current = null // blank line ends a chunk
      gap = chunks.length > 0
    } else if (startsNew || !current) {
      current = { lines: [line], gap }
      chunks.push(current)
      gap = false
    } else {
      current.lines.push(line)
    }
    depth += depthChange(line, state)
  }
  return chunks.map((c) => ({ text: c.lines.join('\n'), gap: c.gap }))
}

// Decide which bucket a chunk belongs to.
function classify(text) {
  const t = text.trim()
  if (/^\/\//.test(t) && t.split('\n').every((l) => /^\s*\/\//.test(l))) return 'comment'
  if (/^import\s/.test(t)) return 'import'
  if (/\bcreateRoot\s*\(|ReactDOM\.render\s*\(|\broot\.render\s*\(/.test(t)) return 'drop'
  if (/^export\s+default\b/.test(t)) return 'default'
  if (/^[<{]/.test(t)) return 'jsx'
  if (/^(?:export\s+)?(?:async\s+)?(?:function|class)\s/.test(t)) return 'module'
  if (/^(?:export\s+)?(?:const|let|var)\s+[A-Z]/.test(t)) return 'module'
  if (/^[A-Z]\w*\.\w+\s*=/.test(t)) return 'module' // e.g. Tabs.Tab = Tab
  if (/^set[A-Z]\w*\s*\(/.test(t)) return 'setterCall' // would loop if run during render
  return 'body'
}

const commentOut = (text, why) =>
  `// (${why})\n` + text.split('\n').map((l) => '// ' + l).join('\n')

// Is a body declaration a function (handler) rather than a value?
const isFunctionDecl = (text) =>
  /^(?:const|let|var)\s+\w+\s*=\s*(?:async\s*)?(?:\([^)]*\)|\w+)\s*=>|=\s*(?:async\s+)?function\b|=\s*useCallback\(/.test(
    text.trim()
  )

export function snippetToApp(code) {
  // 1. Split and classify. Comment-only chunks travel with the next chunk.
  const items = []
  let pendingComments = []
  for (const { text, gap } of splitChunks(code.replace(/\r\n/g, '\n'))) {
    const kind = classify(text)
    if (kind === 'comment') { pendingComments.push({ text, gap }); continue }
    items.push({
      kind, text, comments: pendingComments, names: declaredNames(text),
      gap: pendingComments.length ? pendingComments[0].gap : gap,
    })
    pendingComments = []
  }

  // 2. Snippets often show a "wrong" and a "right" version that declare the
  //    same name. Keep the last one and comment out the earlier ones.
  items.forEach((item, i) => {
    const later = items.slice(i + 1)
    if (item.names.some((n) => later.some((o) => o.names.includes(n)))) {
      item.text = commentOut(item.text, 'earlier version, redeclared below')
      item.kind = item.kind === 'module' ? 'module' : 'body'
      item.names = []
    }
  })

  // 2b. A loose const that a component or function uses (a Redux slice, fake
  //     data, a fetcher) must live at module level, not inside the generated
  //     App. Only plain values move: no hook calls, nothing that reads App state.
  const hookCall = /(^|[^.\w])use(?:[A-Z]\w*)?\s*\(/
  const refersTo = (names, text) =>
    names.some((n) => new RegExp(`(^|[^.\\w])${escapeRe(n)}\\b`).test(text))
  const plain = items.filter(
    (i) => i.kind === 'body' && i.names.length && !hookCall.test(stripComments(i.text))
  )
  const appNames = items.filter((i) => i.kind === 'body' && !plain.includes(i)).flatMap((i) => i.names)
  for (let moved = true; moved; ) {
    moved = false
    const moduleCode = stripComments(
      items.filter((i) => ['module', 'default'].includes(i.kind)).map((i) => i.text).join('\n')
    )
    for (const item of plain) {
      if (item.kind !== 'body' || refersTo(appNames, stripComments(item.text))) continue
      if (!refersTo(item.names, moduleCode)) continue
      item.kind = 'module'
      moved = true
    }
  }

  const live = items.map((i) => i.text).join('\n')
  const liveCode = stripComments(live)
  const hasDefault = items.some((i) => i.kind === 'default' || /\bexport\s+default\b/.test(i.text))
  const imports = items.filter((i) => i.kind === 'import').map((i) => i.text)
    .filter((t) => !/react-dom\/client/.test(t)) // createRoot is handled by the template

  // 3. Wrapper needed? (any loose hook lines or JSX). If so, find state the
  //    snippet uses but never declares, so the generated App can provide it.
  const needsApp = items.some((i) => ['body', 'setterCall', 'jsx'].includes(i.kind))
  const extraState = [] // extra lines at the top of App
  const extraJsx = [] // extra elements at the top of App's JSX
  if (needsApp) {
    // A setter used but never declared (setCount without useState) gets state.
    for (const [, , rest] of liveCode.matchAll(/(^|[^.\w])set([A-Z]\w*)\b/g)) {
      const setter = 'set' + rest
      const value = rest[0].toLowerCase() + rest.slice(1)
      if (['setTimeout', 'setInterval'].includes(setter)) continue
      if (isDeclared(setter, liveCode) || isDeclared(value, liveCode)) continue
      if (extraState.some((s) => s.includes(setter))) continue
      extraState.push(`const [${value}, ${setter}] = useState(0)`)
    }
    // `{show && <Timer />}` with an undeclared `show` gets a toggle button.
    for (const item of items.filter((i) => i.kind === 'jsx')) {
      const m = item.text.trim().match(/^\{\s*([a-z]\w*)\s*&&/)
      if (m && !isDeclared(m[1], liveCode)) {
        const setter = 'set' + m[1][0].toUpperCase() + m[1].slice(1)
        extraState.push(`const [${m[1]}, ${setter}] = useState(true)`)
        extraJsx.push(`<button onClick={() => ${setter}((v) => !v)}>Toggle ${m[1]}</button>`)
      }
    }
  }

  // 4. Imports for React APIs that are used but not imported or defined.
  const usedCode = liveCode + '\n' + extraState.join('\n')
  const alreadyImported = imports.join('\n')
  const missing = REACT_APIS.filter((name) => {
    const used = name === 'use'
      ? /(^|[^.\w])use\(/.test(usedCode)
      : new RegExp(`(^|[^.\\w])${name}\\b`).test(usedCode)
    return used && !new RegExp(`\\b${name}\\b`).test(alreadyImported) && !isDeclared(name, liveCode)
  })
  const header = []
  if (missing.length) header.push(`import { ${missing.join(', ')} } from 'react'`)
  if (/\bcreatePortal\b/.test(liveCode) && !/\bcreatePortal\b/.test(alreadyImported)) {
    header.push("import { createPortal } from 'react-dom'")
  }
  header.push(...imports)

  // 5. Stand-in helpers for names used but never defined.
  const helpers = Object.keys(HELPERS)
    .filter((name) => new RegExp(`\\b${name}\\b`).test(liveCode) && !isDeclared(name, liveCode))
    .map((name) => HELPERS[name])

  // A chunk with its leading comments (as {/* */} inside JSX), keeping the
  // snippet's blank lines. Returns { str, gap } for joinParts below.
  const withComments = (item, jsx) => ({
    gap: item.gap,
    str: [
      ...item.comments.map((c, i) =>
        (i && c.gap ? '\n' : '') +
        (jsx ? c.text.split('\n').map((l) => l.replace(/^(\s*)\/\/\s?(.*)$/, '$1{/* $2 */}')).join('\n') : c.text)
      ),
      item.text,
    ].join('\n'),
  })
  const joinParts = (parts) => parts.map((p, i) => (i && p.gap ? '\n' : '') + p.str).join('\n')

  const moduleParts = items
    .filter((i) => ['module', 'default'].includes(i.kind))
    .map((i) => withComments(i))
  const bodyParts = items
    .filter((i) => i.kind === 'body' || i.kind === 'setterCall')
    .map((i) =>
      i.kind === 'setterCall'
        ? withComments({ ...i, text: commentOut(i.text, 'example call; run it from an event handler') })
        : withComments(i)
    )
  const jsxParts = items.filter((i) => i.kind === 'jsx').map((i) => withComments(i, true))
  const trailing = pendingComments.map((c) => c.text).join('\n')

  const out = [header.join('\n'), helpers.join('\n\n'), joinParts(moduleParts)]

  // 6a. Only declarations: export the root component.
  if (!needsApp) {
    if (!hasDefault) {
      const components = items
        .filter((i) => i.kind === 'module')
        .flatMap((i) => i.names)
        .filter((n) => /^[A-Z]/.test(n) && !/Context$/.test(n))
      const root = components.includes('App') ? 'App' : components[components.length - 1]
      if (root) out.push(`export default ${root}`)
    }
    if (trailing) out.push(trailing)
    return tidy(out)
  }

  // 6b. Loose code: wrap it in a generated App component.
  // No JSX to show? Build a tiny UI: current values + a button per no-arg handler.
  if (!jsxParts.length) {
    const values = []
    const handlers = []
    for (const item of items.filter((i) => i.kind === 'body')) {
      const t = item.text.trim()
      if (isFunctionDecl(t)) {
        if (/=\s*(?:async\s*)?\(\s*\)\s*=>/.test(t)) handlers.push(item.names[0])
      } else if (!/useRef\(/.test(t)) {
        // From `const [value, setValue]` keep only the value.
        values.push(...(/^(?:const|let|var)\s+\[/.test(t) ? item.names.slice(0, 1) : item.names))
      }
    }
    for (const s of extraState) values.push(s.match(/\[(\w+)/)[1])
    if (values.length) extraJsx.push(`<pre>{JSON.stringify({ ${values.join(', ')} }, null, 2)}</pre>`)
    for (const h of handlers) extraJsx.push(`<button onClick={${h}}>${h}</button>`)
    if (!extraJsx.length) extraJsx.push('<p>Return some JSX to see it here.</p>')
  }

  const name = isDeclared('App', liveCode) ? 'SnippetApp' : 'App'
  const indent = (s, n) => s.split('\n').map((l) => (l ? ' '.repeat(n) + l : l)).join('\n')
  const body = [extraState.join('\n'), joinParts(bodyParts)].filter(Boolean).join('\n\n')
  out.push(
    [
      '// Generated wrapper: runs the loose lines above as one component.',
      `export default function ${name}() {`,
      ...(body ? [indent(body, 2), ''] : []),
      '  return (',
      '    <>',
      indent([...extraJsx, joinParts(jsxParts)].filter(Boolean).join('\n'), 6),
      '    </>',
      '  )',
      '}',
    ].join('\n')
  )
  if (trailing) out.push(trailing)
  return tidy(out)
}

const tidy = (parts) => parts.filter((p) => p && p.trim()).join('\n\n') + '\n'
