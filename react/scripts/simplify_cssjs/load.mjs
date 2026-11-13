// Loads the questions arrays from the pages (or from ./before) for checks.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
export const D = new URL('.', import.meta.url).pathname
const PAGES = D + '../../src/pages'
async function slice(file, endMarker) {
  const src = readFileSync(file, 'utf8').split('\n')
  const start = src.findIndex((l) => l.startsWith('const questions = ['))
  const end = src.findIndex((l) => l.startsWith(endMarker))
  const out = `${D}tmp_${Math.random().toString(36).slice(2)}.mjs`
  writeFileSync(out, src.slice(start, end).join('\n') + '\nexport default questions\n')
  try { return (await import(out)).default } finally { rmSync(out) }
}
export async function load(which = 'now') {
  const d = which === 'before' ? D + 'before' : PAGES
  return {
    js: await slice(d + '/JavaScript.jsx', 'function Card('),
    css: await slice(d + '/CssQuestions.jsx', 'function Preview('),
    basics: (await import(d + '/jsBasicsData.js?' + Date.now())).basics,
  }
}
export const lines = (s) => (s ? s.split('\n').length : 0)
export const cssLines = (q) => lines(q.html) + lines(q.css)
