// Step 2 (server): fake REST API from jsonplaceholder.
const URL = 'https://jsonplaceholder.typicode.com/posts'

export async function getPosts(userId) {
  const res = await fetch(URL + '?userId=' + userId)
  if (!res.ok) throw new Error('HTTP ' + res.status)
  return res.json()
}

// jsonplaceholder fakes the save: it returns the new post (id 101) but does not store it.
export async function addPost(post) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  })
  return res.json()
}
