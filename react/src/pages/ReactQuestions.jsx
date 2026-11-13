import QuestionPage from '../components/QuestionPage.jsx'
import topics from './topics/reactTopics.js'
import { questions } from './reactQuestionsData.jsx'

function ReactQuestions() {
  return (
    <QuestionPage
      title="React Interview Questions"
      intro="Live demos on the right are real React components"
      questions={questions}
      topics={topics}
      language={'javascript'}
      tryKind={(item) =>
        // Live demos get an editor; router examples too (they can't run as a live demo
        // inside this site's own router, but they run fine in the editor's sandbox)
        typeof item.output !== 'string' || item.code.includes('MemoryRouter') ? 'react' : null
      }
    />
  )
}

export default ReactQuestions
