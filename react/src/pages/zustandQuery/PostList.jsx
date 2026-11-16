import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useFilterStore } from './useFilterStore'
import { addPost, getPosts } from './postsApi'

// Step 3: the component reads client state from Zustand and server state from TanStack Query.
function PostList() {
  const userId = useFilterStore((state) => state.userId)
  const setUserId = useFilterStore((state) => state.setUserId)
  const queryClient = useQueryClient()

  // The userId is part of the queryKey, so each user's posts are cached separately
  const { data, isPending, error } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => getPosts(userId),
  })

  // After adding, mark the list stale so it refetches
  const add = useMutation({
    mutationFn: addPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })

  return (
    <div>
      <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
        <option value={1}>User 1</option>
        <option value={2}>User 2</option>
        <option value={3}>User 3</option>
      </select>

      <button onClick={() => add.mutate({ title: 'New post', body: 'Hello', userId })}>
        {add.isPending ? 'Adding...' : 'Add post'}
      </button>
      {add.data && <p>Saved post id: {add.data.id}</p>}

      {isPending && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.slice(0, 5).map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PostList
