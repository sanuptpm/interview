// Runs every new basic through the Try-it runner (addConsoleLogs + runCode) and shows it next to `result`.
import { basics } from '../../src/pages/jsBasicsData.js'
import { runCode, addConsoleLogs, format } from '../../src/lib/runJs.js'
import { ITEMS } from './titles.mjs'
let bad = 0
for (const b of basics.filter((x) => ITEMS.includes(x.title))) {
  const logs = await runCode(addConsoleLogs(b.code))
  const expected = (Array.isArray(b.result) && b.code.split('\n').filter((l) => !/^(const|let) |^\w+\.length = /.test(l)).length > 1 ? b.result : [b.result]).map(format)
  const ok = JSON.stringify(logs) === JSON.stringify(expected) || logs.join('|') === expected.join('|')
  if (!ok || logs.some((l) => /Error/.test(l))) { bad++; console.log('MISMATCH', b.title, '\n  run:', logs, '\n  result:', expected) }
  else console.log('ok  ', b.title.slice(0, 70), '->', logs.join(' | ').slice(0, 90))
}
console.log(bad ? bad + ' problems' : 'all match')
