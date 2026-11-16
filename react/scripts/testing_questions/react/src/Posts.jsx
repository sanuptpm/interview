import { useEffect, useState } from 'react'

export default function Posts() {
  const [posts, setPosts] = useState(null)
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then(setPosts)
  }, [])
  if (!posts) return <p>Loading...</p>
  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
}
