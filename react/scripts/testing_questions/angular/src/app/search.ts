import { Injectable, signal } from '@angular/core'
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs'

// Emits the search text only after the user stops typing for 300 ms
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
