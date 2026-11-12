import QuestionPage from '../components/QuestionPage.jsx'
import topics from './topics/aiMlTopics.js'
import { questions } from './aiMlQuestionsData.js'

function AiMlQuestions() {
  return <QuestionPage title="AI/ML Interview Questions" intro="Python examples with real output" questions={questions}
      topics={topics}
      language={'python'}
      tryKind={() => 'python'}
    />
}

export default AiMlQuestions
