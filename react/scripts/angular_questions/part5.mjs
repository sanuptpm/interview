// More questions, merged into the existing sub-topics by name (see questions.mjs).
// A topic with `after` is new and is placed right after that topic.
export const part5 = [
  {
    topic: 'Components & templates',
    items: [
      {
        q: 'What are ng-template, ng-container and ngTemplateOutlet?',
        level: 'Intermediate',
        a: "ng-template defines a piece of template that is not rendered on its own; Angular only renders it when something asks for it, like an @if else branch or ngTemplateOutlet. ng-container is a grouping element that adds nothing to the DOM, so I use it when I need a wrapper for logic but don't want an extra div. ngTemplateOutlet renders a template wherever I want, and I can pass it a context object, which is how I build reusable pieces like a custom row template for a table component. The $implicit key in the context becomes the let- variable.",
        code: `@Component({
  selector: 'app-employees',
  imports: [NgTemplateOutlet],
  template: \`
    <!-- Defined once, not rendered by itself -->
    <ng-template #row let-emp let-i="index">
      <li>{{ i + 1 }}. {{ emp.name }} ({{ emp.role }})</li>
    </ng-template>

    <ul>
      @for (emp of employees; track emp.id; let i = $index) {
        <!-- ng-container adds no element to the DOM -->
        <ng-container *ngTemplateOutlet="row; context: { $implicit: emp, index: i }" />
      }
    </ul>
  \`,
})
export class Employees {
  employees = [
    { id: 1, name: 'Asha', role: 'Developer' },
    { id: 2, name: 'Ravi', role: 'Manager' },
  ]
}`,
        output: `Rendered DOM:
<ul>
  <li>1. Asha (Developer)</li>
  <li>2. Ravi (Manager)</li>
</ul>

No <ng-template> or <ng-container> element ends up in the DOM.`,
      },
      {
        q: 'What are @HostListener, @HostBinding and the host property?',
        level: 'Intermediate',
        a: "They let a component or directive work with its own host element, the element it is attached to. @HostListener listens to an event on the host (or on window/document), and @HostBinding binds a property, class or attribute of the host to a field. The Angular style guide now prefers the host property in the decorator, which does the same thing in one place and works nicely with signals. I use it for things like a highlight directive, a dropdown that closes on document click, or adding a class when a component is active.",
        code: `@Directive({
  selector: '[appHoverCard]',
  host: {
    '(mouseenter)': 'hovered.set(true)',     // like @HostListener('mouseenter')
    '(mouseleave)': 'hovered.set(false)',
    '[class.shadow-lg]': 'hovered()',         // like @HostBinding('class.shadow-lg')
    '[attr.aria-label]': '"Employee card"',
  },
})
export class HoverCard {
  hovered = signal(false)
}

// Older decorator style, same result:
// @HostListener('mouseenter') onEnter() { this.hovered.set(true) }
// @HostBinding('class.shadow-lg') get shadow() { return this.hovered() }

// <div appHoverCard>Asha</div>`,
        output: `Before hover: <div aria-label="Employee card">Asha</div>
On hover:     <div aria-label="Employee card" class="shadow-lg">Asha</div>
Mouse leaves: the class is removed again`,
      },
      {
        q: 'How do you create components dynamically?',
        level: 'Advanced',
        a: "When I don't know which component to show until runtime, like a dashboard of widgets from config or a modal service, I create it from code. The simplest way is NgComponentOutlet in the template, where I bind a component class and its inputs. From TypeScript I use ViewContainerRef.createComponent(MyComponent), then setInput() to pass inputs and subscribe to outputs, and I destroy the ComponentRef when I'm done. Since components are standalone, I don't need entryComponents or a factory resolver any more.",
        code: `@Component({
  selector: 'app-dashboard',
  imports: [NgComponentOutlet],
  template: \`
    <!-- 1. In the template -->
    <ng-container *ngComponentOutlet="widget(); inputs: { title: 'Sales' }" />

    <!-- 2. From code -->
    <button (click)="addChart()">Add chart</button>
    <ng-container #host />
  \`,
})
export class Dashboard {
  widget = signal<Type<unknown>>(SalesWidget)
  host = viewChild.required('host', { read: ViewContainerRef })

  addChart() {
    const ref = this.host().createComponent(ChartWidget)
    ref.setInput('title', 'Headcount')
    ref.instance.closed.subscribe(() => ref.destroy())
  }
}`,
        output: `Page load:        <app-sales-widget> "Sales"
Click Add chart:  <app-chart-widget> "Headcount" is appended after #host
Chart emits closed: ref.destroy() removes it from the DOM`,
      },
      {
        q: 'What is @let in Angular templates?',
        level: 'Basics',
        a: "@let declares a local variable inside the template, so I can compute a value once and reuse it instead of repeating a long expression or subscribing to the same async pipe several times. It's read-only and is re-evaluated on every change detection, and it's only visible in the template below where it is declared. I use it to keep templates clean, but real logic still belongs in the component as a computed().",
        code: `@Component({
  selector: 'app-profile',
  imports: [AsyncPipe],
  template: \`
    @let user = user$ | async;
    @let fullName = user?.first + ' ' + user?.last;

    @if (user) {
      <h2>{{ fullName }}</h2>
      <p>Email: {{ user.email }}</p>
    }
  \`,
})
export class Profile {
  user$ = of({ first: 'Asha', last: 'Nair', email: 'asha@example.com' })
}`,
        output: `<h2>Asha Nair</h2>
<p>Email: asha@example.com</p>

user$ is subscribed once, even though "user" is used three times.`,
      },
      {
        q: 'What is ngOnChanges, and how do input signals replace it?',
        level: 'Intermediate',
        a: "ngOnChanges runs before ngOnInit and again every time a parent changes an @Input, and it receives SimpleChanges with the previous value, current value and firstChange for each input. It doesn't run for changes made inside the component, and it doesn't see mutations inside an object, only a new reference. With signal inputs I usually don't need it: I derive values with computed() from the input, and if I need a side effect when it changes I use effect(). That keeps the logic close to the input instead of in one big hook.",
        code: `// Old: @Input + ngOnChanges
export class SalaryOld implements OnChanges {
  @Input() salary = 0
  tax = 0
  ngOnChanges(changes: SimpleChanges) {
    const c = changes['salary']
    console.log('salary', c.previousValue, '->', c.currentValue, 'first:', c.firstChange)
    this.tax = this.salary * 0.1
  }
}

// New: signal input + computed (no hook needed)
export class Salary {
  salary = input(0)
  tax = computed(() => this.salary() * 0.1)
}

// Parent: <app-salary [salary]="amount" />  amount: 50000 -> 60000`,
        output: `ngOnChanges log:
salary undefined -> 50000 first: true
salary 50000 -> 60000 first: false

Signal version: tax() is 5000, then 6000, recalculated automatically.`,
      },
    ],
  },
  {
    topic: 'Services & dependency injection',
    items: [
      {
        q: 'What are multi providers?',
        level: 'Advanced',
        a: "Normally a second provider for the same token replaces the first one. With multi: true, every provider adds a value, and injecting the token gives me an array of all of them. Angular uses this itself for HTTP interceptors in the old class style, validators and APP_INITIALIZER. I use it for plugin-style features, for example several modules each registering a menu item or a health check without one central file knowing about all of them.",
        run: true,
        code: `import { InjectionToken, Injector } from '@angular/core'

interface MenuItem { label: string; path: string }
const MENU_ITEMS = new InjectionToken<MenuItem[]>('MENU_ITEMS')

const injector = Injector.create({
  providers: [
    // Each feature module adds its own item
    { provide: MENU_ITEMS, multi: true, useValue: { label: 'Employees', path: '/employees' } },
    { provide: MENU_ITEMS, multi: true, useValue: { label: 'Payroll', path: '/payroll' } },
    { provide: MENU_ITEMS, multi: true, useValue: { label: 'Attendance', path: '/attendance' } },
  ],
})

const items = injector.get(MENU_ITEMS)
console.log('Is array:', Array.isArray(items), '| count:', items.length)
items.forEach((item) => console.log(item.label, '->', item.path))`,
      },
      {
        q: 'What do the inject() options optional, self, skipSelf and host do?',
        level: 'Advanced',
        a: "They change where and how Angular looks up a dependency. optional: true returns null instead of throwing when nothing provides the token. self: true looks only in the current injector, and skipSelf: true starts from the parent, which I use when a component provides a service but also wants the parent's instance, like nested menus. host: true stops the search at the host component. These used to be the @Optional, @Self, @SkipSelf and @Host decorators on constructor parameters.",
        run: `import { Injectable, InjectionToken, Injector, inject } from '@angular/core'

const THEME = new InjectionToken<string>('THEME')

@Injectable()
class Settings {
  theme = inject(THEME)
  parentTheme = inject(THEME, { skipSelf: true })
  analytics = inject(new InjectionToken<string>('ANALYTICS'), { optional: true })
}

const parent = Injector.create({ providers: [{ provide: THEME, useValue: 'light (parent)' }] })
const child = Injector.create({
  parent,
  providers: [{ provide: THEME, useValue: 'dark (child)' }, Settings],
})

const s = child.get(Settings)
console.log('inject(THEME):            ', s.theme)
console.log('inject(THEME, skipSelf):  ', s.parentTheme)
console.log('inject(missing, optional):', s.analytics)
console.log('child.get(THEME, null, { self: true }):', child.get(THEME, null, { self: true }))
const empty = Injector.create({ parent, providers: [] })
console.log('empty.get(THEME, null, { self: true }):', empty.get(THEME, null, { self: true }))`,
        code: `const THEME = new InjectionToken<string>('THEME')

@Injectable()
class Settings {
  theme = inject(THEME)                                      // nearest provider
  parentTheme = inject(THEME, { skipSelf: true })            // start at the parent
  analytics = inject(ANALYTICS, { optional: true })          // null if not provided
}

// parent injector: THEME = 'light (parent)'
// child injector:  THEME = 'dark (child)', Settings

// self: only this injector
child.get(THEME, null, { self: true })
emptyChild.get(THEME, null, { self: true })  // has no THEME of its own`,
      },
      {
        q: 'How do you run code before the app starts (provideAppInitializer)?',
        level: 'Intermediate',
        a: "provideAppInitializer registers a function that Angular runs while bootstrapping, and if it returns a Promise or Observable, the app waits for it before rendering the first component. I use it to load runtime config like the API URL from a config.json, restore the logged-in user from a refresh token, or load translations. It replaces the older APP_INITIALIZER multi provider with useFactory. I keep it fast, because the user sees nothing until it finishes, and I handle errors so a failed request doesn't leave a blank page.",
        code: `// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAppInitializer(() => {
      const config = inject(ConfigService)
      const auth = inject(AuthService)
      return Promise.all([
        config.load(),            // GET /assets/config.json
        auth.restoreSession(),    // POST /auth/refresh with the httpOnly cookie
      ]).catch(() => console.warn('Starting as guest'))
    }),
  ],
}

// Older style:
// { provide: APP_INITIALIZER, multi: true, useFactory: () => () => inject(ConfigService).load() }`,
        output: `bootstrapApplication(App, appConfig)
  -> runs the initializer
  -> GET /assets/config.json      (done)
  -> POST /auth/refresh           (done: user = Asha)
  -> renders <app-root>           (already knows the API URL and the user)`,
      },
    ],
  },
  {
    topic: 'Signals',
    items: [
      {
        q: 'How do you update arrays and objects inside a signal?',
        level: 'Basics',
        a: "A signal only notifies when it gets a new value, and by default it compares with Object.is, so if I push into the same array the signal doesn't change and computed values and the template don't update. I always create a new array or object with update(): spread to add, filter to remove, map to change one item. set() replaces the whole value, and update() gives me the current value to build the next one from.",
        run: true,
        ctx: true,
        code: `import { computed, signal } from '@angular/core'

interface Employee { id: number; name: string; salary: number }

const employees = signal<Employee[]>([{ id: 1, name: 'Asha', salary: 50000 }])
const total = computed(() => employees().reduce((sum, e) => sum + e.salary, 0))
console.log('start total:', total())

// Wrong: mutates the same array, the signal doesn't know
employees().push({ id: 2, name: 'Ravi', salary: 60000 })
console.log('after push (same array):', total())

// Right: new arrays and objects
employees.update((list) => [...list, { id: 3, name: 'Meera', salary: 55000 }])   // add
employees.update((list) => list.map((e) => (e.id === 1 ? { ...e, salary: 52000 } : e))) // edit
employees.update((list) => list.filter((e) => e.id !== 2))                       // remove
console.log('after update():', total(), employees().map((e) => e.name).join(', '))`,
      },
      {
        q: 'What is untracked(), and how do you control signal equality?',
        level: 'Advanced',
        a: "Inside computed() or effect(), every signal I read becomes a dependency. untracked() lets me read a signal without depending on it, which I use in effects when I want to react to one signal but only peek at another, like logging the current user when the page changes. A signal also has an equal option: by default it uses Object.is, but I can pass my own function so that setting an equal value, like an object with the same id, doesn't notify anyone.",
        run: true,
        ctx: true,
        code: `import { effect, signal, untracked } from '@angular/core'

const page = signal('dashboard')
const user = signal('Asha')
// Custom equality: same id = same value
const selected = signal({ id: 1, name: 'Asha' }, { equal: (a, b) => a.id === b.id })

effect(() => {
  const p = page()                       // tracked: re-runs when page changes
  const u = untracked(() => user())      // not tracked
  console.log('effect: page =', p, '| user =', u)
})
effect(() => console.log('selected:', selected().name))
const tick = () => new Promise((r) => setTimeout(r))
await tick()

user.set('Ravi')                         // effect does NOT re-run
await tick()
page.set('payroll')                      // effect re-runs and sees Ravi
await tick()

selected.set({ id: 1, name: 'Asha (copy)' })   // equal -> no notification
await tick()
selected.set({ id: 2, name: 'Ravi' })          // different id -> notifies`,
      },
      {
        q: 'How do required inputs, input transforms and aliases work?',
        level: 'Intermediate',
        a: "input.required<T>() makes the parent pass the value, and the compiler reports an error in the template if it's missing, so I don't need a default or a non-null assertion. The transform option converts the incoming value, and Angular gives me booleanAttribute and numberAttribute, so <app-button disabled> works without writing [disabled]=\"true\". alias lets the public name differ from the property name. All of these also exist on the old @Input decorator.",
        code: `@Component({ selector: 'app-employee-card', template: \`...\` })
export class EmployeeCard {
  employee = input.required<Employee>()                         // must be passed
  compact = input(false, { transform: booleanAttribute })       // <app-employee-card compact>
  pageSize = input(10, { transform: numberAttribute })          // pageSize="25" -> 25
  label = input('', { alias: 'aria-label' })                    // public name: aria-label
}

// <app-employee-card [employee]="asha" compact pageSize="25" />
// <app-employee-card compact />`,
        output: `<app-employee-card [employee]="asha" compact pageSize="25" />
  employee() = { name: 'Asha', ... }
  compact()  = true      (attribute present -> true)
  pageSize() = 25        (string "25" -> number)

<app-employee-card compact />
  error NG8008: Required input 'employee' from component EmployeeCard must be specified.`,
      },
    ],
  },
  {
    topic: 'RxJS & observables',
    items: [
      {
        q: 'What is the difference between of, from, interval and timer?',
        level: 'Basics',
        a: "They are creation functions. of emits the values I pass, one by one, and completes. from turns an array, a Promise or another iterable into an Observable. interval emits 0, 1, 2 every n milliseconds forever, so I always limit it with take or unsubscribe. timer waits once and emits 0, or with a second argument it waits and then keeps emitting like interval, which is handy for polling an API.",
        run: true,
        code: `import { from, interval, of, take, timer, lastValueFrom, toArray } from 'rxjs'

of(1, 2, 3).subscribe((v) => console.log('of:', v))
from(['Asha', 'Ravi']).subscribe((v) => console.log('from array:', v))
from(Promise.resolve('done')).subscribe((v) => console.log('from promise:', v))

const ticks = await lastValueFrom(interval(100).pipe(take(3), toArray()))
console.log('interval(100), take(3):', ticks)

const start = Date.now()
await lastValueFrom(timer(200))
console.log('timer(200) waited about', Math.round((Date.now() - start) / 100) * 100, 'ms')

const polls = await lastValueFrom(timer(0, 100).pipe(take(3), toArray()))
console.log('timer(0, 100) for polling:', polls)`,
      },
      {
        q: 'What is the difference between forkJoin, combineLatest, zip and withLatestFrom?',
        level: 'Intermediate',
        a: "forkJoin waits for every Observable to complete and emits their last values once, so it's like Promise.all and great for loading several HTTP calls in parallel. combineLatest emits whenever any source emits, after each has emitted at least once, so I use it for filters, like search text plus department. zip pairs values by index: first with first, second with second. withLatestFrom emits only when the main source emits and attaches the latest value of the other one, like a save click that takes the current form value.",
        run: true,
        ctx: true,
        code: `import { inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Subject, combineLatest, forkJoin, withLatestFrom, zip, of } from 'rxjs'

const http = inject(HttpClient)
const url = 'https://jsonplaceholder.typicode.com'

// forkJoin: parallel HTTP calls, one result when all complete
forkJoin({
  post: http.get<{ title: string }>(url + '/posts/1'),
  user: http.get<{ name: string }>(url + '/users/1'),
}).subscribe(({ post, user }) => console.log('forkJoin:', user.name, '|', post.title.slice(0, 20)))
await new Promise((r) => setTimeout(r, 1500))

// combineLatest: re-emits when any filter changes
const search = new BehaviorSubject('')
const dept = new BehaviorSubject('All')
combineLatest([search, dept]).subscribe(([s, d]) => console.log('combineLatest:', JSON.stringify(s), d))
search.next('as')
dept.next('IT')

// zip: pairs by index
zip(of('Asha', 'Ravi'), of(50000, 60000)).subscribe(([n, s]) => console.log('zip:', n, s))

// withLatestFrom: emits only on save, with the latest form value
const save = new Subject<void>()
const form = new BehaviorSubject({ name: 'A' })
save.pipe(withLatestFrom(form)).subscribe(([, value]) => console.log('withLatestFrom save:', value))
form.next({ name: 'As' })
form.next({ name: 'Asha' })   // no emission yet
save.next()`,
      },
      {
        q: 'What are hot and cold observables, and what does shareReplay do?',
        level: 'Intermediate',
        a: "A cold Observable starts its work for each subscriber: HttpClient is cold, so two subscriptions, like two async pipes on the same observable, make two HTTP requests. A hot Observable, like a Subject or DOM events, produces values whether anyone listens, and subscribers share them. shareReplay({ bufferSize: 1, refCount: true }) turns a cold source into a shared one: the first subscriber triggers the request, and later subscribers get the cached last value. I use it for things like config or the current user that many components read.",
        run: true,
        ctx: true,
        code: `import { inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom, shareReplay, tap } from 'rxjs'

const http = inject(HttpClient)
let requests = 0
const url = 'https://jsonplaceholder.typicode.com/posts/1'

// Cold: every subscriber sends its own request
const cold$ = http.get<{ id: number }>(url).pipe(tap(() => requests++))
await Promise.all([firstValueFrom(cold$), firstValueFrom(cold$), firstValueFrom(cold$)])
console.log('cold, 3 subscribers ->', requests, 'requests')

// Shared: one request, the rest get the replayed value
requests = 0
const shared$ = http.get<{ id: number }>(url).pipe(
  tap(() => requests++),
  shareReplay({ bufferSize: 1, refCount: false }),
)
await Promise.all([firstValueFrom(shared$), firstValueFrom(shared$)])
const late = await firstValueFrom(shared$)   // subscribes later
console.log('shareReplay, 3 subscribers ->', requests, 'request | late subscriber got post', late.id)`,
      },
    ],
  },
  {
    topic: 'HTTP',
    items: [
      {
        q: 'How do you send query params and headers with HttpClient?',
        level: 'Basics',
        a: "I pass an options object as the last argument: params for the query string and headers for HTTP headers. params can be a plain object, and Angular encodes the values for me, so I don't build URLs by hand with string concatenation. Both HttpParams and HttpHeaders are immutable, so methods like set() return a new instance. For headers every request needs, like the auth token, I use an interceptor instead.",
        run: `import { createEnvironmentInjector, inject, EnvironmentInjector } from '@angular/core'
import { HttpClient, HttpInterceptorFn, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'

// Only to print what is actually sent
const show: HttpInterceptorFn = (req, next) => {
  console.log('URL sent:', req.urlWithParams)
  console.log('Header  :', 'X-Request-Source =', req.headers.get('X-Request-Source'))
  return next(req)
}
const http = createEnvironmentInjector([provideHttpClient(withFetch(), withInterceptors([show]))], inject(EnvironmentInjector)).get(HttpClient)

const posts = await firstValueFrom(
  http.get<{ id: number; userId: number; title: string }[]>('https://jsonplaceholder.typicode.com/posts', {
    params: { userId: 1, _limit: 2 },
    headers: { 'X-Request-Source': 'employee-portal' },
  }),
)
posts.forEach((p) => console.log('post', p.id, 'by user', p.userId, '-', p.title.slice(0, 30)))`,
        ctx: true,
        code: `const posts = await firstValueFrom(
  http.get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
    params: { userId: 1, _limit: 2 },               // -> ?userId=1&_limit=2
    headers: { 'X-Request-Source': 'employee-portal' },
  }),
)

// Same thing with the immutable classes
const params = new HttpParams().set('userId', 1).set('_limit', 2)
const headers = new HttpHeaders().set('X-Request-Source', 'employee-portal')
http.get<Post[]>(url, { params, headers })`,
      },
      {
        q: 'How do you show a global loading spinner with an interceptor?',
        level: 'Intermediate',
        a: "I keep a counter of active requests in a small LoadingService with a signal, and a computed isLoading that is true while the counter is above zero. The interceptor increments it before calling next and decrements it in finalize, which runs on success, error and cancel, so the spinner can never get stuck. Using a counter instead of a boolean means parallel requests work: the spinner hides only when the last one finishes. The app shell shows the spinner with @if (loading.isLoading()).",
        run: `import { Injectable, computed, createEnvironmentInjector, inject, EnvironmentInjector, signal } from '@angular/core'
import { HttpClient, HttpInterceptorFn, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { finalize, firstValueFrom, forkJoin } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private active = signal(0)
  isLoading = computed(() => this.active() > 0)
  start() { this.active.update((n) => n + 1); console.log('active requests:', this.active()) }
  stop() { this.active.update((n) => n - 1); console.log('active requests:', this.active()) }
}

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService)
  loading.start()
  return next(req).pipe(finalize(() => loading.stop()))
}

const app = createEnvironmentInjector([provideHttpClient(withFetch(), withInterceptors([loadingInterceptor]))], inject(EnvironmentInjector))
const http = app.get(HttpClient)
const loading = app.get(LoadingService)

const url = 'https://jsonplaceholder.typicode.com/posts/'
const done = firstValueFrom(forkJoin([http.get(url + '1'), http.get(url + '2')]))
console.log('spinner visible:', loading.isLoading())
await done
console.log('spinner visible:', loading.isLoading())`,
        ctx: true,
        code: `@Injectable({ providedIn: 'root' })
export class LoadingService {
  private active = signal(0)
  isLoading = computed(() => this.active() > 0)
  start() { this.active.update((n) => n + 1) }
  stop() { this.active.update((n) => n - 1) }
}

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService)
  loading.start()
  return next(req).pipe(finalize(() => loading.stop())) // success, error or cancel
}

// app.html
// @if (loading.isLoading()) { <app-spinner /> }

// Two requests in parallel:
forkJoin([http.get(url + '1'), http.get(url + '2')])`,
      },
      {
        q: 'How do you cache GET requests with an interceptor?',
        level: 'Advanced',
        a: "I keep a Map from URL to the last HttpResponse in the interceptor. For a GET that's already in the map, I return of(cached.clone()) so no request goes out; otherwise I call next and store the response with tap. I only cache GETs, and I clear the cache entry after a POST, PUT or DELETE to the same resource so users don't see stale data. To let a call opt out, I use an HttpContextToken, which is cleaner than a custom header. For more complex needs I'd rather use shareReplay in a service or a library like TanStack Query for Angular.",
        run: `import { createEnvironmentInjector, inject, EnvironmentInjector } from '@angular/core'
import { HttpClient, HttpContext, HttpContextToken, HttpInterceptorFn, HttpResponse, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { firstValueFrom, of, tap } from 'rxjs'

export const CACHE = new HttpContextToken<boolean>(() => true)
const cache = new Map<string, HttpResponse<unknown>>()

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET' || !req.context.get(CACHE)) {
    console.log('skip cache:', req.urlWithParams)
    return next(req)
  }
  const hit = cache.get(req.urlWithParams)
  if (hit) {
    console.log('cache hit :', req.urlWithParams)
    return of(hit.clone())
  }
  console.log('network   :', req.urlWithParams)
  return next(req).pipe(tap((event) => { if (event instanceof HttpResponse) cache.set(req.urlWithParams, event) }))
}

const http = createEnvironmentInjector([provideHttpClient(withFetch(), withInterceptors([cacheInterceptor]))], inject(EnvironmentInjector)).get(HttpClient)
const url = 'https://jsonplaceholder.typicode.com/posts/1'

const a = await firstValueFrom(http.get<{ title: string }>(url))
const b = await firstValueFrom(http.get<{ title: string }>(url))
console.log('same data:', a.title === b.title)
await firstValueFrom(http.get(url, { context: new HttpContext().set(CACHE, false) }))`,
        ctx: true,
        code: `export const CACHE = new HttpContextToken<boolean>(() => true) // opt out per request
const cache = new Map<string, HttpResponse<unknown>>()

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET' || !req.context.get(CACHE)) return next(req)
  const hit = cache.get(req.urlWithParams)
  if (hit) return of(hit.clone())                     // no request sent
  return next(req).pipe(
    tap((event) => { if (event instanceof HttpResponse) cache.set(req.urlWithParams, event) }),
  )
}

http.get(url)   // network
http.get(url)   // cache
http.get(url, { context: new HttpContext().set(CACHE, false) }) // skips the cache`,
      },
    ],
  },
  {
    topic: 'Routing',
    items: [
      {
        q: 'How do you navigate from code and use query parameters?',
        level: 'Basics',
        a: "I inject Router and call navigate() with an array of path segments, or navigateByUrl() with a full string. Query params go in the extras, like { queryParams: { page: 2 } }, and queryParamsHandling: 'merge' keeps the existing ones. To read them I use ActivatedRoute.queryParamMap, or with withComponentInputBinding they arrive as inputs. In templates I prefer routerLink with [queryParams] because it renders a real link that users can open in a new tab.",
        code: `export class EmployeeList {
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  page = toSignal(this.route.queryParamMap.pipe(map((q) => Number(q.get('page') ?? 1))), { initialValue: 1 })

  open(id: number) {
    this.router.navigate(['/employees', id])                      // /employees/7
  }
  nextPage() {
    this.router.navigate([], {
      queryParams: { page: this.page() + 1 },
      queryParamsHandling: 'merge',                               // keep ?dept=IT
    })
  }
}

// <a [routerLink]="['/employees']" [queryParams]="{ dept: 'IT', page: 1 }">IT team</a>`,
        output: `Click "IT team"      -> /employees?dept=IT&page=1
nextPage()            -> /employees?dept=IT&page=2   (dept kept by 'merge')
open(7)               -> /employees/7
page() signal         -> 2 after nextPage()`,
      },
      {
        q: 'What is withComponentInputBinding()?',
        level: 'Intermediate',
        a: "It lets the router pass route params, query params, resolver data and static route data straight into the routed component's inputs, matched by name. So instead of injecting ActivatedRoute and subscribing to paramMap, I just declare id = input<string>() and it updates when the URL changes. I turn it on once with provideRouter(routes, withComponentInputBinding()). It keeps components simpler and easier to test, because in a test I can just set the input.",
        code: `// app.config.ts
provideRouter(routes, withComponentInputBinding())

// routes
{ path: 'employees/:id', component: EmployeeDetails, resolve: { employee: employeeResolver } }

// employee-details.ts: no ActivatedRoute needed
export class EmployeeDetails {
  id = input.required<string>()            // from :id
  tab = input<string>('profile')           // from ?tab=
  employee = input<Employee>()             // from the resolver
}`,
        output: `URL /employees/7?tab=salary
  id()       = '7'
  tab()      = 'salary'
  employee() = { id: 7, name: 'Asha', ... }

Go to /employees/8 -> id() becomes '8' (same component instance, input updated)`,
      },
      {
        q: 'How do you stop users leaving a page with unsaved changes (CanDeactivate)?',
        level: 'Intermediate',
        a: "A CanDeactivate guard runs when the user tries to leave a route, and it receives the component instance, so it can ask the component whether it's safe to leave. I give my form components a hasUnsavedChanges() method, and the guard returns true when the form is clean or asks for confirmation otherwise. It can return a boolean, a Promise or an Observable, so I can use a nice modal instead of confirm(). It only covers in-app navigation; for closing the tab I also listen to beforeunload.",
        code: `export interface HasUnsavedChanges { hasUnsavedChanges(): boolean }

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) =>
  !component.hasUnsavedChanges() || confirm('You have unsaved changes. Leave anyway?')

// routes
{ path: 'employees/new', component: AddEmployee, canDeactivate: [unsavedChangesGuard] }

export class AddEmployee implements HasUnsavedChanges {
  form = inject(FormBuilder).group({ name: [''] })
  hasUnsavedChanges() { return this.form.dirty }
}`,
        output: `Open /employees/new, click "Employees" without typing -> leaves at once
Type a name, click "Employees"  -> confirm dialog
  Cancel -> stays on the form, text kept
  OK     -> navigates away
After a successful save: form.markAsPristine() -> leaves without asking`,
      },
      {
        q: 'How do you handle redirects and a 404 page (wildcard routes)?',
        level: 'Basics',
        a: "I add a redirect for the empty path, { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, where pathMatch full matters, because with the default prefix every URL would match the empty path. At the very end I add a wildcard route, path: '**', that shows a NotFound component. Order matters because the router uses the first route that matches, so the wildcard must be last. redirectTo can also be a function now, which helps when the redirect depends on the user.",
        code: `export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'employees', loadChildren: () => import('./employees/routes') },
  { path: 'old-reports', redirectTo: 'reports' },
  { path: 'reports', component: Reports },
  { path: '**', component: NotFound },          // always last
]`,
        output: `/                -> /dashboard
/old-reports     -> /reports
/employees/7     -> lazy employees routes
/abc/xyz         -> NotFound page (wildcard)

If '**' were first, every URL would show NotFound.`,
      },
      {
        q: 'What are preloading strategies?',
        level: 'Advanced',
        a: "Lazy loading keeps the first bundle small, but then the user waits when they click a lazy route for the first time. A preloading strategy downloads lazy routes in the background after the app has loaded. NoPreloading is the default, PreloadAllModules loads every lazy route after startup, and I can write a custom strategy that preloads only routes marked with data: { preload: true }, for example the pages most users open next. For components inside a page, @defer with on idle or on viewport does a similar job.",
        code: `// Preload everything after the app is stable
provideRouter(routes, withPreloading(PreloadAllModules))

// Or only selected routes
@Injectable({ providedIn: 'root' })
export class SelectivePreload implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>) {
    return route.data?.['preload'] ? load() : of(null)
  }
}
provideRouter(routes, withPreloading(SelectivePreload))

{ path: 'employees', loadChildren: () => import('./employees/routes'), data: { preload: true } }
{ path: 'reports',   loadChildren: () => import('./reports/routes') }`,
        output: `App starts -> main bundle loads, dashboard shows
Then in the background: employees chunk downloaded (preload: true)
reports chunk: only downloaded when the user opens /reports

Click "Employees" -> opens instantly, no spinner`,
      },
    ],
  },
  {
    topic: 'Authentication & authorization',
    after: 'Routing',
    items: [
      {
        q: 'What is the difference between authentication and authorization in Angular?',
        level: 'Basics',
        a: "Authentication checks who the user is, for example by logging in and getting a token. Authorization checks what that user is allowed to do, based on their role or permissions. In Angular I do authentication in an AuthService that stores the user and token, and an interceptor that sends the token. I do authorization with route guards, which block pages, and with checks in templates that hide buttons. The server answers 401 when it doesn't know who you are and 403 when you're known but not allowed, and it must check both again, because anything in the browser can be bypassed.",
        run: true,
        code: `type Role = 'viewer' | 'hr' | 'admin'
interface User { name: string; role: Role }

const PERMISSIONS: Record<Role, string[]> = {
  viewer: ['employee.view'],
  hr: ['employee.view', 'employee.edit'],
  admin: ['employee.view', 'employee.edit', 'payroll.run'],
}

// What the API does for every request
function check(user: User | null, permission: string) {
  if (!user) return '401 Unauthorized (authentication failed: who are you?)'
  if (!PERMISSIONS[user.role].includes(permission)) return '403 Forbidden (authorization failed: not allowed)'
  return '200 OK'
}

console.log('guest  payroll.run  ->', check(null, 'payroll.run'))
console.log('Asha   payroll.run  ->', check({ name: 'Asha', role: 'hr' }, 'payroll.run'))
console.log('Asha   employee.edit->', check({ name: 'Asha', role: 'hr' }, 'employee.edit'))
console.log('Ravi   payroll.run  ->', check({ name: 'Ravi', role: 'admin' }, 'payroll.run'))`,
      },
      {
        q: 'How do you implement JWT login with an AuthService and signals?',
        level: 'Intermediate',
        a: "On login I post the credentials, and the API returns a short-lived access token plus the user, and sets the refresh token as an httpOnly cookie. I keep the access token and user in signals inside a root AuthService, not in localStorage, because XSS could read localStorage. computed() gives me isLoggedIn and the role, guards and templates read those, and an interceptor attaches the token. On logout I clear the signals, call the logout API to clear the cookie and navigate to /login. On page reload, an app initializer calls /refresh to get a new access token from the cookie.",
        run: true,
        ctx: true,
        code: `import { Injectable, computed, inject, signal } from '@angular/core'

interface User { name: string; role: 'viewer' | 'admin' }
interface LoginResponse { accessToken: string; user: User }

// Fake API for the example (a real one would be HttpClient.post('/api/login'))
async function loginApi(email: string, password: string): Promise<LoginResponse> {
  if (password !== 'secret') throw new Error('401 Invalid email or password')
  return { accessToken: 'eyJhbGciOiJIUzI1NiJ9.demo', user: { name: 'Asha', role: 'admin' } }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(null)   // in memory only
  user = signal<User | null>(null)
  isLoggedIn = computed(() => this.user() !== null)
  isAdmin = computed(() => this.user()?.role === 'admin')

  async login(email: string, password: string) {
    const res = await loginApi(email, password)
    this.token.set(res.accessToken)
    this.user.set(res.user)
  }
  logout() { this.token.set(null); this.user.set(null) }
  getToken() { return this.token() }
}

const auth = inject(AuthService)
try { await auth.login('asha@example.com', 'wrong') } catch (e) { console.log((e as Error).message) }
await auth.login('asha@example.com', 'secret')
console.log('logged in:', auth.isLoggedIn(), '| user:', auth.user()?.name, '| admin:', auth.isAdmin())
console.log('token for the interceptor:', auth.getToken())
auth.logout()
console.log('after logout:', auth.isLoggedIn(), auth.getToken())`,
      },
      {
        q: 'How do you write a role-based route guard?',
        level: 'Intermediate',
        a: "I put the allowed roles in the route's data and write one functional CanActivateFn that reads them. If there is no user it returns a UrlTree to /login, if the user's role isn't in the list it returns a UrlTree to /unauthorized, and otherwise true. Returning a UrlTree is better than calling router.navigate inside the guard, because the router handles the redirect cleanly. For lazy feature routes I use canMatch, so the code isn't even downloaded for users who can't open it. I test it with RouterTestingHarness.",
        code: `export const roleGuard: CanActivateFn = (route) => {
  const user = inject(AuthService).user()
  const router = inject(Router)
  if (!user) return router.createUrlTree(['/login'])
  const roles: string[] = route.data['roles'] ?? []
  return roles.length === 0 || roles.includes(user.role)
    ? true
    : router.createUrlTree(['/unauthorized'])
}

export const routes: Routes = [
  { path: 'admin', component: AdminPage, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'login', component: LoginPage },
  { path: 'unauthorized', component: UnauthorizedPage },
]

// auth.spec.ts
async function open(user: User | null) {
  TestBed.configureTestingModule({ providers: [provideRouter(routes)] })
  TestBed.inject(AuthService).user.set(user)
  const harness = await RouterTestingHarness.create()
  await harness.navigateByUrl('/admin')
  return harness.routeNativeElement?.textContent
}
it('sends a guest to /login', async () => expect(await open(null)).toBe('Login'))
it('sends a viewer to /unauthorized', async () =>
  expect(await open({ name: 'Asha', role: 'viewer' })).toBe('403: no access'))
it('lets an admin in', async () => expect(await open({ name: 'Ravi', role: 'admin' })).toBe('Admin panel'))`,
        output: `$ ng test --include src/app/auth.spec.ts --reporters=verbose
 ✓ src/app/auth.spec.ts > roleGuard > sends a guest to /login
 ✓ src/app/auth.spec.ts > roleGuard > sends a viewer to /unauthorized
 ✓ src/app/auth.spec.ts > roleGuard > lets an admin in
      Tests  3 passed (3)`,
      },
      {
        q: 'How do you refresh an expired token in a functional interceptor?',
        level: 'Advanced',
        a: "The auth interceptor adds the access token. When a response comes back 401, catchError calls the refresh endpoint, stores the new token and retries the original request once with it. If several requests fail at the same time, I don't want several refresh calls, so I keep the in-flight refresh as a shared observable with shareReplay and every failed request waits on the same one. I skip the logic for the /refresh call itself to avoid a loop, and if the refresh fails I log out and go to /login. Here a fake backend interceptor plays the server, because jsonplaceholder has no auth; the posts are real.",
        run: `import { createEnvironmentInjector, inject, EnvironmentInjector } from '@angular/core'
import { HttpClient, HttpErrorResponse, HttpInterceptorFn, HttpResponse, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { Observable, catchError, finalize, firstValueFrom, forkJoin, map, of, shareReplay, switchMap, throwError, delay } from 'rxjs'

let accessToken = 'token-1'
let refresh$: Observable<string> | null = null
let serverToken = 'token-1'
let refreshCalls = 0

const refreshToken = (http: HttpClient) =>
  (refresh$ ??= http.post<{ accessToken: string }>('/auth/refresh', {}).pipe(
    map((res) => { refreshCalls++; return (accessToken = res.accessToken) }),
    finalize(() => (refresh$ = null)),
    shareReplay(1),
  ))

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/auth/refresh')) return next(req)
  const http = inject(HttpClient)
  const withToken = (token: string) => req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })
  return next(withToken(accessToken)).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) return throwError(() => err)
      return refreshToken(http).pipe(switchMap((token) => {
        console.log('interceptor: retry', req.url.split('.com')[1], 'with', token)
        return next(withToken(token))
      }))
    }),
  )
}

// Fake backend: checks the token, then lets the real request go to jsonplaceholder
const fakeServer: HttpInterceptorFn = (req, next) => {
  if (req.url === '/auth/refresh') {
    console.log('server: POST /auth/refresh -> token-2')
    return of(new HttpResponse({ status: 200, body: { accessToken: 'token-2' } })).pipe(delay(200))
  }
  const sent = req.headers.get('Authorization')?.replace('Bearer ', '')
  const path = req.url.split('.com')[1]
  if (sent !== serverToken) {
    console.log('server:', path, 'with', sent, '-> 401')
    return throwError(() => new HttpErrorResponse({ status: 401, url: req.url }))
  }
  console.log('server:', path, 'with', sent, '-> 200')
  return next(req)
}

const http = createEnvironmentInjector(
  [provideHttpClient(withFetch(), withInterceptors([authInterceptor, fakeServer]))],
  inject(EnvironmentInjector),
).get(HttpClient)

serverToken = 'token-2'   // token-1 has expired: the server only accepts token-2 now
const url = 'https://jsonplaceholder.typicode.com/posts/'
const posts = await firstValueFrom(forkJoin([1, 2, 3].map((id) => http.get<{ id: number }>(url + id))))
console.log('component got posts', posts.map((p) => p.id).join(', '), '| refresh calls:', refreshCalls)`,
        ctx: true,
        code: `let accessToken = 'token-1'                 // kept in memory (AuthService)
let refresh$: Observable<string> | null = null

// One shared refresh for every request that fails at the same time
const refreshToken = (http: HttpClient) =>
  (refresh$ ??= http.post<{ accessToken: string }>('/auth/refresh', {}).pipe(
    map((res) => (accessToken = res.accessToken)),
    finalize(() => (refresh$ = null)),
    shareReplay(1),
  ))

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/auth/refresh')) return next(req)   // avoid a loop
  const http = inject(HttpClient)
  const withToken = (token: string) => req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })

  return next(withToken(accessToken)).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) return throwError(() => err)
      return refreshToken(http).pipe(switchMap((token) => next(withToken(token)))) // retry once
      // real app: refresh fails -> auth.logout() + router.navigate(['/login'])
    }),
  )
}

// Three requests at once with an expired token
forkJoin([1, 2, 3].map((id) => http.get(url + id)))`,
      },
    ],
  },
  {
    topic: 'Forms',
    items: [
      {
        q: 'What is the difference between setValue and patchValue, and how do you use valueChanges?',
        level: 'Basics',
        a: "setValue replaces the whole form value, so I must pass every control, and it throws if one is missing. patchValue updates only the controls I pass, which is what I use when filling a form from an API response that has extra or missing fields. valueChanges is an Observable of the form or control value, so I can react to typing with RxJS operators, for example debounce before a search. reset() clears values and the dirty/touched state.",
        run: true,
        code: `import '@angular/compiler'
import { FormControl, FormGroup } from '@angular/forms'

const form = new FormGroup({
  name: new FormControl(''),
  email: new FormControl(''),
  dept: new FormControl('IT'),
})

form.valueChanges.subscribe((v) => console.log('valueChanges:', JSON.stringify(v)))

form.patchValue({ name: 'Asha' })                // only name
try {
  form.setValue({ name: 'Ravi', email: 'ravi@example.com' } as any) // dept missing
} catch (e) {
  console.log('setValue error:', (e as Error).message.split('\\n')[0])
}
form.setValue({ name: 'Ravi', email: 'ravi@example.com', dept: 'HR' })
console.log('dirty:', form.dirty, '(code changes never mark a form dirty, only user input does)')
form.reset({ name: '', email: '', dept: 'IT' })`,
      },
      {
        q: 'How do you build a dynamic form with FormArray?',
        level: 'Intermediate',
        a: "FormArray holds a list of controls or groups whose length can change at runtime, like the skills or phone numbers of an employee. I push a new FormGroup to add a row and call removeAt(i) to delete one, and in the template I loop over controls with @for and bind each row with [formGroupName]=\"$index\" inside formArrayName. The array's value is an array, and its validity includes every row, so one invalid row makes the whole form invalid.",
        run: true,
        code: `import '@angular/compiler'
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'

const skillRow = (name = '', years = 0) =>
  new FormGroup({
    name: new FormControl(name, { nonNullable: true, validators: Validators.required }),
    years: new FormControl(years, { nonNullable: true }),
  })

const form = new FormGroup({
  employee: new FormControl('Asha', { nonNullable: true }),
  skills: new FormArray([skillRow('Angular', 3)]),
})

form.controls.skills.push(skillRow('RxJS', 2))     // add a row
form.controls.skills.push(skillRow())              // empty row: invalid
console.log('rows:', form.controls.skills.length, '| valid:', form.valid)

form.controls.skills.removeAt(2)                   // remove the empty row
console.log('rows:', form.controls.skills.length, '| valid:', form.valid)
console.log(JSON.stringify(form.getRawValue()))`,
        before: `Template:
<div formArrayName="skills">
  @for (row of form.controls.skills.controls; track row; let i = $index) {
    <div [formGroupName]="i">
      <input formControlName="name" /> <input type="number" formControlName="years" />
      <button type="button" (click)="form.controls.skills.removeAt(i)">Remove</button>
    </div>
  }
</div>

Output:`,
      },
      {
        q: 'How do you write a cross-field validator (password and confirm password)?',
        level: 'Intermediate',
        a: "A validator that compares two fields goes on the parent FormGroup, not on a single control, because it needs to see both values. It's a ValidatorFn that receives the group, reads the two controls and returns an error object like { passwordMismatch: true } or null. The error then lives on the group, so in the template I show the message with form.hasError('passwordMismatch'). The same pattern works for start date before end date or min salary below max salary.",
        run: true,
        code: `import '@angular/compiler'
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'

export const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value
  const confirm = group.get('confirm')?.value
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null
}

const form = new FormGroup(
  {
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirm: new FormControl('', Validators.required),
  },
  { validators: passwordsMatch },
)

form.setValue({ password: 'secret123', confirm: 'secret12' })
console.log('mismatch:', form.hasError('passwordMismatch'), '| valid:', form.valid)
form.setValue({ password: 'secret123', confirm: 'secret123' })
console.log('mismatch:', form.hasError('passwordMismatch'), '| valid:', form.valid)`,
      },
      {
        q: 'How do you write an async validator (e.g. check if an email is taken)?',
        level: 'Advanced',
        a: "An async validator returns a Promise or Observable of ValidationErrors or null, and it's the third argument of a FormControl or the asyncValidators option. While it runs, the control status is PENDING, which I use to show a 'checking...' hint and to disable the submit button. Async validators only run after all sync validators pass, so I don't hit the API for an empty or badly formatted email. To avoid a request on every keystroke I use updateOn: 'blur' or a debounce with timer inside the validator.",
        run: true,
        code: `import '@angular/compiler'
import { AbstractControl, AsyncValidatorFn, FormControl, Validators } from '@angular/forms'
import { map, timer } from 'rxjs'

const takenEmails = ['asha@example.com', 'ravi@example.com'] // pretend database

export const emailAvailable: AsyncValidatorFn = (control: AbstractControl) =>
  timer(300).pipe( // waits like an API call (and acts as a debounce)
    map(() => (takenEmails.includes(control.value) ? { emailTaken: true } : null)),
  )

const email = new FormControl('', {
  validators: [Validators.required, Validators.email],
  asyncValidators: emailAvailable,
})

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

email.setValue('not-an-email')
console.log('not-an-email      ->', email.status, JSON.stringify(email.errors), '(async not run)')
email.setValue('asha@example.com')
console.log('asha@example.com  ->', email.status)
await wait(400)
console.log('                  ->', email.status, JSON.stringify(email.errors))
email.setValue('meera@example.com')
await wait(400)
console.log('meera@example.com ->', email.status, email.errors)`,
      },
      {
        q: 'What is ControlValueAccessor and when do you implement it?',
        level: 'Advanced',
        a: "ControlValueAccessor is the bridge between Angular forms and a form control element. Built-in inputs already have one, but when I build my own control, like a star rating, a date picker or a styled dropdown, I implement it so the component works with formControlName and ngModel like a normal input. There are four methods: writeValue (form to component), registerOnChange (I call the saved function when the user changes the value), registerOnTouched, and optionally setDisabledState. I register it with the NG_VALUE_ACCESSOR multi provider using forwardRef.",
        code: `@Component({
  selector: 'app-star-rating',
  template: \`
    @for (star of [1, 2, 3, 4, 5]; track star) {
      <button type="button" [disabled]="disabled" (click)="select(star)" (blur)="onTouched()">
        {{ star <= value ? '★' : '☆' }}
      </button>
    }
  \`,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => StarRating), multi: true }],
})
export class StarRating implements ControlValueAccessor {
  value = 0
  disabled = false
  onChange = (value: number) => {}
  onTouched = () => {}

  writeValue(value: number) { this.value = value ?? 0 }          // form -> component
  registerOnChange(fn: (value: number) => void) { this.onChange = fn }
  registerOnTouched(fn: () => void) { this.onTouched = fn }
  setDisabledState(disabled: boolean) { this.disabled = disabled }

  select(star: number) {
    this.value = star
    this.onChange(star)                                         // component -> form
  }
}

// <app-star-rating formControlName="rating" />`,
        output: `form = fb.group({ rating: [3, Validators.min(1)] })

Shows:            ★★★☆☆          (writeValue(3))
Click 5th star:   ★★★★★          form.value.rating = 5, form dirty
form.disable():   all star buttons disabled (setDisabledState(true))`,
      },
    ],
  },
  {
    topic: 'Change detection & performance',
    items: [
      {
        q: 'What is the difference between markForCheck, detectChanges and runOutsideAngular?',
        level: 'Advanced',
        a: "With OnPush, Angular only checks a component when an input changes, an event fires inside it, the async pipe emits or a signal it reads changes. If I change a plain field from somewhere else, like a manual subscription, markForCheck() marks the component and its ancestors so they are checked in the next cycle. detectChanges() runs change detection on this component and its children right now, synchronously. NgZone.runOutsideAngular() runs code like a scroll or mousemove listener without triggering change detection on every event. With signals and zoneless Angular I rarely need these.",
        code: `@Component({ selector: 'app-clock', changeDetection: ChangeDetectionStrategy.OnPush, template: \`{{ time }}\` })
export class Clock {
  private cdr = inject(ChangeDetectorRef)
  private zone = inject(NgZone)
  time = ''

  constructor() {
    // Plain field updated from a subscription: OnPush won't notice by itself
    interval(1000).pipe(takeUntilDestroyed()).subscribe(() => {
      this.time = new Date().toLocaleTimeString()
      this.cdr.markForCheck()        // check me in the next cycle
    })

    // Hundreds of events per second, no change detection for them
    this.zone.runOutsideAngular(() => {
      window.addEventListener('mousemove', (e) => trackMouse(e.x, e.y))
    })
  }
}

// Modern version: time = signal(''); this.time.set(...)  -> no cdr needed`,
        output: `Without markForCheck: the clock text stays frozen (OnPush skips it)
With markForCheck:    updates every second
detectChanges():      would update immediately, only this subtree
runOutsideAngular:    mousemove fires 100s of times, 0 change detection runs`,
      },
    ],
  },
  {
    topic: 'Testing',
    items: [
      {
        q: 'How do you test code that uses timers or debounceTime?',
        level: 'Advanced',
        a: "I don't want tests that really wait 300 ms, so I use fake timers. With Vitest, which is the default for new Angular projects, I call vi.useFakeTimers() and move time forward with vi.advanceTimersByTime(). In older Jasmine/Karma projects with zone.js the same idea is fakeAsync() with tick(). The test types three values quickly, checks that nothing happened at 299 ms, then moves 1 ms more and checks that only the last value was searched. I restore real timers afterwards.",
        code: `// search.ts
@Injectable({ providedIn: 'root' })
export class SearchService {
  private input$ = new Subject<string>()
  searches = signal<string[]>([])

  constructor() {
    this.input$.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((text) => this.searches.update((list) => [...list, text]))
  }
  type(text: string) { this.input$.next(text) }
}

// search.spec.ts
describe('SearchService (debounce)', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('searches once, 300 ms after the last keystroke', () => {
    const search = TestBed.inject(SearchService)
    search.type('a')
    search.type('an')
    search.type('ang')
    vi.advanceTimersByTime(299)
    expect(search.searches()).toEqual([])        // still typing

    vi.advanceTimersByTime(1)
    expect(search.searches()).toEqual(['ang'])   // only the last value
  })
})

// Jasmine + zone.js version: it('...', fakeAsync(() => { ...; tick(300); ... }))`,
        output: `$ ng test --include src/app/search.spec.ts --reporters=verbose
 ✓ src/app/search.spec.ts > SearchService (debounce) > searches once, 300 ms after the last keystroke
      Tests  1 passed (1)`,
      },
    ],
  },
  {
    topic: 'Advanced',
    items: [
      {
        q: 'How do you handle errors globally (ErrorHandler)?',
        level: 'Intermediate',
        a: "Angular sends every uncaught error, from components, effects or subscriptions without an error callback, to the ErrorHandler service, which by default just logs it to the console. I replace it with my own class that logs to a monitoring tool like Sentry and shows a friendly toast, and I provide it with { provide: ErrorHandler, useClass: GlobalErrorHandler }. HTTP errors I still handle closer to the call or in an interceptor, because there I know the status code. provideBrowserGlobalErrorListeners() also forwards window errors and unhandled promise rejections to the same handler.",
        run: true,
        code: `import { ErrorHandler, Injectable, Injector } from '@angular/core'

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.log('[monitoring] sent:', message)               // e.g. Sentry.captureException
    console.log('[toast] Something went wrong. Please try again.')
  }
}

const injector = Injector.create({ providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }] })
const handler = injector.get(ErrorHandler)

// What Angular does when a component throws
try {
  const employee: any = undefined
  console.log(employee.name)
} catch (e) {
  handler.handleError(e)
}`,
        after: `app.config.ts:
providers: [
  provideBrowserGlobalErrorListeners(),
  { provide: ErrorHandler, useClass: GlobalErrorHandler },
]`,
      },
      {
        q: 'How do you manage environment configuration in Angular?',
        level: 'Basics',
        a: "The CLI way is environment files: environment.ts for development and environment.prod.ts for production, swapped at build time by fileReplacements in angular.json. I import from environment.ts everywhere and the build picks the right one. Because the values are compiled into the bundle, they are public, so I never put secrets there. If the same build must run in several environments, like QA and production in Docker, I load a config.json at startup with provideAppInitializer instead, so I can change the API URL without rebuilding.",
        code: `// src/environments/environment.ts
export const environment = { production: false, apiUrl: 'http://localhost:3000' }

// src/environments/environment.prod.ts
export const environment = { production: true, apiUrl: 'https://api.mycompany.com' }

// angular.json -> configurations.production
"fileReplacements": [
  { "replace": "src/environments/environment.ts", "with": "src/environments/environment.prod.ts" }
]

// any service
import { environment } from '../environments/environment'
http.get(environment.apiUrl + '/employees')`,
        output: `ng serve                -> apiUrl = http://localhost:3000
ng build                -> apiUrl = https://api.mycompany.com (production is the default)
ng build -c development -> apiUrl = http://localhost:3000

Everything in environment.ts ends up in the JS bundle: no secrets.`,
      },
    ],
  },
  {
    topic: 'Coding round',
    items: [
      {
        q: 'Build a cart service with signals (add, remove, total).',
        level: 'Intermediate',
        a: "I keep the items in one private signal and expose it read-only with asReadonly(), so components can't change it directly. Derived values like the item count and total price are computed(), so they're always correct and only recalculate when the items change. Adding an item that's already in the cart increases its quantity instead of adding a duplicate, and every change uses update() with a new array. Any component can inject the service and read cart.total() in its template.",
        run: true,
        ctx: true,
        code: `import { Injectable, computed, inject, signal } from '@angular/core'

interface Product { id: number; name: string; price: number }
interface CartItem extends Product { qty: number }

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([])
  readonly list = this.items.asReadonly()
  readonly count = computed(() => this.items().reduce((n, i) => n + i.qty, 0))
  readonly total = computed(() => this.items().reduce((sum, i) => sum + i.price * i.qty, 0))

  add(product: Product) {
    this.items.update((items) =>
      items.some((i) => i.id === product.id)
        ? items.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { ...product, qty: 1 }],
    )
  }
  remove(id: number) { this.items.update((items) => items.filter((i) => i.id !== id)) }
}

const cart = inject(CartService)
cart.add({ id: 1, name: 'Keyboard', price: 1500 })
cart.add({ id: 2, name: 'Mouse', price: 500 })
cart.add({ id: 1, name: 'Keyboard', price: 1500 })
console.log(cart.list().map((i) => i.name + ' x' + i.qty).join(', '), '| count:', cart.count(), '| total:', cart.total())
cart.remove(2)
console.log(cart.list().map((i) => i.name + ' x' + i.qty).join(', '), '| count:', cart.count(), '| total:', cart.total())`,
      },
      {
        q: 'Build pagination for a list with signals.',
        level: 'Intermediate',
        a: "I store only the source data and the current page in signals; everything else is computed: the total number of pages, the items on the current page with slice, and whether previous and next are allowed. The next and previous methods clamp the page so it can't go out of range, and when the data changes I reset to page 1. Here the posts come from jsonplaceholder through HttpClient and toSignal-style loading, and the same pattern works for client-side tables with search and sort.",
        run: true,
        ctx: true,
        code: `import { computed, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'

interface Post { id: number; title: string }

const posts = signal<Post[]>([])
const page = signal(1)
const pageSize = 4

const totalPages = computed(() => Math.max(1, Math.ceil(posts().length / pageSize)))
const visible = computed(() => posts().slice((page() - 1) * pageSize, page() * pageSize))
const canPrev = computed(() => page() > 1)
const canNext = computed(() => page() < totalPages())

const next = () => page.update((p) => Math.min(p + 1, totalPages()))
const prev = () => page.update((p) => Math.max(p - 1, 1))

const show = () =>
  console.log(\`page \${page()}/\${totalPages()} ids [\${visible().map((p) => p.id)}] prev:\${canPrev()} next:\${canNext()}\`)

posts.set(await firstValueFrom(inject(HttpClient).get<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=10')))
show()
next(); show()
next(); show()
next(); show()   // already on the last page: stays
prev(); show()`,
      },
    ],
  },
]
