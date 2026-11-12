import { useState } from 'react'
import CodeEditor from './CodeEditor.jsx'
import { OutputBox, RunBar } from './ui.jsx'
import { loadPyodideOnce } from './pyodide.js'
import { buildRequests, isTestFile, looksLikeApp } from './fastapiRequests.js'
import DRIVER from './fastapiDriver.py?raw'
import { questions } from '../pages/fastapiQuestionsData.js'

// TryIt only passes { code }, so find the recorded output of the same example.
const recordedOutput = (code) => questions.find((item) => item.code === code)?.output || ''

// Installed from PyPI with micropip on first use (pure-Python wheels).
// pydantic / pydantic-core come prebuilt with Pyodide.
const BASE_PACKAGES = ['fastapi==0.162.5', 'starlette==1.10.0', 'httpx==0.28.1', 'python-multipart==0.0.33', 'typing-inspection==0.4.2']

// Extra packages, installed only when the code needs them.
const EXTRAS = [
  { test: /^\s*(import|from) jwt\b/m, pkg: 'PyJWT==2.10.1' },
  { test: /^\s*(import|from) pydantic_settings\b/m, pkg: 'pydantic-settings==2.16.2' },
  { test: /^\s*(import|from) sqlmodel\b/m, pkg: 'sqlmodel==0.0.33' },
  { test: /\bEmailStr\b|^\s*(import|from) email_validator\b/m, pkg: 'email-validator==2.3.0' },
]

let setupPromise = null

// Loads Pyodide + FastAPI once and returns run_fastapi() from fastapiDriver.py.
function setupFastApi() {
  if (!setupPromise) {
    setupPromise = (async () => {
      const pyodide = await loadPyodideOnce()
      await pyodide.loadPackage(['micropip', 'pydantic', 'typing-extensions'])
      const micropip = pyodide.pyimport('micropip')
      await micropip.install(BASE_PACKAGES)
      micropip.destroy()
      const globals = pyodide.globals.get('dict')()
      pyodide.runPython(DRIVER, { globals })
      return { pyodide, runFastapi: globals.get('run_fastapi') }
    })().catch((error) => {
      setupPromise = null // allow a retry after a network error
      throw error
    })
  }
  return setupPromise
}

const installed = new Set()

// Packages that only some examples need (sqlmodel, PyJWT, ...).
async function installExtras(pyodide, code) {
  await pyodide.loadPackagesFromImports(code)
  if (/^\s*(import|from) (sqlmodel|sqlalchemy|sqlite3)\b/m.test(code)) {
    await pyodide.loadPackage('sqlite3')
  }
  if (/\b(hashlib|hmac)\b/.test(code) && !installed.has('hashlib')) {
    // OpenSSL-backed hashes (pbkdf2_hmac, ...). hashlib was already imported without
    // them, so reload it once the package is there.
    await pyodide.loadPackage('hashlib')
    pyodide.runPython('import importlib, hashlib, hmac; importlib.reload(hashlib); importlib.reload(hmac)')
    installed.add('hashlib')
  }
  const needed = EXTRAS.filter((e) => e.test.test(code) && !installed.has(e.pkg)).map((e) => e.pkg)
  if (!needed.length) return
  const micropip = pyodide.pyimport('micropip')
  await micropip.install(needed)
  micropip.destroy()
  needed.forEach((pkg) => installed.add(pkg))
}

async function runApp(appCode, requestsCode, onStatus) {
  if (!setupPromise) onStatus('Loading Python and FastAPI (first time only)...')
  const { pyodide, runFastapi } = await setupFastApi()
  await installExtras(pyodide, appCode + '\n' + requestsCode)
  onStatus('Running...')
  return JSON.parse(await runFastapi(appCode, requestsCode))
}

function formatResult({ output, console: printed, error }) {
  let text = output || ''
  if (printed) text += (text ? '\n\n' : '') + 'Server console:\n' + printed
  if (error) text += (text ? '\n\n' : '') + error
  if (!text) text = 'No output. Call show(r) in Requests to print a response.'
  return text
}

// Edit a FastAPI app and the requests sent to it. Runs entirely in the browser
// (Pyodide + FastAPI from PyPI), calling the app in-process through httpx.
function FastApiRunner({ code, output }) {
  const [initialRequests] = useState(() => buildRequests(code, output ?? recordedOutput(code)))
  const [appCode, setAppCode] = useState(code)
  const [requests, setRequests] = useState(initialRequests)
  const [result, setResult] = useState({ text: 'Click Run to send the requests to the app.' })
  const [running, setRunning] = useState(false)

  const note = isTestFile(code)
    ? 'This example is a pytest file; its app (main.py) is not shown, and TestClient needs threads the browser does not have. Paste an app to experiment.'
    : !looksLikeApp(code)
      ? "This example isn't Python app code, so it can't run here. Paste a FastAPI app to experiment."
      : null

  const run = async () => {
    const problem = isTestFile(appCode)
      ? 'This is a pytest file: TestClient needs threads, which the browser does not have,\nand main.py is not part of the example. Replace it with a FastAPI app to run it.'
      : !looksLikeApp(appCode)
        ? 'No FastAPI app found. App code needs something like: app = FastAPI()'
        : null
    if (problem) {
      setResult({ text: problem, error: true })
      return
    }
    setRunning(true)
    try {
      const data = await runApp(appCode, requests, (status) => setResult({ text: status }))
      setResult({ text: formatResult(data), error: Boolean(data.error) })
    } catch (error) {
      // Keep the last line of a long Python traceback (e.g. a failed package download).
      const message = (error?.message || String(error)).trim().split('\n').pop()
      setResult({ text: 'Could not load Python or a package:\n' + message, error: true })
    }
    setRunning(false)
  }

  const reset = () => {
    setAppCode(code)
    setRequests(initialRequests)
  }

  return (
    <div className="space-y-3">
      <RunBar
        onRun={run}
        onReset={reset}
        running={running}
        hint="Runs in your browser with Pyodide (first run downloads about 15 MB)"
      />
      {note && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {note}
        </p>
      )}
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="min-w-0 space-y-3">
          <CodeEditor value={appCode} onChange={setAppCode} language="python" label="App code" />
          <CodeEditor
            value={requests}
            onChange={setRequests}
            language="python"
            label="Requests"
            minHeight="100px"
          />
        </div>
        <OutputBox error={result.error}>{result.text}</OutputBox>
      </div>
    </div>
  )
}

export default FastApiRunner
