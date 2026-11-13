// Sub-topic order for the typescript page: related questions are shown together.
// Each question title appears in exactly one topic, in the order shown on the page.
export default [
  {
    topic: 'Getting started',
    questions: [
      'What is TypeScript and why use it?',
      'What is the difference between TypeScript and JavaScript (compile time vs runtime)?',
      'What are the basics of tsconfig.json (strict, target, module)?',
      'What does noImplicitAny do?',
      'What does esModuleInterop do?',
      'What does skipLibCheck do?',
      'How do you set up path aliases with paths (and why not baseUrl)?',
    ],
  },
  {
    topic: 'Basic types',
    questions: [
      'What are the basic types in TypeScript?',
      'What is type inference?',
      'What is the difference between any and unknown?',
      'What is the difference between object, Object and {}?',
      'What is the difference between void and never?',
      'How do null and undefined work with strictNullChecks?',
    ],
  },
  {
    topic: 'Functions',
    questions: [
      'How do you type function parameters, return values, optional and default params?',
      'What are function overloads?',
    ],
  },
  {
    topic: 'Unions, literals & enums',
    questions: [
      'What are union types?',
      'What are literal types?',
      'What are enums, and what do you use instead?',
    ],
  },
  {
    topic: 'Object types',
    questions: [
      'What is a type alias?',
      'What is an interface?',
      'What is the difference between interface and type?',
      'What are optional and readonly properties?',
      'What are intersection types?',
      'What is an index signature?',
      'What is structural typing?',
    ],
  },
  {
    topic: 'Assertions',
    questions: [
      'What is a type assertion (as)?',
      'What is the non-null assertion operator (!)?',
      'What does the satisfies operator do?',
    ],
  },
  {
    topic: 'Narrowing',
    questions: [
      'How does type narrowing work?',
      'How do you narrow with in and instanceof?',
      'What is a discriminated union?',
      'What is a custom type guard (x is Type)?',
      'What is an assertion function (asserts x is Type)?',
      'How do you make a switch exhaustive with never?',
    ],
  },
  {
    topic: 'Generics',
    questions: [
      'What are generics?',
      'What are generic constraints (extends)?',
      'How do generic interfaces and default type parameters work?',
      'What does keyof do?',
      'What are typeof and indexed access types?',
    ],
  },
  {
    topic: 'Utility types',
    questions: [
      'What do Partial, Required and Readonly do?',
      'What do Pick and Omit do?',
      'What is Record?',
      'What do Exclude, Extract and NonNullable do?',
      'What do ReturnType, Parameters and Awaited do?',
      'What do ConstructorParameters and InstanceType do?',
      'What does NoInfer do?',
      'What does ThisType do?',
    ],
  },
  {
    topic: 'Classes',
    questions: [
      'What are access modifiers (public, private, protected)?',
      'What are readonly class fields and parameter properties?',
      'What is an abstract class?',
      'What does implements do in a class?',
      'What are decorators in TypeScript 5?',
    ],
  },
  {
    topic: 'Modules & declarations',
    questions: [
      'What are type-only imports (import type)?',
      'What are declaration files (.d.ts) and @types?',
      'What does the declare keyword do?',
      'What is a namespace, and do you still use it?',
      'What is module augmentation?',
    ],
  },
  {
    topic: 'Type-level programming',
    questions: [
      'What are mapped types?',
      'What are conditional types?',
      'What does infer do?',
      'What are template literal types?',
      'What are Uppercase, Lowercase, Capitalize and Uncapitalize?',
      'What is a recursive type?',
      'What is variance (covariance and contravariance)?',
      'What is a unique symbol?',
      'What are branded (nominal) types?',
    ],
  },
  {
    topic: 'TypeScript with React',
    questions: [
      'How do you type React component props and children?',
      'What is the difference between React.FC and a plain function component?',
      'What is the difference between ReactNode and JSX.Element?',
      'How do you type event handlers in React?',
      'How do you type useState and useRef?',
      'How do you type a custom hook?',
      'How do you reuse props with ComponentProps?',
      'How do you write a generic React component?',
    ],
  },
  {
    topic: 'Type safety in practice',
    questions: [
      'How do you type API responses safely?',
      'Which strict mode flags matter most?',
    ],
  },
  {
    topic: 'Coding round',
    questions: [
      'Write a typed groupBy function.',
      'Write a generic pick function.',
      'Write a type-safe event emitter.',
      'Implement DeepReadonly<T>.',
      'Re-implement Partial and Pick (MyPartial, MyPick).',
      'Write a typed debounce function.',
    ],
  },
]
