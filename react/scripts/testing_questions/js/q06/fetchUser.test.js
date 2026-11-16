import { test, expect } from 'vitest'

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => (id > 0 ? resolve({ id, name: 'Ravi' }) : reject(new Error('Invalid id'))), 10)
  })
}

test('with async/await', async () => {
  const user = await fetchUser(1)
  expect(user.name).toBe('Ravi')
})

test('with resolves / rejects', async () => {
  await expect(fetchUser(1)).resolves.toEqual({ id: 1, name: 'Ravi' })
  await expect(fetchUser(-1)).rejects.toThrow('Invalid id')
})
