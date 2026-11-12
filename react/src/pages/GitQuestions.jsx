import QuestionPage from '../components/QuestionPage.jsx'
import { questions } from './gitQuestionsData.js'

function GitQuestions() {
  return <QuestionPage title="Git Interview Questions" intro="Outputs come from running the commands in a real repository" questions={questions} />
}

export default GitQuestions
