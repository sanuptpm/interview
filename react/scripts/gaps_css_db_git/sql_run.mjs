// Runs each new SQL example in the in-browser engine (sql.js) AND the sqlite3 CLI (.mode box),
// prints both, and writes sql_out.json only with outputs where the two agree.
// Usage: node scripts/gaps_css_db_git/sql_run.mjs
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { CASES } from './sql_cases.mjs'
const root = new URL('../../', import.meta.url).pathname
const { runSqlScript } = await import(root + 'src/tryit/sqlEngine.js')
const SQL = await createRequire(root + 'package.json')('sql.js')()
const res = {}
let bad = 0
for (const c of CASES) {
  const eng = runSqlScript(SQL, c.code)
  const script = c.code.split('\n').map((l) => (l === '' ? '.print' : l)).join('\n') + '\n'
  const cli = spawnSync('sh', ['-c', 'sqlite3 -cmd ".mode box" :memory: 2>&1'], { input: script, encoding: 'utf8' })
    .stdout.replace(/^\n+|\n+$/g, '')
  const ok = eng === cli
  if (!ok) bad++
  console.log('='.repeat(60) + '\n' + c.q + (ok ? '  [engine == CLI]' : '  [MISMATCH]') + '\n' + eng)
  if (!ok) console.log('--- CLI:\n' + cli)
  res[c.q] = { code: c.code, output: eng }
}
writeFileSync(new URL('sql_out.json', import.meta.url), JSON.stringify(res, null, 1))
console.log(`\n${CASES.length} cases, ${bad} mismatches`)
