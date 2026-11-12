import { useState, useEffect, useMemo } from 'react'

function PostSearch() {
  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Load posts once when the page opens
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Failed to load posts:', error))
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">Post Search</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search posts..."
        className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />

      <p className="mt-3 text-sm text-slate-500">{filtered.length} posts</p>

      <div className="mt-3 space-y-2">
        {filtered.length === 0 && <p className="text-slate-500">No results</p>}
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm"
          >
            {item.title}
          </div>
        ))}
      </div>

      <button
        onClick={() => setCount((c) => c + 1)}
        className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-500"
      >
        count {count}
      </button>
    </div>
  )
}

export default PostSearch
