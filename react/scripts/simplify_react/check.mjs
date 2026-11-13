// node scripts/simplify_react/check.mjs
// Bundles reactQuestionsData.jsx, prints line stats (vs orig.jsx), checks titles/levels,
// checks titles/levels against scripts/topics/titles_react.json, and runs every live-demo snippet through snippetToApp -> parse -> SSR render.
import { build } from 'rolldown'
import { transformSync } from 'rolldown/utils'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { snippetToApp } from '../../src/tryit/reactSnippet.js'

// Node has no localStorage; a tiny in-memory stand-in for SSR only.
if (typeof globalThis.localStorage === 'undefined') {
  const m = new Map()
  globalThis.localStorage = { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) }
}
const origLog = console.log
const dir = new URL('.', import.meta.url).pathname
const work = dir + 'work/'
mkdirSync(work, { recursive: true })
async function load(src, name) {
  await build({ input: src, external: [/^react/], output: { file: work + name, format: 'esm' }, transform: { jsx: { runtime: 'automatic' } }, logLevel: 'silent' })
  return (await import(work + name + '?' + Date.now())).questions
}
const hasOrig = existsSync(dir + 'orig.jsx') // optional: a copy of the file before the edit
const before = hasOrig ? await load(dir + 'orig.jsx', 'orig.mjs') : []
const after = await load(dir + '../../src/pages/reactQuestionsData.jsx', 'cur.mjs')
const lines = (q) => q.code.split('\n').length
const stat = (qs) => { const L = qs.map(lines); return `${qs.length} items, avg ${(L.reduce((a, b) => a + b, 0) / L.length).toFixed(1)}, max ${Math.max(...L)}, >12 lines: ${L.filter((x) => x > 12).length}` }
if (hasOrig) console.log('before:', stat(before))
console.log('after: ', stat(after))

// titles / levels
const titles = JSON.parse(readFileSync(dir + '../topics/titles_react.json', 'utf8'))
const byQ = new Map(after.map((q) => [q.q, q.level]))
const bad = titles.filter((t) => byQ.get(t.title) !== t.level)
console.log(`titles: ${titles.length} old titles, ${bad.length} missing/changed; new: ${after.filter((q) => !titles.some((t) => t.title === q.q)).map((q) => q.q).join(' | ')}`)
bad.forEach((t) => console.log('  CHANGED', t.title))

let shortened = 0
const old = new Map(before.map((q) => [q.q, q]))
const over = []
for (const q of after) {
  const o = old.get(q.q)
  if (o && lines(q) < lines(o)) shortened++
  if (lines(q) > 12) over.push(`${lines(q)}  ${q.q}${o ? ` (was ${lines(o)})` : ''}`)
}
console.log(`shortened: ${shortened}`)
console.log('still over 12 lines:\n  ' + over.join('\n  '))

// demos
const demos = after.filter((q) => typeof q.output !== 'string')
let ok = 0
const problems = []
for (const [i, { q, code }] of demos.entries()) {
  const app = snippetToApp(code)
  const file = work + `app${String(i + 1).padStart(2, '0')}.jsx`
  writeFileSync(file, app)
  const res = transformSync(file, app, { jsx: { runtime: 'automatic' } })
  if (res.errors?.length) { problems.push(`${q}: SYNTAX ${res.errors.map((e) => e.message).join('; ')}`); continue }
  writeFileSync(file.replace('.jsx', '.mjs'), res.code)
  try {
    console.log = () => {}
    const mod = await import(file.replace('.jsx', '.mjs') + '?' + Date.now())
    renderToString(createElement(mod.default))
    ok++
  } catch (e) {
    console.log = origLog; problems.push(`${q}: RENDER ${e.message}`) }
}
console.log = origLog
console.log(`demos: ${demos.length}, parse+render OK: ${ok}`)
problems.forEach((p) => console.log('  - ' + p))
