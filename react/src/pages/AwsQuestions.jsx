import QuestionPage from '../components/QuestionPage.jsx'
import { questions } from './awsQuestionsData.js'

function AwsQuestions() {
  return <QuestionPage title="AWS Interview Questions" intro="Outputs are example responses, not from a live AWS account" questions={questions} />
}

export default AwsQuestions
