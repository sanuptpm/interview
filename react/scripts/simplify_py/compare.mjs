// usage: node compare.mjs <original.mjs> <current.js> : confirms q/level unchanged, lists answer edits, line stats
const [o, c] = await Promise.all(process.argv.slice(2).map((p) => import(new URL(p, 'file://' + process.cwd() + '/'))))
const O = o.questions, C = c.questions
let bad = O.length !== C.length ? 1 : 0
C.forEach((x, i) => { if (x.q !== O[i].q || x.level !== O[i].level) { bad++; console.log('CHANGED', i) } ; if (x.a !== O[i].a) console.log(`answer edited [${i}] ${x.q}`) })
const st = (Q) => { const n = Q.map((x) => x.code.split('\n').length); return `avg ${(n.reduce((a, b) => a + b) / n.length).toFixed(1)}, max ${Math.max(...n)}, >12: ${n.filter((k) => k > 12).length}, >10: ${n.filter((k) => k > 10).length}` }
console.log(`q/level diffs: ${bad} | shortened: ${C.filter((x, i) => x.code.split('\n').length < O[i].code.split('\n').length).length} | before: ${st(O)} | after: ${st(C)}`)
C.forEach((x, i) => { const n = x.code.split('\n').length; if (n > 12) console.log(`  over 12: [${i}] ${x.level} ${n} ${x.q}`) })
