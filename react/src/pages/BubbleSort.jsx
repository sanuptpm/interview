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
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#5C6AC4' }}>Bubble Sort</h1>
      <p>Input: [{numbers.join(', ')}]</p>
      <p>Output: [{sorted.join(', ')}]</p>
    </div>
  )
}

export default BubbleSort
