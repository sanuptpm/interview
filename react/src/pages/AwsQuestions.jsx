import QuestionPage from '../components/QuestionPage.jsx'
import topics from './topics/awsTopics.js'
import { questions } from './awsQuestionsData.js'

function AwsQuestions() {
  return <QuestionPage title="AWS Interview Questions" intro="Outputs are example responses, not from a live AWS account" questions={questions}
      topics={topics}
      language={['bash', 'json', 'python', 'yaml']} />
}

export default AwsQuestions
