import QuestionPage from '../components/QuestionPage.jsx'
import topics from './topics/typescriptTopics.js'
import { questions } from './typescriptQuestionsData.js'

function TypeScriptQuestions() {
  return (
    <QuestionPage
      title="TypeScript Interview Questions"
      intro="Type errors come from the real TypeScript compiler (tsc); printed output comes from running the code"
      questions={questions}
      topics={topics}
      language="typescript"
      wrapOutput
    />
  )
}

export default TypeScriptQuestions
