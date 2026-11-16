import { Component, signal } from '@angular/core'

@Component({
  selector: 'app-counter',
  template: `<button (click)="count.set(count() + 1)">Count: {{ count() }}</button>`,
})
export class Counter {
  count = signal(0)
}
