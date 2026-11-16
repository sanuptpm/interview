import { useEffect, useState } from 'react'

export default function TodoList() {
  const [todos, setTodos] = useState([])
  useEffect(() => {
    setTimeout(() => setTodos(['Learn RTL', 'Write tests']), 100)
  }, [])
  return (
    <ul>
      {todos.map((t) => <li key={t}>{t}</li>)}
    </ul>
  )
}
