// node dom_check.mjs 67,68 -> runs those JS questions in headless Chrome (they need document)
import { writeFileSync, readFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { load, D } from './load.mjs'
const { js } = await load()
const idx = process.argv[2].split(',').map(Number)
const lib = readFileSync(D + '../../src/lib/runJs.js', 'utf8').replace(/export /g, '')
const codes = JSON.stringify(idx.map((i) => js[i].code)).replace(/</g, '\\u003c')
writeFileSync(D + 'dom.html', `<pre id=o></pre><script>${lib}
(async () => { for (const c of ${codes}) document.getElementById('o').textContent += (await runCode(c)).join('\\n') + '\\n---\\n' })()</script>`)
const out = execFileSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--virtual-time-budget=3000', '--dump-dom', 'file://' + D + 'dom.html'], { encoding: 'utf8' })
console.log(out.match(/<pre id="o">([\s\S]*?)<\/pre>/)[1])
rmSync(D + 'dom.html')
