import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'

export interface Post { id: number; title: string }

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient)
  getPosts() {
    return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts')
  }
}
