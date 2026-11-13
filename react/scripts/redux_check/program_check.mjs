// Clicks the Redux counter buttons, reads the count + store JSON, screenshots, then opens Try it.
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const [url, outdir] = process.argv.slice(2)
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9340', '--window-size=1400,950', '--user-data-dir=/tmp/cdp-prog', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch('http://localhost:9340/json')).json(); break } catch { await sleep(250) } }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const pend = {}; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pend[m.id]) pend[m.id](m.result) }
const send = (m, p = {}) => new Promise((r) => { pend[++id] = r; ws.send(JSON.stringify({ id, method: m, params: p })) })
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
const click = (text) => ev(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(text)}).click()`)
const read = () => ev(`document.querySelector('h2').textContent + ' | store: ' + document.querySelector('pre.bg-slate-900').textContent.replace(/\\s+/g, ' ')`)
await send('Page.enable'); await send('Page.navigate', { url }); await sleep(2500)
console.log('start   ', await read())
for (const b of ['Increment', 'Increment', 'Increment By 5', 'Decrement']) { await click(b); await sleep(200); console.log(b.padEnd(15), await read()) }
writeFileSync(outdir + '/program.png', Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'))
await click('Reset'); await sleep(200); console.log('Reset          ', await read())
await ev(`[...document.querySelectorAll('button')].find(b => b.textContent.includes('Try it')).click()`); await sleep(25000)
writeFileSync(outdir + '/program-tryit.png', Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'))
ws.close(); chrome.kill()
