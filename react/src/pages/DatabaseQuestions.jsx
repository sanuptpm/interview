import QuestionPage from '../components/QuestionPage.jsx'
import { questions } from './databaseQuestionsData.js'

function DatabaseQuestions() {
  return <QuestionPage title="Database Interview Questions" intro="SQLite examples show real results; PostgreSQL, MongoDB and Redis examples show sample output" questions={questions} />
}

export default DatabaseQuestions
