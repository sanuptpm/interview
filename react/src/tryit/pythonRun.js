import { loadPyodideOnce } from './pyodide.js'

// Runs Python code with Pyodide and collects what it prints.
// Used by the Python editor (Python, AI/ML and Database questions).

let pythonReady = false
let queue = Promise.resolve() // one run at a time: stdout/stderr handlers are global

// Pyodide adds its own frames (from /lib/python3.x/_pyodide/...) to every traceback.
// Drop those so the traceback only shows the user's code (and stdlib frames it called).
export function cleanTraceback(text) {
  const lines = text.replace(/\s+$/, '').split('\n')
  const kept = []
  let skipping = false
  for (const line of lines) {
    const frame = line.match(/^ {2}File "([^"]*)"/)
    if (frame) skipping = frame[1].includes('/_pyodide/')
    else if (!line.startsWith('    ')) skipping = false
    if (!skipping) kept.push(line)
  }
  return kept.join('\n')
}

// onStatus(text) is called while Python or packages are loading.
// Resolves to { output, error } where error is a traceback string or null.
export function runPython(code, onStatus) {
  const result = queue.then(() => runNow(code, onStatus))
  queue = result.catch(() => {})
  return result
}

async function runNow(code, onStatus) {
  if (!pythonReady) onStatus('Loading Python (about 10 MB, first time only)...')
  const pyodide = await loadPyodideOnce()
  pythonReady = true

  await pyodide.loadPackagesFromImports(code, {
    messageCallback: (msg) => {
      const loading = msg.match(/^Loading (.+)/)
      if (loading) onStatus('Loading packages: ' + loading[1] + '...')
    },
    errorCallback: () => {},
  })
  onStatus('Running...')

  // Collect stdout and stderr together, in the order they were written.
  // A raw `write` handler (rather than `batched`) keeps text printed with end="" too.
  let output = ''
  const decoder = new TextDecoder()
  const write = (bytes) => {
    output += decoder.decode(bytes, { stream: true })
    return bytes.length
  }
  pyodide.setStdout({ write })
  pyodide.setStderr({ write })
  // input(): ask with the browser's prompt box. Cancel ends input (EOFError).
  pyodide.setStdin({
    stdin: () => {
      const answer = window.prompt(output.split('\n').pop() || 'Python input()')
      if (answer === null) return null
      output += answer + '\n' // echo it, like a terminal
      return answer + '\n'
    },
  })

  // A fresh namespace for every run, so variables don't leak between runs.
  const namespace = pyodide.globals.get('dict')()
  namespace.set('__name__', '__main__')

  let error = null
  try {
    const value = await pyodide.runPythonAsync(code, { globals: namespace, filename: 'main.py' })
    if (value && typeof value.destroy === 'function') value.destroy()
  } catch (err) {
    error = err && err.type ? cleanTraceback(err.message) : String(err)
    if (/can't start new thread|multiprocessing|_multiprocessing/.test(error)) {
      error += '\n\nNote: threads and processes are not available when Python runs in the browser.'
    }
  } finally {
    try {
      pyodide.runPython('import sys\nsys.stdout.flush()\nsys.stderr.flush()')
    } catch {
      // ignore: flushing is best effort
    }
    pyodide.setStdout()
    pyodide.setStderr()
    pyodide.setStdin()
    namespace.destroy()
  }

  return { output: (output + decoder.decode()).replace(/\n$/, ''), error }
}
