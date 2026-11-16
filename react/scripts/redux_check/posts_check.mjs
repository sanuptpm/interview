// Checks the jsonplaceholder demos: React page live outputs + the Zustand program.
import { spawn } from 'node:child_process'
const base = process.argv[2]
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9338', '--user-data-dir=/tmp/cdp-posts', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch('http://localhost:9338/json')).json(); break } catch { await sleep(250) } }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const pend = {}; const errors = []
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pend[m.id]) pend[m.id](m.result); if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description?.slice(0, 200)) }
const send = (m, p = {}) => new Promise((r) => { pend[++id] = r; ws.send(JSON.stringify({ id, method: m, params: p })) })
const ev = async (x) => (await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: x })).result.value
await send('Page.enable'); await send('Runtime.enable')
await send('Page.navigate', { url: base + '/react-questions' }); await sleep(6000)
console.log('sunt aut titles:', await ev(`document.body.innerText.split('sunt aut facere').length - 1`))
await ev(`[...document.querySelectorAll('button')].filter(b => b.innerText === 'Add post').forEach(b => b.click())`)
await sleep(4000)
console.log('saved ids:', await ev(`(document.body.innerText.match(/Saved post id: \\d+/g) || []).join(', ')`))
console.log('fetched at:', await ev(`(document.body.innerText.match(/List fetched at [^\\n]+/g) || []).join(' | ')`))
await send('Page.navigate', { url: base + '/zustand-tanstack-query' }); await sleep(6000)
console.log('program output:', await ev(`document.body.innerText.split('OUTPUT').pop().slice(0, 500)`))
console.log('errors:', errors)
ws.close(); chrome.kill()
