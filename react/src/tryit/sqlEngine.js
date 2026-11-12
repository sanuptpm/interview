// Runs SQL the way the sqlite3 command-line shell does (with `.mode box`) and
// returns the printed text. Plain JS so it can be tested in Node.
//
// runSqlScript(SQL, code) -> string
//   SQL  - the initialised sql.js module (from initSqlJs)
//   code - the script; every call uses a fresh in-memory database

// ---------------------------------------------------------------------------
// Splitting input into statements (port of sqlite3_complete from complete.c)
// ---------------------------------------------------------------------------

const TK = { SEMI: 0, WS: 1, OTHER: 2, EXPLAIN: 3, CREATE: 4, TEMP: 5, TRIGGER: 6, END: 7 }
const TRANS = [
  [1, 0, 2, 3, 4, 2, 2, 2], // 0 INVALID
  [1, 1, 2, 3, 4, 2, 2, 2], // 1 START
  [1, 2, 2, 2, 2, 2, 2, 2], // 2 NORMAL
  [1, 3, 3, 2, 4, 2, 2, 2], // 3 EXPLAIN
  [1, 4, 2, 2, 2, 4, 5, 2], // 4 CREATE
  [6, 5, 5, 5, 5, 5, 5, 5], // 5 TRIGGER
  [6, 6, 5, 5, 5, 5, 5, 7], // 6 SEMI
  [1, 7, 5, 5, 5, 5, 5, 5], // 7 END
]
const KEYWORDS = {
  explain: TK.EXPLAIN,
  create: TK.CREATE,
  temp: TK.TEMP,
  temporary: TK.TEMP,
  trigger: TK.TRIGGER,
  end: TK.END,
}
const isIdChar = (c) => /[A-Za-z0-9_$]/.test(c) || c.charCodeAt(0) > 0x7f
const isSpace = (c) => c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f' || c === '\v'

// True when the text ends with a complete SQL statement (CREATE TRIGGER aware).
export function isComplete(sql) {
  let state = 0
  let i = 0
  while (i < sql.length) {
    const c = sql[i]
    let token
    if (c === ';') {
      token = TK.SEMI
      i++
    } else if (isSpace(c)) {
      token = TK.WS
      i++
    } else if (c === '/' && sql[i + 1] === '*') {
      const end = sql.indexOf('*/', i + 2)
      if (end < 0) return false
      token = TK.WS
      i = end + 2
    } else if (c === '-' && sql[i + 1] === '-') {
      const end = sql.indexOf('\n', i)
      if (end < 0) return state === 1
      token = TK.WS
      i = end + 1
    } else if (c === '[' || c === '`' || c === '"' || c === "'") {
      const end = sql.indexOf(c === '[' ? ']' : c, i + 1)
      if (end < 0) return false
      token = TK.OTHER
      i = end + 1
    } else if (isIdChar(c)) {
      let j = i
      while (j < sql.length && isIdChar(sql[j])) j++
      token = KEYWORDS[sql.slice(i, j).toLowerCase()] ?? TK.OTHER
      i = j
    } else {
      token = TK.OTHER
      i++
    }
    state = TRANS[state][token]
  }
  return state === 1
}

// A line holding only whitespace and/or comments (the shell skips these
// between statements).
function isAllWhitespace(line) {
  let i = 0
  while (i < line.length) {
    if (isSpace(line[i])) i++
    else if (line[i] === '-' && line[i + 1] === '-') {
      const end = line.indexOf('\n', i)
      if (end < 0) return true
      i = end + 1
    } else if (line[i] === '/' && line[i + 1] === '*') {
      const end = line.indexOf('*/', i + 2)
      if (end < 0) return false
      i = end + 2
    } else return false
  }
  return true
}

// ---------------------------------------------------------------------------
// Formatting values like the shell
// ---------------------------------------------------------------------------

// Reals: shortest round-trip digits, always with a decimal point, exponent form
// ("1.0e-05", "1.0e+17") outside 1e-4 .. 1e17, like the shell prints them.
export function formatReal(x) {
  if (Number.isNaN(x)) return ''
  if (x === Infinity) return 'Inf'
  if (x === -Infinity) return '-Inf'
  if (x === 0) return '0.0'
  const [mant, expStr] = x.toExponential().split('e')
  const exp = Number(expStr)
  if (exp < -4 || exp >= 17) {
    const m = mant.includes('.') ? mant : mant + '.0'
    const e = Math.abs(exp).toString().padStart(2, '0')
    return `${m}e${exp < 0 ? '-' : '+'}${e}`
  }
  const neg = mant.startsWith('-')
  const digits = mant.replace('-', '').replace('.', '')
  let s
  if (exp >= 0) {
    const intPart = digits.slice(0, exp + 1).padEnd(exp + 1, '0')
    const frac = digits.slice(exp + 1)
    s = intPart + '.' + (frac || '0')
  } else {
    s = '0.' + '0'.repeat(-exp - 1) + digits
  }
  return (neg ? '-' : '') + s
}

const utf8 = new TextDecoder('utf-8')

function valueToText(v, nullValue) {
  if (v === null || v === undefined) return nullValue
  if (typeof v === 'bigint') return v.toString()
  if (typeof v === 'number') return formatReal(v)
  if (v instanceof Uint8Array) return utf8.decode(v)
  return String(v)
}

const isNumeric = (v) => typeof v === 'bigint' || typeof v === 'number'

// Display width of one code point (CJK wide = 2, combining marks = 0).
function charWidth(cp) {
  if (
    (cp >= 0x0300 && cp <= 0x036f) ||
    (cp >= 0x1ab0 && cp <= 0x1aff) ||
    (cp >= 0x1dc0 && cp <= 0x1dff) ||
    (cp >= 0x20d0 && cp <= 0x20ff) ||
    (cp >= 0xfe20 && cp <= 0xfe2f) ||
    cp === 0x200b
  ) {
    return 0
  }
  if (
    (cp >= 0x1100 && cp <= 0x115f) ||
    (cp >= 0x2e80 && cp <= 0xa4cf && cp !== 0x303f) ||
    (cp >= 0xac00 && cp <= 0xd7a3) ||
    (cp >= 0xf900 && cp <= 0xfaff) ||
    (cp >= 0xfe30 && cp <= 0xfe4f) ||
    (cp >= 0xff00 && cp <= 0xff60) ||
    (cp >= 0xffe0 && cp <= 0xffe6) ||
    (cp >= 0x20000 && cp <= 0x3fffd)
  ) {
    return 2
  }
  return 1
}

function textWidth(s) {
  let w = 0
  for (const ch of s) w += charWidth(ch.codePointAt(0))
  return w
}

// Split a cell into display lines: tabs expand to 8-column stops and other
// control characters show as ^X, like the shell.
function cellLines(text) {
  return text.split('\n').map((line) => {
    let out = ''
    let col = 0
    for (const ch of line) {
      const cp = ch.codePointAt(0)
      if (ch === '\t') {
        const n = 8 - (col % 8)
        out += ' '.repeat(n)
        col += n
      } else if (cp < 0x20) {
        out += '^' + String.fromCharCode(cp + 64)
        col += 2
      } else {
        out += ch
        col += charWidth(cp)
      }
    }
    return out
  })
}

function pad(text, width, align) {
  const gap = width - textWidth(text)
  if (gap <= 0) return text
  if (align === 'right') return ' '.repeat(gap) + text
  if (align === 'center') {
    const left = Math.floor(gap / 2)
    return ' '.repeat(left) + text + ' '.repeat(gap - left)
  }
  return text + ' '.repeat(gap)
}

// A result set as a `.mode box` table.
export function boxTable(columns, rows, { headers = true, nullValue = '' } = {}) {
  const head = columns.map((name) => cellLines(name))
  const body = rows.map((row) =>
    row.map((v) => ({ lines: cellLines(valueToText(v, nullValue)), right: isNumeric(v) }))
  )
  const widths = columns.map((_, c) => {
    let w = headers ? Math.max(...head[c].map(textWidth)) : 0
    for (const row of body) for (const line of row[c].lines) w = Math.max(w, textWidth(line))
    return w
  })
  const rule = (l, m, r, fill) => l + widths.map((w) => fill.repeat(w + 2)).join(m) + r
  const printRow = (cells, alignOf) => {
    const height = Math.max(...cells.map((lines) => lines.length))
    const out = []
    for (let i = 0; i < height; i++) {
      out.push(
        '│' +
          cells.map((lines, c) => ' ' + pad(lines[i] ?? '', widths[c], alignOf(c)) + ' ').join('│') +
          '│'
      )
    }
    return out
  }

  const out = [rule('╭', '┬', '╮', '─')]
  if (headers) {
    out.push(...printRow(head, () => 'center'))
    out.push(rule('╞', '╪', '╡', '═'))
  }
  for (const row of body) {
    out.push(...printRow(row.map((cell) => cell.lines), (c) => (row[c].right ? 'right' : 'left')))
  }
  out.push(rule('╰', '┴', '╯', '─'))
  return out.join('\n')
}

// EXPLAIN QUERY PLAN rows (id, parent, notused, detail) as the shell's tree.
export function queryPlanTree(rows) {
  if (!rows.length) return ''
  const items = rows.map(([id, parent, , detail]) => ({
    id: Number(id),
    parent: Number(parent),
    text: String(detail),
  }))
  const out = []
  if (items[0].text.startsWith('-')) {
    if (items.length === 1) return ''
    out.push(items.shift().text.slice(3))
  } else {
    out.push('QUERY PLAN')
  }
  const render = (parentId, prefix) => {
    const kids = items.filter((item) => item.parent === parentId)
    kids.forEach((item, i) => {
      const last = i === kids.length - 1
      out.push(prefix + (last ? '`--' : '|--') + item.text)
      render(item.id, prefix + (last ? '   ' : '|  '))
    })
  }
  render(0, '')
  return out.join('\n')
}

// Plain EXPLAIN (bytecode listing) in the shell's fixed-width columns.
function explainListing(columns, rows) {
  const widths = [4, 13, 4, 4, 4, 13, 2, 13]
  const line = (cells) =>
    cells
      .map((cell, i) => pad(cell, widths[i] ?? 0, 'left'))
      .join('  ')
      .trimEnd()
  const out = [line(columns), widths.map((w) => '-'.repeat(w)).join('  ')]
  for (const row of rows) out.push(line(row.map((v) => valueToText(v, ''))))
  return out.join('\n')
}

const EQP_COLUMNS = 'id,parent,notused,detail'
const EXPLAIN_COLUMNS = 'addr,opcode,p1,p2,p3,p4,p5,comment'

// Strip leading whitespace and comments from SQL text.
function stripLeadingComments(sql) {
  let s = sql
  for (;;) {
    s = s.trimStart()
    if (s.startsWith('--')) {
      const end = s.indexOf('\n')
      s = end < 0 ? '' : s.slice(end + 1)
    } else if (s.startsWith('/*')) {
      const end = s.indexOf('*/')
      s = end < 0 ? '' : s.slice(end + 2)
    } else return s
  }
}

// ---------------------------------------------------------------------------
// Error context ("  select foo;\n         ^--- error here")
// ---------------------------------------------------------------------------

// sql.js does not expose sqlite3_error_offset, so the offset is found by
// re-preparing prefixes of the statement (syntax errors) or by locating the
// name in the message (no such column / function).
function findErrorOffset(db, sql, message) {
  const syntax = /^near "(.*)": syntax error$/s.exec(message)
  if (syntax) {
    const token = syntax[1]
    for (let at = sql.indexOf(token); at >= 0; at = sql.indexOf(token, at + 1)) {
      const end = at + token.length
      if (isIdChar(token.at(-1)) && end < sql.length && isIdChar(sql[end])) continue
      try {
        db.prepare(sql.slice(0, end)).free()
      } catch (error) {
        if (error.message === message) return at
      }
    }
    return -1
  }
  const named = /^no such (?:column|function): (.+)$/.exec(message)
  if (named) {
    const name = named[1]
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\./g, '\\s*\\.\\s*')
    const match = new RegExp(`(?<![\\w$])${escaped}(?![\\w$])`, 'i').exec(sql)
    return match ? match.index : -1
  }
  return -1
}

// Port of the shell's shell_error_context().
function errorContext(db, sql, message) {
  let offset = findErrorOffset(db, sql, message)
  if (offset < 0 || offset >= sql.length) return ''
  let code = sql
  while (offset > 50) {
    code = code.slice(1)
    offset--
  }
  code = code.slice(0, 78).replace(/\s/g, ' ')
  if (offset < 25) return `\n  ${code}\n  ${' '.repeat(offset)}^--- error here`
  return `\n  ${code}\n  ${' '.repeat(offset - 14)}error here ---^`
}

// ---------------------------------------------------------------------------
// Dot-commands
// ---------------------------------------------------------------------------

// Ones that only change shell display/timing settings we don't need.
const IGNORED_DOT_COMMANDS = new Set([
  'bail',
  'changes',
  'echo',
  'eqp',
  'explain',
  'scanstats',
  'separator',
  'stats',
  'timer',
  'width',
])

const DOT_HELP = `.headers on|off       Turn the table header row on or off
.help                 Show this message
.mode box             Box tables (the only mode shown here)
.nullvalue TEXT       Show NULL values as TEXT
.print STRING...      Print literal STRING
.schema ?PATTERN?     Show the CREATE statements
.tables ?PATTERN?     List names of tables and views`

function splitArgs(line) {
  const args = []
  const re = /"((?:[^"\\]|\\.)*)"|'([^']*)'|(\S+)/g
  let m
  while ((m = re.exec(line))) args.push(m[1] ?? m[2] ?? m[3])
  return args
}

function likePattern(arg) {
  return arg ? arg : '%'
}

function runDotCommand(db, line, settings, print) {
  const [cmdWord = '', ...args] = splitArgs(line.slice(1))
  const cmd = cmdWord.toLowerCase()
  const bad = () =>
    print(`Error: unknown command or invalid arguments:  "${cmdWord}". Enter ".help" for help`)

  if (IGNORED_DOT_COMMANDS.has(cmd)) return
  switch (cmd) {
    case 'mode':
      if (args.length && args[0].toLowerCase() !== 'box') {
        print(`Note: this editor only shows .mode box, so ".mode ${args[0]}" is ignored`)
      }
      return
    case 'headers':
    case 'header':
      if (!args.length) return bad()
      settings.headers = /^(on|yes|true|1)$/i.test(args[0])
      return
    case 'nullvalue':
      settings.nullValue = args[0] ?? ''
      return
    case 'print':
      print(args.join(' '))
      return
    case 'help':
      print(DOT_HELP)
      return
    case 'tables': {
      const res = db.exec(
        `SELECT name FROM sqlite_schema WHERE type IN ('table','view')
         AND name NOT LIKE 'sqlite_%' AND name LIKE ? ORDER BY name`,
        [likePattern(args[0])]
      )
      const names = res.length ? res[0].values.map((r) => r[0]) : []
      if (names.length) {
        const w = Math.max(...names.map((n) => n.length)) + 2
        print(names.map((n, i) => (i === names.length - 1 ? n : n.padEnd(w))).join(''))
      }
      return
    }
    case 'schema': {
      const res = db.exec(
        `SELECT sql FROM sqlite_schema WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%'
         AND tbl_name LIKE ? ORDER BY rowid`,
        [likePattern(args[0])]
      )
      const stmts = res.length ? res[0].values.map((r) => r[0] + ';') : []
      if (stmts.length) print(stmts.join('\n'))
      return
    }
    default:
      bad()
  }
}

// ---------------------------------------------------------------------------
// Running a script
// ---------------------------------------------------------------------------

// Formats the rows a statement returned (null when there is nothing to show).
function formatResult(stmt, columns, rows, settings) {
  if (!columns.length || !rows.length) return null
  const head = stripLeadingComments(stmt.getSQL())
  if (columns.join() === EQP_COLUMNS && /^explain\s+query\s+plan\b/i.test(head)) {
    return queryPlanTree(rows) || null
  }
  if (columns.join() === EXPLAIN_COLUMNS && /^explain\b/i.test(head)) {
    return explainListing(columns, rows)
  }
  return boxTable(columns, rows, settings)
}

// Steps a statement; on a runtime error the rows fetched so far are still
// shown (like the shell) and the error is returned.
function runStatement(stmt, settings) {
  const columns = stmt.getColumnNames()
  const rows = []
  let error = null
  try {
    while (stmt.step()) rows.push(stmt.get(null, { useBigInt: true }))
  } catch (caught) {
    error = caught
  }
  return { text: formatResult(stmt, columns, rows, settings), error }
}

export function runSqlScript(SQL, code) {
  const db = new SQL.Database()
  const settings = { headers: true, nullValue: '' }
  const out = []
  // The recorded outputs put a blank line after each result block.
  let afterBlock = false
  const print = (text, isBlock = false) => {
    if (afterBlock) out.push('')
    out.push(text)
    afterBlock = isBlock
  }

  // Run one complete chunk of input (one or more statements). Like the shell,
  // an error stops the rest of that chunk and is reported with the line the
  // chunk started on.
  const runChunk = (chunk, startLine) => {
    const iter = db.iterateStatements(chunk)
    for (;;) {
      const remaining = iter.getRemainingSQL().trimStart()
      let next
      try {
        next = iter.next()
      } catch (error) {
        print(
          `Parse error near line ${startLine}: ${error.message}` +
            errorContext(db, remaining, error.message)
        )
        return
      }
      if (next.done) return
      const stmt = next.value
      const { text, error } = runStatement(stmt, settings)
      stmt.free()
      if (text) print(text, true)
      if (error) {
        print(`Error near line ${startLine}: ${error.message}`)
        return
      }
    }
  }

  try {
    const lines = code.replace(/\r\n?/g, '\n').split('\n')
    if (lines.at(-1) === '') lines.pop()
    let chunk = ''
    let startLine = 0
    lines.forEach((line, i) => {
      if (!chunk) {
        if (isAllWhitespace(line)) return
        if (line.startsWith('.')) {
          runDotCommand(db, line, settings, print)
          return
        }
        startLine = i + 1
        chunk = line.trimStart()
      } else {
        chunk += '\n' + line
      }
      if (isComplete(chunk)) {
        runChunk(chunk, startLine)
        chunk = ''
      }
    })
    if (chunk && !isAllWhitespace(chunk)) runChunk(chunk, startLine)
  } finally {
    db.close()
  }

  return out.join('\n')
}
