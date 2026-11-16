export interface Employee { id: number; name: string; salary: number }

export async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  return res.json()
}
