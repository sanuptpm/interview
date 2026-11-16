import { track } from './analytics'

export default function SubscribeForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    track('subscribe')
    onSubmit({ plan: 'pro' })
  }
  return <form onSubmit={handleSubmit}><button>Subscribe</button></form>
}
