import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { PostService } from './post.service'

@Component({
  selector: 'app-post-list',
  template: `@for (post of posts(); track post.id) { <li>{{ post.title }}</li> }`,
})
export class PostList {
  posts = toSignal(inject(PostService).getPosts(), { initialValue: [] })
}
