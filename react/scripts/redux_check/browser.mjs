// Clicks the Redux / React Query demos in headless Chrome and prints their text.
// Usage: node scripts/redux_check/browser.mjs http://localhost:4191/interview/react-questions
import { spawn } from 'node:child_process'
const url = process.argv[2]
const dir = new URL('.', import.meta.url).pathname
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9338', `--user-data-dir=${dir}chrome-profile`, '--window-size=1280,2400', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch('http://localhost:9338/json')).json(); break } catch { await sleep(250) } }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r))
let id = 0; const pend = {}; const errors = []
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pend[m.id]) pend[m.id](m.result); if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description?.slice(0, 200)) }
const send = (m, p = {}) => new Promise((r) => { pend[++id] = r; ws.send(JSON.stringify({ id, method: m, params: p })) })
const ev = async (expression) => (await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression })).result.value
await send('Page.enable'); await send('Runtime.enable')
await send('Page.navigate', { url }); await sleep(4000)
// Find the card for a question title and return its text (expanding it if needed).
const card = (title) => `(() => {
  const el = [...document.querySelectorAll('*')].find((n) => n.children.length === 0 && n.textContent.includes(${JSON.stringify(title)}))
  let c = el; while (c && !(c.textContent || '').includes('Output')) c = c.parentElement
  return c
})()`
const titles = [
  'How do you use createSlice, configureStore, useSelector and useDispatch?',
  'What is RTK Query and how do you define an API with createApi?',
  'How does RTK Query caching and invalidation work',
  'What is React Query (TanStack Query) and how does useQuery work?',
  'How do you update data with useMutation and invalidateQueries in React Query?',
]
for (const title of titles) {
  const text = async () => ev(`(() => { const c = ${card(title)}; return c ? c.textContent.split('Output').pop().slice(0, 160).replace(/\\s+/g, ' ') : 'NOT FOUND' })()`)
  await ev(`(() => { const c = ${card(title)}; c.scrollIntoView(); const t = [...c.querySelectorAll('*')].find((n) => n.children.length === 0 && n.textContent.includes(${JSON.stringify(title)})); (t.closest('button,summary,[role=button]') || t).click(); return 1 })()`)
  await sleep(1200)
  const before = await text()
  const clicked = await ev(`(() => { const c = ${card(title)}; const b = c && [...c.querySelectorAll('button')].find((b) => /Count|Add/.test(b.innerText)); if (b) { b.click(); b.click() } return !!b })()`)
  await sleep(1500)
  console.log(title.slice(0, 60), '\n   before:', before, '\n   after 2 clicks:', clicked ? await text() : '(no button)')
}
const shot = await send('Page.captureScreenshot', { format: 'png' })
const { writeFileSync } = await import('node:fs')
writeFileSync(dir + 'shot.png', Buffer.from(shot.data, 'base64'))
console.log('errors:', errors.length ? errors : 'none')
ws.close(); chrome.kill()
