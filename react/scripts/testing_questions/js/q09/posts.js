export async function getPostTitle(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  if (!res.ok) throw new Error('Post not found')
  const post = await res.json()
  return post.title
}
