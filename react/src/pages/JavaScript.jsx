import { useState, useEffect } from 'react'
import CodeBlock from '../components/CodeBlock.jsx'
import { basics } from './jsBasicsData.js'
import LevelSections from '../components/LevelSections.jsx'
import topics from './topics/javascriptTopics.js'
import basicsTopics from './topics/jsBasicsTopics.js'
import { runCode, addConsoleLogs } from '../lib/runJs.js'
import TryIt from '../tryit/TryIt.jsx'
import TryItButton from '../tryit/TryItButton.jsx'

// Each question has a simple answer and example code.
// The code is really run, and whatever it console.logs is shown as the output.

const questions = [
  {
    q: 'Difference between var, let and const?',
    level: 'Basics',
    a: "var is function-scoped, can be redeclared, and is hoisted with the value undefined. let and const are block-scoped, so they only exist inside the curly braces where they're declared. let can be reassigned and const can't. I use const by default, let when the value needs to change, and I avoid var.",
    code: `if (true) {
  var a = 1
  let b = 2
}
console.log(a)          // 1: var leaks out of the block
console.log(typeof b)   // undefined: let stays inside

const c = 3
try { c = 4 } catch (e) { console.log(e.message) }`,
  },
  {
    q: 'What is hoisting?',
    level: 'Intermediate',
    a: "Hoisting means JavaScript moves declarations to the top of their scope before the code runs. var variables are hoisted and set to undefined, which is why I get undefined instead of an error. Function declarations are hoisted completely, so I can call them before the line where they're written.",
    code: `console.log(x)       // undefined, not an error
var x = 5

console.log(greet())  // works before the function line
function greet() {
  return 'Hello'
}`,
  },
  {
    q: 'Hoisting puzzle: function declarations vs var?',
    level: 'Intermediate',
    a: "Function declarations are hoisted with their whole body, but var only hoists the name, set to undefined, and the assignment stays on its own line. So I can call a function declaration before its line, but a function stored in a var is still undefined there. Inside a function, a local var shadows the outer one from the very first line, which is why show() logs undefined instead of 1. I avoid these traps by using let and const and declaring things before I use them.",
    code: `console.log(typeof hoisted)   // function: fully hoisted
console.log(typeof notYet)    // undefined: only the name
function hoisted() {}
var notYet = function () {}

var x = 1
function show() {
  console.log(x)   // undefined: the inner var x is hoisted
  var x = 2
}
show()`,
  },
  {
    q: 'What is the Temporal Dead Zone (TDZ)?',
    level: 'Intermediate',
    a: "let and const are hoisted too, but they aren't initialized. The time between the start of the block and the declaration line is called the Temporal Dead Zone. If I access the variable in that zone, I get a ReferenceError instead of undefined.",
    code: `try {
  console.log(y)
} catch (e) {
  console.log(e.name + ': ' + e.message)
}
let y = 10`,
  },
  {
    q: 'Difference between == and ===?',
    level: 'Basics',
    a: "== is loose equality: it converts both values to the same type before comparing. === is strict equality: it compares both the value and the type without any conversion. I always use === to avoid surprising bugs.",
    code: `console.log(5 == '5')    // true  (string converted to number)
console.log(5 === '5')   // false (different types)
console.log(0 == false)  // true
console.log(null == undefined)   // true
console.log(null === undefined)  // false`,
  },
  {
    q: 'Difference between null and undefined?',
    level: 'Basics',
    a: "undefined means a variable has been declared but not given a value, and JavaScript sets it automatically. null is a value I assign on purpose to say there is no value. One famous quirk is that typeof null returns 'object', which is a long-standing bug in the language.",
    code: `let a
let b = null
console.log(a)          // undefined
console.log(b)          // null
console.log(typeof a)   // undefined
console.log(typeof b)   // object (a famous JS bug)`,
  },
  {
    q: 'What are the data types in JavaScript?',
    level: 'Basics',
    a: "JavaScript has seven primitive types: string, number, boolean, undefined, null, bigint and symbol. Everything else is an object, including arrays and functions. To check for an array, I use Array.isArray, because typeof returns 'object' for arrays.",
    code: `console.log(typeof 'hi')
console.log(typeof 42)
console.log(typeof true)
console.log(typeof undefined)
console.log(typeof 10n)
console.log(typeof Symbol('id'))
console.log(typeof [1, 2])        // arrays are objects
console.log(Array.isArray([1, 2]))
console.log(typeof function () {})`,
  },
  {
    q: 'What are truthy and falsy values?',
    level: 'Basics',
    a: "Falsy values behave like false in a condition. There are only a few: false, 0, an empty string, null, undefined and NaN. Everything else is truthy, including an empty array and an empty object, which surprises a lot of people.",
    code: `// Boolean() shows if a value is truthy (true) or falsy (false)
console.log(Boolean(false), Boolean(0), Boolean(''))
console.log(Boolean(null), Boolean(undefined), Boolean(NaN))

console.log(Boolean([]), Boolean({}), Boolean('hi'), Boolean(1))

if ('hello') console.log('"hello" is truthy')`,
  },
  {
    q: 'What is a closure?',
    level: 'Intermediate',
    a: "A closure is a function that remembers the variables from the scope where it was created, even after the outer function has finished running. I use closures for data privacy, like a counter whose value can't be changed from outside, and they're also how debounce and memoize work.",
    code: `function counter() {
  let count = 0
  return () => ++count
}

const next = counter()
console.log(next())  // 1
console.log(next())  // 2`,
  },
  {
    q: 'setTimeout inside a loop: var vs let?',
    level: 'Intermediate',
    a: "With var, there's only one variable i shared by all the iterations, so by the time the setTimeout callbacks run, the loop has finished and they all see 3. let creates a new binding for each iteration, so each callback gets its own value: 0, 1 and 2.",
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var', i), 0)
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let', j), 0)
}`,
  },
  {
    q: 'Closures in loops: how do you fix the var version without let?',
    level: 'Intermediate',
    a: "Every function created in a var loop closes over the same single variable, so after the loop they all see its final value. Before let existed, I'd fix it with an IIFE that takes the current value as a parameter, so each callback gets its own copy. Today I simply use let, which creates a new binding for every iteration.",
    code: `const fns = []
for (var i = 0; i < 3; i++) {
  fns.push(() => i)
}
console.log('var:', fns.map((f) => f()))    // all 3

const fixed = []
for (var k = 0; k < 3; k++) {
  ;(function (copy) { fixed.push(() => copy) })(k)
}
console.log('IIFE:', fixed.map((f) => f())) // 0, 1, 2`,
  },
  {
    q: 'How does "this" work in arrow vs regular functions?',
    level: 'Intermediate',
    a: "In a regular function, this depends on how the function is called: if I call user.method(), this is user. Arrow functions don't have their own this; they take it from the surrounding scope. That's why arrow functions are handy for callbacks inside methods, but I don't use them as object methods themselves.",
    code: `const user = {
  name: 'Anu',
  regular() {
    return this.name
  },
  arrow: () => this === user,   // no own this
}
console.log(user.regular())   // Anu
console.log(user.arrow())     // false: this is not user`,
  },
  {
    q: 'What is "this" inside a nested regular function?',
    level: 'Intermediate',
    a: "A nested regular function gets its own this, based on how it's called, so a plain call like inner() doesn't get the object; it gets undefined in strict mode or the global object otherwise. An arrow function has no this of its own, so it uses the outer method's this. Before arrow functions, people saved it in a variable like const self = this, or used call or bind, and I still see that in older code.",
    code: `const user = {
  name: 'Anu',
  greet() {
    function inner() { return this === user }
    const arrow = () => this === user
    console.log('nested function:', inner())   // false
    console.log('arrow function:', arrow())    // true
  },
}
user.greet()`,
  },
  {
    q: 'Difference between call, apply and bind?',
    level: 'Intermediate',
    a: "All three let me set what this refers to. call invokes the function immediately, with the arguments passed one by one. apply also invokes it immediately, but takes the arguments as an array. bind doesn't call the function; it returns a new function with this fixed, which I can call later.",
    code: `function intro(city, country) {
  return this.name + ' from ' + city + ', ' + country
}
const person = { name: 'Ravi' }

console.log(intro.call(person, 'Kochi', 'India'))
console.log(intro.apply(person, ['Pune', 'India']))

const later = intro.bind(person, 'Delhi', 'India')
console.log(later())`,
  },
  {
    q: 'What is the event loop? Guess the order.',
    level: 'Intermediate',
    a: "JavaScript is single-threaded, and the event loop decides what runs next. First, all the synchronous code runs. Then the microtask queue, which holds promise callbacks, is emptied. Only after that does it take a macrotask, like a setTimeout callback. That's why the promise logs before setTimeout, even with a delay of 0.",
    code: `console.log('1. start')

setTimeout(() => console.log('4. setTimeout'), 0)

Promise.resolve().then(() => console.log('3. promise'))

console.log('2. end')`,
  },
  {
    q: 'What is a Promise?',
    level: 'Intermediate',
    a: "A Promise is an object that represents a value that will be available in the future, like the result of an API call. It starts as pending, and then it's either fulfilled with resolve or rejected with reject. I handle the result with .then and errors with .catch.",
    code: `const getUser = (ok) =>
  new Promise((resolve, reject) => {
    setTimeout(() => (ok ? resolve('Meera') : reject('Not found')), 100)
  })

getUser(true).then((user) => console.log('Success:', user))
getUser(false).catch((err) => console.log('Error:', err))`,
  },
  {
    q: 'What is async / await?',
    level: 'Intermediate',
    a: "async/await is a cleaner syntax on top of promises. An async function always returns a promise, and inside it, await pauses until the promise settles, so asynchronous code reads like normal step-by-step code. I handle errors with try/catch.",
    code: `const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function run() {
  console.log('Loading...')
  await wait(100)
  console.log('Done after 100ms')
}
run()`,
  },
  {
    q: 'Promise.all vs Promise.race vs Promise.allSettled?',
    level: 'Intermediate',
    a: "Promise.all waits for all the promises and gives an array of results, but it rejects as soon as any one fails. Promise.race settles with whichever promise finishes first. Promise.allSettled waits for all of them and tells me the status of each, so one failure doesn't break the rest.",
    code: `const p1 = Promise.resolve(1)
const p2 = new Promise((r) => setTimeout(() => r(2), 50))
const p3 = Promise.reject('error')

Promise.all([p1, p2]).then((v) => console.log('all:', v))
Promise.race([p1, p2]).then((v) => console.log('race:', v))
Promise.allSettled([p1, p3]).then((v) => console.log('allSettled:', v))`,
  },
  {
    q: 'Shallow copy vs deep copy?',
    level: 'Intermediate',
    a: "A shallow copy, like with spread or Object.assign, copies only the top level. Nested objects are still shared, so changing them in the copy changes the original too. A deep copy copies every level, and today I use structuredClone for that.",
    code: `const original = { name: 'Anu', address: { city: 'Kochi' } }

const shallow = { ...original }
const deep = structuredClone(original)

shallow.address.city = 'Pune'   // also changes original!
console.log(original.address.city)   // Pune

deep.address.city = 'Delhi'     // original not affected
console.log(original.address.city)   // still Pune`,
  },
  {
    q: 'structuredClone vs JSON.parse(JSON.stringify())?',
    level: 'Intermediate',
    a: "The JSON trick only works for plain data: Dates become strings, Map and Set become empty objects, undefined values and functions are dropped, and circular references throw an error. structuredClone keeps Dates, Maps, Sets and circular references correctly. Neither can copy functions, and structuredClone throws a DataCloneError for them. So I use structuredClone for deep copies and keep JSON for sending data over the network.",
    code: `const original = { date: new Date('2024-01-15'), tags: new Set(['js']) }

const viaJson = JSON.parse(JSON.stringify(original))
console.log('JSON:', typeof viaJson.date, viaJson.tags)   // string {}

const clone = structuredClone(original)
console.log('clone:', clone.date instanceof Date, clone.tags.size)   // true 1`,
  },
  {
    q: 'Why is {} === {} false?',
    level: 'Basics',
    a: "Objects and arrays are compared by reference, not by their content. Two object literals are two separate objects in memory, so they're never equal, even if they look the same. They're only equal when both variables point to the same object.",
    code: `console.log({} === {})
console.log([1, 2] === [1, 2])

const a = { x: 1 }
const b = a          // same reference
console.log(a === b)`,
  },
  {
    q: 'map vs forEach?',
    level: 'Basics',
    a: "Both loop over an array. map returns a new array with the transformed values, so I use it when I need a result, like rendering a list in React. forEach returns undefined and is meant for side effects, like logging or pushing into another array.",
    code: `const nums = [1, 2, 3]
const doubled = nums.map((n) => n * 2)
const result = nums.forEach((n) => n * 2)

console.log(doubled)
console.log(result)`,
  },
  {
    q: 'What is a higher-order function?',
    level: 'Intermediate',
    a: "A higher-order function is a function that takes another function as an argument, or returns a function. map, filter, reduce and setTimeout are all higher-order functions. They let me write reusable, flexible code.",
    code: `function repeat(times, action) {
  for (let i = 1; i <= times; i++) action(i)
}
repeat(3, (n) => console.log('Run', n))

const multiplyBy = (x) => (y) => x * y   // returns a function
const triple = multiplyBy(3)
console.log(triple(5))`,
  },
  {
    q: 'What is currying?',
    level: 'Advanced',
    a: "Currying turns a function that takes several arguments into a chain of functions that each take one argument, so f(a, b, c) becomes f(a)(b)(c). It's useful for creating specialized functions, like making add10 from a general add function.",
    code: `const add = (a) => (b) => (c) => a + b + c

console.log(add(1)(2)(3))

const add10 = add(10)
console.log(add10(5)(5))`,
  },
  {
    q: 'Currying with variable arguments: sum(1)(2)(3)() and a generic curry?',
    level: 'Advanced',
    a: "For an unknown number of calls, I return a function that keeps adding to a running total until it's called with no argument, and then it returns the total. For a generic curry, I compare the collected arguments with fn.length: if there are enough, I call the original function, otherwise I return a function that collects more. That version also allows mixed calls like volume(2, 3)(4).",
    code: `const sum = (a) => (b) => (b === undefined ? a : sum(a + b))
console.log(sum(1)(2)(3)())   // 6

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args)
    return (...more) => curried(...args, ...more)
  }
}
const volume = curry((l, w, h) => l * w * h)
console.log(volume(2)(3)(4), volume(2, 3)(4))   // 24 24`,
  },
  {
    q: 'What is debouncing?',
    level: 'Intermediate',
    a: "Debouncing delays a function until the calls have stopped for a set time. Every new call resets the timer, so only the last one runs. I use it for search inputs, so the API is called once the user stops typing, not on every keystroke.",
    code: `function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

const search = debounce((text) => console.log('Searching:', text), 100)
search('re')
search('react')   // only this one runs`,
  },
  {
    q: 'What is memoization?',
    level: 'Intermediate',
    a: "Memoization is an optimization where I cache a function's results based on its input. If the function is called again with the same input, I return the cached value instead of calculating it again. React's useMemo is based on the same idea.",
    code: `function memoize(fn) {
  const cache = {}
  return (n) => {
    if (!(n in cache)) cache[n] = fn(n)
    else console.log('from cache:', n)
    return cache[n]
  }
}

const square = memoize((n) => n * n)
console.log(square(4))
console.log(square(4))`,
  },
  {
    q: 'Memoize a function with several arguments using a Map.',
    level: 'Coding round',
    a: "I keep a Map inside a closure and build a key from all the arguments, for example with JSON.stringify, so add(2, 3) and add(3, 2) are cached separately. I check with cache.has instead of comparing to undefined, so results that are undefined or 0 are cached too. In real code I'd also limit the cache size, because an unbounded cache is a memory leak.",
    code: `function memoize(fn) {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (!cache.has(key)) cache.set(key, fn(...args))
    return cache.get(key)
  }
}
let calls = 0
const add = memoize((a, b) => (calls++, a + b))
console.log(add(2, 3), add(2, 3), add(3, 2))
console.log('real calls:', calls)   // 2, not 3`,
  },
  {
    q: 'What is prototype / prototypal inheritance?',
    level: 'Advanced',
    a: "Every object in JavaScript has a hidden link to another object called its prototype. If a property isn't found on the object, JavaScript looks for it up the prototype chain. The class and extends syntax is just a cleaner way to write this prototype-based inheritance.",
    code: `class Animal {
  constructor(name) { this.name = name }
  speak() { return this.name + ' makes a sound' }
}
class Dog extends Animal {}

const d = new Dog('Tommy')
console.log(d.speak())   // found on Animal.prototype
console.log(Object.getPrototypeOf(d) === Dog.prototype)`,
  },
  {
    q: 'Why is 0.1 + 0.2 !== 0.3?',
    level: 'Intermediate',
    a: "JavaScript stores numbers as 64-bit binary floating point, and some decimals like 0.1 can't be represented exactly in binary, so small rounding errors appear. For display I use toFixed, and to compare I check whether the difference is smaller than Number.EPSILON. For money, I work in whole cents.",
    code: `console.log(0.1 + 0.2)
console.log(0.1 + 0.2 === 0.3)
console.log((0.1 + 0.2).toFixed(2))
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON)`,
  },
  {
    q: 'How do you check for NaN?',
    level: 'Basics',
    a: "NaN means 'not a number', and it's the only value in JavaScript that isn't equal to itself, so value === NaN is always false. I use Number.isNaN() to check. I avoid the global isNaN, because it converts the value first, so isNaN('abc') returns true.",
    code: `const value = Number('abc')
console.log(value)
console.log(value === NaN)        // always false
console.log(Number.isNaN(value))  // correct way`,
  },
  {
    q: 'Remove duplicates from an array?',
    level: 'Coding round',
    a: "The simplest way is to use a Set, because a Set only stores unique values. I create a Set from the array and spread it back into a new array. I could also use filter with indexOf, but Set is shorter and faster.",
    code: `const nums = [1, 2, 2, 3, 3, 3, 4]
const unique = [...new Set(nums)]
console.log(unique)`,
  },
  {
    q: 'Find the elements that appear only once in an array?',
    level: 'Coding round',
    a: "I keep a number only if its first position and last position are the same: a.indexOf(num) === a.lastIndexOf(num) is true only when the number appears exactly once. This is short and readable, but indexOf and lastIndexOf each scan the array, so it's O(n²). For large arrays I count each value with a Map first and then keep the ones with a count of 1, which is O(n).",
    code: `let a = [1, 2, 3, 4, 3, 2, 4]

let result = a.filter((num) => a.indexOf(num) === a.lastIndexOf(num))

console.log(result) // [1]`,
  },
  {
    q: 'What is type coercion? Guess the output.',
    level: 'Intermediate',
    a: "Type coercion is JavaScript automatically converting a value from one type to another. With the plus operator, if either side is a string, it joins them as text. Other math operators like minus and multiply convert both sides to numbers. That's why I prefer explicit conversion with Number() or String().",
    code: `console.log('5' + 2)     // string wins with +
console.log('5' - 2)     // - converts to number
console.log('5' * '2')
console.log(true + 1)    // true becomes 1
console.log(JSON.stringify([] + []))  // empty string
console.log(typeof NaN)  // NaN is a number!`,
  },
  {
    q: 'Pass by value vs pass by reference?',
    level: 'Intermediate',
    a: "Primitive values like numbers and strings are passed by value, so the function gets a copy and the original doesn't change. For objects and arrays, the function gets a reference to the same object, so if it modifies the object, the original changes too.",
    code: `function change(num, obj) {
  num = 100
  obj.name = 'Changed'
}

let n = 1
const o = { name: 'Original' }
change(n, o)
console.log(n)        // 1: not changed
console.log(o.name)   // Changed`,
  },
  {
    q: '|| vs ?? (nullish coalescing)?',
    level: 'Basics',
    a: "|| returns the right side when the left side is any falsy value, including 0, an empty string and false. ?? only returns the right side when the left side is null or undefined. So when 0 or an empty string is a valid value, I use ??.",
    code: `const count = 0
console.log(count || 10)   // 10  (0 is falsy)
console.log(count ?? 10)   // 0   (0 is not null/undefined)

const name = null
console.log(name ?? 'Guest')`,
  },
  {
    q: 'What are default parameters?',
    level: 'Basics',
    a: "Default parameters let me give a function parameter a fallback value. It's used when the argument is missing or undefined, but not when it's null. It's cleaner than writing name = name || 'Guest' inside the function.",
    code: `function greet(name = 'Guest', greeting = 'Hello') {
  return greeting + ', ' + name
}
console.log(greet())
console.log(greet('Anu'))
console.log(greet('Ravi', 'Hi'))`,
  },
  {
    q: 'const vs Object.freeze?',
    level: 'Intermediate',
    a: "const only stops the variable from being reassigned; the object it points to can still change. Object.freeze makes the object itself read-only, so changes are ignored, or throw an error in strict mode. Freeze is shallow, so nested objects can still change.",
    code: `const a = { x: 1 }
a.x = 2               // allowed
console.log(a.x)

const b = Object.freeze({ x: 1 })
b.x = 2               // ignored
console.log(b.x)
console.log(Object.isFrozen(b))`,
  },
  {
    q: 'What is an IIFE?',
    level: 'Intermediate',
    a: "An IIFE is a function that runs immediately after it's defined. It creates its own private scope, so the variables inside don't leak into the global scope. Before let, const and modules, it was the main way to create private variables.",
    code: `const counter = (function () {
  let count = 0           // private
  return { increment: () => ++count }
})()

counter.increment()
console.log(counter.increment())   // 2
console.log(typeof count)          // not visible outside`,
  },
  {
    q: 'What is throttling? How is it different from debouncing?',
    level: 'Intermediate',
    a: "Throttling makes sure a function runs at most once in a given time window, no matter how many times it's triggered. Debouncing waits until the calls stop and then runs once. I use throttle for scroll and resize handlers, and debounce for search inputs.",
    code: `function throttle(fn, limit) {
  let waiting = false
  return (...args) => {
    if (waiting) return
    fn(...args)
    waiting = true
    setTimeout(() => (waiting = false), limit)
  }
}
const log = throttle((n) => console.log('Ran call', n), 100)
log(1)   // runs straight away
log(2)   // ignored: still inside the 100ms window`,
  },
  {
    q: 'Implement debounce with a leading option.',
    level: 'Coding round',
    a: "A normal, trailing debounce runs once after the calls stop. With leading: true, it runs on the first call straight away and then ignores the burst until things have been quiet for the delay. I track that with the timer itself: if there's no timer running, this call is the start of a new burst. Leading is nice for buttons, so the first click responds instantly but double clicks are ignored.",
    code: `function debounce(fn, delay, { leading = false } = {}) {
  let timer = null
  return (...args) => {
    if (leading && timer === null) fn(...args)   // first call of a burst
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      if (!leading) fn(...args)                  // trailing call
    }, delay)
  }
}

const click = debounce((t) => console.log('leading:', t), 50, { leading: true })
click('first')    // runs straight away
click('second')   // ignored`,
  },
  {
    q: 'Write your own version of map (polyfill).',
    level: 'Coding round',
    a: "A polyfill is my own implementation of a built-in method. For map, I add a function to Array.prototype that loops over this, calls the callback with the item, index and array, pushes each result into a new array, and returns it. In real projects I wouldn't modify built-in prototypes, though.",
    code: `Array.prototype.myMap = function (callback) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this))
  }
  return result
}

console.log([1, 2, 3].myMap((n) => n * 10))
delete Array.prototype.myMap   // clean up`,
  },
  {
    q: 'Write polyfills for filter and reduce.',
    level: 'Coding round',
    a: "For filter, I loop over the array and push only the items where the callback returns true. For reduce, the tricky part is the initial value: if it isn't given, I start the accumulator with the first item and begin looping from index 1. The real reduce also throws a TypeError for an empty array with no initial value, which I'd add as a check.",
    code: `Array.prototype.myFilter = function (callback) {
  const result = []
  for (let i = 0; i < this.length; i++) if (callback(this[i], i, this)) result.push(this[i])
  return result
}
Array.prototype.myReduce = function (callback, initial) {
  let i = 0
  let acc = initial
  if (arguments.length < 2) { acc = this[0]; i = 1 }   // no initial value
  for (; i < this.length; i++) acc = callback(acc, this[i], i, this)
  return acc
}

console.log([1, 2, 3, 4].myFilter((n) => n % 2 === 0), [1, 2, 3, 4].myReduce((a, b) => a + b))
delete Array.prototype.myFilter
delete Array.prototype.myReduce`,
  },
  {
    q: 'Write a polyfill for bind.',
    level: 'Coding round',
    a: "bind returns a new function with this fixed, and optionally some arguments filled in ahead of time. In my version I save the original function, and the returned function calls it with apply, passing the saved context and the preset arguments followed by the new ones. A full polyfill also handles being called with new, but this is the core idea interviewers look for.",
    code: `Function.prototype.myBind = function (context, ...preset) {
  const fn = this
  return (...args) => fn.apply(context, [...preset, ...args])
}

function introduce(greeting, punctuation) {
  return greeting + ', I am ' + this.name + punctuation
}

const hello = introduce.myBind({ name: 'Ravi' }, 'Hello')
console.log(hello('!'))
delete Function.prototype.myBind`,
  },
  {
    q: 'Write a polyfill for Promise.all.',
    level: 'Coding round',
    a: "I return a new promise and keep a results array and a counter. For each item I use Promise.resolve, so plain values work too, and I store each result at its original index to keep the order. When the counter reaches the total, I resolve; if any promise rejects, I reject straight away. I also resolve immediately for an empty array.",
    code: `function promiseAll(items) {
  return new Promise((resolve, reject) => {
    const results = []
    let done = 0
    if (items.length === 0) return resolve(results)
    items.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value            // keep the original order
        if (++done === items.length) resolve(results)
      }, reject)
    })
  })
}
promiseAll([Promise.resolve(1), 'plain', 3]).then((v) => console.log('resolved:', v))
promiseAll([1, Promise.reject('failed')]).catch((e) => console.log('rejected:', e))`,
  },
  {
    q: 'Flatten a nested array without .flat()?',
    level: 'Coding round',
    a: "I'd solve it with recursion. I loop through the array, and if an item is itself an array, I flatten it recursively and spread the result in; otherwise I push the item. This works for any depth of nesting.",
    code: `function flatten(arr) {
  const result = []
  for (const item of arr) {
    if (Array.isArray(item)) result.push(...flatten(item))
    else result.push(item)
  }
  return result
}

console.log(flatten([1, [2, [3, [4]], 5]]))`,
  },
  {
    q: 'What are practical uses of flatMap?',
    level: 'Intermediate',
    a: "flatMap is a map followed by a flat of one level, done in one pass. I use it to pull nested lists out, like all the items from all the orders, and to turn one item into several. A neat trick is filtering and mapping at the same time: return an empty array to drop an item, or a one-item array to keep it. It only flattens one level, so deeper arrays stay nested.",
    code: `const orders = [{ items: ['pen', 'book'] }, { items: ['bag'] }]
console.log(orders.flatMap((o) => o.items))   // map + flatten

const nums = [1, 2, 3, 4, 5]
console.log(nums.flatMap((n) => (n % 2 ? [n * 10] : [])))   // [] drops

console.log(['a-b', 'c'].flatMap((s) => s.split('-')))    // one into many`,
  },
  {
    q: 'Count how many times each item appears?',
    level: 'Coding round',
    a: "I'd use reduce with an empty object as the starting value. For each item, I increase its count by one, using (acc[item] || 0) + 1 so the first time starts from zero. The result is an object with each item and how many times it appears.",
    code: `const fruits = ['apple', 'banana', 'apple', 'mango', 'banana', 'apple']

const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1
  return acc
}, {})

console.log(count)`,
  },
  {
    q: 'Group an array of objects by a property?',
    level: 'Coding round',
    a: "I'd use reduce again. For each object, I check whether its key, like the department, already exists in the accumulator. If not, I create an empty array, and then I push the item into it. Newer JavaScript also has Object.groupBy, which does this directly.",
    code: `const people = [
  { name: 'Anu', dept: 'IT' },
  { name: 'Ravi', dept: 'HR' },
  { name: 'Meera', dept: 'IT' },
]

const byDept = people.reduce((acc, p) => {
  ;(acc[p.dept] ||= []).push(p.name)
  return acc
}, {})
console.log(byDept)`,
  },
  {
    q: 'Sort an array of objects by a property?',
    level: 'Coding round',
    a: "I use sort with a compare function. For numbers, I return a.age - b.age for ascending order, and for strings I use localeCompare. I copy the array with spread first, because sort changes the original array.",
    code: `const people = [
  { name: 'Ravi', age: 30 },
  { name: 'Anu', age: 32 },
  { name: 'Meera', age: 27 },
]

const byAge = [...people].sort((a, b) => a.age - b.age)
console.log(byAge.map((p) => p.name))
const byName = [...people].sort((a, b) => a.name.localeCompare(b.name))
console.log(byName.map((p) => p.name))`,
  },
  {
    q: 'Sort an array of objects by multiple keys?',
    level: 'Coding round',
    a: "In the compare function I compare the first key, and only when it's equal do I compare the second key. A neat trick is joining the comparisons with ||, because a result of 0 means equal and falls through to the next comparison. Here I sort by department alphabetically, then by salary from highest to lowest.",
    code: `const staff = [
  { name: 'Anu', dept: 'IT', salary: 50 },
  { name: 'Ravi', dept: 'HR', salary: 40 },
  { name: 'Meera', dept: 'IT', salary: 70 },
]

const sorted = [...staff].sort(
  (a, b) => a.dept.localeCompare(b.dept) || b.salary - a.salary
)
console.log(sorted.map((p) => p.dept + ' ' + p.name))`,
  },
  {
    q: 'Remove duplicate objects from an array by a key?',
    level: 'Coding round',
    a: "A Set doesn't help directly with objects, because it compares references, so I track the keys I've already seen. I use filter with a Set of seen ids and keep an item only the first time its id appears. Another short option is a Map keyed by id, but that keeps the last value for each id instead of the first.",
    code: `const users = [{ id: 1, name: 'Anu' }, { id: 2, name: 'Ravi' }, { id: 1, name: 'Anu again' }]

const seen = new Set()
const unique = users.filter((u) => {
  if (seen.has(u.id)) return false
  seen.add(u.id)
  return true
})
console.log(unique.map((u) => u.name))   // ['Anu', 'Ravi']`,
  },
  {
    q: 'Merge two arrays of objects by id?',
    level: 'Coding round',
    a: "I put the first array into a Map keyed by id, then loop over the second array and merge each object into the matching entry with spread, or add it if the id is new. Using a Map keeps it O(n), instead of calling find inside a loop, which would be O(n²).",
    code: `const users = [{ id: 1, name: 'Anu' }, { id: 2, name: 'Ravi' }]
const details = [{ id: 2, city: 'Pune' }, { id: 3, name: 'Meera' }]

function mergeById(a, b) {
  const map = new Map(a.map((item) => [item.id, item]))
  for (const item of b) map.set(item.id, { ...map.get(item.id), ...item })
  return [...map.values()]
}

console.log(mergeById(users, details))`,
  },
  {
    q: 'Find the largest and smallest number in an array?',
    level: 'Coding round',
    a: "Math.max and Math.min take separate arguments, not an array, so I spread the array into them. For very large arrays, I'd use reduce instead, to avoid hitting the limit on the number of arguments.",
    code: `const nums = [4, 19, 2, 33, 8]
console.log(Math.max(...nums))
console.log(Math.min(...nums))`,
  },
  {
    q: 'Check if two strings are anagrams?',
    level: 'Coding round',
    a: "Two strings are anagrams if they contain the same letters in a different order. My simple approach is to lowercase both, split them into characters, sort, join them back and compare. For better performance, I could count the characters instead of sorting.",
    code: `function isAnagram(a, b) {
  const clean = (s) => s.toLowerCase().split('').sort().join('')
  return clean(a) === clean(b)
}

console.log(isAnagram('listen', 'silent'))
console.log(isAnagram('hello', 'world'))`,
  },
  {
    q: 'Group words that are anagrams of each other.',
    level: 'Coding round',
    a: "Anagrams have the same letters, so if I sort each word's letters I get the same key, like 'aet' for eat, tea and ate. I group the words in an object by that key, and return the object's values at the end. Sorting makes it O(n · k log k); for long words I could use a letter-count key instead.",
    code: `function groupAnagrams(words) {
  const groups = {}
  for (const word of words) {
    const key = word.split('').sort().join('')   // 'eat' -> 'aet'
    ;(groups[key] ||= []).push(word)
  }
  return Object.values(groups)
}

console.log(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat']))`,
  },
  {
    q: 'Find the first non-repeating character?',
    level: 'Coding round',
    a: "I loop through the string twice. In the first loop, I count how many times each character appears using an object. In the second loop, I return the first character whose count is 1. That runs in O(n) time.",
    code: `function firstUnique(str) {
  const count = {}
  for (const ch of str) count[ch] = (count[ch] || 0) + 1
  for (const ch of str) if (count[ch] === 1) return ch
  return null
}

console.log(firstUnique('aabbcdde'))   // c
console.log(firstUnique('aabb'))       // null`,
  },
  {
    q: 'Count the vowels in a string?',
    level: 'Coding round',
    a: "I lowercase the string and loop through each character, checking whether it's one of 'aeiou' with includes. A shorter way is a regex with match, but match returns null when nothing matches, so I add || [] before reading length; forgetting that is a common bug.",
    code: `function countVowels(str) {
  let count = 0
  for (const ch of str.toLowerCase()) {
    if ('aeiou'.includes(ch)) count++
  }
  return count
}
console.log(countVowels('Hello World'))   // 3

const withRegex = (str) => (str.match(/[aeiou]/gi) || []).length
console.log(withRegex('rhythm'))          // 0, not a crash`,
  },
  {
    q: 'Check if the brackets in a string are balanced?',
    level: 'Coding round',
    a: "I use a stack. When I see an opening bracket I push it, and when I see a closing bracket I pop the last one and check that it's the matching pair. If it doesn't match, it's unbalanced, and at the end the stack must be empty, otherwise some brackets were never closed.",
    code: `function isBalanced(str) {
  const pairs = { ')': '(', ']': '[', '}': '{' }
  const stack = []
  for (const ch of str) {
    if ('([{'.includes(ch)) stack.push(ch)
    else if (pairs[ch] && stack.pop() !== pairs[ch]) return false
  }
  return stack.length === 0
}

console.log(isBalanced('{[()]}'))   // true
console.log(isBalanced('([)]'))     // false
console.log(isBalanced('(('))       // false`,
  },
  {
    q: 'Factorial and Fibonacci with recursion?',
    level: 'Coding round',
    a: "Recursion is when a function calls itself to solve a smaller version of the same problem. Every recursive function needs a base case; otherwise it never stops and causes a stack overflow. Factorial and Fibonacci are classic examples, and for large Fibonacci numbers I'd add memoization.",
    code: `function factorial(n) {
  if (n <= 1) return 1          // base case
  return n * factorial(n - 1)
}

function fib(n) {
  if (n < 2) return n           // base case
  return fib(n - 1) + fib(n - 2)
}

console.log(factorial(5), fib(7))`,
  },
  {
    q: 'Split an array into chunks?',
    level: 'Coding round',
    a: "I loop through the array in steps of the chunk size and use slice to take each piece. slice doesn't change the original array, and the last chunk just contains whatever is left over.",
    code: `function chunk(arr, size) {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

console.log(chunk([1, 2, 3, 4, 5, 6, 7], 3))`,
  },
  {
    q: 'Two sum: find two numbers that add up to a target?',
    level: 'Coding round',
    a: "The brute-force way checks every pair with two nested loops, which is O(n²). The better way uses a Map: for each number I check whether target minus that number is already in the Map; if it is, I've found the pair, otherwise I store the current number with its index. That's a single pass, so O(n).",
    code: `function twoSum(nums, target) {
  const seen = new Map()   // number -> index
  for (let i = 0; i < nums.length; i++) {
    const needed = target - nums[i]
    if (seen.has(needed)) return [seen.get(needed), i]
    seen.set(nums[i], i)
  }
  return null
}

console.log(twoSum([2, 7, 11, 15], 9))   // [0, 1]`,
  },
  {
    q: 'Rotate an array by k positions?',
    level: 'Coding round',
    a: "To rotate right by k, I take the last k items with slice and put them in front of the rest. I use k % length first, so a k bigger than the array still works. Rotating left is the same idea from the other side, slice(k) followed by slice(0, k), and since slice doesn't mutate, the original array stays the same.",
    code: `function rotateRight(arr, k) {
  if (arr.length === 0) return []
  k = k % arr.length
  return [...arr.slice(-k), ...arr.slice(0, -k)]
}

console.log(rotateRight([1, 2, 3, 4, 5], 2))   // [4, 5, 1, 2, 3]
console.log(rotateRight([1, 2, 3, 4, 5], 7))   // same as 2`,
  },
  {
    q: 'What are try, catch and finally?',
    level: 'Basics',
    a: "I put code that might fail inside try. If an error is thrown, execution jumps to catch, where I can handle it gracefully. finally runs every time, whether there was an error or not, so I use it for cleanup like hiding a loading spinner.",
    code: `try {
  JSON.parse('not json')
  console.log('never reached')
} catch (error) {
  console.log('Caught:', error.name)
} finally {
  console.log('finally always runs')
}`,
  },
  {
    q: 'What are getters and setters?',
    level: 'Intermediate',
    a: "Getters and setters are special methods that look like normal properties. A getter runs when I read the property, for example to build fullName from the first and last names. A setter runs when I assign a value, so I can validate or split it.",
    code: `const user = {
  first: 'Anu',
  last: 'Nair',
  get fullName() { return this.first + ' ' + this.last },
  set fullName(value) { [this.first, this.last] = value.split(' ') },
}

console.log(user.fullName)   // getter runs
user.fullName = 'Meera Das'  // setter runs
console.log(user.first)`,
  },
  {
    q: 'What is a generator function?',
    level: 'Advanced',
    a: "A generator function is written with function* and can pause with yield. Each call to next() resumes it until the next yield and returns that value. They're useful for sequences that are computed only when needed, like generating IDs.",
    code: `function* idMaker() {
  let id = 1
  while (true) yield id++
}

const ids = idMaker()
console.log(ids.next().value)
console.log(ids.next().value)
console.log(ids.next().value)`,
  },
  {
    q: 'What are tagged templates?',
    level: 'Advanced',
    a: "A tagged template is a function placed right before a template literal. The function receives an array of the plain string parts and then the values of each placeholder as separate arguments, and whatever it returns becomes the result. Libraries use this for styled-components, GraphQL queries and safe HTML or SQL escaping. String.raw is a built-in tag that keeps backslashes as they are.",
    code: `function highlight(strings, ...values) {
  console.log('strings:', strings)
  console.log('values:', values)
  return strings[0] + '[' + values[0] + ']' + strings[1]
}

const name = 'Anu'
console.log(highlight\`Hi \${name}!\`)
console.log(String.raw\`C:\\new\\folder\`)`,
  },
  {
    q: 'What is event bubbling?',
    level: 'Intermediate',
    a: "When an event happens on an element, it first runs the handlers on that element and then bubbles up through its parents, one by one, up to the document. There's also a capturing phase that goes from the top down first, but by default handlers listen during bubbling. Bubbling is what makes event delegation possible.",
    code: `const parent = document.createElement('div')
const button = document.createElement('button')
parent.appendChild(button)

parent.addEventListener('click', () => console.log('2. parent heard it (bubbling)'))
button.addEventListener('click', () => console.log('1. button clicked'))

button.click()`,
  },
  {
    q: 'What is event delegation?',
    level: 'Intermediate',
    a: "Instead of adding a listener to every child, I add one listener to the parent and use event.target to find which child was clicked. It works because of bubbling. It uses less memory, and it also works for items added later, like new rows in a list.",
    code: `const list = document.createElement('ul')
list.innerHTML = '<li>Apple</li><li>Banana</li>'

// one listener on the parent for all items
list.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') console.log('Clicked:', event.target.textContent)
})

list.children[1].click()`,
  },
  {
    q: 'preventDefault vs stopPropagation?',
    level: 'Intermediate',
    a: "preventDefault stops the browser's default action, like a link navigating or a form submitting. stopPropagation stops the event from bubbling up to parent elements. They do different things, and sometimes I need both.",
    code: `const parent = document.createElement('div')
const link = document.createElement('a')
link.href = 'https://example.com'
parent.appendChild(link)

parent.addEventListener('click', () => console.log('parent: will NOT run'))
link.addEventListener('click', (e) => {
  e.preventDefault()    // no navigation
  e.stopPropagation()   // no bubbling to parent
  console.log('link clicked, navigation prevented:', e.defaultPrevented)
})
link.click()`,
  },
  {
    q: 'localStorage vs sessionStorage vs cookies?',
    level: 'Basics',
    a: "localStorage keeps data with no expiry until it's cleared, and sessionStorage keeps it only until the tab is closed. Both hold around 5MB and are only read by JavaScript. Cookies are small, around 4KB, have an expiry date, and are sent to the server with every request, so I use them for things like auth sessions, ideally httpOnly.",
    code: `localStorage.setItem('theme', 'dark')
console.log(localStorage.getItem('theme'))

// values are always strings, so use JSON for objects
localStorage.setItem('user', JSON.stringify({ name: 'Anu' }))
console.log(JSON.parse(localStorage.getItem('user')).name)

localStorage.removeItem('theme')
localStorage.removeItem('user')
console.log(localStorage.getItem('theme'))`,
  },
  {
    q: 'Arrow function vs regular function: what are the differences?',
    level: 'Basics',
    a: "Arrow functions are shorter, and they don't have their own this or arguments object; they take them from the surrounding scope. They also can't be used as constructors with new. I use arrows for callbacks and small helpers, and regular functions for object methods and constructors.",
    code: `function Regular(name) {
  this.name = name
}
console.log(new Regular('works').name)

const Arrow = (name) => name
try {
  new Arrow('fails')
} catch (e) {
  console.log(e.message)   // Arrow is not a constructor
}`,
  },
  {
    q: 'Function declaration vs function expression?',
    level: 'Basics',
    a: "A function declaration uses the function keyword on its own and is fully hoisted, so I can call it before the line where it's written. A function expression assigns a function to a variable, so it follows the variable's rules; with const, calling it early throws an error.",
    code: `console.log(declared())   // works: hoisted
function declared() {
  return 'declaration works before its line'
}

try {
  expressed()
} catch (e) {
  console.log(e.name)     // ReferenceError
}
const expressed = function () {}`,
  },
  {
    q: 'What is lexical scope and the scope chain?',
    level: 'Intermediate',
    a: "Lexical scope means a function's access to variables is decided by where it's written in the code, not where it's called. When JavaScript looks for a variable, it checks the current scope first, then the outer scope, and keeps going up to the global scope. That chain of scopes is called the scope chain.",
    code: `const name = 'global'

function outer() {
  const name = 'outer'
  function inner() {
    return name   // checks inner, then outer: finds 'outer'
  }
  return inner()
}

console.log(outer())`,
  },
  {
    q: 'Global vs function vs block scope?',
    level: 'Basics',
    a: "Global scope is visible everywhere. Function scope means anything declared inside a function, with var, let or const, only exists inside that function. Block scope means let and const declared inside curly braces, like an if or a loop, only exist inside that block, while var ignores blocks. I keep variables in the smallest scope possible to avoid accidental clashes.",
    code: `const appName = 'Shop'           // global scope

function checkout() {
  var total = 100                // function scope
  if (total > 50) {
    let discount = 10            // block scope
  }
  console.log(appName, typeof discount)   // discount not visible here
}
checkout()
console.log(typeof total)        // not visible outside the function`,
  },
  {
    q: 'What is the call stack? What causes a stack overflow?',
    level: 'Intermediate',
    a: "The call stack is how JavaScript keeps track of which function is running. When a function is called it's pushed onto the stack, and when it returns it's popped off, so the last one in is the first one out. If a recursive function never reaches its base case, the stack keeps growing until the engine throws a RangeError: Maximum call stack size exceeded.",
    code: `function second() {
  console.log('2. second runs')
}
function first() {
  console.log('1. first calls second')
  second()
  console.log('3. back in first')
}
first()

const forever = () => forever()   // no base case
try { forever() } catch (e) { console.log(e.name + ': ' + e.message) }`,
  },
  {
    q: 'What is a pure function? What are side effects?',
    level: 'Intermediate',
    a: "A pure function always returns the same output for the same input and doesn't change anything outside itself. A side effect is anything that reaches outside, like changing a global variable, mutating an argument, calling an API or updating the DOM. Pure functions are easy to test and predict, which is why React expects components and reducers to be pure, and I keep side effects in places like useEffect.",
    code: `// Pure: same input, same output, changes nothing outside
const applyDiscount = (price) => price - 10

// Impure: changes outside state (side effect)
let total = 0
const addToTotal = (price) => (total += price)

console.log(applyDiscount(100), applyDiscount(100))   // 90 90
console.log(addToTotal(100), addToTotal(100))         // 100 200`,
  },
  {
    q: 'What is immutability? How do you update nested data without mutating it?',
    level: 'Intermediate',
    a: "Immutability means I never change existing data; instead I create a new copy that includes the change. This matters in React, because it compares references to decide whether to re-render, so mutating state in place can skip updates. For nested data, I spread every level on the path I'm changing and leave the untouched parts shared.",
    code: `const state = {
  user: { name: 'Anu', address: { city: 'Kochi' } },
  settings: { lang: 'en' },
}

const next = {
  ...state,
  user: { ...state.user, address: { ...state.user.address, city: 'Pune' } },
}
console.log(state.user.address.city, next.user.address.city)   // Kochi Pune
console.log(state.settings === next.settings)   // untouched part is shared`,
  },
  {
    q: 'What does it mean that functions are first-class?',
    level: 'Intermediate',
    a: "It means functions are treated like any other value: I can store them in variables, put them in objects or arrays, pass them as arguments and return them from other functions. A function passed into another function is called a callback, and a function that takes or returns functions is a higher-order function. This is what makes map, event handlers and React's onClick props possible.",
    code: `const greet = (name) => 'Hi ' + name       // stored in a variable

function run(callback, value) {           // passed as an argument
  return callback(value)
}

function makeGreeter(greeting) {          // returned from a function
  return (name) => greeting + ', ' + name
}

console.log(run(greet, 'Anu'))
console.log(makeGreeter('Welcome')('Ravi'))`,
  },
  {
    q: 'What is "use strict"?',
    level: 'Intermediate',
    a: "Strict mode makes JavaScript catch common mistakes by throwing errors instead of failing silently. For example, assigning to an undeclared variable throws instead of creating a global. ES modules and classes are in strict mode automatically, so in modern code I get it by default.",
    code: `function sloppy() {
  oops = 5                 // creates a global by accident
  return typeof oops
}
console.log(sloppy())
delete globalThis.oops

function strict() {
  'use strict'
  try { oops2 = 5 } catch (e) { console.log(e.name + ': ' + e.message) }
}
strict()`,
  },
  {
    q: 'Map vs plain object?',
    level: 'Intermediate',
    a: "A Map can use any value as a key, including numbers, objects and functions, while object keys are always strings or symbols. A Map remembers insertion order, has a size property, and is faster for frequent adding and removing. I use plain objects for fixed data shapes, and Map for dynamic key-value collections.",
    code: `const map = new Map()
map.set(1, 'number key')
map.set(true, 'boolean key')
console.log(map.get(1), '|', map.get(true))
console.log('size:', map.size)

const obj = {}
obj[1] = 'number key'
obj[true] = 'boolean key'
console.log(Object.keys(obj))   // keys became strings`,
  },
  {
    q: 'What are private fields and static members in classes?',
    level: 'Advanced',
    a: "A field that starts with # is private, so it can only be accessed inside the class, which gives real encapsulation. static members belong to the class itself rather than to instances, so I access them like ClassName.member. I use static for helpers and constants related to the class.",
    code: `class BankAccount {
  #balance = 0                  // private
  static bankName = 'JS Bank'   // belongs to the class

  deposit(amount) { this.#balance += amount }
  get balance() { return this.#balance }
}

const acc = new BankAccount()
acc.deposit(100)
console.log(acc.balance, BankAccount.bankName)
console.log(acc.bankName)       // undefined: not on instances`,
  },
  {
    q: 'What does the new keyword do?',
    level: 'Advanced',
    a: "new does four things: it creates an empty object, links that object's prototype to the constructor's prototype, runs the constructor with this pointing to the new object, and returns the object unless the constructor returns a different object itself.",
    code: `function Person(name) {
  this.name = name
}
Person.prototype.hi = function () { return 'Hi, ' + this.name }

// What new Person('Ravi') does, by hand:
const obj = Object.create(Person.prototype)   // 1 + 2: new object, linked
const result = Person.call(obj, 'Ravi')       // 3: run with this = obj
const person = result ?? obj                  // 4: return the object
console.log(person.hi())
console.log(new Person('Anu').hi())`,
  },
  {
    q: 'Why is "this" lost when you pass a method as a callback? How do you fix it?',
    level: 'Advanced',
    a: "When I pass a method somewhere, like setTimeout(user.greet) or onClick={user.greet}, only the function is passed and the link to the object is lost. So this is undefined in strict mode, or the global object otherwise. I fix it with bind, or by wrapping the call in an arrow function so the method is still called on the object.",
    code: `'use strict'
const user = {
  name: 'Anu',
  greet() { console.log('Hi, ' + this.name) },
}

const greet = user.greet   // just the function, no object
try { greet() } catch (e) { console.log('lost this:', e.message) }

setTimeout(user.greet.bind(user), 10)   // fix 1: bind
setTimeout(() => user.greet(), 20)      // fix 2: arrow wrapper`,
  },
  {
    q: 'How does class inheritance work with super?',
    level: 'Advanced',
    a: "extends links the child class's prototype to the parent's. In the child constructor I must call super() before using this, because super runs the parent constructor that actually sets up the object. I can also call super.method() inside a method to reuse the parent's version and add to it, instead of rewriting it.",
    code: `class Employee {
  constructor(name) { this.name = name }
  describe() { return this.name + ' is an employee' }
}
class Manager extends Employee {
  constructor(name, team) {
    super(name)          // must come before using this
    this.team = team
  }
  describe() { return super.describe() + ' managing ' + this.team }
}
console.log(new Manager('Meera', 'IT').describe())`,
  },
  {
    q: 'How does method chaining work?',
    level: 'Advanced',
    a: "Method chaining works when each method returns this, the object itself, so the next method can be called directly on the result. Libraries like jQuery and query builders work this way. Array methods chain too, but because they return a new array; in my own classes I need an explicit return this.",
    code: `class Counter {
  count = 0
  add(n) {
    this.count += n
    return this   // return the object so the next call can chain
  }
}

console.log(new Counter().add(1).add(2).add(3).count)`,
  },
  {
    q: 'What are property descriptors (writable, enumerable, configurable)?',
    level: 'Advanced',
    a: "Every property has hidden settings: writable controls whether the value can change, enumerable controls whether it shows up in loops, Object.keys and JSON, and configurable controls whether it can be deleted or redefined. Normal properties have all three set to true, but with Object.defineProperty they default to false. I use it for read-only or hidden properties.",
    code: `const user = { name: 'Anu' }
Object.defineProperty(user, 'id', {
  value: 101,
  writable: false,     // read-only
  enumerable: false,   // hidden from keys and JSON
})

user.id = 999          // ignored (throws in strict mode)
console.log(user.id)
console.log(Object.keys(user), JSON.stringify(user))`,
  },
  {
    q: 'What are Proxy and Reflect?',
    level: 'Advanced',
    a: "A Proxy wraps an object and lets me intercept basic operations like reading, writing or deleting a property, using handler functions called traps. Reflect has a method for each of those operations, so inside a trap I call Reflect.get or Reflect.set to do the default behaviour after my own logic. I use proxies for validation, default values and logging, and they're how Vue's reactivity works.",
    code: `const user = { name: 'Anu' }

const safeUser = new Proxy(user, {
  get(target, key) {
    if (!(key in target)) return 'no ' + key
    return Reflect.get(target, key)   // default behaviour
  },
})

console.log(safeUser.name)    // Anu
console.log(safeUser.email)   // no email`,
  },
  {
    q: 'How does reactivity work? Build a tiny reactive store with Proxy.',
    level: 'Advanced',
    a: "Frameworks like Vue track which effects read which properties: the get trap records the currently running effect for that key, and the set trap re-runs every effect that read the key. So when I change state.count, only the code that used count runs again. It's the same idea behind signals in Solid, Preact and Angular.",
    code: `let active = null
const effects = {}   // key -> functions that read it
const state = new Proxy({ count: 0 }, {
  get(target, key) {
    if (active) (effects[key] ||= []).push(active)   // track the reader
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    effects[key]?.forEach((fn) => fn())   // re-run the readers
    return true
  },
})
const effect = (fn) => { active = fn; fn(); active = null }

effect(() => console.log('count is', state.count))
state.count = 1   // the effect runs again by itself`,
  },
  {
    q: 'Prototype chain puzzle: guess the output.',
    level: 'Advanced',
    a: "When I read a property, JavaScript checks the object itself first and then walks up the prototype chain until it finds it or reaches null. Writing a property always creates it on the object itself, which shadows the prototype's value instead of changing it. And since shared values and methods live on the prototype, changing the prototype affects every instance that doesn't have its own value.",
    code: `function Car(brand) { this.brand = brand }
Car.prototype.wheels = 4

const a = new Car('Kia')
const b = new Car('Tata')
b.wheels = 3                    // own property shadows the prototype
console.log(a.wheels, b.wheels) // 4 3

Car.prototype.wheels = 6        // changes every car without its own value
console.log(a.wheels, b.wheels) // 6 3`,
  },
  {
    q: 'What are iterators and how do you make an object iterable?',
    level: 'Advanced',
    a: "An iterator is an object with a next() method that returns { value, done }. An object becomes iterable when it has a Symbol.iterator method that returns an iterator, and then it works with for...of, spread and destructuring. Symbols are unique keys, so this built-in one can't clash with my own properties. The easiest way to write an iterator is with a generator.",
    code: `const range = {
  from: 1,
  to: 4,
  [Symbol.iterator]() {
    let current = this.from
    const last = this.to
    return { next: () => (current <= last ? { value: current++, done: false } : { done: true }) }
  },
}
console.log([...range])   // [1, 2, 3, 4]
const countdown = { *[Symbol.iterator]() { yield 3; yield 2; yield 1 } }
console.log([...countdown])   // easier with a generator`,
  },
  {
    q: 'What are WeakMap and WeakSet? How do they relate to garbage collection?',
    level: 'Advanced',
    a: "WeakMap and WeakSet only accept objects as keys, and they hold them weakly: if nothing else references the object, the garbage collector can remove it, and the entry disappears with it. Because entries can vanish at any time, they aren't iterable and have no size. I use a WeakMap to attach a cache or private data to objects, like DOM nodes, without causing memory leaks.",
    code: `const cache = new WeakMap()
function getProfile(user) {
  if (!cache.has(user)) cache.set(user, user.name.toUpperCase())
  return cache.get(user)
}

let user = { name: 'Anu' }
console.log(getProfile(user))
user = null      // now the entry can be garbage collected

console.log(typeof cache.size)   // undefined: not iterable, no size`,
  },
  {
    q: 'Which array methods change the original array?',
    level: 'Intermediate',
    a: "push, pop, shift, unshift, splice, sort, reverse and fill change the original array. map, filter, slice, concat and the spread operator return a new array and leave the original alone. In React I always use the non-mutating ones, because state must not be changed directly.",
    code: `const arr = [3, 1, 2]

arr.map((n) => n * 2)
arr.slice(0, 1)
console.log('after map/slice:', arr)    // unchanged

arr.sort()
arr.push(4)
console.log('after sort/push:', arr)    // changed`,
  },
  {
    q: 'What do JSON.stringify and JSON.parse do?',
    level: 'Basics',
    a: "JSON.stringify turns a JavaScript value into a JSON string, for example to send it to an API or save it in localStorage. JSON.parse turns a JSON string back into a value. I keep in mind that stringify drops functions and undefined, and turns NaN into null.",
    code: `const user = { name: 'Anu', skills: ['JS', 'React'] }

const text = JSON.stringify(user)
console.log(typeof text, text)

const back = JSON.parse(text)
console.log(back.skills[1])

console.log(JSON.stringify({ a: undefined, b: () => {}, c: NaN }))`,
  },
  {
    q: 'How do you compare two objects deeply?',
    level: 'Coding round',
    a: "=== only compares references, so I write a recursive function. If both values are the same, I return true. If they're objects, I check they have the same number of keys, and then compare every key recursively. In real projects I might use a library like Lodash's isEqual.",
    code: `function isEqual(a, b) {
  if (a === b) return true
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false
  const keysA = Object.keys(a)
  if (keysA.length !== Object.keys(b).length) return false
  return keysA.every((key) => isEqual(a[key], b[key]))
}

console.log(isEqual({ x: 1, y: { z: [1, 2] } }, { x: 1, y: { z: [1, 2] } }))
console.log(isEqual({ x: 1 }, { x: 2 }))`,
  },
  {
    q: 'Write your own deep clone function.',
    level: 'Coding round',
    a: "I use recursion: primitives and null are returned as they are, and for arrays and objects I create a new empty copy and clone every key into it. To handle circular references, I keep a WeakMap of objects I've already copied and reuse those copies. In real code I'd just use structuredClone, but writing it shows I understand how it works.",
    code: `function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value
  if (seen.has(value)) return seen.get(value)      // circular reference
  const copy = Array.isArray(value) ? [] : {}
  seen.set(value, copy)
  for (const key of Object.keys(value)) copy[key] = deepClone(value[key], seen)
  return copy
}

const original = { name: 'Anu', address: { city: 'Kochi' } }
original.self = original                           // circular
const copy = deepClone(original)
copy.address.city = 'Pune'
console.log(original.address.city, copy.address.city)   // Kochi Pune
console.log(copy.self === copy)`,
  },
  {
    q: 'Reverse the words in a sentence?',
    level: 'Coding round',
    a: "I split the sentence into words with split(' '), reverse the array, and join it back with a space. To reverse each word's letters instead, I map over the words and reverse each one.",
    code: `const sentence = 'I love JavaScript'

console.log(sentence.split(' ').reverse().join(' '))

console.log(
  sentence
    .split(' ')
    .map((word) => word.split('').reverse().join(''))
    .join(' ')
)`,
  },
  {
    q: 'Capitalize the first letter of every word?',
    level: 'Coding round',
    a: "I split the string into words, and for each word I take the first character in uppercase and add the rest of the word with slice(1). Then I join the words back together.",
    code: `function capitalize(str) {
  return str
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

console.log(capitalize('hello world from javascript'))`,
  },
  {
    q: 'Find the second largest number in an array?',
    level: 'Coding round',
    a: "I loop once and track two values, the largest and the second largest. When I find a new largest, the old largest becomes the second. I skip duplicates of the largest. This runs in O(n) time, which is better than sorting.",
    code: `function secondLargest(arr) {
  let first = -Infinity
  let second = -Infinity
  for (const n of arr) {
    if (n > first) [second, first] = [first, n]
    else if (n > second && n !== first) second = n
  }
  return second
}

console.log(secondLargest([10, 5, 20, 8, 20]))   // 10`,
  },
  {
    q: 'Find the missing number from 1 to n?',
    level: 'Coding round',
    a: "The sum of 1 to n is n times n plus 1, divided by 2. I calculate that expected sum, subtract the actual sum of the array, and the difference is the missing number. It's O(n) time and needs no extra memory.",
    code: `function findMissing(arr, n) {
  const expected = (n * (n + 1)) / 2
  const actual = arr.reduce((sum, x) => sum + x, 0)
  return expected - actual
}

console.log(findMissing([1, 2, 4, 5, 6], 6))`,
  },
  {
    q: 'Check if a number is prime?',
    level: 'Coding round',
    a: "A prime number is only divisible by 1 and itself. Numbers below 2 aren't prime. I only check divisors up to the square root of the number, because if there's a bigger factor there must also be a smaller one, which makes it much faster.",
    code: `function isPrime(n) {
  if (n < 2) return false
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false
  }
  return true
}

console.log([1, 2, 3, 4, 5, 17, 20, 29].filter(isPrime))`,
  },
  {
    q: 'Swap two variables without a temp variable?',
    level: 'Coding round',
    a: "The cleanest way is array destructuring: [a, b] = [b, a]. It creates a temporary array on the right and unpacks it into the variables on the left.",
    code: `let a = 1
let b = 2
;[a, b] = [b, a]
console.log(a, b)`,
  },
  {
    q: 'for...in vs for...of?',
    level: 'Basics',
    a: "for...in loops over the keys of an object, and on arrays it gives the indexes as strings. for...of loops over the values of anything iterable, like arrays, strings, Maps and Sets. I use for...of for arrays and for...in, or Object.keys, for objects.",
    code: `const arr = ['a', 'b', 'c']
for (const i in arr) console.log('in:', i)
for (const v of arr) console.log('of:', v)

const obj = { x: 1, y: 2 }
for (const key in obj) console.log('object key:', key)`,
  },
  {
    q: 'What are labels with break and continue?',
    level: 'Intermediate',
    a: "A label is a name followed by a colon in front of a loop. break with that label exits the labelled loop, even from inside a nested loop, and continue with a label skips to the next iteration of the outer loop. I use it rarely, mostly to stop searching a 2D grid as soon as I find something; often a small function with return is easier to read.",
    code: `const grid = [[1, 2], [3, 4], [5, 6]]
outer: for (const row of grid) {
  for (const n of row) {
    if (n === 2) continue outer   // skip to the next row
    if (n === 5) break outer      // exit both loops
    console.log(n)
  }
}`,
  },
  {
    q: 'Why does [10, 1, 5, 100].sort() give the wrong order?',
    level: 'Intermediate',
    a: "By default sort converts the items to strings and compares them alphabetically, so '100' comes before '5'. For numbers, I always pass a compare function: (a, b) => a - b for ascending, or b - a for descending.",
    code: `console.log([10, 1, 5, 100, 25].sort())
console.log([10, 1, 5, 100, 25].sort((a, b) => a - b))
console.log([10, 1, 5, 100, 25].sort((a, b) => b - a))`,
  },
  {
    q: 'setTimeout vs setInterval?',
    level: 'Basics',
    a: "setTimeout runs a function once after a delay. setInterval runs it repeatedly at that interval until I stop it with clearInterval. I always clear intervals when they're no longer needed, for example in a React useEffect cleanup, to avoid memory leaks.",
    code: `setTimeout(() => console.log('setTimeout: runs once'), 50)

let count = 0
const id = setInterval(() => {
  count++
  console.log('setInterval: tick', count)
  if (count === 3) clearInterval(id)   // stop it
}, 60)`,
  },
  {
    q: 'What is callback hell and how do you avoid it?',
    level: 'Intermediate',
    a: "Callback hell is when async steps are nested inside each other's callbacks, so the code keeps moving to the right and becomes hard to read and handle errors in. I avoid it with promises and especially async/await, which make the same steps read top to bottom.",
    code: `const step = (name, done) => setTimeout(() => { console.log(name); done() }, 10)
// Callback hell: each step nested inside the last
step('1. login', () => {
  step('2. get user', () => {
    step('3. get orders', () => {})
  })
})

// Same steps with async/await: flat and readable
const stepAsync = (name) => new Promise((resolve) => step(name, resolve))
setTimeout(async () => {
  await stepAsync('A. login')
  await stepAsync('B. get user')
}, 100)`,
  },
  {
    q: 'Run promises in sequence vs in parallel?',
    level: 'Intermediate',
    a: "If I await each promise one after another, they run in sequence and the total time adds up. If the tasks don't depend on each other, I start them together with Promise.all, so they run in parallel and the total time is only as long as the slowest one.",
    code: `const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const since = (start) => Math.round((Date.now() - start) / 50) * 50 + 'ms'

async function run() {
  let start = Date.now()
  await wait(50)
  await wait(50)
  console.log('sequence: about', since(start))   // times add up
  start = Date.now()
  await Promise.all([wait(50), wait(50)])
  console.log('parallel: about', since(start))   // only the slowest
}
run()`,
  },
  {
    q: 'How do you handle errors with async/await?',
    level: 'Intermediate',
    a: "I wrap the await calls in try/catch. If the promise rejects, the error goes to catch, where I can show a message to the user. I use finally for things that must always happen, like turning off a loading state.",
    code: `async function load() {
  try {
    const data = await Promise.reject(new Error('Network error'))   // a failing API call
    console.log('Data:', data)
  } catch (error) {
    console.log('Failed:', error.message)
  } finally {
    console.log('Loading finished')
  }
}
load()`,
  },
  {
    q: 'Event loop puzzle: microtasks vs macrotasks?',
    level: 'Advanced',
    a: "Microtasks are promise callbacks and queueMicrotask; macrotasks are things like setTimeout and setInterval callbacks. After the synchronous code finishes, the engine empties the whole microtask queue before it takes the next macrotask. And after every single macrotask, it empties the microtask queue again, which is why the microtask inside timeout 1 runs before timeout 2.",
    code: `console.log('1. sync')
setTimeout(() => {
  console.log('5. timeout 1')
  Promise.resolve().then(() => console.log('6. microtask inside timeout 1'))
}, 0)
setTimeout(() => console.log('7. timeout 2'), 0)
Promise.resolve().then(() => console.log('3. microtask'))
queueMicrotask(() => console.log('4. queueMicrotask'))
console.log('2. sync')`,
  },
  {
    q: 'Event loop puzzle with async/await: guess the order.',
    level: 'Advanced',
    a: "An async function runs synchronously until its first await, so 'first starts' and the whole of second() log straight away. Everything after an await is scheduled as a microtask, just like a .then callback, so it runs after the current synchronous code finishes but before any setTimeout. The await continuation was queued before the .then here, so it logs first. My rule of thumb is: sync code, then microtasks in the order they were queued, then timers.",
    code: `async function first() {
  console.log('2. first starts')
  await second()
  console.log('5. after await in first')
}
const second = async () => console.log('3. second runs synchronously')

console.log('1. script start')
setTimeout(() => console.log('7. setTimeout'), 0)
first()
Promise.resolve().then(() => console.log('6. promise then'))
console.log('4. script end')`,
  },
  {
    q: 'How does Promise chaining work? What does .then return?',
    level: 'Advanced',
    a: "Every .then returns a new promise, and whatever I return from its callback becomes the value for the next .then. If I return a promise, the chain waits for it to settle before moving on. If I forget to return, the next .then gets undefined, which is a very common bug.",
    code: `const double = (n) => new Promise((resolve) => setTimeout(() => resolve(n * 2), 20))

Promise.resolve(5)
  .then((n) => n + 1)          // returns a plain value: 6
  .then((n) => double(n))      // returns a promise: the chain waits
  .then((n) => {
    console.log('result:', n)
    // forgot to return here
  })
  .then((n) => console.log('next .then gets:', n))`,
  },
  {
    q: 'Promise states puzzle: can a promise settle twice?',
    level: 'Advanced',
    a: "A promise has three states: pending, fulfilled or rejected. Once it's fulfilled or rejected, it's settled and can never change again, so any later resolve or reject calls are simply ignored. Another catch is that the executor function runs synchronously, straight away; only the .then callbacks are asynchronous.",
    code: `const p = new Promise((resolve, reject) => {
  console.log('1. executor runs immediately')
  resolve('first')
  resolve('second')     // ignored
  reject('error')       // ignored
})

p.then((value) => console.log('3. value:', value))
console.log('2. sync code after creating the promise')`,
  },
  {
    q: 'What does an async function return?',
    level: 'Intermediate',
    a: "An async function always returns a promise, even when I return a plain value; the value is wrapped in a resolved promise. If the function throws, the returned promise is rejected instead. So the caller has to await it or use .then to get the actual value; logging the call directly shows a Promise, not the data.",
    code: `async function getNumber() {
  return 42
}

const result = getNumber()
console.log(result instanceof Promise)   // true, not 42!
result.then((v) => console.log('then:', v))

async function fail() { throw new Error('Oops') }
fail().catch((e) => console.log('caught:', e.message))`,
  },
  {
    q: 'What happens to an error in a promise chain without a catch in between?',
    level: 'Advanced',
    a: "A rejection skips every .then after it until it reaches the nearest .catch, just like a thrown error jumps to the nearest catch block. After the .catch handles it, the chain continues normally with whatever the catch returned. If there's no catch at all, I get an 'Uncaught (in promise)' error, so I always end a chain with .catch.",
    code: `Promise.resolve(1)
  .then(() => { throw new Error('step 1 failed') })
  .then(() => console.log('step 2: skipped'))
  .catch((e) => {
    console.log('catch:', e.message)
    return 'recovered'
  })
  .then((value) => console.log('after catch:', value))`,
  },
  {
    q: 'What is Promise.any?',
    level: 'Intermediate',
    a: "Promise.any resolves with the first promise that fulfills and ignores rejections along the way. It only rejects if every promise rejects, and then it gives an AggregateError holding all the reasons. That's the difference from Promise.race, which settles with the first result even if it's a failure. I'd use any for trying several servers and taking the first one that succeeds.",
    code: `const fail = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('down')), ms))
const ok = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms))

Promise.any([fail(10), ok(50, 'server B')]).then((v) => console.log('any:', v))
Promise.race([fail(10), ok(50, 'server B')]).catch((e) => console.log('race:', e.message))
Promise.any([fail(10), fail(20)]).catch((e) => console.log('all failed:', e.name))`,
  },
  {
    q: 'What is AbortController?',
    level: 'Advanced',
    a: "AbortController lets me cancel async work, most commonly a fetch request. I pass controller.signal to fetch, and calling controller.abort() makes the promise reject with an AbortError. In React I use it in a useEffect cleanup, so the request for an old search term is cancelled when the user types again. Here I use a fake fetch that listens to the signal the same way.",
    code: `function fakeFetch(url, { signal }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('data from ' + url), 100)
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
  })
}

const controller = new AbortController()
fakeFetch('/api/users', { signal: controller.signal })
  .then((data) => console.log(data))
  .catch((e) => console.log(e.name))
setTimeout(() => controller.abort(), 30)   // cancel after 30ms`,
  },
  {
    q: 'What are compose and pipe?',
    level: 'Advanced',
    a: "Both combine small functions into one. pipe runs the functions from left to right, passing each result into the next one. compose does the same from right to left, like in math. I implement them with reduce and reduceRight.",
    code: `const pipe = (...fns) => (x) => fns.reduce((value, fn) => fn(value), x)
const compose = (...fns) => (x) => fns.reduceRight((value, fn) => fn(value), x)

const add2 = (n) => n + 2
const double = (n) => n * 2

console.log(pipe(add2, double)(5))      // (5 + 2) * 2
console.log(compose(add2, double)(5))   // 5 * 2 + 2`,
  },
  {
    q: 'Write a function that runs only once.',
    level: 'Coding round',
    a: "I use a closure with a flag. The first time, I run the function, save the result and set the flag. Every later call skips the function and returns the saved result. It's useful for things like initializing a library only once.",
    code: `function once(fn) {
  let called = false
  let result
  return (...args) => {
    if (!called) result = fn(...args)
    called = true
    return result
  }
}

const init = once(() => {
  console.log('Initializing...')
  return 'ready'
})
console.log(init(), init())   // initializes only once`,
  },
  {
    q: 'Implement an LRU cache.',
    level: 'Coding round',
    a: "LRU means Least Recently Used: when the cache is full, it removes the item that hasn't been used for the longest time. A Map keeps keys in insertion order, so I delete and re-insert a key whenever it's read or written to move it to the end, and the first key is always the oldest one. Both get and put are O(1), which is what interviewers usually ask for.",
    code: `class LRUCache {
  map = new Map()   // oldest key first
  constructor(limit) { this.limit = limit }
  get(key) {
    if (!this.map.has(key)) return -1
    const value = this.map.get(key)
    this.put(key, value)   // move to the newest position
    return value
  }
  put(key, value) {
    this.map.delete(key)
    this.map.set(key, value)
    if (this.map.size > this.limit) this.map.delete(this.map.keys().next().value)
  }
}
const cache = new LRUCache(2)
cache.put('a', 1)
cache.put('b', 2)
cache.get('a')      // a is now the most recent
cache.put('c', 3)   // full: evicts b, the oldest
console.log([...cache.map.keys()])   // ['a', 'c']`,
  },
  {
    q: 'Implement an event emitter (on, off, once, emit).',
    level: 'Coding round',
    a: "I keep an object that maps each event name to a list of listener functions. on adds a listener, off filters it out, and emit calls every listener with the arguments. once wraps the listener in a function that removes itself before calling it. I loop over a copy of the list in emit, so removing a listener during an emit doesn't skip the next one.",
    code: `class EventEmitter {
  events = {}
  on(name, fn) { (this.events[name] ||= []).push(fn) }
  off(name, fn) { this.events[name] = this.events[name]?.filter((f) => f !== fn) }
  once(name, fn) {
    const wrapper = (...args) => { this.off(name, wrapper); fn(...args) }
    this.on(name, wrapper)
  }
  emit(name, ...args) { [...(this.events[name] || [])].forEach((fn) => fn(...args)) }
}

const bus = new EventEmitter()
bus.once('login', (user) => console.log('first login only:', user))
bus.emit('login', 'Anu')
bus.emit('login', 'Ravi')   // the once listener removed itself`,
  },
  {
    q: 'Retry a failing promise with exponential backoff.',
    level: 'Coding round',
    a: "I call the function in a loop, and if it throws, I wait and try again, doubling the wait each time, like 20, 40, 80 milliseconds, so I don't hammer a server that's already struggling. After the last retry I rethrow the error so the caller can handle it. In production I also add random jitter to the delay and only retry errors that make sense, like network errors or a 503, not a 400.",
    code: `async function retry(fn, retries = 3, delay = 20) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn()
    } catch (e) {
      if (attempt > retries) throw e
      const wait = delay * 2 ** (attempt - 1)   // 20, 40, 80ms
      console.log('attempt', attempt, 'failed, retrying in', wait + 'ms')
      await new Promise((resolve) => setTimeout(resolve, wait))
    }
  }
}
let calls = 0
const flaky = async () => (++calls < 3 ? Promise.reject(new Error('fail')) : 'ok on call ' + calls)
retry(flaky).then((data) => console.log(data))`,
  },
  {
    q: 'Add a timeout to a promise with Promise.race.',
    level: 'Coding round',
    a: "I race the real promise against a second promise that rejects after the given time, so whichever settles first wins. In real code I also clear the timer in finally, so it doesn't keep running after a fast response. Note that this doesn't cancel the slow work itself; for fetch I'd also pass an AbortSignal, or use AbortSignal.timeout(ms).",
    code: `function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timed out after ' + ms + 'ms')), ms)
  )
  return Promise.race([promise, timeout])
}

const slow = new Promise((resolve) => setTimeout(() => resolve('slow'), 200))
withTimeout(slow, 50).catch((e) => console.log('error:', e.message))`,
  },
  {
    q: 'Run async tasks with a concurrency limit (N at a time).',
    level: 'Coding round',
    a: "I start N workers, and each worker keeps taking the next task index from a shared counter until there are none left. That way there are never more than N tasks running, and a new one starts as soon as any finishes. I store each result at its original index, so the results come back in the same order as the tasks. It's useful for uploading many files without opening hundreds of requests at once.",
    code: `async function runWithLimit(tasks, limit) {
  const results = []
  let next = 0
  async function worker() {
    while (next < tasks.length) {
      const index = next++
      console.log('start task', index)
      results[index] = await tasks[index]()
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))
  return results
}

const task = (ms) => () => new Promise((resolve) => setTimeout(() => resolve(ms), ms))
runWithLimit([task(50), task(10), task(20), task(10)], 2).then((r) => console.log('results:', r))`,
  },
  {
    q: "Get a nested value by a path string like 'a.b.c'.",
    level: 'Coding round',
    a: "I split the path on dots into a list of keys, and then walk down the object one key at a time. If I hit null or undefined along the way, I return the default value instead of throwing. It's what lodash's get does, and lodash also supports brackets like tags[1]; for a fixed path in my own code I'd just use optional chaining.",
    code: `function get(obj, path, defaultValue) {
  let current = obj
  for (const key of path.split('.')) {
    if (current == null) return defaultValue
    current = current[key]
  }
  return current ?? defaultValue
}

const data = { user: { address: { city: 'Kochi' } } }
console.log(get(data, 'user.address.city'))         // Kochi
console.log(get(data, 'user.phone.number', 'N/A'))  // N/A`,
  },
  {
    q: 'Flatten a nested object into dot-notation keys.',
    level: 'Coding round',
    a: "I loop over the entries with recursion, building the key path as I go down. If a value is a plain object, I recurse with the longer prefix; otherwise I store it under the full path. I treat arrays as values here, but I could recurse into them too if the interviewer wants keys like tags.0. It's handy for form libraries and translation files.",
    code: `function flattenObject(obj, prefix = '', result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? prefix + '.' + key : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, path, result)
    } else {
      result[path] = value
    }
  }
  return result
}

console.log(flattenObject({ app: { name: 'Shop', theme: { dark: false } }, tags: ['a'] }))`,
  },
  {
    q: "String compression: turn 'aaabb' into 'a3b2'.",
    level: 'Coding round',
    a: "I walk through the string once with a counter: while the next character is the same I increase the count, and when it changes I add the character and its count to the result and reset the count. That's O(n). A common follow-up is to return the original string when the compressed one isn't shorter, like for 'abc'.",
    code: `function compress(str) {
  let result = ''
  let count = 1
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) {
      count++
    } else {
      result += str[i] + count
      count = 1
    }
  }
  return result.length < str.length ? result : str
}

console.log(compress('aaabb'), compress('abc'))   // a3b2 abc`,
  },
  {
    q: 'Find the longest substring without repeating characters.',
    level: 'Coding round',
    a: "I use a sliding window with two pointers and a Map of the last index where I saw each character. I move the end pointer forward, and when the character already appears inside the window, I jump the start pointer just past its previous position. Each character is visited once, so it's O(n) instead of checking every substring.",
    code: `function longestUnique(s) {
  const lastSeen = new Map()
  let start = 0
  let best = ''
  for (let end = 0; end < s.length; end++) {
    if (lastSeen.get(s[end]) >= start) start = lastSeen.get(s[end]) + 1   // jump past the repeat
    lastSeen.set(s[end], end)
    if (end - start + 1 > best.length) best = s.slice(start, end + 1)
  }
  return best
}

console.log(longestUnique('abcabcbb'), longestUnique('pwwkew'))   // abc wke`,
  },
  {
    q: 'Print a matrix in spiral order.',
    level: 'Coding round',
    a: "I keep four boundaries: top, bottom, left and right. I walk right along the top row, down the right column, left along the bottom row and up the left column, shrinking the matching boundary after each side. The checks before the bottom row and left column stop me from visiting a row or column twice when the matrix isn't square.",
    code: `function spiral(matrix) {
  const result = []
  let top = 0, bottom = matrix.length - 1
  let left = 0, right = matrix[0].length - 1
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push(matrix[top][c])
    top++
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right])
    right--
    if (top <= bottom) for (let c = right; c >= left; c--) result.push(matrix[bottom][c])
    bottom--
    if (left <= right) for (let r = bottom; r >= top; r--) result.push(matrix[r][left])
    left++
  }
  return result
}

console.log(spiral([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))`,
  },
  {
    q: 'Implement binary search.',
    level: 'Coding round',
    a: "Binary search only works on a sorted array. I look at the middle element: if it's the target I'm done, if it's smaller I search the right half, otherwise the left half. Each step halves the range, so it's O(log n), which means about 20 steps for a million items.",
    code: `function binarySearch(sorted, target) {
  let low = 0
  let high = sorted.length - 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    if (sorted[mid] === target) return mid
    if (sorted[mid] < target) low = mid + 1   // search the right half
    else high = mid - 1                       // search the left half
  }
  return -1
}

console.log(binarySearch([2, 5, 8, 12, 16, 23, 38, 56], 23))   // 5`,
  },
  {
    q: 'Merge overlapping intervals.',
    level: 'Coding round',
    a: "First I sort the intervals by their start. Then I go through them, and if the current interval starts before or at the end of the last merged one, they overlap, so I extend the end; otherwise I start a new merged interval. Sorting makes it O(n log n). I copy the intervals so I don't change the caller's arrays.",
    code: `function mergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0])
  const merged = []
  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1]
    if (last && start <= last[1]) last[1] = Math.max(last[1], end)   // overlap: extend
    else merged.push([start, end])
  }
  return merged
}

console.log(mergeIntervals([[1, 3], [8, 10], [2, 6], [15, 18]]))`,
  },
]

function Card({ title, note, code, output, isQuestion, autoLog }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-indigo-600">{title}</h3>
          <TryItButton open={open} onClick={() => setOpen(!open)} />
        </div>
        {isQuestion && (
          <p className="mt-3 text-xs font-semibold text-slate-400 uppercase">Answer</p>
        )}
        <p className="mt-1 text-sm leading-relaxed text-slate-700">{note}</p>

        <p className="mt-3 text-xs font-semibold text-slate-400 uppercase">Example</p>
        <CodeBlock code={code} language="javascript" className="mt-1" />
      </div>

      <div className="flex min-w-0 flex-col">
        <p className="text-xs font-semibold text-slate-400 uppercase">Output</p>
        <pre className="mt-1 flex-1 overflow-x-auto rounded-lg bg-emerald-50 p-3 font-mono text-sm text-emerald-800">
          {output}
        </pre>
      </div>

      {open && (
        <div className="min-w-0 md:col-span-2">
          <TryIt kind="js" code={autoLog ? addConsoleLogs(code) : code} />
        </div>
      )}
    </div>
  )
}

function JavaScript() {
  const [outputs, setOutputs] = useState([])

  useEffect(() => {
    let cancelled = false
    Promise.all(questions.map((item) => runCode(item.code))).then((results) => {
      if (!cancelled) setOutputs(results)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">JavaScript</h1>
      <div className="mt-3 flex gap-2 text-sm">
        <a href="#basics" className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 hover:bg-indigo-100">
          Basics ({basics.length})
        </a>
        <a href="#questions" className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 hover:bg-indigo-100">
          Interview Questions ({questions.length})
        </a>
      </div>

      <h2 id="basics" className="mt-8 scroll-mt-14 text-xl font-bold text-slate-900">Basics</h2>
      <LevelSections
        questions={basics}
        topics={basicsTopics}
        showLevels={false}
        idPrefix="b-"
        renderItem={(ex, number) => (
          <Card
            key={ex.title}
            isQuestion
            autoLog
            title={'Q' + number + '. ' + ex.title}
            note={ex.note}
            code={ex.code}
            output={JSON.stringify(ex.result, null, 2)}
          />
        )}
      />

      <h2 id="questions" className="mt-12 scroll-mt-14 text-xl font-bold text-slate-900">
        Interview Questions
      </h2>
      <div className="mt-4 space-y-4">
        <LevelSections
          questions={questions}
          topics={topics}
          idPrefix="q-"
          renderItem={(item, number) => {
            const index = questions.indexOf(item)
            return (
              <Card
                key={item.q}
                isQuestion
                title={'Q' + number + '. ' + item.q}
                note={item.a}
                code={item.code}
                output={outputs[index] ? outputs[index].join('\n') : 'Running...'}
              />
            )
          }}
        />
      </div>
    </div>
  )
}

export default JavaScript
