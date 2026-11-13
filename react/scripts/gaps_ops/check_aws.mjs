// Local checks for aws_gaps.mjs: every '{...}' / '[...]' CLI argument and every JSON block in the
// outputs must parse; the buildspec must be valid YAML (checked with the venv's PyYAML).
import { execFileSync } from 'node:child_process'
import { ITEMS } from './aws_gaps.mjs'
let n = 0
for (const it of ITEMS) {
  for (const m of it.code.matchAll(/'([{[][^']*[}\]])'/g)) {
    const s = m[1].replace(/\\\n/g, '')
    if (!/^\[\[|^\[\]/.test(s) && !/^\{[A-Z][a-z]+:/.test(s)) { JSON.parse(s); n++ }   // skip JMESPath queries
    if (s.includes('RedrivePolicy')) { JSON.parse(JSON.parse(s).RedrivePolicy); n++ }
  }
  for (const chunk of it.output.split('\n\n')) {
    const body = chunk.split('\n').filter((l) => !l.startsWith('# ')).join('\n')
    if (!/^([{[]\n|")/.test(body)) continue   // tables / text output
    for (const doc of body.split(/\n(?=[{["])/)) { JSON.parse(doc); n++ }
  }
  if (it.code.startsWith('# buildspec.yml')) {
    execFileSync(new URL('../.venv/bin/python', import.meta.url).pathname, ['-c', 'import sys,yaml; d=yaml.safe_load(sys.stdin); assert d["version"]==0.2 and "build" in d["phases"]'], { input: it.code })
    n++
  }
}
console.log('aws checks ok:', n, 'JSON/YAML pieces parsed')
