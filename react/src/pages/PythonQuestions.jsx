import QuestionPage from '../components/QuestionPage.jsx'
import { questions } from './pythonQuestionsData.js'

function PythonQuestions() {
  return (
    <QuestionPage
      title="Python Interview Questions"
      intro="Output from running each example with Python 3"
      questions={questions}
    />
  )
}

export default PythonQuestions
