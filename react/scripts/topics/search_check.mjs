// Types into the search box on several pages and counts the visible question cards.
// Usage: node scripts/topics/search_check.mjs http://localhost:4179/interview
import { spawn } from 'node:child_process'
const base = process.argv[2]
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9339', '--user-data-dir=/tmp/cdp-search', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch('http://localhost:9339/json')).json(); break } catch { await sleep(250) } }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const pend = {}; const errors = []
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pend[m.id]) pend[m.id](m.result); if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description?.slice(0, 200)) }
const send = (m, p = {}) => new Promise((r) => { pend[++id] = r; ws.send(JSON.stringify({ id, method: m, params: p })) })
const ev = async (x) => (await send('Runtime.evaluate', { returnByValue: true, expression: x })).result.value
await send('Page.enable'); await send('Runtime.enable')
const cards = `[...document.querySelectorAll('h3, h4')].filter(h => /^Q\\d+\\./.test(h.innerText)).length`
const tests = [['react-questions', 'jwt'], ['react-questions', 'useMemo useCallback'], ['javascript', 'closure'], ['python-questions', 'pytest'], ['angular-questions', 'signal'], ['css-questions', 'flexbox'], ['aws-questions', 'zzzz']]
for (const [page, q] of tests) {
  await send('Page.navigate', { url: `${base}/${page}` }); await sleep(3500)
  const before = await ev(cards)
  await ev(`(() => { const i = document.querySelector('input[type=search]'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ${JSON.stringify(q)}); i.dispatchEvent(new Event('input', { bubbles: true })) })()`)
  await sleep(500)
  const after = await ev(cards)
  const counter = await ev(`document.querySelector('input[type=search]').parentElement.innerText.trim()`)
  const titles = await ev(`[...document.querySelectorAll('h3, h4')].filter(h => /^Q\\d+\\./.test(h.innerText)).slice(0, 3).map(h => h.innerText.slice(0, 70))`)
  console.log(page.padEnd(18), JSON.stringify(q).padEnd(22), before, '->', after, '| counter:', counter, '|', titles.join(' / '))
}
console.log('errors:', errors)
ws.close(); chrome.kill()
