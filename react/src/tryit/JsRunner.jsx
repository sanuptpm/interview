import { useState } from 'react'
import CodeEditor from './CodeEditor.jsx'
import { OutputBox, RunBar } from './ui.jsx'
import { runCode } from '../lib/runJs.js'

// Edit JavaScript and run it in the browser. console.log output is shown.
function JsRunner({ code }) {
  const [source, setSource] = useState(code)
  const [output, setOutput] = useState('Click Run to see the output.')
  const [running, setRunning] = useState(false)

  const run = async () => {
    setRunning(true)
    const logs = await runCode(source)
    setOutput(
      logs.length ? logs.join('\n') : 'No output. Use console.log(...) to print a value.'
    )
    setRunning(false)
  }

  return (
    <div className="space-y-3">
      <RunBar
        onRun={run}
        onReset={() => setSource(code)}
        running={running}
        hint="Runs in your browser"
      />
      <div className="grid gap-3 lg:grid-cols-2">
        <CodeEditor value={source} onChange={setSource} language="javascript" label="Code" />
        <OutputBox>{output}</OutputBox>
      </div>
    </div>
  )
}

export default JsRunner
