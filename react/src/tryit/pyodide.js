// Loads Pyodide (Python compiled to WebAssembly) once, on first use, from the jsDelivr CDN.
// Shared by the Python, AI/ML, Database (Python) and FastAPI editors.
// The first load downloads about 10 MB; later runs reuse it.

export const PYODIDE_VERSION = '0.28.3'
const BASE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

let pyodidePromise = null

export function loadPyodideOnce() {
  if (!pyodidePromise) {
    pyodidePromise = import(/* @vite-ignore */ BASE_URL + 'pyodide.mjs')
      .then(({ loadPyodide }) => loadPyodide({ indexURL: BASE_URL }))
      .catch((error) => {
        pyodidePromise = null // allow a retry after a network error
        throw error
      })
  }
  return pyodidePromise
}
