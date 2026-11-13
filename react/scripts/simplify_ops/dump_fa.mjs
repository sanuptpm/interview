// Dump fastapiQuestionsData.js to fa.json, and check that re-emitting it reproduces the file.
import { readFileSync, writeFileSync } from 'node:fs'
import { emit } from './emit_fa.mjs'
const file = new URL('../../src/pages/fastapiQuestionsData.js', import.meta.url).pathname
const { questions } = await import(file + '?' + Date.now())
writeFileSync(new URL('fa.json', import.meta.url), JSON.stringify(questions, null, 1))
console.log('dumped', questions.length, 'round-trip identical:', emit(questions) === readFileSync(file, 'utf8'))
