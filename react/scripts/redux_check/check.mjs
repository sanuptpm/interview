// node scripts/redux_check/check.mjs
// 1. Bundles reactQuestionsData.jsx and finds the Redux / data-fetching questions.
// 2. Runs each new snippet through snippetToApp -> parse -> SSR render (async demos
//    render their loading state), and SSR-renders each live demo component.
// 3. Regression: snippetToApp output for every OTHER question must equal the
//    output of the committed (HEAD) reactSnippet.js.
import { build } from 'rolldown'
import { transformSync } from 'rolldown/utils'
import { writeFileSync, mkdirSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { snippetToApp } from '../../src/tryit/reactSnippet.js'

const dir = new URL('.', import.meta.url).pathname
const root = dir + '../../'
const work = dir + 'work/'
mkdirSync(work, { recursive: true })
const external = [/^react/, /^@reduxjs\//, /^@tanstack\//]

await build({ input: root + 'src/pages/reactQuestionsData.jsx', external, output: { file: work + 'data.mjs', format: 'esm' }, transform: { jsx: { runtime: 'automatic' } }, logLevel: 'silent' })
const { questions } = await import(work + 'data.mjs?' + Date.now())
const topics = (await import(root + 'src/pages/topics/reactTopics.js?' + Date.now())).default
const topic = topics.find((t) => /redux/i.test(t.topic))
const titles = new Set(topic.questions)
const added = questions.filter((q) => titles.has(q.q))
console.log(`topic "${topic.topic}": ${topic.questions.length} titles, ${added.length} found in data`)

const origLog = console.log
const problems = []
for (const [i, { q, level, code, output }] of added.entries()) {
  const lines = code.split('\n').length
  const app = snippetToApp(code)
  const file = work + `app${String(i + 1).padStart(2, '0')}.jsx`
  writeFileSync(file, app)
  const res = transformSync(file, app, { jsx: { runtime: 'automatic' } })
  let status = 'string'
  if (res.errors?.length) { problems.push(`${q}: SYNTAX ${res.errors.map((e) => e.message).join('; ')}`); continue }
  writeFileSync(file.replace('.jsx', '.mjs'), res.code)
  try {
    console.log = () => {}
    const mod = await import(file.replace('.jsx', '.mjs') + '?' + Date.now())
    const html = renderToString(createElement(mod.default))
    if (typeof output !== 'string') {
      const demo = renderToString(output)
      status = `snippet: ${html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 50)} | demo: ${demo.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 50)}`
    } else status = 'string output; snippet renders'
  } catch (e) {
    // String-output snippets are illustrations (e.g. useQuery with no provider); only demos must run.
    status = `${typeof output === 'string' ? 'illustration only' : 'FAIL'}: ${e.message}`
    if (typeof output !== 'string') problems.push(`${q}: RENDER ${e.message}`)
  } finally { console.log = origLog }
  console.log(`[${level}] ${lines} lines  ${q}\n    ${status}`)
}

// Regression vs HEAD reactSnippet.js
writeFileSync(work + 'headSnippet.mjs', execSync('git show HEAD:./src/tryit/reactSnippet.js', { cwd: root }))
const head = (await import(work + 'headSnippet.mjs?' + Date.now())).snippetToApp
const changed = questions.filter((q) => !titles.has(q.q) && head(q.code) !== snippetToApp(q.code))
console.log(`regression: ${questions.length - added.length} other snippets, ${changed.length} changed output`)
changed.forEach((q) => console.log('  CHANGED ' + q.q))
const uniq = new Set(questions.map((q) => q.q))
if (uniq.size !== questions.length) problems.push('duplicate q titles')
console.log(`problems: ${problems.length}`)
problems.forEach((p) => console.log('  - ' + p))
process.exit(problems.length || changed.length ? 1 : 0)
