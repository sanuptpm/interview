import { describe, it, expect } from 'vitest'
import { isPalindrome } from './isPalindrome.js'

describe('isPalindrome', () => {
  it('returns true for a palindrome', () => {
    const word = 'Racecar'                // Arrange
    const result = isPalindrome(word)     // Act
    expect(result).toBe(true)             // Assert
  })

  it('ignores spaces and punctuation', () => {
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true)
  })

  it('returns false for a normal word', () => {
    expect(isPalindrome('hello')).toBe(false)
  })
})
