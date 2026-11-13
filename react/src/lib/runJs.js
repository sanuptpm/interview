// Runs JavaScript code with a fake console and returns the logged lines.
// Used by the JavaScript page and the "Try it" editor.

// Turn a logged value into readable text
export function format(value) {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || value === undefined || typeof value === 'bigint') {
    return String(value)
  }
  if (typeof value === 'function') return 'function ' + (value.name || '(anonymous)')
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

// Run the code with a fake console and collect what it logs
export function runCode(code) {
  const logs = []
  const write = (prefix) => (...args) => logs.push(prefix + args.map(format).join(' '))
  const fakeConsole = {
    log: write(''),
    info: write(''),
    warn: write('Warning: '),
    error: write('Error: '),
    table: write(''),
  }

  try {
    new Function('console', code)(fakeConsole)
  } catch (error) {
    logs.push(error.name + ': ' + error.message)
  }

  // Give timers and Promises time to finish before showing the output
  return new Promise((resolve) => setTimeout(() => resolve(logs), 400))
}

// For short examples written as bare expressions (like `numbers.map(...)`),
// wrap each standalone top-level expression line in console.log so the editor shows its value.
export function addConsoleLogs(code) {
  const skip = /^((const|let|var|function|class|if|else|for|while|do|switch|return|import|export|try|catch|finally|throw|async|await)\b|\/\/|\/\*|\*|}|\)|]|;|console\.)/
  return code
    .split('\n')
    .map((line) => {
      if (!line.trim() || /^\s/.test(line) || skip.test(line)) return line
      const commentAt = line.search(/\s\/\/\s/)
      const expr = (commentAt === -1 ? line : line.slice(0, commentAt)).trim()
      const comment = commentAt === -1 ? '' : line.slice(commentAt)
      // Leave assignments and lines that continue onto the next line alone
      if (/[^=!<>]=[^=>]/.test(expr) || /[,({[]$/.test(expr) || /^[.?]/.test(expr)) return line
      return 'console.log(' + expr + ')' + comment
    })
    .join('\n')
}
