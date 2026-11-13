// node scripts/simplify_ops/stats.mjs [-v] [snap-suffix]
import { readFileSync, writeFileSync } from 'node:fs'
const dir = new URL('.', import.meta.url).pathname
const pages = { fastapi: 'fastapiQuestionsData.js', database: 'databaseQuestionsData.js', docker: 'dockerQuestionsData.js', aws: 'awsQuestionsData.js' }
const args = process.argv.slice(2)
const suffix = args.find((a) => a !== '-v')
for (const [p, f] of Object.entries(pages)) {
  const { questions } = await import(dir + `../../src/pages/${f}?${Date.now()}`)
  const lens = questions.map((x) => x.code.split('\n').length)
  const over = questions.filter((x, i) => lens[i] > 12)
  const titles = JSON.parse(readFileSync(dir + `../topics/titles_${p}.json`, 'utf8'))
  const m = new Map(titles.map((t) => [t.title, t.level]))
  let probs = 0
  for (const x of questions) if (m.get(x.q) !== x.level) { probs++; console.log('  LEVEL/TITLE problem:', x.q, x.level) }
  if (questions.length !== titles.length) { probs++; console.log('  count mismatch', questions.length, titles.length) }
  console.log(`${p}: n=${questions.length} avg=${(lens.reduce((a, b) => a + b, 0) / lens.length).toFixed(1)} max=${Math.max(...lens)} over12=${over.length} >10=${lens.filter((l) => l > 10).length} titleProblems=${probs}`)
  if (args.includes('-v')) over.forEach((x) => console.log(`   ${x.code.split('\n').length}  ${x.q}`))
  if (suffix) writeFileSync(dir + `snap_${p}_${suffix}.json`, JSON.stringify(questions.map((x) => ({ q: x.q, level: x.level, lines: x.code.split('\n').length })), null, 1))
}
