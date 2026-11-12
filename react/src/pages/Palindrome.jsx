function isPalindrome(str) {
  let left = 0
  let right = str.length - 1

  while (left < right) {
    if (str[left] !== str[right]) {
      return false
    }
    left++
    right--
  }

  return true
}

function Palindrome() {
  const words = ['madam', 'racecar', 'hello', 'level', 'world']

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#5C6AC4' }}>Palindrome</h1>
      {words.map((word) => (
        <p key={word}>
          {word}: {isPalindrome(word) ? 'Palindrome' : 'Not a palindrome'}
        </p>
      ))}
    </div>
  )
}

export default Palindrome
