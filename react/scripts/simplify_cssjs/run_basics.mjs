// node run_basics.mjs [i,j] -> runs basics through addConsoleLogs + runCode; flags errors; prints result
import { load } from './load.mjs'
import { runCode, addConsoleLogs } from '../../src/lib/runJs.js'
const { basics } = await load()
const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null
let errors = 0
for (let i = 0; i < basics.length; i++) {
  const out = await runCode(addConsoleLogs(basics[i].code))
  const bad = out.some((l) => /^[A-Z]\w*Error: /.test(l))
  if (bad) errors++
  if (only?.includes(i) || bad) console.log(`=== ${i} ${basics[i].title}${bad ? ' !!!' : ''}\n${out.join('\n')}\nresult: ${JSON.stringify(basics[i].result)}\n`)
}
console.log('basics with errors:', errors)
