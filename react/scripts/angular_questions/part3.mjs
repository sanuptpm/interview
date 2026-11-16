// HTTP, routing, forms.
export const part3 = [
  {
    topic: 'HTTP',
    items: [
      {
        q: 'How do you make HTTP calls with HttpClient?',
        level: 'Basics',
        a: "I inject HttpClient, usually in a service, and call get, post, put or delete with a generic type for the response, like http.get<Post[]>(url). It returns a cold Observable, so the request only fires when something subscribes, for example the async pipe or toSignal. It parses JSON for me and gives typed data. HttpClient is available in root, and in app.config.ts I add provideHttpClient() when I want options like withFetch() or interceptors.",
        run: true,
        ctx: true,
        code: `import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom, map } from 'rxjs'

interface Post { id: number; title: string }

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient)
  private url = 'https://jsonplaceholder.typicode.com/posts'

  getPosts() { return this.http.get<Post[]>(this.url) }
  create(title: string) { return this.http.post<Post>(this.url, { title }) }
}

const api = inject(PostService)
const posts = await firstValueFrom(api.getPosts().pipe(map((p) => p.slice(0, 3))))
posts.forEach((p) => console.log(p.id, p.title))
const created = await firstValueFrom(api.create('My new post'))
console.log('created:', created)`,
      },
      {
        q: 'What are HTTP interceptors and how do you write a functional interceptor?',
        level: 'Intermediate',
        a: "An interceptor sits between my code and the server and sees every request and response. I use them for adding an auth token, logging, showing a global spinner and handling errors in one place. In modern Angular an interceptor is just a function (HttpInterceptorFn) that receives the request and next, and I register it with provideHttpClient(withInterceptors([...])). Requests are immutable, so I use req.clone() to change them.",
        run: `import { createEnvironmentInjector, inject, EnvironmentInjector } from '@angular/core'
import { HttpClient, HttpEventType, HttpInterceptorFn, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { firstValueFrom, tap } from 'rxjs'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({ setHeaders: { Authorization: 'Bearer my-token' } })
  return next(authReq)
}

export const logInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('->', req.method, req.url, '|', req.headers.get('Authorization'))
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) console.log('<- status', event.status)
    }),
  )
}

const appInjector = createEnvironmentInjector(
  [provideHttpClient(withFetch(), withInterceptors([authInterceptor, logInterceptor]))],
  inject(EnvironmentInjector),
)
const http = appInjector.get(HttpClient)
const post = await firstValueFrom(http.get<{ title: string }>('https://jsonplaceholder.typicode.com/posts/1'))
console.log(post.title)`,
        ctx: true,
        code: `export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({ setHeaders: { Authorization: 'Bearer my-token' } })
  return next(authReq)
}

export const logInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('->', req.method, req.url, '|', req.headers.get('Authorization'))
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) console.log('<- status', event.status)
    }),
  )
}

// app.config.ts
providers: [provideHttpClient(withInterceptors([authInterceptor, logInterceptor]))]

// somewhere in a service
const post = await firstValueFrom(http.get<{ title: string }>('https://jsonplaceholder.typicode.com/posts/1'))
console.log(post.title)`,
      },
      {
        q: 'How do you handle HTTP errors and retry failed requests?',
        level: 'Intermediate',
        a: "HttpClient errors arrive as an HttpErrorResponse in the observable's error channel, with status and message. I use catchError to turn them into a friendly message or a fallback value, and retry({ count, delay }) to retry flaky network calls before giving up. For app-wide handling, like redirecting to login on a 401, I put the logic in an interceptor. I don't retry things like a POST payment that isn't safe to repeat.",
        run: true,
        ctx: true,
        code: `import { inject } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError, defer, firstValueFrom, of, retry } from 'rxjs'

const http = inject(HttpClient)
let attempt = 0

const post$ = defer(() => {
  console.log('attempt', ++attempt)
  return http.get('https://jsonplaceholder.typicode.com/posts/99999')
}).pipe(
  retry({ count: 2, delay: 200 }),
  catchError((err: HttpErrorResponse) => {
    console.log('failed with status', err.status)
    return of(null)              // fallback value for the UI
  }),
)

console.log('result:', await firstValueFrom(post$))`,
      },
    ],
  },
  {
    topic: 'Routing',
    items: [
      {
        q: 'How do you set up routing (routes, provideRouter, router-outlet, routerLink)?',
        level: 'Basics',
        a: "I define a Routes array mapping paths to components and register it with provideRouter(routes) in app.config.ts. In the root template I place <router-outlet />, which is where the matched component is shown. For links I use routerLink instead of href, so the page doesn't reload, and routerLinkActive to style the current link. To navigate in code I inject Router and call navigate() or navigateByUrl().",
        code: `// app.routes.ts
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'posts', component: PostList },
  { path: '**', component: NotFound },
]

// app.ts
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
    <a routerLink="/posts" routerLinkActive="active">Posts</a>
    <router-outlet />
  \`,
})
export class App {}`,
        output: `URL /          → Home component shown, "Home" link has class active
URL /posts     → PostList component shown, "Posts" link has class active
URL /oops      → NotFound component shown
(no full page reload when clicking the links)`,
      },
      {
        q: 'How do you read route parameters?',
        level: 'Intermediate',
        a: "For a route like posts/:id, the easiest modern way is to turn on withComponentInputBinding() and declare an input named id, so the router passes the param straight in. The classic way is to inject ActivatedRoute and read route.snapshot.paramMap or subscribe to route.paramMap if the param can change while the component stays on screen. Query params work the same way through queryParamMap or inputs.",
        code: `// app.config.ts
provideRouter([{ path: 'posts/:id', component: PostDetail }], withComponentInputBinding())

@Component({ selector: 'app-post-detail', template: \`<h2>Post #{{ id() }}</h2>\` })
export class PostDetail {
  id = input.required<string>()          // filled from :id

  // classic way
  private route = inject(ActivatedRoute)
  idFromRoute = this.route.snapshot.paramMap.get('id')
}

// <a [routerLink]="['/posts', 7]">Open</a>`,
        output: `URL /posts/7
Rendered: Post #7
idFromRoute = '7'   (params are always strings)`,
      },
      {
        q: 'How does lazy loading work with loadComponent and loadChildren?',
        level: 'Intermediate',
        a: "Lazy loading means the code for a route is downloaded only when the user first visits it, which makes the initial bundle smaller and the app start faster. With standalone components I use loadComponent for a single page and loadChildren to load a whole file of child routes. The build tool automatically splits each one into its own chunk. I lazy load every feature area like admin or settings.",
        code: `export const routes: Routes = [
  { path: '', component: Home },                       // eager
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings').then((m) => m.Settings),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
]`,
        output: `ng build output (example):
Initial chunk files | Names   |  Raw size
main-XXXX.js        | main    | 180.12 kB
Lazy chunk files    | Names   |  Raw size
chunk-AAAA.js       | settings|  12.40 kB
chunk-BBBB.js       | admin-routes | 35.88 kB

The settings chunk downloads only when the user opens /settings.`,
      },
      {
        q: 'What are route guards (functional CanActivate) and how do you write one?',
        level: 'Intermediate',
        a: "A guard decides whether the router may activate, leave or load a route. Today a guard is just a function, like CanActivateFn, that can inject services and return true, false or a UrlTree to redirect. I use canActivate for login and role checks, canDeactivate to warn about unsaved changes, and canMatch to choose between routes. Guards only protect the UI; the API must still check permissions on the server.",
        code: `export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login'])
}

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
]`,
        output: `Logged out, visiting /dashboard → redirected to /login
Logged in,  visiting /dashboard → Dashboard shown`,
      },
      {
        q: 'What is a route resolver?',
        level: 'Advanced',
        a: "A resolver loads data before the route activates, so the component opens with its data ready instead of showing a loading state. It's a ResolveFn that can inject services and return a value, Promise or Observable, and the result appears in the route data (or as an input with component input binding). The downside is the navigation waits for the data, so for slow APIs I prefer loading inside the component with a skeleton. I use resolvers for small, essential data.",
        code: `export const postResolver: ResolveFn<Post> = (route) =>
  inject(PostService).getPost(Number(route.paramMap.get('id')))

export const routes: Routes = [
  { path: 'posts/:id', component: PostDetail, resolve: { post: postResolver } },
]

@Component({ selector: 'app-post-detail', template: \`<h2>{{ post().title }}</h2>\` })
export class PostDetail {
  post = input.required<Post>()     // with withComponentInputBinding()
}`,
        output: `Navigating to /posts/1:
1. router calls postResolver → GET https://jsonplaceholder.typicode.com/posts/1
2. after the response the page shows:
   sunt aut facere repellat provident occaecati excepturi optio reprehenderit`,
      },
    ],
  },
  {
    topic: 'Forms',
    items: [
      {
        q: 'What is the difference between template-driven and reactive forms?',
        level: 'Basics',
        a: "Template-driven forms are built in the HTML with ngModel and are fine for simple forms like a login or a search box. Reactive forms are built in the class with FormGroup and FormControl, so the form model is explicit, typed, easy to test and easy to make dynamic. For anything with real validation or dynamic fields I use reactive forms. Newer Angular also has Signal Forms, built on signals.",
        code: `// Template-driven
// <input name="email" [(ngModel)]="email" required email />

// Reactive
form = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
})
// <form [formGroup]="form"><input formControlName="email" /></form>`,
        output: `                 Template-driven         Reactive
Defined in       HTML (ngModel)          TypeScript class
Module           FormsModule             ReactiveFormsModule
Data flow        Async, two-way          Sync, explicit
Validation       Directives in HTML      Validator functions
Testing          Harder (needs DOM)      Easy (plain objects)
Best for         Simple forms            Complex / dynamic forms`,
      },
      {
        q: 'How do you build a reactive form with FormGroup, FormControl and FormBuilder?',
        level: 'Basics',
        a: "A FormControl tracks one field's value and validity, and a FormGroup groups controls into an object; FormArray is for lists. FormBuilder (inject(FormBuilder) or NonNullableFormBuilder) is a shorter way to create them. In the template I bind [formGroup] on the form and formControlName on each input after importing ReactiveFormsModule. Then I read form.value, form.valid and listen to valueChanges.",
        run: true,
        code: `import { FormBuilder, Validators } from '@angular/forms'

const fb = new FormBuilder().nonNullable     // in a component: inject(NonNullableFormBuilder)

const form = fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
})

form.valueChanges.subscribe((v) => console.log('changed:', v))

console.log('valid:', form.valid)
form.patchValue({ name: 'Ann', email: 'ann@example.com' })
console.log('valid:', form.valid)
form.reset()
console.log('after reset:', form.value)`,
      },
      {
        q: 'How do validators work, and how do you write a custom validator?',
        level: 'Intermediate',
        a: "A validator is a function that takes a control and returns null if it's valid or an error object like { required: true } if not. Angular has built-ins: required, email, minLength, maxLength, min, max and pattern. A custom validator is just my own function with the same shape, and I can put one on a FormGroup to compare fields, like password and confirm password. In the template I show messages using control.hasError('...') and touched.",
        run: true,
        code: `import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'

// Custom field validator
export const noSpaces: ValidatorFn = (c: AbstractControl): ValidationErrors | null =>
  /\\s/.test(c.value) ? { noSpaces: true } : null

// Cross-field validator on the group
export const passwordsMatch: ValidatorFn = (g: AbstractControl) =>
  g.get('password')?.value === g.get('confirm')?.value ? null : { mismatch: true }

const username = new FormControl('ann smith', [Validators.required, Validators.minLength(3), noSpaces])
console.log(username.errors)

const pw = new FormGroup(
  { password: new FormControl('secret1'), confirm: new FormControl('secret2') },
  { validators: passwordsMatch },
)
console.log(pw.errors)
pw.controls.confirm.setValue('secret1')
console.log(pw.errors)`,
      },
      {
        q: 'What are typed reactive forms?',
        level: 'Intermediate',
        a: "Since Angular 14 reactive forms are strongly typed: a FormControl('') is a FormControl<string | null>, and form.value has a proper type instead of any. The | null is there because reset() sets the value to null; with nonNullable: true or NonNullableFormBuilder it resets to the initial value and stays a plain string. The compiler then catches mistakes like setting a number on a string field or reading a field that doesn't exist.",
        kind: 'error',
        code: `import { FormControl, FormGroup } from '@angular/forms'

const form = new FormGroup({
  name: new FormControl('', { nonNullable: true }),
  age: new FormControl(0, { nonNullable: true }),
})

const name: string = form.controls.name.value   // OK: string
form.controls.age.setValue('thirty')            // wrong type
form.controls.email                              // no such field`,
        after: `(If the form were untyped, both mistakes would only show up at runtime.)`,
      },
      {
        q: 'What are Signal Forms?',
        level: 'Advanced',
        a: "Signal Forms are the newer forms API built on signals, from @angular/forms/signals. I keep the form data in a signal model, call form(model, schema) with validation rules like required and email, and bind inputs with the [formField] directive. Each field's value, errors and valid state are signals, so I read them like anything else in the template. For new forms in recent Angular versions it's a simpler option than FormGroup.",
        run: true,
        ctx: true,
        code: `import { signal } from '@angular/core'
import { email, form, required } from '@angular/forms/signals'

const model = signal({ name: '', email: '' })

const loginForm = form(model, (p) => {
  required(p.name, { message: 'Name is required' })
  email(p.email, { message: 'Enter a valid email' })
})

// template: <input [formField]="loginForm.name" />
loginForm.email().value.set('ann@')
console.log('valid:', loginForm().valid())
console.log(loginForm.name().errors().map((e) => e.message))
console.log(loginForm.email().errors().map((e) => e.message))

loginForm.name().value.set('Ann')
loginForm.email().value.set('ann@example.com')
console.log('valid:', loginForm().valid(), model())`,
      },
    ],
  },
]
