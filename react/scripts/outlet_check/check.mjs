// Turns the <Outlet> example into the editor's App.js and server-renders it at "/" and "/employees".
import { build } from 'rolldown'
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { snippetToApp } from '../../src/tryit/reactSnippet.js'
const src = readFileSync(new URL('../../src/pages/reactQuestionsData.jsx', import.meta.url), 'utf8')
const start = src.indexOf("What is <Outlet> in React Router")
const code = src.slice(src.indexOf('code: `', start) + 7, src.indexOf('`,\n    output:', start)).replace(/\\`/g, '`')
let app = snippetToApp(code)
for (const url of ['/', '/employees']) {
  const file = new URL(`./app${url.length > 1 ? '-emp' : ''}.jsx`, import.meta.url).pathname
  writeFileSync(file, app.replace('<MemoryRouter>', `<MemoryRouter initialEntries={['${url}']}>`) + "\nimport { renderToString } from 'react-dom/server'\nconsole.log(" + JSON.stringify(url.padEnd(12)) + ", renderToString(<App />))\n")
  const out = file.replace('.jsx', '.mjs')
  await build({ input: file, platform: 'node', external: [/^react/], output: { file: out, format: 'esm' }, logLevel: 'silent' })
  await import(out)
  rmSync(file); rmSync(out)
}
