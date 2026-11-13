// usage: node show.mjs <before.js> <after.js> : prints changed items with line counts and new output
const [b, a] = process.argv.slice(2).map((p) => import(new URL(p, 'file://' + process.cwd() + '/')))
const [B, A] = (await Promise.all([b, a])).map((m) => m.questions)
A.forEach((x, i) => { if (x.code !== B[i].code) console.log(`### [${i}] ${x.code.split('\n').length} (was ${B[i].code.split('\n').length})\n${x.output}`) })
