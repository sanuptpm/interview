import QuestionPage from '../components/QuestionPage.jsx'
import topics from './topics/pythonTopics.js'
import { questions } from './pythonQuestionsData.js'

function PythonQuestions() {
  return (
    <QuestionPage
      title="Python Interview Questions"
      intro="Output from running each example with Python 3"
      questions={questions}
      topics={topics}
      language={'python'}
      tryKind={() => 'python'}
    />
  )
}

export default PythonQuestions
