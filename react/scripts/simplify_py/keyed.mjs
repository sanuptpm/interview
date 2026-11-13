// usage: node keyed.mjs <python|aiMl> by_index.json changes.json  -> keys changes by question title
import { readFileSync, writeFileSync } from 'node:fs'
const [page, inp, out] = process.argv.slice(2)
const f = new URL(`../../src/pages/${page === 'aiMl' ? 'aiMlQuestionsData.js' : 'pythonQuestionsData.js'}`, import.meta.url)
const { questions } = await import(f)
const byIdx = JSON.parse(readFileSync(inp, 'utf8'))
writeFileSync(out, JSON.stringify(Object.fromEntries(Object.entries(byIdx).map(([i, ch]) => [questions[+i].q, ch])), null, 1))
