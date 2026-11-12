// Turns the recorded output of a FastAPI example (written with TestClient) into a small
// Python "Requests" block for the in-browser editor, for example:
//
//   GET /items/5?q=book            r = await client.get("/items/5?q=book")
//   → 200 OK                  =>   show(r)
//   {"id": 5}
//
// It understands request headers ("Authorization: Bearer x"), JSON bodies, "(form) a=1&b=2",
// "(multipart) file=notes.txt, text/plain" and WebSocket transcripts ("WS connect /ws").
// When nothing can be derived it falls back to GET requests for the app's simple routes.

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
const REQUEST_LINE = new RegExp(`^(${METHODS.join('|')}) (/\\S*(?: \\S+)*)$`)
const STATUS_LINE = /^→ \d{3}\b/
const HEADER_LINE = /^([A-Z][A-Za-z0-9-]*): (.*)$/
const WS_CONNECT = /^WS connect (\/\S*)$/

// A Python string literal (JSON string escapes are valid Python too).
const pyStr = (text) => JSON.stringify(String(text))

// Convert a parsed JSON value into Python literal syntax.
function toPython(value) {
  if (value === null) return 'None'
  if (value === true) return 'True'
  if (value === false) return 'False'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return pyStr(value)
  if (Array.isArray(value)) return '[' + value.map(toPython).join(', ') + ']'
  const entries = Object.entries(value).map(([k, v]) => `${pyStr(k)}: ${toPython(v)}`)
  return '{' + entries.join(', ') + '}'
}

function formToPython(text) {
  const entries = [...new URLSearchParams(text)].map(([k, v]) => `${pyStr(k)}: ${pyStr(v)}`)
  return '{' + entries.join(', ') + '}'
}

// "(multipart) file=notes.txt, text/plain" -> files={"file": ("notes.txt", b"...", "text/plain")}
function multipartToPython(text) {
  const parts = text.split(/;\s*/).map((part) => {
    const match = part.match(/^(\w+)=([^,]+?)(?:,\s*(\S+))?$/)
    if (!match) return null
    const [, field, filename, type = 'application/octet-stream'] = match
    const content = type.startsWith('text/')
      ? 'b"hello world\\nsecond line"'
      : 'b"\\x89PNG\\r\\n\\x1a\\n fake image bytes"'
    return `${pyStr(field)}: (${pyStr(filename.trim())}, ${content}, ${pyStr(type)})`
  })
  if (parts.includes(null)) return null
  return '{' + parts.join(', ') + '}'
}

// Build one `r = await client.xxx(...)` line from a parsed request.
function requestToPython({ method, path, headers, body }) {
  const args = [pyStr(path)]
  if (Object.keys(headers).length) {
    const items = Object.entries(headers).map(([k, v]) => `${pyStr(k)}: ${pyStr(v)}`)
    args.push(`headers={${items.join(', ')}}`)
  }
  if (body) args.push(`${body.kind}=${body.python}`)

  const simple = ['get', 'delete', 'head', 'options'].includes(method.toLowerCase())
  if (body && simple) return `r = await client.request(${pyStr(method)}, ${args.join(', ')})`
  return `r = await client.${method.toLowerCase()}(${args.join(', ')})`
}

function parseBody(lines) {
  const text = lines.join('\n').trim()
  if (!text) return null
  if (text.startsWith('(form) ')) {
    return { kind: 'data', python: formToPython(text.slice(7).trim()) }
  }
  if (text.startsWith('(multipart) ')) {
    const python = multipartToPython(text.slice(12).trim())
    return python ? { kind: 'files', python } : undefined
  }
  try {
    return { kind: 'json', python: toPython(JSON.parse(text)) }
  } catch {
    return undefined // something we don't understand: skip this request
  }
}

// Parses the "METHOD /path ... → status" blocks. Returns Python lines.
function parseHttp(lines) {
  const out = []
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(REQUEST_LINE)
    if (!match || lines[i].includes('→')) continue

    // Everything between the request line and the "→ 200 OK" line describes the request.
    let end = i + 1
    while (end < lines.length && lines[end].trim() && !STATUS_LINE.test(lines[end])) end++
    if (end >= lines.length || !STATUS_LINE.test(lines[end])) continue

    const headers = {}
    const bodyLines = []
    for (const line of lines.slice(i + 1, end)) {
      const header = bodyLines.length === 0 && line.match(HEADER_LINE)
      if (header) headers[header[1]] = header[2]
      else bodyLines.push(line)
    }
    const body = parseBody(bodyLines)
    if (body === undefined) continue

    out.push(requestToPython({ method: match[1], path: match[2], headers, body }), 'show(r)')
    i = end
  }
  return out
}

// Parses a WebSocket transcript: "WS connect /ws", "← from server", "→ to server".
function parseWebSocket(lines) {
  const out = []
  let open = false
  for (const line of lines) {
    const connect = line.match(WS_CONNECT)
    if (connect) {
      if (open) out.push('await ws.close()')
      out.push(`ws = await websocket_connect(${pyStr(connect[1])})`)
      open = true
    } else if (open && line.startsWith('← ')) {
      out.push('await ws.receive()')
    } else if (open && line.startsWith('→ ')) {
      out.push(`await ws.send(${pyStr(line.slice(2))})`)
    } else if (open && !line.trim()) {
      out.push('await ws.close()')
      open = false
    }
  }
  if (open) out.push('await ws.close()')
  return out
}

// Simple GET routes found in the code, used when the output gives us nothing.
function routesFromCode(code) {
  const paths = []
  const pattern = /@\w+\.get\(\s*["']([^"']*)["']/g
  for (const match of code.matchAll(pattern)) {
    const path = match[1] || '/'
    if (!path.includes('{') && !paths.includes(path)) paths.push(path)
  }
  return paths.slice(0, 3)
}

// "# Shell: export APP_NAME="Shop API" DEBUG=true" in the code -> os.environ lines,
// so settings examples see the same environment as the recorded output.
function envFromCode(code) {
  const lines = []
  for (const match of code.matchAll(/^\s*#.*\bexport\s+(.+)$/gm)) {
    for (const pair of match[1].matchAll(/(\w+)=("([^"]*)"|'([^']*)'|\S+)/g)) {
      const value = pair[3] ?? pair[4] ?? pair[2]
      lines.push(`os.environ[${pyStr(pair[1])}] = ${pyStr(value)}`)
    }
  }
  if (!lines.length) return []
  return ['import os', '# Environment variables from the example (read when settings load)', ...lines]
}

const HELP = `# Requests sent to the app: r = await client.get/post/put/delete(...)
# then show(r) prints the response like the recorded output.`

export function isTestFile(code) {
  return /\bTestClient\b|^\s*from main import|^\s*import pytest/m.test(code)
}

export function looksLikeApp(code) {
  return /\b(FastAPI|Starlette|APIRouter)\s*\(/.test(code)
}

export function buildRequests(code = '', output = '') {
  const lines = output.split('\n').map((line) => line.replace(/\s+$/, ''))
  const http = parseHttp(lines)
  const ws = parseWebSocket(lines)
  const env = envFromCode(code)
  if (http.length || ws.length) return [HELP, ...env, ...ws, ...http].join('\n') + '\n'

  if (isTestFile(code)) {
    return `# This example is a pytest file for an app in main.py, which isn't shown here.
# TestClient needs threads, which the browser can't run. To experiment, replace
# the App code with a FastAPI app and send requests to it like this:
# r = await client.get("/items/1")
# show(r)
`
  }
  if (!looksLikeApp(code)) {
    return `# This example isn't a FastAPI app, so there is nothing to call.
# Paste a FastAPI app into App code, then send requests like this:
# r = await client.get("/")
# show(r)
`
  }

  const routes = routesFromCode(code)
  const calls = (routes.length ? routes : ['/']).flatMap((path) => [
    `r = await client.get(${pyStr(path)})`,
    'show(r)',
  ])
  return [HELP, ...env, ...calls].join('\n') + '\n'
}
