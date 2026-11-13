// Usage: node scripts/simplify_py/sync.mjs <python|aiMl> [changes.json] [--write]
// Loads src/pages/<page>QuestionsData.js, optionally applies changes
// ({ "<q>": { code?: "...", a?: ["old part", "new part"] } }), runs every snippet twice
// (python3 for Python, scripts/.venv/bin/python for AI/ML) and checks: exit 0, no stderr,
// non-empty and deterministic stdout. Reports outputs that differ from the file; with
// --write it rewrites the file with the real stdout. q and level are never touched.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'
import path from 'node:path'

const [page, ...rest] = process.argv.slice(2)
const write = rest.includes('--write')
const changesFile = rest.find((x) => x !== '--write')
const here = path.dirname(new URL(import.meta.url).pathname)
const root = path.join(here, '..', '..')
const file = path.join(root, 'src/pages', page === 'aiMl' ? 'aiMlQuestionsData.js' : 'pythonQuestionsData.js')
const python = page === 'aiMl' ? path.join(root, 'scripts/.venv/bin/python') : 'python3'
const { questions } = await import(file + '?' + Date.now())
const items = questions.map((x) => ({ ...x }))

if (changesFile) {
  const changes = JSON.parse(readFileSync(changesFile, 'utf8'))
  const byQ = new Map(items.map((x) => [x.q, x]))
  for (const [q, ch] of Object.entries(changes)) {
    const it = byQ.get(q)
    if (!it) throw new Error('unknown q: ' + q)
    if (ch.code) it.code = ch.code.replace(/^\n+|\n+$/g, '')
    if (ch.a) {
      if (it.a.split(ch.a[0]).length !== 2) throw new Error('answer text not found once: ' + q)
      it.a = it.a.replace(ch.a[0], ch.a[1])
    }
  }
}

const runDir = path.join(here, '.run')
mkdirSync(runDir, { recursive: true })
const run = (code) => {
  const f = path.join(runDir, 'snippet.py')
  writeFileSync(f, code + '\n')
  const r = spawnSync(python, [f], { cwd: runDir, encoding: 'utf8', timeout: 120000,
    env: { ...process.env, PYTHONWARNINGS: 'ignore', PYTHONHASHSEED: '0' } })
  return { out: (r.stdout || '').replace(/\n+$/, ''), err: (r.stderr || '').trim(), rc: r.status }
}
let bad = 0, changed = 0
items.forEach((it, i) => {
  const a = run(it.code), b = run(it.code)
  if (a.rc !== 0 || a.err || !a.out || a.out !== b.out) {
    bad++; console.log(`PROBLEM [${i}] ${it.q}\n  rc=${a.rc} same=${a.out === b.out}\n  ${a.err}`)
  }
  if (a.out !== it.output) { changed++; if (!write) console.log(`output differs [${i}] ${it.q}`) }
  it.output = a.out
})
rmSync(runDir, { recursive: true, force: true })

const lines = items.map((x) => x.code.split('\n').length)
const avg = (lines.reduce((s, n) => s + n, 0) / lines.length).toFixed(1)
console.log(`${page}: ${items.length} items, problems=${bad}, outputs changed=${changed}, avg lines=${avg}, max=${Math.max(...lines)}, over 12=${lines.filter((n) => n > 12).length}`)

if (write && !bad) {
  const src = readFileSync(file, 'utf8')
  const header = src.slice(0, src.indexOf('export const questions'))
  const tpl = (s) => '`' + s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`'
  const str = page === 'aiMl' ? (s) => JSON.stringify(s) : tpl
  const body = items.map((x) => ['  {', `    q: ${JSON.stringify(x.q)},`, `    level: '${x.level}',`,
    `    a: ${JSON.stringify(x.a)},`, `    code: ${str(x.code)},`, `    output: ${str(x.output)},`, '  },'].join('\n'))
  writeFileSync(file, header + 'export const questions = [\n' + body.join('\n') + '\n]\n')
  const check = (await import(file + '?w' + Date.now())).questions
  const same = check.length === items.length && check.every((x, i) => ['q', 'level', 'a', 'code', 'output'].every((k) => x[k] === items[i][k]))
  console.log('written; re-import round-trip ok:', same)
} else if (write) console.log('NOT written: fix problems first')
process.exit(bad ? 1 : 0)
