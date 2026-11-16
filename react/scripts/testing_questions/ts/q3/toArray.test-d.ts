// toArray.test-d.ts
import { expectTypeOf, assertType, test } from 'vitest'

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

test('toArray types', () => {
  expectTypeOf(toArray(1)).toEqualTypeOf<number[]>()
  assertType<string[]>(toArray('a'))
  expectTypeOf(toArray(['a'])).toEqualTypeOf<string[][]>()   // wrong on purpose
})
