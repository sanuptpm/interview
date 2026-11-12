import { useMemo } from 'react'
import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { snippetToApp } from './reactSnippet.js'
import { reactPreviewCss, reactPreviewIndex } from './reactPreviewFiles.js'

const HEIGHT = 380

// Reset puts App.js back to the transformed snippet; Run reloads the preview.
// (The preview also updates by itself a moment after each edit.)
function Toolbar() {
  const { sandpack } = useSandpack()
  const button =
    'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50'
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => sandpack.runSandpack()}
        className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
      >
        ▶ Run
      </button>
      <button type="button" onClick={() => sandpack.resetAllFiles()} className={button}>
        Reset
      </button>
      <span className="text-xs text-slate-500">
        Live preview updates as you type · runs in a CodeSandbox iframe (needs internet)
      </span>
    </div>
  )
}

// Edit a React snippet and see it render live (Sandpack, React 19).
// The snippet is turned into a runnable /App.js by snippetToApp.
function ReactRunner({ code }) {
  const files = useMemo(
    () => ({
      '/App.js': snippetToApp(code),
      '/index.js': { code: reactPreviewIndex, hidden: true },
      '/styles.css': { code: reactPreviewCss, hidden: true },
    }),
    [code]
  )

  // contain: inline-size keeps long editor lines from widening the page on
  // phones (the card's grid would otherwise grow to fit them).
  return (
    <div style={{ contain: 'inline-size' }}>
      <SandpackProvider
        template="react"
        theme="light"
        files={files}
        customSetup={{ dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0' } }}
        options={{
          activeFile: '/App.js',
          visibleFiles: ['/App.js'],
          recompileMode: 'delayed',
          recompileDelay: 500,
        }}
      >
        <Toolbar />
        <SandpackLayout>
          <SandpackCodeEditor
            showLineNumbers
            showTabs={false}
            style={{ height: HEIGHT }}
          />
          {/* Preview on top, console.log output underneath. */}
          <SandpackStack style={{ height: HEIGHT }}>
            <SandpackPreview showOpenInCodeSandbox={false} showRefreshButton style={{ flex: 1 }} />
            <SandpackConsole
              showHeader={false}
              style={{ height: 110, flex: 'none', borderTop: '1px solid #e2e8f0' }}
            />
          </SandpackStack>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}

export default ReactRunner
