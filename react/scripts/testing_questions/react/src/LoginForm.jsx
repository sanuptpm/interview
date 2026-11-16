import { useState } from 'react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  return (
    <form onSubmit={(e) => { e.preventDefault(); setMessage('Welcome ' + email) }}>
      <label>Email <input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <button type="submit">Log in</button>
      <p>{message}</p>
    </form>
  )
}
