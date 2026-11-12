import QuestionPage from '../components/QuestionPage.jsx'
import { questions } from './reactQuestionsData.jsx'

function ReactQuestions() {
  return (
    <QuestionPage
      title="React Interview Questions"
      intro="Live demos on the right are real React components"
      questions={questions}
      tryKind={(item) => (typeof item.output === 'string' ? null : 'react')}
    />
  )
}

export default ReactQuestions
