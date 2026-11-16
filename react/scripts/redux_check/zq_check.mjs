// Drives the Zustand + TanStack Query program: load, switch department, add, screenshot.
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const [url, out] = process.argv.slice(2)
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9341', '--window-size=1400,900', '--user-data-dir=/tmp/cdp-zq', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch('http://localhost:9341/json')).json(); break } catch { await sleep(250) } }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const pend = {}; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pend[m.id]) pend[m.id](m.result) }
const send = (m, p = {}) => new Promise((r) => { pend[++id] = r; ws.send(JSON.stringify({ id, method: m, params: p })) })
const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true })).result.value
const read = () => ev(`[...document.querySelectorAll('li')].map(l => l.textContent).join(', ') + '  |  ' + document.querySelector('pre.bg-slate-900').textContent.replace(/\\s+/g, ' ')`)
await send('Page.enable'); await send('Page.navigate', { url }); await sleep(3000)
console.log('start (IT):       ', await read())
await ev(`(() => { const s = document.querySelector('select'); const set = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set; set.call(s, 'HR'); s.dispatchEvent(new Event('change', { bubbles: true })) })()`)
await sleep(1000); console.log('switched to HR:   ', await read())
await ev(`[...document.querySelectorAll('button')].find(b => b.textContent.includes('Add employee')).click()`)
await sleep(1500); console.log('after Add (HR):   ', await read())
writeFileSync(out, Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'))
ws.close(); chrome.kill()
