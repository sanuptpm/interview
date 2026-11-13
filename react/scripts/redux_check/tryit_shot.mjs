// Opens a React question's "Try it" editor (Sandpack, needs internet) and screenshots it.
// Usage: node scripts/redux_check/tryit_shot.mjs <url> "<title text>" <out.png>
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const [url, title, out] = process.argv.slice(2)
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9338', '--window-size=1400,1000', '--user-data-dir=/tmp/cdp-tryit', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch('http://localhost:9338/json')).json(); break } catch { await sleep(250) } }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const pend = {}; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pend[m.id]) pend[m.id](m.result) }
const send = (m, p = {}) => new Promise((r) => { pend[++id] = r; ws.send(JSON.stringify({ id, method: m, params: p })) })
await send('Page.enable'); await send('Page.navigate', { url }); await sleep(3000)
await send('Runtime.evaluate', { expression: `(() => { const h = [...document.querySelectorAll('h3')].find(x => x.textContent.includes(${JSON.stringify(title)})); const card = h.closest('.grid'); card.querySelector('button').click(); setTimeout(() => card.lastElementChild.scrollIntoView({ block: 'start' }), 500) })()` })
await sleep(25000)
writeFileSync(out, Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64')); ws.close(); chrome.kill()
