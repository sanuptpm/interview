// node scripts/gaps_react_ts/show_apps.mjs : prints the Try-it App.js for the new React demo questions
import { snippetToApp } from '../../src/tryit/reactSnippet.js'
import { readFileSync } from 'node:fs'
const dir = new URL('.', import.meta.url).pathname
const src = readFileSync(dir + '../../src/pages/reactQuestionsData.jsx', 'utf8')
const titles = ['What is prop drilling and how do you avoid it?', 'What are defaultValue and defaultChecked?', 'What is a ref callback?',
  'What is useSyncExternalStore?', 'What is flushSync?', 'What do Children, cloneElement and isValidElement do?', 'What is useFormStatus?']
for (const t of titles) {
  const i = src.indexOf(`q: '${t}'`)
  const c = src.indexOf('code: `', i) + 7
  const code = src.slice(c, src.indexOf('`,\n', c))
  console.log('=====', t, '\n' + snippetToApp(code))
}
