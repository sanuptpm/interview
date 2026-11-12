import QuestionPage from '../components/QuestionPage.jsx'
import { questions } from './databaseQuestionsData.js'

function DatabaseQuestions() {
  return <QuestionPage title="Database Interview Questions" intro="SQLite examples show real results; PostgreSQL, MongoDB and Redis examples show sample output" questions={questions}
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
