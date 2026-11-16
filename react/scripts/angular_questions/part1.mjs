// Getting started, components, data binding, control flow & directives, communication.
export const part1 = [
  {
    topic: 'Getting started',
    items: [
      {
        q: 'What is Angular and why use it?',
        level: 'Basics',
        a: "Angular is a full front-end framework from Google for building single-page apps in TypeScript. Unlike a library, it comes with everything built in: components, routing, forms, HttpClient, dependency injection and testing tools. I like it for large team projects because the structure is opinionated, so every Angular codebase looks familiar. Modern Angular is also much lighter than it used to be, with standalone components and signals.",
        code: `import { Component, signal } from '@angular/core'

@Component({
  selector: 'app-hello',
  template: \`<h1>Hello, {{ name() }}!</h1>\`,
})
export class Hello {
  name = signal('Angular')
}`,
        output: `Rendered:
Hello, Angular!`,
      },
      {
        q: 'What is the difference between Angular and React?',
        level: 'Basics',
        a: "React is a UI library, so I pick my own router, forms and data-fetching tools, while Angular is a complete framework with all of those built in. Angular uses TypeScript and HTML templates with its own syntax, while React uses JSX inside JavaScript. Angular has real dependency injection and services; in React I'd use context or a state library. Both now have fine-grained ideas: Angular has signals, React has hooks and the compiler.",
        code: `// Angular: template + class
@Component({
  selector: 'app-counter',
  template: \`<button (click)="count.set(count() + 1)">{{ count() }}</button>\`,
})
export class Counter { count = signal(0) }

// React: JSX inside a function
// function Counter() {
//   const [count, setCount] = useState(0)
//   return <button onClick={() => setCount(count + 1)}>{count}</button>
// }`,
        output: `                Angular                    React
Type            Full framework             UI library
Language        TypeScript + templates     JS/TS + JSX
Reactivity      Signals (+ RxJS)           State + re-render
DI              Built in                   Context / libraries
Routing/Forms   Built in                   Third-party (e.g. React Router)
Learning curve  Steeper                    Gentler`,
      },
      {
        q: 'What is the Angular CLI and which commands do you use most?',
        level: 'Basics',
        a: "The Angular CLI (ng) creates projects, generates code and runs the build, dev server and tests for me. The commands I use daily are ng new, ng serve, ng generate (ng g c for a component, ng g s for a service) and ng build. I also use ng test and ng update, which runs migrations automatically when I upgrade Angular. It saves a lot of setup and keeps the project structure consistent.",
        code: `// Terminal
// npm install -g @angular/cli
// ng new shop            create a project
// ng serve               dev server on http://localhost:4200
// ng g c product-card    generate a component
// ng g s cart            generate a service
// ng build               production build into dist/
// ng test                run unit tests
// ng update @angular/core @angular/cli   upgrade + migrations`,
        output: `$ ng g c product-card
CREATE src/app/product-card/product-card.css (0 bytes)
CREATE src/app/product-card/product-card.html (28 bytes)
CREATE src/app/product-card/product-card.spec.ts (571 bytes)
CREATE src/app/product-card/product-card.ts (211 bytes)`,
      },
      {
        q: 'What does an Angular project structure look like?',
        level: 'Basics',
        a: "A new project has src/main.ts as the entry point, src/index.html as the host page and src/app for my code. Inside app I have the root component, app.config.ts for app-wide providers and app.routes.ts for routes. angular.json holds the build settings and tsconfig.json the TypeScript settings. In bigger apps I group code by feature folders, each with its own components, services and routes.",
        code: `// my-app/
// ├── angular.json          build/serve/test settings
// ├── package.json
// ├── tsconfig.json
// └── src/
//     ├── index.html        contains <app-root></app-root>
//     ├── main.ts           bootstraps the app
//     ├── styles.css        global styles
//     └── app/
//         ├── app.ts        root component
//         ├── app.html
//         ├── app.config.ts providers (router, http...)
//         └── app.routes.ts route list`,
        output: `ng serve builds main.ts and serves index.html:
<app-root> is replaced by the App component's template.`,
      },
      {
        q: 'How does an Angular app start (main.ts and bootstrapApplication)?',
        level: 'Basics',
        a: "The app starts in main.ts, where I call bootstrapApplication with the root component and an app config. Angular finds the root component's selector, like app-root, in index.html and renders it there. The config's providers array is where I register app-wide things like provideRouter and provideHttpClient. Older apps did the same with platformBrowserDynamic().bootstrapModule(AppModule).",
        code: `// main.ts
import { bootstrapApplication } from '@angular/platform-browser'
import { App } from './app/app'
import { appConfig } from './app/app.config'

bootstrapApplication(App, appConfig).catch((err) => console.error(err))

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()],
}`,
        output: `index.html:  <app-root></app-root>
Rendered:    <app-root> now contains the App component's template`,
      },
      {
        q: 'What is the difference between standalone components and NgModules?',
        level: 'Basics',
        a: "An NgModule used to group components and declare what they could use, and every component had to belong to one. A standalone component imports what it needs directly in its own imports array, so there's no module in between. Since Angular 19 components are standalone by default, so I don't even write standalone: true. I still read NgModule code in older projects, and I can mix both while migrating.",
        code: `// Standalone (default today)
@Component({
  selector: 'app-user-list',
  imports: [UserCard, DatePipe],
  template: \`<app-user-card /> {{ today | date }}\`,
})
export class UserList { today = new Date() }

// Old way: declared in an NgModule
@NgModule({
  declarations: [UserList, UserCard],
  imports: [CommonModule],
})
export class UsersModule {}`,
        output: `Standalone   imports its own dependencies, no module needed
NgModule     component must be declared in a module;
             the module's imports are shared by all its declarations`,
      },
    ],
  },
  {
    topic: 'Components & templates',
    items: [
      {
        q: 'What is a component and what goes in the @Component decorator?',
        level: 'Basics',
        a: "A component is a TypeScript class plus a template and styles that controls one piece of the screen. In the @Component decorator I set the selector (the HTML tag), the template or templateUrl, styles or styleUrl, and imports for other components, directives and pipes it uses. The class holds the state and methods the template binds to. I keep components small and move logic into services.",
        code: `import { Component, signal } from '@angular/core'

@Component({
  selector: 'app-product-card',
  imports: [],
  template: \`
    <h3>{{ name() }}</h3>
    <p>Price: {{ price() }}</p>
  \`,
  styles: \`h3 { color: navy; }\`,
})
export class ProductCard {
  name = signal('Keyboard')
  price = signal(49)
}`,
        output: `Rendered:
Keyboard        (navy heading)
Price: 49`,
      },
      {
        q: 'What are the lifecycle hooks and in what order do they run?',
        level: 'Intermediate',
        a: "Lifecycle hooks are methods Angular calls at key moments of a component's life. The order is constructor, ngOnChanges (when inputs change), ngOnInit, ngDoCheck, ngAfterContentInit/Checked, ngAfterViewInit/Checked, and finally ngOnDestroy. ngOnChanges gets a SimpleChanges object with the previous and current value of each changed input. The ones I use most are ngOnInit for setup, ngAfterViewInit when I need the DOM or a ViewChild, and ngOnDestroy for cleanup. In modern code I often use DestroyRef or takeUntilDestroyed instead of ngOnDestroy.",
        code: `@Component({ selector: 'app-child', template: \`{{ name }}\` })
export class Child implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  @Input() name = ''
  constructor() { console.log('constructor') }
  ngOnChanges() { console.log('ngOnChanges', this.name) }
  ngOnInit() { console.log('ngOnInit') }
  ngAfterViewInit() { console.log('ngAfterViewInit') }
  ngOnDestroy() { console.log('ngOnDestroy') }
}

// parent: @if (show) { <app-child [name]="'Ann'" /> }  then show = false`,
        output: `Console:
constructor
ngOnChanges Ann
ngOnInit
ngAfterViewInit
ngOnDestroy`,
      },
      {
        q: 'What is the difference between the constructor and ngOnInit?',
        level: 'Basics',
        a: "The constructor is plain TypeScript and runs when Angular creates the class, before inputs are set. ngOnInit runs once after Angular has set the first input values, so that's where I read inputs and start loading data. I keep the constructor for dependency injection and simple field setup only. With signal inputs, I can also react to inputs using computed() instead of ngOnInit.",
        code: `@Component({ selector: 'app-user', template: \`{{ id }}\` })
export class User implements OnInit {
  @Input() id = 0

  constructor() {
    console.log('constructor id =', this.id)
  }

  ngOnInit() {
    console.log('ngOnInit id =', this.id)
  }
}

// parent: <app-user [id]="7" />`,
        output: `Console:
constructor id = 0
ngOnInit id = 7`,
      },
      {
        q: 'What is view encapsulation?',
        level: 'Intermediate',
        a: "View encapsulation decides whether a component's styles leak out to the rest of the page. The default, Emulated, scopes styles by adding unique attributes like _ngcontent-abc-c1 to the elements and the CSS selectors. ShadowDom uses the browser's real Shadow DOM, and None makes the styles global. I keep the default almost always and put truly global styles in styles.css.",
        code: `@Component({
  selector: 'app-alert',
  template: \`<p>Saved!</p>\`,
  styles: \`p { color: green; }\`,
  // encapsulation: ViewEncapsulation.Emulated   (default)
  // encapsulation: ViewEncapsulation.ShadowDom
  // encapsulation: ViewEncapsulation.None       (global styles)
})
export class Alert {}`,
        output: `Rendered HTML (Emulated):
<app-alert _nghost-ng-c123>
  <p _ngcontent-ng-c123>Saved!</p>
</app-alert>

Generated CSS:
p[_ngcontent-ng-c123] { color: green; }
→ only this component's <p> turns green`,
      },
      {
        q: 'What is content projection (ng-content)?',
        level: 'Intermediate',
        a: "Content projection lets a parent pass HTML into a child component, like children in React. The child puts an <ng-content> where the content should appear. I can have multiple slots using the select attribute, for example a card with a header slot and a body slot. I use it for reusable wrappers like cards, modals and layout components.",
        code: `@Component({
  selector: 'app-card',
  template: \`
    <div class="card">
      <header><ng-content select="[card-title]" /></header>
      <ng-content />
    </div>
  \`,
})
export class Card {}

// usage
// <app-card>
//   <h3 card-title>Profile</h3>
//   <p>Ann, Developer</p>
// </app-card>`,
        output: `Rendered:
┌─────────────────┐
│ Profile         │  (header slot)
│ Ann, Developer  │  (default slot)
└─────────────────┘`,
      },
      {
        q: 'What are ViewChild and ContentChild (and the viewChild() signal query)?',
        level: 'Intermediate',
        a: "ViewChild gives me a reference to an element or child component in my own template, and ContentChild gives me one from projected content. With the decorator version the reference is ready in ngAfterViewInit (or ngAfterContentInit). In modern Angular I use the signal queries viewChild() and contentChild(), which return a signal, so I can read them in computed or effect. I use them for things like focusing an input or calling a child method.",
        code: `@Component({
  selector: 'app-search',
  template: \`<input #box placeholder="Search" />\`,
})
export class Search {
  box = viewChild.required<ElementRef<HTMLInputElement>>('box')

  constructor() {
    afterNextRender(() => {
      this.box().nativeElement.focus()
      console.log('focused:', this.box().nativeElement.placeholder)
    })
  }
}`,
        output: `Rendered: the Search input has the cursor in it
Console:
focused: Search`,
      },
    ],
  },
  {
    topic: 'Data binding',
    items: [
      {
        q: 'What are the types of data binding in Angular?',
        level: 'Basics',
        a: "There are four: interpolation {{ }} to show a value, property binding [prop] to set a DOM or component property, event binding (event) to listen to events, and two-way binding [( )] which combines the two. Data flows from class to template with interpolation and property binding, and from template to class with events. Two-way binding is just a shortcut for a property plus an event. I use property binding over interpolation for non-text values like disabled.",
        code: `@Component({
  selector: 'app-demo',
  template: \`
    <p>Hello {{ name() }}</p>
    <button [disabled]="saving()" (click)="save()">Save</button>
  \`,
})
export class Demo {
  name = signal('Ann')
  saving = signal(false)
  save() {
    this.saving.set(true)
    console.log('saving...')
  }
}`,
        output: `Rendered:
Hello Ann
[Save]

After clicking Save:
Console: saving...
[Save] button is now disabled`,
      },
      {
        q: 'How does two-way binding work ([(ngModel)] / banana in a box)?',
        level: 'Basics',
        a: "Two-way binding keeps a class value and an input in sync in both directions. The [( )] \"banana in a box\" syntax is shorthand for a property binding plus an event binding: [(x)] means [x] and (xChange). For form inputs I use [(ngModel)] after importing FormsModule, and I can bind it straight to a signal. For my own components I use model() to support [( )].",
        code: `import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-name',
  imports: [FormsModule],
  template: \`
    <input [(ngModel)]="name" />
    <p>Hi {{ name() }}</p>
  \`,
})
export class Name {
  name = signal('Ann')
}

// [(ngModel)]="name" is short for
// [ngModel]="name()" (ngModelChange)="name.set($event)"`,
        output: `Rendered:
[Ann      ]
Hi Ann

After typing "Bob" in the input:
[Bob      ]
Hi Bob`,
      },
      {
        q: 'What is a template reference variable?',
        level: 'Basics',
        a: "A template reference variable, written #name, gives me a handle to an element or component inside the template. I can pass it to a method or read its properties directly, without any class code. For example, I can read an input's value on a button click. If I need the reference in the class instead, I use viewChild().",
        code: `@Component({
  selector: 'app-add-todo',
  template: \`
    <input #title placeholder="New todo" />
    <button (click)="add(title.value); title.value = ''">Add</button>
  \`,
})
export class AddTodo {
  add(text: string) {
    console.log('added:', text)
  }
}`,
        output: `After typing "Buy milk" and clicking Add:
Console: added: Buy milk
(the input is cleared)`,
      },
    ],
  },
  {
    topic: 'Control flow & directives',
    items: [
      {
        q: 'What is the built-in control flow (@if, @for, @switch) and how is it different from *ngIf/*ngFor?',
        level: 'Basics',
        a: "Since Angular 17 templates have built-in blocks: @if/@else, @for and @switch, which replace the *ngIf, *ngFor and ngSwitch directives. They are part of the template syntax, so I don't need to import CommonModule, and they're easier to read and faster. @for also forces me to give a track expression, which avoids a common performance mistake. For new code I always use the blocks, and ng generate @angular/core:control-flow migrates old templates.",
        code: `@Component({
  selector: 'app-status',
  template: \`
    @if (user(); as u) {
      <p>Welcome {{ u.name }}</p>
    } @else {
      <p>Please log in</p>
    }

    @switch (role()) {
      @case ('admin') { <p>Admin panel</p> }
      @default { <p>User panel</p> }
    }
  \`,
})
export class Status {
  user = signal<{ name: string } | null>({ name: 'Ann' })
  role = signal('admin')
}

// Old: <p *ngIf="user; else login">Welcome {{ user.name }}</p>`,
        output: `Rendered:
Welcome Ann
Admin panel`,
      },
      {
        q: 'Why is track required in @for, and what do @empty and $index do?',
        level: 'Intermediate',
        a: "track tells Angular how to identify each item, usually by a unique id, so when the list changes it only adds, removes or moves the DOM nodes that really changed. Without it Angular could re-create every row, which is slow and loses input state. @empty shows content when the list is empty. Inside the loop I also get helpers like $index, $first, $last and $count.",
        code: `@Component({
  selector: 'app-users',
  template: \`
    <ul>
      @for (user of users(); track user.id; let i = $index) {
        <li>{{ i + 1 }}. {{ user.name }}</li>
      } @empty {
        <li>No users</li>
      }
    </ul>
  \`,
})
export class Users {
  users = signal([{ id: 1, name: 'Ann' }, { id: 2, name: 'Bob' }])
}`,
        output: `Rendered:
• 1. Ann
• 2. Bob

With users = []:
• No users`,
      },
      {
        q: 'What is the difference between attribute and structural directives?',
        level: 'Basics',
        a: "An attribute directive changes the look or behavior of an existing element, like ngClass, ngStyle or my own highlight directive. A structural directive changes the DOM structure by adding or removing elements, like *ngIf and *ngFor, and they're written with a * prefix. A component is technically a directive with a template. Today most structural work is done with @if and @for, so I mainly write attribute directives.",
        code: `<!-- attribute directive: same element, different style -->
<p [ngClass]="{ active: isActive }">Status</p>
<p appHighlight>Hover me</p>

<!-- structural directive: adds/removes the element -->
<p *ngIf="isLoggedIn">Welcome back</p>
<li *ngFor="let item of items">{{ item }}</li>`,
        output: `Attribute   changes an element that already exists (class, style, events)
Structural  creates or removes elements (uses * / <ng-template>)`,
      },
      {
        q: 'How do you create a custom attribute directive?',
        level: 'Intermediate',
        a: "I create a class with @Directive and an attribute selector like [appHighlight]. I use the host property to listen to events and bind to classes or styles on the element it sits on, and input() to accept a value. Then I import the directive in the component that uses it. Common real examples are highlight, autofocus, click-outside and permission directives.",
        code: `@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'on.set(true)',
    '(mouseleave)': 'on.set(false)',
    '[style.backgroundColor]': "on() ? color() : ''",
  },
})
export class Highlight {
  color = input('yellow', { alias: 'appHighlight' })
  on = signal(false)
}

// <p appHighlight="lightblue">Hover me</p>`,
        output: `Rendered:
Hover me                 (no background)

While the mouse is over it:
Hover me                 (light blue background)`,
      },
      {
        q: 'How do you use ngClass and ngStyle (and class/style bindings)?',
        level: 'Basics',
        a: "For one class or style I use [class.name] and [style.prop] bindings, which need no import. For several at once I can bind an object to [class] or [style], or use the older ngClass and ngStyle directives. The object keys are class names and the values are true or false. I prefer plain [class] bindings now because they're simpler and built in.",
        code: `@Component({
  selector: 'app-badge',
  template: \`
    <span [class.active]="active()">One class</span>
    <span [class]="{ active: active(), big: big() }">Many classes</span>
    <span [style.color]="color()" [style.font-size.px]="16">Styled</span>
  \`,
})
export class Badge {
  active = signal(true)
  big = signal(false)
  color = signal('red')
}`,
        output: `Rendered HTML:
<span class="active">One class</span>
<span class="active">Many classes</span>
<span style="color: red; font-size: 16px;">Styled</span>`,
      },
    ],
  },
  {
    topic: 'Component communication',
    items: [
      {
        q: 'How do you pass data from parent to child with @Input / input()?',
        level: 'Basics',
        a: "The child declares an input and the parent binds to it with property binding, like [user]=\"currentUser\". In modern Angular I use the input() function, which returns a read-only signal, and input.required() when the parent must pass it. The older @Input() decorator still works the same way. Because inputs are signals now, I can derive values from them with computed().",
        code: `@Component({
  selector: 'app-greeting',
  template: \`<p>{{ message() }}</p>\`,
})
export class Greeting {
  name = input.required<string>()
  excited = input(false)
  message = computed(() => 'Hello ' + this.name() + (this.excited() ? '!' : '.'))
}

// parent template
// <app-greeting name="Ann" />
// <app-greeting name="Bob" [excited]="true" />`,
        output: `Rendered:
Hello Ann.
Hello Bob!`,
      },
      {
        q: 'How does a child send data to the parent with @Output / output()?',
        level: 'Basics',
        a: "The child declares an output and emits a value, and the parent listens with event binding, like (deleted)=\"onDelete($event)\". In modern Angular I use output<T>() and call emit(); the older @Output() with EventEmitter works the same. $event in the parent is whatever the child emitted. This keeps the child reusable because it just announces what happened and the parent decides what to do.",
        code: `@Component({
  selector: 'app-todo-item',
  template: \`{{ title() }} <button (click)="deleted.emit(id())">x</button>\`,
})
export class TodoItem {
  id = input.required<number>()
  title = input.required<string>()
  deleted = output<number>()
}

// parent
// <app-todo-item [id]="1" title="Buy milk" (deleted)="remove($event)" />
// remove(id: number) { console.log('remove todo', id) }`,
        output: `Rendered:
Buy milk [x]

After clicking x:
Console: remove todo 1`,
      },
      {
        q: 'What is model() and how do you support two-way binding on your own component?',
        level: 'Intermediate',
        a: "model() creates a writable signal input, so the child can read it and also update it with set(). When the child updates it, Angular emits a matching valueChange event, which is what makes [(value)] work from the parent. Before model() I had to write an @Input value plus an @Output valueChange by hand. I use it for custom controls like toggles, ratings and steppers.",
        code: `@Component({
  selector: 'app-stepper',
  template: \`
    <button (click)="value.set(value() - 1)">-</button>
    {{ value() }}
    <button (click)="value.set(value() + 1)">+</button>
  \`,
})
export class Stepper {
  value = model(0)
}

// parent: qty = signal(1)
// <app-stepper [(value)]="qty" />  <p>Parent sees: {{ qty() }}</p>`,
        output: `Rendered:
[-] 1 [+]
Parent sees: 1

After clicking + twice:
[-] 3 [+]
Parent sees: 3`,
      },
      {
        q: 'How do sibling or unrelated components communicate?',
        level: 'Intermediate',
        a: "Siblings don't talk directly, so I put the shared state in a service that both inject. The service holds a signal (or a BehaviorSubject in older code) and exposes methods to change it. One component calls the method and the other just reads the signal, so it updates automatically. For a simple parent with two children, lifting the state to the parent and using inputs and outputs also works.",
        code: `@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<string[]>([])
  add(item: string) { this.items.update((list) => [...list, item]) }
}

@Component({ selector: 'app-product', template: \`<button (click)="cart.add('Pen')">Add Pen</button>\` })
export class Product { cart = inject(CartService) }

@Component({ selector: 'app-cart-badge', template: \`Cart ({{ cart.items().length }})\` })
export class CartBadge { cart = inject(CartService) }`,
        output: `Rendered:
[Add Pen]   Cart (0)

After clicking Add Pen twice:
[Add Pen]   Cart (2)`,
      },
    ],
  },
]
