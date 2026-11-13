// Compares the new Git questions on the page with git_out.json (rerun git_run.py first).
import { readFileSync } from 'node:fs'
const { questions } = await import(new URL('../../src/pages/gitQuestionsData.js', import.meta.url))
const runs = JSON.parse(readFileSync(new URL('git_out.json', import.meta.url)))
let ok = 0, n = 0
for (const [q, r] of Object.entries(runs)) {
  if (q.startsWith('SANITY')) continue
  n++
  const x = questions.find((y) => y.q === q)
  if (x && x.code === r.code && x.output === r.output) ok++; else console.log('MISMATCH:', q)
}
console.log(`git recordings: ${ok}/${n} match a fresh run`)
