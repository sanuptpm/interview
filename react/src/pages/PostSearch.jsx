import { useState, useEffect, useMemo } from 'react'

function PostSearch() {
  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const styles = {
    main: { padding: '20px' },
    title: { color: '#5C6AC4' },
    item: {
      background: '#5C6AC4',
      color: 'white',
      padding: '10px',
      margin: '8px',
      borderRadius: '6px',
    },
  }

  const loadPosts = async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Failed to load posts:', error)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  // Debounce search input: waits 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  // Filter posts based on the debounced search term
  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()
    if (!query) return posts

    return posts.filter((item) =>
      item.title.trim().toLowerCase().includes(query)
    )
  }, [posts, debouncedSearch])

  return (
    <div style={styles.main}>
      <h1 style={styles.title}>Hello, World!</h1>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search posts..."
      />

      <div>
        {filtered.length === 0 && <p>No results</p>}
        {filtered.map((item) => (
          <div style={styles.item} key={item.id}>
            {item.title}
          </div>
        ))}

        <button onClick={() => setCount((c) => c + 1)}>count {count}</button>
      </div>
    </div>
  )
}

export default PostSearch
