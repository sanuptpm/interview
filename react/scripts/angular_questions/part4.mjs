// Change detection & performance, state management, testing, advanced, coding round.
export const part4 = [
  {
    topic: 'Change detection & performance',
    items: [
      {
        q: 'How does change detection work, and what is Zone.js?',
        level: 'Intermediate',
        a: "Change detection is how Angular keeps the DOM in sync with my data: it walks the component tree, re-evaluates template bindings and updates what changed. Traditionally Zone.js patched browser APIs like clicks, setTimeout and XHR so Angular knew when something async finished and could run change detection automatically. That is convenient but checks a lot of components that didn't change. Signals and zoneless mode let Angular update only what actually changed.",
        code: `@Component({
  selector: 'app-timer',
  template: \`<p>{{ seconds }}</p>\`,
})
export class Timer {
  seconds = 0
  constructor() {
    // With Zone.js: Angular notices the setInterval callback finished
    // and runs change detection, so the view updates.
    setInterval(() => this.seconds++, 1000)
  }
}`,
        output: `With Zone.js:   0 → 1 → 2 → 3 ...  (view updates)
Zoneless:       0  0  0  ...        (plain field, nobody tells Angular)
Zoneless + seconds = signal(0) and seconds.update(s => s + 1):
                0 → 1 → 2 → 3 ...`,
      },
      {
        q: 'What is the difference between Default and OnPush change detection?',
        level: 'Intermediate',
        a: "With the Default strategy Angular checks the component on every change detection run, anywhere in the app. With OnPush it only checks the component when an input reference changes, an event happens inside it, an async pipe emits, or a signal it reads changes. OnPush skips a lot of work, so I use it on most components. The common bug is mutating an input object, because OnPush only notices a new reference.",
        code: `@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<p>{{ user().name }}</p>\`,
})
export class UserCard {
  user = input.required<{ name: string }>()
}

// parent
// this.user.name = 'Bob'                      → card NOT updated (same reference)
// this.user = { ...this.user, name: 'Bob' }   → card updated (new reference)`,
        output: `Default:  checked on every change detection run in the app
OnPush:   checked only when
          - an input gets a new reference
          - an event fires inside it (click...)
          - an async pipe in it emits
          - a signal read in its template changes
          - markForCheck() is called`,
      },
      {
        q: 'What is zoneless change detection?',
        level: 'Advanced',
        a: "Zoneless means running Angular without Zone.js; new projects are zoneless by default since Angular 21, and I enable it in older apps with provideZonelessChangeDetection(). Angular then runs change detection only when it's told something changed: a signal update, a template event, the async pipe or markForCheck(). That gives smaller bundles, faster startup, cleaner stack traces and no surprise checks. To migrate, I use signals for state and OnPush-friendly patterns, then remove zone.js from polyfills.",
        code: `// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),   // default for new apps
    provideRouter(routes),
  ],
}

// angular.json: remove "zone.js" from polyfills

@Component({ selector: 'app-counter', template: \`<button (click)="inc()">{{ count() }}</button>\` })
export class Counter {
  count = signal(0)
  inc() { this.count.update((c) => c + 1) }     // signal tells Angular to update
}`,
        output: `Rendered: [0] → click → [1] → click → [2]
Bundle: zone.js (~35 kB raw) no longer shipped`,
      },
      {
        q: 'What is @defer and how does it help performance?',
        level: 'Intermediate',
        a: "@defer lazy loads part of a template: the components inside it are split into a separate chunk and only loaded when a trigger fires. Triggers include on viewport, on interaction, on hover, on idle (the default), on timer and when a condition is true. I add @placeholder for what shows before, @loading while it downloads and @error if it fails. I use it for heavy things below the fold like charts, comments or maps.",
        code: `@Component({
  selector: 'app-article',
  imports: [Comments],
  template: \`
    <article>...</article>

    @defer (on viewport) {
      <app-comments />
    } @placeholder {
      <p>Comments will load when you scroll here</p>
    } @loading (minimum 300ms) {
      <p>Loading comments...</p>
    }
  \`,
})
export class Article {}`,
        output: `On page load:        Comments will load when you scroll here
Scrolled into view:  Loading comments...   (chunk downloading)
Then:                <app-comments> rendered

The Comments code is not in the initial bundle.`,
      },
      {
        q: 'How do you improve the performance of an Angular app?',
        level: 'Advanced',
        a: "First I measure with Angular DevTools and the browser profiler instead of guessing. Then the big wins are: lazy load routes and use @defer, use OnPush with signals (or go zoneless), always use track in @for, and keep heavy calculations out of templates by using computed() or pure pipes. For lists with thousands of rows I use virtual scrolling from the CDK. I also check bundle size, use NgOptimizedImage for images and SSR with hydration for faster first paint.",
        code: `// 1. Lazy routes + @defer for heavy parts
{ path: 'reports', loadComponent: () => import('./reports').then((m) => m.Reports) }

// 2. OnPush + signals / zoneless
changeDetection: ChangeDetectionStrategy.OnPush

// 3. Track list items
@for (row of rows(); track row.id) { ... }

// 4. No method calls doing heavy work in templates
total = computed(() => this.items().reduce((s, i) => s + i.price, 0))

// 5. Huge lists: <cdk-virtual-scroll-viewport itemSize="48">
// 6. Images: <img ngSrc="hero.jpg" width="800" height="400" priority />`,
        output: `Checklist          Effect
Lazy loading       smaller initial bundle, faster start
OnPush/zoneless    fewer components checked
track              fewer DOM nodes re-created
computed/pipes     work done once, cached
Virtual scroll     only visible rows in the DOM
NgOptimizedImage   lazy images, better LCP`,
      },
    ],
  },
  {
    topic: 'State management',
    items: [
      {
        q: 'How do you manage state with a service and signals?',
        level: 'Intermediate',
        a: "For most apps I use a service with private writable signals and expose read-only versions with asReadonly() plus computed() values. Components inject the service, read the signals in templates and call methods to change state, so all updates go through one place. It's simple, typed, needs no library and works great with OnPush and zoneless. I only reach for NgRx when the app's state gets large and many teams touch it.",
        run: true,
        ctx: true,
        code: `import { Injectable, computed, inject, signal } from '@angular/core'

interface Item { name: string; price: number }

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<Item[]>([])
  readonly items = this._items.asReadonly()
  readonly count = computed(() => this._items().length)
  readonly total = computed(() => this._items().reduce((sum, i) => sum + i.price, 0))

  add(item: Item) { this._items.update((list) => [...list, item]) }
  clear() { this._items.set([]) }
}

const cart = inject(CartStore)
cart.add({ name: 'Pen', price: 2 })
cart.add({ name: 'Book', price: 15 })
console.log(cart.count(), 'items, total', cart.total())
// cart.items.set([])   → error: items is read-only`,
      },
      {
        q: 'What are NgRx store, actions, reducers, selectors and effects?',
        level: 'Advanced',
        a: "NgRx is a Redux-style library: the whole state lives in one store, and the only way to change it is to dispatch an action. A reducer is a pure function that takes the current state and an action and returns new state, and selectors read and derive slices of it with memoization. Effects handle side effects like HTTP calls: they listen for an action, call the API and dispatch a success or failure action. It adds boilerplate, but gives predictable data flow and great DevTools.",
        run: true,
        code: `import { createAction, createReducer, createSelector, on, props } from '@ngrx/store'

interface State { count: number; history: number[] }
const initial: State = { count: 0, history: [] }

const add = createAction('[Counter] Add', props<{ by: number }>())
const reset = createAction('[Counter] Reset')

const counterReducer = createReducer(
  initial,
  on(add, (s, { by }) => ({ count: s.count + by, history: [...s.history, by] })),
  on(reset, () => initial),
)

const selectCount = (s: State) => s.count
const selectDouble = createSelector(selectCount, (c) => c * 2)

let state = counterReducer(initial, add({ by: 5 }))
state = counterReducer(state, add({ by: 2 }))
console.log(add({ by: 5 }))
console.log(state, 'double:', selectDouble(state))
console.log(counterReducer(state, reset()))`,
      },
      {
        q: 'When do you use NgRx vs services with signals (and what is NgRx SignalStore)?',
        level: 'Advanced',
        a: "For small and medium apps a service with signals is enough, and I avoid the extra boilerplate. I choose the classic NgRx Store when lots of features share complex state, many developers work on it, or we need time-travel debugging and strict patterns. NgRx SignalStore sits in between: it's a lightweight, signal-based store with withState, withComputed and withMethods, and it's what I'd pick today for feature-level state. The key is to keep server data, UI state and global state clearly separated.",
        run: true,
        ctx: true,
        code: `import { computed, inject } from '@angular/core'
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState({ todos: [] as string[], filter: '' }),
  withComputed(({ todos, filter }) => ({
    visible: computed(() => todos().filter((t) => t.includes(filter()))),
  })),
  withMethods((store) => ({
    add: (todo: string) => patchState(store, { todos: [...store.todos(), todo] }),
    setFilter: (filter: string) => patchState(store, { filter }),
  })),
)

const store = inject(TodoStore)
store.add('learn signals')
store.add('learn ngrx')
store.add('walk the dog')
store.setFilter('learn')
console.log(store.visible())`,
      },
    ],
  },
  {
    topic: 'Testing',
    items: [
      {
        q: 'How do you write a simple unit test in Angular?',
        level: 'Basics',
        a: "The simplest unit test doesn't need TestBed at all: if a service or pipe has no dependencies, I just create it with new and call its method. I group tests with describe, write each case with it, and check the result with expect(...).toBe(...). The spec file sits next to the source file, like calculator.spec.ts, and ng test finds and runs it. I start with these because they are fast and test pure logic.",
        code: `// calculator.ts
export class CalculatorService {
  add(a: number, b: number) { return a + b }
}

// calculator.spec.ts
describe('CalculatorService', () => {
  it('adds two numbers', () => {
    const calc = new CalculatorService()
    expect(calc.add(2, 3)).toBe(5)
  })
})

// shorten.pipe.spec.ts (pipe: cuts text after max chars and adds '...')
describe('ShortenPipe', () => {
  const pipe = new ShortenPipe()
  it('cuts long text', () => expect(pipe.transform('Hello Angular world', 5)).toBe('Hello...'))
  it('keeps short text', () => expect(pipe.transform('Hi')).toBe('Hi'))
})`,
        output: `$ ng test
 ✓ |app| src/app/calculator.spec.ts > CalculatorService > adds two numbers
 ✓ |app| src/app/shorten.pipe.spec.ts > ShortenPipe > cuts long text
 ✓ |app| src/app/shorten.pipe.spec.ts > ShortenPipe > keeps short text

 Test Files  2 passed (2)
      Tests  3 passed (3)`,
      },
      {
        q: 'How do you unit test a simple component (counter with a signal)?',
        level: 'Basics',
        a: "I use TestBed.createComponent, which gives me a fixture with the component instance and its rendered DOM. I find the button through fixture.nativeElement, click it like a user would, and then await fixture.whenStable() so Angular updates the template (fixture.detectChanges() also works). Finally I expect the button text to show the new count. I check the DOM, not just the signal, because that is what the user actually sees.",
        code: `// counter.ts
@Component({
  selector: 'app-counter',
  template: \`<button (click)="count.set(count() + 1)">Count: {{ count() }}</button>\`,
})
export class Counter { count = signal(0) }

// counter.spec.ts
it('increments when the button is clicked', async () => {
  const fixture = TestBed.createComponent(Counter)
  const button: HTMLButtonElement = fixture.nativeElement.querySelector('button')

  button.click()
  button.click()
  await fixture.whenStable()

  expect(button.textContent).toBe('Count: 2')
})`,
        output: `$ ng test
 ✓ |app| src/app/counter.spec.ts > Counter > increments when the button is clicked

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
      },
      {
        q: 'What is the difference between Jasmine/Karma, Jest and Vitest for Angular?',
        level: 'Basics',
        a: "For years Angular used Jasmine as the test framework and Karma to run tests in a real browser, but Karma is deprecated. Since Angular 21 new projects use Vitest by default, which is much faster and has a Jest-like API. Many teams also use Jest with jsdom. The TestBed code is almost identical in all of them; mainly the assertion and mocking functions differ, like jasmine.createSpy vs vi.fn().",
        code: `// Jasmine
const spy = jasmine.createSpy('save')
spyOn(service, 'load').and.returnValue(of([]))

// Vitest
const spy = vi.fn()
vi.spyOn(service, 'load').mockReturnValue(of([]))

// Jest
const spy = jest.fn()
jest.spyOn(service, 'load').mockReturnValue(of([]))`,
        output: `            Jasmine + Karma        Jest                 Vitest
Runs in     Real browser           Node + jsdom         Node (jsdom) or browser
Speed       Slow                   Fast                 Fastest
Status      Karma deprecated       Community setup      Default since Angular 21
Mocks       jasmine.createSpy      jest.fn              vi.fn`,
      },
      {
        q: 'How do you test a component with TestBed and ComponentFixture?',
        level: 'Intermediate',
        a: "TestBed creates a small Angular environment for the test, where I configure the component under test and any mock providers. createComponent gives me a ComponentFixture, which holds the component instance and its rendered DOM. I interact with the DOM, like clicking a button, wait for Angular to update with fixture.whenStable() or detectChanges(), and then assert on the text. I test what the user sees rather than private implementation details.",
        code: `import { TestBed } from '@angular/core/testing'
import { Counter } from './counter'

describe('Counter', () => {
  it('increments when clicked', async () => {
    const fixture = TestBed.createComponent(Counter)
    await fixture.whenStable()
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button')

    button.click()
    await fixture.whenStable()

    expect(button.textContent).toContain('1')
  })
})`,
        output: `$ ng test
 ✓ src/app/counter.spec.ts (1 test)
   ✓ Counter > increments when clicked

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
      },
      {
        q: "How do you test a component's input() and output()?",
        level: 'Intermediate',
        a: "For inputs I call fixture.componentRef.setInput('name', 'Ann'), which works with signal inputs and also marks the component for update, so it behaves like a parent passing the value. For outputs I subscribe to the output on the component instance with a spy like vi.fn() (or jasmine.createSpy), trigger the click, and check the spy was called with the right value. Then I await fixture.whenStable() and assert on the rendered text. This tests the component's public API exactly the way a parent uses it.",
        code: `// greeting.ts
@Component({
  selector: 'app-greeting',
  template: \`<h1>Hello {{ name() }}</h1> <button (click)="liked.emit(name())">Like</button>\`,
})
export class Greeting {
  name = input.required<string>()
  liked = output<string>()
}

// greeting.spec.ts
it('shows the name input and emits liked', async () => {
  const fixture = TestBed.createComponent(Greeting)
  fixture.componentRef.setInput('name', 'Ann')
  await fixture.whenStable()

  const likedSpy = vi.fn()
  fixture.componentInstance.liked.subscribe(likedSpy)
  fixture.nativeElement.querySelector('button').click()

  expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Hello Ann')
  expect(likedSpy).toHaveBeenCalledWith('Ann')
})`,
        output: `$ ng test
 ✓ |app| src/app/greeting.spec.ts > Greeting > shows the name input and emits liked

 Test Files  1 passed (1)
      Tests  1 passed (1)`,
      },
      {
        q: 'How do you mock a service dependency in a component test?',
        level: 'Intermediate',
        a: "I replace the real service in TestBed with a fake one using providers: [{ provide: PostService, useValue: fakeService }]. The fake getPosts() just returns of([...]) with data shaped like the real API, so the component gets posts without any HTTP call. This keeps the test fast and focused on the component's rendering, not on the network or the service. I can also use vi.spyOn or jasmine.createSpyObj when I need to check that a method was called.",
        code: `// post.service.ts: getPosts() calls https://jsonplaceholder.typicode.com/posts
// post-list.ts: posts = toSignal(inject(PostService).getPosts(), { initialValue: [] })
//               template: @for (post of posts(); track post.id) { <li>{{ post.title }}</li> }

// post-list.spec.ts
it('renders posts from a mocked PostService', async () => {
  const fakePosts = [{ id: 1, title: 'sunt aut facere' }, { id: 2, title: 'qui est esse' }]
  TestBed.configureTestingModule({
    providers: [{ provide: PostService, useValue: { getPosts: () => of(fakePosts) } }],
  })

  const fixture = TestBed.createComponent(PostList)
  await fixture.whenStable()

  const items = fixture.nativeElement.querySelectorAll('li')
  expect(items.length).toBe(2)
  expect(items[0].textContent).toBe('sunt aut facere')
})`,
        output: `$ ng test
 ✓ |app| src/app/post-list.spec.ts > PostList > renders posts from a mocked PostService

 Test Files  1 passed (1)
      Tests  1 passed (1)
(no real network request: the fake PostService returned the posts)`,
      },
      {
        q: 'What unit testing have you done in your Angular projects?',
        level: 'Intermediate',
        a: "In my last project, an employee management and payroll app, I wrote unit tests with Jasmine and Karma, and later we moved to Vitest when we upgraded Angular. I tested services with HttpTestingController, components for inputs, outputs, rendering and user clicks, and also pipes, route guards and reactive form validators like salary and date checks. I mocked dependencies with useValue fakes and spies so tests never hit the real API. We aimed for around 80% coverage on business logic rather than chasing 100% everywhere, and the tests ran in CI on every pull request. When a bug came in, I usually wrote a failing test that reproduced it first and then fixed it, so it couldn't come back.",
        code: `// salary.validator.ts
export function salaryValidator(control: AbstractControl): ValidationErrors | null {
  const value = Number(control.value)
  return value > 0 && value <= 500000 ? null : { salary: 'Salary must be between 1 and 500000' }
}

// salary.validator.spec.ts
describe('salaryValidator', () => {
  it('accepts a valid salary', () => {
    expect(salaryValidator(new FormControl(45000))).toBeNull()
  })

  it('rejects zero and too large values', () => {
    expect(salaryValidator(new FormControl(0))).toEqual({ salary: 'Salary must be between 1 and 500000' })
    expect(new FormControl(900000, salaryValidator).valid).toBe(false)
  })
})`,
        output: `$ ng test
 ✓ |app| src/app/salary.validator.spec.ts > salaryValidator > accepts a valid salary
 ✓ |app| src/app/salary.validator.spec.ts > salaryValidator > rejects zero and too large values

 Test Files  1 passed (1)
      Tests  2 passed (2)`,
      },
      {
        q: 'How do you test a service that uses HttpClient (HttpTestingController)?',
        level: 'Advanced',
        a: "I provide provideHttpClient() and provideHttpClientTesting() in TestBed, which swaps the real backend for a fake one. Then I call my service, use HttpTestingController.expectOne(url) to grab the request, check the method, and flush() a fake response. Finally verify() makes sure there are no unexpected requests left. This way the test is fast and never hits the real API.",
        code: `beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  })
})

it('loads posts', () => {
  const service = TestBed.inject(PostService)
  const httpMock = TestBed.inject(HttpTestingController)
  let titles: string[] = []

  service.getPosts().subscribe((posts) => (titles = posts.map((p) => p.title)))

  const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts')
  expect(req.request.method).toBe('GET')
  req.flush([{ id: 1, title: 'Hello' }])

  expect(titles).toEqual(['Hello'])
  httpMock.verify()
})`,
        output: `$ ng test
 ✓ src/app/post.service.spec.ts (1 test)
   ✓ PostService > loads posts

 Tests  1 passed (1)
(no real network request was made)`,
      },
    ],
  },
  {
    topic: 'Advanced',
    items: [
      {
        q: 'What is the difference between AOT and JIT compilation (and what is Ivy)?',
        level: 'Intermediate',
        a: "Angular templates have to be compiled to JavaScript instructions. JIT (just-in-time) compiled them in the browser at runtime, while AOT (ahead-of-time) compiles them during the build, which is the default now. AOT gives faster startup, smaller bundles because the compiler isn't shipped, and template errors at build time. Ivy is the name of Angular's current compiler and rendering engine, which made bundles smaller and enabled things like standalone components.",
        code: `// Template
@Component({ selector: 'app-hi', template: \`<h1>Hi {{ name }}</h1>\` })
export class Hi { name = 'Ann' }

// AOT turns it into instructions like (simplified):
// ɵɵelementStart(0, 'h1'); ɵɵtext(1); ɵɵelementEnd();
// ... ɵɵtextInterpolate1('Hi ', ctx.name, '')`,
        output: `            JIT                       AOT (default)
Compiles    In the browser            At build time
Startup     Slower                    Faster
Bundle      Includes the compiler     No compiler shipped
Errors      At runtime                At build time (ng build)`,
      },
      {
        q: 'What is SSR and hydration in Angular?',
        level: 'Advanced',
        a: "With server-side rendering, the server renders the page to HTML so users and search engines see content right away instead of an empty <app-root>. Hydration then lets the browser reuse that server-rendered DOM and just attach event listeners, instead of destroying and re-rendering it. I add it with ng add @angular/ssr (or ng new --ssr), and Angular also supports prerendering static routes and incremental hydration with @defer (hydrate on ...). I have to avoid touching window or document directly, using afterNextRender for browser-only code.",
        code: `// app.config.ts
providers: [provideClientHydration(withEventReplay(), withIncrementalHydration())]

// Browser-only code
constructor() {
  afterNextRender(() => {
    console.log(window.innerWidth)   // safe: runs only in the browser
  })
}

// Hydrate a heavy part only when it scrolls into view
// @defer (hydrate on viewport) { <app-reviews /> }`,
        output: `Without SSR: server sends <app-root></app-root> → blank until JS runs
With SSR:    server sends full HTML → content visible immediately
Hydration:   browser reuses that DOM, attaches listeners (no flicker)
Console (browser only): 1440`,
      },
      {
        q: 'What are Angular Elements?',
        level: 'Advanced',
        a: "Angular Elements turns an Angular component into a standard custom element (web component) with createCustomElement. Once registered with customElements.define, it can be used as a normal HTML tag in any page or framework, like React or plain HTML. Inputs become attributes or properties, and outputs become DOM custom events. I'd use it for embedding a widget into a non-Angular site or a micro-frontend.",
        code: `import { createApplication } from '@angular/platform-browser'
import { createCustomElement } from '@angular/elements'

const app = await createApplication({ providers: [] })
const RatingElement = createCustomElement(Rating, { injector: app.injector })
customElements.define('my-rating', RatingElement)

// Any HTML page, no Angular knowledge needed:
// <my-rating stars="4"></my-rating>
// el.addEventListener('rated', (e) => console.log(e.detail))`,
        output: `Rendered in a plain HTML page:
★★★★☆
Clicking the 5th star → Console: 5   (output "rated" as a CustomEvent)`,
      },
      {
        q: 'How does Angular protect against XSS (sanitization)?',
        level: 'Advanced',
        a: "Angular treats all values as untrusted by default: interpolation escapes HTML, and when I bind to [innerHTML], [href] or [style] it sanitizes the value and strips dangerous parts like script tags and javascript: URLs. If I really trust some HTML, I can mark it with DomSanitizer.bypassSecurityTrustHtml, but I only do that for content I control. I also avoid using ElementRef.nativeElement.innerHTML directly, since that skips Angular's protection.",
        code: `@Component({
  selector: 'app-comment',
  template: \`
    <p>{{ comment }}</p>
    <p [innerHTML]="comment"></p>
  \`,
})
export class CommentView {
  comment = '<b>Nice!</b><script>alert("hacked")</script><img src=x onerror="alert(1)">'
}`,
        output: `Rendered:
<b>Nice!</b><script>alert("hacked")</script><img src=x onerror="alert(1)">   (shown as text)
Nice! + a broken image   (bold kept; <script> and onerror removed)

Console:
WARNING: sanitizing HTML stripped some content, see https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss`,
      },
      {
        q: 'How do you migrate an older Angular app to standalone, the new control flow and signals?',
        level: 'Advanced',
        a: "I upgrade one major version at a time with ng update, which runs automatic migrations for breaking changes. Then I use Angular's schematics: the standalone migration converts components and removes NgModules, the control-flow migration turns *ngIf/*ngFor into @if/@for, and there are migrations for inject(), signal inputs, outputs and queries. I run them folder by folder, run the tests after each step and commit in small pieces. Old and new styles work side by side, so it can be gradual.",
        code: `// Terminal
// ng update @angular/core @angular/cli
// ng generate @angular/core:standalone
// ng generate @angular/core:control-flow
// ng generate @angular/core:inject
// ng generate @angular/core:signal-input-migration
// ng generate @angular/core:output-migration
// ng generate @angular/core:signal-queries-migration`,
        output: `Before:  <li *ngFor="let u of users; trackBy: byId">{{ u.name }}</li>
After:   @for (u of users; track byId($index, u)) { <li>{{ u.name }}</li> }

Before:  @Input() name!: string
After:   readonly name = input.required<string>()`,
      },
    ],
  },
  {
    topic: 'Coding round',
    items: [
      {
        q: 'Build a counter component with signals.',
        level: 'Coding round',
        a: "I keep the count in a signal and derive extra values with computed(), so there's no manual syncing. The buttons call update() and set(), and the template just reads the signals. I disable the minus button at zero to show property binding. This is a tiny component, but it shows signals, computed, event binding and @if together.",
        code: `@Component({
  selector: 'app-counter',
  template: \`
    <h2>Count: {{ count() }}</h2>
    <button (click)="dec()" [disabled]="count() === 0">-</button>
    <button (click)="inc()">+</button>
    <button (click)="count.set(0)">Reset</button>
    @if (isEven()) { <p>Even</p> } @else { <p>Odd</p> }
  \`,
})
export class Counter {
  count = signal(0)
  isEven = computed(() => this.count() % 2 === 0)
  inc() { this.count.update((c) => c + 1) }
  dec() { this.count.update((c) => c - 1) }
}`,
        output: `Rendered:
Count: 0
[-] (disabled) [+] [Reset]
Even

After clicking + three times:
Count: 3
[-] [+] [Reset]
Odd`,
      },
      {
        q: 'Build a todo list with @for.',
        level: 'Coding round',
        a: "I store the todos in a signal array and always update it immutably with update(), creating new arrays. The @for loop tracks each todo by id, and @empty shows a message when the list is empty. A computed() gives the remaining count. Adding uses a template reference variable to read the input, so I don't need forms for this.",
        code: `interface Todo { id: number; text: string; done: boolean }

@Component({
  selector: 'app-todos',
  template: \`
    <input #box (keyup.enter)="add(box.value); box.value = ''" />
    <ul>
      @for (t of todos(); track t.id) {
        <li [class.done]="t.done" (click)="toggle(t.id)">{{ t.text }}</li>
      } @empty { <li>Nothing to do</li> }
    </ul>
    <p>{{ left() }} left</p>
  \`,
})
export class Todos {
  todos = signal<Todo[]>([])
  left = computed(() => this.todos().filter((t) => !t.done).length)
  add(text: string) {
    if (text.trim()) this.todos.update((l) => [...l, { id: Date.now(), text, done: false }])
  }
  toggle(id: number) {
    this.todos.update((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }
}`,
        output: `Rendered:
[            ]
• Nothing to do
0 left

After adding "Buy milk" and "Walk dog", then clicking "Buy milk":
• Buy milk   (crossed out)
• Walk dog
1 left`,
      },
      {
        q: 'Build a search box with debounceTime and switchMap.',
        level: 'Coding round',
        a: "I keep the search term in a signal, turn it into an observable with toObservable(), then debounce it, skip duplicates and use switchMap to call the API so old requests are cancelled. toSignal() turns the result back into a signal for the template. I use the jsonplaceholder posts endpoint and filter by title. This shows signals and RxJS working together, which interviewers like to see.",
        code: `@Component({
  selector: 'app-post-search',
  template: \`
    <input placeholder="Search posts" (input)="term.set($any($event.target).value)" />
    @for (p of results(); track p.id) { <li>{{ p.title }}</li> }
  \`,
})
export class PostSearch {
  private http = inject(HttpClient)
  term = signal('')

  results = toSignal(
    toObservable(this.term).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((t) =>
        this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts').pipe(
          map((posts) => posts.filter((p) => t && p.title.includes(t)).slice(0, 3)),
        ),
      ),
    ),
    { initialValue: [] },
  )
}`,
        output: `Typing "dolor" quickly (one request after 300ms of no typing):
• dolorem eum magni eos aperiam quia
• dolorem dolore est ipsam
• nesciunt iure omnis dolorem tempora et accusantium`,
      },
      {
        q: 'Write a custom pipe (e.g. initials).',
        level: 'Coding round',
        a: "I create a pure pipe with @Pipe, implement transform, and keep the logic simple and defensive for empty input. It splits the full name into words, takes the first letter of each and upper-cases them, with an optional limit argument. In a template I'd write {{ user.name | initials }}. Because it's pure, Angular only re-runs it when the name changes.",
        run: true,
        code: `import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  transform(name: string | null | undefined, max = 2): string {
    if (!name) return ''
    return name
      .trim()
      .split(/\\s+/)
      .slice(0, max)
      .map((word) => word[0].toUpperCase())
      .join('')
  }
}

const pipe = new InitialsPipe()
console.log(pipe.transform('ann smith'))
console.log(pipe.transform('  Mary  jane watson ', 3))
console.log(JSON.stringify(pipe.transform(null)))`,
      },
      {
        q: 'Build a reactive form with validation.',
        level: 'Coding round',
        a: "I build the form with NonNullableFormBuilder, add built-in validators, and bind it with [formGroup] and formControlName. Error messages show only after the user touched the field, so the form isn't red on load. The submit button is disabled while the form is invalid, and on submit I read getRawValue(). This covers the usual interview checklist: validators, error display and submit.",
        code: `@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="email" placeholder="Email" />
      @if (form.controls.email.touched && form.controls.email.invalid) {
        <small>Enter a valid email</small>
      }
      <input formControlName="password" type="password" placeholder="Password" />
      @if (form.controls.password.touched && form.controls.password.hasError('minlength')) {
        <small>At least 8 characters</small>
      }
      <button [disabled]="form.invalid">Sign up</button>
    </form>
  \`,
})
export class Signup {
  form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  })
  submit() { console.log(this.form.getRawValue()) }
}`,
        output: `Rendered:
[Email     ]
[Password  ]
[Sign up] (disabled)

After typing "ann@" and "123", then leaving the fields:
Enter a valid email
At least 8 characters

With "ann@example.com" / "secret123" and clicking Sign up:
Console: { email: 'ann@example.com', password: 'secret123' }`,
      },
    ],
  },
]
