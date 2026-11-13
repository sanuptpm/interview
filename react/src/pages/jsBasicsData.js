// JavaScript basics used on the JavaScript page.
// Each example has: the code shown on screen, and `result` which runs that same code.

// let can be reassigned, const cannot
let score = 10
score = 20
const name = 'Sanu'

// const objects/arrays can still be changed inside
const user = { age: 25 }
user.age = 26

// Arrow function: short way to write a function
const add = (a, b) => a + b
const square = (n) => n * n

const numbers = [5, 2, 8, 1, 9]
const fruits = ['apple', 'banana', 'mango']
const people = [
  { id: 1, name: 'Anu', age: 22 },
  { id: 2, name: 'Ravi', age: 30 },
  { id: 3, name: 'Meera', age: 27 },
]

export const basics = [
  {
    title: "What is JavaScript?",
    note: "JavaScript is the programming language of the web. HTML gives the structure, CSS the style, and JavaScript adds behaviour, like reacting to clicks, updating the page and calling APIs. It runs in every browser, and with Node.js it also runs on servers. It's single-threaded and dynamically typed, so a variable can hold any type.",
    code: `// Runs in the browser and in Node.js
const language = 'JavaScript'
const year = 1995

let value = 42        // dynamically typed:
value = 'now a string' // the same variable holds a new type

language + ' was created in ' + year`,
    result: (() => {
      const language = 'JavaScript'
      const year = 1995
      let value = 42
      const firstType = typeof value
      value = 'now a string'
      return {
        sentence: language + ' was created in ' + year,
        typeBefore: firstType,
        typeAfter: typeof value,
      }
    })(),
  },
  {
    title: "What data types does JavaScript have?",
    note: "There are seven primitive types: string, number, boolean, undefined, null, bigint and symbol. Everything else is an object, including arrays and functions. Primitives are copied by value, while objects are shared by reference, which is important when I pass them to functions.",
    code: `typeof 'hello'        // string
typeof 42             // number
typeof true           // boolean
typeof undefined      // undefined
typeof null           // object (a known quirk)
typeof 10n            // bigint
typeof Symbol('id')   // symbol
typeof { a: 1 }       // object
typeof [1, 2]         // object
typeof function () {} // function`,
    result: [
      typeof 'hello',
      typeof 42,
      typeof true,
      typeof undefined,
      typeof null,
      typeof 10n,
      typeof Symbol('id'),
      typeof { a: 1 },
      typeof [1, 2],
      typeof function () {},
    ],
  },
  {
    title: "How do you write and call a function?",
    note: "I declare a function with the function keyword, a name, parameters in brackets, and a body. Inside, return sends a value back to the caller; without return the function gives undefined. I call it by writing its name with arguments in brackets, and I keep each function small and focused on one job.",
    code: `function add(a, b) {
  return a + b
}

function noReturn() {}

add(2, 3)      // 5
noReturn()     // undefined`,
    result: (() => {
      function add(a, b) {
        return a + b
      }
      function noReturn() {}
      return { add: add(2, 3), noReturn: String(noReturn()) }
    })(),
  },
  {
    title: "How do you create arrays and objects and read values from them?",
    note: "I create an array with square brackets and read items by their index, which starts at 0. I create an object with curly braces as key-value pairs and read values with dot notation, or with brackets when the key is in a variable. length tells me how many items an array has.",
    code: `const fruits = ['apple', 'banana', 'mango']
fruits[0]              // "apple"
fruits[fruits.length - 1]  // "mango"
fruits.length          // 3

const user = { name: 'Anu', age: 22 }
user.name              // "Anu"
const key = 'age'
user[key]              // 22
user.email             // undefined (missing key)`,
    result: (() => {
      const fruits = ['apple', 'banana', 'mango']
      const user = { name: 'Anu', age: 22 }
      const key = 'age'
      return {
        first: fruits[0],
        last: fruits[fruits.length - 1],
        length: fruits.length,
        name: user.name,
        age: user[key],
        email: String(user.email),
      }
    })(),
  },
  {
    title: "What is let?",
    note: "let declares a variable that I can reassign later. It's block-scoped, so it only exists inside the curly braces where I declare it, like inside an if or a loop. I use let for values that change, like counters.",
    code: 'let score = 10\nscore = 20',
    result: score,
  },
  {
    title: "What is const?",
    note: "const declares a variable that can't be reassigned. But if it holds an object or array, I can still change what's inside it, because const only locks the reference, not the contents. I use const by default and switch to let only when I need to reassign.",
    code: "const name = 'Sanu'\nconst user = { age: 25 }\nuser.age = 26",
    result: { name, user },
  },
  {
    title: "How do typeof and instanceof work?",
    note: "typeof returns a string with the type of a value, like 'string', 'number' or 'function'. It says 'object' for arrays and even for null, so I use Array.isArray for arrays and === null for null. instanceof checks whether an object was created by a class or constructor, like a Date or my own class, by looking at its prototype chain.",
    code: "typeof 'hi'          // 'string'\ntypeof 42            // 'number'\ntypeof undefined     // 'undefined'\ntypeof null          // 'object' (an old bug)\ntypeof []            // 'object'\nArray.isArray([])    // true\n[] instanceof Array  // true\nnew Date() instanceof Date  // true\n'hi' instanceof String      // false: primitives aren't instances",
    result: {
      string: typeof 'hi',
      number: typeof 42,
      undefined: typeof undefined,
      null: typeof null,
      array: typeof [],
      isArray: Array.isArray([]),
      arrayInstance: [] instanceof Array,
      dateInstance: new Date() instanceof Date,
      primitiveInstance: 'hi' instanceof String,
    },
  },
  {
    title: "What are comparison and logical operators?",
    note: "Comparison operators like >, <, >= and === return true or false. The logical operators && and || don't always return a boolean though: || returns the first truthy value, and && returns the first falsy value, or the last value if all are truthy. That's why I can write isLoggedIn && <Menu /> in JSX, and ! flips a value to the opposite boolean.",
    code: "const age = 20\nconst hasTicket = true\nage >= 18 && hasTicket     // true\nage < 18 || hasTicket      // true\n!hasTicket                 // false\n\nconst count = 0\ncount || 'default'         // 'default': first truthy\nconst name = 'Anu'\nname && 'Welcome ' + name  // all truthy, so the last value\nconst data = null\ndata && data.name          // null: first falsy",
    result: (() => {
      const age = 20
      const hasTicket = true
      const count = 0
      const name = 'Anu'
      const data = null
      return [
        age >= 18 && hasTicket,
        age < 18 || hasTicket,
        !hasTicket,
        count || 'default',
        name && 'Welcome ' + name,
        data && data.name,
      ]
    })(),
  },
  {
    title: "How does a switch statement work?",
    note: "switch compares one value against several case values using strict equality, so the string '1' won't match case 1. When a case matches, the code runs until a break or return; if there's neither, it falls through into the next case. I use that on purpose to group cases together, and default handles anything that didn't match.",
    code: "function getRole(code) {\n  switch (code) {\n    case 1:\n      return 'admin'\n    case 2:\n    case 3:          // falls through: 2 and 3 share this code\n      return 'editor'\n    default:\n      return 'guest'\n  }\n}\n[1, 2, 3, '1', 9].map(getRole)",
    result: (() => {
      function getRole(code) {
        switch (code) {
          case 1:
            return 'admin'
          case 2:
          case 3:
            return 'editor'
          default:
            return 'guest'
        }
      }
      return [1, 2, 3, '1', 9].map(getRole)
    })(),
  },
  {
    title: "What are for, while and do-while loops, break and continue?",
    note: "A for loop is best when I know how many times to repeat, and a while loop repeats as long as a condition is true. do-while checks the condition after the body, so it always runs at least once. Inside any loop, continue skips to the next round and break stops the loop completely.",
    code: "const evens = []\nfor (let i = 1; i <= 10; i++) {\n  if (i % 2 !== 0) continue   // skip odd numbers\n  if (i > 8) break            // stop the loop\n  evens.push(i)\n}\n\nlet n = 3\nwhile (n > 0) n--             // repeats while true\n\nlet runs = 0\ndo { runs++ } while (runs < 0)   // false, but it still runs once",
    result: (() => {
      const evens = []
      for (let i = 1; i <= 10; i++) {
        if (i % 2 !== 0) continue
        if (i > 8) break
        evens.push(i)
      }
      let n = 3
      while (n > 0) n--
      let runs = 0
      do {
        runs++
      } while (runs < 0)
      return { evens, n, runs }
    })(),
  },
  {
    title: "What is an arrow function?",
    note: "An arrow function is a shorter way to write a function using =>. If the body is a single expression, it returns that value automatically without the return keyword. I use them a lot for callbacks like map and filter.",
    code: 'const add = (a, b) => a + b\nadd(2, 3)',
    result: add(2, 3),
  },
  {
    title: "What are template literals?",
    note: "Template literals are strings written with backticks instead of quotes. I can put any variable or expression inside ${} and it gets inserted into the string, and they can also span multiple lines. They're much cleaner than joining strings with plus signs.",
    code: "const name = 'Sanu'\nconst score = 20\n`Hello ${name}, score is ${score}`",
    result: `Hello ${name}, score is ${score}`,
  },
  {
    title: "How do you use escape characters in strings?",
    note: "Inside a string, the backslash starts an escape sequence: \\n is a new line, \\t is a tab, \\' puts a quote of the same kind inside the string, and \\\\ is one real backslash. \\u followed by a code gives any Unicode character. Note that JSON output shows a backslash as \\\\ again, but the length proves it's a single character; often I just switch quote types or use a template literal instead of escaping.",
    code: String.raw`const quote = 'It\'s easy'       // \' escapes the quote
const path = 'C:\\Users\\Anu'    // \\ is one backslash
const lines = 'Line 1\nLine 2'   // \n is a new line
const heart = '\u2764'           // Unicode escape

quote
path.length                      // 12: each \\ counts as 1
lines.split('\n')
'Name\tAge'.includes('\t')       // \t is a tab
heart`,
    result: (() => {
      const quote = 'It\'s easy'
      const path = 'C:\\Users\\Anu'
      const lines = 'Line 1\nLine 2'
      return {
        quote,
        pathLength: path.length,
        lines: lines.split('\n'),
        hasTab: 'Name\tAge'.includes('\t'),
        heart: '\u2764',
      }
    })(),
  },
  {
    title: "What is the spread operator with arrays?",
    note: "The spread operator, three dots, expands an array into its individual items. I use it to copy an array or combine several arrays into a new one, without changing the originals. That's important in React, where state must not be changed directly.",
    code: 'const a = [1, 2]\nconst b = [3, 4]\nconst all = [...a, ...b, 5]',
    result: [...[1, 2], ...[3, 4], 5],
  },
  {
    title: "What is the spread operator with objects?",
    note: "With objects, spread copies all the properties into a new object. If I add a property after the spread, it overrides or adds to the copy. I use it all the time to update React state, like { ...user, city: 'Kochi' }.",
    code: "const user = { age: 26 }\nconst newUser = { ...user, city: 'Kochi' }",
    result: { ...user, city: 'Kochi' },
  },
  {
    title: "What happens when you spread a string?",
    note: "A string is iterable, so spreading it gives an array of its characters. Combined with Set, it's a quick way to get the unique letters, and spreading into Math.max works on a string of digits too. Spread also splits by real characters, so an emoji stays in one piece, while length and split('') count it as two UTF-16 units.",
    code: `const word = 'hello'
const letters = [...word]
letters
const unique = [...new Set(word)].join('')
unique                      // 'helo'
Math.max(...'3172')         // each digit becomes an argument

const text = 'hi👋'
text.length                 // 4: the emoji takes 2 code units
const chars = [...text]
chars.length                // 3: spread keeps the emoji whole`,
    result: (() => {
      const word = 'hello'
      const text = 'hi👋'
      return {
        letters: [...word],
        unique: [...new Set(word)].join(''),
        max: Math.max(...'3172'),
        length: text.length,
        spreadLength: [...text].length,
      }
    })(),
  },
  {
    title: "What are rest parameters?",
    note: "Rest parameters use the same three dots, but in a function's parameter list, to collect any number of arguments into a real array. So spread expands values, and rest collects them. It has to be the last parameter.",
    code: 'const sum = (...nums) => nums.reduce((a, b) => a + b, 0)\nsum(1, 2, 3, 4)',
    result: ((...nums) => nums.reduce((a, b) => a + b, 0))(1, 2, 3, 4),
  },
  {
    title: "What is destructuring?",
    note: "Destructuring lets me pull values out of an array or object into separate variables in one line. Arrays are matched by position and objects by property name. I use it a lot with React props and hooks, like const [count, setCount] = useState(0).",
    code: "const fruits = ['apple', 'banana', 'mango']\nconst [first, second] = fruits\n\nconst person = { id: 1, name: 'Anu', age: 22 }\nconst { name, age } = person",
    result: (() => {
      const [first, second] = fruits
      const { name, age } = people[0]
      return { first, second, name, age }
    })(),
  },
  {
    title: "How do default values and rest work in array destructuring?",
    note: "In array destructuring I can give each variable a default with =, and it's used only when the value is undefined, not when it's null. I can skip positions with an empty comma, and collect the remaining items with ...rest, which must come last. This is handy for functions that return an array, like React's useState.",
    code: `const [a = 1, b = 2, c = 3] = [10, undefined, null]
a      // 10: value was given
b      // 2: undefined uses the default
c      // null: null does NOT use the default

const [first, , third = 'none'] = ['x', 'y']   // skip with a comma
first
third

const [head, ...rest] = [1, 2, 3, 4]
head
rest`,
    result: (() => {
      const [a = 1, b = 2, c = 3] = [10, undefined, null]
      const [first, , third = 'none'] = ['x', 'y']
      const [head, ...rest] = [1, 2, 3, 4]
      return { a, b, c, first, third, head, rest }
    })(),
  },
  {
    title: "How do you add, update and remove items in an array?",
    note: "Arrays are mutable, so I can change them in place. push adds to the end and unshift to the start; pop removes from the end and shift from the start, and both return the removed item. I update an item by assigning to its index, and splice can remove or insert anywhere. In React state I don't mutate like this; I create a new array with spread, map or filter instead.",
    code: `const nums = [10, 20, 30]
nums.push(40)       // add to end    -> [10, 20, 30, 40]
nums.unshift(5)     // add to start  -> [5, 10, 20, 30, 40]
nums[1] = 11        // update by index
nums.pop()          // remove from end, returns 40
nums.shift()        // remove from start, returns 5
nums.splice(1, 1)   // remove 1 item at index 1
nums                // [11, 30]

// Without mutating (React style)
const added = [...nums, 50]
const removed = nums.filter((n) => n !== 11)`,
    result: (() => {
      const nums = [10, 20, 30]
      nums.push(40)
      nums.unshift(5)
      const afterAdd = [...nums]
      nums[1] = 11
      const last = nums.pop()
      const first = nums.shift()
      nums.splice(1, 1)
      return {
        afterAdd,
        last,
        first,
        afterRemove: nums,
        added: [...nums, 50],
        removed: nums.filter((n) => n !== 11),
      }
    })(),
  },
  {
    title: "How do you add, update and delete properties in an object?",
    note: "I add or update a property with dot or bracket notation; if the key exists it's updated, otherwise it's added. Brackets are needed when the key is in a variable. I remove a property with the delete operator, and check if it exists with the in operator or hasOwn. In React state, I create a new object with spread instead of changing it.",
    code: `const user = { name: 'Anu', age: 22 }
user.city = 'Kochi'      // add
user.age = 23            // update
const key = 'role'
user[key] = 'dev'        // bracket notation with a variable
delete user.city         // delete

'city' in user                // false
Object.hasOwn(user, 'role')   // true
const updated = { ...user, age: 24 }   // React style: a new object`,
    result: (() => {
      const user = { name: 'Anu', age: 22 }
      user.city = 'Kochi'
      user.age = 23
      const key = 'role'
      user[key] = 'dev'
      delete user.city
      return {
        user,
        hasCity: 'city' in user,
        hasRole: Object.hasOwn(user, 'role'),
        updated: { ...user, age: 24 },
      }
    })(),
  },
  {
    title: "What does map do?",
    note: "map loops over an array, runs a function on each item, and returns a new array with the results. The new array is always the same length, and the original isn't changed. In React, I use map to render lists.",
    code: 'const numbers = [5, 2, 8, 1, 9]\nnumbers.map((n) => n * 2)',
    result: numbers.map((n) => n * 2),
  },
  {
    title: "What does filter do?",
    note: "filter returns a new array with only the items for which my function returns true. The original array stays the same. I use it for things like search results or removing an item from a list.",
    code: 'const numbers = [5, 2, 8, 1, 9]\nnumbers.filter((n) => n > 4)',
    result: numbers.filter((n) => n > 4),
  },
  {
    title: "What does find do?",
    note: "find returns the first item that matches my condition, and stops searching as soon as it finds it. If nothing matches, it returns undefined. I use it when I need one item, like finding a user by id.",
    code: "const people = [\n  { id: 1, name: 'Anu', age: 22 },\n  { id: 2, name: 'Ravi', age: 30 },\n  { id: 3, name: 'Meera', age: 27 },\n]\npeople.find((p) => p.age > 25)",
    result: people.find((p) => p.age > 25),
  },
  {
    title: "What does findIndex do?",
    note: "findIndex works like find, but it returns the position of the first match instead of the item itself. If nothing matches, it returns -1. I use it when I need to update or remove an item at that position.",
    code: "const people = [\n  { id: 1, name: 'Anu', age: 22 },\n  { id: 2, name: 'Ravi', age: 30 },\n  { id: 3, name: 'Meera', age: 27 },\n]\npeople.findIndex((p) => p.name === 'Meera')",
    result: people.findIndex((p) => p.name === 'Meera'),
  },
  {
    title: "What do findLast and findLastIndex do?",
    note: "They work like find and findIndex, but search from the end of the array, so I get the last match instead of the first. findLast returns undefined and findLastIndex returns -1 when nothing matches. They're newer, from ES2023, and handy for things like getting the most recent message that matches a condition.",
    code: 'const nums = [5, 12, 8, 130, 44]\nnums.find((n) => n > 10)           // 12\nnums.findLast((n) => n > 10)       // 44\nnums.findLastIndex((n) => n > 10)  // 4',
    result: (() => {
      const nums = [5, 12, 8, 130, 44]
      return {
        find: nums.find((n) => n > 10),
        findLast: nums.findLast((n) => n > 10),
        findLastIndex: nums.findLastIndex((n) => n > 10),
      }
    })(),
  },
  {
    title: "What does reduce do?",
    note: "reduce goes through the array and combines all the items into a single value, like a total. It takes a callback with an accumulator and the current item, plus a starting value. I use it for sums, counting, and grouping data.",
    code: 'const numbers = [5, 2, 8, 1, 9]\nnumbers.reduce((total, n) => total + n, 0)',
    result: numbers.reduce((total, n) => total + n, 0),
  },
  {
    title: "What does forEach do?",
    note: "forEach runs a function for every item in the array, but it doesn't return anything, it always gives undefined. I use it for side effects like logging or pushing into another array. If I need a new array, I use map instead.",
    code: "const fruits = ['apple', 'banana', 'mango']\nconst out = []\nfruits.forEach((f) => out.push(f.toUpperCase()))",
    result: (() => {
      const out = []
      fruits.forEach((f) => out.push(f.toUpperCase()))
      return out
    })(),
  },
  {
    title: "What are some and every?",
    note: "some returns true if at least one item passes the test, and every returns true only if all items pass. Both stop early as soon as the answer is known. I use them for checks like 'is any field empty?' or 'are all items selected?'.",
    code: 'const numbers = [5, 2, 8, 1, 9]\nnumbers.some((n) => n > 8)\nnumbers.every((n) => n > 0)',
    result: { some: numbers.some((n) => n > 8), every: numbers.every((n) => n > 0) },
  },
  {
    title: "What does includes do?",
    note: "includes checks whether an array contains a value, or whether a string contains some text, and returns true or false. It's simpler and more readable than checking indexOf against -1.",
    code: "const fruits = ['apple', 'banana', 'mango']\nfruits.includes('mango')\n'hello world'.includes('world')",
    result: [fruits.includes('mango'), 'hello world'.includes('world')],
  },
  {
    title: "What does slice do?",
    note: "slice returns a copy of part of an array, from the start index up to, but not including, the end index. It doesn't change the original array. With no arguments, it copies the whole array.",
    code: 'const numbers = [5, 2, 8, 1, 9]\nnumbers.slice(1, 3)  // index 1 and 2',
    result: numbers.slice(1, 3),
  },
  {
    title: "What do at and fill do?",
    note: "at returns the item at an index, and it accepts negative numbers, so at(-1) gives the last item instead of writing arr[arr.length - 1]. fill sets items to a value, optionally between a start and end index, and it changes the original array. One trap: fill([]) puts the same array in every slot, so for separate arrays I use Array.from with a function.",
    code: "const arr = [10, 20, 30]\narr.at(0)     // 10\narr.at(-1)    // 30\n\nnew Array(3).fill(0)          // [0, 0, 0]\n[1, 2, 3, 4].fill(9, 1, 3)    // fill index 1 and 2\n\nconst grid = Array.from({ length: 2 }, () => [])",
    result: (() => {
      const arr = [10, 20, 30]
      return {
        first: arr.at(0),
        last: arr.at(-1),
        zeros: new Array(3).fill(0),
        partial: [1, 2, 3, 4].fill(9, 1, 3),
        grid: Array.from({ length: 2 }, () => []),
      }
    })(),
  },
  {
    title: "What does splice do?",
    note: "splice changes the original array: it can remove items, add items, or both, at a given index, and it returns the removed items. Because it mutates the array, I avoid it on React state and use filter or slice instead.",
    code: 'const arr = [1, 2, 3, 4]\narr.splice(1, 2)  // remove 2 items from index 1',
    result: (() => {
      const arr = [1, 2, 3, 4]
      const removed = arr.splice(1, 2)
      return { removed, arr }
    })(),
  },
  {
    title: "How do you sort numbers?",
    note: "By default sort compares items as strings, so numbers end up in the wrong order. For numbers I pass a compare function, (a, b) => a - b for ascending. sort also changes the original array, so I copy it first with spread.",
    code: 'const numbers = [5, 2, 8, 1, 9]\n[...numbers].sort((a, b) => a - b)',
    result: [...numbers].sort((a, b) => a - b),
  },
  {
    title: "How does sort work with strings?",
    note: "With no compare function, sort compares strings by their character codes, so uppercase letters come before lowercase ones. For proper alphabetical order, I use localeCompare in the compare function. Like with numbers, I copy the array first if I need the original.",
    code: "['mango', 'apple', 'Banana'].sort()\n['mango', 'apple', 'Banana'].sort((a, b) => a.localeCompare(b))",
    result: [
      ['mango', 'apple', 'Banana'].sort(),
      ['mango', 'apple', 'Banana'].sort((a, b) => a.localeCompare(b)),
    ],
  },
  {
    title: "What are toSorted, toReversed and with?",
    note: "These are newer ES2023 methods that do the same job as sort, reverse and index assignment, but return a new array instead of changing the original. That makes them perfect for React state, because I don't need to copy with spread first. They're supported in all modern browsers.",
    code: "const nums = [3, 1, 2]\nconst sorted = nums.toSorted((a, b) => a - b)\nconst reversed = nums.toReversed()\nconst replaced = nums.with(0, 99)   // copy with index 0 changed\nnums   // original is untouched",
    result: (() => {
      const nums = [3, 1, 2]
      const sorted = nums.toSorted((a, b) => a - b)
      const reversed = nums.toReversed()
      const replaced = nums.with(0, 99)
      return { sorted, reversed, replaced, nums }
    })(),
  },
  {
    title: "What does Array.from do?",
    note: "Array.from creates a real array from something array-like or iterable, such as a string, a Set, or a NodeList from the DOM. I can also give it a length and a mapping function to generate an array, like the numbers 1 to 5.",
    code: "Array.from('abc')\nArray.from({ length: 5 }, (_, i) => i + 1)",
    result: [Array.from('abc'), Array.from({ length: 5 }, (_, i) => i + 1)],
  },
  {
    title: "What are the common string methods?",
    note: "Strings are immutable, so every string method returns a new string. The ones I use most are toUpperCase and toLowerCase, trim to remove spaces from both ends, padStart to add leading characters like zeros, repeat, replaceAll to replace every match, and at(-1) to read the last character.",
    code: "const s = '  Hello World  '\ns.trim()                         // 'Hello World'\ns.trim().toUpperCase()\ns.trim().toLowerCase()\n'5'.padStart(3, '0')             // '005'\n'ab'.repeat(3)\n'a-b-c'.replaceAll('-', '+')\n'hello'.at(-1)                   // last character",
    result: (() => {
      const s = '  Hello World  '
      return [
        s.trim(),
        s.trim().toUpperCase(),
        s.trim().toLowerCase(),
        '5'.padStart(3, '0'),
        'ab'.repeat(3),
        'a-b-c'.replaceAll('-', '+'),
        'hello'.at(-1),
      ]
    })(),
  },
  {
    title: "What are startsWith and endsWith?",
    note: "startsWith checks if a string begins with some text, and endsWith checks if it ends with it. Both return true or false and are case-sensitive. I use them for things like checking a URL protocol or a file extension.",
    code: "'javascript'.startsWith('java')\n'photo.png'.endsWith('.png')",
    result: ['javascript'.startsWith('java'), 'photo.png'.endsWith('.png')],
  },
  {
    title: "What do split and join do?",
    note: "split breaks a string into an array using a separator, and join does the opposite, combining an array into a string with a separator. Together they're very common in string questions, like reversing words.",
    code: "const fruits = ['apple', 'banana', 'mango']\n'a-b-c'.split('-')\nfruits.join(', ')",
    result: ['a-b-c'.split('-'), fruits.join(', ')],
  },
  {
    title: "What does indexOf do?",
    note: "indexOf returns the position of the first match of a value in an array or string, or -1 if it's not there. It uses strict equality, so it can't find objects by their content. For a simple yes or no, I prefer includes.",
    code: "const fruits = ['apple', 'banana', 'mango']\nfruits.indexOf('banana')",
    result: fruits.indexOf('banana'),
  },
  {
    title: "What does concat do?",
    note: "concat joins two or more arrays into a new array without changing the originals. Today I usually use the spread operator instead, because it reads more clearly, but they do the same thing.",
    code: '[1, 2].concat([3, 4])',
    result: [1, 2].concat([3, 4]),
  },
  {
    title: "What does flat do?",
    note: "flat creates a new array with nested arrays flattened into it. By default it goes one level deep, and I can pass a depth, or Infinity to flatten everything.",
    code: '[1, [2, 3], [4, [5]]].flat(Infinity)',
    result: [1, [2, 3], [4, [5]]].flat(Infinity),
  },
  {
    title: "What are the common number methods?",
    note: "toFixed rounds a number to a set number of decimals, but it returns a string, which I often forget. parseInt and parseFloat read a number from the start of a string and stop at the first invalid character, while Number() needs the whole string to be valid or it gives NaN. Number.isInteger checks for whole numbers, and I always pass 10 as the radix to parseInt.",
    code: "(3.14159).toFixed(2)      // '3.14' (a string!)\nparseInt('42px', 10)      // 42\nparseFloat('3.5kg')       // 3.5\nNumber('42px')            // NaN: whole string must be a number\nNumber('42')              // 42\nNumber.isInteger(5)       // true\nNumber.isInteger(5.5)     // false",
    result: [
      (3.14159).toFixed(2),
      parseInt('42px', 10),
      parseFloat('3.5kg'),
      String(Number('42px')),
      Number('42'),
      Number.isInteger(5),
      Number.isInteger(5.5),
    ],
  },
  {
    title: "What are Number.MAX_SAFE_INTEGER and Number.EPSILON?",
    note: "Numbers are 64-bit floating point, so whole numbers are only exact up to Number.MAX_SAFE_INTEGER, which is 2 to the power 53 minus 1; above that, adding 1 or 2 can give the wrong answer. I check with Number.isSafeInteger and use BigInt, with an n suffix, for bigger values like database IDs. Number.EPSILON is the tiny gap after 1, and I use it to compare decimals like 0.1 + 0.2 safely.",
    code: `Number.MAX_SAFE_INTEGER               // 2 ** 53 - 1
Number.MAX_SAFE_INTEGER + 2           // wrong: ends in 2, not 3
Number.isSafeInteger(2 ** 53)         // false
9007199254740993n + 2n                // BigInt stays exact

Number.EPSILON
0.1 + 0.2 === 0.3                     // false
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON   // true`,
    result: {
      maxSafe: Number.MAX_SAFE_INTEGER,
      maxSafePlus2: Number.MAX_SAFE_INTEGER + 2,
      isSafe: Number.isSafeInteger(2 ** 53),
      bigint: String(9007199254740993n + 2n) + 'n',
      epsilon: Number.EPSILON,
      directCompare: 0.1 + 0.2 === 0.3,
      epsilonCompare: Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON,
    },
  },
  {
    title: "How do you format money and numbers with Intl.NumberFormat?",
    note: "Intl.NumberFormat formats numbers for a locale, with the right separators and currency symbol, so I never build currency strings by hand. en-IN groups digits in lakhs and crores, while de-DE uses dots and a comma for decimals. It also does compact numbers like 1.2M and percentages, and toLocaleString is a shortcut for the same thing.",
    code: `const price = 1234567.891

new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price)
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price)
new Intl.NumberFormat('en-US', { notation: 'compact' }).format(price)
new Intl.NumberFormat('en-US', { style: 'percent' }).format(0.256)
price.toLocaleString('en-IN')`,
    result: (() => {
      const price = 1234567.891
      return [
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price),
        new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price),
        new Intl.NumberFormat('en-US', { notation: 'compact' }).format(price),
        new Intl.NumberFormat('en-US', { style: 'percent' }).format(0.256),
        price.toLocaleString('en-IN'),
      ]
    })(),
  },
  {
    title: "How do you convert between strings, numbers and arrays?",
    note: "To get a string I use String(value) or template literals, and to get a number I use Number(value) or the unary plus, like +'7'. To turn a string into an array of characters I use split(''), spread or Array.from, and join('') goes back. A classic trick is getting the digits of a number with String(n).split('').map(Number).",
    code: "String(42)                          // '42'\nNumber('7') + +'3'                  // 10\n'hello'.split('')                   // ['h','e','l','l','o']\n[...'hi']                           // ['h','i']\n['a', 'b', 'c'].join('')            // 'abc'\nString([1, 2, 3])                   // '1,2,3'\nString(1234).split('').map(Number)  // [1, 2, 3, 4]",
    result: [
      String(42),
      Number('7') + +'3',
      'hello'.split(''),
      [...'hi'],
      ['a', 'b', 'c'].join(''),
      String([1, 2, 3]),
      String(1234).split('').map(Number),
    ],
  },
  {
    title: "What are the common Math methods?",
    note: "Math.round rounds to the nearest whole number, Math.floor always rounds down and Math.ceil always rounds up, while Math.trunc just cuts off the decimals. Math.abs, Math.sqrt and the ** operator cover most other needs. For a random whole number between 1 and 6, I use Math.floor(Math.random() * 6) + 1.",
    code: "Math.round(4.5)    // 5\nMath.round(-4.5)   // -4 (rounds toward +Infinity on .5)\nMath.floor(4.7)    // 4\nMath.ceil(4.1)     // 5\nMath.trunc(-4.7)   // -4\nMath.abs(-5)       // 5\nMath.sqrt(16)      // 4\n2 ** 3             // 8\nconst dice = Math.floor(Math.random() * 6) + 1\ndice >= 1 && dice <= 6   // true",
    result: (() => {
      const dice = Math.floor(Math.random() * 6) + 1
      return [
        Math.round(4.5),
        Math.round(-4.5),
        Math.floor(4.7),
        Math.ceil(4.1),
        Math.trunc(-4.7),
        Math.abs(-5),
        Math.sqrt(16),
        2 ** 3,
        dice >= 1 && dice <= 6,
      ]
    })(),
  },
  {
    title: "How do you work with dates?",
    note: "I create a date with new Date(year, monthIndex, day), and the big gotcha is that months start from 0, so January is 0. getDay gives the weekday, with Sunday as 0. To add days I use setDate with getDate() + n, and it rolls over into the next month automatically. Subtracting two dates gives milliseconds, so I divide by 86400000 to get days.",
    code: "const d = new Date(2024, 0, 15)   // 15 Jan 2024 (month 0 = Jan)\nd.getFullYear()   // 2024\nd.getMonth()      // 0\nd.getDate()       // 15\nd.getDay()        // 1 = Monday\n\nd.setDate(d.getDate() + 20)       // rolls into February\nd.getMonth(), d.getDate()         // 1, 4\n\nconst days = (new Date(2024, 2, 1) - new Date(2024, 1, 1)) / 86400000",
    result: (() => {
      const d = new Date(2024, 0, 15)
      const before = {
        year: d.getFullYear(),
        month: d.getMonth(),
        date: d.getDate(),
        day: d.getDay(),
      }
      d.setDate(d.getDate() + 20)
      const days = (new Date(2024, 2, 1) - new Date(2024, 1, 1)) / 86400000
      return { ...before, after20Days: [d.getMonth(), d.getDate()], daysInFeb2024: days }
    })(),
  },
  {
    title: "How do you format dates with Intl.DateTimeFormat?",
    note: "Instead of building date strings by hand, I use Intl.DateTimeFormat or toLocaleDateString with a locale and options like dateStyle, or separate day, month and year settings. The timeZone option shows the same moment in any time zone, which matters because a Date is stored in UTC. Intl.RelativeTimeFormat gives friendly text like 'yesterday' or 'in 3 days'.",
    code: `const date = new Date(Date.UTC(2024, 0, 15, 9, 30))   // 15 Jan 2024, 09:30 UTC

new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeZone: 'UTC' }).format(date)
new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(date)
date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })
new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-1, 'day')
new Intl.RelativeTimeFormat('en').format(3, 'day')`,
    result: (() => {
      const date = new Date(Date.UTC(2024, 0, 15, 9, 30))
      return [
        new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeZone: 'UTC' }).format(date),
        new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(date),
        date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }),
        date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }),
        new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-1, 'day'),
        new Intl.RelativeTimeFormat('en').format(3, 'day'),
      ]
    })(),
  },
  {
    title: "What are Object.keys, values and entries?",
    note: "Object.keys returns an array of an object's property names, Object.values returns the values, and Object.entries returns key-value pairs. They let me use array methods like map and filter on an object's data.",
    code: "const car = { brand: 'Kia', year: 2024 }\nObject.keys(car)\nObject.values(car)\nObject.entries(car)",
    result: (() => {
      const car = { brand: 'Kia', year: 2024 }
      return [Object.keys(car), Object.values(car), Object.entries(car)]
    })(),
  },
  {
    title: "What do Object.assign and Object.freeze do?",
    note: "Object.assign copies properties from one or more source objects into a target object, and later sources overwrite earlier ones; I pass an empty object as the target to get a new merged object. Object.freeze makes an object read-only, so changes are ignored, or throw an error in strict mode like here in an ES module. Both are shallow, so nested objects are still shared and changeable.",
    code: "const defaults = { theme: 'light', lang: 'en' }\nconst custom = { theme: 'dark' }\nconst settings = Object.assign({}, defaults, custom)\n\nconst config = Object.freeze({ api: '/v1' })\ntry {\n  config.api = '/v2'   // throws in strict mode\n} catch (e) {\n  console.log(e.name)  // TypeError\n}\nObject.isFrozen(config)   // true",
    result: (() => {
      const defaults = { theme: 'light', lang: 'en' }
      const custom = { theme: 'dark' }
      const settings = Object.assign({}, defaults, custom)
      const config = Object.freeze({ api: '/v1' })
      let error = null
      try {
        config.api = '/v2'
      } catch (e) {
        error = e.name
      }
      return { settings, config, error, isFrozen: Object.isFrozen(config) }
    })(),
  },
  {
    title: "What do Object.groupBy and Map.groupBy do?",
    note: "Object.groupBy takes an array and a callback, and returns an object where each key is what the callback returned and each value is the list of items with that key. Map.groupBy does the same but returns a Map, so the keys can be any type, like booleans or objects. It replaces the reduce pattern I used to write for grouping.",
    code: `const people = [
  { name: 'Anu', age: 22 },
  { name: 'Ravi', age: 30 },
  { name: 'Meera', age: 27 },
]
const byGroup = Object.groupBy(people, (p) => (p.age < 25 ? 'young' : 'adult'))
byGroup.young
byGroup.adult.map((p) => p.name)

const byAdult = Map.groupBy(people, (p) => p.age >= 25)   // keys can be booleans
byAdult.get(true).length`,
    result: (() => {
      const byGroup = Object.groupBy(people, (p) => (p.age < 25 ? 'young' : 'adult'))
      const byAdult = Map.groupBy(people, (p) => p.age >= 25)
      return {
        young: byGroup.young,
        adultNames: byGroup.adult.map((p) => p.name),
        adultCount: byAdult.get(true).length,
      }
    })(),
  },
  {
    title: "What are Set and Map?",
    note: "A Set stores unique values, so adding a duplicate does nothing, and has() checks membership quickly. A Map stores key-value pairs where the key can be any type, and it keeps insertion order. Both have a size property, and I turn them into arrays with spread, which is also how I display them, since JSON.stringify shows them as {}.",
    code: "const tags = new Set(['js', 'react', 'js'])\ntags.add('css')\ntags.has('react')   // true\ntags.size           // 3\n[...tags]\n\nconst ages = new Map()\nages.set('Anu', 22).set('Ravi', 30)\nages.get('Anu')     // 22\nages.size           // 2\n[...ages]           // [['Anu', 22], ['Ravi', 30]]",
    result: (() => {
      const tags = new Set(['js', 'react', 'js'])
      tags.add('css')
      const ages = new Map()
      ages.set('Anu', 22).set('Ravi', 30)
      return {
        hasReact: tags.has('react'),
        setSize: tags.size,
        tags: [...tags],
        anu: ages.get('Anu'),
        mapSize: ages.size,
        ages: [...ages],
      }
    })(),
  },
  {
    title: "What are optional chaining and nullish coalescing?",
    note: "Optional chaining, ?., safely reads a nested property: if something along the way is null or undefined, it returns undefined instead of throwing an error. The ?? operator gives a default value only when the left side is null or undefined. I often use them together, like user?.address?.city ?? 'No city'.",
    code: "const emp = { address: null }\nemp.address?.city ?? 'No city'",
    result: (() => {
      const emp = { address: null }
      return emp.address?.city ?? 'No city'
    })(),
  },
  {
    title: "How does optional chaining work with function calls and arrays?",
    note: "Optional chaining also works for calling methods and reading array items: obj.method?.() only calls the method if it exists, and arr?.[0] only reads the index if the array exists. If anything on the left is null or undefined, the whole chain stops and returns undefined. I use it for optional callback props in React, like onClose?.().",
    code: `const user = {
  name: 'Anu',
  greet() { return 'Hi ' + this.name },
  orders: [{ id: 7 }],
}
const guest = null

user.greet?.()             // calls it: 'Hi Anu'
user.logout?.()            // no such method: undefined, no error
user.orders?.[0]?.id       // 7
guest?.orders?.[0]?.id     // undefined
user.orders?.[5]?.id ?? 'no order'`,
    result: (() => {
      const user = {
        name: 'Anu',
        greet() {
          return 'Hi ' + this.name
        },
        orders: [{ id: 7 }],
      }
      const guest = null
      return [
        user.greet?.(),
        String(user.logout?.()),
        user.orders?.[0]?.id,
        String(guest?.orders?.[0]?.id),
        user.orders?.[5]?.id ?? 'no order',
      ]
    })(),
  },
  {
    title: "What is the ternary operator?",
    note: "The ternary operator is a short if/else that returns a value: condition ? valueIfTrue : valueIfFalse. I use it for simple choices, especially inside JSX. For more complex logic, I use a normal if statement so it stays readable.",
    code: "const square = (n) => n * n\nsquare(4) > 10 ? 'big' : 'small'",
    result: square(4) > 10 ? 'big' : 'small',
  },
]
