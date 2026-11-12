function bubbleSort(input) {
  const arr = [...input]

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }

  return arr
}

function BubbleSort() {
  const numbers = [29, 10, 14, 37, 13, 5, 42, 21]
  const sorted = bubbleSort(numbers)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">Bubble Sort</h1>

      <p className="mt-6 text-sm font-medium text-slate-500">Input</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {numbers.map((n, i) => (
          <span key={i} className="rounded-lg bg-slate-200 px-3 py-1.5 font-mono text-slate-700">
            {n}
          </span>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium text-slate-500">Output</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {sorted.map((n, i) => (
          <span key={i} className="rounded-lg bg-emerald-100 px-3 py-1.5 font-mono text-emerald-700">
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

export default BubbleSort
