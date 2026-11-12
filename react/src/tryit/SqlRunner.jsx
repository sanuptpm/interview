import { useState } from 'react'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import CodeEditor from './CodeEditor.jsx'
import { OutputBox, RunBar } from './ui.jsx'
import { runSqlScript } from './sqlEngine.js'

// sql.js (SQLite compiled to WebAssembly) is downloaded on the first Run only.
// The .wasm file goes through Vite, so its URL includes the /interview/ base.
let sqlPromise = null
function loadSqlJs() {
  if (!sqlPromise) {
    sqlPromise = import('sql.js')
      .then(({ default: initSqlJs }) => initSqlJs({ locateFile: () => wasmUrl }))
      .catch((error) => {
        sqlPromise = null // allow a retry after a network error
        throw error
      })
  }
  return sqlPromise
}

// Edit SQL and run it in SQLite in the browser. Output looks like the sqlite3
// shell with `.mode box`. Every run starts from an empty in-memory database.
function SqlRunner({ code }) {
  const [source, setSource] = useState(code)
  const [output, setOutput] = useState('Click Run to see the output.')
  const [failed, setFailed] = useState(false)
  const [running, setRunning] = useState(false)

  const run = async () => {
    setRunning(true)
    try {
      const SQL = await loadSqlJs()
      setOutput(runSqlScript(SQL, source) || '(no output)')
      setFailed(false)
    } catch (error) {
      setOutput('Could not run SQLite: ' + (error?.message || error))
      setFailed(true)
    }
    setRunning(false)
  }

  return (
    <div className="space-y-3">
      <RunBar
        onRun={run}
        onReset={() => setSource(code)}
        running={running}
        hint="SQLite in your browser, fresh database each run"
      />
      <div className="grid gap-3 lg:grid-cols-2">
        <CodeEditor value={source} onChange={setSource} language="sql" label="SQL" />
        <OutputBox error={failed}>
          {/* No wrapping: wide tables scroll sideways instead of breaking apart */}
          <span className="whitespace-pre">{output}</span>
        </OutputBox>
      </div>
    </div>
  )
}

export default SqlRunner
