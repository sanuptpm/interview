import QuestionPage from '../components/QuestionPage.jsx'
import { questions } from './dockerQuestionsData.js'

function DockerQuestions() {
  return <QuestionPage title="Docker Interview Questions" intro="Outputs are example terminal output (IDs and sizes are illustrative)" questions={questions} />
}

export default DockerQuestions
