// Apply fa_new.json ({q: {code, output, a}}) to fastapiQuestionsData.js (q and level untouched).
import { readFileSync, writeFileSync } from 'node:fs'
import { emit } from './emit_fa.mjs'
const file = new URL('../../src/pages/fastapiQuestionsData.js', import.meta.url).pathname
const { questions } = await import(file + '?' + Date.now())
const changes = JSON.parse(readFileSync(new URL('fa_new.json', import.meta.url), 'utf8'))
let n = 0, aChanged = 0
for (const x of questions) {
  const c = changes[x.q]; if (!c) continue
  if (c.a !== x.a) aChanged++
  Object.assign(x, { code: c.code, output: c.output, a: c.a }); n++
}
if (n !== Object.keys(changes).length) throw new Error('unknown q in changes')
writeFileSync(file, emit(questions))
console.log('patched', n, 'items,', aChanged, 'answers changed')
