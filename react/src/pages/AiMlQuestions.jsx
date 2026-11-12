import QuestionPage from '../components/QuestionPage.jsx'
import { questions } from './aiMlQuestionsData.js'

function AiMlQuestions() {
  return <QuestionPage title="AI/ML Interview Questions" intro="Python examples with real output" questions={questions}
      tryKind={() => 'python'}
    />
}

export default AiMlQuestions
