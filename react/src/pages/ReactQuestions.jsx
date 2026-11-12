import QuestionPage from '../components/QuestionPage.jsx'
import topics from './topics/reactTopics.js'
import { questions } from './reactQuestionsData.jsx'

function ReactQuestions() {
  return (
    <QuestionPage
      title="React Interview Questions"
      intro="Live demos on the right are real React components"
      questions={questions}
      topics={topics}
      language={'javascript'}
      tryKind={(item) => (typeof item.output === 'string' ? null : 'react')}
    />
  )
}

export default ReactQuestions
