// Source of truth for src/pages/typescriptQuestionsData.js (built by gen.mjs).
// kind: 'error'  -> output = real tsc errors (code must fail type-checking)
//       'prints' -> output = real node stdout (code must type-check cleanly)
//       'both'   -> tsc errors, then the stdout when the JS runs anyway
// run:  'strip' (default, node file.ts), 'transform' (--experimental-transform-types),
//       'tsc' (compile with tsc, then run the .js)
// tsx: true -> file is main.tsx (React examples)
// flags: extra tsc flags. project: true -> code holds a tsconfig.json, run tsc -p.
// Lines '// file: name' split the example into several files (the last .ts file runs).

export const questions = [
  // ---------------------------------------------------------------- Basics
  {
    q: 'What is TypeScript and why use it?',
    level: 'Basics',
    kind: 'both',
    a: "TypeScript is JavaScript with static types added on top; the compiler checks my code and then strips the types to plain JavaScript. It catches mistakes like wrong argument types or typos before the code ever runs, and it gives my editor great autocomplete and safe refactoring. On a big team I find the types also work as always-up-to-date documentation.",
    code: `function add(a: number, b: number) {
  return a + b
}

console.log(add(2, 3))
console.log(add(2, "3"))   // TS flags this, plain JS would not`,
  },
  {
    q: 'What is the difference between TypeScript and JavaScript (compile time vs runtime)?',
    level: 'Basics',
    kind: 'prints',
    a: "TypeScript only exists at compile time: tsc checks the types and then erases them, so the browser or Node just runs normal JavaScript. That means types can't protect me from bad data that arrives at runtime, like a JSON response with the wrong shape. So I trust types for my own code, but I still validate anything coming from outside.",
    code: `type User = { name: string }

// The compiler trusts this, but the real data has a number
const user: User = JSON.parse('{"name": 42}')

console.log(typeof user.name)   // types are gone at runtime`,
  },
  {
    q: 'What are the basic types in TypeScript?',
    level: 'Basics',
    kind: 'prints',
    a: "The primitives I use most are string, number, boolean, plus null and undefined. For arrays I write number[] or Array<string>, and for a fixed-length array where each position has its own type I use a tuple like [string, number]. A tuple is handy for small pairs, like the [value, setValue] that useState returns.",
    code: `let user: string = "Ann"
let age: number = 30
let active: boolean = true
let scores: number[] = [90, 85]
let tags: Array<string> = ["ts", "js"]
let entry: [string, number] = ["age", 30]   // tuple

console.log(user, age, active)
console.log(scores, tags, entry)`,
  },
  {
    q: 'What is type inference?',
    level: 'Basics',
    kind: 'error',
    a: "Type inference means TypeScript works out the type from the value, so I don't have to annotate everything. A let gets the wider type like number, while a const gets the exact literal type. My rule is to let inference handle local variables and to annotate function parameters and public return types.",
    code: `let count = 5            // inferred: number
const status = "ok"      // inferred: "ok" (a literal)
const list = [1, 2, 3]   // inferred: number[]

count = "five"`,
  },
  {
    q: 'What is the difference between any and unknown?',
    level: 'Basics',
    kind: 'error',
    a: "any switches type checking off completely, so anything goes and bugs slip through. unknown also accepts any value, but I must narrow it before I can use it. I use unknown instead of any for data from an API or JSON.parse, because it forces me to check the type first.",
    code: `let a: any = "hi"
a.foo()            // no error here, crashes at runtime

let u: unknown = "hi"
u.toUpperCase()    // error: must check first

if (typeof u === "string") {
  u.toUpperCase()  // ok after narrowing
}`,
  },
  {
    q: 'What is the difference between object, Object and {}?',
    level: 'Intermediate',
    kind: 'error',
    a: "object means any non-primitive value, like an object, array or function. {} (and Object) are much looser: they accept every value except null and undefined, so even a string or number fits. When I want \"a plain object with some keys\" I write Record<string, unknown> instead of {}, because {} catches almost nothing.",
    code: `let a: object = { x: 1 }     // any non-primitive
let b: {} = "hi"             // anything except null / undefined
let c: Record<string, unknown> = { x: 1 }   // a plain object

a = "hi"     // string is a primitive
b = 42       // fine
b = null`,
  },
  {
    q: 'What is the difference between void and never?',
    level: 'Basics',
    kind: 'prints',
    a: "void means a function returns nothing useful, like a logger that just prints. never means the function never returns at all, because it always throws or loops forever. never is also the type left over when narrowing has removed every option, which I use for exhaustive checks.",
    code: `function log(msg: string): void {
  console.log("log:", msg)
}

function fail(msg: string): never {
  throw new Error(msg)
}

log("saved")
try { fail("boom") } catch (e) { console.log((e as Error).message) }`,
  },
  {
    q: 'How do you type function parameters, return values, optional and default params?',
    level: 'Basics',
    kind: 'prints',
    a: "I annotate each parameter, and optionally the return type after the parentheses. A ? makes a parameter optional (its type becomes T | undefined), and a default value makes it optional and infers its type. I always annotate return types on exported functions so a change inside can't silently change the public API.",
    code: `function greet(name: string, greeting = "Hello", end?: string): string {
  return \`\${greeting}, \${name}\${end ?? ""}\`
}

const square = (n: number): number => n * n

console.log(greet("Ann"))
console.log(greet("Bob", "Hi", "!"))
console.log(square(4))`,
  },
  {
    q: 'What are union types?',
    level: 'Basics',
    kind: 'prints',
    a: "A union type, written A | B, means the value can be one of several types. Before I use something specific to one member, I narrow it with a check like typeof. I use unions a lot for IDs that can be a string or a number, and for values that can be null.",
    code: `function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase())
  } else {
    console.log(id.toFixed(1))
  }
}

printId("ab12")
printId(42)`,
  },
  {
    q: 'What are literal types?',
    level: 'Basics',
    kind: 'error',
    a: "A literal type is one exact value, like \"up\" or 6, used as a type. Combined in a union it gives me a small fixed set of allowed values, which is like an enum with no runtime code. I use this for things like button variants or HTTP methods so typos are caught right away.",
    code: `type Direction = "up" | "down"
type Dice = 1 | 2 | 3 | 4 | 5 | 6

function move(dir: Direction) { return dir }

move("up")
move("left")
const roll: Dice = 7`,
  },
  {
    q: 'What is a type alias?',
    level: 'Basics',
    kind: 'prints',
    a: "A type alias gives a name to any type with the type keyword: an object shape, a union, a function type or a tuple. It doesn't create a new type, it is just a reusable name. I use aliases to keep long unions and function signatures readable and in one place.",
    code: `type ID = string | number
type User = { id: ID; name: string }
type Greet = (user: User) => string

const greet: Greet = (u) => \`Hi \${u.name} (#\${u.id})\`

console.log(greet({ id: 7, name: "Ann" }))`,
  },
  {
    q: 'What is an interface?',
    level: 'Basics',
    kind: 'error',
    a: "An interface describes the shape of an object: which properties it has and their types. Interfaces can extend other interfaces, so I can build bigger shapes from smaller ones. If an object is missing a required property, the compiler tells me exactly which one.",
    code: `interface User {
  id: number
  name: string
}

interface Admin extends User {
  role: string
}

const admin: Admin = { id: 1, name: "Ann" }`,
  },
  {
    q: 'What is the difference between interface and type?',
    level: 'Basics',
    kind: 'prints',
    a: "Both can describe object shapes and are mostly interchangeable. An interface can be reopened and merged (declaration merging) and extended with extends, while a type alias can also name unions, tuples and mapped or conditional types. I use interface for object shapes and public APIs, and type for unions and anything more computed.",
    code: `interface Animal { name: string }
interface Animal { age: number }           // merges with the one above
interface Dog extends Animal { breed: string }

type Status = "on" | "off"                 // unions need a type alias
type Pair = [string, number]               // so do tuples

const dog: Dog = { name: "Rex", age: 3, breed: "lab" }
const s: Status = "on"
const p: Pair = ["a", 1]
console.log(dog, s, p)`,
  },
  {
    q: 'What are optional and readonly properties?',
    level: 'Basics',
    kind: 'error',
    a: "A ? after a property name makes it optional, so its type becomes T | undefined. readonly means the property can be set when the object is created but not reassigned later. I mark IDs and config values readonly; it is only a compile-time check, so for real runtime freezing I'd use Object.freeze.",
    code: `interface User {
  readonly id: number
  name: string
  email?: string        // optional
}

const u: User = { id: 1, name: "Ann" }   // email can be left out
u.name = "Anna"         // ok
u.id = 2`,
  },
  {
    q: 'What are enums, and what do you use instead?',
    level: 'Basics',
    kind: 'prints',
    run: 'transform',
    a: "An enum is a named set of constants; numeric enums count up from 0 and also map back from number to name, and string enums hold fixed strings. Unlike most TS features, enums generate real JavaScript objects, and a const enum is inlined at compile time instead. In new code I usually prefer a union of string literals or an object with as const, because they have no extra runtime code and work with Node's type stripping.",
    code: `enum Role { Admin, User, Guest }
enum Status { Active = "ACTIVE", Banned = "BANNED" }

console.log(Role.Admin, Role.User, Role[2])
console.log(Status.Active)

// My usual alternative: no enum at all
const Size = { Small: "sm", Large: "lg" } as const
type Size = (typeof Size)[keyof typeof Size]   // "sm" | "lg"
const s: Size = Size.Large
console.log(s)`,
  },
  {
    q: 'What is a type assertion (as)?',
    level: 'Basics',
    kind: 'both',
    a: "A type assertion with as tells the compiler \"trust me, this value has this type\"; it does not convert or check anything at runtime. I use it rarely, for example after JSON.parse when I know the shape. TypeScript blocks assertions between unrelated types like string to number, which is a good hint that I'm doing something wrong.",
    code: `const raw = '{"id": 1, "name": "Ann"}'
const user = JSON.parse(raw) as { id: number; name: string }
console.log(user.name.toUpperCase())

const value: unknown = "hello"
console.log((value as string).length)

const n = "5" as number   // unrelated types: blocked`,
  },
  {
    q: 'What is the non-null assertion operator (!)?',
    level: 'Basics',
    kind: 'prints',
    a: "Putting ! after an expression tells TypeScript the value is not null or undefined, removing those from its type. It is only a promise to the compiler, so if I'm wrong it fails at runtime. I prefer a real check or ?. and ??, and only use ! when I truly know, like an element I just created.",
    code: `const ages = new Map([["ann", 30]])

const a = ages.get("ann")!   // I promise it exists
console.log(a + 1)

const b = ages.get("bob")!   // a wrong promise...
console.log(b + 1)           // ...gives NaN, no error`,
  },
  {
    q: 'How do null and undefined work with strictNullChecks?',
    level: 'Basics',
    kind: 'error',
    a: "With strictNullChecks on (part of strict), null and undefined are not allowed in other types unless I add them, like string | null. So the compiler makes me handle the missing case before I call a method. This flag alone catches a huge number of \"cannot read properties of undefined\" bugs, so I never turn it off.",
    code: `function shout(name?: string) {
  return name.toUpperCase()
}

function shoutSafe(name?: string) {
  return name?.toUpperCase() ?? "NO NAME"
}

let city: string = null`,
  },
  {
    q: 'What are the basics of tsconfig.json (strict, target, module)?',
    level: 'Basics',
    kind: 'error',
    project: true,
    a: "tsconfig.json holds the compiler options for a project. target sets which JavaScript version is emitted, module sets the module system (like nodenext or esnext), and strict turns on all the strict type checks. I always start new projects with strict: true, because adding it later means fixing hundreds of errors at once.",
    code: `// file: tsconfig.json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "nodenext",
    "strict": true,
    "noEmit": true
  }
}
// file: main.ts
function double(x) {
  return x * 2
}`,
  },
  {
    q: 'What does noImplicitAny do?',
    level: 'Basics',
    kind: 'error',
    a: "noImplicitAny reports an error whenever TypeScript can't work out a type and would silently fall back to any. Without it, an unannotated parameter is any and every typo on it slips through. It's part of strict, and when I migrate a JavaScript project I turn it on early because it shows exactly where types are missing.",
    code: `function greet(name) {            // name would silently be any
  return "Hi " + name.toUpperCase()
}

function greetOk(name: string) {  // fixed with an annotation
  return "Hi " + name.toUpperCase()
}

[1, 2].map((n) => n * 2)          // fine: n is inferred from the array`,
  },
  {
    q: 'What does esModuleInterop do?',
    level: 'Intermediate',
    kind: 'prints',
    a: "esModuleInterop lets me use a normal default import, like import express from \"express\", for an old CommonJS module that sets module.exports. Without it I had to write import * as express, which breaks when the export is a function. Since TypeScript 6 it can't be turned off any more (esModuleInterop: false is an error in 7.0), so I just delete the setting from old configs.",
    code: `// file: greet.cjs
module.exports = (name) => "Hi " + name
// file: greet.d.cts
declare function greet(name: string): string
export = greet
// file: main.ts
import greet from "./greet.cjs"   // default import of CommonJS
console.log(greet("Ann"))`,
  },
  {
    q: 'What does skipLibCheck do?',
    level: 'Intermediate',
    kind: 'error',
    project: true,
    a: "skipLibCheck tells tsc not to type-check .d.ts files, so it only checks my own .ts code. It makes builds faster and avoids errors from two libraries whose type definitions clash, which is why most templates set it to true. The trade-off is that a mistake in my own .d.ts files is also skipped, like the typo below that only shows up with skipLibCheck off.",
    code: `// file: tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": false,
    "noEmit": true
  }
}
// file: legacy.d.ts
declare function oldApi(): Promis<string>   // typo in a .d.ts
// file: main.ts
oldApi()`,
  },
  {
    q: 'How do you set up path aliases with paths (and why not baseUrl)?',
    level: 'Intermediate',
    kind: 'error',
    project: true,
    a: "paths maps an alias like @/* to a folder, so I can import \"@/utils/date\" instead of \"../../../utils/date\". In TypeScript 7 baseUrl is removed, so I write the paths relative to tsconfig.json, like \"./src/*\". tsc doesn't rewrite the imports, so I always add the same alias in my bundler too, for example resolve.alias in Vite.",
    code: `// file: tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
// file: main.ts
export {}`,
  },

  // ---------------------------------------------------------------- Intermediate
  {
    q: 'How does type narrowing work?',
    level: 'Intermediate',
    kind: 'prints',
    a: "Narrowing is when TypeScript refines a union to a smaller type inside a branch, based on checks I write. typeof, truthiness checks, equality checks like === null, and early returns all narrow the type. I write code in a guard-and-return style, so after the checks the rest of the function works with one simple type.",
    code: `function format(value: string | number | null) {
  if (value === null) return "empty"              // equality
  if (typeof value === "string") return value.toUpperCase()
  return value.toFixed(2)                         // only number left
}

console.log(format("hi"))
console.log(format(3.14159))
console.log(format(null))`,
  },
  {
    q: 'How do you narrow with in and instanceof?',
    level: 'Intermediate',
    kind: 'prints',
    a: "The in operator checks if a property exists, which narrows unions of object types. instanceof checks the class of a value, so it works for class instances like Date or Error. I use instanceof Error in catch blocks, because the caught value is unknown.",
    code: `type Fish = { swim: () => string }
type Bird = { fly: () => string }

function move(pet: Fish | Bird) {
  return "swim" in pet ? pet.swim() : pet.fly()
}

function describe(x: Date | Error) {
  return x instanceof Date ? x.getFullYear() : x.message
}

console.log(move({ fly: () => "flying" }), describe(new Error("oops")))`,
  },
  {
    q: 'What is a discriminated union?',
    level: 'Intermediate',
    kind: 'prints',
    a: "A discriminated union is a union of object types that all share one literal property, like status or kind. Checking that property narrows the value to exactly one member, so I get the right fields in each branch. I model API states and Redux actions this way, because it makes impossible states impossible.",
    code: `type Result =
  | { status: "ok"; data: string }
  | { status: "error"; message: string }

function show(r: Result) {
  if (r.status === "ok") return \`data: \${r.data}\`
  return \`error: \${r.message}\`
}

console.log(show({ status: "ok", data: "users" }))
console.log(show({ status: "error", message: "404" }))`,
  },
  {
    q: 'What is a custom type guard (x is Type)?',
    level: 'Intermediate',
    kind: 'prints',
    a: "A type guard is a function that returns a boolean and has the return type \"x is SomeType\". When it returns true, TypeScript narrows the argument to that type in the calling code. I use them to reuse a check in many places, and they work great with filter to get a clean typed array.",
    code: `function isString(x: unknown): x is string {
  return typeof x === "string"
}

const inputs: unknown[] = ["a", 1, "b", true]
const words = inputs.filter(isString)   // string[]

console.log(words.map((w) => w.toUpperCase()))`,
  },
  {
    q: 'What is an assertion function (asserts x is Type)?',
    level: 'Intermediate',
    kind: 'prints',
    a: "An assertion function either throws or returns normally, and its return type asserts x is Type tells TypeScript the value is that type after the call. It's like a type guard, but I don't need an if around it, so it reads like a plain check at the top of a function. I use it for things like assertIsDefined(user) when a missing value should really be an error.",
    code: `function assertString(x: unknown): asserts x is string {
  if (typeof x !== "string") throw new Error("Not a string")
}

const input: unknown = "hello"
assertString(input)
console.log(input.toUpperCase())   // narrowed to string after the call`,
  },
  {
    q: 'How do you make a switch exhaustive with never?',
    level: 'Advanced',
    kind: 'error',
    a: "In the default branch I assign the value to a variable of type never. If every case is handled, the value really is never there; if someone adds a new member to the union, the compiler errors at that line. I add this to every switch over a discriminated union so new cases can't be forgotten.",
    code: `type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; size: number }
  | { kind: "triangle"; base: number }   // newly added

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return 3.14 * s.r ** 2
    case "square": return s.size ** 2
    default: { const check: never = s; return check }
  }
}`,
  },
  {
    q: 'What are generics?',
    level: 'Intermediate',
    kind: 'prints',
    a: "Generics are type parameters, like <T>, that let one function or type work with many types while keeping the link between input and output. Instead of returning any, first<T> returns exactly the element type I passed in. TypeScript usually infers T from the arguments, so callers rarely need to write it.",
    code: `function first<T>(items: T[]): T | undefined {
  return items[0]
}

const n = first([1, 2, 3])      // T = number
const s = first(["a", "b"])     // T = string

console.log(n, s?.toUpperCase())`,
  },
  {
    q: 'What are generic constraints (extends)?',
    level: 'Intermediate',
    kind: 'both',
    a: "A constraint like <T extends { length: number }> limits which types T can be, so inside the function I can safely use what the constraint guarantees. Callers can still pass any type that matches, such as strings or arrays. I add constraints whenever a generic function needs to touch a property of T.",
    code: `function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}

console.log(longest("hello", "hi"))
console.log(longest([1, 2], [1, 2, 3]))
longest(10, 20)`,
  },
  {
    q: 'How do generic interfaces and default type parameters work?',
    level: 'Intermediate',
    kind: 'prints',
    a: "Interfaces and type aliases can take type parameters too, which is perfect for wrappers like an API response or a paginated list. A default like <T = unknown> is used when the caller doesn't pass a type. I use this for a shared ApiResponse<T> type so every endpoint has the same envelope with its own data type.",
    code: `interface ApiResponse<T = unknown> {
  data: T
  status: number
}

const user: ApiResponse<{ name: string }> = { data: { name: "Ann" }, status: 200 }
const raw: ApiResponse = { data: "anything", status: 500 }   // T = unknown

console.log(user.data.name, raw.status)`,
  },
  {
    q: 'What does keyof do?',
    level: 'Intermediate',
    kind: 'both',
    a: "keyof T gives a union of the property names of T as string literal types. Combined with generics, K extends keyof T lets me write functions that only accept real keys and return the matching value type T[K]. This catches typos in property names at compile time.",
    code: `type User = { name: string; age: number }
type Keys = keyof User   // "name" | "age"

function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const u: User = { name: "Ann", age: 30 }
console.log(get(u, "name"))
get(u, "email")`,
  },
  {
    q: 'What are typeof and indexed access types?',
    level: 'Intermediate',
    kind: 'error',
    a: "In a type position, typeof value gives me the type of an existing variable, so I can derive types from real objects instead of writing them twice. An indexed access type like User[\"address\"] reads the type of a property, and Arr[number] gives the element type of an array. I often combine them with as const to turn a constant array into a union type.",
    code: `const config = { port: 3000, host: "localhost" }
type Config = typeof config       // { port: number; host: string }

const ROLES = ["admin", "user"] as const
type Role = (typeof ROLES)[number]   // "admin" | "user"

type User = { address: { city: string } }
type City = User["address"]["city"]  // string

const r: Role = "guest"
const c: City = 42`,
  },
  {
    q: 'What do Partial, Required and Readonly do?',
    level: 'Intermediate',
    kind: 'error',
    a: "Partial<T> makes every property optional, Required<T> makes every property required, and Readonly<T> makes every property readonly. I use Partial for update functions that take only the changed fields, and Readonly for state or props I don't want mutated. They are all built-in mapped types, so they only work one level deep.",
    code: `type User = { name: string; email?: string }

const changes: Partial<User> = {}                 // all optional
const full: Required<User> = { name: "Ann" }      // email now required
const frozen: Readonly<User> = { name: "Bob" }
frozen.name = "Rob"`,
  },
  {
    q: 'What do Pick and Omit do?',
    level: 'Intermediate',
    kind: 'error',
    a: "Pick<T, Keys> builds a new type with only the listed properties, and Omit<T, Keys> builds one with everything except them. I use them to derive smaller types from a main model, like a public user type without the password. Deriving types this way keeps them in sync when the main type changes.",
    code: `type User = { id: number; name: string; password: string }

type Preview = Pick<User, "id" | "name">
type PublicUser = Omit<User, "password">

const p: Preview = { id: 1, name: "Ann" }
const u: PublicUser = { id: 1, name: "Ann", password: "x" }`,
  },
  {
    q: 'What is Record?',
    level: 'Intermediate',
    kind: 'prints',
    a: "Record<Keys, Value> builds an object type whose keys are Keys and whose values are all Value. With a union of literals as the keys, the compiler makes sure every key is present. I use Record<Role, number> style lookups for config, and Record<string, T> for simple dictionaries.",
    code: `type Role = "admin" | "user" | "guest"
const limits: Record<Role, number> = { admin: 100, user: 10, guest: 1 }
console.log(limits.user)

const prices: Record<string, number> = {}
prices.apple = 1.5
console.log(prices)`,
  },
  {
    q: 'What do Exclude, Extract and NonNullable do?',
    level: 'Intermediate',
    kind: 'error',
    a: "These work on union types: Exclude<U, X> removes the members that match X, Extract<U, X> keeps only those, and NonNullable<T> removes null and undefined. Pick and Omit are for object properties, while these are for union members. I use NonNullable a lot after filtering out empty values.",
    code: `type Status = "ok" | "error" | "loading"

type Done = Exclude<Status, "loading">   // "ok" | "error"
type Busy = Extract<Status, "loading">   // "loading"
type Name = NonNullable<string | null>   // string

const d: Done = "loading"`,
  },
  {
    q: 'What do ReturnType, Parameters and Awaited do?',
    level: 'Intermediate',
    kind: 'prints',
    a: "ReturnType<F> gives the return type of a function type and Parameters<F> gives its parameters as a tuple. Awaited<T> unwraps a Promise to the value it resolves to. I combine them with typeof to get types from functions I don't control, like a library's async fetch helper.",
    code: `async function getUser(id: number) {
  return { id, name: "Ann" }
}

type Args = Parameters<typeof getUser>      // [id: number]
type Ret = ReturnType<typeof getUser>       // Promise<{ id: number; name: string }>
type User = Awaited<Ret>                    // { id: number; name: string }

const args: Args = [7]
getUser(...args).then((u: User) => console.log(u))`,
  },
  {
    q: 'What do ConstructorParameters and InstanceType do?',
    level: 'Intermediate',
    kind: 'prints',
    run: 'tsc',
    a: "They are the class versions of Parameters and ReturnType. ConstructorParameters<typeof C> gives the tuple of arguments that new C(...) takes, and InstanceType<typeof C> gives the type of the object it creates. I use them in factory functions and dependency-injection helpers, so they stay in sync when the constructor changes.",
    code: `class User {
  constructor(public name: string, public age: number) {}
}

type Args = ConstructorParameters<typeof User>   // [name: string, age: number]
type U = InstanceType<typeof User>               // User

function create(...args: Args): U {
  return new User(...args)
}
console.log(create("Ann", 30))`,
  },
  {
    q: 'What does NoInfer do?',
    level: 'Advanced',
    kind: 'error',
    a: "NoInfer<T> tells TypeScript not to use that position when it infers the generic type. Below, C is inferred only from the colors array, so the initial value must be one of those colors. Without NoInfer, \"green\" would simply widen C to include it and the bug would pass.",
    code: `function pick<C extends string>(colors: C[], initial: NoInfer<C>) {
  return initial
}

pick(["red", "blue"], "red")     // ok
pick(["red", "blue"], "green")   // not in the list`,
  },
  {
    q: 'What does ThisType do?',
    level: 'Advanced',
    kind: 'prints',
    a: "ThisType<T> is a marker type that sets what this means inside the methods of an object literal. Libraries like the old Vue options API used it so that methods can use this.count even though count is defined in a separate data object. I rarely write it myself, but it explains how those APIs get typed this.",
    code: `function make<D, M>(o: { data: D; methods: M & ThisType<D & M> }) {
  return { ...o.data, ...o.methods } as D & M
}

const counter = make({
  data: { count: 0 },
  methods: { inc() { this.count++ } },   // this: { count: number } & methods
})
counter.inc()
console.log(counter.count)`,
  },
  {
    q: 'What are function overloads?',
    level: 'Intermediate',
    kind: 'prints',
    a: "Overloads are several signatures written above one implementation, so the return type can depend on which arguments were passed. Callers only see the overload signatures, not the implementation signature. I only reach for them when a union or a generic can't express the relationship, because they are harder to maintain.",
    code: `function parse(value: string): number
function parse(value: number): string
function parse(value: string | number) {
  return typeof value === "string" ? Number(value) : String(value)
}

const a = parse("42")   // number
const b = parse(7)      // string
console.log(a + 1, b + "!")`,
  },
  {
    q: 'What are access modifiers (public, private, protected)?',
    level: 'Intermediate',
    kind: 'both',
    a: "public members are usable everywhere (the default), protected ones only inside the class and its subclasses, and private ones only inside the class itself. These checks happen only at compile time, so the JavaScript still has the property. When I need real runtime privacy I use JavaScript's #private fields instead.",
    code: `class Account {
  public owner: string
  protected balance = 0
  private pin = "1234"
  constructor(owner: string) { this.owner = owner }
}
class Savings extends Account {
  addInterest() { this.balance *= 1.05 }   // ok: protected
}

const acc = new Savings("Ann")
console.log(acc.owner)
console.log(acc.pin)`,
  },
  {
    q: 'What are readonly class fields and parameter properties?',
    level: 'Intermediate',
    kind: 'both',
    run: 'transform',
    a: "A modifier like public, private or readonly on a constructor parameter turns it into a class property and assigns it for me, which saves a lot of boilerplate. readonly means the property can only be set in the constructor. Parameter properties generate code, so Node's plain type stripping can't run them; with erasableSyntaxOnly projects I write normal fields instead.",
    code: `class User {
  constructor(public readonly id: number, private name: string) {}

  greet() { return \`Hi, \${this.name}\` }
}

const u = new User(1, "Ann")
console.log(u.id, u.greet())
u.id = 2`,
  },
  {
    q: 'What is an abstract class?',
    level: 'Intermediate',
    kind: 'both',
    a: "An abstract class is a base class that can't be created directly; it can mix real methods with abstract ones that subclasses must implement. I use it when subclasses share real code, like a describe() method that calls an abstract area(). If I only need a shape with no shared code, I use an interface instead.",
    code: `abstract class Shape {
  abstract area(): number
  describe() { return \`area = \${this.area()}\` }
}

class Square extends Shape {
  side = 3
  area() { return this.side ** 2 }
}

console.log(new Square().describe())
const s = new Shape()`,
  },
  {
    q: 'What does implements do in a class?',
    level: 'Intermediate',
    kind: 'error',
    a: "class X implements SomeInterface asks the compiler to check that the class has everything the interface requires. It doesn't add any code or change the class's type; it is just a check. I use it so that if the interface grows, every class that should follow it shows an error right away.",
    code: `interface Logger {
  level: string
  log(msg: string): void
}

class ConsoleLogger implements Logger {
  level = "info"
  log(msg: string) { console.log(\`[\${this.level}] \${msg}\`) }
}

class BrokenLogger implements Logger {
  level = "debug"
}`,
  },
  {
    q: 'What is an index signature?',
    level: 'Intermediate',
    kind: 'prints',
    a: "An index signature like { [key: string]: number } describes an object whose keys aren't known ahead of time, only their type. It's useful for dictionaries such as scores by player name. For new code I often write Record<string, number> instead, or use a Map when keys are added and removed a lot.",
    code: `interface Scores {
  [player: string]: number
}

const scores: Scores = { ann: 10 }
scores.bob = 7

for (const [name, pts] of Object.entries(scores)) {
  console.log(name, pts)
}`,
  },
  {
    q: 'What are intersection types?',
    level: 'Intermediate',
    kind: 'prints',
    a: "An intersection A & B combines types, so the value must have all the properties of both. It is the type-alias way to compose shapes, similar to interface extends. I use it to add small mixins like HasId or Timestamps to many types.",
    code: `type HasId = { id: number }
type HasName = { name: string }
type User = HasId & HasName

const u: User = { id: 1, name: "Ann" }
console.log(u)`,
  },
  {
    q: 'What is structural typing?',
    level: 'Intermediate',
    kind: 'both',
    a: "TypeScript compares types by their shape, not by their name, so any object with the right properties fits, even a class instance that never mentions the interface. The one exception is a fresh object literal, which gets an excess property check to catch typos. That's why passing a variable with extra fields works, but writing the same literal inline errors.",
    code: `interface Point { x: number; y: number }
function show(p: Point) { console.log(p.x, p.y) }

class Pixel { x = 5; y = 9 }
show(new Pixel())               // ok: same shape

const p3 = { x: 1, y: 2, z: 3 }
show(p3)                        // ok: extra z is fine
show({ x: 1, y: 2, z: 3 })      // fresh literal: checked`,
  },
  {
    q: 'What are declaration files (.d.ts) and @types?',
    level: 'Intermediate',
    kind: 'error',
    a: "A .d.ts file only holds types, with no code, to describe JavaScript that lives somewhere else, like a plain JS library or a global variable. Most popular libraries ship their own types, and the rest have community types in @types packages such as @types/node. When a small library has no types at all, I write a short declare module in a .d.ts file myself.",
    code: `// file: globals.d.ts
declare const APP_VERSION: string

declare module "legacy-lib" {
  export function slugify(text: string): string
}
// file: main.ts
import { slugify } from "legacy-lib"

console.log(slugify("Hello World"), APP_VERSION)
const v: number = APP_VERSION`,
  },
  {
    q: 'What does the declare keyword do?',
    level: 'Intermediate',
    kind: 'error',
    a: "declare tells TypeScript that something already exists at runtime, without emitting any JavaScript for it. I use declare const for globals added by a script tag, and declare global to add properties to window. It's what .d.ts files are made of, and since TypeScript just trusts it, I keep these declarations accurate.",
    code: `declare const API_URL: string            // set by a <script> tag
declare function track(event: string): void

declare global {
  interface Window { appVersion: string }
}

track(API_URL)
window.appVersion = 42`,
  },
  {
    q: 'What is a namespace, and do you still use it?',
    level: 'Intermediate',
    kind: 'prints',
    run: 'tsc',
    a: "A namespace groups related code under one name, like Geometry.area, and compiles to a plain object. It came from the days before ES modules; today each file is a module, so I use import and export instead. I only meet namespaces in older code and in .d.ts files for global libraries, and Node's type stripping can't run them because they emit real code.",
    code: `namespace Geometry {
  export const PI = 3.14
  export function area(r: number) {
    return PI * r * r
  }
}

console.log(Geometry.area(2))`,
  },
  {
    q: 'What are type-only imports (import type)?',
    level: 'Intermediate',
    kind: 'prints',
    a: "import type imports something only for use as a type, and it is always removed from the JavaScript output. This makes it clear which imports exist at runtime and avoids accidental side effects or circular imports. With verbatimModuleSyntax on, which I like for Node and Vite projects, the compiler forces me to use import type for types.",
    code: `// file: types.ts
export type User = { id: number; name: string }
export const VERSION = "1.0"
// file: main.ts
import type { User } from "./types.ts"   // erased completely
import { VERSION } from "./types.ts"     // real runtime import

const u: User = { id: 1, name: "Ann" }
console.log(u.name, VERSION)`,
  },
  {
    q: 'What does the satisfies operator do?',
    level: 'Intermediate',
    kind: 'prints',
    a: "satisfies checks that a value matches a type, but keeps the more exact type that TypeScript inferred instead of widening it. With a normal annotation, palette.green would be string | number[] and I couldn't call toUpperCase on it. I use satisfies for config objects and route tables, where I want both validation and precise types.",
    code: `type Colors = Record<string, string | number[]>

const palette = {
  red: [255, 0, 0],
  green: "#0f0",
} satisfies Colors

// still known to be a string, not string | number[]
console.log(palette.green.toUpperCase())
console.log(palette.red.length)`,
  },

  // ---------------------------------------------------------------- Advanced
  {
    q: 'What are mapped types?',
    level: 'Advanced',
    kind: 'error',
    a: "A mapped type loops over keys with [K in keyof T] to build a new object type from an old one. That's how Partial and Readonly are built, and with \"as\" I can even rename the keys. I use them to derive things like form-error types or getter types from one main model.",
    code: `type User = { name: string; age: number }

type Flags<T> = { [K in keyof T]: boolean }
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

const touched: Flags<User> = { name: true, age: false }
const g: Getters<User> = { getName: () => "Ann", getAge: () => "30" }`,
  },
  {
    q: 'What are conditional types?',
    level: 'Advanced',
    kind: 'error',
    a: "A conditional type, T extends U ? X : Y, picks one type or another based on whether T fits U, like a ternary for types. When T is a union, it is applied to each member separately, which is called distribution. Built-ins like Exclude and NonNullable are written this way.",
    code: `type IsString<T> = T extends string ? "yes" : "no"
type A = IsString<"hi">    // "yes"
type B = IsString<42>      // "no"

type ToArray<T> = T extends unknown ? T[] : never
type C = ToArray<string | number>   // string[] | number[]

const c: C = [1, "a"]`,
  },
  {
    q: 'What does infer do?',
    level: 'Advanced',
    kind: 'error',
    a: "infer is used inside a conditional type to capture part of a type into a new type variable. For example, T extends Promise<infer V> ? V : T pulls out what a promise resolves to. ReturnType and Parameters are built exactly like this, so I reach for infer when I need to unwrap a type.",
    code: `type ElementOf<T> = T extends (infer U)[] ? U : never
type Unwrap<T> = T extends Promise<infer V> ? V : T

type A = ElementOf<string[]>          // string
type B = Unwrap<Promise<number>>      // number

const a: A = "ok"
const b: B = "oops"`,
  },
  {
    q: 'What are template literal types?',
    level: 'Advanced',
    kind: 'error',
    a: "Template literal types use backtick syntax at the type level to build string literal types, and with unions they produce every combination. Helpers like Capitalize and Uppercase transform the strings. I use them for things like CSS class names or event handler names such as onClick and onFocus.",
    code: `type Size = "sm" | "lg"
type Color = "red" | "blue"
type ClassName = \`\${Size}-\${Color}\`        // "sm-red" | "sm-blue" | ...
type Handler = \`on\${Capitalize<"click" | "focus">}\`

const a: ClassName = "lg-blue"
const b: Handler = "onHover"`,
  },
  {
    q: 'What are Uppercase, Lowercase, Capitalize and Uncapitalize?',
    level: 'Advanced',
    kind: 'error',
    a: "They are built-in string types that change the case of a string literal type: Uppercase, Lowercase, Capitalize (first letter) and Uncapitalize. I mostly combine them with template literal types, for example to turn \"click\" into an \"onClick\" handler name. They work on unions too, so each member is converted.",
    code: `type EventName = "click" | "focus"

type Handler = \`on\${Capitalize<EventName>}\`   // "onClick" | "onFocus"
type Loud = Uppercase<EventName>              // "CLICK" | "FOCUS"

const h: Handler = "onClick"
const bad: Handler = "onclick"`,
  },
  {
    q: 'What is a recursive type?',
    level: 'Advanced',
    kind: 'prints',
    a: "A recursive type refers to itself, which is how I describe nested data like trees, comments with replies, or any JSON value. Functions over these types are usually recursive too. TypeScript handles this fine for type aliases and interfaces as long as the recursion goes through an object or array.",
    code: `type Tree = { value: number; children: Tree[] }

function sum(t: Tree): number {
  return t.value + t.children.reduce((acc, c) => acc + sum(c), 0)
}

const tree: Tree = { value: 1, children: [
  { value: 2, children: [] },
  { value: 3, children: [{ value: 4, children: [] }] },
] }
console.log(sum(tree))`,
  },
  {
    q: 'What is variance (covariance and contravariance)?',
    level: 'Advanced',
    kind: 'error',
    a: "Variance describes how subtyping of parts affects the whole. Arrays and return types are covariant (a Dog[] can be used as Animal[]), while function parameters are contravariant: a handler for any Animal can be used where a Dog handler is expected, but not the other way round. strictFunctionTypes, part of strict, enforces this for function types and catches handlers that assume too much.",
    code: `class Animal { name = "pet" }
class Dog extends Animal { bark() { return "woof" } }

const dogs: Dog[] = [new Dog()]
const animals: Animal[] = dogs         // ok: covariant

let onAnimal = (a: Animal) => a.name
let onDog = (d: Dog) => d.bark()
onDog = onAnimal                       // ok: contravariant
onAnimal = onDog`,
  },
  {
    q: 'What is a unique symbol?',
    level: 'Advanced',
    kind: 'both',
    a: "unique symbol is the type of one specific symbol, declared with const x: unique symbol = Symbol(). Each one is its own type, so two symbols with the same description are not interchangeable. I use them as hidden property keys that can't clash with normal string keys, and they are a common way to build branded types.",
    code: `const ID: unique symbol = Symbol("id")
const OTHER: unique symbol = Symbol("id")

type User = { [ID]: number; name: string }
const u: User = { [ID]: 1, name: "Ann" }
console.log(u[ID])

let s: typeof ID = OTHER   // a different unique symbol`,
  },
  {
    q: 'What are branded (nominal) types?',
    level: 'Advanced',
    kind: 'error',
    a: "Because TypeScript is structural, two string IDs are interchangeable even when mixing them is a bug. A brand adds a fake marker property, like string & { __brand: \"UserId\" }, so the types no longer match. I create branded values only in one function (after validation) and the compiler stops me from passing an OrderId where a UserId is expected.",
    code: `type UserId = string & { readonly __brand: "UserId" }
type OrderId = string & { readonly __brand: "OrderId" }

const toUserId = (s: string) => s as UserId

function loadUser(id: UserId) { return \`user \${id}\` }

loadUser(toUserId("u1"))     // ok
loadUser("o1" as OrderId)`,
  },
  {
    q: 'What is module augmentation?',
    level: 'Advanced',
    kind: 'error',
    tsx: true,
    a: "Module augmentation uses declare module \"name\" to add new members to types from another package; it works through declaration merging of interfaces. A common case is adding custom fields to Express's Request or, as here, CSS variables to React's CSSProperties. I keep these in one .d.ts file so they're easy to find.",
    code: `import type { CSSProperties } from "react"

declare module "react" {
  interface CSSProperties {
    "--accent"?: string
  }
}

const ok: CSSProperties = { color: "red", "--accent": "#f00" }
const bad: CSSProperties = { "--other": "1px" }`,
  },
  {
    q: 'What are decorators in TypeScript 5?',
    level: 'Advanced',
    kind: 'prints',
    run: 'tsc',
    a: "A decorator is a function written with @ that wraps or changes a class or class member. TypeScript 5 supports the standard ECMAScript decorators, which get the original method and a context object, no experimentalDecorators flag needed. Frameworks like Angular and NestJS use them heavily; in my own code I keep them for cross-cutting things like logging or timing.",
    code: `function log(method: any, ctx: ClassMethodDecoratorContext) {
  return function (this: unknown, ...args: any[]) {
    console.log(\`calling \${String(ctx.name)}\`)
    return method.apply(this, args)
  }
}

class Calc {
  @log
  add(a: number, b: number) { return a + b }
}

console.log(new Calc().add(2, 3))`,
  },
  {
    q: 'How do you type React component props and children?',
    level: 'Advanced',
    kind: 'error',
    tsx: true,
    a: "I write a props type and annotate the destructured parameter of the component. For children I use ReactNode, which accepts text, elements, arrays and null. I avoid React.FC these days and type props directly, so missing or misspelled props are caught where the component is used.",
    code: `import type { ReactNode } from "react"

type CardProps = { title: string; children: ReactNode }

function Card({ title, children }: CardProps) {
  return <section><h2>{title}</h2>{children}</section>
}

const ok = <Card title="Hi"><p>Body</p></Card>
const bad = <Card><p>Body</p></Card>`,
  },
  {
    q: 'What is the difference between React.FC and a plain function component?',
    level: 'Intermediate',
    kind: 'error',
    tsx: true,
    a: "React.FC<Props> types a component through the variable, while a plain function types the props parameter directly. Since React 18, FC no longer adds children automatically, so the two behave almost the same. I prefer plain functions because they also work with generics and default exports, and I add children to the props type only when the component needs it.",
    code: `import type { FC } from "react"

type Props = { name: string }

const HelloFC: FC<Props> = ({ name }) => <p>Hi {name}</p>
function Hello({ name }: Props) {
  return <p>Hi {name}</p>
}

const a = <HelloFC name="Ann" />
const b = <Hello name="Ann">extra</Hello>   // children not in Props`,
  },
  {
    q: 'What is the difference between ReactNode and JSX.Element?',
    level: 'Intermediate',
    kind: 'error',
    tsx: true,
    a: "JSX.Element is only the result of a JSX expression, like <b>hi</b>. ReactNode is anything React can render: elements, strings, numbers, arrays, null and undefined. I type children and slots as ReactNode, and use JSX.Element only when I really need an element, for example a prop I will clone.",
    code: `import type { JSX, ReactNode } from "react"

const Box = ({ children }: { children: ReactNode }) => <div>{children}</div>
const Icon = ({ icon }: { icon: JSX.Element }) => <span>{icon}</span>

const a = <Box>{"text"}{42}{null}</Box>   // ReactNode accepts all of these
const b = <Icon icon={<b>!</b>} />          // ok: a JSX element
const c = <Icon icon="!" />`,
  },
  {
    q: 'How do you type event handlers in React?',
    level: 'Advanced',
    kind: 'error',
    tsx: true,
    a: "React has its own event types like ChangeEvent, MouseEvent and FormEvent, each generic over the element, such as ChangeEvent<HTMLInputElement>. If I write the handler inline, TypeScript infers the event type for me. When I pull the handler out into a variable, I annotate the event so e.target.value is typed correctly.",
    code: `import { useState, type ChangeEvent } from "react"

function Search() {
  const [text, setText] = useState("")
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)
  const onCheck = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.checked)

  return <input value={text} onChange={onChange} />
}`,
  },
  {
    q: 'How do you type useState and useRef?',
    level: 'Advanced',
    kind: 'error',
    tsx: true,
    a: "useState infers its type from the initial value, but when it starts empty I pass the type myself, like useState<User | null>(null). For DOM refs I write useRef<HTMLInputElement>(null), and then ref.current can be null until React attaches it. In both cases the compiler makes me handle null, usually with ?. or an early return.",
    code: `import { useRef, useState } from "react"

type User = { name: string }

function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const focus = () => inputRef.current?.focus()   // ok with ?.

  return <input ref={inputRef} value={user.name} onFocus={focus} />
}`,
  },
  {
    q: 'How do you type a custom hook?',
    level: 'Advanced',
    kind: 'error',
    tsx: true,
    a: "A custom hook is just a function, so I type its parameters and let the return type be inferred or write it out. If it returns a tuple like [value, toggle], I add as const, otherwise TypeScript infers an array of a union and destructuring loses the types. For generic hooks like useFetch<T>, I add a type parameter for the data.",
    code: `import { useState } from "react"

function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = () => setOn((v) => !v)
  return [on, toggle] as const          // tuple: [boolean, () => void]
}

function Lamp() {
  const [on, toggle] = useToggle()
  return <button onClick={toggle}>{on.toFixed()}</button>
}`,
  },
  {
    q: 'How do you reuse props with ComponentProps?',
    level: 'Advanced',
    kind: 'error',
    tsx: true,
    a: "ComponentProps<\"button\"> gives me every prop a native button accepts, and ComponentProps<typeof MyComponent> gives the props of my own component. I use it for wrapper components: I add my own props and spread the rest onto the element, so onClick, disabled and aria-* all keep working without retyping them.",
    code: `import type { ComponentProps } from "react"

type ButtonProps = ComponentProps<"button"> & { variant: "primary" | "ghost" }

function Button({ variant, ...rest }: ButtonProps) {
  return <button className={variant} {...rest} />
}

const ok = <Button variant="primary" onClick={() => {}} disabled />
const bad = <Button variant="danger" />`,
  },
  {
    q: 'How do you write a generic React component?',
    level: 'Advanced',
    kind: 'error',
    tsx: true,
    a: "A component is a function, so it can take a type parameter like List<T>, and TypeScript infers T from the items prop. This links the props together, so the render callback knows the exact item type. I use this for reusable tables, lists and selects.",
    code: `type ListProps<T> = { items: T[]; render: (item: T) => string }

function List<T>({ items, render }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{render(item)}</li>)}</ul>
}

const users = [{ name: "Ann" }, { name: "Bob" }]

const ok = <List items={users} render={(u) => u.name} />
const bad = <List items={users} render={(u) => u.email} />`,
  },
  {
    q: 'How do you type API responses safely?',
    level: 'Advanced',
    kind: 'prints',
    a: "Data from fetch or JSON.parse is really unknown, so I treat it that way instead of just casting it with as. I validate it with a type guard, and in real projects with a schema library like Zod, where z.infer gives me the TypeScript type for free. This way the types and the runtime checks can't drift apart.",
    code: `type User = { id: number; name: string }

function isUser(x: unknown): x is User {
  return typeof x === "object" && x !== null &&
    typeof (x as User).id === "number" && typeof (x as User).name === "string"
}

const good: unknown = JSON.parse('{"id": 1, "name": "Ann"}')
if (isUser(good)) console.log("hello", good.name)

const bad: unknown = JSON.parse('{"id": "1"}')
console.log(isUser(bad))`,
  },
  {
    q: 'Which strict mode flags matter most?',
    level: 'Advanced',
    kind: 'error',
    flags: ['--noUncheckedIndexedAccess'],
    a: "strict turns on a family of checks, including noImplicitAny, strictNullChecks, strictFunctionTypes and useUnknownInCatchVariables. On top of strict I like noUncheckedIndexedAccess, which makes array and dictionary lookups return T | undefined. It's a bit noisier, but it catches real out-of-range bugs.",
    code: `// tsc --strict --noUncheckedIndexedAccess
const names = ["Ann", "Bob"]
const first = names[0]           // string | undefined

console.log(first.toUpperCase())

function log(msg) { console.log(msg) }`,
  },

  // ---------------------------------------------------------------- Coding round
  {
    q: 'Write a typed groupBy function.',
    level: 'Coding round',
    kind: 'prints',
    a: "I make it generic over the item type T and the key type K, with K extends PropertyKey so it can be used as an object key. The callback returns the key for each item, and the result is a record of arrays. The output keeps full types, so groups.a is typed as an array of people.",
    code: `function groupBy<T, K extends PropertyKey>(items: T[], getKey: (item: T) => K) {
  const out: Partial<Record<K, T[]>> = {}
  for (const item of items) {
    (out[getKey(item)] ??= []).push(item)
  }
  return out
}

const people = [{ name: "Ann", team: "a" }, { name: "Bob", team: "b" }, { name: "Cy", team: "a" }]
const groups = groupBy(people, (p) => p.team)
console.log(groups.a?.map((p) => p.name), groups.b?.length)`,
  },
  {
    q: 'Write a generic pick function.',
    level: 'Coding round',
    kind: 'both',
    a: "I use two type parameters: T for the object and K extends keyof T for the keys, and return Pick<T, K>. That way only real keys are accepted and the result type has exactly those properties. I use a helper like this to strip sensitive fields before sending data to the client.",
    code: `function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>
  for (const k of keys) out[k] = obj[k]
  return out
}

const user = { id: 1, name: "Ann", password: "secret" }
console.log(pick(user, ["id", "name"]))
pick(user, ["email"])`,
  },
  {
    q: 'Write a type-safe event emitter.',
    level: 'Coding round',
    kind: 'both',
    a: "I describe all events in one map type, event name to payload type, and make the emitter generic over it. on and emit use K extends keyof E, so the payload type is looked up as E[K]. A wrong event name or wrong payload is then a compile error instead of a silent bug.",
    code: `class Emitter<E extends Record<string, unknown>> {
  private handlers: { [K in keyof E]?: ((data: E[K]) => void)[] } = {}
  on<K extends keyof E>(event: K, fn: (data: E[K]) => void) {
    (this.handlers[event] ??= []).push(fn)
  }
  emit<K extends keyof E>(event: K, data: E[K]) {
    this.handlers[event]?.forEach((fn) => fn(data))
  }
}

const bus = new Emitter<{ login: { user: string }; error: string }>()
bus.on("login", (d) => console.log("hi", d.user))
bus.emit("login", { user: "sam" })
bus.emit("error", 404)`,
  },
  {
    q: 'Implement DeepReadonly<T>.',
    level: 'Coding round',
    kind: 'error',
    a: "The built-in Readonly only works one level deep, so I write a recursive mapped type. Each property becomes readonly, and if its value is an object, I apply DeepReadonly to it again. Arrays are objects too, so they become readonly arrays without push.",
    code: `type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

type Config = { db: { host: string; ports: number[] } }
const config: DeepReadonly<Config> = { db: { host: "local", ports: [5432] } }

config.db.host = "prod"
config.db.ports.push(1)`,
  },
  {
    q: 'Re-implement Partial and Pick (MyPartial, MyPick).',
    level: 'Coding round',
    kind: 'error',
    a: "Both are mapped types. MyPartial loops over keyof T and adds ? to every property. MyPick takes K extends keyof T and loops only over K, keeping each property's type with T[P].",
    code: `type MyPartial<T> = { [K in keyof T]?: T[K] }
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }

type User = { id: number; name: string; email: string }

const draft: MyPartial<User> = { name: "Ann" }   // ok
const card: MyPick<User, "id" | "name"> = { id: 1, name: "Ann", email: "a@x.io" }`,
  },
  {
    q: 'Write a typed debounce function.',
    level: 'Coding round',
    kind: 'prints',
    a: "I make debounce generic over the argument list A extends unknown[], so the returned function has exactly the same parameters as the original. Each call clears the previous timer and starts a new one, so only the last call within the wait time runs. ReturnType<typeof setTimeout> keeps the timer type correct in both the browser and Node.",
    code: `function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: A) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

const save = debounce((text: string) => console.log("saved:", text), 100)
save("h")
save("he")
save("hello")`,
  },
]
