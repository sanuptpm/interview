import QuestionPage from '../components/QuestionPage.jsx'
import topics from './topics/databaseTopics.js'
import { questions } from './databaseQuestionsData.js'

function DatabaseQuestions() {
  return <QuestionPage title="Database Interview Questions" intro="SQLite examples show real results; PostgreSQL, MongoDB and Redis examples show sample output" questions={questions}
      topics={topics}
      language={(item) => (/^\s*(import |from |def |async )/m.test(item.code) ? 'python' : /db\.\w+\.|redis|\bSET\b.*\bEX\b/i.test(item.code) && !/SELECT|CREATE/i.test(item.code) ? ['javascript', 'bash'] : 'sql')}
      tryKind={(item) => {
        if (item.code.includes('import sqlite3')) return 'python'
        if (item.output.includes('╭') ||
          item.output.includes('QUERY PLAN') ||
          item.output.includes('Error near line')) return 'sql'
        return null
      }}
    />
}

export default DatabaseQuestions
