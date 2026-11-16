import QuestionPage from '../components/QuestionPage.jsx'
import topics from './topics/angularTopics.js'
import { questions } from './angularQuestionsData.js'

function AngularQuestions() {
  return (
    <QuestionPage
      title="Angular Interview Questions"
      intro="Console output for signals, RxJS, DI, pipes, forms and HttpClient examples is real (run with Angular 22 in Node); rendered-page output is illustrative"
      questions={questions}
      topics={topics}
      language="typescript"
      wrapOutput
    />
  )
}

export default AngularQuestions
