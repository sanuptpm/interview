// node stats.mjs [now|before] [list N]
import { load, lines, cssLines } from './load.mjs'
const { js, css, basics } = await load(process.argv[2])
const st = (arr, f, name) => {
  const n = arr.map(f)
  const avg = (n.reduce((a, b) => a + b, 0) / n.length).toFixed(1)
  console.log(`${name}: count=${n.length} avg=${avg} max=${Math.max(...n)} >12=${n.filter((x) => x > 12).length} >10=${n.filter((x) => x > 10).length}`)
  if (process.argv[3] === 'list') arr.forEach((q, i) => f(q) > +process.argv[4] && console.log(`  ${i} [${f(q)}] ${q.q || q.title}`))
}
st(js, (q) => lines(q.code), 'JS questions')
st(css, cssLines, 'CSS')
st(basics, (b) => lines(b.code), 'Basics')
