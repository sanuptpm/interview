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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">Palindrome</h1>

      <div className="mt-6 space-y-2">
        {words.map((word) => (
          <div
            key={word}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <span className="font-mono text-slate-800">{word}</span>
            {isPalindrome(word) ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                Palindrome
              </span>
            ) : (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
                Not a palindrome
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Palindrome
