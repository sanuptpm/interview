// Inserts the gap questions into the data files (right after their `after` question) and their titles
// into the matching sub-topic of src/pages/topics/<page>Topics.js (right after the `after` title).
// Usage: node scripts/gaps_ops/apply.mjs   (run fa_gaps.py + fa_workers.py first)
import { readFileSync, writeFileSync } from 'node:fs'
import { emit } from '../simplify_ops/emit_fa.mjs'
import { ITEMS as DOCKER } from './docker_gaps.mjs'
import { ITEMS as AWS } from './aws_gaps.mjs'
const src = (p) => new URL('../../src/pages/' + p, import.meta.url).pathname
const tpl = (s) => '`' + s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`'
const J = JSON.stringify

function addTopics(page, items) {
  const f = src(`topics/${page}Topics.js`); let t = readFileSync(f, 'utf8')
  const lit = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  for (const it of items) {
    if (t.includes(lit(it.q))) throw new Error('already in topics: ' + it.q)
    const key = '      ' + lit(it.after) + ',\n'
    const i = t.indexOf(key); if (i < 0) throw new Error('topic anchor not found: ' + it.after)
    t = t.slice(0, i + key.length) + '      ' + lit(it.q) + ',\n' + t.slice(i + key.length)
  }
  writeFileSync(f, t)
}

// FastAPI: splice into the array and re-emit with the original generator format.
{
  const f = src('fastapiQuestionsData.js')
  const { questions } = await import(f)
  const items = JSON.parse(readFileSync(new URL('fa_gaps.json', import.meta.url), 'utf8'))
  for (const it of items) {
    if (questions.some((x) => x.q === it.q)) throw new Error('exists: ' + it.q)
    const i = questions.findIndex((x) => x.q === it.after); if (i < 0) throw new Error('anchor: ' + it.after)
    questions.splice(i + 1, 0, { q: it.q, level: it.level, a: it.a, code: it.code, output: it.output })
  }
  writeFileSync(f, emit(questions)); addTopics('fastapi', items)
  console.log('fastapi +', items.length)
}

// Docker / AWS: text insertion after the anchor's entry, in each file's own style.
function insert(file, items, entry) {
  const f = src(file); let s = readFileSync(f, 'utf8')
  for (const it of items) {
    if (s.includes(`    q: ${J(it.q)},`)) throw new Error('exists: ' + it.q)
    const i = s.indexOf(`    q: ${J(it.after)},`); if (i < 0) throw new Error('anchor: ' + it.after)
    const end = s.indexOf('\n  },\n', i) + '\n  },\n'.length
    s = s.slice(0, end) + entry(it) + s.slice(end)
  }
  writeFileSync(f, s)
}
insert('dockerQuestionsData.js', DOCKER, (it) =>
  `  {\n    q: ${J(it.q)},\n    level: '${it.level}',\n    a: ${J(it.a)},\n    code: ${tpl(it.code)},\n    output: ${tpl(it.output)},\n  },\n`)
addTopics('docker', DOCKER); console.log('docker +', DOCKER.length)
insert('awsQuestionsData.js', AWS, (it) =>
  `  {\n    q: ${J(it.q)},\n    level: '${it.level}',\n    a: ${J(it.a)},\n    code: ${J(it.code)},\n    output: ${J(it.output)},\n  },\n`)
addTopics('aws', AWS); console.log('aws +', AWS.length)
