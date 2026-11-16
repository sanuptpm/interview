export interface Post { id: number; title: string }
export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  return res.json()
}
