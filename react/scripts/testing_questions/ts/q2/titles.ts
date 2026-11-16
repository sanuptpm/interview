import { fetchPosts } from './api'
export async function getTitles(): Promise<string[]> {
  const posts = await fetchPosts()
  return posts.map((p) => p.title)
}
