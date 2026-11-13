// Usage: node scripts/topics/check.mjs <page>   (run dump.py first)
// Checks src/pages/topics/<page>Topics.js: every question appears exactly once, no unknown titles.
import { readFileSync } from 'node:fs'
const page = process.argv[2]
const here = new URL('.', import.meta.url).pathname
const titles = JSON.parse(readFileSync(here + `titles_${page}.json`, 'utf8'))
const topics = (await import(new URL(`../../src/pages/topics/${page}Topics.js?${Date.now()}`, import.meta.url))).default
const known = new Map(titles.map((t) => [t.title, t.level]))
const seen = new Map(); const problems = []
for (const { topic, questions } of topics) for (const q of questions) {
  if (!known.has(q)) problems.push(`unknown title in "${topic}": ${q}`)
  if (seen.has(q)) problems.push(`duplicate: ${q}`)
  seen.set(q, topic)
}
for (const t of titles) if (!seen.has(t.title)) problems.push(`missing: [${t.level}] ${t.title}`)
console.log(`${page}: ${titles.length} questions, ${topics.length} topics, ${problems.length} problems`)
for (const p of problems.slice(0, 40)) console.log('  ' + p)
process.exit(problems.length ? 1 : 0)
