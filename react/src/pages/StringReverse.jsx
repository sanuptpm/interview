function reverseString(str) {
  let reversed = ''

  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i]
  }

  return reversed
}

function StringReverse() {
  const text = 'hello world'
  const reversed = reverseString(text)

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#5C6AC4' }}>String Reverse</h1>
      <p>Input: {text}</p>
      <p>Output: {reversed}</p>
    </div>
  )
}

export default StringReverse
