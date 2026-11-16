export function isPalindrome(text) {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '')
  return clean === [...clean].reverse().join('')
}
