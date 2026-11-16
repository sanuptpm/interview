// payroll.test.ts   (fetchEmployees calls the API, getTotalPayroll adds the salaries)
import { it, expect, vi } from 'vitest'
import { fetchEmployees, type Employee } from './employeeApi'
import { getTotalPayroll } from './payroll'

vi.mock('./employeeApi')   // no real network call

const employees: Employee[] = [
  { id: 1, name: 'Asha', salary: 50000 },
  { id: 2, name: 'Ravi', salary: 40000 },
]

it('adds up the salaries from the employee API', async () => {
  vi.mocked(fetchEmployees).mockResolvedValue(employees)
  expect(await getTotalPayroll()).toBe(90000)
})
