// Loads each page in headless Chrome (real time) and counts questions, Try-it buttons and sub-topic headings.
// Usage: node scripts/topics/pagecheck.mjs http://localhost:4179/interview
import { spawn } from 'node:child_process'
const base = process.argv[2]
const pages = ['css-questions', 'javascript', 'react-questions', 'python-questions', 'ai-ml-questions', 'fastapi-questions', 'database-questions', 'git-questions', 'docker-questions', 'aws-questions', 'bubble-sort']
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9337', '--user-data-dir=/tmp/cdp-pagecheck', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch('http://localhost:9337/json')).json(); break } catch { await sleep(250) } }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const pend = {}; const errors = []
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pend[m.id]) pend[m.id](m.result); if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description?.slice(0, 200)) }
const send = (m, p = {}) => new Promise((r) => { pend[++id] = r; ws.send(JSON.stringify({ id, method: m, params: p })) })
await send('Page.enable'); await send('Runtime.enable')
for (const p of pages) {
  errors.length = 0
  await send('Page.navigate', { url: `${base}/${p}` }); await sleep(5000)
  const r = await send('Runtime.evaluate', { returnByValue: true, expression: `({ q: (document.body.innerText.match(/Q\\d+\\. /g) || []).length, tryit: document.body.innerText.split('Try it').length - 1, topics: document.querySelectorAll('h3.uppercase').length, running: document.body.innerText.split('Running...').length - 1 })` })
  console.log(p.padEnd(20), JSON.stringify(r.result.value), errors.length ? 'ERRORS: ' + errors.join(' | ') : '')
}
ws.close(); chrome.kill()
