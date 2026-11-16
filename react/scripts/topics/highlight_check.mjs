// Highlights answer text, then checks it survives a reload and leaving/re-entering the page,
// the "Highlighted only" filter, and removing a highlight by clicking it.
// Usage: node scripts/topics/highlight_check.mjs http://localhost:4179/interview
import { spawn } from 'node:child_process'
const base = process.argv[2]
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9341', '--user-data-dir=/tmp/cdp-hl-' + Date.now(), 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch('http://localhost:9341/json')).json(); break } catch { await sleep(250) } }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const pend = {}; const errors = []
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pend[m.id]) pend[m.id](m.result); if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description?.slice(0, 200)) }
const send = (m, p = {}) => new Promise((r) => { pend[++id] = r; ws.send(JSON.stringify({ id, method: m, params: p })) })
const ev = async (x) => (await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: x })).result.value
await send('Page.enable'); await send('Runtime.enable')
const go = async (path) => { await send('Page.navigate', { url: base + path }); await sleep(3500) }
const marks = `[...document.querySelectorAll('mark[data-hl-index]')].map(m => m.className.includes('rose') ? 'IMPORTANT: ' + m.innerText : 'yellow: ' + m.innerText)`
// select `word` inside the answer of the first question card, then click a toolbar button
const highlight = (word, button) => ev(`(async () => {
  const p = [...document.querySelectorAll('[data-hl-id]')].find(p => p.textContent.includes(${JSON.stringify(word)}))
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let n
  while ((n = walker.nextNode()) && !n.data.includes(${JSON.stringify(word)})) {}
  const r = document.createRange(); const at = n.data.indexOf(${JSON.stringify(word)})
  r.setStart(n, at); r.setEnd(n, at + ${word.length})
  getSelection().removeAllRanges(); getSelection().addRange(r)
  await new Promise(res => setTimeout(res, 500))
  const b = [...document.querySelectorAll('[role=toolbar] button')].find(b => b.innerText.includes(${JSON.stringify(button)}))
  if (!b) return 'no toolbar'
  b.click(); return 'clicked ' + ${JSON.stringify(button)}
})()`)

await go('/react-questions')
console.log(await highlight('Virtual DOM is a lightweight JavaScript copy', 'Highlight'))
console.log(await highlight('updates only the parts of the real DOM', 'Important'))
console.log('after highlight:', await ev(marks))
await send('Page.reload'); await sleep(3500)
console.log('after reload:   ', await ev(marks))
await go('/'); await go('/react-questions')
console.log('after re-enter: ', await ev(marks))
await ev(`[...document.querySelectorAll('button')].find(b => b.innerText.startsWith('Highlighted only')).click()`); await sleep(300)
console.log('filter on -> cards:', await ev(`document.querySelectorAll('[data-hl-id]').length`), '|', await ev(`[...document.querySelectorAll('button')].find(b => b.innerText.startsWith('Highlighted only')).innerText`))
await ev(`document.querySelector('mark[data-hl-index]').click()`); await sleep(300)
console.log(await ev(`(() => { const b = [...document.querySelectorAll('[role=toolbar] button')].find(b => b.innerText.includes('Remove')); if (!b) return 'no remove'; b.click(); return 'removed one' })()`)); await sleep(300)
console.log('after remove:   ', await ev(marks))
await go('/python-questions')
console.log('python page marks (separate):', await ev(marks))
console.log('errors:', errors); ws.close(); chrome.kill()
