import { Component, input, output } from '@angular/core'

@Component({
  selector: 'app-greeting',
  template: `<h1>Hello {{ name() }}</h1> <button (click)="liked.emit(name())">Like</button>`,
})
export class Greeting {
  name = input.required<string>()
  liked = output<string>()
}
