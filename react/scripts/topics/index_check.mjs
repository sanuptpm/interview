// Screenshots the Index page, clicks a sub-topic link and checks the target page jumped to it.
// Usage: node scripts/topics/index_check.mjs http://localhost:4179/interview "React" "Hooks: effects" <outdir>
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const [base, page, topic, outdir] = process.argv.slice(2)
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9339', '--window-size=1400,950', '--user-data-dir=/tmp/cdp-index', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch('http://localhost:9339/json')).json(); break } catch { await sleep(250) } }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const pend = {}; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pend[m.id]) pend[m.id](m.result) }
const send = (m, p = {}) => new Promise((r) => { pend[++id] = r; ws.send(JSON.stringify({ id, method: m, params: p })) })
const shot = async (name) => writeFileSync(`${outdir}/${name}.png`, Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'))
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
await send('Page.enable'); await send('Page.navigate', { url: base + '/index' }); await sleep(2500)
await shot('index')
console.log('index sections:', await ev(`document.querySelectorAll('section').length`))
const clicked = await ev(`(() => { const sec = [...document.querySelectorAll('section')].find(s => s.querySelector('h2').textContent.includes(${JSON.stringify(page)})); const a = [...sec.querySelectorAll('a')].find(a => a.textContent.startsWith(${JSON.stringify(topic)})); a.click(); return a.getAttribute('href') })()`)
console.log('clicked:', clicked); await sleep(4000)
console.log('url:', await ev('location.pathname + location.hash'))
console.log('heading near top:', await ev(`[...document.querySelectorAll('h3.uppercase')].map(h => [h.textContent, Math.round(h.getBoundingClientRect().top)]).filter(([, y]) => y > -50 && y < 400).slice(0, 2)`))
await shot('jumped')
ws.close(); chrome.kill()
