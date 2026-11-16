import { fetchEmployees } from './employeeApi'

export async function getTotalPayroll(): Promise<number> {
  const employees = await fetchEmployees()
  return employees.reduce((sum, e) => sum + e.salary, 0)
}
