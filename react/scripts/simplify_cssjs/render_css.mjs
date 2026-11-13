// node render_css.mjs from-to tag -> screenshots CSS previews (390x180 like the page) into tag.png
import { writeFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { load, cssLines, D } from './load.mjs'
const { css } = await load()
const [from, to] = process.argv[2].split('-').map(Number)
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const cells = []
for (let i = from; i <= to && i < css.length; i++) {
  const doc = `<style>body{margin:12px;font-family:system-ui,sans-serif;font-size:14px}${css[i].css}</style>${css[i].html}`
  cells.push(`<div class=c><b>${i} [${cssLines(css[i])}] ${esc(css[i].q)}</b><iframe srcdoc="${esc(doc)}"></iframe></div>`)
}
const tag = process.argv[3] || 'gallery'
writeFileSync(`${D}${tag}.html`, `<!doctype html><style>body{margin:8px;font:11px sans-serif;display:grid;grid-template-columns:repeat(4,400px);gap:6px}.c{border:1px solid #ccc;padding:3px}iframe{width:390px;height:180px;border:1px solid #ddd;display:block}</style>${cells.join('')}`)
execFileSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', `--window-size=1640,${Math.ceil(cells.length / 4) * 210 + 20}`, `--screenshot=${D}${tag}.png`, `file://${D}${tag}.html`], { stdio: 'ignore' })
rmSync(`${D}${tag}.html`)
console.log(`${D}${tag}.png`)
