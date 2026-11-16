import { useState } from 'react'

export default function SalaryForm() {
  const [salary, setSalary] = useState('')
  const [error, setError] = useState('')
  const save = (e) => {
    e.preventDefault()
    setError(Number(salary) > 0 ? '' : 'Salary must be greater than 0')
  }
  return (
    <form onSubmit={save}>
      <label>Salary <input value={salary} onChange={(e) => setSalary(e.target.value)} /></label>
      <button>Save</button>
      {error && <p role="alert">{error}</p>}
    </form>
  )
}
