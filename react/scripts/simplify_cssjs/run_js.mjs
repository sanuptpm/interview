// node run_js.mjs [i,j,...] -> runs JS questions through runCode, prints code + output (errors flagged)
import { load, lines } from './load.mjs'
import { runCode } from '../../src/lib/runJs.js'
const { js } = await load()
const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null
for (let i = 0; i < js.length; i++) {
  if (only && !only.includes(i)) continue
  const out = await runCode(js[i].code)
  const bad = out.some((l) => /^(\w*Error|Error):/.test(l) && !/Error/.test(js[i].a + js[i].code.split('catch')[0] + '') )
  console.log(`=== ${i} [${lines(js[i].code)}]${bad ? ' !!!' : ''} ${js[i].q}\n${only ? js[i].code + '\n--- output:\n' : ''}${out.join('\n')}\n`)
}
