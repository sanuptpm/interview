import QuestionPage from '../components/QuestionPage.jsx'
import topics from './topics/fastapiTopics.js'
import { questions } from './fastapiQuestionsData.js'

function FastApiQuestions() {
  return (
    <QuestionPage
      title="FastAPI Interview Questions"
      intro="Output shows the HTTP request and the JSON response"
      questions={questions}
      topics={topics}
      language={'python'}
      tryKind={() => 'fastapi'}
    />
  )
}

export default FastApiQuestions
