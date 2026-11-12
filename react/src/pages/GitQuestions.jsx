import QuestionPage from '../components/QuestionPage.jsx'
import topics from './topics/gitTopics.js'
import { questions } from './gitQuestionsData.js'

function GitQuestions() {
  return <QuestionPage title="Git Interview Questions" intro="Outputs come from running the commands in a real repository" questions={questions}
      topics={topics}
      language={'bash'} />
}

export default GitQuestions
