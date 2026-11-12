import { useState } from 'react'
import CodeEditor from './CodeEditor.jsx'
import { OutputBox, RunBar } from './ui.jsx'
import { runPython } from './pythonRun.js'

// Edit Python and run it in the browser with Pyodide (Python compiled to WebAssembly).
// print() output and errors (tracebacks) are shown.
function PythonRunner({ code }) {
  const [source, setSource] = useState(code)
  const [output, setOutput] = useState('Click Run to see the output.')
  const [error, setError] = useState(false)
  const [running, setRunning] = useState(false)

  const run = async () => {
    setRunning(true)
    setError(false)
    try {
      const result = await runPython(source, setOutput)
      if (result.error) {
        setError(true)
        setOutput(result.output ? result.output + '\n\n' + result.error : result.error)
      } else {
        setOutput(result.output || 'No output. Use print(...) to show a value.')
      }
    } catch (err) {
      setError(true)
      setOutput('Could not load Python: ' + (err?.message || err) + '\nCheck your connection and try again.')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-3">
      <RunBar
        onRun={run}
        onReset={() => setSource(code)}
        running={running}
        hint="Runs in your browser (Python 3.13 via Pyodide)"
      />
      <div className="grid gap-3 lg:grid-cols-2">
        <CodeEditor value={source} onChange={setSource} language="python" label="Code" />
        <OutputBox error={error}>{output}</OutputBox>
      </div>
    </div>
  )
}

export default PythonRunner
