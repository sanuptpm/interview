import QuestionPage from '../components/QuestionPage.jsx'
import { questions } from './fastapiQuestionsData.js'

function FastApiQuestions() {
  return (
    <QuestionPage
      title="FastAPI Interview Questions"
      intro="Output shows the HTTP request and the JSON response"
      questions={questions}
      tryKind={() => 'fastapi'}
    />
  )
}

export default FastApiQuestions
