// Pipes, services & DI, signals, RxJS.
export const part2 = [
  {
    topic: 'Pipes',
    items: [
      {
        q: 'What are pipes and which built-in pipes do you use?',
        level: 'Basics',
        a: "A pipe transforms a value for display in the template, like {{ price | currency }}, without changing the underlying data. The built-in ones I use most are date, currency, number (decimal), percent, uppercase/lowercase, slice, json and async. Pipes can take arguments after a colon, like date:'dd/MM/yyyy'. Each pipe is just a class with a transform method, so I can even call it in code, which is what this example does.",
        run: true,
        code: `import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe, SlicePipe, UpperCasePipe } from '@angular/common'

// In a template: {{ price | currency:'EUR' }}, {{ joined | date:'dd/MM/yyyy' }} ...
const joined = new Date('2026-03-15T10:30:00Z')

console.log(new UpperCasePipe().transform('angular'))
console.log(new CurrencyPipe('en-US').transform(1234.5, 'EUR'))
console.log(new DecimalPipe('en-US').transform(3.14159, '1.2-2'))
console.log(new PercentPipe('en-US').transform(0.256))
console.log(new DatePipe('en-US').transform(joined, 'dd/MM/yyyy', 'UTC'))
console.log(new DatePipe('en-US').transform(joined, 'mediumDate', 'UTC'))
console.log(new SlicePipe().transform([1, 2, 3, 4, 5], 0, 3))`,
      },
      {
        q: 'How do you create a custom pipe?',
        level: 'Basics',
        a: "I create a class with the @Pipe decorator, give it a name, and implement PipeTransform with a transform(value, ...args) method. Then I add it to the imports of the component that uses it and write {{ text | truncate:20 }}. I keep pipes small and pure, doing one formatting job each. Because transform is a plain method, it's very easy to unit test.",
        run: true,
        code: `import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 10, ending = '...'): string {
    return value.length > limit ? value.slice(0, limit) + ending : value
  }
}

// Template: {{ title | truncate:12 }}
const pipe = new TruncatePipe()
console.log(pipe.transform('Angular interview questions', 12))
console.log(pipe.transform('Short'))
console.log(pipe.transform('Signals and RxJS', 7, ' →'))`,
      },
      {
        q: 'What is the difference between pure and impure pipes?',
        level: 'Intermediate',
        a: "A pure pipe, the default, only re-runs when its input value or reference changes, so Angular can cache the result and it's cheap. An impure pipe (pure: false) runs on every change detection cycle, which can be slow. The catch with pure pipes is that pushing into an array doesn't change its reference, so the pipe won't update; I create a new array instead. I almost never write impure pipes; the async pipe is a built-in impure one.",
        code: `@Pipe({ name: 'activeOnly' })            // pure (default)
export class ActiveOnlyPipe implements PipeTransform {
  transform(users: User[]) {
    console.log('pipe ran')
    return users.filter((u) => u.active)
  }
}

// users.push(newUser)              → pipe does NOT run (same array)
// users = [...users, newUser]      → pipe runs (new reference)

@Pipe({ name: 'activeOnlyImpure', pure: false })
export class ActiveOnlyImpurePipe { /* runs every change detection */ }`,
        output: `Pure pipe:
  runs when the input reference changes
  this.users.push(x)            → list on screen is NOT updated
  this.users = [...this.users, x] → updated, "pipe ran" logged once

Impure pipe:
  "pipe ran" logged on every change detection (every click, timer...)`,
      },
      {
        q: 'What does the async pipe do?',
        level: 'Intermediate',
        a: "The async pipe subscribes to an Observable or Promise in the template and shows its latest value. When the component is destroyed it unsubscribes automatically, so I don't leak subscriptions. It also marks the component for check, so it works well with OnPush. I often combine it with @if (data$ | async; as data) to unwrap the value once.",
        code: `@Component({
  selector: 'app-clock',
  imports: [AsyncPipe, DatePipe],
  template: \`
    @if (time$ | async; as time) {
      <p>{{ time | date:'HH:mm:ss' }}</p>
    }
  \`,
})
export class Clock {
  time$ = interval(1000).pipe(map(() => new Date()))
}`,
        output: `Rendered (updates every second):
10:15:01
10:15:02
10:15:03
...
Leaving the page unsubscribes automatically.`,
      },
    ],
  },
  {
    topic: 'Services & dependency injection',
    items: [
      {
        q: 'What is a service and what is dependency injection in Angular?',
        level: 'Basics',
        a: "A service is a class for logic or data that isn't tied to one view, like API calls, logging or shared state. Dependency injection means Angular creates the service and hands it to whoever asks, instead of me calling new. With @Injectable({ providedIn: 'root' }) there is one shared instance for the whole app, and it's tree-shaken if nobody uses it. This makes code easy to share and easy to test, because I can swap in a fake service.",
        run: true,
        ctx: true,
        code: `import { Injectable, inject } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class Logger {
  private count = 0
  log(msg: string) { console.log(++this.count + ': ' + msg) }
}

// Two different places ask for Logger...
const a = inject(Logger)
const b = inject(Logger)

a.log('from component A')
b.log('from component B')
console.log('same instance:', a === b)`,
      },
      {
        q: 'What is the inject() function and why is it preferred over constructor injection?',
        level: 'Intermediate',
        a: "inject() gets a dependency from the current injector, and I call it in a field initializer or constructor instead of listing parameters in the constructor. It's shorter, works great with inheritance, and lets me write reusable functions like functional guards and interceptors that inject things. The rule is it must run in an injection context, so not inside a click handler or setTimeout. Angular has a migration that converts constructor injection to inject().",
        run: true,
        ctx: true,
        code: `import { Injectable, inject } from '@angular/core'

@Injectable({ providedIn: 'root' })
class ApiConfig { baseUrl = 'https://jsonplaceholder.typicode.com/posts' }

// Old style: constructor(private config: ApiConfig) {}
// New style: a field with inject()
class PostService {
  private config = inject(ApiConfig)
  url(id: number) { return this.config.baseUrl + '/' + id }
}

// A reusable function can inject too
function injectPostUrl(id: number) {
  return inject(ApiConfig).baseUrl + '/' + id
}

console.log(new PostService().url(1))
console.log(injectPostUrl(2))
setTimeout(() => {
  try { inject(ApiConfig) } catch (e) { console.log((e as Error).message) }
})`,
      },
      {
        q: 'What are useClass, useValue, useFactory and useExisting providers?',
        level: 'Intermediate',
        a: "A provider tells the injector what to give when a token is requested. useClass gives an instance of another class (great for swapping a real service for a mock), useValue gives a fixed value like a config object, and useFactory runs a function, which is useful when the value depends on other services or the environment. useExisting makes one token an alias of another. I put these in the providers array of app.config.ts, a route or a component.",
        run: true,
        code: `import { Injector, InjectionToken, inject } from '@angular/core'

class Logger { log(m: string) { console.log('LOG:', m) } }
class QuietLogger extends Logger { override log(m: string) { console.log('quiet:', m) } }
const API_URL = new InjectionToken<string>('API_URL')
const IS_PROD = new InjectionToken<boolean>('IS_PROD')

const injector = Injector.create({
  providers: [
    { provide: IS_PROD, useValue: true },
    { provide: API_URL, useValue: 'https://jsonplaceholder.typicode.com/posts' },
    { provide: Logger, useFactory: () => (inject(IS_PROD) ? new QuietLogger() : new Logger()) },
    { provide: 'AppLogger', useExisting: Logger },
  ],
})

console.log(injector.get(API_URL))
injector.get(Logger).log('hello')
console.log(injector.get('AppLogger') === injector.get(Logger))`,
      },
      {
        q: 'What is an InjectionToken?',
        level: 'Intermediate',
        a: "An InjectionToken is a DI key for things that aren't classes, like a config object, a string or a function, because interfaces don't exist at runtime. I create it with new InjectionToken<T>('description') and provide a value for it, or give it a factory so it has a default. Then I read it with inject(TOKEN), fully typed. I use it for API URLs, feature flags and app config.",
        run: true,
        ctx: true,
        code: `import { InjectionToken, inject } from '@angular/core'

interface AppConfig { apiUrl: string; pageSize: number }

// A token with a default value, provided in root
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => ({ apiUrl: 'https://jsonplaceholder.typicode.com/posts', pageSize: 10 }),
})

// Override in app.config.ts if needed:
// providers: [{ provide: APP_CONFIG, useValue: { ... } }]

const config = inject(APP_CONFIG)
console.log(config.apiUrl)
console.log('page size:', config.pageSize)`,
      },
      {
        q: 'What are hierarchical injectors?',
        level: 'Advanced',
        a: "Angular has a tree of injectors: the root/environment injector, injectors for lazy-loaded routes, and element injectors for components. When something asks for a dependency, Angular starts at the closest injector and walks up until it finds a provider. So if a component lists a service in its own providers, it and its children get a separate instance instead of the root singleton. I use that for things like a per-form or per-dialog state service.",
        run: true,
        code: `import { Injector } from '@angular/core'

class Counter {
  static created = 0
  id = ++Counter.created
}

// root (app) injector and a child (e.g. a component with providers: [Counter])
const root = Injector.create({ providers: [Counter] })
const child = Injector.create({ providers: [Counter], parent: root })
const grandChild = Injector.create({ providers: [], parent: child })

console.log('root:', root.get(Counter).id)
console.log('child:', child.get(Counter).id)
console.log('grandChild:', grandChild.get(Counter).id)   // walks up to child
console.log('root again:', root.get(Counter).id)`,
      },
    ],
  },
  {
    topic: 'Signals',
    items: [
      {
        q: 'What are signals in Angular?',
        level: 'Basics',
        a: "A signal is a wrapper around a value that tells Angular when it changes. I create one with signal(initial), read it by calling it like count(), and change it with set() or update(). Because Angular knows exactly which templates read which signals, it can update just those parts of the page. Signals are now the main way I hold component state.",
        run: true,
        code: `import { signal } from '@angular/core'

const count = signal(0)
console.log(count())

count.set(5)
console.log(count())

count.update((n) => n + 1)
console.log(count())

const todos = signal<string[]>([])
todos.update((list) => [...list, 'Learn signals'])   // new array, not push
console.log(todos())`,
      },
      {
        q: 'What is computed()?',
        level: 'Basics',
        a: "computed() creates a read-only signal derived from other signals, like a total from a cart. It tracks the signals it reads automatically and only recalculates when one of them changes. It's also lazy and cached, so reading it many times doesn't recompute. I use it instead of storing derived values in separate state that could get out of sync.",
        run: true,
        code: `import { computed, signal } from '@angular/core'

const price = signal(100)
const qty = signal(2)

const total = computed(() => {
  console.log('computing...')
  return price() * qty()
})

console.log(total())
console.log(total())     // cached, no recompute
qty.set(3)
console.log(total())     // recomputes once`,
      },
      {
        q: 'What is effect() and when should you use it?',
        level: 'Intermediate',
        a: "effect() runs a function whenever the signals it reads change, for side effects like logging, saving to localStorage or syncing with a non-Angular library. It runs once at the start and then after changes, and Angular batches changes, so two quick set() calls cause one run with the latest value. It has to be created in an injection context, like a constructor. I avoid using effects to copy one signal into another; computed() or linkedSignal() is the right tool for that.",
        run: true,
        ctx: true,
        code: `import { effect, signal } from '@angular/core'

const theme = signal('light')

// e.g. in a component constructor
effect(() => {
  console.log('saving theme:', theme())
  // localStorage.setItem('theme', theme())
})

// Effects run once at the start, later (not synchronously), with the latest value
theme.set('dark')
theme.set('blue')    // batched with 'dark': only 'blue' is logged`,
      },
      {
        q: 'When do you use signals vs RxJS?',
        level: 'Intermediate',
        a: "I use signals for state: values that always have a current value and that the template shows, like a form value, a selected item or a cart. I use RxJS for events over time: HTTP streams, websockets, debouncing user typing, or combining async sources with operators like switchMap. They work together through toSignal and toObservable. In practice my components mostly hold signals, and RxJS lives in services for the async plumbing.",
        code: `// Signals: synchronous state with a current value
count = signal(0)
double = computed(() => this.count() * 2)

// RxJS: async streams and timing
results$ = this.search$.pipe(
  debounceTime(300),
  switchMap((term) => this.api.search(term)),
)

// Bridge: show the stream as a signal in the template
results = toSignal(this.results$, { initialValue: [] })`,
        output: `                Signals                     RxJS Observables
Has a value     Always (count())            Not necessarily
Time/async      No operators                debounce, switchMap, retry...
Subscriptions   None to manage              Must unsubscribe (or async pipe)
Best for        UI / component state        Events, HTTP, websockets
Interop         toObservable(signal)        toSignal(observable)`,
      },
      {
        q: 'How do you convert between signals and observables (toSignal / toObservable)?',
        level: 'Intermediate',
        a: "toSignal(obs$) subscribes to an observable and gives me a signal with its latest value, and it unsubscribes automatically when the component is destroyed. I pass an initialValue, or the signal starts as undefined. toObservable(sig) does the opposite and emits when the signal changes, which lets me use RxJS operators like debounceTime on a signal. Both come from @angular/core/rxjs-interop and need an injection context.",
        run: true,
        ctx: true,
        code: `import { signal } from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { BehaviorSubject, map } from 'rxjs'

// Observable -> signal
const user$ = new BehaviorSubject('Ann')
const user = toSignal(user$, { requireSync: true })
console.log('signal:', user())
user$.next('Bob')
console.log('signal:', user())

// Signal -> observable (emits after the change settles)
const query = signal('ang')
toObservable(query).pipe(map((q) => q.toUpperCase())).subscribe((q) => console.log('stream:', q))
query.set('angular')`,
      },
      {
        q: 'What is linkedSignal()?',
        level: 'Advanced',
        a: "linkedSignal() is a writable signal whose value resets based on another signal. It's for state that the user can change, but that should go back to a default when its source changes. A typical case is a selected item that resets to the first option when the list of options changes. Before this I'd have used an effect to set one signal from another, which is what Angular recommends avoiding.",
        run: true,
        code: `import { linkedSignal, signal } from '@angular/core'

const sizes = signal(['S', 'M', 'L'])
const selected = linkedSignal(() => sizes()[0])

console.log(selected())
selected.set('L')            // user picks L
console.log(selected())

sizes.set(['XL', 'XXL'])     // new options -> resets
console.log(selected())`,
      },
      {
        q: 'What are resource() and httpResource()?',
        level: 'Advanced',
        a: "resource() loads async data into signals: I give it params (a reactive function) and a loader, and it gives me value(), status(), isLoading() and error() signals. When the params change it reloads automatically and cancels the old request using an abort signal. httpResource() is the same idea built on HttpClient, so interceptors still apply. I use them for simple data fetching instead of manual subscribe code.",
        run: true,
        ctx: true,
        code: `import { resource, signal } from '@angular/core'

interface Post { id: number; title: string }
const postId = signal(1)

const post = resource({
  params: () => ({ id: postId() }),
  loader: async ({ params, abortSignal }) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/' + params.id, { signal: abortSignal })
    return (await res.json()) as Post
  },
})

console.log(post.status(), post.isLoading())
await new Promise((r) => setTimeout(r, 2000))
console.log(post.status(), post.value()?.id, post.value()?.title)

// Same with HttpClient: post = httpResource<Post>(() => 'https://jsonplaceholder.typicode.com/posts/' + postId())`,
      },
    ],
  },
  {
    topic: 'RxJS & observables',
    items: [
      {
        q: 'What is the difference between an Observable and a Promise?',
        level: 'Basics',
        a: "A Promise gives one value, starts immediately and can't be cancelled. An Observable can emit many values over time, is lazy (nothing happens until I subscribe) and can be cancelled by unsubscribing. Observables also come with operators like map, filter and switchMap. Angular's HttpClient, router events and form valueChanges all return Observables.",
        run: true,
        code: `import { Observable } from 'rxjs'

const promise = new Promise((resolve) => {
  console.log('promise starts right away')
  resolve(1)
  resolve(2)          // ignored, only one value
})

const obs$ = new Observable<number>((sub) => {
  console.log('observable starts on subscribe')
  sub.next(1)
  sub.next(2)
  sub.complete()
})

await promise.then((v) => console.log('promise:', v))
obs$.subscribe((v) => console.log('observable:', v))`,
      },
      {
        q: 'What is the difference between Subject, BehaviorSubject and ReplaySubject?',
        level: 'Intermediate',
        a: "A Subject is both an observable and an emitter, and it shares values with many subscribers, but late subscribers miss earlier values. A BehaviorSubject needs a starting value and always gives the latest value to new subscribers, which makes it good for state like the current user. A ReplaySubject replays the last N values to new subscribers. Before signals I used BehaviorSubject in services for shared state.",
        run: true,
        code: `import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs'

const subject = new Subject<string>()
subject.next('a')                               // nobody listening yet
subject.subscribe((v) => console.log('Subject:', v))
subject.next('b')

const behavior = new BehaviorSubject('guest')
behavior.next('Ann')
behavior.subscribe((v) => console.log('BehaviorSubject:', v))
console.log('current value:', behavior.value)

const replay = new ReplaySubject<number>(2)
replay.next(1); replay.next(2); replay.next(3)
replay.subscribe((v) => console.log('ReplaySubject:', v))`,
      },
      {
        q: 'How do the map, filter and tap operators work?',
        level: 'Basics',
        a: "Operators are functions I chain inside pipe() to transform a stream step by step. map changes each value, filter lets only some values through, and tap runs a side effect like logging without changing the value. They work like the array methods, but on values arriving over time. I use tap a lot for debugging a stream.",
        run: true,
        code: `import { from, filter, map, tap } from 'rxjs'

from([1, 2, 3, 4, 5])
  .pipe(
    tap((n) => console.log('in:', n)),
    filter((n) => n % 2 === 1),
    map((n) => n * 10),
  )
  .subscribe((n) => console.log('out:', n))`,
      },
      {
        q: 'What is the difference between switchMap, mergeMap, concatMap and exhaustMap?',
        level: 'Advanced',
        a: "All four map each value to an inner observable, like an HTTP call, but they differ when a new value arrives while the previous call is still running. switchMap cancels the old one and keeps only the latest, so I use it for search. mergeMap runs them all in parallel, concatMap queues them in order, and exhaustMap ignores new values until the current one finishes, which is perfect for a submit button that gets double-clicked. Picking the right one is a classic interview question.",
        run: true,
        code: `import { Observable, concatMap, delay, exhaustMap, lastValueFrom, map, mergeMap, of, switchMap, take, timer, toArray } from 'rxjs'

// Clicks 1, 2, 3 arrive every 10ms; each "request" takes 25ms
const clicks = timer(0, 10).pipe(map((i) => i + 1), take(3))
const request = (n: number) => of('r' + n).pipe(delay(25))

async function test(name: string, results$: Observable<string>) {
  const results = await lastValueFrom(results$.pipe(toArray()))
  console.log(name.padEnd(10), results.join(' '))
}

await test('switchMap', clicks.pipe(switchMap(request)))
await test('mergeMap', clicks.pipe(mergeMap(request)))
await test('concatMap', clicks.pipe(concatMap(request)))
await test('exhaustMap', clicks.pipe(exhaustMap(request)))`,
      },
      {
        q: 'How do debounceTime and distinctUntilChanged help with a search box?',
        level: 'Intermediate',
        a: "debounceTime(300) waits until the user stops typing for 300ms and then emits only the last value, so I don't send a request on every keystroke. distinctUntilChanged skips a value if it's the same as the previous one, for example when the user types and deletes a letter. Then switchMap makes the request and cancels any older one. This combo is the standard type-ahead search in Angular.",
        run: true,
        code: `import { Subject, debounceTime, distinctUntilChanged } from 'rxjs'

const typed$ = new Subject<string>()

typed$
  .pipe(debounceTime(300), distinctUntilChanged())
  .subscribe((term) => console.log('search for:', term))

// Simulate typing: "a", "an", "ang" quickly, a pause, then "ang" again, then "angular"
const keys: [number, string][] = [[0, 'a'], [50, 'an'], [100, 'ang'], [500, 'angu'], [520, 'ang'], [900, 'angular']]
for (const [ms, text] of keys) setTimeout(() => typed$.next(text), ms)`,
      },
      {
        q: 'How do you unsubscribe and avoid memory leaks (async pipe, takeUntilDestroyed)?',
        level: 'Intermediate',
        a: "Any subscription to a long-lived observable, like an interval, a websocket or valueChanges, must be stopped when the component is destroyed, or it keeps running and leaks memory. My first choice is to not subscribe manually at all: I use the async pipe or toSignal, which clean up for me. When I must subscribe, I add takeUntilDestroyed() from @angular/core/rxjs-interop. HTTP calls complete on their own, but I still clean up to be safe.",
        code: `import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({ selector: 'app-ticker', template: \`{{ ticks() }}\` })
export class Ticker {
  ticks = signal(0)

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed())          // completes on destroy
      .subscribe((n) => {
        this.ticks.set(n)
        console.log('tick', n)
      })
  }
}`,
        output: `Rendered: 0 → 1 → 2 ...
Console:
tick 0
tick 1
tick 2
(navigate away: component destroyed, no more ticks)

Without takeUntilDestroyed the ticks would keep logging forever.`,
      },
    ],
  },
]
