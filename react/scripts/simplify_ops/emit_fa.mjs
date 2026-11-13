// Re-emit fastapiQuestionsData.js in exactly the generator's original format.
const tpl = (s) => '`' + s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`'
// Python json.dumps(ensure_ascii=False) == JSON.stringify for these strings
export function emit(questions) {
  const parts = ['// FastAPI interview questions, basics to advanced.',
    '// Every output below was produced by running the example code with',
    "// FastAPI's TestClient (or a real terminal command), not written by hand.",
    '', 'export const questions = [']
  for (const x of questions) {
    parts.push('  {', `    q: ${JSON.stringify(x.q)},`, `    level: '${x.level}',`, `    a: ${JSON.stringify(x.a)},`,
      `    code: ${tpl(x.code)},`, `    output: ${tpl(x.output)},`, '  },')
  }
  parts.push(']')
  return parts.join('\n') + '\n'
}
