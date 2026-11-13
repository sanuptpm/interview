// Every SQLite-CLI recording on the Database page must match the in-browser engine exactly,
// and must match a fresh run of the sqlite3 CLI (.mode box).
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
const root = new URL('../../', import.meta.url).pathname
const { questions } = await import(root + 'src/pages/databaseQuestionsData.js')
const { runSqlScript } = await import(root + 'src/tryit/sqlEngine.js')
const SQL = await createRequire(root + 'package.json')('sql.js')()
const isSql = (x) => !x.code.includes('import sqlite3') &&
  (x.output.includes('╭') || x.output.includes('┌') || x.output.includes('QUERY PLAN') || x.output.includes('Error near line'))
const sel = questions.filter(isSql)
let eng = 0, cli = 0
for (const x of sel) {
  if (runSqlScript(SQL, x.code) === x.output.replace(/\s+$/, '')) eng++; else console.log('ENGINE MISMATCH:', x.q)
  const script = x.code.split('\n').map((l) => (l === '' ? '.print' : l)).join('\n') + '\n'
  const out = spawnSync('sh', ['-c', 'sqlite3 -cmd ".mode box" :memory: 2>&1'], { input: script, encoding: 'utf8' }).stdout
  // A blank code line is either a plain blank or a "@@" (.print) separator, so compare
  // exactly first, then with blank lines ignored.
  const norm = (t) => t.split('\n').filter((l) => l.trim()).join('\n')
  const raw = spawnSync('sh', ['-c', 'sqlite3 -cmd ".mode box" :memory: 2>&1'], { input: x.code + '\n', encoding: 'utf8' }).stdout
  if ([out, raw].some((o) => o.replace(/^\n+|\n+$/g, '') === x.output) || norm(out) === norm(x.output)) cli++
  else console.log('CLI MISMATCH:', x.q)
}
console.log(`sql recordings: ${sel.length}, engine exact ${eng}/${sel.length}, CLI rerun exact ${cli}/${sel.length}`)
